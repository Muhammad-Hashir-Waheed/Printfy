'use client'

import { Heading } from '@/components/native/heading'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { calculatePrice } from '@domain-pricing'
import { getLocalCart } from '@/lib/cart'
import { cn } from '@/lib/utils'
import { useMemo, useState } from 'react'

export default function CheckoutPage() {
   const [step, setStep] = useState(1)
   const [loading, setLoading] = useState(false)
   const [errorMessage, setErrorMessage] = useState('')
   const [fullName, setFullName] = useState('')
   const [phone, setPhone] = useState('')
   const [address, setAddress] = useState('')
   const [city, setCity] = useState('')
   const [postalCode, setPostalCode] = useState('')
   const cart = getLocalCart() ?? { items: [] }
   const payable = useMemo(
      () =>
         cart.items.reduce(
            (sum, item) =>
               sum +
               calculatePrice({
                  basePrice: Number(item.product?.price ?? 0),
                  quantity: Number(item.count ?? 1),
                  discount: Number(item.product?.discount ?? 0),
                  variants:
                     item.selectedVariants ?? item.customDesign?.variants ?? [],
               }).total,
            0
         ),
      [cart.items]
   )

   const submitCheckout = async () => {
      try {
         setLoading(true)
         setErrorMessage('')

         const checkoutResponse = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               phone,
               address,
               city,
               postalCode,
               items: cart.items ?? [],
            }),
         })

         if (!checkoutResponse.ok) {
            throw new Error(await checkoutResponse.text())
         }

         const checkoutPayload = await checkoutResponse.json()
         const paymentResponse = await fetch('/api/payments/initiate', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               orderId: checkoutPayload.orderId,
            }),
         })

         if (!paymentResponse.ok) {
            throw new Error(await paymentResponse.text())
         }

         const paymentPayload = await paymentResponse.json()
         window.location.assign(paymentPayload.redirectUrl)
      } catch (error) {
         setErrorMessage(
            error instanceof Error ? error.message : 'Checkout failed.'
         )
      } finally {
         setLoading(false)
      }
   }

   return (
      <div className="space-y-6 pb-6">
         <Heading
            title="Checkout"
            description="Review order details before payment."
         />
         <div className="grid grid-cols-1 gap-2 rounded-2xl border p-2 sm:grid-cols-3">
            {[
               { id: 1, label: 'Shipping' },
               { id: 2, label: 'Payment' },
               { id: 3, label: 'Review' },
            ].map((item) => (
               <button
                  key={item.id}
                  type="button"
                  onClick={() => setStep(item.id)}
                  className={cn(
                     'rounded-2xl px-3 py-2 text-sm transition duration-200',
                     step === item.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'hover:bg-accent'
                  )}
               >
                  {item.id}. {item.label}
               </button>
            ))}
         </div>

         <div className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-3 lg:col-span-2">
               <Card className="rounded-2xl border shadow-sm">
                  <CardContent className="space-y-4 p-4">
                     {step === 1 ? (
                        <>
                           <h3 className="font-semibold">Shipping details</h3>
                           <div className="grid gap-3 md:grid-cols-2">
                              <input
                                 className="h-10 rounded-2xl border bg-background px-3 text-sm"
                                 placeholder="Full name"
                                 value={fullName}
                                 onChange={(event) => setFullName(event.target.value)}
                              />
                              <input
                                 className="h-10 rounded-2xl border bg-background px-3 text-sm"
                                 placeholder="Phone number"
                                 value={phone}
                                 onChange={(event) => setPhone(event.target.value)}
                              />
                              <input
                                 className="h-10 rounded-2xl border bg-background px-3 text-sm md:col-span-2"
                                 placeholder="Address"
                                 value={address}
                                 onChange={(event) => setAddress(event.target.value)}
                              />
                              <input
                                 className="h-10 rounded-2xl border bg-background px-3 text-sm"
                                 placeholder="City"
                                 value={city}
                                 onChange={(event) => setCity(event.target.value)}
                              />
                              <input
                                 className="h-10 rounded-2xl border bg-background px-3 text-sm"
                                 placeholder="Postal code"
                                 value={postalCode}
                                 onChange={(event) =>
                                    setPostalCode(event.target.value)
                                 }
                              />
                           </div>
                        </>
                     ) : null}
                     {step === 2 ? (
                        <>
                           <h3 className="font-semibold">Payment</h3>
                           <div className="grid gap-3 md:grid-cols-2">
                              <input
                                 className="h-10 rounded-2xl border bg-background px-3 text-sm md:col-span-2"
                                 placeholder="Card number"
                              />
                              <input
                                 className="h-10 rounded-2xl border bg-background px-3 text-sm"
                                 placeholder="MM/YY"
                              />
                              <input
                                 className="h-10 rounded-2xl border bg-background px-3 text-sm"
                                 placeholder="CVV"
                              />
                           </div>
                        </>
                     ) : null}
                     {step === 3 ? (
                        <>
                           <h3 className="font-semibold">Review your order</h3>
                           <p className="text-sm text-muted-foreground">
                              Confirm delivery and payment details before placing your order.
                           </p>
                        </>
                     ) : null}
                  </CardContent>
               </Card>

               {cart.items.map((item, index) => (
                  <Card key={index} className="rounded-2xl border shadow-sm">
                     <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                           <img
                              src={item.product?.images?.[0]}
                              alt={item.product?.title}
                              className="h-16 w-16 rounded-xl object-cover"
                           />
                           <div>
                              <p className="font-medium">{item.product?.title}</p>
                              <p className="text-sm text-muted-foreground">
                                 Qty: {item.count}
                              </p>
                              {(item as any).customDesign ? (
                                 <p className="text-xs text-muted-foreground">
                                    {((item as any).customDesign.variants ?? [])
                                       .map((variant) => `${variant.name}: ${variant.value}`)
                                       .join(' / ')}
                                 </p>
                              ) : null}
                           </div>
                        </div>
                        {(item as any).customDesign?.designImage ? (
                           <img
                              src={(item as any).customDesign.designImage}
                              alt="Customization"
                              className="h-14 w-14 self-start rounded-xl border object-cover sm:self-auto"
                           />
                        ) : null}
                     </CardContent>
                  </Card>
               ))}
            </div>
            <Card className="h-fit rounded-2xl border shadow-sm">
               <CardContent className="space-y-3 p-4">
                  <div className="flex items-center justify-between">
                     <span className="text-muted-foreground">Subtotal</span>
                     <span>${payable.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-muted-foreground">Shipping</span>
                     <span>$5.00</span>
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                     <span>Total</span>
                     <span>${(payable + 5).toFixed(2)}</span>
                  </div>
                  <div className="flex gap-2">
                     <Button
                        variant="ghost"
                        className="w-full"
                        disabled={step === 1}
                        onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                     >
                        Back
                     </Button>
                     <Button
                        className="w-full rounded-2xl"
                        disabled={loading}
                        onClick={() => {
                           if (step < 3) {
                              setStep((prev) => prev + 1)
                              return
                           }

                           submitCheckout()
                        }}
                     >
                        {step === 3
                           ? loading
                              ? 'Processing...'
                              : 'Place Order'
                           : 'Continue'}
                     </Button>
                  </div>
                  {errorMessage ? (
                     <p className="text-xs text-red-500">{errorMessage}</p>
                  ) : null}
               </CardContent>
            </Card>
         </div>
      </div>
   )
}
