'use client'

import { Button } from '@/components/ui/button'
import {
   buildCatalogHref,
   HOMEPAGE_CATEGORY_TILES,
} from '@/lib/catalog-navigation'
import { CATALOG_IMAGES } from '@/lib/catalog-images'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

/** Neon spotlight — one dark beat after products */
export function NeonSignsSection() {
   const tiles = [
      {
         title: 'Custom neon',
         href: '/products/custom-neon-sign',
         image: CATALOG_IMAGES.neonSign,
      },
      {
         title: 'LED letters',
         href: '/products/led-channel-letter',
         image: CATALOG_IMAGES.ledSign,
      },
      {
         title: 'Script neon',
         href: '/products/script-neon-sign',
         image: CATALOG_IMAGES.neonShop,
      },
      {
         title: 'Light boxes',
         href: '/products/backlit-lightbox',
         image: CATALOG_IMAGES.neonBrandBrew,
      },
   ]

   return (
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-950 via-[#1a0b2e] to-[#0c1a2e] px-5 py-10 text-white sm:px-8 sm:py-12">
         <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-[#FF5A52]/20 blur-[90px]" />
         <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-[#7C5CFC]/25 blur-[100px]" />

         <div className="relative mx-auto max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-center">
               <div className="space-y-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5EEAD4]">
                     Brand neon &amp; LED
                  </p>
                  <h2 className="text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">
                     Light up your storefront
                  </h2>
                  <p className="max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
                     Illuminated logo signs — neon script, LED channel letters, and light
                     boxes that make your brand glow after dark.
                  </p>
                  <Link href={buildCatalogHref({ productType: 'LED & Neon Signs' })}>
                     <Button className="mt-1 h-11 rounded-xl bg-[#FF5A52] px-5 font-semibold text-white hover:bg-[#ff6d66]">
                        Shop neon &amp; LED
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                     </Button>
                  </Link>
               </div>

               <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  {tiles.map((tile) => (
                     <Link
                        key={tile.title}
                        href={tile.href}
                        className="group relative overflow-hidden rounded-xl ring-1 ring-white/10 transition hover:ring-[#5EEAD4]/40"
                     >
                        <div className="relative aspect-[4/3]">
                           <img
                              src={tile.image}
                              alt={tile.title}
                              loading="lazy"
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                           <span className="absolute bottom-2.5 left-2.5 text-xs font-semibold text-white">
                              {tile.title}
                           </span>
                        </div>
                     </Link>
                  ))}
               </div>
            </div>
         </div>
      </section>
   )
}

/** Compact category mosaic — no duplicate pizza/burger hero tiles */
export function ProductShowcaseSection() {
   return (
      <section className="space-y-5">
         <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
               <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FF5A52]">
                  Browse
               </p>
               <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Shop by category
               </h2>
               <p className="mt-1 text-sm text-muted-foreground">
                  From takeout to shipping — pick a lane and customize.
               </p>
            </div>
            <Link
               href="/products"
               className="inline-flex items-center gap-1 text-sm font-semibold text-[#FF5A52] hover:underline"
            >
               View all packaging
               <ArrowRightIcon className="h-4 w-4" />
            </Link>
         </div>

         <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-3">
            {HOMEPAGE_CATEGORY_TILES.map((tile, i) => {
               const featured = i === 0
               return (
                  <Link
                     key={tile.title}
                     href={tile.href}
                     className={`group relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                        featured ? 'col-span-2 row-span-1 sm:col-span-2' : ''
                     }`}
                  >
                     <div
                        className={`relative ${featured ? 'aspect-[21/9] sm:aspect-[2.4/1]' : 'aspect-[4/3]'}`}
                     >
                        <img
                           src={tile.image}
                           alt={tile.title}
                           loading="lazy"
                           className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:p-3.5">
                           <span className="text-sm font-semibold text-white sm:text-[15px]">
                              {tile.title}
                           </span>
                           <span className="hidden rounded-lg bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm sm:inline">
                              Shop
                           </span>
                        </div>
                     </div>
                  </Link>
               )
            })}
         </div>
      </section>
   )
}

/** Honest trust strip — no inflated vanity metrics */
export function TrustStripSection() {
   const points = [
      { title: 'No inventory', body: 'Order what you need — no stock to hold.' },
      { title: 'Logo-ready', body: 'Upload once, preview on every product.' },
      { title: 'Food + neon', body: 'Packaging and storefront signs in one place.' },
      { title: 'Fast checkout', body: 'Customize, approve, and order in minutes.' },
   ]

   return (
      <section className="rounded-2xl border border-border/70 bg-gradient-to-br from-slate-50 via-white to-rose-50/60 px-5 py-8 dark:border-neutral-800 dark:from-neutral-950 dark:via-neutral-950 dark:to-red-950/20 sm:px-8">
         <div className="mx-auto max-w-6xl">
            <div className="mb-6 max-w-xl">
               <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FF5A52]">
                  Why Printfy
               </p>
               <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  Built for brands that ship every day
               </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
               {points.map((p) => (
                  <div
                     key={p.title}
                     className="rounded-xl border border-border/60 bg-white/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/60"
                  >
                     <p className="text-sm font-semibold tracking-tight">{p.title}</p>
                     <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {p.body}
                     </p>
                  </div>
               ))}
            </div>
         </div>
      </section>
   )
}
