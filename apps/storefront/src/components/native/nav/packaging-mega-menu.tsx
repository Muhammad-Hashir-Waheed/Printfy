'use client'

import {
   PACKAGING_FEATURED_CARDS,
   PACKAGING_MENU_COLUMNS,
   PACKAGING_NAV_ITEMS,
   PACKAGING_SIDE_COLUMNS,
} from '@/lib/packaging-menu'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useState } from 'react'

export function PackagingMegaMenu() {
   const [open, setOpen] = useState(false)

   return (
      <div
         className="relative hidden w-full border-b bg-background md:block"
         onMouseEnter={() => setOpen(true)}
         onMouseLeave={() => setOpen(false)}
      >
         <nav className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-6 lg:px-12">
            <button
               type="button"
               className={cn(
                  'relative whitespace-nowrap px-3 py-3 text-sm font-semibold transition-colors',
                  open
                     ? 'text-red-600 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-red-600'
                     : 'text-foreground/80 hover:text-foreground'
               )}
               onClick={() => setOpen((v) => !v)}
               aria-expanded={open}
            >
               Packaging
            </button>
            {PACKAGING_NAV_ITEMS.map((item) => (
               <Link
                  key={item.label}
                  href={item.href}
                  className="whitespace-nowrap px-3 py-3 text-sm text-foreground/80 transition-colors hover:text-foreground"
               >
                  {item.label}
               </Link>
            ))}
         </nav>

         {open ? (
            <div className="absolute inset-x-0 top-full z-50 border-b bg-background shadow-lg">
               <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[1fr_320px] lg:px-12">
                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                     {PACKAGING_MENU_COLUMNS.map((column) => (
                        <MenuColumn
                           key={column.title}
                           title={column.title}
                           href={column.href}
                           links={column.links}
                           onNavigate={() => setOpen(false)}
                        />
                     ))}
                  </div>

                  <div className="flex flex-col gap-4 border-t pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                     <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
                        {PACKAGING_SIDE_COLUMNS.map((column) => (
                           <MenuColumn
                              key={column.title}
                              title={column.title}
                              href={column.href}
                              links={column.links}
                              onNavigate={() => setOpen(false)}
                           />
                        ))}
                     </div>

                     <div className="mt-2 grid grid-cols-2 gap-3">
                        {PACKAGING_FEATURED_CARDS.map((card) => (
                           <Link
                              key={card.title}
                              href={card.href}
                              className="group overflow-hidden rounded-lg border bg-card transition hover:shadow-md"
                              onClick={() => setOpen(false)}
                           >
                              <div className="grid grid-cols-3 gap-px bg-muted">
                                 {card.images.map((src, i) => (
                                    <div
                                       key={`${card.title}-${i}`}
                                       className="relative aspect-square overflow-hidden"
                                    >
                                       <img
                                          src={src}
                                          alt={i === 0 ? card.alt : ''}
                                          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                                       />
                                    </div>
                                 ))}
                              </div>
                              <p className="px-2 py-2 text-center text-xs font-semibold text-foreground">
                                 {card.title}
                              </p>
                           </Link>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         ) : null}
      </div>
   )
}

function CategoryThumbs({ images }: { images?: string[] }) {
   if (!images?.length) return null
   const thumbs = images.slice(0, 3)
   return (
      <span className="flex shrink-0 gap-0.5">
         {thumbs.map((src, i) => (
            <img
               key={`${src}-${i}`}
               src={src}
               alt=""
               className="h-7 w-7 rounded object-cover ring-1 ring-border"
            />
         ))}
      </span>
   )
}

function MenuColumn({
   title,
   href,
   links,
   onNavigate,
}: {
   title: string
   href: string
   links: Array<{ label: string; href: string; image?: string; images?: string[] }>
   onNavigate?: () => void
}) {
   return (
      <div>
         <Link
            href={href}
            onClick={onNavigate}
            className="mb-3 inline-block text-sm font-bold text-foreground transition-colors hover:text-red-600 hover:underline"
         >
            {title}
         </Link>
         <ul className="space-y-2.5">
            {links.map((link) => {
               const images =
                  link.images?.length ? link.images : link.image ? [link.image] : undefined
               return (
                  <li key={link.label}>
                     <Link
                        href={link.href}
                        onClick={onNavigate}
                        className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-red-600"
                     >
                        <CategoryThumbs images={images} />
                        <span className="group-hover:underline">{link.label}</span>
                     </Link>
                  </li>
               )
            })}
         </ul>
      </div>
   )
}

export function PackagingMobileLinks({ onNavigate }: { onNavigate?: () => void }) {
   return (
      <div className="space-y-4">
         <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
               Packaging
            </p>
            <div className="space-y-2">
               {PACKAGING_NAV_ITEMS.map((item) => (
                  <Link
                     key={item.label}
                     href={item.href}
                     className="block text-sm text-foreground/80"
                     onClick={onNavigate}
                  >
                     {item.label}
                  </Link>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-2 gap-2">
            {PACKAGING_FEATURED_CARDS.map((card) => (
               <Link
                  key={card.title}
                  href={card.href}
                  className="overflow-hidden rounded-lg border"
                  onClick={onNavigate}
               >
                  <div className="grid grid-cols-3 gap-px bg-muted">
                     {card.images.map((src, i) => (
                        <img
                           key={`${card.title}-m-${i}`}
                           src={src}
                           alt={i === 0 ? card.alt : ''}
                           className="aspect-square w-full object-cover"
                        />
                     ))}
                  </div>
                  <p className="px-1.5 py-1.5 text-center text-[11px] font-medium">{card.title}</p>
               </Link>
            ))}
         </div>

         {PACKAGING_MENU_COLUMNS.map((column) => (
            <div key={column.title}>
               <Link
                  href={column.href}
                  className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-red-600"
                  onClick={onNavigate}
               >
                  {column.title}
               </Link>
               <div className="space-y-2">
                  {column.links.map((link) => {
                     const images =
                        link.images?.length ? link.images : link.image ? [link.image] : undefined
                     return (
                        <Link
                           key={link.label}
                           href={link.href}
                           className="flex items-center gap-2 text-sm text-foreground/80"
                           onClick={onNavigate}
                        >
                           <CategoryThumbs images={images} />
                           {link.label}
                        </Link>
                     )
                  })}
               </div>
            </div>
         ))}
      </div>
   )
}
