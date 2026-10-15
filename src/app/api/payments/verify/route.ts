import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const verifySchema = z.object({
   paymentId: z.string().min(1),
   status: z.enum(['success', 'failed']).default('success'),
})

async function verifyPayment(payload: z.infer<typeof verifySchema>) {
   return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
         where: { id: payload.paymentId },
      })

      if (!payment) {
         throw new Error('PAYMENT_NOT_FOUND')
      }

      const isSuccess = payload.status === 'success'
      const updatedPayment = await tx.payment.update({
         where: { id: payment.id },
         data: {
            status: isSuccess ? 'Paid' : 'Failed',
            isSuccessful: isSuccess,
         },
      })

      const updatedOrder = await tx.order.update({
         where: { id: payment.orderId },
         data: {
            isPaid: isSuccess,
            ...(isSuccess ? { status: 'Processing' } : {}),
         },
      })

      return { payment: updatedPayment, order: updatedOrder, isSuccess }
   })
}

export async function GET(req: Request) {
   try {
      const { searchParams } = new URL(req.url)
      const payload = verifySchema.parse({
         paymentId: searchParams.get('paymentId'),
         status: searchParams.get('status') ?? 'success',
      })

      const result = await verifyPayment(payload)
      const redirectUrl = new URL(
         `/profile/orders/${result.order.id}?payment=${result.isSuccess ? 'success' : 'failed'}`,
         req.url
      )
      return NextResponse.redirect(redirectUrl)
   } catch (error) {
      if (error instanceof z.ZodError) {
         return NextResponse.json(
            { message: 'Invalid verify query', issues: error.issues },
            { status: 400 }
         )
      }
      if (error instanceof Error && error.message === 'PAYMENT_NOT_FOUND') {
         return new NextResponse('Payment not found', { status: 404 })
      }

      console.error('[PAYMENTS_VERIFY_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function POST(req: Request) {
   try {
      const payload = verifySchema.parse(await req.json())
      const result = await verifyPayment(payload)
      return NextResponse.json(result)
   } catch (error) {
      if (error instanceof z.ZodError) {
         return NextResponse.json(
            { message: 'Invalid verify payload', issues: error.issues },
            { status: 400 }
         )
      }
      if (error instanceof Error && error.message === 'PAYMENT_NOT_FOUND') {
         return new NextResponse('Payment not found', { status: 404 })
      }

      console.error('[PAYMENTS_VERIFY_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
