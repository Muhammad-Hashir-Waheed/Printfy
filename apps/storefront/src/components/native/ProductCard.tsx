'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import type { ProductWithIncludes } from '@/types/prisma'
import { ProductImage } from '@/components/native/ProductImage'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function ProductCard({ product }: { product: ProductWithIncludes }) {
   const router = useRouter()
   const customizable = (product as any)?.metadata?.isCustomizable ?? true
   const discountedPrice = product.discount > 0 ? product.price - product.discount : product.price
   const typeLabel =
      (product as any)?.metadata?.productType ??
      product.categories?.[0]?.title ??
      'General'

   return (
      <Card className="group h-full overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-md">
         <CardHeader className="p-0">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/30">
               <Link
                  href={`/products/${product.id}`}
                  className="relative block h-full w-full"
               >
                  <ProductImage
                     productId={product.id}
                     src={product.images?.[0]}
                     alt={product.title}
                     className="transition duration-500 group-hover:scale-[1.04]"
                  />
               </Link>
               {customizable ? (
                  <>
                     <Badge className="absolute left-3 top-3 z-10 rounded-lg bg-white/95 text-[10px] font-semibold text-foreground shadow-sm dark:bg-neutral-900/90 dark:text-white">
                        Customizable
                     </Badge>
                     <div className="absolute inset-x-3 bottom-3 z-10 translate-y-1 opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                        <Button
                           type="button"
                           className="h-9 w-full rounded-xl bg-[#FF5A52] text-sm font-semibold hover:bg-[#ff6d66]"
                           onClick={() => router.push(`/customize/${product.id}`)}
                        >
                           Customize
                        </Button>
                     </div>
                  </>
               ) : null}
            </div>
         </CardHeader>
         <CardContent className="space-y-1.5 p-3.5 pb-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
               {typeLabel}
            </p>
            <Link href={`/products/${product.id}`}>
               <h3 className="line-clamp-1 text-[15px] font-semibold tracking-tight transition group-hover:text-[#FF5A52]">
                  {product.title}
               </h3>
            </Link>
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
               {product.description}
            </p>
         </CardContent>
         <CardFooter className="flex items-center justify-between p-3.5 pt-1">
            {product.discount > 0 ? (
               <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground line-through">
                     ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm font-semibold">${discountedPrice.toFixed(2)}</span>
               </div>
            ) : (
               <span className="text-sm font-semibold">${product.price.toFixed(2)}</span>
            )}
            {!product.isAvailable ? (
               <Badge variant="secondary" className="rounded-lg text-[10px]">
                  Out of stock
               </Badge>
            ) : null}
         </CardFooter>
      </Card>
   )
}
