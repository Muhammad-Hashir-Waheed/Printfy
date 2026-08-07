import { ProductGrid } from '@/components/native/Product'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { CatalogProduct } from '@/lib/catalog'
import Link from 'next/link'

export function ProductGallery({
   products,
   total,
}: {
   products: CatalogProduct[]
   total: number
}) {
   if (!products.length) {
      return (
         <Card className="rounded-2xl border border-dashed shadow-none">
            <CardContent className="flex flex-col items-center p-10 text-center">
               <h3 className="text-lg font-semibold">No products found</h3>
               <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Try another category, product type, or search term.
               </p>
               <Button asChild className="mt-5 rounded-xl bg-[#FF5A52] hover:bg-[#ff6d66]">
                  <Link href="/products">View all products</Link>
               </Button>
            </CardContent>
         </Card>
      )
   }

   return (
      <>
         <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
               <span className="font-medium text-foreground tabular-nums">{total}</span>
               {total === 1 ? ' product' : ' products'}
            </p>
         </div>
         <ProductGrid products={products as any} />
      </>
   )
}
