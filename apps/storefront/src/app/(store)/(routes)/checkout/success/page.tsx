'use client'

import config from '@/config/site'
import { copyText, mailto } from '@/lib/mailto'
import { money, units } from '@/lib/money'
import { LAST_ORDER_KEY, orderText, type OrderRequest } from '@/lib/order-request'
import { Check, ClipboardCopy, Mail } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function CheckoutSuccessPage() {
   const [order, setOrder] = useState<OrderRequest | null>(null)
   const [loaded, setLoaded] = useState(false)
   const [copied, setCopied] = useState(false)

   useEffect(() => {
      try {
         const raw = sessionStorage.getItem(LAST_ORDER_KEY)
         if (raw) setOrder(JSON.parse(raw))
      } catch {
         // ignore
      }
      setLoaded(true)
   }, [])

   if (!loaded) return <div className="page-shell py-24" />

   if (!order) {
      return (
         <div className="page-shell py-24 text-center">
            <h1 className="display-md">No recent order found</h1>
            <p className="mt-3 text-muted-foreground">Your order request may already have been sent.</p>
            <Link href="/shop" className="mt-6 inline-flex h-12 items-center rounded-full bg-ink px-7 font-semibold text-white">
               Continue shopping
            </Link>
         </div>
      )
   }

   const P = config.showPrices
   const text = orderText(order)
   const kind = P ? 'Order request' : 'Quote request'
   const href = mailto(config.ordersEmail, `${kind} ${order.reference} — ${order.customer.name}`, text)

   return (
      <div className="page-shell py-10 sm:py-16">
         <div className="mx-auto max-w-2xl">
            <div className="text-center">
               <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                  <Check className="h-8 w-8" />
               </span>
               <p className="eyebrow mt-6 text-muted-foreground">Reference {order.reference}</p>
               <h1 className="display-lg mt-3">One last step — send it to us.</h1>
               <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                  Your {P ? 'order' : 'quote request'} is ready. Tap below to email it to our team — attach any artwork
                  files to the same email. We reply with {P ? 'a proof and payment link' : 'pricing and a proof'} within one
                  business day.
               </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
               <a
                  href={href}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-8 text-base font-semibold text-white transition hover:bg-primary/90"
               >
                  <Mail className="h-5 w-5" /> Email my {P ? 'order' : 'request'} to {config.name}
               </a>
               <button
                  type="button"
                  onClick={async () => setCopied(await copyText(text))}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-full border bg-white px-8 text-base font-semibold transition hover:border-ink"
               >
                  <ClipboardCopy className="h-5 w-5" /> {copied ? 'Copied!' : 'Copy details'}
               </button>
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
               Mail app not opening? Copy the details and send them to{' '}
               <a href={`mailto:${config.ordersEmail}`} className="font-medium underline">
                  {config.ordersEmail}
               </a>
               .
            </p>

            <div className="mt-10 rounded-3xl border bg-white p-6">
               <h2 className="font-display text-lg font-bold">{P ? 'Order summary' : 'Quote request summary'}</h2>
               <ul className="mt-4 divide-y text-sm">
                  {order.lines.map((l, i) => (
                     <li key={i} className="flex justify-between gap-4 py-3">
                        <span>
                           <span className="block font-medium">{l.name}</span>
                           <span className="block text-muted-foreground">
                              {units(l.qty, l.unitLabel)} · {Object.values(l.selections).join(' · ')}
                           </span>
                        </span>
                        {P ? <span className="font-semibold">{money(l.total)}</span> : null}
                     </li>
                  ))}
               </ul>
               {P ? (
                  <div className="mt-2 flex justify-between border-t pt-4 font-semibold">
                     <span>Estimated total</span>
                     <span>{money(order.total)}</span>
                  </div>
               ) : null}
            </div>

            <div className="mt-8 text-center">
               <Link href="/shop" className="text-sm font-semibold text-primary hover:underline">
                  Continue shopping →
               </Link>
            </div>
         </div>
      </div>
   )
}
