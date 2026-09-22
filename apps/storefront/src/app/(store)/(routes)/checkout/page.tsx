'use client'

import { Heading } from '@/components/native/heading'
import { ProductImage } from '@/components/native/ProductImage'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { calculatePrice } from '@domain-pricing'
import { getLocalCart, writeLocalCart } from '@/lib/cart'
import type { CartLineItem } from '@/lib/cart-lines'
import { resolveProductImages } from '@/lib/catalog-images'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

const SHIPPING_FEE = 5

function formatCardNumber(value: string) {
   return value
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, '$1 ')
      .trim()
}

export default function CheckoutPage() {
   const router = useRouter()
   const [step, setStep] = useState(1)
   const [loading, setLoading] = useState(false)
   const [errorMessage, setErrorMessage] = useState('')
   const [cartItems, setCartItems] = useState<CartLineItem[]>([])

   const [fullName, setFullName] = useState('')
   const [phone, setPhone] = useState('')
   const [address, setAddress] = useState('')
   const [city, setCity] = useState('')
   const [postalCode, setPostalCode] = useState('')
   const [discountCode, setDiscountCode] = useState('')

   const [cardName, setCardName] = useState('')
   const [cardNumber, setCardNumber] = useState('')
   const [cardExpiry, setCardExpiry] = useState('')
   const [cardCvv, setCardCvv] = useState('')

   useEffect(() => {
      const cart = getLocalCart() as { items?: CartLineItem[] }
      setCartItems(cart?.items ?? [])
   }, [])

   const lineTotals = useMemo(() => {
      return cartItems.map((item) => {
         const variants =
            item.selectedVariants ?? (item as any).customDesign?.variants ?? []
         const pricing = calculatePrice({
            basePrice: Number(item.product?.price ?? 0),
            quantity: Number(item.count ?? 1),
            variants,
            discount: Number(item.product?.discount ?? 0),
         })
         return { item, pricing }
      })
   }, [cartItems])

   const subtotal = useMemo(
      () => lineTotals.reduce((sum, row) => sum + row.pricing.total, 0),
      [lineTotals]
   )

   const total = subtotal + SHIPPING_FEE

   const canContinueShipping =
      fullName.trim().length >= 2 &&
      phone.trim().length >= 5 &&
      address.trim().length >= 5 &&
      city.trim().length >= 2 &&
      postalCode.trim().length >= 3

   const canContinuePayment =
      cardName.trim().length >= 2 &&
      cardNumber.replace(/\s/g, '').length === 16 &&
      /^\d{2}\/\d{2}$/.test(cardExpiry.trim()) &&
      cardCvv.trim().length >= 3

   const submitCheckout = async () => {
      if (!cartItems.length) {
         setErrorMessage('Your cart is empty.')
         return
      }

      try {
         setLoading(true)
         setErrorMessage('')

         const payload = {
            fullName: fullName.trim(),
            phone: phone.trim(),
            address: address.trim(),
            city: city.trim(),
            postalCode: postalCode.trim(),
            discountCode: discountCode.trim() || undefined,
            cardLast4: cardNumber.replace(/\s/g, '').slice(-4),
            items: cartItems.map((item) => ({
               productId: item.productId,
               count: item.count,
               selectedVariants: item.selectedVariants,
               customDesign: (item as any).customDesign,
            })),
         }

         const response = await fetch('/api/checkout/demo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload),
         })

         if (!response.ok) {
            throw new Error(await response.text())
         }

         const result = await response.json()
         writeLocalCart({ items: [] })
         router.push(result.redirectUrl ?? `/checkout/success?orderId=${result.orderId}`)
      } catch (error) {
         setErrorMessage(
            error instanceof Error ? error.message : 'Checkout failed. Please try again.'
         )
      } finally {
         setLoading(false)
      }
   }

   if (!cartItems.length) {
      return (
         <div className="space-y-4 py-8 text-center">
            <Heading title="Checkout" description="Your cart is empty." />
            <Button asChild className="rounded-2xl">
               <Link href="/products">Browse products</Link>
            </Button>
         </div>
      )
   }

   return (
      <div className="space-y-6 pb-6">
         <Heading
            title="Checkout"
            description="Enter shipping and payment details to complete your order."
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
                              <div className="space-y-1 md:col-span-2">
                                 <Label htmlFor="fullName">Full name</Label>
                                 <input
                                    id="fullName"
                                    className="h-10 w-full rounded-2xl border bg-background px-3 text-sm"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                 />
                              </div>
                              <div className="space-y-1">
                                 <Label htmlFor="phone">Phone</Label>
                                 <input
                                    id="phone"
                                    className="h-10 w-full rounded-2xl border bg-background px-3 text-sm"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                 />
                              </div>
                              <div className="space-y-1">
                                 <Label htmlFor="discount">Discount code (optional)</Label>
                                 <input
                                    id="discount"
                                    className="h-10 w-full rounded-2xl border bg-background px-3 text-sm"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value)}
                                 />
                              </div>
                              <div className="space-y-1 md:col-span-2">
                                 <Label htmlFor="address">Address</Label>
                                 <input
                                    id="address"
                                    className="h-10 w-full rounded-2xl border bg-background px-3 text-sm"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                 />
                              </div>
                              <div className="space-y-1">
                                 <Label htmlFor="city">City</Label>
                                 <input
                                    id="city"
                                    className="h-10 w-full rounded-2xl border bg-background px-3 text-sm"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                 />
                              </div>
                              <div className="space-y-1">
                                 <Label htmlFor="postal">Postal code</Label>
                                 <input
                                    id="postal"
                                    className="h-10 w-full rounded-2xl border bg-background px-3 text-sm"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                 />
                              </div>
                           </div>
                        </>
                     ) : null}

                     {step === 2 ? (
                        <>
                           <h3 className="font-semibold">Payment</h3>
                           <p className="text-xs text-muted-foreground">
                              Demo mode — card data is validated locally and not stored.
                           </p>
                           <div className="grid gap-3 md:grid-cols-2">
                              <div className="space-y-1 md:col-span-2">
                                 <Label htmlFor="cardName">Name on card</Label>
                                 <input
                                    id="cardName"
                                    className="h-10 w-full rounded-2xl border bg-background px-3 text-sm"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                 />
                              </div>
                              <div className="space-y-1 md:col-span-2">
                                 <Label htmlFor="cardNumber">Card number</Label>
                                 <input
                                    id="cardNumber"
                                    className="h-10 w-full rounded-2xl border bg-background px-3 text-sm"
                                    placeholder="4242 4242 4242 4242"
                                    value={cardNumber}
                                    onChange={(e) =>
                                       setCardNumber(formatCardNumber(e.target.value))
                                    }
                                 />
                              </div>
                              <div className="space-y-1">
                                 <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                                 <input
                                    id="expiry"
                                    className="h-10 w-full rounded-2xl border bg-background px-3 text-sm"
                                    placeholder="12/28"
                                    value={cardExpiry}
                                    onChange={(e) => {
                                       const digits = e.target.value.replace(/\D/g, '').slice(0, 4)
                                       const formatted =
                                          digits.length > 2
                                             ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                                             : digits
                                       setCardExpiry(formatted)
                                    }}
                                 />
                              </div>
                              <div className="space-y-1">
                                 <Label htmlFor="cvv">CVV</Label>
                                 <input
                                    id="cvv"
                                    className="h-10 w-full rounded-2xl border bg-background px-3 text-sm"
                                    placeholder="123"
                                    value={cardCvv}
                                    onChange={(e) =>
                                       setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))
                                    }
                                 />
                              </div>
                           </div>
                        </>
                     ) : null}

                     {step === 3 ? (
                        <>
                           <h3 className="font-semibold">Review your order</h3>
                           <p className="text-sm text-muted-foreground">
                              {fullName} · {phone}
                           </p>
                           <p className="text-sm text-muted-foreground">
                              {address}, {city} {postalCode}
                           </p>
                           <p className="text-sm text-muted-foreground">
                              Card ending in {cardNumber.replace(/\s/g, '').slice(-4) || '----'}
                           </p>
                        </>
                     ) : null}
                  </CardContent>
               </Card>

               {lineTotals.map(({ item }) => {
                  const image = resolveProductImages(
                     item.productId,
                     (item.product as any)?.images
                  )[0]

                  return (
                     <Card key={item.lineKey} className="rounded-2xl border shadow-sm">
                        <CardContent className="flex gap-4 p-4">
                           <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                              <ProductImage
                                 productId={item.productId}
                                 src={image}
                                 alt={(item.product as any)?.title ?? 'Product'}
                                 sizes="80px"
                              />
                           </div>
                           <div className="min-w-0 flex-1">
                              <p className="font-medium">{(item.product as any)?.title}</p>
                              <p className="text-sm text-muted-foreground">Qty: {item.count}</p>
                              {item.selectedVariants?.length ? (
                                 <p className="text-xs text-muted-foreground">
                                    {item.selectedVariants
                                       .map((v) => `${v.name}: ${v.value}`)
                                       .join(' · ')}
                                 </p>
                              ) : null}
                           </div>
                        </CardContent>
                     </Card>
                  )
               })}
            </div>

            <Card className="h-fit rounded-2xl border shadow-sm lg:sticky lg:top-24">
               <CardContent className="space-y-3 p-4">
                  <div className="flex justify-between text-sm">
                     <span className="text-muted-foreground">Subtotal</span>
                     <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                     <span className="text-muted-foreground">Shipping</span>
                     <span>${SHIPPING_FEE.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                     <span>Total</span>
                     <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                     <Button
                        variant="ghost"
                        className="w-full rounded-2xl"
                        disabled={step === 1 || loading}
                        onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                     >
                        Back
                     </Button>
                     <Button
                        className="w-full rounded-2xl"
                        disabled={loading}
                        onClick={() => {
                           if (step === 1) {
                              if (!canContinueShipping) {
                                 setErrorMessage('Complete all shipping fields.')
                                 return
                              }
                              setErrorMessage('')
                              setStep(2)
                              return
                           }
                           if (step === 2) {
                              if (!canContinuePayment) {
                                 setErrorMessage('Enter valid payment details.')
                                 return
                              }
                              setErrorMessage('')
                              setStep(3)
                              return
                           }
                           submitCheckout()
                        }}
                     >
                        {step === 3
                           ? loading
                              ? 'Processing...'
                              : 'Place order'
                           : 'Continue'}
                     </Button>
                  </div>
                  {errorMessage ? (
                     <p className="text-xs text-destructive">{errorMessage}</p>
                  ) : null}
                  <Button asChild variant="outline" className="w-full rounded-2xl">
                     <Link href="/cart">Back to cart</Link>
                  </Button>
               </CardContent>
            </Card>
         </div>
      </div>
   )
}
