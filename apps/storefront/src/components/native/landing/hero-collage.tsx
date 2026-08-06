'use client'

import { CATALOG_IMAGES } from '@/lib/catalog-images'
import Link from 'next/link'

type Piece = {
   src: string
   alt: string
   label: string
   href: string
   /** Tailwind absolute placement + size + rotation */
   frame: string
   imgClass?: string
}

/**
 * Editorial masterclass collage — overlapping packaging + brand neon/LED logo signs.
 * Neon/LED = custom illuminated brand wordmarks (like boutique Nike/Adidas-style logo signs),
 * not abstract lights.
 */
const PIECES: Piece[] = [
   {
      src: CATALOG_IMAGES.customBoxLarge,
      alt: 'Custom printed pizza box',
      label: 'Pizza boxes',
      href: '/products?q=pizza',
      frame:
         'left-[4%] top-[8%] z-20 h-[48%] w-[46%] -rotate-2 sm:left-[2%] sm:top-[6%] sm:h-[52%] sm:w-[44%]',
   },
   {
      src: CATALOG_IMAGES.neonSign,
      alt: 'Custom neon brand logo sign',
      label: 'Brand neon',
      href: '/products?q=neon',
      frame:
         'right-[2%] top-[2%] z-30 h-[28%] w-[42%] rotate-3 sm:right-[0%] sm:top-[0%] sm:h-[32%] sm:w-[40%]',
   },
   {
      src: CATALOG_IMAGES.customBoxMedium,
      alt: 'Custom burger box packaging',
      label: 'Burger boxes',
      href: '/products?q=burger',
      frame:
         'right-[6%] top-[30%] z-20 h-[34%] w-[36%] rotate-2 sm:right-[4%] sm:top-[28%] sm:h-[36%] sm:w-[34%]',
   },
   {
      src: CATALOG_IMAGES.ledSign,
      alt: 'Custom LED brand channel letter logo sign',
      label: 'LED logos',
      href: '/products?q=led',
      frame:
         'left-[2%] bottom-[4%] z-30 h-[30%] w-[40%] rotate-[-3deg] sm:left-[0%] sm:bottom-[2%] sm:h-[32%] sm:w-[38%]',
   },
   {
      src: CATALOG_IMAGES.customBoxSmall,
      alt: 'Custom fries carton',
      label: 'Fries',
      href: '/products?q=fries',
      frame:
         'left-[42%] top-[42%] z-40 h-[26%] w-[22%] rotate-[-6deg] sm:left-[40%] sm:top-[40%] sm:h-[28%] sm:w-[20%]',
   },
   {
      src: CATALOG_IMAGES.neonShop,
      alt: 'Custom neon script brand logo sign',
      label: 'Script neon',
      href: '/products?q=neon',
      frame:
         'right-[28%] bottom-[8%] z-[25] h-[24%] w-[26%] rotate-6 sm:right-[30%] sm:bottom-[6%] sm:h-[26%] sm:w-[24%]',
   },
   {
      src: CATALOG_IMAGES.neonBrandBrew,
      alt: 'Custom neon brand logo with icon',
      label: 'Logo neon',
      href: '/products?q=neon',
      frame:
         'right-[2%] bottom-[2%] z-20 h-[28%] w-[34%] rotate-[-2deg] sm:right-[0%] sm:bottom-[0%] sm:h-[30%] sm:w-[32%]',
   },
   {
      src: CATALOG_IMAGES.customPaperBag,
      alt: 'Custom takeout bag',
      label: 'Bags',
      href: '/products?q=takeout',
      frame:
         'left-[36%] top-[4%] z-10 h-[22%] w-[20%] rotate-[-8deg] sm:left-[38%] sm:top-[2%] sm:h-[24%] sm:w-[18%]',
      imgClass: 'object-center',
   },
]

export function HeroCollage({ className }: { className?: string }) {
   return (
      <div className={className}>
         <div className="relative mx-auto aspect-[5/4] w-full max-w-xl lg:max-w-none">
            {/* soft stage glow behind collage */}
            <div className="pointer-events-none absolute inset-[12%] rounded-full bg-[#FF5A52]/10 blur-3xl dark:bg-[#7C5CFC]/20" />
            <div className="pointer-events-none absolute bottom-[10%] right-[10%] h-40 w-40 rounded-full bg-[#5EEAD4]/15 blur-3xl" />

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
                     <span className="text-[10px] font-semibold tracking-wide text-white sm:text-xs">
                        {piece.label}
                     </span>
                  </div>
               </Link>
            ))}
         </div>
      </div>
   )
}
