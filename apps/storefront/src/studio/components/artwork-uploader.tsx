'use client'

import type { CatalogImage as CatalogImageData } from '@/catalog'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import {
   ACCEPT,
   extOf,
   formatBytes,
   isPreviewable,
   makePreview,
   uploadDesign,
   validateFile,
   type UploadedDesign,
} from '@/studio/client/upload'
import { MAX_UPLOAD_MB } from '@/studio/types'
import { AlertCircle, CheckCircle2, Eye, FileText, FileUp, Loader2, RefreshCw, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { DesignMockup, PrintChecks } from './design-mockup'

type Slot = {
   key: string
   file: File
   name: string
   ext: string
   size: number
   progress: number
   status: 'uploading' | 'ready' | 'error'
   error?: string
   /** Instant local preview (object URL) shown before the upload finishes */
   localUrl?: string
   localPdf?: string
   uploaded?: UploadedDesign
}

type ProductContext = { name: string; image: CatalogImageData | null; accent: string; dark?: boolean }

/**
 * Drag-and-drop artwork uploader with live progress, instant preview and a full
 * preview dialog (design on the product + pre-press checks).
 */
export function ArtworkUploader({
   product,
   multiple = false,
   value,
   onChange,
   onBusyChange,
   compact,
}: {
   product?: ProductContext
   multiple?: boolean
   value: UploadedDesign[]
   onChange: (files: UploadedDesign[]) => void
   onBusyChange?: (busy: boolean) => void
   compact?: boolean
}) {
   const [slots, setSlots] = useState<Slot[]>([])
   const [dragging, setDragging] = useState(false)
   const [previewKey, setPreviewKey] = useState<string | null>(null)
   const inputRef = useRef<HTMLInputElement>(null)
   const valueRef = useRef(value)
   valueRef.current = value

   const busy = slots.some((s) => s.status === 'uploading')
   useEffect(() => onBusyChange?.(busy), [busy, onBusyChange])

   // Revoke object URLs on unmount
   useEffect(
      () => () => {
         slots.forEach((s) => {
            if (s.localUrl) URL.revokeObjectURL(s.localUrl)
            if (s.localPdf) URL.revokeObjectURL(s.localPdf)
         })
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
   )

   const patch = (key: string, update: Partial<Slot>) =>
      setSlots((all) => all.map((s) => (s.key === key ? { ...s, ...update } : s)))

   const start = useCallback(
      async (file: File, replaceKey?: string) => {
         const problem = validateFile(file)
         const key = replaceKey ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
         const ext = extOf(file.name)
         const base: Slot = { key, file, name: file.name, ext, size: file.size, progress: 0, status: 'uploading' }

         if (problem) {
            setSlots((all) => [...all.filter((s) => s.key !== key && (multiple || false)), { ...base, status: 'error', error: problem }])
            return
         }

         const preview = isPreviewable(ext) ? await makePreview(file) : null
         const slot: Slot = {
            ...base,
            localUrl: preview?.localUrl,
            localPdf: ext === 'pdf' ? URL.createObjectURL(file) : undefined,
         }
         setSlots((all) => (multiple ? [...all.filter((s) => s.key !== key), slot] : [slot]))
         if (!multiple) onChange([])

         try {
            const uploaded = await uploadDesign(file, { preview, onProgress: (p) => patch(key, { progress: p }) })
            patch(key, { status: 'ready', progress: 1, uploaded })
            const rest = multiple ? valueRef.current.filter((v) => v.id !== uploaded.id) : []
            onChange([...rest, uploaded])
            if (!multiple && !compact) setPreviewKey(key)
         } catch (error) {
            patch(key, { status: 'error', error: error instanceof Error ? error.message : 'Upload failed' })
         }
      },
      [multiple, onChange, compact]
   )

   function pick(files: FileList | null | undefined) {
      if (!files?.length) return
      const list = multiple ? Array.from(files).slice(0, 10) : [files[0]]
      list.forEach((f) => start(f))
   }

   function remove(key: string) {
      const slot = slots.find((s) => s.key === key)
      setSlots((all) => all.filter((s) => s.key !== key))
      if (slot?.uploaded) onChange(valueRef.current.filter((v) => v.id !== slot.uploaded!.id))
   }

   const active = slots.find((s) => s.key === previewKey)
   const showDrop = multiple || slots.length === 0

   return (
      <div>
         {showDrop ? (
            <div
               onDragOver={(e) => {
                  e.preventDefault()
                  setDragging(true)
               }}
               onDragLeave={() => setDragging(false)}
               onDrop={(e) => {
                  e.preventDefault()
                  setDragging(false)
                  pick(e.dataTransfer.files)
               }}
               className={cn(
                  'relative overflow-hidden rounded-2xl border-2 border-dashed transition',
                  dragging ? 'scale-[1.01] border-primary bg-primary/5' : 'border-input bg-white/70 hover:border-ink/40'
               )}
            >
               <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className={cn('flex w-full flex-col items-center gap-2 text-center', compact ? 'py-4' : 'py-7')}
               >
                  <span className={cn('grid h-12 w-12 place-items-center rounded-2xl bg-ink text-white transition', dragging && 'scale-110 bg-primary')}>
                     <FileUp className="h-5 w-5" />
                  </span>
                  <span className="text-sm">
                     <span className="font-semibold text-primary underline underline-offset-2">Choose {multiple ? 'files' : 'a file'}</span>{' '}
                     or drag {multiple ? 'them' : 'it'} here
                  </span>
                  <span className="text-xs text-muted-foreground">
                     PDF, AI, EPS, SVG, PSD, PNG, JPG, TIFF or ZIP · up to {MAX_UPLOAD_MB} MB
                  </span>
               </button>
               <input
                  ref={inputRef}
                  type="file"
                  accept={ACCEPT}
                  multiple={multiple}
                  className="sr-only"
                  onChange={(e) => {
                     pick(e.target.files)
                     e.target.value = ''
                  }}
               />
            </div>
         ) : null}

         {slots.length ? (
            <ul className={cn('space-y-2', showDrop && 'mt-3')}>
               {slots.map((s) => (
                  <li
                     key={s.key}
                     className={cn(
                        'flex items-center gap-3 rounded-2xl border bg-white p-2.5 transition',
                        s.status === 'error' && 'border-red-200 bg-red-50/60'
                     )}
                  >
                     <button
                        type="button"
                        onClick={() => s.status !== 'error' && setPreviewKey(s.key)}
                        className="group relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border bg-[repeating-conic-gradient(#f1f1f1_0_25%,#fff_0_50%)] bg-[length:12px_12px]"
                        aria-label={`Preview ${s.name}`}
                     >
                        {s.localUrl ? (
                           // eslint-disable-next-line @next/next/no-img-element
                           <img src={s.localUrl} alt="" className="h-full w-full object-contain" />
                        ) : (
                           <span className="flex flex-col items-center">
                              <FileText className="h-6 w-6 text-muted-foreground" />
                              <span className="mt-0.5 text-[10px] font-bold uppercase text-muted-foreground">{s.ext}</span>
                           </span>
                        )}
                        {s.status === 'ready' ? (
                           <span className="absolute inset-0 grid place-items-center bg-ink/60 text-white opacity-0 transition group-hover:opacity-100">
                              <Eye className="h-5 w-5" />
                           </span>
                        ) : null}
                     </button>

                     <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{s.name}</p>
                        {s.status === 'uploading' ? (
                           <>
                              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                                 <div className="h-full rounded-full bg-primary transition-[width] duration-200" style={{ width: `${Math.round(s.progress * 100)}%` }} />
                              </div>
                              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                 <Loader2 className="h-3 w-3 animate-spin" /> Uploading… {Math.round(s.progress * 100)}% of {formatBytes(s.size)}
                              </p>
                           </>
                        ) : s.status === 'ready' ? (
                           <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-emerald-700">
                              <span className="inline-flex items-center gap-1">
                                 <CheckCircle2 className="h-3.5 w-3.5" /> Uploaded securely
                              </span>
                              <span className="text-muted-foreground">
                                 {formatBytes(s.size)}
                                 {s.uploaded?.width ? ` · ${s.uploaded.width}×${s.uploaded.height}px` : ''}
                              </span>
                              <button type="button" onClick={() => setPreviewKey(s.key)} className="font-semibold text-ink underline underline-offset-2">
                                 Preview
                              </button>
                           </p>
                        ) : (
                           <p className="mt-0.5 flex items-center gap-1.5 text-xs text-red-700">
                              <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {s.error}
                           </p>
                        )}
                     </div>

                     <div className="flex shrink-0 items-center gap-1">
                        {s.status === 'error' && validateFile(s.file) === null ? (
                           <button type="button" onClick={() => start(s.file, s.key)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retry upload">
                              <RefreshCw className="h-4 w-4" />
                           </button>
                        ) : null}
                        {!multiple && s.status !== 'uploading' ? (
                           <button
                              type="button"
                              onClick={() => inputRef.current?.click()}
                              className="hidden rounded-full border px-3 py-1.5 text-xs font-semibold hover:border-ink sm:inline-block"
                           >
                              Replace
                           </button>
                        ) : null}
                        <button type="button" onClick={() => remove(s.key)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Remove file">
                           <X className="h-4 w-4" />
                        </button>
                     </div>
                  </li>
               ))}
            </ul>
         ) : null}
         {!showDrop ? (
            <input
               ref={inputRef}
               type="file"
               accept={ACCEPT}
               className="sr-only"
               onChange={(e) => {
                  pick(e.target.files)
                  e.target.value = ''
               }}
            />
         ) : null}

         <Dialog open={Boolean(active)} onOpenChange={(o) => !o && setPreviewKey(null)}>
            <DialogContent className="max-h-[92dvh] max-w-5xl overflow-y-auto rounded-3xl p-0 sm:rounded-3xl">
               {active ? (
                  <div className="grid gap-0 lg:grid-cols-[1.6fr_1fr]">
                     <div className="p-4 sm:p-6">
                        <DialogTitle className="mb-4 font-display text-2xl font-bold tracking-tight">Preview your design</DialogTitle>
                        <DesignMockup
                           imageUrl={active.localUrl ?? active.uploaded?.previewUrl}
                           pdfUrl={active.localPdf}
                           fileName={active.name}
                           ext={active.ext}
                           productImage={product?.image}
                           productName={product?.name}
                           accent={product?.accent}
                           dark={product?.dark}
                        />
                     </div>
                     <aside className="border-t bg-muted/40 p-5 sm:p-6 lg:border-l lg:border-t-0">
                        <p className="eyebrow text-muted-foreground">File</p>
                        <p className="mt-1 break-all font-semibold">{active.name}</p>
                        <p className="text-sm text-muted-foreground">
                           {formatBytes(active.size)} · .{active.ext.toUpperCase()}
                        </p>
                        <div className="my-5 border-t" />
                        <p className="eyebrow mb-3 text-muted-foreground">Print check</p>
                        <PrintChecks ext={active.ext} width={active.uploaded?.width} height={active.uploaded?.height} size={active.size} />
                        <p className="mt-5 rounded-2xl bg-white p-3 text-xs leading-relaxed text-muted-foreground ring-1 ring-black/5">
                           This mockup is illustrative. Our designers check placement, bleed and colours, then send you a proof
                           before anything is printed.
                        </p>
                        <div className="mt-5 flex gap-2">
                           <button
                              type="button"
                              onClick={() => setPreviewKey(null)}
                              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white"
                           >
                              <CheckCircle2 className="h-4 w-4" /> Looks good
                           </button>
                           {!multiple ? (
                              <button
                                 type="button"
                                 onClick={() => {
                                    setPreviewKey(null)
                                    inputRef.current?.click()
                                 }}
                                 className="inline-flex h-11 items-center rounded-full border bg-white px-4 text-sm font-semibold hover:border-ink"
                              >
                                 Replace
                              </button>
                           ) : null}
                        </div>
                     </aside>
                  </div>
               ) : null}
            </DialogContent>
         </Dialog>
      </div>
   )
}
