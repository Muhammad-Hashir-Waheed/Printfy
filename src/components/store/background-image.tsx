import { cn } from '@/lib/utils'
import Image from 'next/image'

type Props = {
   /** Any image under `public/` (catalog images get resized WebP copies via the image loader) */
   src: string
   /** Above the fold: give the image priority so it isn't lazy-loaded */
   eager?: boolean
   /** Extra classes for the image itself, e.g. an `object-[…]` position */
   imageClassName?: string
   className?: string
}

/** Full-bleed still background for a section (place it first inside a `relative` section). */
export function BackgroundImage({ src, eager, imageClassName, className }: Props) {
   return (
      <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
         <Image src={src} alt="" fill priority={eager} sizes="100vw" className={cn('object-cover', imageClassName)} />
      </div>
   )
}
