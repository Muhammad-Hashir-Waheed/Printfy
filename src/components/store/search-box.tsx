'use client'

import { searchCategories, searchProducts, type Product } from '@/catalog'
import { cn } from '@/lib/utils'
import { ArrowRight, Search, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useMemo, useRef, useState } from 'react'

import { CatalogImage } from './catalog-image'

const SUGGESTIONS = ['Business cards', 'Neon signs', 'Mailer boxes', 'Stickers', 'Acrylic boxes', 'Roll-up banners']

export function SearchBox({ className, autoFocus }: { className?: string; autoFocus?: boolean }) {
   const router = useRouter()
   const [query, setQuery] = useState('')
   const [open, setOpen] = useState(false)
   const [active, setActive] = useState(-1)
   const wrapper = useRef<HTMLDivElement>(null)
   const listId = useId()

   const products = useMemo(() => searchProducts(query, 6), [query])
   const categories = useMemo(() => searchCategories(query, 3), [query])
   const items = useMemo<Array<{ href: string; label: string; sub: string; product?: Product }>>(
      () => [
         ...categories.map((c) => ({ href: c.href, label: c.name, sub: c.departmentName })),
         ...products.map((p) => ({ href: p.href, label: p.name, sub: p.categoryName, product: p })),
      ],
      [categories, products]
   )

   useEffect(() => {
      const close = (e: MouseEvent) => {
         if (!wrapper.current?.contains(e.target as Node)) setOpen(false)
      }
      document.addEventListener('mousedown', close)
      return () => document.removeEventListener('mousedown', close)
   }, [])

   useEffect(() => setActive(-1), [query])

   function go(href: string) {
      setOpen(false)
      setQuery('')
      router.push(href)
   }

   function submit(e: React.FormEvent) {
      e.preventDefault()
      if (active >= 0 && items[active]) return go(items[active].href)
      const q = query.trim()
      if (q) go(`/search?q=${encodeURIComponent(q)}`)
   }

   function onKeyDown(e: React.KeyboardEvent) {
      if (e.key === 'ArrowDown') {
         e.preventDefault()
         setOpen(true)
         setActive((i) => Math.min(i + 1, items.length - 1))
      } else if (e.key === 'ArrowUp') {
         e.preventDefault()
         setActive((i) => Math.max(i - 1, -1))
      } else if (e.key === 'Escape') {
         setOpen(false)
      }
   }

   const showPanel = open

   return (
      <div ref={wrapper} className={cn('relative', className)}>
         <form onSubmit={submit} role="search">
            <label htmlFor={`${listId}-input`} className="sr-only">
               Search products
            </label>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
            <input
               id={`${listId}-input`}
               value={query}
               autoFocus={autoFocus}
               onChange={(e) => {
                  setQuery(e.target.value)
                  setOpen(true)
               }}
               onFocus={() => setOpen(true)}
               onKeyDown={onKeyDown}
               placeholder="Search boxes, cards, signs, stickers…"
               autoComplete="off"
               role="combobox"
               aria-expanded={showPanel}
               aria-controls={listId}
               className="h-12 w-full rounded-full border border-input bg-white pl-11 pr-11 text-[15px] shadow-[0_1px_0_rgba(0,0,0,0.03)] outline-none transition placeholder:text-muted-foreground/80 focus:border-ink focus:ring-4 focus:ring-ink/5"
            />
            {query ? (
               <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted"
                  aria-label="Clear search"
               >
                  <X className="h-4 w-4" />
               </button>
            ) : null}
         </form>

         {showPanel ? (
            <div
               id={listId}
               role="listbox"
               className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border bg-white p-2 shadow-[0_24px_60px_-20px_rgba(30,20,10,0.35)]"
            >
               {query.trim().length < 2 ? (
                  <div className="p-3">
                     <p className="eyebrow mb-3 text-muted-foreground">Popular searches</p>
                     <div className="flex flex-wrap gap-2">
                        {SUGGESTIONS.map((s) => (
                           <button
                              key={s}
                              type="button"
                              onClick={() => go(`/search?q=${encodeURIComponent(s)}`)}
                              className="rounded-full border px-3 py-1.5 text-sm transition hover:border-ink hover:bg-ink hover:text-white"
                           >
                              {s}
                           </button>
                        ))}
                     </div>
                  </div>
               ) : items.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground">
                     No matches for “{query}”.{' '}
                     <Link href="/quote" className="font-medium text-primary underline" onClick={() => setOpen(false)}>
                        Ask us for a quote
                     </Link>{' '}
                     — we make custom items too.
                  </p>
               ) : (
                  <ul>
                     {items.map((item, i) => (
                        <li key={item.href} role="option" aria-selected={i === active}>
                           <Link
                              href={item.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                 'flex items-center gap-3 rounded-xl px-2 py-2 transition',
                                 i === active ? 'bg-muted' : 'hover:bg-muted'
                              )}
                           >
                              <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                                 {item.product ? (
                                    <CatalogImage
                                       image={item.product.image}
                                       label={item.label}
                                       accent={item.product.accent}
                                       dark={item.product.dark}
                                       sizes="44px"
                                    />
                                 ) : (
                                    <span className="grid h-full w-full place-items-center">
                                       <ArrowRight className="h-4 w-4" />
                                    </span>
                                 )}
                              </span>
                              <span className="min-w-0">
                                 <span className="block truncate text-sm font-medium">{item.label}</span>
                                 <span className="block truncate text-xs text-muted-foreground">{item.sub}</span>
                              </span>
                           </Link>
                        </li>
                     ))}
                     <li>
                        <button
                           type="button"
                           onClick={() => go(`/search?q=${encodeURIComponent(query.trim())}`)}
                           className="mt-1 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-primary hover:bg-muted"
                        >
                           See all results for “{query.trim()}”
                           <ArrowRight className="h-4 w-4" />
                        </button>
                     </li>
                  </ul>
               )}
            </div>
         ) : null}
      </div>
   )
}
