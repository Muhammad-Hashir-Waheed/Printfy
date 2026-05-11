import config from '@/config/site'
import Mail from '@/emails/order_notification_owner'
import {
   DomainOrderError,
   notifyOwnersAboutOrder,
   placeOrderFromUserCart,
} from '@domain-orders'
import prisma from '@/lib/prisma'
import { sendMail } from '@persepolis/mail'
import { render } from '@react-email/render'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const orders = await prisma.order.findMany({
         where: {
            userId,
         },
         include: {
            address: true,
            payments: true,
            refund: true,
            orderItems: true,
         },
      })

      return NextResponse.json(orders)
   } catch (error) {
      console.error('[ORDERS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const { addressId, discountCode } = await req.json()
      if (!addressId) {
         return new NextResponse('Address id is required', { status: 400 })
      }

      const { order, totals } = await placeOrderFromUserCart({
         prisma,
         userId,
         addressId,
         discountCode,
      })

      await notifyOwnersAboutOrder({
         prisma,
         order,
         payable: totals.payable,
         onOwnerNotification: async (owner) => {
            await sendMail({
               name: config.name,
               to: owner.email,
               subject: 'An order was created.',
               html: await render(
                  Mail({
                     id: order.id,
                     payable: totals.payable.toFixed(2),
                     orderNum: order.number.toString(),
                  })
               ),
            })
         },
      })

      return NextResponse.json(order)
   } catch (error) {
      if (error instanceof DomainOrderError && error.code === 'INVALID_DISCOUNT_CODE') {
         return new NextResponse('Invalid or expired discount code', {
            status: 400,
         })
      }
      if (error instanceof DomainOrderError && error.code === 'EMPTY_CART') {
         return new NextResponse('Cart is empty', { status: 400 })
      }

      console.error('[ORDER_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
