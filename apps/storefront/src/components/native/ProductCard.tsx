'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ProductWithIncludes } from '@/types/prisma'
import { ProductImage } from '@/components/native/ProductImage'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function ProductCard({ product }: { product: ProductWithIncludes }) {
   const router = useRouter()
   const customizable = (product as any)?.metadata?.isCustomizable ?? true
   const discountedPrice = product.discount > 0 ? product.price - product.discount : product.price

   return (
      <Card className="group h-full overflow-hidden rounded-2xl border transition duration-200 hover:-translate-y-1 hover:shadow-md">
         <CardHeader className="p-0">
            <div className="relative aspect-square w-full overflow-hidden bg-muted/20">
               <Link
                  href={`/products/${product.id}`}
                  className="relative block h-full w-full"
               >
                  <ProductImage
                     productId={product.id}
                     src={product.images?.[0]}
                     alt={product.title}
                     className="transition duration-200 group-hover:scale-105"
                  />
               </Link>
               {customizable ? (
                  <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 transition duration-200 group-hover:opacity-100">
                     <Button
                        type="button"
                        className="w-full rounded-2xl"
                        onClick={() => router.push(`/customize/${product.id}`)}
                     >
                        Customize
                     </Button>
                  </div>
               ) : null}
            </div>
         </CardHeader>
         <CardContent className="space-y-2 p-4">
            <div className="flex flex-wrap gap-1">
               <Badge variant="outline" className="rounded-2xl text-xs">
                  {(product as any)?.metadata?.productType ??
                     product.categories?.[0]?.title ??
                     'General'}
               </Badge>
               {customizable ? (
                  <Badge className="rounded-2xl text-xs">Customizable</Badge>
               ) : null}
            </div>
            <Link href={`/products/${product.id}`}>
               <h3 className="line-clamp-1 font-semibold">{product.title}</h3>
            </Link>
            <p className="line-clamp-2 text-sm text-muted-foreground">
               {product.description}
            </p>
         </CardContent>
         <CardFooter className="flex items-center justify-between p-4 pt-0">
            {product.discount > 0 ? (
               <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground line-through">
                     ${product.price.toFixed(2)}
                  </span>
                  <span className="font-semibold">${discountedPrice.toFixed(2)}</span>
               </div>
            ) : (
               <span className="font-semibold">${product.price.toFixed(2)}</span>
            )}
            {!product.isAvailable ? (
               <Badge variant="secondary" className="rounded-2xl">
                  Out of stock
               </Badge>
            ) : null}
         </CardFooter>
      </Card>
   )
}
