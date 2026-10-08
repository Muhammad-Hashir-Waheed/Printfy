'use client'

import { DEPARTMENTS, type Department } from '@/catalog'
import config from '@/config/site'
import { cn } from '@/lib/utils'
import { useCart } from '@/state/cart-store'
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, Search, ShoppingBag, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { BrandLogo } from './brand-logo'
import { CatalogImage } from './catalog-image'
import { MobileMenu } from './mobile-menu'
import { Magnetic } from './motion'
import { SearchOverlay } from './search-overlay'

const ANNOUNCEMENTS = [
   'Free artwork check on every order',
   'Custom sizes & shapes — quotes within 1 business day',
   'Signage designed, fabricated & installed',
   'Neon · Acrylic · Packaging · Print — one studio',
]

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/* ─────────────── Cart / quote-list button ─────────────── */

function CartButton() {
   const { count } = useCart()
   const [mounted, setMounted] = useState(false)
   const [bump, setBump] = useState(0)
   const prev = useRef(count)

   useEffect(() => setMounted(true), [])
   useEffect(() => {
      if (count > prev.current) setBump((b) => b + 1)
      prev.current = count
   }, [count])

   const label = config.showPrices ? 'Cart' : 'Quote list'

   return (
      <Link
         href="/cart"
         className="group relative inline-flex h-11 items-center gap-2 rounded-full px-3 transition hover:bg-ink/5"
         aria-label={`${label}${mounted && count ? `, ${count} items` : ''}`}
      >
         <span key={bump} className={cn('relative', bump && 'animate-pop')}>
            <ShoppingBag className="h-[22px] w-[22px] transition group-hover:-rotate-6" />
            {mounted && count > 0 ? (
               <span className="absolute -right-2 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-white ring-2 ring-background">
                  {count}
               </span>
            ) : null}
         </span>
         <span className="hidden text-sm font-semibold xl:inline">{label}</span>
      </Link>
   )
}

/* ─────────────── Mega panel ─────────────── */

