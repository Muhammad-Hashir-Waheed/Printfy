'use client'

import {
   buildCatalogHref,
   categoryFilterSlug,
} from '@/lib/catalog-navigation'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type CatalogCategory = {
   id?: string
   title: string
   description?: string | null
   image?: string
}

type Props = {
   categories: CatalogCategory[]
   activeCategory?: string
   activeProductType?: string
}

export function CategoryBrowseBar({
   categories,
   activeCategory,
   activeProductType,
}: Props) {
   const activeCategorySlug = activeCategory?.trim().toLowerCase()
   const typeSlug = activeProductType?.trim().toLowerCase()
   const allActive = !activeCategorySlug && !typeSlug

   return (
      <section className="mb-6">
         <div className="mb-3 flex items-end justify-between gap-3">
            <div>
               <h2 className="typo-card-title">Browse by category</h2>
               <p className="text-xs text-muted-foreground">
                  Tap to filter — scroll for more
               </p>
            </div>
         </div>

         <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-2 pt-0.5 [scrollbar-width:thin]">
            <Link
               href={typeSlug ? buildCatalogHref({ productType: activeProductType }) : '/products'}
               className={cn(
                  'group flex w-24 shrink-0 flex-col items-center gap-1.5 rounded-xl border p-1.5 text-center transition',
                  allActive || (typeSlug && !activeCategorySlug)
                     ? 'border-[#FF5A52] bg-[#FF5A52]/5 ring-1 ring-[#FF5A52]/40'
                     : 'border-border/80 bg-card hover:border-foreground/25 hover:shadow-sm'
               )}
            >
               <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-muted/60 typo-eyebrow text-muted-foreground">
                  All
               </div>
               <span
                  className={cn(
                     'w-full truncate text-xs font-medium',
                     allActive || (typeSlug && !activeCategorySlug)
                        ? 'text-[#FF5A52]'
                        : 'text-foreground'
                  )}
               >
                  All products
               </span>
            </Link>

            {categories.map((category) => {
               const slug = categoryFilterSlug(category.title)
               const active = activeCategorySlug === slug

               return (
                  <Link
                     key={category.id ?? category.title}
                     href={buildCatalogHref({
                        category: category.title,
                        productType: typeSlug ? activeProductType : undefined,
                     })}
                     className={cn(
                        'group flex w-24 shrink-0 flex-col items-center gap-1.5 rounded-xl border p-1.5 text-center transition',
                        active
                           ? 'border-[#FF5A52] bg-[#FF5A52]/5 ring-1 ring-[#FF5A52]/40'
                           : 'border-border/80 bg-card hover:border-foreground/25 hover:shadow-sm'
                     )}
                  >
                     <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
                        {category.image ? (
                           <img
                              src={category.image}
                              alt=""
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              loading="lazy"
                           />
                        ) : (
                           <div className="flex h-full w-full items-center justify-center px-1 text-[10px] text-muted-foreground">
                              {category.title}
                           </div>
                        )}
                     </div>
                     <span
                        className={cn(
                           'w-full truncate text-xs font-medium',
                           active ? 'text-[#FF5A52]' : 'text-foreground'
                        )}
                     >
                        {category.title}
                     </span>
                  </Link>
               )
            })}
         </div>
      </section>
   )
}
