import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const initiateSchema = z.object({
   orderId: z.string().min(1),
})

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const { orderId } = initiateSchema.parse(await req.json())
      const order = await prisma.order.findUnique({
         where: {
            id: orderId,
            userId,
         },
      })

      if (!order) {
         return new NextResponse('Order not found', { status: 404 })
      }

      if (order.isPaid) {
         return new NextResponse('Order is already paid', { status: 400 })
      }

      const provider = await prisma.paymentProvider.upsert({
         where: {
            title: 'MockGateway',
         },
         create: {
            title: 'MockGateway',
            description: 'Mock payment provider for local checkout flow',
            isActive: true,
         },
         update: {
            isActive: true,
         },
      })

      const refId = `MOCK-${Date.now()}-${Math.floor(Math.random() * 100000)}`
      const payment = await prisma.payment.create({
         data: {
            status: 'Processing',
            refId,
            payable: order.payable,
            isSuccessful: false,
            providerId: provider.id,
            userId,
            orderId: order.id,
         },
      })

      const baseUrl = new URL(req.url).origin
      const redirectUrl = `${baseUrl}/api/payments/verify?paymentId=${payment.id}&status=success`

      return NextResponse.json({
         paymentId: payment.id,
         redirectUrl,
      })
   } catch (error) {
      if (error instanceof z.ZodError) {
         return NextResponse.json(
            { message: 'Invalid initiate payload', issues: error.issues },
            { status: 400 }
         )
      }

      console.error('[PAYMENTS_INITIATE_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
