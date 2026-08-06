'use client'

import { CatalogFiltersPanel } from './catalog-filters'

export function FiltersShell({
   categories,
   brands,
   searchParams,
   className,
}: {
   categories: Array<{ title: string }>
   brands: Array<{ title: string }>
   searchParams: Record<string, string | undefined>
   className?: string
}) {
   return (
      <CatalogFiltersPanel
         className={className}
         categories={categories}
         brands={brands}
         searchParams={searchParams}
      />
   )
}
