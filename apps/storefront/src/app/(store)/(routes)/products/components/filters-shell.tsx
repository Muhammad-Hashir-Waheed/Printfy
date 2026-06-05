'use client'

import dynamic from 'next/dynamic'

const CatalogFiltersPanel = dynamic(
   () =>
      import('./catalog-filters').then((mod) => ({
         default: mod.CatalogFiltersPanel,
      })),
   {
      ssr: false,
      loading: () => (
         <aside className="h-64 animate-pulse rounded-2xl border bg-muted/30" />
      ),
   }
)

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
