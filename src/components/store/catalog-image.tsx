'use client'

import type { CatalogImage as CatalogImageData } from '@/catalog'
import { cn } from '@/lib/utils'
import Image, { type ImageLoaderProps } from 'next/image'
import { useState } from 'react'

/** Pexels resizes and compresses on its own CDN, so we skip Next's optimizer. */
function pexelsLoader({ src, width, quality }: ImageLoaderProps) {
   return `${src}?auto=compress&cs=tinysrgb&w=${width}&q=${quality ?? 72}`
}

function initials(label: string) {
   return label
      .replace(/&/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
}

/** Branded artwork shown while a real photo is not available. */
export function PlaceholderArt({
   label,
   accent = '#D42F25',
   dark,
   compact,
   className,
}: {
   label: string
   accent?: string
   dark?: boolean
   /** Thumbnail sizes: show a centred monogram only */
   compact?: boolean
   className?: string
}) {
   if (compact) {
      return (
         <div
            aria-hidden
            className={cn('absolute inset-0 grid place-items-center font-display text-sm font-extrabold', className)}
            style={{
               background: dark ? '#1a1220' : `linear-gradient(135deg, ${accent}22, ${accent}44)`,
               color: dark ? '#fff' : accent,
               textShadow: dark ? `0 0 10px ${accent}` : undefined,
            }}
         >
            {initials(label)}
         </div>
      )
   }

   return (
      <div
         aria-hidden
         className={cn('absolute inset-0 overflow-hidden', className)}
         style={{
            background: dark
               ? `radial-gradient(120% 90% at 20% 10%, ${accent}55, transparent 60%), #120d16`
               : `radial-gradient(120% 90% at 15% 0%, ${accent}2e, transparent 55%), linear-gradient(135deg, #fbf6ef, #f1e8dc)`,
         }}
      >
         <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
               backgroundImage: `repeating-linear-gradient(135deg, ${accent} 0 1px, transparent 1px 14px)`,
            }}
         />
         <span
            className="absolute -bottom-[0.18em] -right-[0.04em] font-display text-[9rem] font-extrabold leading-none tracking-tighter"
            style={{
               color: dark ? 'transparent' : `${accent}26`,
               WebkitTextStroke: dark ? `2px ${accent}` : undefined,
               textShadow: dark ? `0 0 24px ${accent}` : undefined,
            }}
         >
            {initials(label)}
         </span>
         <span
            className={cn(
               'absolute left-4 top-4 max-w-[70%] font-display text-sm font-semibold leading-tight',
               dark ? 'text-white/85' : 'text-ink/70'
            )}
         >
            {label}
         </span>
      </div>
   )
}

export function CatalogImage({
   image,
   label,
   accent,
   dark,
   sizes = '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw',
   priority,
   className,
}: {
   image: CatalogImageData | null
   label: string
   accent?: string
   dark?: boolean
   sizes?: string
   priority?: boolean
   className?: string
}) {
   const [failed, setFailed] = useState(false)

   if (!image || failed) {
      const px = /^(\d+)px$/.exec(sizes.trim())
      const compact = px ? Number(px[1]) <= 160 : false
      return <PlaceholderArt label={label} accent={accent} dark={dark} compact={compact} />
   }

   const remote = image.src.startsWith('https://images.pexels.com')

   return (
      <Image
         src={image.src}
         alt={image.alt || label}
         fill
         sizes={sizes}
         priority={priority}
         loader={remote ? pexelsLoader : undefined}
         onError={() => setFailed(true)}
         className={cn('object-cover', className)}
         style={{ backgroundColor: image.color ?? '#efe7dc' }}
      />
   )
}
