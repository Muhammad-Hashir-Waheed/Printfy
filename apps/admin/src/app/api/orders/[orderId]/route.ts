import prisma from '@/lib/prisma'
import { OrderStatusEnum } from '@prisma/client'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const orderPatchSchema = z.object({
   status: z.nativeEnum(OrderStatusEnum).optional(),
   shipping: z.coerce.number().min(0).optional(),
   payable: z.coerce.number().min(0).optional(),
   discount: z.coerce.number().min(0).optional(),
   isPaid: z.boolean().optional(),
   isCompleted: z.boolean().optional(),
})

export async function PATCH(
   req: Request,
   { params }: { params: { orderId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!params.orderId) {
         return new NextResponse('Order id is required', { status: 400 })
      }

      const payload = orderPatchSchema.parse(await req.json())

      const order = await prisma.order.update({
         where: { id: params.orderId },
         data: payload,
      })

      return NextResponse.json(order)
   } catch (error) {
      console.error('[ORDER_PATCH]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
