import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
   req: Request,
   { params }: { params: { orderId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const order = await prisma.order.findFirst({
         where: {
            id: params.orderId,
            userId,
         },
         include: {
            orderItems: {
               include: { product: true },
            },
            shipment: {
               include: {
                  trackingEvents: {
                     orderBy: { timestamp: 'desc' },
                  },
               },
            },
            fulfillmentTasks: {
               orderBy: { createdAt: 'asc' },
            },
            fulfillmentEvents: {
               orderBy: { createdAt: 'desc' },
               take: 20,
            },
         },
      })

      if (!order) {
         return new NextResponse('Not found', { status: 404 })
      }

      return NextResponse.json(order)
   } catch (error) {
      console.error('[ORDER_GET_BY_ID]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
