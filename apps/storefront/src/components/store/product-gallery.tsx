'use client'

import type { CatalogImage as CatalogImageData } from '@/catalog'
import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

import { CatalogImage } from './catalog-image'
import { useProductFinish } from './product-finish'

const METAL_LABEL: Record<string, string> = {
   silver: 'Metalized silver',
   gold: 'Metalized gold',
   'rose-gold': 'Rose gold',
   holographic: 'Holographic',
}

export function ProductGallery({
   images,
   label,
   accent,
   dark,
   metalImages,
}: {
   images: Array<{ image: CatalogImageData | null; caption: string }>
   label: string
   accent: string
   dark?: boolean
   /** Finish → preview photo (box products) */
   metalImages?: Record<string, CatalogImageData | null>
}) {
   const [index, setIndex] = useState(0)
   const { metallic } = useProductFinish()
   const metalImage = metallic ? metalImages?.[metallic] ?? null : null
   const showMetal = Boolean(metalImage)
   const current = images[index] ?? images[0]

   // Jump back to the main photo whenever the finish changes
   useEffect(() => {
      if (metallic) setIndex(0)
   }, [metallic])

   return (
      <div className="lg:sticky lg:top-[150px]">
         <div className={cn('relative aspect-square overflow-hidden rounded-[2rem] sm:aspect-[5/4]', dark ? 'bg-[#140d18]' : 'bg-muted')}>
            <CatalogImage
               key={showMetal ? `metal-${metallic}` : index}
               image={showMetal ? metalImage : current?.image ?? null}
               label={label}
               accent={accent}
               dark={dark}
               priority
               sizes="(min-width: 1024px) 55vw, 100vw"
               className="animate-in fade-in-0 zoom-in-[1.02] duration-500"
            />
            {showMetal ? (
               <>
                  {/* light sweep to sell the metallic sheen */}
                  <span
                     key={`sheen-${metallic}`}
                     aria-hidden
                     className="pointer-events-none absolute inset-0 animate-[shine_1.4s_ease_forwards] bg-gradient-to-r from-transparent via-white/40 to-transparent"
                     style={{ width: '45%' }}
                  />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ink/85 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                     <Sparkles className="h-3.5 w-3.5 text-[#FFD84D]" /> {METAL_LABEL[metallic!]} finish
                  </span>
                  <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink backdrop-blur">
                     Finish preview · your design printed on {METAL_LABEL[metallic!].toLowerCase()} board
                  </span>
               </>
            ) : current?.caption ? (
               <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink backdrop-blur">
                  {current.caption}
               </span>
            ) : null}
         </div>
         {images.length > 1 ? (
            <div className="mt-3 grid grid-cols-4 gap-3">
               {images.map((img, i) => (
                  <button
                     key={i}
                     type="button"
                     onClick={() => setIndex(i)}
                     aria-label={`Show image ${i + 1}: ${img.caption}`}
                     aria-pressed={!showMetal && i === index}
                     className={cn(
                        'relative aspect-square overflow-hidden rounded-2xl ring-2 ring-offset-2 ring-offset-background transition',
                        !showMetal && i === index ? 'ring-ink' : 'ring-transparent opacity-75 hover:opacity-100'
                     )}
                  >
                     <CatalogImage image={img.image} label={img.caption} accent={accent} dark={dark} sizes="120px" />
                  </button>
               ))}
               {showMetal ? (
                  <span className="relative aspect-square overflow-hidden rounded-2xl ring-2 ring-[#C9A227] ring-offset-2 ring-offset-background">
                     <CatalogImage image={metalImage} label={METAL_LABEL[metallic!]} accent={accent} sizes="120px" />
                     <span className="absolute inset-x-0 bottom-0 bg-black/55 py-0.5 text-center text-[10px] font-bold text-white">METALIZED</span>
                  </span>
               ) : null}
            </div>
         ) : null}
      </div>
   )
}
