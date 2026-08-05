'use client'

import { Button } from '@/components/ui/button'
import {
   Card,
   CardContent,
} from '@/components/ui/card'
import { Loader } from '@/components/ui/loader'
import { useAuthenticated } from '@/hooks/useAuthentication'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { UserCombobox } from '../../components/switcher'

const ProductPage = ({ params }: { params: { orderId: string } }) => {
   const { authenticated } = useAuthenticated()
   const [order, setOrder] = useState(null)
   const [unavailable, setUnavailable] = useState(false)
   const pathname = usePathname()

   useEffect(() => {
      if (!authenticated) return

      async function getOrder() {
         try {
            const response = await fetch(`/api/orders/${params.orderId}`, {
               method: 'GET',
               cache: 'no-store',
            })

            if (!response.ok) {
               setUnavailable(true)
               return
            }

            const json = await response.json()
            setOrder(json)
         } catch (error) {
            console.error({ error })
            setUnavailable(true)
         }
      }

      getOrder()
   }, [authenticated, params])

   useEffect(() => {
      if (!authenticated || unavailable) return

      const interval = setInterval(async () => {
         try {
            const response = await fetch(`/api/orders/${params.orderId}`, {
               method: 'GET',
               cache: 'no-store',
            })
            if (response.ok) {
               const json = await response.json()
               setOrder(json)
            }
         } catch (error) {
            console.error({ error })
         }
      }, 5000)

      return () => clearInterval(interval)
   }, [authenticated, unavailable, params.orderId])

   function EditOrderCard() {
      const fulfillmentSteps = ['pending', 'printing', 'packed', 'shipped', 'delivered']
      const currentFulfillment = order?.fulfillmentStatus ?? 'pending'
      const currentIndex = Math.max(fulfillmentSteps.indexOf(currentFulfillment), 0)
      const progress = ((currentIndex + 1) / fulfillmentSteps.length) * 100

      const timeline = [
         'Processing',
         'Shipped',
         'Delivered',
         'ReturnProcessing',
         'ReturnCompleted',
         'RefundProcessing',
         'RefundCompleted',
         'Cancelled',
         'Denied',
      ]

      return (
         <Card className="my-4 p-2">
            <CardContent>
               {order ? (
                  <div className="space-y-4 py-3">
                     <div className="grid gap-2 rounded-xl border p-3 text-sm md:grid-cols-4">
                        <div>
                           <p className="text-muted-foreground">Order</p>
                           <p className="font-medium">#{order.number}</p>
                        </div>
                        <div>
                           <p className="text-muted-foreground">Status</p>
                           <p className="font-medium">{order.status}</p>
                        </div>
                        <div>
                           <p className="text-muted-foreground">Paid</p>
                           <p className="font-medium">{order.isPaid ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                           <p className="text-muted-foreground">Created</p>
                           <p className="font-medium">
                              {new Date(order.createdAt).toLocaleDateString()}
                           </p>
                        </div>
                     </div>

                     <div className="rounded-xl border p-3">
                        <div className="mb-2 flex items-center justify-between text-sm">
                           <p className="font-semibold">Fulfillment progress</p>
                           <p className="capitalize">{currentFulfillment}</p>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                           <div
                              className="h-2 rounded-full bg-primary transition-all duration-300"
                              style={{ width: `${progress}%` }}
                           />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                           {fulfillmentSteps.map((step, index) => (
                              <span
                                 key={step}
                                 className={`rounded-full border px-3 py-1 text-xs capitalize ${index <= currentIndex ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                              >
                                 {step}
                              </span>
                           ))}
                        </div>
                     </div>

                     <div className="rounded-xl border p-3">
                        <p className="mb-3 text-sm font-semibold">Status timeline</p>
                        <div className="flex flex-wrap gap-2">
                           {timeline.map((step) => {
                              const isActive = step === order.status
                              return (
                                 <span
                                    key={step}
                                    className={`rounded-full border px-3 py-1 text-xs ${isActive ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                                 >
                                    {step}
                                 </span>
                              )
                           })}
                        </div>
                     </div>

                     <div className="space-y-2 rounded-xl border p-3">
                        <p className="text-sm font-semibold">Products</p>
                        {order.orderItems.map((item) => (
                           <div
                              key={`${item.orderId}-${item.productId}`}
                              className="flex items-center justify-between gap-3 rounded-lg border p-2"
                           >
                              <div className="flex items-center gap-3">
                                 <img
                                    src={item.product?.images?.[0]}
                                    alt={item.product?.title}
                                    className="h-12 w-12 rounded-md object-cover"
                                 />
                                 <div>
                                    <p className="text-sm font-medium">{item.product?.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                       Qty: {item.count} | Unit: $
                                       {Number(item.price).toFixed(2)}
                                    </p>
                                 </div>
                              </div>
                              {item.previewUrl ? (
                                 <img
                                    src={item.previewUrl}
                                    alt="Design preview"
                                    className="h-12 w-12 rounded-md border object-cover"
                                 />
                              ) : null}
                           </div>
                        ))}
                     </div>

                     <div className="rounded-xl border p-3">
                        <p className="mb-2 text-sm font-semibold">Pricing breakdown</p>
                        <div className="space-y-1 text-sm">
                           <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Subtotal</span>
                              <span>${Number(order.total).toFixed(2)}</span>
                           </div>
                           <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Discount</span>
                              <span>-${Number(order.discount).toFixed(2)}</span>
                           </div>
                           <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Tax</span>
                              <span>${Number(order.tax).toFixed(2)}</span>
                           </div>
                           <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Shipping</span>
                              <span>${Number(order.shipping).toFixed(2)}</span>
                           </div>
                           <div className="flex items-center justify-between font-semibold">
                              <span>Payable</span>
                              <span>${Number(order.payable).toFixed(2)}</span>
                           </div>
                        </div>
                     </div>

                     {order.shipment ? (
                        <div className="space-y-2 rounded-xl border p-3">
                           <p className="text-sm font-semibold">Tracking</p>
                           <div className="text-sm">
                              <p>Carrier: {order.shipment.carrier}</p>
                              <p>Tracking number: {order.shipment.trackingNumber}</p>
                              <p className="capitalize">Shipment status: {order.shipment.status}</p>
                           </div>
                           <div className="space-y-2">
                              {(order.shipment.trackingEvents ?? []).map((event) => (
                                 <div
                                    key={event.id}
                                    className="flex items-center justify-between rounded-lg border p-2 text-xs"
                                 >
                                    <span className="capitalize">{event.status}</span>
                                    <span className="text-muted-foreground">{event.location}</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                     ) : null}
                  </div>
               ) : unavailable ? (
                  <div className="space-y-3 py-8 text-center">
                     <h3 className="text-lg font-semibold">Order not available</h3>
                     <p className="text-sm text-muted-foreground">
                        We could not find this order on your account. Demo
                        checkouts are not stored, so they have no order detail
                        page.
                     </p>
                     <div className="flex flex-col justify-center gap-2 pt-2 sm:flex-row">
                        <Button asChild className="rounded-2xl">
                           <Link href="/profile/orders">All orders</Link>
                        </Button>
                        <Button asChild variant="outline" className="rounded-2xl">
                           <Link href="/products">Browse packaging</Link>
                        </Button>
                     </div>
                  </div>
               ) : (
                  <div className="h-[20vh]">
                     <div className="h-full my-4 flex items-center justify-center">
                        <Loader />
                     </div>
                  </div>
               )}
            </CardContent>
         </Card>
      )
   }

   return (
      <div className="flex-col">
         <div className="flex-1">
            <div className="flex items-center justify-between">
               <div className="flex items-center justify-between">
                  <UserCombobox initialValue={pathname} />
               </div>
            </div>
            <EditOrderCard />
         </div>
      </div>
   )
}

export default ProductPage
