import {
   checkoutPayloadSchema,
   DomainCheckoutError,
   DomainOrderError,
   executeCheckout,
} from '@domain-checkout'
import { ensureCatalogProductsInDb } from '@/lib/ensure-catalog-db'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const demoCheckoutSchema = checkoutPayloadSchema.extend({
   fullName: z.string().min(2),
   cardLast4: z.string().length(4).optional(),
})

export async function POST(req: Request) {
   try {
      const payload = demoCheckoutSchema.parse(await req.json())

      await ensureCatalogProductsInDb(
         prisma,
         payload.items.map((item) => item.productId)
      )

      const user = await prisma.user.upsert({
         where: { phone: payload.phone },
         create: {
            phone: payload.phone,
            name: payload.fullName,
            isPhoneVerified: true,
         },
         update: {
            name: payload.fullName,
         },
      })

      const { order, totals } = await executeCheckout({
         prisma,
         userId: user.id,
         payload,
      })

      const provider = await prisma.paymentProvider.upsert({
         where: { title: 'MockGateway' },
         create: {
            title: 'MockGateway',
            description: 'Demo payment provider',
            isActive: true,
         },
         update: { isActive: true },
      })

      const payment = await prisma.payment.create({
         data: {
            status: 'Paid',
            refId: `DEMO-${Date.now()}`,
            payable: totals.payable,
            isSuccessful: true,
            providerId: provider.id,
            userId: user.id,
            orderId: order.id,
         },
      })

      await prisma.order.update({
         where: { id: order.id },
         data: { isPaid: true, status: 'Processing' },
      })

      const baseUrl = new URL(req.url).origin

      return NextResponse.json({
         orderId: order.id,
         orderNumber: order.number,
         paymentId: payment.id,
         payable: totals.payable,
         redirectUrl: `${baseUrl}/checkout/success?orderId=${order.id}&number=${order.number}`,
      })
   } catch (error) {
      if (error instanceof z.ZodError) {
         return NextResponse.json(
            { message: 'Invalid checkout payload', issues: error.issues },
            { status: 400 }
         )
      }

      if (error instanceof DomainOrderError && error.code === 'INVALID_DISCOUNT_CODE') {
         return new NextResponse('Invalid or expired discount code', { status: 400 })
      }
      if (error instanceof DomainCheckoutError && error.code === 'INVALID_PRODUCT') {
         return new NextResponse('Cart contains invalid products', { status: 400 })
      }

      console.error('[CHECKOUT_DEMO_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
