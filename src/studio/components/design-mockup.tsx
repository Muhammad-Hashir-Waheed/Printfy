'use client'

import type { CatalogImage as CatalogImageData } from '@/catalog'
import { CatalogImage } from '@/components/store/catalog-image'
import { cn } from '@/lib/utils'
import { AlertTriangle, CheckCircle2, FileText, Maximize2, Minus, Move, Plus, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type View = 'product' | 'artwork'
const BACKGROUNDS = [
   { id: 'checker', label: 'Transparent' },
   { id: 'white', label: 'White' },
   { id: 'kraft', label: 'Kraft' },
   { id: 'black', label: 'Black' },
] as const

const bgStyle: Record<(typeof BACKGROUNDS)[number]['id'], React.CSSProperties> = {
   checker: {
      backgroundColor: '#fff',
      backgroundImage:
         'linear-gradient(45deg,#ececec 25%,transparent 25%),linear-gradient(-45deg,#ececec 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ececec 75%),linear-gradient(-45deg,transparent 75%,#ececec 75%)',
      backgroundSize: '22px 22px',
      backgroundPosition: '0 0,0 11px,11px -11px,-11px 0',
   },
   white: { backgroundColor: '#fff' },
   kraft: { backgroundColor: '#c8a27a' },
   black: { backgroundColor: '#141414' },
}

/**
 * Shows an uploaded design two ways:
 *  - "On product": overlaid on the product photo, draggable + resizable, with a print blend
 *  - "Artwork": flat on a transparency checkerboard / colour swatches, zoomable
 * Non-image files (PDF) render in a viewer; AI/EPS/PSD show a file card.
 */
export function DesignMockup({
   imageUrl,
   pdfUrl,
   fileName,
   ext,
   productImage,
   productName,
   accent = '#D42F25',
   dark,
   className,
   compact,
}: {
   imageUrl?: string | null
   pdfUrl?: string | null
   fileName: string
   ext: string
   productImage?: CatalogImageData | null
   productName?: string
   accent?: string
   dark?: boolean
   className?: string
   compact?: boolean
}) {
   const canMockup = Boolean(imageUrl && productName)
   const [view, setView] = useState<View>(canMockup ? 'product' : 'artwork')
   const [scale, setScale] = useState(42)
   const [pos, setPos] = useState({ x: 50, y: 50 })
   const [blend, setBlend] = useState(true)
   const [bg, setBg] = useState<(typeof BACKGROUNDS)[number]['id']>('checker')
   const [zoom, setZoom] = useState(1)
   const stage = useRef<HTMLDivElement>(null)
   const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null)

   useEffect(() => setView(canMockup ? 'product' : 'artwork'), [canMockup])

   const onPointerDown = (e: React.PointerEvent) => {
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y }
   }
   const onPointerMove = (e: React.PointerEvent) => {
      if (!drag.current || !stage.current) return
      const r = stage.current.getBoundingClientRect()
      const nx = drag.current.px + ((e.clientX - drag.current.x) / r.width) * 100
      const ny = drag.current.py + ((e.clientY - drag.current.y) / r.height) * 100
      setPos({ x: Math.min(95, Math.max(5, nx)), y: Math.min(95, Math.max(5, ny)) })
   }
   const onPointerUp = () => (drag.current = null)

   return (
      <div className={cn('overflow-hidden rounded-3xl border bg-white', className)}>
         <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2">
            <div className="flex rounded-full bg-muted p-1 text-[13px] font-semibold">
               {canMockup ? (
                  <button
                     type="button"
                     onClick={() => setView('product')}
                     className={cn('rounded-full px-3 py-1.5 transition', view === 'product' ? 'bg-white shadow-sm' : 'text-muted-foreground')}
                  >
                     On product
                  </button>
               ) : null}
               <button
                  type="button"
                  onClick={() => setView('artwork')}
                  className={cn('rounded-full px-3 py-1.5 transition', view === 'artwork' ? 'bg-white shadow-sm' : 'text-muted-foreground')}
               >
                  Artwork
               </button>
            </div>

            {view === 'product' ? (
               <div className="ml-auto flex items-center gap-2 text-xs">
                  <label className="hidden items-center gap-2 sm:flex">
                     <span className="text-muted-foreground">Size</span>
                     <input type="range" min={15} max={90} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-24 accent-[#D42F25]" />
                  </label>
                  <button
                     type="button"
                     onClick={() => setBlend((b) => !b)}
                     className={cn('rounded-full border px-2.5 py-1 font-semibold', blend ? 'border-ink bg-ink text-white' : '')}
                     title="Blend the artwork into the material like ink"
                  >
                     Print effect
                  </button>
                  <button
                     type="button"
                     onClick={() => {
                        setScale(42)
                        setPos({ x: 50, y: 50 })
                     }}
                     className="grid h-7 w-7 place-items-center rounded-full border"
                     aria-label="Reset position"
                  >
                     <RotateCcw className="h-3.5 w-3.5" />
                  </button>
               </div>
            ) : imageUrl ? (
               <div className="ml-auto flex items-center gap-1.5">
                  {BACKGROUNDS.map((b) => (
                     <button
                        key={b.id}
                        type="button"
                        onClick={() => setBg(b.id)}
                        title={b.label}
                        aria-label={`${b.label} background`}
                        className={cn('h-6 w-6 rounded-full ring-1 ring-black/10 transition', bg === b.id && 'ring-2 ring-ink ring-offset-2')}
                        style={bgStyle[b.id]}
                     />
                  ))}
                  <span className="mx-1 h-5 w-px bg-border" />
                  <button type="button" onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))} className="grid h-7 w-7 place-items-center rounded-full border" aria-label="Zoom out">
                     <Minus className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => setZoom((z) => Math.min(3, z + 0.25))} className="grid h-7 w-7 place-items-center rounded-full border" aria-label="Zoom in">
                     <Plus className="h-3.5 w-3.5" />
                  </button>
               </div>
            ) : null}
         </div>

         <div className={cn('relative', compact ? 'aspect-[4/3]' : 'aspect-[4/3] sm:aspect-[16/10]')}>
            {view === 'product' && canMockup ? (
               <div
                  ref={stage}
                  className="absolute inset-0 touch-none select-none overflow-hidden"
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
               >
                  <CatalogImage image={productImage ?? null} label={productName!} accent={accent} dark={dark} sizes="(min-width:1024px) 50vw, 100vw" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                     src={imageUrl!}
                     alt="Your design on the product"
                     draggable={false}
                     onPointerDown={onPointerDown}
                     className="absolute cursor-grab object-contain drop-shadow-[0_2px_3px_rgba(0,0,0,.25)] active:cursor-grabbing"
                     style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        width: `${scale}%`,
                        maxHeight: '85%',
                        transform: 'translate(-50%, -50%)',
                        mixBlendMode: blend && !dark ? 'multiply' : 'normal',
                        opacity: blend ? 0.94 : 1,
                     }}
                  />
                  <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                     <Move className="h-3 w-3" /> Drag to position · illustrative mockup
                  </span>
               </div>
            ) : imageUrl ? (
               <div className="absolute inset-0 overflow-auto" style={bgStyle[bg]}>
                  <div className="grid min-h-full min-w-full place-items-center p-6">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img
                        src={imageUrl}
                        alt={fileName}
                        className="max-h-[70vh] max-w-full object-contain transition-transform duration-200"
                        style={{ transform: `scale(${zoom})` }}
                     />
                  </div>
               </div>
            ) : pdfUrl ? (
               <iframe src={`${pdfUrl}#toolbar=0&view=FitH`} title={fileName} className="absolute inset-0 h-full w-full bg-muted" />
            ) : (
               <div className="absolute inset-0 grid place-items-center bg-muted/60 p-6 text-center">
                  <div>
                     <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white shadow-sm">
                        <FileText className="h-8 w-8" style={{ color: accent }} />
                     </span>
                     <p className="mt-4 font-semibold">{fileName}</p>
                     <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
                        .{ext.toUpperCase()} files can&apos;t be previewed in the browser — our pre-press team opens them in
                        professional software and sends you a proof.
                     </p>
                  </div>
               </div>
            )}
            {pdfUrl && view === 'artwork' && !imageUrl ? (
               <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold shadow"
               >
                  <Maximize2 className="h-3.5 w-3.5" /> Open full size
               </a>
            ) : null}
         </div>
      </div>
   )
}

