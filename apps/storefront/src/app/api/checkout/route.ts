import {
   checkoutPayloadSchema,
   DomainCheckoutError,
   DomainOrderError,
   executeCheckout,
} from '@domain-checkout'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const payload = checkoutPayloadSchema.parse(await req.json())
      const { order, totals } = await executeCheckout({
         prisma,
         userId,
         payload,
      })

      return NextResponse.json({
         orderId: order.id,
         number: order.number,
         payable: totals.payable,
      })
   } catch (error) {
      if (error instanceof z.ZodError) {
         return NextResponse.json(
            { message: 'Invalid checkout payload', issues: error.issues },
            { status: 400 }
         )
      }

      if (error instanceof DomainOrderError && error.code === 'INVALID_DISCOUNT_CODE') {
         return new NextResponse('Invalid or expired discount code', {
            status: 400,
         })
      }
      if (error instanceof DomainCheckoutError && error.code === 'INVALID_PRODUCT') {
         return new NextResponse('Cart contains invalid products', {
            status: 400,
         })
      }

      console.error('[CHECKOUT_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
