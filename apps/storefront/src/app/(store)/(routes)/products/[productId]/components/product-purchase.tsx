'use client'

import { VariantSelector } from '@/components/native/customizer/VariantSelector'
import { Spinner } from '@/components/native/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useAuthenticated } from '@/hooks/useAuthentication'
import { resolveProductImages } from '@/lib/catalog-images'
import {
   getProductType,
   groupVariants,
   isCustomizable,
   type CatalogProduct,
   type SelectedVariant,
} from '@/lib/catalog-client'
import { buildLineKey, getLineCount, upsertCartLine } from '@/lib/cart-lines'
import { getLocalCart, writeLocalCart } from '@/lib/cart'
import { CartContextProvider, useCartContext } from '@/state/Cart'
import { calculatePrice } from '@domain-pricing'
import { MinusIcon, PlusIcon, ShoppingBasketIcon, X } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'

import WishlistButton from './wishlist_button'

function PurchaseInner({ product }: { product: CatalogProduct }) {
   const { authenticated } = useAuthenticated()
   const { cart, dispatchCart } = useCartContext()
   const [fetching, setFetching] = useState(false)
   const [quantity, setQuantity] = useState(1)
   const [selected, setSelected] = useState<
      Record<string, { value: string; priceModifier: number }>
   >({})

   const variantGroups = useMemo(
      () => groupVariants(product.variants ?? []),
      [product.variants]
   )

   const selectedVariants: SelectedVariant[] = useMemo(
      () =>
         Object.entries(selected).map(([name, opt]) => ({
            name,
            value: opt.value,
            priceModifier: opt.priceModifier,
         })),
      [selected]
   )

   const lineKey = buildLineKey(product.id, selectedVariants)
   const cartCount = getLineCount(cart?.items as any, lineKey)

   const unitPricing = calculatePrice({
      basePrice: product.price,
      quantity: 1,
      variants: selectedVariants,
      discount: product.discount,
   })

   const lineTotal = calculatePrice({
      basePrice: product.price,
      quantity,
      variants: selectedVariants,
      discount: product.discount,
   })

   const allVariantsChosen =
      variantGroups.length === 0 ||
      variantGroups.every((g) => selected[g.name]?.value)

   const canAdd = product.isAvailable && allVariantsChosen && quantity >= 1

   const onVariantChange = (
      name: string,
      option: { value: string; priceModifier: number }
   ) => {
      setSelected((prev) => ({ ...prev, [name]: option }))
   }

   async function syncCart(nextItems: ReturnType<typeof upsertCartLine>) {
      writeLocalCart({ items: nextItems })
      dispatchCart({ items: nextItems } as any)

      if (authenticated) {
         const line = nextItems.find((i) => i.lineKey === lineKey)
         await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               productId: product.id,
               count: line?.count ?? 0,
            }),
            cache: 'no-store',
         })
      }
   }

   const productForCart = useMemo(
      () => ({
         ...product,
         images: resolveProductImages(product.id, product.images),
      }),
      [product]
   )

   async function addToCart() {
      if (!canAdd) {
         toast.error('Select all options before adding to cart.')
         return
      }
      try {
         setFetching(true)
         const local = getLocalCart() as { items: any[] }
         const items = local?.items ?? []
         const next = upsertCartLine({
            items,
            productId: product.id,
            product: productForCart,
            selectedVariants,
            delta: quantity,
         })
         await syncCart(next)
         toast.success('Added to cart')
         setQuantity(1)
      } catch (e) {
         console.error(e)
         toast.error('Could not add to cart')
      } finally {
         setFetching(false)
      }
   }

   async function adjustCart(delta: number) {
      try {
         setFetching(true)
         const local = getLocalCart() as { items: any[] }
         const items = local?.items ?? []
         const next = upsertCartLine({
            items,
            productId: product.id,
            product: productForCart,
            selectedVariants,
            delta,
         })
         await syncCart(next)
      } finally {
         setFetching(false)
      }
   }

   return (
      <div className="space-y-4">
         <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="rounded-full border px-3 py-1">{getProductType(product)}</span>
            {(product.metadata as any)?.material ? (
               <span className="rounded-full border px-3 py-1">
                  {(product.metadata as any).material}
               </span>
            ) : null}
            {(product.metadata as any)?.leadTimeDays ? (
               <span className="rounded-full border px-3 py-1">
                  Ships in {(product.metadata as any).leadTimeDays} days
               </span>
            ) : null}
         </div>

         {variantGroups.length > 0 ? (
            <VariantSelector
               variants={variantGroups}
               selected={selected}
               onVariantChange={onVariantChange}
            />
         ) : null}

         <div className="rounded-2xl border bg-card p-4 space-y-3">
            <Label htmlFor="qty">Quantity</Label>
            <div className="flex items-center gap-2">
               <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-xl"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
               >
                  <MinusIcon className="h-4 w-4" />
               </Button>
               <Input
                  id="qty"
                  type="number"
                  min={1}
                  max={99}
                  value={quantity}
                  onChange={(e) =>
                     setQuantity(Math.max(1, Math.min(99, Number(e.target.value) || 1)))
                  }
                  className="w-20 text-center rounded-xl"
               />
               <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-xl"
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
               >
                  <PlusIcon className="h-4 w-4" />
               </Button>
            </div>

            <div className="flex items-baseline justify-between border-t pt-3">
               <div>
                  <p className="text-sm text-muted-foreground">Unit price</p>
                  <p className="text-2xl font-semibold">
                     ${unitPricing.unitPrice.toFixed(2)}
                  </p>
               </div>
               <div className="text-right">
                  <p className="text-sm text-muted-foreground">Line total</p>
                  <p className="text-xl font-semibold">${lineTotal.total.toFixed(2)}</p>
               </div>
            </div>
         </div>

         <Separator />

         <div className="flex flex-wrap gap-2">
            {fetching ? (
               <Button disabled className="rounded-2xl">
                  <Spinner />
               </Button>
            ) : cartCount === 0 ? (
               <Button
                  className="flex gap-2 rounded-2xl"
                  onClick={addToCart}
                  disabled={!canAdd}
               >
                  <ShoppingBasketIcon className="h-4 w-4" />
                  Add to cart
               </Button>
            ) : (
               <>
                  <Button
                     variant="outline"
                     size="icon"
                     className="rounded-xl"
                     onClick={() => adjustCart(-1)}
                  >
                     {cartCount === 1 ? (
                        <X className="h-4 w-4" />
                     ) : (
                        <MinusIcon className="h-4 w-4" />
                     )}
                  </Button>
                  <Button variant="outline" disabled className="rounded-xl min-w-[3rem]">
                     {cartCount}
                  </Button>
                  <Button
                     variant="outline"
                     size="icon"
                     className="rounded-xl"
                     onClick={() => adjustCart(1)}
                  >
                     <PlusIcon className="h-4 w-4" />
                  </Button>
               </>
            )}
            <WishlistButton product={product} />
         </div>

         {!product.isAvailable ? (
            <p className="text-sm text-destructive">Currently out of stock.</p>
         ) : !allVariantsChosen && variantGroups.length > 0 ? (
            <p className="text-sm text-muted-foreground">
               Select {variantGroups.map((g) => g.name.toLowerCase()).join(' and ')} to continue.
            </p>
         ) : null}

         {isCustomizable(product) ? (
            <Link href={`/customize/${product.id}`}>
               <Button variant="secondary" className="mt-2 w-full rounded-2xl">
                  Customize design
               </Button>
            </Link>
         ) : null}

         <Link href="/cart">
            <Button variant="outline" className="w-full rounded-2xl">
               View cart & checkout
            </Button>
         </Link>
      </div>
   )
}

export function ProductPurchase({ product }: { product: CatalogProduct }) {
   return (
      <CartContextProvider>
         <PurchaseInner product={product} />
      </CartContextProvider>
   )
}