/** Automatic pre-press checks shown next to a preview. */
export function PrintChecks({ ext, width, height, size }: { ext: string; width?: number; height?: number; size: number }) {
   const vector = ['pdf', 'ai', 'eps', 'svg'].includes(ext)
   const longEdge = Math.max(width ?? 0, height ?? 0)
   const checks: Array<{ ok: boolean | null; title: string; text: string }> = [
      {
         ok: true,
         title: 'File format',
         text: vector ? `.${ext.toUpperCase()} — vector-friendly, ideal for print` : `.${ext.toUpperCase()} accepted`,
      },
      vector
         ? { ok: true, title: 'Resolution', text: 'Vector artwork scales to any size' }
         : longEdge
           ? longEdge >= 2000
              ? { ok: true, title: 'Resolution', text: `${width} × ${height} px — sharp for most sizes` }
              : longEdge >= 1000
                ? { ok: null, title: 'Resolution', text: `${width} × ${height} px — fine for small items; larger sizes may look soft` }
                : { ok: false, title: 'Resolution', text: `${width} × ${height} px — low; send a larger file if you can` }
           : { ok: null, title: 'Resolution', text: 'Checked by our team' },
      { ok: true, title: 'Free human check', text: 'A designer reviews every file before printing' },
   ]
   void size
   return (
      <ul className="space-y-2.5">
         {checks.map((c) => (
            <li key={c.title} className="flex items-start gap-2.5 text-sm">
               {c.ok === false ? (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
               ) : c.ok === null ? (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
               ) : (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
               )}
               <span>
                  <span className="font-semibold">{c.title}</span>
                  <span className="block text-muted-foreground">{c.text}</span>
               </span>
            </li>
         ))}
      </ul>
   )
}
