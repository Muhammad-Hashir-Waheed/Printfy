'use client'

import { CustomizerCanvas } from '@/components/native/customizer/CustomizerCanvas'
import { DesignToolbar } from '@/components/native/customizer/DesignToolbar'
import { UploadModal } from '@/components/native/customizer/UploadModal'
import { VariantSelector } from '@/components/native/customizer/VariantSelector'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { calculatePrice } from '@domain-pricing'
import {
   defaultTransform,
   getSavedDesign,
   ProductCustomization,
   saveDesign,
} from '@/lib/designs'
import { getLocalCart, writeLocalCart } from '@/lib/cart'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'

const mockProduct = {
   id: 'mock-product',
   title: 'Premium Custom Tee',
   images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop'],
   price: 29,
   variants: [],
}

export default function CustomizePage({ params }: { params: { productId: string } }) {
   const [product, setProduct] = useState<any>(mockProduct)
   const [designImage, setDesignImage] = useState<string | undefined>()
   const [selectedVariants, setSelectedVariants] = useState<
      Record<string, { value: string; priceModifier: number }>
   >({})
   const [transform, setTransform] = useState(defaultTransform)

   useEffect(() => {
      let mounted = true
      ;(async () => {
         try {
            const response = await fetch(`/api/products/${params.productId}`)
            if (!response.ok) return
            const json = await response.json()
            if (mounted && json) setProduct(json)
         } catch {
            // Fallback to mock data when DB/API is unavailable.
         }
      })()

      ;(async () => {
         try {
            const saved = await getSavedDesign(params.productId)
            if (saved) {
               setDesignImage(saved.designImage)
               const mapped = (saved.variants ?? []).reduce(
                  (acc, variant) => ({
                     ...acc,
                     [variant.name]: {
                        value: variant.value,
                        priceModifier: Number(variant.priceModifier ?? 0),
                     },
                  }),
                  {}
               )
               setSelectedVariants(mapped)
               setTransform(saved.transform ?? defaultTransform)
            }
         } catch {
            // Ignore load design failure.
         }
      })()

      return () => {
         mounted = false
      }
   }, [params.productId])

   const currentDesign: ProductCustomization = useMemo(
      () => ({
         productId: params.productId,
         designImage,
         variants: Object.entries(selectedVariants).map(([name, option]) => ({
            name,
            value: option.value,
            priceModifier: option.priceModifier,
         })),
         transform,
         savedAt: new Date().toISOString(),
      }),
      [params.productId, designImage, selectedVariants, transform]
   )

   async function onSaveDesign() {
      try {
         await saveDesign(currentDesign)
         toast.success('Design saved')
      } catch {
         toast.error('Please login to save designs')
      }
   }

   function onAddToCart() {
      const localCart = getLocalCart() ?? { items: [] }
      const existing = localCart.items.find((item) => item.productId === params.productId)

      if (existing) {
         existing.count += 1
         existing.customDesign = currentDesign
      } else {
         localCart.items.push({
            productId: params.productId,
            count: 1,
            product: {
               ...product,
               description: product.description ?? 'Customizable print product',
               discount: product.discount ?? 0,
               isAvailable: true,
            },
            customDesign: currentDesign,
            selectedVariants: currentDesign.variants ?? [],
         })
      }

      writeLocalCart(localCart)
      toast.success('Added customized item to cart')
   }

   function onCenterDesign() {
      setTransform((prev) => ({ ...prev, x: 0, y: 0 }))
   }

   const groupedVariants = useMemo(() => {
      if (!Array.isArray(product?.variants)) return []
      const map = new Map<string, Array<{ value: string; priceModifier: number }>>()
      for (const variant of product.variants) {
         const current = map.get(variant.name) ?? []
         current.push({
            value: variant.value,
            priceModifier: Number(variant.priceModifier ?? 0),
         })
         map.set(variant.name, current)
      }
      return Array.from(map.entries()).map(([name, options]) => ({ name, options }))
   }, [product?.variants])

   const currentPrice = useMemo(
      () =>
         calculatePrice({
            basePrice: Number(product.price ?? 0),
            quantity: 1,
            discount: Number(product.discount ?? 0),
            variants: Object.entries(selectedVariants).map(([name, option]) => ({
               name,
               value: option.value,
               priceModifier: option.priceModifier,
            })),
         }).unitPrice,
      [product.price, product.discount, selectedVariants]
   )
   const currentColor = useMemo(() => {
      const colorVariant = Object.entries(selectedVariants).find(
         ([name]) => name.toLowerCase() === 'color'
      )
      return colorVariant?.[1]?.value ?? 'White'
   }, [selectedVariants])

   return (
      <div className="space-y-4 pb-28">
         <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
               <Link href={`/products/${params.productId}`}>
                  <Button variant="ghost" className="rounded-2xl">
                     <ArrowLeftIcon className="mr-2 h-4 w-4" />
                     Back
                  </Button>
               </Link>
               <h1 className="text-lg font-semibold">{product.title}</h1>
            </div>
            <Button onClick={onSaveDesign} className="rounded-2xl">
               Save Design
            </Button>
         </div>

         <div className="grid gap-6 lg:grid-cols-10">
            <div className="lg:col-span-7">
               <CustomizerCanvas
                  productImage={product.images?.[0] ?? mockProduct.images[0]}
                  designImage={designImage}
                  color={currentColor}
                  transform={transform}
                  onMove={({ x, y }) => setTransform((prev) => ({ ...prev, x, y }))}
                  onScaleChange={(scale) => setTransform((prev) => ({ ...prev, scale }))}
               />
            </div>
            <div className="hidden space-y-4 lg:sticky lg:top-20 lg:col-span-3 lg:block">
               <UploadModal onApply={setDesignImage} />
               <VariantSelector
                  variants={groupedVariants}
                  selected={selectedVariants}
                  onVariantChange={(name, option) =>
                     setSelectedVariants((prev) => ({ ...prev, [name]: option }))
                  }
               />
               <DesignToolbar
                  value={transform}
                  onChange={setTransform}
                  onCenter={onCenterDesign}
               />
            </div>
         </div>

         <div className="lg:hidden">
            <Sheet>
               <SheetTrigger asChild>
                  <Button variant="secondary" className="w-full">
                     Open Customizer Controls
                  </Button>
               </SheetTrigger>
               <SheetContent side="bottom" className="h-[80vh] overflow-y-auto rounded-t-2xl p-4">
                  <SheetTitle className="mb-4">Customizer Controls</SheetTitle>
                  <div className="space-y-4">
                     <UploadModal onApply={setDesignImage} />
                     <VariantSelector
                        variants={groupedVariants}
                        selected={selectedVariants}
                        onVariantChange={(name, option) =>
                           setSelectedVariants((prev) => ({ ...prev, [name]: option }))
                        }
                     />
                     <DesignToolbar
                        value={transform}
                        onChange={setTransform}
                        onCenter={onCenterDesign}
                     />
                  </div>
               </SheetContent>
            </Sheet>
         </div>

         <div className="fixed bottom-4 left-0 right-0 z-40 mx-auto w-full max-w-[720px] px-4">
            <div className="flex items-center justify-between rounded-2xl border bg-background/95 p-3 shadow-md backdrop-blur">
               <div>
                  <p className="text-sm text-muted-foreground">Customized item</p>
                  <p className="font-semibold">${currentPrice.toFixed(2)}</p>
               </div>
               <Button className="rounded-2xl px-8" onClick={onAddToCart}>
                  Add to Cart
               </Button>
            </div>
         </div>
      </div>
   )
}
