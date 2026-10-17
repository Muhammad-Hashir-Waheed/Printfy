'use client'

import type { CatalogImage as CatalogImageData } from '@/catalog'
import { cn } from '@/lib/utils'
import { ArrowUpRight, Star } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { CatalogImage } from './catalog-image'

export type SignatureCardData = {
   index: number
   href: string
   name: string
   promise: string
   styles: string[]
   count: number
   accent: string
   photos: Array<{ image: CatalogImageData | null; label: string }>
}

const STEP = 2200

/**
 * Compact bestseller card: a slow photo slideshow of the range with gold progress
 * bars. Plays while hovered on desktop, and on its own on touch screens while the
 * card is on screen.
 */
export function SignatureCard({ card, priority }: { card: SignatureCardData; priority?: boolean }) {
   const ref = useRef<HTMLAnchorElement>(null)
   const [active, setActive] = useState(0)
   const [playing, setPlaying] = useState(false)

   // Touch screens: play while at least half the card is visible
   useEffect(() => {
      const node = ref.current
      if (!node || !('IntersectionObserver' in window)) return
      if (!window.matchMedia('(hover: none), (pointer: coarse)').matches) return
      const io = new IntersectionObserver(([e]) => setPlaying(e.isIntersecting && e.intersectionRatio >= 0.5), {
         threshold: [0, 0.5],
      })
      io.observe(node)
      return () => io.disconnect()
   }, [])

   useEffect(() => {
      if (!playing || card.photos.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const t = setInterval(() => setActive((i) => (i + 1) % card.photos.length), STEP)
      return () => clearInterval(t)
   }, [playing, card.photos.length])

   return (
      <Link
         ref={ref}
         href={card.href}
         onMouseEnter={() => {
            setActive((i) => (i + 1) % card.photos.length)
            setPlaying(true)
         }}
         onMouseLeave={() => setPlaying(false)}
         data-playing={playing || undefined}
         className="sig-card group relative block aspect-[4/3] overflow-hidden rounded-3xl bg-[#1d1611] shadow-[0_24px_50px_-30px_rgba(0,0,0,.9)] ring-1 ring-white/10 transition duration-500 hover:-translate-y-1 hover:ring-[#D9AE4F]/50"
      >
         {card.photos.map((p, i) => (
            <div
               key={i}
               aria-hidden={i !== active}
               className={cn(
                  'absolute inset-0 transition-opacity duration-1000 ease-out',
                  i === active ? 'opacity-100' : 'opacity-0'
               )}
            >
               <CatalogImage
                  image={p.image}
                  label={p.label}
                  accent={card.accent}
                  priority={priority && i === 0}
                  sizes="(min-width: 1024px) 340px, 75vw"
                  className={cn('sig-kenburns', i === active && playing && 'is-on')}
               />
            </div>
         ))}

         {/* legibility + gold foil sweep */}
         <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
         <span aria-hidden className="sig-foil pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-[#FFE9A8]/25 to-transparent" />

         <div className="absolute inset-x-4 top-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-[linear-gradient(110deg,#F7E3A1,#D9AE4F_45%,#FFF1C4_60%,#C99A3E)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#3b2a0c] shadow">
               <Star className="h-3 w-3 fill-current" /> Bestseller
            </span>
            <span className="font-display text-xs font-bold tracking-[0.2em] text-white/70">0{card.index}</span>
         </div>

         <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
            {/* slideshow progress */}
            <div className="mb-3 flex gap-1.5">
               {card.photos.map((_, i) => (
                  <span key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25">
                     <span
                        className={cn('block h-full origin-left rounded-full bg-[#F3D88C]', i === active ? 'sig-progress' : i < active ? 'scale-x-100' : 'scale-x-0')}
                        style={i === active ? { animationDuration: `${STEP}ms`, animationPlayState: playing ? 'running' : 'paused' } : undefined}
                     />
                  </span>
               ))}
            </div>
            <div className="flex items-end justify-between gap-3">
               <div className="min-w-0">
                  <h3 className="font-display text-xl font-extrabold leading-tight tracking-tight sm:text-2xl">{card.name}</h3>
                  <p className="mt-0.5 bg-[linear-gradient(100deg,#F7E3A1,#D9AE4F_45%,#FFF1C4_60%,#C99A3E)] bg-clip-text text-sm font-semibold italic text-transparent">
                     {card.promise}
                  </p>
                  <p className="mt-1 truncate text-xs text-white/60">
                     {card.styles.join(' · ')} · {card.count} styles
                  </p>
               </div>
               <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-ink transition duration-300 group-hover:rotate-45 group-hover:bg-[#F3D88C]">
                  <ArrowUpRight className="h-4 w-4" />
               </span>
            </div>
         </div>
      </Link>
   )
}
