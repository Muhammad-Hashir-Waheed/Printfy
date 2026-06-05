import { Heading } from '@/components/native/heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { getCatalogSnapshot, type CatalogSearchParams } from '@/lib/catalog'
import { getOfflineCatalogProducts } from '@/lib/catalog-offline'
import Link from 'next/link'

import { CategoryBrowseBar } from './components/category-browse'
import { FiltersShell } from './components/filters-shell'
import { ProductGallery } from './components/product-gallery'

export const dynamic = 'force-dynamic'

export default async function Products({
   searchParams,
}: {
   searchParams: CatalogSearchParams
}) {
   const params = searchParams ?? {}

   let products = getOfflineCatalogProducts()
   let total = products.length
   let brands: Awaited<ReturnType<typeof getCatalogSnapshot>>['brands'] = []
   let categories: Awaited<ReturnType<typeof getCatalogSnapshot>>['categories'] = []

   try {
      const snapshot = await getCatalogSnapshot(params)
      products = snapshot.products
      total = snapshot.total
      brands = snapshot.brands
      categories = snapshot.categories
   } catch (error) {
      console.error('[PRODUCTS_PAGE]', error)
   }

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

   const hasFilters = Object.values(filterParams).some(Boolean)

   return (
      <>
         <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <Heading
               title="Product gallery"
               description="Browse every product in our print-on-demand catalog."
            />
            <div className="flex flex-wrap gap-2">
               <Button asChild variant="outline" className="rounded-2xl">
                  <Link href="/products/gallery">Full gallery</Link>
               </Button>
               <Badge variant="secondary" className="rounded-2xl">
                  {total} items
               </Badge>
            </div>
         </div>

         <CategoryBrowseBar
            activeCategory={params.category}
            activeProductType={params.productType}
         />

         {hasFilters ? (
            <p className="mb-4 text-sm text-muted-foreground">
               Filtered view ·{' '}
               <Link href="/products" className="font-medium underline">
                  show all products
               </Link>
            </p>
         ) : null}

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
                  <FiltersShell
                     categories={categories}
                     brands={brands}
                     searchParams={filterParams}
                  />
               </SheetContent>
            </Sheet>
         </div>

         <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <FiltersShell
               className="hidden lg:block lg:sticky lg:top-24 lg:self-start"
               categories={categories}
               brands={brands}
               searchParams={filterParams}
            />

            <ProductGallery products={products} total={total} />
         </div>
      </>
   )
}
