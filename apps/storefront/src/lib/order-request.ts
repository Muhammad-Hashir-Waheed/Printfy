import config from '@/config/site'
import { money, unitMoney, units } from '@/lib/money'
import type { PricedLine } from '@/state/cart-store'

export type Customer = {
   name: string
   email: string
   phone: string
   company?: string
   address: string
   city: string
   country: string
   notes?: string
}

export type OrderRequest = {
   reference: string
   createdAt: string
   customer: Customer
   lines: Array<
      Pick<PricedLine, 'name' | 'href' | 'qty' | 'unit' | 'total' | 'designFee' | 'selections' | 'unitLabel'> & {
         artwork: PricedLine['artwork']
      }
   >
   subtotal: number
   shipping: number
   total: number
}

export const LAST_ORDER_KEY = 'joji-last-order'

export function orderText(order: OrderRequest) {
   const P = config.showPrices
   const c = order.customer
   const lines = order.lines
      .map((l, i) => {
         const options = Object.values(l.selections).join(', ')
         const art =
            l.artwork?.mode === 'upload'
               ? `artwork: ${l.artwork.fileName ?? 'file attached separately'}`
               : l.artwork?.mode === 'design'
                 ? `design service${l.artwork.brief ? ` — brief: ${l.artwork.brief}` : ''}`
                 : 'artwork to follow'
         const price = P ? ` @ ${unitMoney(l.unit)} = ${money(l.total)}` : ''
         return `${i + 1}. ${l.name} — ${units(l.qty, l.unitLabel)}${price}\n   ${options}\n   ${art}`
      })
      .join('\n')

   const totals = P
      ? [
           `Subtotal: ${money(order.subtotal)}`,
           `Shipping: ${order.shipping ? money(order.shipping) : 'Free'}`,
           `Estimated total: ${money(order.total)} (${config.currency}, taxes on invoice)`,
           '',
        ]
      : []

   return [
      `${P ? 'Order' : 'Quote'} request ${order.reference}`,
      '',
      lines,
      '',
      ...totals,
      'Customer',
      `${c.name}${c.company ? ` — ${c.company}` : ''}`,
      `${c.email} · ${c.phone}`,
      `${c.address}, ${c.city}, ${c.country}`,
      c.notes ? `Notes: ${c.notes}` : '',
      '',
      P
         ? 'Please send a proof and payment link. I will reply to this email with my artwork files if needed.'
         : 'Please send me a quote and proof for the items above. I will reply with my artwork files if needed.',
   ]
      .filter((l) => l !== undefined)
      .join('\n')
}
