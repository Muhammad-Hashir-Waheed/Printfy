'use client'

import { PACKAGING_PRODUCT_TYPES, productTypeFilterSlug } from '@/lib/catalog-navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn, isVariableValid } from '@/lib/utils'
import { slugifyText } from '@/lib/slug'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

function useFilterParams() {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const setParam = (key: string, value: string | null) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))
      if (!value) current.delete(key)
      else current.set(key, value)
      current.delete('page')
      const query = current.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
   }

   const clearAll = () => {
      router.replace(pathname, { scroll: false })
   }

   return { searchParams, setParam, clearAll }
}

export function ProductSearch({ initialQ }: { initialQ?: string }) {
   const { searchParams, setParam } = useFilterParams()
   const [q, setQ] = useState(initialQ ?? '')

   useEffect(() => {
      setQ(initialQ ?? '')
   }, [initialQ])

   return (
      <form
         className="flex gap-2"
         onSubmit={(e) => {
            e.preventDefault()
            setParam('q', q.trim() || null)
         }}
      >
         <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search pizza boxes, bags, mailers..."
            className="rounded-2xl"
         />
         <Button type="submit" className="rounded-2xl shrink-0">
            Search
         </Button>
      </form>
   )
}

export function SortByFilter({ initialData }: { initialData?: string }) {
   const { searchParams, setParam } = useFilterParams()
   const value = searchParams.get('sort') ?? initialData ?? 'featured'

   return (
      <Select
         value={value}
         onValueChange={(v) => setParam('sort', v === 'featured' ? null : v)}
      >
         <SelectTrigger className="w-full rounded-2xl">
            <SelectValue placeholder="Sort by" />
         </SelectTrigger>
         <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="name_asc">Name (A–Z)</SelectItem>
            <SelectItem value="least_expensive">Price: Low to High</SelectItem>
            <SelectItem value="most_expensive">Price: High to Low</SelectItem>
         </SelectContent>
      </Select>
   )
}

export function ProductTypeFilter({ initial }: { initial?: string }) {
   const { setParam } = useFilterParams()

   return (
      <Select
         value={initial ?? 'all'}
         onValueChange={(v) => setParam('productType', v === 'all' ? null : v)}
      >
         <SelectTrigger className="w-full rounded-2xl">
            <SelectValue placeholder="Product type" />
         </SelectTrigger>
         <SelectContent>
            <SelectItem value="all">All packaging types</SelectItem>
            {PACKAGING_PRODUCT_TYPES.map((type) => (
               <SelectItem key={type} value={productTypeFilterSlug(type)}>
                  {type}
               </SelectItem>
            ))}
         </SelectContent>
      </Select>
   )
}

export function CategoryFilter({
   categories,
   initial,
}: {
   categories: Array<{ title: string }>
   initial?: string
}) {
   const { setParam } = useFilterParams()

   return (
      <Select
         value={initial ?? 'all'}
         onValueChange={(v) => setParam('category', v === 'all' ? null : v)}
      >
         <SelectTrigger className="w-full rounded-2xl">
            <SelectValue placeholder="Category" />
         </SelectTrigger>
         <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
               <SelectItem key={c.title} value={slugifyText(c.title)}>
                  {c.title}
               </SelectItem>
            ))}
         </SelectContent>
      </Select>
   )
}

export function BrandFilter({
   brands,
   initial,
}: {
   brands: Array<{ title: string }>
   initial?: string
}) {
   const { setParam } = useFilterParams()

   return (
      <Select
         value={initial ?? 'all'}
         onValueChange={(v) => setParam('brand', v === 'all' ? null : v)}
      >
         <SelectTrigger className="w-full rounded-2xl">
            <SelectValue placeholder="Brand" />
         </SelectTrigger>
         <SelectContent>
            <SelectItem value="all">All brands</SelectItem>
            {brands.map((b) => (
               <SelectItem key={b.title} value={slugifyText(b.title)}>
                  {b.title}
               </SelectItem>
            ))}
         </SelectContent>
      </Select>
   )
}

export function PriceRangeFilter({
   initialMin,
   initialMax,
}: {
   initialMin?: string
   initialMax?: string
}) {
   const { setParam } = useFilterParams()
   const [min, setMin] = useState(initialMin ?? '')
   const [max, setMax] = useState(initialMax ?? '')

   return (
      <div className="space-y-2">
         <Label className="text-sm font-medium">Price range ($)</Label>
         <div className="grid grid-cols-2 gap-2">
            <Input
               type="number"
               min={0}
               placeholder="Min"
               value={min}
               onChange={(e) => setMin(e.target.value)}
               className="rounded-2xl"
            />
            <Input
               type="number"
               min={0}
               placeholder="Max"
               value={max}
               onChange={(e) => setMax(e.target.value)}
               className="rounded-2xl"
            />
         </div>
         <Button
            type="button"
            variant="secondary"
            className="w-full rounded-2xl"
            onClick={() => {
               setParam('minPrice', min || null)
               setParam('maxPrice', max || null)
            }}
         >
            Apply price
         </Button>
      </div>
   )
}

export function ToggleFilters({
   initialAvailable,
   initialCustomizable,
}: {
   initialAvailable?: string
   initialCustomizable?: string
}) {
   const { searchParams, setParam } = useFilterParams()
   const available = searchParams.get('isAvailable') === 'true' || initialAvailable === 'true'
   const customizable =
      searchParams.get('customizable') === 'true' || initialCustomizable === 'true'

   return (
      <div className="space-y-3 rounded-2xl border p-3">
         <div className="flex items-center justify-between gap-2">
            <Label htmlFor="in-stock">In stock only</Label>
            <Switch
               id="in-stock"
               checked={available}
               onCheckedChange={(v) => setParam('isAvailable', v ? 'true' : null)}
            />
         </div>
         <div className="flex items-center justify-between gap-2">
            <Label htmlFor="customizable">Customizable only</Label>
            <Switch
               id="customizable"
               checked={customizable}
               onCheckedChange={(v) => setParam('customizable', v ? 'true' : null)}
            />
         </div>
      </div>
   )
}

export function CatalogFiltersPanel({
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
   const { clearAll } = useFilterParams()
   const hasFilters = Object.values(searchParams).some(isVariableValid)

   return (
      <aside
         className={cn(
            'space-y-4 rounded-2xl border border-border/80 bg-card/80 p-4 shadow-sm backdrop-blur-sm',
            className
         )}
      >
         <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
               Filters
            </h2>
            {hasFilters ? (
               <Button variant="ghost" size="sm" className="h-8 rounded-xl" onClick={clearAll}>
                  Clear
               </Button>
            ) : null}
         </div>
         <ProductSearch initialQ={searchParams.q} />
         <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Sort</Label>
            <SortByFilter initialData={searchParams.sort} />
         </div>
         <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Type</Label>
            <ProductTypeFilter initial={searchParams.productType} />
         </div>
         <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Category</Label>
            <CategoryFilter categories={categories} initial={searchParams.category} />
         </div>
         <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Brand</Label>
            <BrandFilter brands={brands} initial={searchParams.brand} />
         </div>
         <PriceRangeFilter
            initialMin={searchParams.minPrice}
            initialMax={searchParams.maxPrice}
         />
         <ToggleFilters
            initialAvailable={searchParams.isAvailable}
            initialCustomizable={searchParams.customizable}
         />
      </aside>
   )
}
