'use client'

import { defaultSelections, getProductByKey, priceFor, type Selections } from '@/catalog'
import config from '@/config/site'
import { money, roundMoney, unitMoney, units } from '@/lib/money'
import { cn } from '@/lib/utils'
import { DESIGN_SERVICE_FEE, useCart, type ArtworkMode, type CartArtwork } from '@/state/cart-store'
import { ArrowRight, Check, Clock, FileUp, MessageSquareQuote, PenTool, Send, ShoppingBag, Sparkles, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'

const ACCEPT = 'image/*,.pdf,.ai,.eps,.svg,.psd'
const MAX_MB = 50

/** Makes a small JPEG preview so the cart can show it without filling localStorage. */
async function makeThumb(file: File): Promise<string | undefined> {
   if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return undefined
   const url = URL.createObjectURL(file)
   try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
         const el = new Image()
         el.onload = () => resolve(el)
         el.onerror = reject
         el.src = url
      })
      const size = 180
      const scale = Math.min(size / img.width, size / img.height, 1)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext('2d')
      if (!ctx) return undefined
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      return canvas.toDataURL('image/jpeg', 0.72)
   } catch {
      return undefined
   } finally {
      URL.revokeObjectURL(url)
   }
}

export function Configurator({ productKey }: { productKey: string }) {
   const product = getProductByKey(productKey)!
   const router = useRouter()
   const { add } = useCart()
   const { preset } = product

   const [selections, setSelections] = useState<Selections>(() => defaultSelections(product))
   const [qty, setQty] = useState(preset.tiers[Math.min(1, preset.tiers.length - 1)].qty)
   const [mode, setMode] = useState<ArtworkMode>('upload')
   const [file, setFile] = useState<{ name: string; thumb?: string } | null>(null)
   const [brief, setBrief] = useState('')
   const [dragging, setDragging] = useState(false)
   const inputRef = useRef<HTMLInputElement>(null)

   const price = useMemo(() => priceFor(product, selections, qty), [product, selections, qty])
   const designFee = mode === 'design' ? DESIGN_SERVICE_FEE : 0
   const listName = config.showPrices ? 'cart' : 'quote list'
   const total = Math.round((price.total + designFee) * 100) / 100

   async function pickFile(f?: File | null) {
      if (!f) return
      if (f.size > MAX_MB * 1024 * 1024) {
         toast.error(`Files up to ${MAX_MB} MB please — larger files can be emailed after ordering.`)
         return
      }
      const thumb = await makeThumb(f)
      setFile({ name: f.name, thumb })
      setMode('upload')
   }

   function addToCart(goToCart: boolean) {
      if (mode === 'upload' && !file) {
         toast.error('Upload your artwork, or choose “Design it for me” / “Send it later”.')
         return
      }
      const artwork: CartArtwork =
         mode === 'upload'
            ? { mode, fileName: file?.name, thumb: file?.thumb }
            : mode === 'design'
              ? { mode, brief: brief.trim() || undefined }
              : { mode }
      add({ productKey, selections, qty, artwork })
      if (goToCart) {
         router.push('/cart')
         return
      }
      toast.custom(
         (t) => (
            <div className="flex w-[340px] items-center gap-3 rounded-2xl bg-ink p-3 pr-4 text-white shadow-2xl">
               <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-500">
                  <Check className="h-5 w-5" />
               </span>
               <span className="min-w-0 flex-1 text-sm">
                  <span className="block font-semibold">Added to {listName}</span>
                  <span className="block truncate text-white/70">
                     {qty.toLocaleString('en-US')} × {product.name}
                  </span>
               </span>
               <Link
                  href="/cart"
                  onClick={() => toast.dismiss(t.id)}
                  className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink"
               >
                  View {config.showPrices ? 'cart' : 'list'}
               </Link>
            </div>
         ),
         { duration: 4000 }
      )
   }

   if (product.quote) {
      return (
         <div className="space-y-6">
            <div className="rounded-3xl border bg-white p-6">
               <p className="eyebrow text-muted-foreground">Made to order</p>
               <p className="mt-2 font-display text-4xl font-extrabold tracking-tight">
                  {config.showPrices ? `From ${roundMoney(product.basePrice)}` : 'Tailored to your space'}
               </p>
               <p className="mt-2 text-sm text-muted-foreground">
                  Every {product.name.toLowerCase()} project is engineered for your space. Share the details and
                  we&apos;ll send a tailored quote, layout and timeline within one business day.
               </p>
               <ul className="mt-5 space-y-2 text-sm">
                  {[
                     'Free consultation & site survey',
                     'Design, fabrication & installation',
                     `Typical lead time: ${preset.leadTime}`,
                  ].map((t) => (
                     <li key={t} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-600" /> {t}
                     </li>
                  ))}
               </ul>
               <Link
                  href={`/quote?product=${encodeURIComponent(product.key)}`}
                  className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold text-white transition hover:bg-primary/90"
               >
                  <MessageSquareQuote className="h-5 w-5" /> Request a quote
               </Link>
            </div>
         </div>
      )
   }

   return (
      <div className="space-y-8">
         {/* Options */}
         {preset.options.map((group, gi) => (
            <fieldset key={group.id}>
               <legend className="mb-3 flex w-full items-baseline justify-between text-sm font-semibold">
                  <span>
                     <span className="mr-2 text-muted-foreground">{gi + 1}.</span>
                     {group.label}
                  </span>
                  <span className="font-normal text-muted-foreground">{selections[group.id]}</span>
               </legend>
               <div className="flex flex-wrap gap-2">
                  {group.choices.map((choice) => {
                     const active = selections[group.id] === choice.label
                     return (
                        <button
                           key={choice.label}
                           type="button"
                           aria-pressed={active}
                           onClick={() => setSelections((s) => ({ ...s, [group.id]: choice.label }))}
                           className={cn(
                              'rounded-2xl border px-4 py-2.5 text-left text-sm transition',
                              active
                                 ? 'border-ink bg-ink text-white shadow-sm'
                                 : 'border-input bg-white hover:border-ink'
                           )}
                        >
                           <span className="block font-medium">{choice.label}</span>
                           {choice.hint ? (
                              <span className={cn('block text-xs', active ? 'text-white/70' : 'text-muted-foreground')}>
                                 {choice.hint}
                              </span>
                           ) : null}
                        </button>
                     )
                  })}
               </div>
            </fieldset>
         ))}

         {/* Quantity */}
         <fieldset>
            <legend className="mb-3 flex w-full items-baseline justify-between text-sm font-semibold">
               <span>
                  <span className="mr-2 text-muted-foreground">{preset.options.length + 1}.</span>
                  Quantity
               </span>
               <span className="font-normal text-muted-foreground">
                  {config.showPrices ? 'Bigger runs, lower unit price' : 'Volume pricing on larger runs'}
               </span>
            </legend>
            {!config.showPrices ? (
               <div className="flex flex-wrap gap-2">
                  {preset.tiers.map((tier) => {
                     const active = qty === tier.qty
                     return (
                        <button
                           key={tier.qty}
                           type="button"
                           onClick={() => setQty(tier.qty)}
                           aria-pressed={active}
                           className={cn(
                              'rounded-2xl border px-4 py-2.5 text-sm font-semibold transition',
                              active ? 'border-ink bg-ink text-white shadow-sm' : 'border-input bg-white hover:-translate-y-0.5 hover:border-ink'
                           )}
                        >
                           {units(tier.qty, preset.unit)}
                        </button>
                     )
                  })}
               </div>
            ) : (
            <div className="overflow-hidden rounded-2xl border bg-white">
               {preset.tiers.map((tier) => {
                  const p = priceFor(product, selections, tier.qty)
                  const active = qty === tier.qty
                  return (
                     <button
                        key={tier.qty}
                        type="button"
                        onClick={() => setQty(tier.qty)}
                        aria-pressed={active}
                        className={cn(
                           'grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 border-b px-4 py-3 text-left text-sm transition last:border-b-0 sm:grid-cols-[auto_1fr_auto_auto]',
                           active ? 'bg-ink/[0.04]' : 'hover:bg-muted/60'
                        )}
                     >
                        <span
                           className={cn(
                              'grid h-5 w-5 place-items-center rounded-full border-2',
                              active ? 'border-ink bg-ink' : 'border-input'
                           )}
                        >
                           {active ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                        </span>
                        <span className="font-semibold">{units(tier.qty, preset.unit)}</span>
                        <span className="hidden text-muted-foreground sm:block">{unitMoney(p.unit)} each</span>
                        <span className="flex items-center gap-2 justify-self-end">
                           {p.savings > 0 ? (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                                 Save {p.savings}%
                              </span>
                           ) : null}
                           <span className="font-semibold">{money(p.total)}</span>
                        </span>
                     </button>
                  )
               })}
            </div>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
               Need a different quantity or size?{' '}
               <Link href={`/quote?product=${encodeURIComponent(product.key)}`} className="font-medium text-primary underline">
                  Ask for a custom quote
               </Link>
            </p>
         </fieldset>

         {/* Artwork */}
         <fieldset>
            <legend className="mb-3 text-sm font-semibold">
               <span className="mr-2 text-muted-foreground">{preset.options.length + 2}.</span>
               Your artwork
            </legend>
            <div className="grid gap-2 sm:grid-cols-3">
               {(
                  [
                     { id: 'upload', icon: FileUp, title: 'Upload design', text: 'PDF, AI, PNG, JPG' },
                     { id: 'design', icon: PenTool, title: 'Design it for me', text: config.showPrices ? `+${money(DESIGN_SERVICE_FEE)} · free revisions` : 'Our designers · free revisions' },
                     { id: 'later', icon: Send, title: 'Send it later', text: 'Email us after ordering' },
                  ] as const
               ).map(({ id, icon: Icon, title, text }) => (
                  <button
                     key={id}
                     type="button"
                     onClick={() => setMode(id)}
                     aria-pressed={mode === id}
                     className={cn(
                        'flex items-start gap-3 rounded-2xl border p-3.5 text-left transition sm:flex-col sm:gap-2',
                        mode === id ? 'border-ink bg-white shadow-[0_0_0_1px_hsl(var(--ink))]' : 'border-input bg-white hover:border-ink'
                     )}
                  >
                     <Icon className="h-5 w-5 shrink-0" style={{ color: product.accent }} />
                     <span>
                        <span className="block text-sm font-semibold">{title}</span>
                        <span className="block text-xs text-muted-foreground">{text}</span>
                     </span>
                  </button>
               ))}
            </div>

            {mode === 'upload' ? (
               <div
                  onDragOver={(e) => {
                     e.preventDefault()
                     setDragging(true)
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                     e.preventDefault()
                     setDragging(false)
                     pickFile(e.dataTransfer.files?.[0])
                  }}
                  className={cn(
                     'mt-3 rounded-2xl border-2 border-dashed p-5 transition',
                     dragging ? 'border-ink bg-white' : 'border-input bg-white/60'
                  )}
               >
                  {file ? (
                     <div className="flex items-center gap-4">
                        <span className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border bg-white">
                           {file.thumb ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={file.thumb} alt="" className="h-full w-full object-contain" />
                           ) : (
                              <FileUp className="h-6 w-6 text-muted-foreground" />
                           )}
                        </span>
                        <span className="min-w-0 flex-1">
                           <span className="block truncate text-sm font-semibold">{file.name}</span>
                           <span className="block text-xs text-emerald-700">Ready — we&apos;ll check it before printing</span>
                        </span>
                        <button
                           type="button"
                           onClick={() => setFile(null)}
                           className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"
                           aria-label="Remove file"
                        >
                           <X className="h-4 w-4" />
                        </button>
                     </div>
                  ) : (
                     <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="flex w-full flex-col items-center gap-2 py-3 text-center"
                     >
                        <FileUp className="h-7 w-7 text-muted-foreground" />
                        <span className="text-sm">
                           <span className="font-semibold text-primary underline">Choose a file</span> or drag it here
                        </span>
                        <span className="text-xs text-muted-foreground">PDF, AI, EPS, SVG, PNG or JPG · up to {MAX_MB} MB</span>
                     </button>
                  )}
                  <input
                     ref={inputRef}
                     type="file"
                     accept={ACCEPT}
                     className="sr-only"
                     onChange={(e) => pickFile(e.target.files?.[0])}
                  />
               </div>
            ) : null}

            {mode === 'design' ? (
               <div className="mt-3">
                  <label htmlFor="brief" className="mb-1.5 block text-sm font-medium">
                     Tell our designers what you need <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <textarea
                     id="brief"
                     value={brief}
                     onChange={(e) => setBrief(e.target.value)}
                     rows={3}
                     maxLength={600}
                     placeholder="Brand name, colours, text, the vibe you're going for…"
                     className="w-full rounded-2xl border border-input bg-white p-3 text-sm outline-none focus:border-ink"
                  />
               </div>
            ) : null}

            {mode === 'later' ? (
               <p className="mt-3 rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
                  No problem — after you order we&apos;ll email you a link to send your files. Production starts once you
                  approve the proof.
               </p>
            ) : null}
         </fieldset>

         {/* Summary */}
         {config.showPrices ? (
         <div id="price-summary" className="rounded-3xl bg-ink p-6 text-white">
            <div className="flex items-end justify-between gap-4">
               <div>
                  <p className="text-sm text-white/60">
                     {qty.toLocaleString('en-US')} × {unitMoney(price.unit)}
                     {designFee ? ` + ${money(designFee)} design` : ''}
                  </p>
                  <p className="mt-1 font-display text-4xl font-extrabold tracking-tight">{money(total)}</p>
               </div>
               {price.savings > 0 ? (
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                     You save {price.savings}%
                  </span>
               ) : null}
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
               <button
                  type="button"
                  onClick={() => addToCart(false)}
                  className="btn-shine inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold text-white transition hover:bg-primary/90 active:scale-[0.98]"
               >
                  <ShoppingBag className="h-5 w-5" /> Add to cart
               </button>
               <button
                  type="button"
                  onClick={() => addToCart(true)}
                  className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-semibold transition hover:bg-white/10"
               >
                  Buy now
               </button>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-white/60">
               <Clock className="h-3.5 w-3.5" /> Production {preset.leadTime} after proof approval
            </p>
         </div>
         ) : (
            <div id="price-summary" className="relative overflow-hidden rounded-3xl bg-ink p-6 text-white">
               <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-40 blur-3xl"
                  style={{ backgroundColor: product.accent }}
               />
               <p className="relative flex items-center gap-2 text-sm font-semibold text-white/70">
                  <Sparkles className="h-4 w-4 text-coral" /> Your selection
               </p>
               <p className="relative mt-2 font-display text-2xl font-extrabold leading-tight tracking-tight">
                  {units(qty, preset.unit)} · {product.name}
               </p>
               <ul className="relative mt-3 flex flex-wrap gap-1.5">
                  {Object.values(selections).map((v) => (
                     <li key={v} className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/85">
                        {v}
                     </li>
                  ))}
               </ul>
               <div className="relative mt-5 grid gap-2 sm:grid-cols-2">
                  <button
                     type="button"
                     onClick={() => addToCart(false)}
                     className="btn-shine inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold text-white transition hover:bg-primary/90 active:scale-[0.98]"
                  >
                     <ShoppingBag className="h-5 w-5" /> Add to quote list
                  </button>
                  <button
                     type="button"
                     onClick={() => addToCart(true)}
                     className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-6 text-base font-semibold text-ink transition hover:bg-white/90"
                  >
                     Request a quote <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
               </div>
               <p className="relative mt-4 flex items-center gap-2 text-xs text-white/60">
                  <Clock className="h-3.5 w-3.5" /> Pricing within 1 business day · production {preset.leadTime}
               </p>
            </div>
         )}

         {/* Mobile sticky bar */}
         <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-white/95 p-3 backdrop-blur-xl lg:hidden">
            <div className="mx-auto flex max-w-xl items-center gap-3">
               <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-muted-foreground">{units(qty, preset.unit)}</p>
                  <p className="truncate font-display text-lg font-extrabold leading-tight">
                     {config.showPrices ? money(total) : product.name}
                  </p>
               </div>
               <button
                  type="button"
                  onClick={() => addToCart(false)}
                  className="btn-shine inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white"
               >
                  <ShoppingBag className="h-4 w-4" /> {config.showPrices ? 'Add to cart' : 'Add to quote'}
               </button>
            </div>
         </div>
      </div>
   )
}
