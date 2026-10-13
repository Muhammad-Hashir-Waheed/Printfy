import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import prisma from '@/lib/prisma'
import { format } from 'date-fns'

import { SortBy } from './components/options'
import type { OrderColumn } from './components/table'
import { OrderTable } from './components/table'

export default async function OrdersPage({ searchParams }) {
   const {
      userId,
      sort,
      isPaid,
      brand,
      category,
      page = 1,
      minPayable,
      maxPayable,
   } = searchParams ?? null

   const orderBy = getOrderBy(sort)

   const orders = await prisma.order.findMany({
      where: {
         userId,
         isPaid,
         orderItems: {
            some: {
               product: {
                  brand: {
                     title: {
                        contains: brand,
                     },
                  },
                  categories: {
                     some: {
                        title: {
                           contains: category,
                        },
                     },
                  },
               },
            },
         },
         payable: {
            gte: minPayable,
            lte: maxPayable,
         },
      },
      include: {
         orderItems: {
            include: {
               product: true,
            },
         },
      },
      skip: (page - 1) * 12,
      take: 12,
      orderBy,
   })

   const formattedOrders: OrderColumn[] = orders.map((order) => {
      const customizedItem = order.orderItems.find((item) =>
         Boolean((item.product as any)?.metadata?.isCustomized)
      )

      return {
         id: order.id,
         number: `Order #${order.number}`,
         date: order.createdAt.toUTCString(),
         payable: '$' + order.payable.toString(),
         isPaid: order.isPaid,
         fulfillmentStatus: order.fulfillmentStatus,
         createdAt: format(order.createdAt, 'MMMM do, yyyy'),
         hasCustomizedProduct: Boolean(customizedItem),
         previewImage: customizedItem?.product?.images?.[0],
      }
   })

   return (
      <div className="block space-y-4 my-6">
         <Heading
            title={`Orders (${orders.length})`}
            description="Manage orders for your store"
         />
         <Separator />
         <div className="grid grid-cols-4 gap-2">
            <SortBy initialData={'highest_payable'} />
         </div>
         <OrderTable data={formattedOrders} />{' '}
      </div>
   )
}

function getOrderBy(sort) {
   let orderBy

   switch (sort) {
      case 'highest_payable':
         orderBy = {
            payable: 'desc',
         }
         break
      case 'lowest_payable':
         orderBy = {
            payable: 'asc',
         }
         break

      default:
         orderBy = {
            createdAt: 'desc',
         }
         break
   }

   return orderBy
}
