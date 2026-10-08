'use client'

import type { CatalogImage as CatalogImageData } from '@/catalog'
import { cn } from '@/lib/utils'
import { useState } from 'react'

import { CatalogImage } from './catalog-image'

export function ProductGallery({
   images,
   label,
   accent,
   dark,
}: {
   images: Array<{ image: CatalogImageData | null; caption: string }>
   label: string
   accent: string
   dark?: boolean
}) {
   const [index, setIndex] = useState(0)
   const current = images[index] ?? images[0]

   return (
      <div className="lg:sticky lg:top-[150px]">
         <div className={cn('relative aspect-square overflow-hidden rounded-[2rem] sm:aspect-[5/4]', dark ? 'bg-[#140d18]' : 'bg-muted')}>
            <CatalogImage
               key={index}
               image={current?.image ?? null}
               label={label}
               accent={accent}
               dark={dark}
               priority
               sizes="(min-width: 1024px) 55vw, 100vw"
               className="animate-in fade-in-0 duration-300"
            />
            {current?.caption ? (
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
                     aria-pressed={i === index}
                     className={cn(
                        'relative aspect-square overflow-hidden rounded-2xl ring-2 ring-offset-2 ring-offset-background transition',
                        i === index ? 'ring-ink' : 'ring-transparent opacity-75 hover:opacity-100'
                     )}
                  >
                     <CatalogImage image={img.image} label={img.caption} accent={accent} dark={dark} sizes="120px" />
                  </button>
               ))}
            </div>
         ) : null}
      </div>
   )
}
