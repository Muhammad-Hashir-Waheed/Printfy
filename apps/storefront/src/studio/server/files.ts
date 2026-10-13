import { ALLOWED_EXTENSIONS, MAX_UPLOAD_MB, PREVIEWABLE_IMAGE, type StoredFile } from '@/studio/types'

import { requireStorage } from './storage'
import { newId, newToken, safeEqual } from './util'

/**
 * Uploaded design files.
 *
 *   uploads/{id}/meta.json      → StoredFile (+ status)
 *   uploads/{id}/original.{ext} → the customer's file, untouched
 *   uploads/{id}/preview.webp   → browser-generated web preview (images / SVG only)
 */

type FileRecord = StoredFile & { status: 'pending' | 'ready' }

export const MAX_BYTES = MAX_UPLOAD_MB * 1024 * 1024
export const MAX_PREVIEW_BYTES = 8 * 1024 * 1024

const metaKey = (id: string) => `uploads/${id}/meta.json`
export const originalKey = (f: Pick<StoredFile, 'id' | 'ext'>) => `uploads/${f.id}/original.${f.ext}`
export const previewKey = (id: string) => `uploads/${id}/preview.webp`

const ID_RE = /^[0-9a-f-]{36}$/

export function cleanName(name: string) {
   const base = name.split(/[\\/]/).pop() ?? 'design'
   return base.replace(/[^\w.\- ()]+/g, '_').slice(-120) || 'design'
}

export function extensionOf(name: string) {
   return (name.split('.').pop() ?? '').toLowerCase()
}

export async function readFileRecord(id: string): Promise<FileRecord | null> {
   if (!ID_RE.test(id)) return null
   const obj = await requireStorage().get(metaKey(id))
   if (!obj) return null
   try {
      return JSON.parse(obj.data.toString('utf8')) as FileRecord
   } catch {
      return null
   }
}

async function writeFileRecord(record: FileRecord) {
   await requireStorage().put(metaKey(record.id), JSON.stringify(record), 'application/json')
}

export function publicFile(record: FileRecord): StoredFile {
   const { status: _status, ...file } = record
   return file
}

/** Step 1 — register an upload and get where to send the bytes. */
export async function createUpload(input: { name: string; size: number; type?: string }) {
   const name = cleanName(input.name)
   const ext = extensionOf(name)
   if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) {
      throw new UploadError(`.${ext || '?'} files aren't supported. Use PDF, AI, EPS, SVG, PSD, PNG, JPG, TIFF or ZIP.`)
   }
   if (!Number.isFinite(input.size) || input.size <= 0) throw new UploadError('That file looks empty.')
   if (input.size > MAX_BYTES) throw new UploadError(`Files up to ${MAX_UPLOAD_MB} MB please.`)

   const record: FileRecord = {
      id: newId(),
      name,
      size: Math.round(input.size),
      type: (input.type || '').slice(0, 100),
      ext,
      hasPreview: false,
      uploadedAt: new Date().toISOString(),
      token: newToken(),
      status: 'pending',
   }
   await writeFileRecord(record)

   const storage = requireStorage()
   const direct = await storage.uploadTarget(originalKey(record))
   const directPreview = (PREVIEWABLE_IMAGE as readonly string[]).includes(ext)
      ? await storage.uploadTarget(previewKey(record.id))
      : null

   const local = (part: 'original' | 'preview') =>
      `/api/uploads/${record.id}?part=${part}&t=${encodeURIComponent(record.token)}`

   return {
      id: record.id,
      token: record.token,
      original: direct ?? { url: local('original'), form: false },
      preview: (PREVIEWABLE_IMAGE as readonly string[]).includes(ext)
         ? directPreview ?? { url: local('preview'), form: false }
         : null,
   }
}

/** Step 2 (local storage only) — receive the bytes through our API. */
export async function receivePart(id: string, token: string, part: 'original' | 'preview', body: Buffer) {
   const record = await readFileRecord(id)
   if (!record || !safeEqual(record.token, token)) throw new UploadError('Upload link expired.', 403)
   if (record.status === 'ready' && part === 'original') throw new UploadError('File already uploaded.', 409)
   if (part === 'original') {
      if (body.length === 0) throw new UploadError('That file looks empty.')
      if (body.length > MAX_BYTES) throw new UploadError(`Files up to ${MAX_UPLOAD_MB} MB please.`, 413)
      await requireStorage().put(originalKey(record), body, 'application/octet-stream')
   } else {
      if (body.length > MAX_PREVIEW_BYTES) throw new UploadError('Preview too large.', 413)
      if (!isImage(body)) throw new UploadError('Invalid preview image.')
      await requireStorage().put(previewKey(id), body, 'image/webp')
   }
}

/** Step 3 — confirm the bytes arrived and store preview details. */
export async function completeUpload(
   id: string,
   token: string,
   info: { hasPreview?: boolean; width?: number; height?: number }
) {
   const record = await readFileRecord(id)
   if (!record || !safeEqual(record.token, token)) throw new UploadError('Upload link expired.', 403)
   const storage = requireStorage()
   if (!(await storage.exists(originalKey(record)))) throw new UploadError('The file did not finish uploading.', 409)
   const hasPreview = Boolean(info.hasPreview) && (await storage.exists(previewKey(id)))
   const next: FileRecord = {
      ...record,
      status: 'ready',
      hasPreview,
      width: clampDim(info.width),
      height: clampDim(info.height),
   }
   await writeFileRecord(next)
   return publicFile(next)
}

/** Files referenced by a submission must exist, be complete and be presented with their token. */
export async function claimFiles(refs: Array<{ id?: string; token?: string }>) {
   const files: Record<string, StoredFile> = {}
   for (const ref of refs) {
      if (!ref.id || !ref.token) throw new UploadError('One of your files is missing — please upload it again.')
      if (files[ref.id]) continue
      const record = await readFileRecord(ref.id)
      if (!record || record.status !== 'ready' || !safeEqual(record.token, ref.token)) {
         throw new UploadError('One of your files did not upload correctly — please upload it again.')
      }
      files[record.id] = publicFile(record)
   }
   return files
}

function clampDim(v: unknown) {
   const n = Math.round(Number(v))
   return Number.isFinite(n) && n > 0 && n < 100000 ? n : undefined
}

/** Magic-byte check for the preview (webp / png / jpeg). */
function isImage(buf: Buffer) {
   if (buf.length < 12) return false
   const webp = buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP'
   const png = buf[0] === 0x89 && buf.subarray(1, 4).toString('ascii') === 'PNG'
   const jpg = buf[0] === 0xff && buf[1] === 0xd8
   return webp || png || jpg
}

export class UploadError extends Error {
   constructor(message: string, public status = 400) {
      super(message)
   }
}
