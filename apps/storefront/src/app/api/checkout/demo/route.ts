import { checkoutPayloadSchema } from '@domain-checkout'
import { calculatePrice, type PricingVariant } from '@domain-pricing'
import { getOfflineCatalogProducts } from '@/lib/catalog-offline'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const SHIPPING_FEE = 5

const demoCheckoutSchema = checkoutPayloadSchema.extend({
   fullName: z.string().min(2),
   cardLast4: z.string().length(4).optional(),
})

export async function POST(req: Request) {
   try {
      const payload = demoCheckoutSchema.parse(await req.json())
      const catalog = getOfflineCatalogProducts()
      const catalogById = new Map(catalog.map((p) => [p.id, p]))

      let subtotal = 0

      for (const item of payload.items) {
         const product = catalogById.get(item.productId)
         if (!product) {
            return new NextResponse('Cart contains invalid products', { status: 400 })
         }

         const variants = (item.selectedVariants ??
            item.customDesign?.variants ??
            []) as PricingVariant[]

         subtotal += calculatePrice({
            basePrice: product.price,
            quantity: item.count,
            variants,
            discount: product.discount,
         }).total
      }

      const payable = subtotal + SHIPPING_FEE
      const orderId = `demo-${Date.now()}`
      const orderNumber = String(Math.floor(100000 + Math.random() * 899999))
      const baseUrl = new URL(req.url).origin

      return NextResponse.json({
         orderId,
         orderNumber,
         paymentId: `pay-${orderId}`,
         payable,
         redirectUrl: `${baseUrl}/checkout/success?orderId=${orderId}&number=${orderNumber}`,
      })
   } catch (error) {
      if (error instanceof z.ZodError) {
         return NextResponse.json(
            { message: 'Invalid checkout payload', issues: error.issues },
            { status: 400 }
         )
      }

      console.error('[CHECKOUT_DEMO_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
