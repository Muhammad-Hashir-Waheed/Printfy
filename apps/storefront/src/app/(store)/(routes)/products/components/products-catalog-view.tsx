'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
   filterCatalogProducts,
   sortCatalogProducts,
   type CatalogProduct,
   type CatalogSearchParams,
} from '@/lib/catalog-client'
import { SlidersHorizontal } from 'lucide-react'
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

   const activeLabel =
      params.q?.trim() ||
      params.category?.replace(/-/g, ' ') ||
      params.productType ||
      null

   return (
      <div className="space-y-5 pb-10">
         {/* Header — compact, products-first mindset */}
         <header className="flex flex-col gap-3 border-b border-border/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
               <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FF5A52]">
                  Catalog
               </p>
               <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Shop packaging
               </h1>
               <p className="max-w-xl text-sm text-muted-foreground">
                  Food boxes, bags, mailers, stickers &amp; brand neon signs — filter and customize.
               </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
               {hasFilters ? (
                  <Button asChild variant="ghost" size="sm" className="rounded-xl">
                     <Link href="/products">Clear filters</Link>
                  </Button>
               ) : null}
               <Badge
                  variant="secondary"
                  className="rounded-xl px-3 py-1 text-sm font-medium tabular-nums"
               >
                  {total} {total === 1 ? 'product' : 'products'}
               </Badge>
            </div>
         </header>

         <CategoryBrowseBar
            activeCategory={params.category}
            activeProductType={params.productType}
         />

         {hasFilters && activeLabel ? (
            <p className="text-sm text-muted-foreground">
               Showing results for{' '}
               <span className="font-medium text-foreground">{activeLabel}</span>
            </p>
         ) : null}

         <div className="block lg:hidden">
            <Sheet>
               <SheetTrigger asChild>
                  <Button variant="outline" className="w-full rounded-xl gap-2">
                     <SlidersHorizontal className="h-4 w-4" />
                     Filters &amp; search
                  </Button>
               </SheetTrigger>
               <SheetContent
                  side="left"
                  className="h-full w-[min(100%,320px)] overflow-y-auto p-4"
               >
                  <SheetTitle className="mb-4">Filters</SheetTitle>
                  <FiltersShell
                     categories={categories}
                     brands={brands}
                     searchParams={filterParams}
                  />
               </SheetContent>
            </Sheet>
         </div>

         <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <FiltersShell
               className="hidden lg:block lg:sticky lg:top-24 lg:self-start"
               categories={categories}
               brands={brands}
               searchParams={filterParams}
            />
            <div className="min-w-0">
               <ProductGallery products={products} total={total} />
            </div>
         </div>
      </div>
   )
}
