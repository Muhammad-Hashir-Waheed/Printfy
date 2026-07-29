'use client'

import { Badge } from '@/components/ui/badge'
import { PACKAGING_CATEGORIES } from '@/lib/packaging-categories'
import {
   buildCatalogHref,
   categoryFilterSlug,
   getCatalogBrowseCounts,
   PACKAGING_PRODUCT_TYPES,
   productTypeFilterSlug,
} from '@/lib/catalog-navigation'
import Link from 'next/link'

type Props = {
   activeCategory?: string
   activeProductType?: string
}

/** Category gallery browser — used on /products (not the landing page) */
export function CategoryBrowseBar({ activeCategory, activeProductType }: Props) {
   const { byCategory, byProductType } = getCatalogBrowseCounts()
   const activeCategorySlug = activeCategory?.trim().toLowerCase()
   const activeTypeSlug = activeProductType?.trim().toLowerCase()

   return (
      <section className="mb-8 space-y-6">
         <div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
               Shop packaging by category
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
               Click any category to open its gallery — each includes multiple related products
               and images.
            </p>
         </div>

         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
               href="/products"
               className={`flex min-h-[140px] flex-col items-center justify-center overflow-hidden rounded-xl border bg-muted/40 text-center transition hover:shadow-md ${
                  !activeCategorySlug && !activeTypeSlug
                     ? 'border-red-600 ring-1 ring-red-600'
                     : 'hover:border-foreground/30'
               }`}
            >
               <span className="text-sm font-semibold">All packaging</span>
               <span className="mt-1 text-xs text-muted-foreground">View full catalog</span>
            </Link>

            {PACKAGING_CATEGORIES.map((category) => {
               const slug = categoryFilterSlug(category.title)
               const active = activeCategorySlug === slug
               return (
                  <Link
                     key={category.id}
                     href={category.href}
                     className={`group overflow-hidden rounded-xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                        active ? 'border-red-600 ring-1 ring-red-600' : ''
                     }`}
                  >
                     <div className="grid grid-cols-3 gap-0.5 bg-muted p-0.5">
                        {category.images.map((src, i) => (
                           <div
                              key={`${category.id}-${i}`}
                              className="relative aspect-square overflow-hidden"
                           >
                              <img
                                 src={src}
                                 alt={`${category.title} example ${i + 1}`}
                                 className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                                 loading="lazy"
                              />
                           </div>
                        ))}
                     </div>
                     <div className="space-y-1 p-3">
                        <div className="flex items-center justify-between gap-2">
                           <p className="text-sm font-semibold text-foreground group-hover:text-red-600">
                              {category.title}
                           </p>
                           <span className="text-[10px] text-muted-foreground">
                              {byCategory[category.title] ?? 0}
                           </span>
                        </div>
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                           {category.description}
                        </p>
                     </div>
                  </Link>
               )
            })}
         </div>

         <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
               Packaging type
            </p>
            <div className="flex flex-wrap gap-2">
               {PACKAGING_PRODUCT_TYPES.map((type) => {
                  const slug = productTypeFilterSlug(type)
                  return (
                     <BrowseChip
                        key={type}
                        href={buildCatalogHref({ productType: type })}
                        label={type}
                        count={byProductType[type] ?? 0}
                        active={activeTypeSlug === slug}
                     />
                  )
               })}
            </div>
         </div>
      </section>
   )
}

function BrowseChip({
   href,
   label,
   count,
   active,
}: {
   href: string
   label: string
   count?: number
   active?: boolean
}) {
   return (
      <Link href={href}>
         <Badge
            variant={active ? 'default' : 'outline'}
            className="cursor-pointer rounded-2xl px-3 py-1.5 text-sm hover:bg-muted"
         >
            {label}
            {typeof count === 'number' ? (
               <span className="ml-1.5 text-xs opacity-80">({count})</span>
            ) : null}
         </Badge>
      </Link>
   )
}
