'use client'

import { Heading } from '@/components/native/heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader } from '@/components/ui/loader'
import { useAuthenticated } from '@/hooks/useAuthentication'
import { format } from 'date-fns'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { UserCombobox } from '../components/switcher'

type PaymentRow = {
   id: string
   number: number
   orderId: string
   orderNumber: number
   status: string
   payable: number
   isSuccessful: boolean
   createdAt: string
}

export default function PaymentsPage() {
   const { authenticated } = useAuthenticated()
   const [payments, setPayments] = useState<PaymentRow[] | null>(null)
   const [error, setError] = useState<string | null>(null)
   const pathname = usePathname()

   useEffect(() => {
      if (!authenticated) return

      async function getPayments() {
         try {
            const response = await fetch('/api/orders', { cache: 'no-store' })

            if (!response.ok) {
               setError('We could not load your payments right now.')
               setPayments([])
               return
            }

            const orders = await response.json()

            if (!Array.isArray(orders)) {
               setPayments([])
               return
            }

            const rows: PaymentRow[] = orders.flatMap((order: any) =>
               (order.payments ?? []).map((payment: any) => ({
                  id: payment.id,
                  number: payment.number,
                  orderId: order.id,
                  orderNumber: order.number,
                  status: payment.status,
                  payable: payment.payable,
                  isSuccessful: payment.isSuccessful,
                  createdAt: payment.createdAt,
               }))
            )

            rows.sort(
               (a, b) =>
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )

            setPayments(rows)
         } catch {
            setError('We could not load your payments right now.')
            setPayments([])
         }
      }

      getPayments()
   }, [authenticated])

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <UserCombobox initialValue={pathname} />
         </div>

         <Heading
            title="Payments"
            description="Every payment attempt linked to your orders."
         />

         {payments === null ? (
            <Card className="rounded-2xl border shadow-sm">
               <CardContent className="flex h-[20vh] items-center justify-center">
                  <Loader />
               </CardContent>
            </Card>
         ) : null}

         {payments !== null && payments.length === 0 ? (
            <Card className="rounded-2xl border shadow-sm">
               <CardContent className="space-y-3 p-8 text-center">
                  <h3 className="text-lg font-semibold">No payments yet</h3>
                  <p className="text-sm text-muted-foreground">
                     {error ??
                        'Once you complete a checkout, your payment history will show up here.'}
                  </p>
                  <div className="flex flex-col justify-center gap-2 pt-2 sm:flex-row">
                     <Button asChild className="rounded-2xl">
                        <Link href="/products">Browse packaging</Link>
                     </Button>
                     <Button asChild variant="outline" className="rounded-2xl">
                        <Link href="/profile/orders">View orders</Link>
                     </Button>
                  </div>
               </CardContent>
            </Card>
         ) : null}

         {payments && payments.length > 0 ? (
            <div className="grid gap-3">
               {payments.map((payment) => (
                  <Card key={payment.id} className="rounded-2xl border shadow-sm">
                     <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                        <div className="space-y-1">
                           <p className="font-medium">Payment #{payment.number}</p>
                           <p className="text-sm text-muted-foreground">
                              Order #{payment.orderNumber} ·{' '}
                              {payment.createdAt
                                 ? format(new Date(payment.createdAt), 'PPP')
                                 : '—'}
                           </p>
                        </div>
                        <div className="flex items-center gap-3">
                           <Badge
                              variant={
                                 payment.isSuccessful ? 'default' : 'secondary'
                              }
                              className="rounded-2xl"
                           >
                              {payment.status}
                           </Badge>
                           <p className="font-semibold">
                              ${Number(payment.payable ?? 0).toFixed(2)}
                           </p>
                           <Button asChild variant="outline" className="rounded-2xl">
                              <Link href={`/profile/orders/${payment.orderId}`}>
                                 View order
                              </Link>
                           </Button>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>
         ) : null}
      </div>
   )
}
