import prisma from '@/lib/prisma'
import { PaymentStatusEnum } from '@prisma/client'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const paymentPatchSchema = z.object({
   status: z.nativeEnum(PaymentStatusEnum).optional(),
   payable: z.coerce.number().min(0).optional(),
   isSuccessful: z.boolean().optional(),
})

export async function PATCH(
   req: Request,
   { params }: { params: { paymentId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!params.paymentId) {
         return new NextResponse('Payment id is required', { status: 400 })
      }

      const payload = paymentPatchSchema.parse(await req.json())

      const payment = await prisma.payment.update({
         where: { id: params.paymentId },
         data: payload,
      })

      return NextResponse.json(payment)
   } catch (error) {
      console.error('[PAYMENT_PATCH]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
