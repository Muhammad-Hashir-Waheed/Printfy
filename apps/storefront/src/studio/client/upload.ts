'use client'

import { ALLOWED_EXTENSIONS, MAX_UPLOAD_MB, PREVIEWABLE_IMAGE } from '@/studio/types'

export type UploadedDesign = {
   id: string
   token: string
   name: string
   size: number
   ext: string
   type: string
   width?: number
   height?: number
   hasPreview: boolean
   /** Server URL for the preview image (works after a reload) */
   previewUrl: string | null
   /** Server URL for the original file */
   originalUrl: string
   /** Tiny JPEG data URL for the cart (≈5 KB) */
   thumb?: string
}

type Target = { url: string; form: boolean }

export const ACCEPT = ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(',') + ',image/*,application/pdf'

export const extOf = (name: string) => (name.split('.').pop() ?? '').toLowerCase()
export const isPreviewable = (ext: string) => (PREVIEWABLE_IMAGE as readonly string[]).includes(ext)

export function validateFile(file: File): string | null {
   const ext = extOf(file.name)
   if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) {
      return `.${ext || '?'} isn't supported. Use PDF, AI, EPS, SVG, PSD, PNG, JPG, TIFF or ZIP.`
   }
   if (file.size > MAX_UPLOAD_MB * 1024 * 1024) return `Files up to ${MAX_UPLOAD_MB} MB please.`
   if (file.size === 0) return 'That file looks empty.'
   return null
}

export function formatBytes(bytes: number) {
   if (bytes < 1024) return `${bytes} B`
   if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
   return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function loadImage(src: string) {
   return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Could not read the image'))
      img.src = src
   })
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
   return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality))
}

/** Browser-side preview: a ≤1600px WebP (PNG fallback) keeping transparency, plus a tiny thumb. */
export async function makePreview(file: File) {
   const ext = extOf(file.name)
   if (!isPreviewable(ext)) return null
   const url = URL.createObjectURL(file)
   try {
      const img = await loadImage(url)
      let w = img.naturalWidth || 1200
      let h = img.naturalHeight || 1200
      const width = w
      const height = h
      const scale = Math.min(1, 1600 / Math.max(w, h))
      w = Math.max(1, Math.round(w * scale))
      h = Math.max(1, Math.round(h * scale))
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) return null
      ctx.drawImage(img, 0, 0, w, h)
      let blob = await canvasToBlob(canvas, 'image/webp', 0.86)
      if (!blob || blob.type !== 'image/webp') blob = await canvasToBlob(canvas, 'image/png', 1)

      const t = document.createElement('canvas')
      const ts = Math.min(1, 180 / Math.max(w, h))
      t.width = Math.round(w * ts)
      t.height = Math.round(h * ts)
      const tctx = t.getContext('2d')!
      tctx.fillStyle = '#fff'
      tctx.fillRect(0, 0, t.width, t.height)
      tctx.drawImage(canvas, 0, 0, t.width, t.height)

      return {
         blob,
         localUrl: blob ? URL.createObjectURL(blob) : url,
         thumb: t.toDataURL('image/jpeg', 0.72),
         width: ext === 'svg' ? undefined : width,
         height: ext === 'svg' ? undefined : height,
      }
   } catch {
      return null
   } finally {
      URL.revokeObjectURL(url)
   }
}

function send(target: Target, body: Blob, onProgress?: (fraction: number) => void) {
   return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('PUT', target.url)
      xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(e.loaded / e.total)
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(readError(xhr) || 'Upload failed')))
      xhr.onerror = () => reject(new Error('Network error — check your connection and try again.'))
      if (target.form) {
         const fd = new FormData()
         fd.append('cacheControl', '3600')
         fd.append('', body)
         xhr.send(fd)
      } else {
         xhr.setRequestHeader('Content-Type', 'application/octet-stream')
         xhr.send(body)
      }
   })
}

function readError(xhr: XMLHttpRequest) {
   try {
      return JSON.parse(xhr.responseText)?.error as string
   } catch {
      return ''
   }
}

async function json<T>(res: Response): Promise<T> {
   const data = await res.json().catch(() => ({}))
   if (!res.ok) throw new Error((data as { error?: string }).error || 'Something went wrong')
   return data as T
}

/**
 * Uploads a design: preview → register → bytes (with progress) → confirm.
 * `preview` can be passed in if it was already generated for an instant on-screen preview.
 */
export async function uploadDesign(
   file: File,
   opts: { onProgress?: (fraction: number) => void; preview?: Awaited<ReturnType<typeof makePreview>> } = {}
): Promise<UploadedDesign> {
   const problem = validateFile(file)
   if (problem) throw new Error(problem)

   const preview = opts.preview === undefined ? await makePreview(file) : opts.preview
   const reg = await json<{ id: string; token: string; original: Target; preview: Target | null }>(
      await fetch('/api/uploads', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ name: file.name, size: file.size, type: file.type }),
      })
   )

   const previewShare = preview?.blob && reg.preview ? 0.1 : 0
   await send(reg.original, file, (f) => opts.onProgress?.(f * (1 - previewShare)))
   let hasPreview = false
   if (preview?.blob && reg.preview) {
      try {
         await send(reg.preview, preview.blob)
         hasPreview = true
      } catch {
         // the original is what matters — continue without a server preview
      }
   }
   opts.onProgress?.(1)

   const done = await json<{ file: { hasPreview: boolean; width?: number; height?: number } }>(
      await fetch(`/api/uploads/${reg.id}`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ token: reg.token, hasPreview, width: preview?.width, height: preview?.height }),
      })
   )

   const base = `/api/files/${reg.id}`
   return {
      id: reg.id,
      token: reg.token,
      name: file.name,
      size: file.size,
      ext: extOf(file.name),
      type: file.type,
      width: done.file.width,
      height: done.file.height,
      hasPreview: done.file.hasPreview,
      previewUrl: done.file.hasPreview ? `${base}?part=preview&t=${encodeURIComponent(reg.token)}` : null,
      originalUrl: `${base}?part=original&t=${encodeURIComponent(reg.token)}`,
      thumb: preview?.thumb,
   }
}
