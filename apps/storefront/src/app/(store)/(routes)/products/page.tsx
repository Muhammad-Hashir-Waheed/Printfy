import { ProductGrid, ProductSkeletonGrid } from '@/components/native/Product'
import { Heading } from '@/components/native/heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { getCatalogSnapshot, type CatalogSearchParams } from '@/lib/catalog'
import { isVariableValid } from '@/lib/utils'
import Link from 'next/link'

import { CatalogFiltersPanel } from './components/catalog-filters'

export const dynamic = 'force-dynamic'

export default async function Products({
   searchParams,
}: {
   searchParams: CatalogSearchParams
}) {
   const params = searchParams ?? {}
   const { products, total, brands, categories } =
      await getCatalogSnapshot(params)

   const filterParams: Record<string, string | undefined> = {
      q: params.q,
      sort: params.sort,
      category: params.category,
      brand: params.brand,
      productType: params.productType,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      isAvailable: params.isAvailable,
      customizable: params.customizable,
   }

   return (
      <>
         <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <Heading
               title="Product catalog"
               description="Browse apparel, bags, packaging, and more — filter like a print shop and customize any item."
            />
            <Badge variant="secondary" className="w-fit rounded-2xl">
               Demo catalog (no database)
            </Badge>
         </div>

         <div className="mb-4 block lg:hidden">
            <Sheet>
               <SheetTrigger asChild>
                  <Button variant="secondary" className="w-full rounded-2xl">
                     Filters & search
                  </Button>
               </SheetTrigger>
               <SheetContent
                  side="left"
                  className="h-full w-[min(100%,320px)] overflow-y-auto p-4"
               >
                  <SheetTitle className="mb-4">Product filters</SheetTitle>
                  <CatalogFiltersPanel
                     categories={categories}
                     brands={brands}
                     searchParams={filterParams}
                  />
               </SheetContent>
            </Sheet>
         </div>

         <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <CatalogFiltersPanel
               className="hidden lg:block lg:sticky lg:top-24 lg:self-start"
               categories={categories}
               brands={brands}
               searchParams={filterParams}
            />

            <div>
               <p className="mb-4 text-sm text-muted-foreground">
                  {total} product{total === 1 ? '' : 's'} found
               </p>
               {isVariableValid(products) && products.length > 0 ? (
                  <ProductGrid products={products as any} />
               ) : isVariableValid(products) && products.length === 0 ? (
                  <Card className="rounded-2xl border shadow-sm">
                     <CardContent className="p-8 text-center">
                        <h3 className="text-lg font-semibold">No products found</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                           Try another category, product type, or search term.
                        </p>
                        <Button asChild className="mt-4 rounded-2xl">
                           <Link href="/products">Clear filters</Link>
                        </Button>
                     </CardContent>
                  </Card>
               ) : (
                  <ProductSkeletonGrid />
               )}
            </div>
         </div>
      </>
   )
}
