import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ProductWithIncludes } from '@/types/prisma'
import Image from 'next/image'
import Link from 'next/link'

export function ProductCard({ product }: { product: ProductWithIncludes }) {
   const customizable = (product as any)?.metadata?.isCustomizable ?? true
   const discountedPrice = product.discount > 0 ? product.price - product.discount : product.price

   return (
      <Card className="group h-full overflow-hidden rounded-2xl border transition duration-200 hover:-translate-y-1 hover:shadow-md">
         <CardHeader className="p-0">
            <div className="relative aspect-square w-full overflow-hidden bg-muted/20">
               <Image
                  src={product.images?.[0] ?? '/placeholder.jpg'}
                  alt={product.title}
                  fill
                  className="object-cover transition duration-200 group-hover:scale-105"
               />
               {customizable ? (
                  <div className="absolute inset-x-3 bottom-3 opacity-0 transition duration-200 group-hover:opacity-100">
                     <Link href={`/customize/${product.id}`}>
                        <Button className="w-full rounded-2xl">Customize</Button>
                     </Link>
                  </div>
               ) : null}
            </div>
         </CardHeader>
         <CardContent className="space-y-2 p-4">
            <Badge variant="outline" className="rounded-2xl text-xs">
               {product.categories?.[0]?.title ?? 'General'}
            </Badge>
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
