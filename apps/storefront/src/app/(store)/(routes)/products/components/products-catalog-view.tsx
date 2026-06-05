'use client'

import { Heading } from '@/components/native/heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
   filterCatalogProducts,
   sortCatalogProducts,
   type CatalogProduct,
   type CatalogSearchParams,
} from '@/lib/catalog-client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import { CategoryBrowseBar } from './category-browse'
import { FiltersShell } from './filters-shell'
import { ProductGallery } from './product-gallery'

export function ProductsCatalogView({
   allProducts,
   categories,
   brands,
}: {
   allProducts: CatalogProduct[]
   categories: Array<{ title: string }>
   brands: Array<{ title: string }>
}) {
   const searchParams = useSearchParams()

   const paramKey = searchParams.toString()

   const params: CatalogSearchParams = {
      q: searchParams.get('q') ?? undefined,
      sort: searchParams.get('sort') ?? undefined,
      category: searchParams.get('category') ?? undefined,
      brand: searchParams.get('brand') ?? undefined,
      productType: searchParams.get('productType') ?? undefined,
      minPrice: searchParams.get('minPrice') ?? undefined,
      maxPrice: searchParams.get('maxPrice') ?? undefined,
      isAvailable: searchParams.get('isAvailable') ?? undefined,
      customizable: searchParams.get('customizable') ?? undefined,
   }

   const { products, total } = useMemo(() => {
      const filtered = filterCatalogProducts(allProducts, params)
      const sorted = sortCatalogProducts(filtered, params.sort)
      return { products: sorted, total: sorted.length }
   }, [allProducts, paramKey])

   const filterParams: Record<string, string | undefined> = { ...params }
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
