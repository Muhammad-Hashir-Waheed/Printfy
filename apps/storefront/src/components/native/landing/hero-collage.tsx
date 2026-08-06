'use client'

import { CATALOG_IMAGES } from '@/lib/catalog-images'
import Link from 'next/link'

const TILES = [
   {
      src: CATALOG_IMAGES.customBoxLarge,
      alt: 'Custom printed pizza box',
      className: 'col-span-2 row-span-2',
      label: 'Pizza boxes',
   },
   {
      src: CATALOG_IMAGES.neonSign,
      alt: 'Custom neon LED sign',
      className: 'col-span-1 row-span-1',
      label: 'Neon signs',
   },
   {
      src: CATALOG_IMAGES.customBoxMedium,
      alt: 'Custom burger box packaging',
      className: 'col-span-1 row-span-1',
      label: 'Burger boxes',
   },
   {
      src: CATALOG_IMAGES.ledSign,
      alt: 'LED channel letter sign',
      className: 'col-span-1 row-span-2',
      label: 'LED signs',
   },
   {
      src: CATALOG_IMAGES.customBoxSmall,
      alt: 'Custom fries carton',
      className: 'col-span-1 row-span-1',
      label: 'Fries cartons',
   },
   {
      src: CATALOG_IMAGES.customPaperBag,
      alt: 'Custom takeout paper bag',
      className: 'col-span-1 row-span-1',
      label: 'To-go bags',
   },
   {
      src: CATALOG_IMAGES.neonShop,
      alt: 'Neon shop open sign',
      className: 'col-span-2 row-span-1',
      label: 'Shop neon',
   },
   {
      src: CATALOG_IMAGES.mailer,
      alt: 'Custom mailer box',
      className: 'col-span-1 row-span-1',
      label: 'Mailers',
   },
   {
      src: CATALOG_IMAGES.sticker,
      alt: 'Custom stickers and labels',
      className: 'col-span-1 row-span-1',
      label: 'Stickers',
   },
] as const

/** Realistic packaging + neon/LED photo collage for the hero */
export function HeroCollage({ className }: { className?: string }) {
   return (
      <div className={className}>
         <div className="grid aspect-[5/4] grid-cols-4 grid-rows-4 gap-2 sm:gap-2.5 md:gap-3">
            {TILES.map((tile) => (
               <Link
                  key={tile.label}
                  href="/products"
                  className={`group relative min-h-0 overflow-hidden rounded-xl bg-muted shadow-md ring-1 ring-black/5 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:ring-white/10 ${tile.className}`}
               >
                  <img
                     src={tile.src}
                     alt={tile.alt}
                     className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                     loading="eager"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-2 pt-8 sm:p-2.5">
                     <span className="text-[10px] font-semibold text-white sm:text-xs">
                        {tile.label}
                     </span>
                  </div>
               </Link>
            ))}
         </div>
      </div>
   )
}
