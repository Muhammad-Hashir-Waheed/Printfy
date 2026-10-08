'use client'

import { CATALOG_STATS, DEPARTMENTS, searchCategories, searchProducts } from '@/catalog'
import { cn } from '@/lib/utils'
import { ArrowRight, CornerDownLeft, Search, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { CatalogImage } from './catalog-image'

const TRENDING = ['Neon signs', 'Business cards', 'Mailer boxes', 'Acrylic boxes', 'Roll-up banners', 'Stickers', 'Paper bags']

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
   const router = useRouter()
   const [query, setQuery] = useState('')
   const [active, setActive] = useState(0)
   const inputRef = useRef<HTMLInputElement>(null)
   const [mounted, setMounted] = useState(false)
   useEffect(() => setMounted(true), [])

   const products = useMemo(() => searchProducts(query, 8), [query])
   const categories = useMemo(() => searchCategories(query, 4), [query])

   useEffect(() => {
      if (!open) return
      setQuery('')
      setActive(0)
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
         clearTimeout(t)
         document.body.style.overflow = prev
      }
   }, [open])

   useEffect(() => setActive(0), [query])

   function go(href: string) {
      onClose()
      router.push(href)
   }

   function onKeyDown(e: React.KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') {
         e.preventDefault()
         setActive((i) => Math.min(i + 1, products.length - 1))
      }
      if (e.key === 'ArrowUp') {
         e.preventDefault()
         setActive((i) => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter') {
         e.preventDefault()
         if (products[active]) go(products[active].href)
         else if (query.trim()) go(`/search?q=${encodeURIComponent(query.trim())}`)
      }
   }

   if (!mounted || !open) return null

   return createPortal(
      <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Search">
         <button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-md animate-in fade-in-0 duration-300"
         />
         <div className="relative mx-auto mt-0 flex max-h-[100dvh] w-full max-w-3xl flex-col overflow-hidden bg-white shadow-[0_40px_120px_-30px_rgba(20,10,5,0.6)] animate-in fade-in-0 slide-in-from-top-4 duration-300 sm:mt-[8vh] sm:max-h-[80vh] sm:rounded-[2rem]">
            <div className="flex items-center gap-3 border-b px-5 py-4 sm:px-7 sm:py-5">
               <Search className="h-6 w-6 shrink-0 text-primary" />
               <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={`Search ${CATALOG_STATS.products}+ products…`}
                  className="h-10 flex-1 bg-transparent font-display text-xl font-semibold tracking-tight outline-none placeholder:font-normal placeholder:text-muted-foreground/70 sm:text-2xl"
                  aria-label="Search products"
               />
               <button
                  type="button"
                  onClick={onClose}
                  className="grid h-10 w-10 place-items-center rounded-full bg-muted transition hover:rotate-90 hover:bg-ink hover:text-white"
                  aria-label="Close"
               >
                  <X className="h-5 w-5" />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-7">
               {query.trim().length < 2 ? (
                  <>
                     <p className="eyebrow text-muted-foreground">Trending</p>
                     <div className="mt-3 flex flex-wrap gap-2">
                        {TRENDING.map((t, i) => (
                           <button
                              key={t}
                              type="button"
                              onClick={() => setQuery(t)}
                              className="rounded-full border px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-white animate-in fade-in-0 slide-in-from-bottom-2"
                              style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}
                           >
                              {t}
                           </button>
                        ))}
                     </div>
                     <p className="eyebrow mt-8 text-muted-foreground">Browse departments</p>
                     <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {DEPARTMENTS.map((d, i) => (
                           <Link
                              key={d.slug}
                              href={d.href}
                              onClick={onClose}
                              className="group flex items-center gap-3 rounded-2xl p-2 transition hover:bg-muted animate-in fade-in-0 slide-in-from-bottom-2"
                              style={{ animationDelay: `${120 + i * 30}ms`, animationFillMode: 'both' }}
                           >
                              <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl">
                                 <CatalogImage image={d.image} label={d.name} accent={d.accent} dark={d.dark} sizes="44px" className="transition duration-500 group-hover:scale-110" />
                              </span>
                              <span className="text-sm font-semibold leading-tight">{d.name}</span>
                           </Link>
                        ))}
                     </div>
                  </>
               ) : products.length === 0 && categories.length === 0 ? (
                  <div className="py-10 text-center">
                     <p className="font-display text-2xl font-bold">Nothing matches “{query}”</p>
                     <p className="mt-2 text-muted-foreground">We make lots of custom items — just ask.</p>
                     <Link href="/quote" onClick={onClose} className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-white">
                        Request a quote <ArrowRight className="h-4 w-4" />
                     </Link>
                  </div>
               ) : (
                  <>
                     {categories.length ? (
                        <div className="mb-6 flex flex-wrap gap-2">
                           {categories.map((c) => (
                              <Link
                                 key={c.key}
                                 href={c.href}
                                 onClick={onClose}
                                 className="rounded-full px-3.5 py-1.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                                 style={{ backgroundColor: c.accent }}
                              >
                                 {c.name} <span className="font-normal opacity-80">· {c.departmentName}</span>
                              </Link>
                           ))}
                        </div>
                     ) : null}
                     <ul className="grid gap-2 sm:grid-cols-2">
                        {products.map((p, i) => (
                           <li key={p.key} className="animate-in fade-in-0 slide-in-from-bottom-1" style={{ animationDelay: `${i * 35}ms`, animationFillMode: 'both' }}>
                              <Link
                                 href={p.href}
                                 onClick={onClose}
                                 onMouseEnter={() => setActive(i)}
                                 className={cn(
                                    'group flex items-center gap-3 rounded-2xl p-2 transition',
                                    i === active ? 'bg-muted' : 'hover:bg-muted'
                                 )}
                              >
                                 <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                                    <CatalogImage image={p.image} label={p.name} accent={p.accent} dark={p.dark} sizes="64px" />
                                 </span>
                                 <span className="min-w-0 flex-1">
                                    <span className="block truncate font-semibold">{p.name}</span>
                                    <span className="block truncate text-xs" style={{ color: p.accent }}>
                                       {p.categoryName}
                                    </span>
                                 </span>
                                 {i === active ? <CornerDownLeft className="mr-2 hidden h-4 w-4 text-muted-foreground sm:block" /> : null}
                              </Link>
                           </li>
                        ))}
                     </ul>
                     <button
                        type="button"
                        onClick={() => go(`/search?q=${encodeURIComponent(query.trim())}`)}
                        className="group mt-4 flex w-full items-center justify-between rounded-2xl bg-ink px-5 py-4 text-left font-semibold text-white"
                     >
                        See all results for “{query.trim()}”
                        <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                     </button>
                  </>
               )}
            </div>

            <div className="hidden items-center gap-4 border-t bg-muted/50 px-7 py-3 text-xs text-muted-foreground sm:flex">
               <span><kbd className="rounded border bg-white px-1.5 py-0.5 font-sans">↑</kbd> <kbd className="rounded border bg-white px-1.5 py-0.5 font-sans">↓</kbd> navigate</span>
               <span><kbd className="rounded border bg-white px-1.5 py-0.5 font-sans">Enter</kbd> open</span>
               <span><kbd className="rounded border bg-white px-1.5 py-0.5 font-sans">Esc</kbd> close</span>
            </div>
         </div>
      </div>,
      document.body
   )
}
