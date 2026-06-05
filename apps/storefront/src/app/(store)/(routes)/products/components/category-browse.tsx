'use client'

import { Badge } from '@/components/ui/badge'
import { DUMMY_CATEGORIES, DUMMY_PRODUCT_TYPES } from '@/lib/catalog-dummy'
import {
   buildCatalogHref,
   categoryFilterSlug,
   getCatalogBrowseCounts,
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
      <div className="mb-6 space-y-4">
         <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
               Shop by category
            </p>
            <div className="flex flex-wrap gap-2">
               <BrowseChip
                  href="/products"
                  label="All products"
                  active={!activeCategorySlug && !activeTypeSlug}
               />
               {DUMMY_CATEGORIES.map((category) => {
                  const slug = categoryFilterSlug(category.title)
                  return (
                     <BrowseChip
                        key={category.id}
                        href={buildCatalogHref({ category: category.title })}
                        label={category.title}
                        count={byCategory[category.title] ?? 0}
                        active={activeCategorySlug === slug}
                     />
                  )
               })}
            </div>
         </div>

         <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
               Product type
            </p>
            <div className="flex flex-wrap gap-2">
               {DUMMY_PRODUCT_TYPES.map((type) => {
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
