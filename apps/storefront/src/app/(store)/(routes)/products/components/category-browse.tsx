'use client'

import { PACKAGING_CATEGORIES } from '@/lib/packaging-categories'
import {
   buildCatalogHref,
   categoryFilterSlug,
   getCatalogBrowseCounts,
} from '@/lib/catalog-navigation'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type Props = {
   activeCategory?: string
   activeProductType?: string
}

/** Compact horizontal category strip — products stay above the fold */
export function CategoryBrowseBar({ activeCategory, activeProductType }: Props) {
   const { byCategory } = getCatalogBrowseCounts()
   const activeCategorySlug = activeCategory?.trim().toLowerCase()
   const allActive = !activeCategorySlug && !activeProductType?.trim()

   return (
      <section className="mb-6">
         <div className="mb-3 flex items-end justify-between gap-3">
            <div>
               <h2 className="text-sm font-semibold tracking-tight text-foreground">
                  Browse by category
               </h2>
               <p className="text-xs text-muted-foreground">
                  Tap to filter — scroll for more
               </p>
            </div>
         </div>

         <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-2 pt-0.5 [scrollbar-width:thin]">
            <Link
               href="/products"
               className={cn(
                  'group flex w-[88px] shrink-0 flex-col items-center gap-1.5 rounded-xl border p-1.5 text-center transition',
                  allActive
                     ? 'border-[#FF5A52] bg-[#FF5A52]/5 ring-1 ring-[#FF5A52]/40'
                     : 'border-border/80 bg-card hover:border-foreground/25 hover:shadow-sm'
               )}
            >
               <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-muted/60 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  All
               </div>
               <span
                  className={cn(
                     'line-clamp-2 text-[11px] font-medium leading-tight',
                     allActive ? 'text-[#FF5A52]' : 'text-foreground'
                  )}
               >
                  All packaging
               </span>
            </Link>

            {PACKAGING_CATEGORIES.map((category) => {
               const slug = categoryFilterSlug(category.title)
               const active = activeCategorySlug === slug
               const count = byCategory[category.title] ?? 0
               const thumb = category.images[0]

               return (
                  <Link
                     key={category.id}
                     href={buildCatalogHref({ category: category.title })}
                     className={cn(
                        'group flex w-[88px] shrink-0 flex-col items-center gap-1.5 rounded-xl border p-1.5 text-center transition',
                        active
                           ? 'border-[#FF5A52] bg-[#FF5A52]/5 ring-1 ring-[#FF5A52]/40'
                           : 'border-border/80 bg-card hover:border-foreground/25 hover:shadow-sm'
                     )}
                  >
                     <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
                        <img
                           src={thumb}
                           alt=""
                           className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                           loading="lazy"
                        />
                     </div>
                     <span
                        className={cn(
                           'line-clamp-2 text-[11px] font-medium leading-tight',
                           active ? 'text-[#FF5A52]' : 'text-foreground'
                        )}
                     >
                        {category.title}
                     </span>
                     {count > 0 ? (
                        <span className="sr-only">{count} products</span>
                     ) : null}
                  </Link>
               )
            })}
         </div>
      </section>
   )
}
