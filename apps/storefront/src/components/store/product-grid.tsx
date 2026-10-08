'use client'

import { startingUnitPrice, type Product } from '@/catalog'
import config from '@/config/site'
import { cn } from '@/lib/utils'
import { LayoutGrid, Rows3 } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { CatalogImage } from './catalog-image'
import { PriceTag } from './cards'

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'name'
type Filter = 'all' | 'online' | 'quote'

const SORTS: Array<{ id: Sort; label: string }> = [
   { id: 'featured', label: 'Featured' },
   ...(config.showPrices
      ? ([
           { id: 'price-asc', label: 'Price: low to high' },
           { id: 'price-desc', label: 'Price: high to low' },
        ] as const)
      : []),
   { id: 'name', label: 'Name A–Z' },
]

const priceOf = (p: Product) => (p.quote ? p.basePrice : startingUnitPrice(p))

export function ProductGrid({ products, showCategory }: { products: Product[]; showCategory?: boolean }) {
   const [sort, setSort] = useState<Sort>('featured')
   const [filter, setFilter] = useState<Filter>('all')
   const [layout, setLayout] = useState<'grid' | 'list'>('grid')

   const hasQuote = products.some((p) => p.quote)
   const hasOnline = products.some((p) => !p.quote)

   const visible = useMemo(() => {
      let list = products
      if (filter === 'online') list = list.filter((p) => !p.quote)
      if (filter === 'quote') list = list.filter((p) => p.quote)
      if (sort === 'price-asc') list = [...list].sort((a, b) => priceOf(a) - priceOf(b))
      if (sort === 'price-desc') list = [...list].sort((a, b) => priceOf(b) - priceOf(a))
      if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name))
      return list
   }, [products, sort, filter])

   return (
      <div>
         <div className="mb-6 flex flex-wrap items-center gap-2 rounded-3xl border bg-white px-3 py-2.5 sm:rounded-full">
            <p className="mr-auto pl-1 text-sm text-muted-foreground">
               <span className="font-semibold text-foreground">{visible.length}</span> products
            </p>
            {hasQuote && hasOnline ? (
               <div className="flex rounded-full bg-muted p-1 text-[13px] font-medium">
                  {(
                     [
                        ['all', 'All'],
                        ['online', config.showPrices ? 'Order online' : 'Standard'],
                        ['quote', 'Made to order'],
                     ] as Array<[Filter, string]>
                  ).map(([id, label]) => (
                     <button
                        key={id}
                        type="button"
                        onClick={() => setFilter(id)}
                        className={cn('rounded-full px-3 py-1.5 transition', filter === id ? 'bg-white shadow-sm' : 'text-muted-foreground')}
                     >
                        {label}
                     </button>
                  ))}
               </div>
            ) : null}
            <label className="sr-only" htmlFor="sort">
               Sort products
            </label>
            <select
               id="sort"
               value={sort}
               onChange={(e) => setSort(e.target.value as Sort)}
               className="h-9 rounded-full border bg-white px-3 text-[13px] font-medium outline-none focus:border-ink"
            >
               {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                     {s.label}
                  </option>
               ))}
            </select>
            <div className="hidden rounded-full bg-muted p-1 sm:flex">
               <button
                  type="button"
                  aria-label="Grid view"
                  onClick={() => setLayout('grid')}
                  className={cn('rounded-full p-1.5', layout === 'grid' ? 'bg-white shadow-sm' : 'text-muted-foreground')}
               >
                  <LayoutGrid className="h-4 w-4" />
               </button>
               <button
                  type="button"
                  aria-label="List view"
                  onClick={() => setLayout('list')}
                  className={cn('rounded-full p-1.5', layout === 'list' ? 'bg-white shadow-sm' : 'text-muted-foreground')}
               >
                  <Rows3 className="h-4 w-4" />
               </button>
            </div>
         </div>

         {layout === 'grid' ? (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
               {visible.map((p, i) => (
                  <li key={p.key} className="animate-rise" style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}>
                     <GridCard product={p} showCategory={showCategory} priority={i < 4} />
                  </li>
               ))}
            </ul>
         ) : (
            <ul className="divide-y rounded-3xl border bg-white">
               {visible.map((p) => (
                  <li key={p.key}>
                     <Link href={p.href} className="group flex items-center gap-4 p-3 transition hover:bg-muted/50 sm:gap-6 sm:p-4">
                        <span className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-24 sm:w-36">
                           <CatalogImage image={p.image} label={p.name} accent={p.accent} dark={p.dark} sizes="144px" />
                        </span>
                        <span className="min-w-0 flex-1">
                           <span className="block font-semibold group-hover:text-primary">{p.name}</span>
                           <span className="mt-0.5 block text-sm text-muted-foreground">{p.summary}</span>
                           <span className="mt-1 block text-xs text-muted-foreground">Lead time {p.preset.leadTime}</span>
                        </span>
                        <PriceTag product={p} className="hidden shrink-0 text-right sm:block" />
                     </Link>
                  </li>
               ))}
            </ul>
         )}
      </div>
   )
}

function GridCard({ product, showCategory, priority }: { product: Product; showCategory?: boolean; priority?: boolean }) {
   return (
      <Link href={product.href} className="group block">
         <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[0_24px_40px_-24px_rgba(30,20,10,.55)]">
            <CatalogImage
               image={product.image}
               label={product.name}
               accent={product.accent}
               dark={product.dark}
               priority={priority}
               sizes="(min-width: 1024px) 23vw, (min-width: 768px) 31vw, 48vw"
               className="transition duration-700 ease-out group-hover:scale-[1.06]"
            />
            {product.quote ? (
               <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                  Made to order
               </span>
            ) : null}
         </div>
         <div className="pt-3">
            {showCategory ? (
               <p className="mb-0.5 text-xs font-medium" style={{ color: product.accent }}>
                  {product.categoryName}
               </p>
            ) : null}
            <h3 className="text-[15px] font-semibold leading-snug transition group-hover:text-primary">{product.name}</h3>
            <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-muted-foreground">{product.summary}</p>
            <PriceTag product={product} className="mt-1.5" />
         </div>
      </Link>
   )
}
