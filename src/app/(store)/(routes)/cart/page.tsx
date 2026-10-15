'use client'

import { Breadcrumbs } from '@/components/store/breadcrumbs'
import { CatalogImage } from '@/components/store/catalog-image'
import config from '@/config/site'
import { money, unitMoney, units } from '@/lib/money'
import { useCart } from '@/state/cart-store'
import { ArrowRight, FileUp, PenTool, Send, ShieldCheck, ShoppingBag, Trash2, Truck } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const ARTWORK_LABEL = {
   upload: { icon: FileUp, text: 'Artwork uploaded' },
   design: { icon: PenTool, text: 'Design service' },
   later: { icon: Send, text: 'Artwork to follow' },
}

export default function CartPage() {
   const { lines, subtotal, update, remove } = useCart()
   const [mounted, setMounted] = useState(false)
   useEffect(() => setMounted(true), [])

   const P = config.showPrices
   const shipping = subtotal >= config.freeShippingOver || subtotal === 0 ? 0 : config.shippingFlat
   const toFree = Math.max(0, config.freeShippingOver - subtotal)

   return (
      <div className="page-shell pb-10 pt-6 sm:pt-8">
         <Breadcrumbs items={[{ label: P ? 'Cart' : 'Quote list' }]} />
         <h1 className="display-lg mt-6">{P ? 'Your cart' : 'Your quote list'}</h1>
         {!P ? (
            <p className="mt-3 max-w-xl text-muted-foreground">
               Add everything you need, then send one request — we reply with pricing, proofs and lead times within one
               business day.
            </p>
         ) : null}

         {!mounted ? (
            <div className="mt-10 h-64 animate-pulse rounded-3xl bg-muted" />
         ) : lines.length === 0 ? (
            <div className="mt-10 flex flex-col items-center rounded-[2rem] border bg-white px-6 py-16 text-center">
               <span className="grid h-16 w-16 place-items-center rounded-full bg-muted">
                  <ShoppingBag className="h-7 w-7" />
               </span>
               <h2 className="mt-5 font-display text-2xl font-bold">{P ? 'Your cart is empty' : 'Your quote list is empty'}</h2>
               <p className="mt-2 max-w-sm text-muted-foreground">
                  Browse boxes, cards, labels and signs — everything is made to order with your brand on it.
               </p>
               <Link
                  href="/shop"
                  className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 font-semibold text-white hover:bg-ink/85"
               >
                  Start shopping <ArrowRight className="h-4 w-4" />
               </Link>
            </div>
         ) : (
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
               <ul className="space-y-4">
                  {lines.map((line) => {
                     const art = ARTWORK_LABEL[line.artwork?.mode ?? 'later']
                     const ArtIcon = art.icon
                     return (
                        <li key={line.id} className="rounded-3xl border bg-white p-4 sm:p-5">
                           <div className="flex gap-4">
                              <Link href={line.href} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-muted sm:h-32 sm:w-32">
                                 <CatalogImage image={line.image} label={line.name} sizes="128px" />
                                 {line.artwork?.thumb ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                       src={line.artwork.thumb}
                                       alt="Your artwork"
                                       className="absolute bottom-1.5 right-1.5 h-10 w-10 rounded-lg border-2 border-white bg-white object-contain shadow"
                                    />
                                 ) : null}
                              </Link>
                              <div className="min-w-0 flex-1">
                                 <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                       <p className="text-xs text-muted-foreground">{line.categoryName}</p>
                                       <Link href={line.href} className="font-semibold leading-snug hover:text-primary">
                                          {line.name}
                                       </Link>
                                    </div>
                                    {P ? <p className="shrink-0 font-display text-lg font-bold">{money(line.total)}</p> : null}
                                 </div>
                                 <ul className="mt-2 flex flex-wrap gap-1.5">
                                    {Object.values(line.selections).map((v) => (
                                       <li key={v} className="rounded-full bg-muted px-2.5 py-0.5 text-xs">
                                          {v}
                                       </li>
                                    ))}
                                 </ul>
                                 <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <ArtIcon className="h-3.5 w-3.5" />
                                    {art.text}
                                    {line.artwork?.fileName ? `: ${line.artwork.fileName}` : ''}
                                    {P && line.designFee ? ` (+${money(line.designFee)})` : ''}
                                 </p>
                              </div>
                           </div>
                           <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                              <label className="flex items-center gap-2 text-sm">
                                 <span className="text-muted-foreground">Quantity</span>
                                 <select
                                    value={line.qty}
                                    onChange={(e) => update(line.id, { qty: Number(e.target.value) })}
                                    className="h-9 rounded-full border bg-white px-3 text-sm font-medium outline-none focus:border-ink"
                                 >
                                    {line.tiers.map((q) => (
                                       <option key={q} value={q}>
                                          {units(q, line.unitLabel)}
                                       </option>
                                    ))}
                                 </select>
                                 {P ? (
                                    <span className="hidden text-xs text-muted-foreground sm:inline">
                                       {unitMoney(line.unit)} each{line.savings ? ` · save ${line.savings}%` : ''}
                                    </span>
                                 ) : null}
                              </label>
                              <button
                                 type="button"
                                 onClick={() => remove(line.id)}
                                 className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-red-50 hover:text-red-700"
                              >
                                 <Trash2 className="h-4 w-4" /> Remove
                              </button>
                           </div>
                        </li>
                     )
                  })}
               </ul>

{P ? (
               <aside className="rounded-3xl bg-ink p-6 text-white lg:sticky lg:top-[150px]">
                  <h2 className="font-display text-xl font-bold">Order summary</h2>
                  {toFree > 0 ? (
                     <div className="mt-4 rounded-2xl bg-white/10 p-3 text-sm">
                        <p>
                           Add <strong>{money(toFree)}</strong> more for free shipping
                        </p>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
                           <div
                              className="h-full rounded-full bg-coral transition-all"
                              style={{ width: `${Math.min(100, (subtotal / config.freeShippingOver) * 100)}%` }}
                           />
                        </div>
                     </div>
                  ) : (
                     <p className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-400/15 p-3 text-sm text-emerald-200">
                        <Truck className="h-4 w-4" /> You&apos;ve unlocked free shipping
                     </p>
                  )}
                  <dl className="mt-5 space-y-2.5 text-sm">
                     <div className="flex justify-between">
                        <dt className="text-white/65">Subtotal ({lines.length} {lines.length === 1 ? 'item' : 'items'})</dt>
                        <dd>{money(subtotal)}</dd>
                     </div>
                     <div className="flex justify-between">
                        <dt className="text-white/65">Shipping</dt>
                        <dd>{shipping ? money(shipping) : 'Free'}</dd>
                     </div>
                     <div className="flex justify-between">
                        <dt className="text-white/65">Taxes</dt>
                        <dd className="text-white/65">Calculated on invoice</dd>
                     </div>
                     <div className="flex items-end justify-between border-t border-white/15 pt-4">
                        <dt className="font-semibold">Estimated total</dt>
                        <dd className="font-display text-3xl font-extrabold">{money(subtotal + shipping)}</dd>
                     </div>
                  </dl>
                  <Link
                     href="/checkout"
                     className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold transition hover:bg-primary/90"
                  >
                     Continue to checkout <ArrowRight className="h-5 w-5" />
                  </Link>
                  <p className="mt-4 flex items-start gap-2 text-xs text-white/55">
                     <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                     Nothing is charged now. We send a digital proof and a payment link before production starts.
                  </p>
               </aside>
) : (
               <aside className="relative overflow-hidden rounded-3xl bg-ink p-6 text-white lg:sticky lg:top-[150px]">
                  <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/40 blur-3xl" />
                  <h2 className="relative font-display text-xl font-bold">Quote summary</h2>
                  <p className="relative mt-1 text-sm text-white/60">
                     {lines.length} {lines.length === 1 ? 'product' : 'products'} ready to quote
                  </p>
                  <ol className="relative mt-6 space-y-4 text-sm">
                     {[
                        ['Send your request', 'Takes under a minute.'],
                        ['Get pricing & proof', 'Within one business day.'],
                        ['Approve & we produce', 'Delivered — or installed.'],
                     ].map(([t, d], i) => (
                        <li key={t} className="flex gap-3">
                           <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-bold">{i + 1}</span>
                           <span>
                              <span className="block font-semibold">{t}</span>
                              <span className="block text-white/55">{d}</span>
                           </span>
                        </li>
                     ))}
                  </ol>
                  <Link
                     href="/checkout"
                     className="btn-shine relative mt-7 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold transition hover:bg-primary/90"
                  >
                     Request my quote <ArrowRight className="h-5 w-5" />
                  </Link>
                  <p className="relative mt-4 flex items-start gap-2 text-xs text-white/55">
                     <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                     No payment now and no obligation — you only pay once you approve the quote and proof.
                  </p>
               </aside>
)}
            </div>
         )}
      </div>
   )
}
