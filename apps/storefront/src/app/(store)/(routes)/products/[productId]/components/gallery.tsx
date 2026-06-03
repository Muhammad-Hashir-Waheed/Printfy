'use client'

import { ProductImage } from '@/components/native/ProductImage'
import { resolveProductImages } from '@/lib/catalog-images'
import { cn } from '@/lib/utils'
import { useMemo, useState } from 'react'

export function ProductGallery({
   productId,
   images,
}: {
   productId: string
   images: string[]
}) {
   const [active, setActive] = useState(0)
   const safeImages = useMemo(
      () => resolveProductImages(productId, images),
      [productId, images]
   )

   return (
      <div className="space-y-3">
         <div className="relative h-[460px] w-full overflow-hidden rounded-2xl bg-white">
            <ProductImage
               productId={productId}
               src={safeImages[active]}
               alt="Product image"
               className="object-contain"
               sizes="(min-width: 1024px) 50vw, 100vw"
               priority
            />
         </div>
         <div className="grid grid-cols-5 gap-2">
            {safeImages.slice(0, 5).map((image, index) => (
               <button
                  type="button"
                  key={`${image}-${index}`}
                  onClick={() => setActive(index)}
                  className={cn(
                     'relative h-16 overflow-hidden rounded-xl border transition duration-200',
                     active === index ? 'border-primary shadow-sm' : 'hover:border-primary/50'
                  )}
               >
                  <ProductImage
                     productId={productId}
                     src={image}
                     alt="Thumbnail"
                     sizes="80px"
                  />
               </button>
            ))}
         </div>
      </div>
   )
}
