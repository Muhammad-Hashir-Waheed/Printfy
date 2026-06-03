'use client'

import { DEFAULT_PRODUCT_IMAGE } from '@/lib/catalog-images'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useState } from 'react'

type ProductImageProps = {
   src?: string | null
   alt: string
   fill?: boolean
   className?: string
   sizes?: string
   priority?: boolean
}

export function ProductImage({
   src,
   alt,
   fill = true,
   className,
   sizes = '(min-width: 768px) 25vw, 50vw',
   priority,
}: ProductImageProps) {
   const initial = src?.trim() ? src : DEFAULT_PRODUCT_IMAGE
   const [imageSrc, setImageSrc] = useState(initial)

   return (
      <Image
         src={imageSrc}
         alt={alt}
         fill={fill}
         sizes={sizes}
         priority={priority}
         className={cn('object-cover', className)}
         onError={() => {
            if (imageSrc !== DEFAULT_PRODUCT_IMAGE) {
               setImageSrc(DEFAULT_PRODUCT_IMAGE)
            }
         }}
      />
   )
}
