'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader } from '@/components/ui/loader'
import { useAuthenticated } from '@/hooks/useAuthentication'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { UserCombobox } from '../components/switcher'
import type { OrderColumn } from './components/table'
import { OrdersTable } from './components/table'

export default function UserPage() {
   const { authenticated } = useAuthenticated()
   const [orders, setOrders] = useState<any[] | null>(null)
   const [error, setError] = useState<string | null>(null)
   const pathname = usePathname()

   useEffect(() => {
      if (!authenticated) return

      async function getOrders() {
         try {
            const response = await fetch(`/api/orders`, {
               method: 'GET',
               cache: 'no-store',
            })

            if (!response.ok) {
               setError('We could not load your orders right now.')
               setOrders([])
               return
            }

            const json = await response.json()
            setOrders(Array.isArray(json) ? json : [])
         } catch (error) {
            console.error({ error })
            setError('We could not load your orders right now.')
            setOrders([])
         }
      }

      getOrders()
   }, [authenticated])

   return (
      <div className="flex-col">
         <div className="flex-1 ">
            <div className="flex items-center justify-between">
               <UserCombobox initialValue={pathname} />
            </div>
            {orders === null ? (
               <Card className="my-4 bg-muted-foreground/5">
                  <CardContent>
                     <div className="h-[20vh]">
                        <div className="h-full my-4 flex items-center justify-center">
                           <Loader />
                        </div>
                     </div>
                  </CardContent>
               </Card>
            ) : orders.length === 0 ? (
               <Card className="my-4 rounded-2xl border shadow-sm">
                  <CardContent className="space-y-3 p-8 text-center">
                     <h3 className="text-lg font-semibold">No orders yet</h3>
                     <p className="text-sm text-muted-foreground">
                        {error ??
                           'When you place your first packaging order it will appear here.'}
                     </p>
                     <div className="flex flex-col justify-center gap-2 pt-2 sm:flex-row">
                        <Button asChild className="rounded-2xl">
                           <Link href="/products">Browse packaging</Link>
                        </Button>
                        <Button asChild variant="outline" className="rounded-2xl">
                           <Link href="/cart">View cart</Link>
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            ) : (
               <OrderSection orders={orders} />
            )}
         </div>
      </div>
   )
}

function OrderSection({ orders }) {
   const formattedOrders: OrderColumn[] = orders.map((order) => ({
      id: order.id,
      number: `Order #${order.number}`,
      date: order.createdAt.toString(),
      payable: '$' + order.payable.toString(),
      isPaid: order.isPaid,
   }))

   return <OrdersTable data={formattedOrders} />
}
