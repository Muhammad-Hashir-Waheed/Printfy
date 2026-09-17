'use client'

import { CATALOG_IMAGES } from '@/lib/catalog-images'
import Link from 'next/link'

type Piece = {
   src: string
   alt: string
   label: string
   href: string
   frame: string
   imgClass?: string
}

const PIECES: Piece[] = [
   {
      src: CATALOG_IMAGES.productCarton,
      alt: 'Cosmetic packaging carton',
      label: 'Cosmetics',
      href: '/products?productType=cosmetics',
      frame:
         'left-[4%] top-[8%] z-20 h-[48%] w-[46%] -rotate-2 sm:left-[2%] sm:top-[6%] sm:h-[52%] sm:w-[44%]',
   },
   {
      src: CATALOG_IMAGES.rigidBox,
      alt: 'Perfume and makeup luxury box',
      label: 'Perfume boxes',
      href: '/products?productType=perfume+%26+makeup+boxes',
      frame:
         'right-[2%] top-[2%] z-30 h-[28%] w-[42%] rotate-3 sm:right-[0%] sm:top-[0%] sm:h-[32%] sm:w-[40%]',
   },
   {
      src: CATALOG_IMAGES.giftBox,
      alt: 'Rigid luxury gift box',
      label: 'Rigid boxes',
      href: '/products?productType=rigid+luxury+boxes',
      frame:
         'right-[6%] top-[30%] z-20 h-[34%] w-[36%] rotate-2 sm:right-[4%] sm:top-[28%] sm:h-[36%] sm:w-[34%]',
   },
   {
      src: CATALOG_IMAGES.customPackagingHero,
      alt: 'Hotel and food packaging',
      label: 'Hotel & food',
      href: '/products?productType=hotel+%26+food',
      frame:
         'left-[2%] bottom-[4%] z-30 h-[30%] w-[40%] rotate-[-3deg] sm:left-[0%] sm:bottom-[2%] sm:h-[32%] sm:w-[38%]',
   },
   {
      src: CATALOG_IMAGES.shippingBoxes,
      alt: 'Corrugated shipping boxes',
      label: 'Corrugated',
      href: '/products?productType=corrugated+boxes',
      frame:
         'left-[42%] top-[42%] z-40 h-[26%] w-[22%] rotate-[-6deg] sm:left-[40%] sm:top-[40%] sm:h-[28%] sm:w-[20%]',
   },
   {
      src: CATALOG_IMAGES.neonSign,
      alt: '3D branding neon board',
      label: '3D boards',
      href: '/products?productType=branding+%26+3d+boards',
      frame:
         'right-[2%] bottom-[2%] z-20 h-[28%] w-[34%] rotate-[-2deg] sm:right-[0%] sm:bottom-[0%] sm:h-[30%] sm:w-[32%]',
   },
]

export function HeroCollage({ className }: { className?: string }) {
   return (
      <div className={className}>
         <div className="relative mx-auto aspect-[5/4] w-full max-w-xl lg:max-w-none">
            <div className="pointer-events-none absolute inset-[12%] rounded-full bg-[#FF5A52]/10 blur-3xl dark:bg-[#7C5CFC]/20" />

            {PIECES.map((piece) => (
               <Link
                  key={piece.label + piece.frame}
                  href={piece.href}
                  className={`group absolute overflow-hidden rounded-2xl bg-card shadow-[0_18px_50px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/10 transition duration-300 hover:z-50 hover:scale-[1.03] hover:shadow-[0_28px_60px_-12px_rgba(0,0,0,0.55)] dark:ring-white/15 ${piece.frame}`}
               >
                  <img
                     src={piece.src}
                     alt={piece.alt}
                     className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${piece.imgClass ?? ''}`}
                     loading="eager"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent px-2.5 pb-2 pt-10">
                     <span className="text-xs font-semibold tracking-wide text-white">
                        {piece.label}
                     </span>
                  </div>
               </Link>
            ))}
         </div>
      </div>
   )
}
