'use client'

import {
   PACKAGING_FEATURED_CARDS,
   PACKAGING_MENU_COLUMNS,
   PACKAGING_NAV_ITEMS,
   PACKAGING_QUICK_PICKS,
   type PackagingMenuColumn,
   type PackagingMenuLink,
} from '@/lib/packaging-menu'
import { cn } from '@/lib/utils'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const DEFAULT_COLUMN = PACKAGING_MENU_COLUMNS[0].title

export function PackagingMegaMenu() {
   const [open, setOpen] = useState(false)
   const [activeColumn, setActiveColumn] = useState(DEFAULT_COLUMN)
   const [activeNav, setActiveNav] = useState<string | null>(null)

   const active =
      PACKAGING_MENU_COLUMNS.find((column) => column.title === activeColumn) ??
      PACKAGING_MENU_COLUMNS[0]

   function openWithColumn(columnTitle?: string, navLabel?: string) {
      if (columnTitle) setActiveColumn(columnTitle)
      if (navLabel) setActiveNav(navLabel)
      setOpen(true)
   }

   function closeMenu() {
      setOpen(false)
      setActiveNav(null)
   }

   return (
      <div
         className="relative hidden w-full border-b bg-background md:block"
         onMouseLeave={closeMenu}
      >
         <nav className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-6 lg:px-12">
            <button
               type="button"
               className={cn(
                  'relative whitespace-nowrap px-3 py-3 text-sm font-semibold transition-colors',
                  open && !activeNav
                     ? 'text-red-600 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-red-600'
                     : 'text-foreground/80 hover:text-foreground'
               )}
               onMouseEnter={() => openWithColumn(DEFAULT_COLUMN)}
               onFocus={() => openWithColumn(DEFAULT_COLUMN)}
               onClick={() =>
                  open ? closeMenu() : openWithColumn(DEFAULT_COLUMN)
               }
               aria-expanded={open}
            >
               Packaging
            </button>
            {PACKAGING_NAV_ITEMS.map((item) => {
               const isActive = open && activeNav === item.label
               return (
                  <Link
                     key={item.label}
                     href={item.href}
                     onMouseEnter={() =>
                        openWithColumn(item.columnTitle, item.label)
                     }
                     onFocus={() => openWithColumn(item.columnTitle, item.label)}
                     className={cn(
                        'relative whitespace-nowrap px-3 py-3 text-sm transition-colors',
                        isActive
                           ? 'font-semibold text-red-600 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-red-600'
                           : 'text-foreground/80 hover:text-foreground'
                     )}
                  >
                     {item.label}
                  </Link>
               )
            })}
         </nav>

         {open ? (
            <div
               className="absolute inset-x-0 top-full z-50 border-b bg-background/95 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-background/90"
               onMouseEnter={() => setOpen(true)}
            >
               <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[220px_minmax(0,1fr)_280px]">
                  <aside className="border-r bg-muted/40 p-4">
                     <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Shop by category
                     </p>
                     <div className="space-y-1">
                        {PACKAGING_MENU_COLUMNS.map((column) => {
                           const isActive = column.title === active.title
                           return (
                              <button
                                 key={column.title}
                                 type="button"
                                 onMouseEnter={() => {
                                    setActiveColumn(column.title)
                                    const match = PACKAGING_NAV_ITEMS.find(
                                       (item) => item.columnTitle === column.title
                                    )
                                    setActiveNav(match?.label ?? null)
                                 }}
                                 onFocus={() => setActiveColumn(column.title)}
                                 onClick={() => setActiveColumn(column.title)}
                                 className={cn(
                                    'flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition',
                                    isActive
                                       ? 'bg-background shadow-sm ring-1 ring-border'
                                       : 'hover:bg-background/70'
                                 )}
                              >
                                 <span
                                    className={cn(
                                       'mt-1 h-2.5 w-2.5 shrink-0 rounded-full',
                                       column.accent
                                    )}
                                 />
                                 <span>
                                    <span className="block text-sm font-semibold text-foreground">
                                       {column.title}
                                    </span>
                                    <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                                       {column.blurb}
                                    </span>
                                 </span>
                              </button>
                           )
                        })}
                     </div>
                     <Link
                        href="/products"
                        onClick={closeMenu}
                        className="mt-4 inline-flex items-center gap-1 px-3 text-sm font-medium text-red-600 hover:underline"
                     >
                        Browse all packaging
                        <ArrowRightIcon className="h-3.5 w-3.5" />
                     </Link>
                  </aside>

                  <div className="p-6">
                     <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                        <div>
                           <div className="mb-1 flex items-center gap-2">
                              <span
                                 className={cn('h-2 w-2 rounded-full', active.accent)}
                              />
                              <h3 className="text-lg font-semibold tracking-tight">
                                 {active.title}
                              </h3>
                           </div>
                           <p className="text-sm text-muted-foreground">{active.blurb}</p>
                        </div>
                        <Link
                           href={active.href}
                           onClick={closeMenu}
                           className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:border-red-200 hover:text-red-600"
                        >
                           View all {active.title}
                           <ArrowRightIcon className="h-3.5 w-3.5" />
                        </Link>
                     </div>

                     <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                        {active.links.map((link) => (
                           <CategoryCard
                              key={link.label}
                              link={link}
                              onNavigate={closeMenu}
                           />
                        ))}
                     </div>

                     <div className="mt-6 border-t pt-4">
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                           Popular picks
                        </p>
                        <div className="flex flex-wrap gap-2">
                           {PACKAGING_QUICK_PICKS.map((pick) => (
                              <Link
                                 key={pick.label}
                                 href={pick.href}
                                 onClick={closeMenu}
                                 className="inline-flex items-center gap-2 rounded-full border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground/80 transition hover:border-red-200 hover:text-red-600"
                              >
                                 <img
                                    src={pick.image}
                                    alt=""
                                    className="h-6 w-6 rounded-full object-cover"
                                 />
                                 {pick.label}
                              </Link>
                           ))}
                        </div>
                     </div>
                  </div>

                  <aside className="space-y-3 border-l bg-muted/20 p-4">
                     <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Featured
                     </p>
                     {PACKAGING_FEATURED_CARDS.map((card) => (
                        <Link
                           key={card.title}
                           href={card.href}
                           onClick={closeMenu}
                           className="group block overflow-hidden rounded-2xl border bg-background shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                           <div className="relative aspect-[16/10] overflow-hidden">
                              <img
                                 src={card.image}
                                 alt={card.title}
                                 className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                              />
                              {card.badge ? (
                                 <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                                    {card.badge}
                                 </span>
                              ) : null}
                           </div>
                           <div className="space-y-1 p-3">
                              <p className="text-sm font-semibold">{card.title}</p>
                              <p className="text-xs leading-relaxed text-muted-foreground">
                                 {card.description}
                              </p>
                           </div>
                        </Link>
                     ))}
                  </aside>
               </div>
            </div>
         ) : null}
      </div>
   )
}

