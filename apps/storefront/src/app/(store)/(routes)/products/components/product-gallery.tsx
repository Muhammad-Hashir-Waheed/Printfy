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
         <Card className="rounded-2xl border shadow-sm">
            <CardContent className="p-8 text-center">
               <h3 className="text-lg font-semibold">No products found</h3>
               <p className="mt-2 text-sm text-muted-foreground">
                  Try another category, product type, or search term.
               </p>
               <Button asChild className="mt-4 rounded-2xl">
                  <Link href="/products">View all products</Link>
               </Button>
            </CardContent>
         </Card>
      )
   }

   return (
      <>
         <p className="mb-4 text-sm text-muted-foreground">
            {total} product{total === 1 ? '' : 's'} found
         </p>
         <ProductGrid products={products as any} />
      </>
   )
}