function MegaPanel({
   dept,
   onNavigate,
   rail,
   onPickDept,
}: {
   dept: Department
   onNavigate: () => void
   rail?: boolean
   onPickDept?: (slug: string) => void
}) {
   const [activeSlug, setActiveSlug] = useState(dept.categories[0]?.slug)
   useEffect(() => setActiveSlug(dept.categories[0]?.slug), [dept])
   const active = dept.categories.find((c) => c.slug === activeSlug) ?? dept.categories[0]
   const products = active?.products ?? []

   return (
      <div
         className={cn(
            'page-shell grid gap-6 py-6',
            rail
               ? 'lg:grid-cols-[220px_minmax(220px,260px)_1fr_minmax(260px,300px)]'
               : 'lg:grid-cols-[minmax(240px,280px)_1fr_minmax(280px,340px)]'
         )}
      >
         {rail ? (
            <ul className="space-y-0.5 border-r pr-4">
               {DEPARTMENTS.map((d) => (
                  <li key={d.slug}>
                     <Link
                        href={d.href}
                        onMouseEnter={() => onPickDept?.(d.slug)}
                        onFocus={() => onPickDept?.(d.slug)}
                        onClick={onNavigate}
                        className={cn(
                           'flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition',
                           d.slug === dept.slug ? 'bg-ink text-white' : 'text-foreground/70 hover:bg-muted hover:text-ink'
                        )}
                     >
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.accent }} />
                        {d.name}
                     </Link>
                  </li>
               ))}
            </ul>
         ) : null}

         <ul key={dept.slug} className="space-y-1 border-r pr-4">
            {dept.categories.map((cat, i) => (
               <li
                  key={cat.slug}
                  className="animate-in fade-in-0 slide-in-from-left-2 duration-300"
                  style={{ animationDelay: `${i * 35}ms`, animationFillMode: 'both' }}
               >
                  <Link
                     href={cat.href}
                     onMouseEnter={() => setActiveSlug(cat.slug)}
                     onFocus={() => setActiveSlug(cat.slug)}
                     onClick={onNavigate}
                     className={cn(
                        'group flex items-center gap-3 rounded-2xl p-1.5 pr-3 text-sm font-medium transition-all duration-300',
                        cat.slug === active?.slug ? 'translate-x-1 bg-muted' : 'hover:bg-muted/70'
                     )}
                  >
                     <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
                        <CatalogImage image={cat.image} label={cat.name} accent={dept.accent} dark={dept.dark} sizes="40px" />
                     </span>
                     <span className="flex-1 leading-tight">{cat.name}</span>
                     <ArrowRight
                        className={cn(
                           'h-4 w-4 transition-all duration-300',
                           cat.slug === active?.slug ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
                        )}
                        style={{ color: dept.accent }}
                     />
                  </Link>
               </li>
            ))}
         </ul>

         <div key={active?.key} className="min-w-0 animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
            {active ? (
               <>
                  <p className="eyebrow" style={{ color: dept.accent }}>
                     {dept.name}
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-bold tracking-tight">{active.name}</h3>
                  <p className="mt-1 max-w-md text-sm text-muted-foreground">{active.blurb}</p>
                  {products.length ? (
                     <ul className={cn('mt-5 grid gap-x-6 gap-y-0.5', rail ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-2 xl:grid-cols-3')}>
                        {products.slice(0, rail ? 14 : 18).map((p) => (
                           <li key={p.key}>
                              <Link
                                 href={p.href}
                                 onClick={onNavigate}
                                 className="group/l flex items-center gap-1.5 truncate py-1.5 text-[14px] text-foreground/75 transition hover:text-ink"
                              >
                                 <span className="h-px w-0 bg-current transition-all duration-300 group-hover/l:w-3" />
                                 <span className="truncate">{p.name}</span>
                              </Link>
                           </li>
                        ))}
                     </ul>
                  ) : null}
                  <Link
                     href={active.href}
                     onClick={onNavigate}
                     className="group/all mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:gap-3"
                  >
                     {active.external ? 'Open' : `Shop all ${products.length || ''} ${active.name.toLowerCase()}`}
                     <ArrowRight className="h-4 w-4" />
                  </Link>
               </>
            ) : null}
         </div>

         {/* Preview card — crossfades to the hovered category */}
         <Link
            href={active?.href ?? dept.href}
            onClick={onNavigate}
            className="group relative hidden min-h-[300px] overflow-hidden rounded-[1.75rem] lg:block"
            style={{ backgroundColor: dept.dark ? '#120d16' : '#efe7dc' }}
         >
            {dept.categories.map((c) => (
               <span
                  key={c.slug}
                  className={cn(
                     'absolute inset-0 transition-all duration-700 ease-out',
                     c.slug === active?.slug ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                  )}
               >
                  <CatalogImage image={c.image} label={c.name} accent={dept.accent} dark={dept.dark} sizes="340px" />
               </span>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
               <p className="font-display text-2xl font-bold leading-tight">{dept.tagline}</p>
               <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink transition group-hover:gap-2.5">
                  Explore {active?.name ?? dept.short} <ArrowUpRight className="h-4 w-4" />
               </span>
            </div>
         </Link>
      </div>
   )
}

/* ─────────────── Department row with gliding hover pill ─────────────── */

function DepartmentRow({
   openSlug,
   onOpen,
   onClose,
}: {
   openSlug: string | null
   onOpen: (slug: string) => void
   onClose: () => void
}) {
   const pathname = usePathname()
   const listRef = useRef<HTMLUListElement>(null)
   const [pill, setPill] = useState<{ left: number; width: number; color: string } | null>(null)
   const currentSlug = DEPARTMENTS.find((d) => pathname?.startsWith(d.href))?.slug

   const moveTo = useCallback((slug: string | null | undefined) => {
      const list = listRef.current
      if (!list || !slug) return setPill(null)
      const el = list.querySelector<HTMLElement>(`[data-slug="${slug}"]`)
      const dept = DEPARTMENTS.find((d) => d.slug === slug)
      if (!el || !dept) return setPill(null)
      setPill({ left: el.offsetLeft, width: el.offsetWidth, color: dept.accent })
   }, [])

   useIsoLayoutEffect(() => moveTo(openSlug ?? currentSlug), [openSlug, currentSlug, moveTo])

   return (
      <nav aria-label="Departments" className="page-shell">
         <ul ref={listRef} className="relative flex items-center justify-between py-1.5" onMouseLeave={() => moveTo(openSlug ?? currentSlug)}>
            {pill ? (
               <span
                  aria-hidden
                  className="absolute top-1.5 h-9 rounded-full transition-all duration-500 [transition-timing-function:cubic-bezier(.5,1.4,.4,1)]"
                  style={{ left: pill.left, width: pill.width, backgroundColor: `${pill.color}1f`, boxShadow: `inset 0 0 0 1px ${pill.color}33` }}
               />
            ) : null}
            {DEPARTMENTS.map((d) => {
               const isOpen = openSlug === d.slug
               const isCurrent = currentSlug === d.slug
               return (
                  <li key={d.slug} data-slug={d.slug} className="relative" onMouseEnter={() => onOpen(d.slug)}>
                     <Link
                        href={d.href}
                        onFocus={() => onOpen(d.slug)}
                        onClick={onClose}
                        aria-expanded={isOpen}
                        className={cn(
                           'relative z-10 inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-[13.5px] font-semibold transition-colors xl:px-3.5 xl:text-[14px]',
                           isOpen || isCurrent ? 'text-ink' : 'text-foreground/60 hover:text-ink'
                        )}
                     >
                        <span
                           className={cn('h-1.5 w-1.5 rounded-full transition-transform duration-300', isOpen || isCurrent ? 'scale-100' : 'scale-0')}
                           style={{ backgroundColor: d.accent }}
                        />
                        {d.short}
                     </Link>
                  </li>
               )
            })}
         </ul>
      </nav>
   )
}

/* ─────────────── Header ─────────────── */

export function SiteHeader() {
   const pathname = usePathname()
   const [compact, setCompact] = useState(false)
   const [openSlug, setOpenSlug] = useState<string | null>(null)
   const [shopOpen, setShopOpen] = useState(false)
   const [searchOpen, setSearchOpen] = useState(false)
   const [railSlug, setRailSlug] = useState(DEPARTMENTS[0].slug)
   const timer = useRef<ReturnType<typeof setTimeout>>()

   useEffect(() => {
      let ticking = false
      const onScroll = () => {
         if (ticking) return
         ticking = true
         requestAnimationFrame(() => {
            setCompact(window.scrollY > 120)
            ticking = false
         })
      }
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
   }, [])

   useEffect(() => {
      setOpenSlug(null)
      setShopOpen(false)
   }, [pathname])

   useEffect(() => {
      if (compact) setOpenSlug(null)
      else setShopOpen(false)
   }, [compact])

   useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
         if (e.key === 'Escape') {
            setOpenSlug(null)
            setShopOpen(false)
         }
         const typing = /input|textarea|select/i.test((e.target as HTMLElement)?.tagName ?? '')
         if (((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing)) {
            e.preventDefault()
            setSearchOpen(true)
         }
      }
      window.addEventListener('keydown', onKey)
      return () => window.removeEventListener('keydown', onKey)
   }, [])

   const openSoon = (slug: string) => {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setOpenSlug(slug), openSlug ? 0 : 110)
   }
   const closeSoon = () => {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
         setOpenSlug(null)
         setShopOpen(false)
      }, 180)
   }
   const cancelClose = () => clearTimeout(timer.current)
   const closeAll = () => {
      setOpenSlug(null)
      setShopOpen(false)
   }

   const megaDept = shopOpen
      ? DEPARTMENTS.find((d) => d.slug === railSlug)
      : DEPARTMENTS.find((d) => d.slug === openSlug)

   return (
      <>
         {/* Announcement ticker */}
         <div className="relative overflow-hidden bg-ink text-white">
            <div className="flex w-max animate-marquee items-center py-2 text-[12.5px] font-medium hover:[animation-play-state:paused]">
               {[0, 1].map((copy) => (
                  <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
                     {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((text, i) => (
                        <span key={`${copy}-${i}`} className="flex items-center gap-6 px-6">
                           <Sparkles className="h-3 w-3 text-coral" />
                           {text}
                        </span>
                     ))}
                  </div>
               ))}
            </div>
         </div>

         <header
            className={cn('sticky top-0 z-40 transition-[padding] duration-500 [transition-timing-function:cubic-bezier(.2,.7,.2,1)]', compact ? 'lg:px-4 lg:pt-3' : '')}
            onMouseLeave={closeSoon}
            onMouseEnter={cancelClose}
         >
            <div
               className={cn(
                  'relative mx-auto transition-all duration-500 [transition-timing-function:cubic-bezier(.2,.7,.2,1)]',
                  compact
                     ? 'bg-white/80 shadow-[0_18px_50px_-24px_rgba(30,20,10,0.45)] backdrop-blur-xl backdrop-saturate-150 lg:max-w-[1280px] lg:rounded-full lg:border lg:border-white/60'
                     : 'max-w-full border-b border-ink/5 bg-background/85 backdrop-blur-xl'
               )}
            >
               <div className={cn('page-shell flex items-center gap-3 transition-all duration-500 lg:gap-5', compact ? 'h-16 lg:px-5' : 'h-[68px] lg:h-[78px]')}>
                  <MobileMenu
                     trigger={
                        <button type="button" className="-ml-2 grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5 lg:hidden" aria-label="Open menu">
                           <Menu className="h-6 w-6" />
                        </button>
                     }
                  />

                  <Link href="/" aria-label={`${config.name} home`} className="group shrink-0">
                     <span className="inline-block transition-transform duration-500 group-hover:-rotate-2 group-hover:scale-[1.03]">
                        <BrandLogo />
                     </span>
                  </Link>

                  {/* Compact mode: "Shop" mega trigger */}
                  {compact ? (
                     <button
                        type="button"
                        onMouseEnter={() => {
                           cancelClose()
                           setShopOpen(true)
                        }}
                        onClick={() => setShopOpen((o) => !o)}
                        aria-expanded={shopOpen}
                        className={cn(
                           'hidden items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors animate-in fade-in-0 slide-in-from-left-2 duration-500 lg:inline-flex',
                           shopOpen ? 'bg-ink text-white' : 'hover:bg-ink/5'
                        )}
                     >
                        Shop <ChevronDown className={cn('h-4 w-4 transition-transform duration-300', shopOpen && 'rotate-180')} />
                     </button>
                  ) : null}

                  {/* Search trigger */}
                  <button
                     type="button"
                     onClick={() => setSearchOpen(true)}
                     className="group mx-auto hidden h-12 max-w-xl flex-1 items-center gap-3 rounded-full border border-ink/10 bg-white/90 pl-4 pr-2 text-left text-[15px] text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,.8),0_1px_2px_rgba(30,20,10,.06)] transition hover:border-ink/30 hover:shadow-[0_10px_30px_-15px_rgba(30,20,10,.35)] md:flex"
                  >
                     <Search className="h-[18px] w-[18px] transition group-hover:scale-110 group-hover:text-primary" />
                     <span className="flex-1 truncate">Search boxes, cards, neon signs…</span>
                     <kbd className="hidden rounded-full bg-muted px-2.5 py-1 font-sans text-xs font-semibold text-foreground/60 lg:inline">Ctrl K</kbd>
                  </button>

                  <div className="ml-auto flex items-center gap-1 md:ml-0">
                     <button
                        type="button"
                        onClick={() => setSearchOpen(true)}
                        className="grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5 md:hidden"
                        aria-label="Search"
                     >
                        <Search className="h-[22px] w-[22px]" />
                     </button>
                     <Link href="/contact" className="link-draw hidden px-2 py-1 text-sm font-semibold lg:inline-block">
                        Help
                     </Link>
                     <Magnetic strength={0.25} className="hidden sm:inline-block">
                        <Link
                           href="/quote"
                           className="ring-glow btn-shine group ml-1 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-ink/90"
                        >
                           Get a quote
                           <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </Link>
                     </Magnetic>
                     <CartButton />
                  </div>
               </div>

               {/* Department row — collapses into the compact pill */}
               <div
                  className={cn(
                     'hidden overflow-hidden transition-all duration-500 [transition-timing-function:cubic-bezier(.2,.7,.2,1)] lg:block',
                     compact ? 'max-h-0 opacity-0' : 'max-h-16 opacity-100'
                  )}
               >
                  <DepartmentRow openSlug={openSlug} onOpen={openSoon} onClose={closeAll} />
               </div>

               {/* Tablet chips */}
               <nav aria-label="Departments" className={cn('hidden md:block lg:hidden', compact && 'md:hidden')}>
                  <ul className="no-scrollbar page-shell flex gap-2 overflow-x-auto pb-3">
                     {DEPARTMENTS.map((d) => (
                        <li key={d.slug}>
                           <Link
                              href={d.href}
                              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-sm font-medium transition hover:-translate-y-0.5 hover:border-ink"
                           >
                              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.accent }} />
                              {d.short}
                           </Link>
                        </li>
                     ))}
                  </ul>
               </nav>

               {/* Mega menu */}
               {megaDept ? (
                  <div
                     className={cn(
                        'absolute inset-x-0 top-full z-40 hidden overflow-hidden border bg-white/95 shadow-[0_50px_100px_-40px_rgba(30,20,10,0.5)] backdrop-blur-xl animate-in fade-in-0 slide-in-from-top-2 duration-300 lg:block',
                        compact ? 'mt-3 rounded-[2rem]' : 'border-x-0'
                     )}
                     onMouseEnter={cancelClose}
                  >
                     <div className="h-1 w-full transition-colors duration-500" style={{ backgroundColor: megaDept.accent }} />
                     <MegaPanel dept={megaDept} onNavigate={closeAll} rail={shopOpen} onPickDept={setRailSlug} />
                  </div>
               ) : null}
            </div>
         </header>

         {/* Dim the page while the mega menu is open */}
         <div
            aria-hidden
            className={cn(
               'pointer-events-none fixed inset-0 z-30 hidden bg-ink/20 backdrop-blur-[2px] transition-opacity duration-300 lg:block',
               megaDept ? 'opacity-100' : 'opacity-0'
            )}
         />

         <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      </>
   )
}