function CategoryCard({
   link,
   onNavigate,
}: {
   link: PackagingMenuLink
   onNavigate?: () => void
}) {
   return (
      <Link
         href={link.href}
         onClick={onNavigate}
         className="group flex items-center gap-3 rounded-2xl border border-transparent bg-muted/30 p-2.5 transition hover:border-border hover:bg-background hover:shadow-sm"
      >
         <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-border">
            <img
               src={link.image}
               alt=""
               className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
         </span>
         <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-foreground group-hover:text-red-600">
               {link.label}
            </span>
            {link.description ? (
               <span className="mt-0.5 line-clamp-2 block text-[11px] leading-snug text-muted-foreground">
                  {link.description}
               </span>
            ) : null}
         </span>
      </Link>
   )
}

export function PackagingMobileLinks({ onNavigate }: { onNavigate?: () => void }) {
   return (
      <div className="space-y-5">
         <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
               Quick links
            </p>
            <div className="space-y-1">
               {PACKAGING_NAV_ITEMS.map((item) => (
                  <Link
                     key={item.label}
                     href={item.href}
                     className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm text-foreground/80 hover:bg-muted"
                     onClick={onNavigate}
                  >
                     <img
                        src={item.image}
                        alt=""
                        className="h-9 w-9 rounded-lg object-cover ring-1 ring-border"
                     />
                     {item.label}
                  </Link>
               ))}
            </div>
         </div>

         {PACKAGING_MENU_COLUMNS.map((column: PackagingMenuColumn) => (
            <div key={column.title}>
               <Link
                  href={column.href}
                  className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-red-600"
                  onClick={onNavigate}
               >
                  <span className={cn('h-2 w-2 rounded-full', column.accent)} />
                  {column.title}
               </Link>
               <div className="space-y-1">
                  {column.links.map((link) => (
                     <Link
                        key={link.label}
                        href={link.href}
                        className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm text-foreground/80 hover:bg-muted"
                        onClick={onNavigate}
                     >
                        <img
                           src={link.image}
                           alt=""
                           className="h-10 w-10 rounded-lg object-cover ring-1 ring-border"
                        />
                        <span>
                           <span className="block font-medium text-foreground">
                              {link.label}
                           </span>
                           {link.description ? (
                              <span className="line-clamp-1 text-[11px] text-muted-foreground">
                                 {link.description}
                              </span>
                           ) : null}
                        </span>
                     </Link>
                  ))}
               </div>
            </div>
         ))}
      </div>
   )
}
