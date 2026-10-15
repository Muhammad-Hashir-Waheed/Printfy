'use client'

import { Button } from '@/components/ui/button'
import {
   buildCatalogHref,
   HOMEPAGE_CATEGORY_TILES,
} from '@/lib/catalog-navigation'
import { CATALOG_IMAGES } from '@/lib/catalog-images'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

export function NeonSignsSection() {
   const tiles = [
      {
         title: '3D acrylic boards',
         href: '/products/3d-acrylic-board',
         image: CATALOG_IMAGES.ledSign,
      },
      {
         title: 'Custom neon',
         href: '/products/custom-neon-sign',
         image: CATALOG_IMAGES.neonSign,
      },
      {
         title: 'LED letters',
         href: '/products/led-channel-letter',
         image: CATALOG_IMAGES.neonBrandBrew,
      },
      {
         title: 'Light boxes',
         href: '/products/backlit-lightbox',
         image: CATALOG_IMAGES.neonShop,
      },
   ]

   return (
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-950 via-[#1a0b2e] to-[#0c1a2e] px-6 py-10 text-white lg:px-8">
         <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-[#FF5A52]/20 blur-[90px]" />
         <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-[#7C5CFC]/25 blur-[100px]" />

         <div className="relative grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-center">
            <div className="space-y-4">
               <p className="typo-eyebrow text-[#5EEAD4]">Branding &amp; 3D boards</p>
               <h2 className="typo-h2">Light up your storefront</h2>
               <p className="max-w-md typo-body text-white/70">
                  Dimensional logo boards, neon script, LED channel letters, and light
                  boxes that make a hotel, salon, or shop unforgettable.
               </p>
               <Link href={buildCatalogHref({ productType: 'Branding & 3D Boards' })}>
                  <Button className="mt-1 h-11 bg-[#FF5A52] px-5 font-semibold text-white hover:bg-[#ff6d66]">
                     Shop branding
                     <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
               </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
               {tiles.map((tile) => (
                  <Link
                     key={tile.title}
                     href={tile.href}
                     className="group relative overflow-hidden rounded-2xl ring-1 ring-white/10 transition hover:ring-[#5EEAD4]/40"
                  >
                     <div className="relative aspect-[4/3]">
                        <img
                           src={tile.image}
                           alt={tile.title}
                           loading="lazy"
                           className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <span className="absolute bottom-2.5 left-2.5 typo-body font-semibold text-white">
                           {tile.title}
                        </span>
                     </div>
                  </Link>
               ))}
            </div>
         </div>
      </section>
   )
}

export function ProductShowcaseSection({
   categories,
}: {
   categories?: Array<{ title: string; image?: string }>
}) {
   const tiles =
      categories?.length
         ? categories.map((category) => ({
              title: category.title,
              href: buildCatalogHref({ category: category.title }),
              image: category.image,
           }))
         : HOMEPAGE_CATEGORY_TILES

   return (
      <section className="space-y-5">
         <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
               <p className="typo-eyebrow text-[#FF5A52]">Explore all categories</p>
               <h2 className="typo-h2">Shop by line</h2>
               <p className="mt-1 typo-body text-muted-foreground">
                  Pick a category to see its products.
               </p>
            </div>
            <Link
               href="/products"
               className="inline-flex items-center gap-1 typo-body font-semibold text-[#FF5A52] hover:underline"
            >
               View all products
               <ArrowRightIcon className="h-4 w-4" />
            </Link>
         </div>

         <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {tiles.map((tile) => (
               <Link
                  key={tile.title}
                  href={tile.href}
                  className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
               >
                  <div className="relative aspect-[4/3] bg-muted">
                     {tile.image ? (
                        <img
                           src={tile.image}
                           alt={tile.title}
                           loading="lazy"
                           className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                     ) : null}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                     <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:p-4">
                        <span className="typo-card-title text-white">{tile.title}</span>
                        <span className="hidden rounded-xl bg-white/15 px-2 py-0.5 typo-eyebrow normal-case tracking-normal text-white backdrop-blur-sm sm:inline">
                           Shop
                        </span>
                     </div>
                  </div>
               </Link>
            ))}
         </div>
      </section>
   )
}

export function TrustStripSection() {
   const points = [
      { title: 'No inventory', body: 'Order what you need — no stock to hold.' },
      { title: 'Logo-ready', body: 'Upload once, preview on every product.' },
      { title: 'Six packaging lines', body: 'Cosmetics to 3D boards, in one catalog.' },
      { title: 'Fast checkout', body: 'Customize, approve, and order in minutes.' },
   ]

   return (
      <section className="rounded-2xl border border-border/70 bg-gradient-to-br from-slate-50 via-white to-rose-50/60 px-6 py-8 dark:border-neutral-800 dark:from-neutral-950 dark:via-neutral-950 dark:to-red-950/20 lg:px-8">
         <div className="mb-6 max-w-xl">
            <p className="typo-eyebrow text-[#FF5A52]">Why Joji Arts</p>
            <h2 className="mt-1 typo-h2">Built for brands that unbox every day</h2>
         </div>
         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {points.map((p) => (
               <div
                  key={p.title}
                  className="rounded-2xl border border-border/60 bg-white/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/60"
               >
                  <p className="typo-card-title">{p.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.body}</p>
               </div>
            ))}
         </div>
      </section>
   )
}
