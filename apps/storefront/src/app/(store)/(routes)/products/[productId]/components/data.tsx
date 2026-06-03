import { Separator } from '@/components/native/separator'
import { Badge } from '@/components/ui/badge'
import type { CatalogProduct } from '@/lib/catalog'
import Link from 'next/link'

import { ProductPurchase } from './product-purchase'

export const DataSection = ({ product }: { product: CatalogProduct }) => {
   const meta = product.metadata as Record<string, unknown> | null
   const printAreas = Array.isArray(meta?.printAreas)
      ? (meta.printAreas as string[])
      : []

   return (
      <div className="col-span-2 w-full space-y-4 rounded-2xl border bg-neutral-100 p-6 shadow-sm dark:bg-neutral-900">
         <div>
            <h1 className="text-2xl font-semibold md:text-3xl">{product.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
         </div>

         <Separator />

         <div className="flex flex-wrap gap-2 items-center text-sm">
            <span className="text-muted-foreground">Brand:</span>
            <Link href={`/products?brand=${product?.brand?.title?.toLowerCase()}`}>
               <Badge variant="outline">{product?.brand?.title}</Badge>
            </Link>
         </div>

         <div className="flex flex-wrap gap-2 items-center text-sm">
            <span className="text-muted-foreground">Categories:</span>
            {product.categories?.map(({ title }, index) => (
               <Link key={index} href={`/products?category=${title.toLowerCase()}`}>
                  <Badge variant="outline">{title}</Badge>
               </Link>
            ))}
         </div>

         {printAreas.length > 0 ? (
            <div className="flex flex-wrap gap-2">
               <span className="text-sm text-muted-foreground">Print areas:</span>
               {printAreas.map((area) => (
                  <Badge key={area} variant="secondary">
                     {area}
                  </Badge>
               ))}
            </div>
         ) : null}

         <ProductPurchase product={product} />
      </div>
   )
}
