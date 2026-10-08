'use client'

import { Breadcrumbs } from '@/components/store/breadcrumbs'
import { CatalogImage } from '@/components/store/catalog-image'
import config from '@/config/site'
import { makeReference } from '@/lib/mailto'
import { money, units } from '@/lib/money'
import { LAST_ORDER_KEY, type Customer, type OrderRequest } from '@/lib/order-request'
import { cn } from '@/lib/utils'
import { useCart } from '@/state/cart-store'
import { ArrowRight, Lock, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Field = keyof Customer

const FIELDS: Array<{ id: Field; label: string; type?: string; required?: boolean; span?: boolean; auto?: string }> = [
   { id: 'name', label: 'Full name', required: true, auto: 'name' },
   { id: 'company', label: 'Company (optional)', auto: 'organization' },
   { id: 'email', label: 'Email', type: 'email', required: true, auto: 'email' },
   { id: 'phone', label: 'Phone', type: 'tel', required: true, auto: 'tel' },
   { id: 'address', label: 'Delivery address', required: true, span: true, auto: 'street-address' },
   { id: 'city', label: 'City', required: true, auto: 'address-level2' },
   { id: 'country', label: 'Country', required: true, auto: 'country-name' },
]

export default function CheckoutPage() {
   const router = useRouter()
   const { lines, subtotal, clear } = useCart()
   const [mounted, setMounted] = useState(false)
   const [form, setForm] = useState<Customer>({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      city: '',
      country: '',
      notes: '',
   })
   const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
   const [agreed, setAgreed] = useState(false)

   useEffect(() => setMounted(true), [])

   const P = config.showPrices
   const shipping = subtotal >= config.freeShippingOver ? 0 : config.shippingFlat
   const total = Math.round((subtotal + shipping) * 100) / 100

   function validate() {
      const next: Partial<Record<Field, string>> = {}
      for (const f of FIELDS) {
         if (f.required && !String(form[f.id] ?? '').trim()) next[f.id] = 'Required'
      }
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email'
      if (form.phone && form.phone.replace(/\D/g, '').length < 7) next.phone = 'Enter a valid phone number'
      setErrors(next)
      return Object.keys(next).length === 0
   }

   function submit(e: React.FormEvent) {
      e.preventDefault()
      if (!validate() || !agreed) return
      const order: OrderRequest = {
         reference: makeReference('JA'),
         createdAt: new Date().toISOString(),
         customer: Object.fromEntries(
            Object.entries(form).map(([k, v]) => [k, String(v ?? '').trim()])
         ) as Customer,
         lines: lines.map((l) => ({
            name: l.name,
            href: l.href,
            qty: l.qty,
            unit: l.unit,
            total: l.total,
            designFee: l.designFee,
            selections: l.selections,
            unitLabel: l.unitLabel,
            artwork: { mode: l.artwork.mode, fileName: l.artwork.fileName, brief: l.artwork.brief },
         })),
         subtotal,
         shipping,
         total,
      }
      try {
         sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order))
      } catch {
         // ignore — the success page falls back gracefully
      }
      clear()
      router.push(`/checkout/success?ref=${order.reference}`)
   }

   if (mounted && lines.length === 0) {
      return (
         <div className="page-shell py-20 text-center">
            <h1 className="display-md">Your cart is empty</h1>
            <Link href="/shop" className="mt-6 inline-flex h-12 items-center rounded-full bg-ink px-7 font-semibold text-white">
               Browse products
            </Link>
         </div>
      )
   }

   return (
      <div className="page-shell pb-10 pt-6 sm:pt-8">
         <Breadcrumbs items={[{ href: '/cart', label: P ? 'Cart' : 'Quote list' }, { label: P ? 'Checkout' : 'Request a quote' }]} />
         <h1 className="display-lg mt-6">{P ? 'Checkout' : 'Request your quote'}</h1>

         <form onSubmit={submit} noValidate className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
            <div className="space-y-6">
               <section className="rounded-3xl border bg-white p-5 sm:p-7">
                  <h2 className="font-display text-xl font-bold">Contact & delivery</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                     {FIELDS.map((f) => (
                        <div key={f.id} className={cn(f.span && 'sm:col-span-2')}>
                           <label htmlFor={f.id} className="mb-1.5 block text-sm font-medium">
                              {f.label}
                           </label>
                           <input
                              id={f.id}
                              type={f.type ?? 'text'}
                              autoComplete={f.auto}
                              value={form[f.id] ?? ''}
                              onChange={(e) => setForm((s) => ({ ...s, [f.id]: e.target.value }))}
                              aria-invalid={Boolean(errors[f.id])}
                              className={cn(
                                 'h-12 w-full rounded-2xl border bg-white px-4 text-[15px] outline-none transition focus:border-ink focus:ring-4 focus:ring-ink/5',
                                 errors[f.id] ? 'border-red-500' : 'border-input'
                              )}
                           />
                           {errors[f.id] ? <p className="mt-1 text-xs text-red-600">{errors[f.id]}</p> : null}
                        </div>
                     ))}
                     <div className="sm:col-span-2">
                        <label htmlFor="notes" className="mb-1.5 block text-sm font-medium">
                           Order notes (optional)
                        </label>
                        <textarea
                           id="notes"
                           rows={3}
                           value={form.notes}
                           onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
                           placeholder="Deadline, delivery instructions, Pantone colours…"
                           className="w-full rounded-2xl border border-input bg-white p-4 text-[15px] outline-none focus:border-ink focus:ring-4 focus:ring-ink/5"
                        />
                     </div>
                  </div>
               </section>

               <section className="rounded-3xl border bg-white p-5 sm:p-7">
                  <h2 className="font-display text-xl font-bold">{P ? 'How payment works' : 'What happens next'}</h2>
                  <ol className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                     {(P
                        ? [
                             ['Send your order', 'We receive your order and artwork details.'],
                             ['Approve your proof', 'We email a digital proof and final invoice.'],
                             ['Pay & we print', 'Pay securely by card or bank transfer — production starts.'],
                          ]
                        : [
                             ['Send your request', 'We receive your products, options and artwork details.'],
                             ['Receive your quote', 'Pricing, proof and lead time within 1 business day.'],
                             ['Approve & we produce', 'Pay only once you are happy — then we print.'],
                          ]
                     ).map(([t, d], i) => (
                        <li key={t} className="rounded-2xl bg-muted p-4">
                           <span className="font-display text-2xl font-extrabold text-primary">{i + 1}</span>
                           <p className="mt-1 font-semibold">{t}</p>
                           <p className="mt-1 text-muted-foreground">{d}</p>
                        </li>
                     ))}
                  </ol>
                  <label className="mt-5 flex items-start gap-3 text-sm">
                     <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 h-5 w-5 rounded border-input accent-[#D42F25]"
                     />
                     <span>
                        I agree to the{' '}
                        <Link href="/terms" className="font-medium underline">
                           terms of service
                        </Link>{' '}
                        and understand {P ? 'production starts after I approve the proof' : 'Joji Arts will contact me with pricing'}.
                     </span>
                  </label>
               </section>
            </div>

            <aside className="rounded-3xl bg-ink p-6 text-white lg:sticky lg:top-[150px]">
               <h2 className="font-display text-xl font-bold">{P ? 'Your order' : 'Your quote list'}</h2>
               <ul className="mt-5 max-h-[340px] space-y-4 overflow-y-auto pr-1">
                  {mounted
                     ? lines.map((l) => (
                          <li key={l.id} className="flex gap-3">
                             <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white/10">
                                <CatalogImage image={l.image} label={l.name} sizes="56px" />
                             </span>
                             <span className="min-w-0 flex-1 text-sm">
                                <span className="block truncate font-medium">{l.name}</span>
                                <span className="block text-white/60">{units(l.qty, l.unitLabel)}</span>
                             </span>
                             {P ? <span className="text-sm font-semibold">{money(l.total)}</span> : null}
                          </li>
                       ))
                     : null}
               </ul>
               {P ? (
               <dl className="mt-5 space-y-2.5 border-t border-white/15 pt-5 text-sm">
                  <div className="flex justify-between">
                     <dt className="text-white/65">Subtotal</dt>
                     <dd>{money(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                     <dt className="text-white/65">Shipping</dt>
                     <dd>{shipping ? money(shipping) : 'Free'}</dd>
                  </div>
                  <div className="flex items-end justify-between border-t border-white/15 pt-4">
                     <dt className="font-semibold">Estimated total</dt>
                     <dd className="font-display text-3xl font-extrabold">{money(total)}</dd>
                  </div>
               </dl>
               ) : null}
               <button
                  type="submit"
                  disabled={!agreed}
                  className="btn-shine mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
               >
                  <Lock className="h-4 w-4" /> {P ? 'Place order request' : 'Send quote request'} <ArrowRight className="h-5 w-5" />
               </button>
               <p className="mt-4 flex items-start gap-2 text-xs text-white/55">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  {P ? 'No payment is taken now. Taxes are added on your final invoice.' : 'Free, no-obligation quote. No payment is taken now.'}
               </p>
            </aside>
         </form>
      </div>
   )
}
