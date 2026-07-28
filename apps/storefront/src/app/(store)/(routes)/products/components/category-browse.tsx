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

export function CategoryBrowseBar({ activeCategory, activeProductType }: Props) {
   const { byCategory, byProductType } = getCatalogBrowseCounts()
   const activeCategorySlug = activeCategory?.trim().toLowerCase()
   const activeTypeSlug = activeProductType?.trim().toLowerCase()

   return (
      <div className="mb-6 space-y-5">
         <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
               Shop by packaging category
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
               <Link
                  href="/products"
                  className={`overflow-hidden rounded-xl border transition hover:shadow-md ${
                     !activeCategorySlug && !activeTypeSlug
                        ? 'border-red-600 ring-1 ring-red-600'
                        : 'hover:border-foreground/30'
                  }`}
               >
                  <div className="flex aspect-[3/1] items-center justify-center bg-muted text-sm font-semibold">
                     All packaging
                  </div>
               </Link>
               {PACKAGING_CATEGORIES.map((category) => {
                  const slug = categoryFilterSlug(category.title)
                  const active = activeCategorySlug === slug
                  return (
                     <Link
                        key={category.id}
                        href={category.href}
                        className={`group overflow-hidden rounded-xl border bg-card transition hover:-translate-y-0.5 hover:shadow-md ${
                           active ? 'border-red-600 ring-1 ring-red-600' : ''
                        }`}
                     >
                        <div className="grid grid-cols-3 gap-px bg-muted">
                           {category.images.map((src, i) => (
                              <img
                                 key={`${category.id}-${i}`}
                                 src={src}
                                 alt={`${category.title} ${i + 1}`}
                                 className="aspect-square w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                                 loading="lazy"
                              />
                           ))}
                        </div>
                        <div className="flex items-center justify-between gap-2 px-2.5 py-2">
                           <span className="text-xs font-semibold text-foreground group-hover:text-red-600">
                              {category.title}
                           </span>
                           <span className="text-[10px] text-muted-foreground">
                              {byCategory[category.title] ?? 0}
                           </span>
                        </div>
                     </Link>
                  )
               })}
            </div>
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
      </div>
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
