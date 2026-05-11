'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useState } from 'react'

export function ProductGallery({ images }: { images: string[] }) {
   const [active, setActive] = useState(0)
   const safeImages = images?.length ? images : ['/placeholder.jpg']

   return (
      <div className="space-y-3">
         <div className="relative h-[460px] w-full overflow-hidden rounded-2xl bg-white">
            <Image
               src={safeImages[active]}
               alt="Product image"
               fill
               className="object-contain"
            />
         </div>
         <div className="grid grid-cols-5 gap-2">
            {safeImages.slice(0, 5).map((image, index) => (
               <button
                  type="button"
                  key={image + index}
                  onClick={() => setActive(index)}
                  className={cn(
                     'relative h-16 overflow-hidden rounded-xl border transition duration-200',
                     active === index ? 'border-primary shadow-sm' : 'hover:border-primary/50'
                  )}
               >
                  <Image src={image} alt="Thumbnail" fill className="object-cover" />
               </button>
            ))}
         </div>
      </div>
   )
}
