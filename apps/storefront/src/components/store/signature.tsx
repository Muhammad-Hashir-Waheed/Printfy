'use client'

import { cn } from '@/lib/utils'
import { ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, type PointerEvent } from 'react'

export type SignatureKind = 'rigid' | 'mailer' | 'cards'

export type SignaturePanelData = {
   kind: SignatureKind
   index: number
   href: string
   name: string
   promise: string
   styles: string[]
   count: number
   background: string
}

/* ------------------------------------------------------------------ */
/* Illustrations — drawn by hand so the hero products always look      */
/* their best. Moving parts are animated from globals.css (.sig-*).    */
/* ------------------------------------------------------------------ */

function GoldDefs({ id }: { id: string }) {
   return (
      <defs>
         <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F7E3A1" />
            <stop offset="0.45" stopColor="#D9AE4F" />
            <stop offset="0.7" stopColor="#F3D88C" />
            <stop offset="1" stopColor="#A8792A" />
         </linearGradient>
         <radialGradient id={`${id}-glow`}>
            <stop offset="0" stopColor="#FFE9A8" stopOpacity="0.95" />
            <stop offset="1" stopColor="#FFE9A8" stopOpacity="0" />
         </radialGradient>
      </defs>
   )
}

function Sparkles({ id, points }: { id: string; points: Array<[number, number, number]> }) {
   return (
      <>
         {points.map(([x, y, s], i) => (
            <path
               key={i}
               className="sig-spark"
               style={{ transitionDelay: `${180 + i * 70}ms` }}
               d={`M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z`}
               fill={`url(#${id}-gold)`}
            />
         ))}
      </>
   )
}

function RigidArt() {
   const id = 'sig-rigid'
   return (
      <svg viewBox="0 0 260 220" className="h-full w-full overflow-visible" aria-hidden>
         <GoldDefs id={id} />
         <ellipse cx="135" cy="188" rx="98" ry="9" fill="#000" opacity="0.35" />
         {/* glow escaping the open box */}
         <ellipse className="sig-glow" cx="135" cy="96" rx="96" ry="34" fill={`url(#${id}-glow)`} />
         {/* base */}
         <polygon points="50,110 80,92 220,92 190,110" fill="#04110d" />
         <polygon points="58,108 84,94 214,94 188,108" fill="#0a2a22" />
         <rect x="50" y="110" width="140" height="70" fill="#14463a" />
         <rect x="50" y="110" width="140" height="70" fill="url(#sig-rigid-gold)" opacity="0.06" />
         <polygon points="190,110 220,92 220,162 190,180" fill="#0b2a22" />
         <rect x="112" y="110" width="16" height="70" fill={`url(#${id}-gold)`} />
         <polygon points="190,140 220,122 220,131 190,149" fill={`url(#${id}-gold)`} opacity="0.85" />
         <text x="158" y="158" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="700" fontSize="22" fill={`url(#${id}-gold)`}>
            JA
         </text>
         {/* lid */}
         <g className="sig-lid">
            <polygon points="44,104 76,84 226,84 194,104" fill="#1b5a4a" />
            <rect x="44" y="104" width="150" height="20" fill="#174d40" />
            <polygon points="194,104 226,84 226,104 194,124" fill="#0f3a30" />
            <polygon points="112,104 144,84 160,84 128,104" fill={`url(#${id}-gold)`} />
            <polygon points="55,97 205,97 215,91 65,91" fill={`url(#${id}-gold)`} />
            <rect x="112" y="104" width="16" height="20" fill={`url(#${id}-gold)`} />
            <polygon points="194,111 226,91 226,97 194,117" fill={`url(#${id}-gold)`} opacity="0.85" />
            <g stroke="#8a6220" strokeWidth="0.8">
               <ellipse cx="124" cy="83" rx="15" ry="8" transform="rotate(-22 124 83)" fill={`url(#${id}-gold)`} />
               <ellipse cx="150" cy="83" rx="15" ry="8" transform="rotate(22 150 83)" fill={`url(#${id}-gold)`} />
               <path d="M133 92 L122 108 M141 92 L150 108" strokeWidth="4" stroke={`url(#${id}-gold)`} strokeLinecap="round" />
               <circle cx="137" cy="90" r="6" fill={`url(#${id}-gold)`} />
            </g>
         </g>
         <Sparkles id={id} points={[[72, 52, 7], [196, 44, 9], [138, 30, 6], [226, 70, 5], [44, 78, 5]]} />
      </svg>
   )
}

function MailerArt() {
   const id = 'sig-mailer'
   return (
      <svg viewBox="0 0 260 220" className="h-full w-full overflow-visible" aria-hidden>
         <GoldDefs id={id} />
         <defs>
            <pattern id={`${id}-print`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
               <rect width="14" height="14" fill="#1E1A17" />
               <circle cx="7" cy="7" r="2.2" fill="#FFD84D" />
            </pattern>
         </defs>
         <ellipse cx="135" cy="188" rx="98" ry="9" fill="#000" opacity="0.3" />
         {/* opened flap — printed inside */}
         <g className="sig-flap-open">
            <polygon points="75,94 225,94 214,30 64,30" fill={`url(#${id}-print)`} />
            <polygon points="75,94 225,94 214,30 64,30" fill="none" stroke="#C9965F" strokeWidth="3" />
            <text x="145" y="68" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="15" fill="#fff">
               hello, gorgeous
            </text>
         </g>
         {/* interior */}
         <polygon points="45,112 75,94 225,94 195,112" fill={`url(#${id}-print)`} />
         {/* tissue + thank-you card rise out */}
         <path className="sig-tissue" d="M60 110 Q80 88 100 102 Q120 84 140 100 Q160 86 180 100 Q196 90 206 104 L195 112 L45 112 Z" fill="#fff" opacity="0.92" />
         <g className="sig-note">
            <rect x="104" y="84" width="58" height="36" rx="2" fill="#FFF8EC" transform="rotate(-8 133 102)" />
            <text x="133" y="106" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="11" fill="#D42F25" transform="rotate(-8 133 102)">
               thank you ♥
            </text>
         </g>
         {/* box body */}
         <rect x="45" y="112" width="150" height="66" fill="#C9965F" />
         <rect x="45" y="112" width="150" height="5" fill="#B5814B" />
         <polygon points="195,112 225,94 225,160 195,178" fill="#A97845" />
         <circle cx="120" cy="146" r="17" fill="none" stroke="#3a2614" strokeWidth="2" opacity="0.8" />
         <text x="120" y="152" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="700" fontSize="16" fill="#3a2614" opacity="0.85">
            JA
         </text>
         <path d="M58 168 h30 M160 168 h24" stroke="#3a2614" strokeWidth="2" opacity="0.35" strokeLinecap="round" />
         {/* closed lid */}
         <g className="sig-flap-closed">
            <polygon points="45,112 75,94 225,94 195,112" fill="#DDAF77" />
            <polygon points="45,112 195,112 195,117 45,117" fill="#C08A52" />
            <polygon points="111,112 141,94 155,94 125,112" fill="#D42F25" opacity="0.9" />
         </g>
         <Sparkles id={id} points={[[48, 70, 6], [234, 64, 8], [24, 120, 5], [244, 120, 5]]} />
      </svg>
   )
}

function CardsArt() {
   const id = 'sig-cards'
   const card = 'M0 0h140v84H0z'
   return (
      <svg viewBox="0 0 260 220" className="h-full w-full overflow-visible" aria-hidden>
         <GoldDefs id={id} />
         <defs>
            <linearGradient id={`${id}-holo`} x1="0" y1="0" x2="1" y2="1">
               <stop offset="0" stopColor="#ffb3e6" />
               <stop offset="0.35" stopColor="#b7c8ff" />
               <stop offset="0.65" stopColor="#a8fff0" />
               <stop offset="1" stopColor="#fff2a8" />
            </linearGradient>
            <clipPath id={`${id}-clip`}>
               <rect width="140" height="84" rx="6" />
            </clipPath>
         </defs>
         <ellipse cx="130" cy="190" rx="92" ry="8" fill="#000" opacity="0.35" />
         <g transform="translate(60 92)">
            {/* holographic */}
            <g className="sig-card sig-card-1">
               <rect width="140" height="84" rx="6" fill={`url(#${id}-holo)`} />
               <path d="M18 60h50" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            </g>
            {/* kraft */}
            <g className="sig-card sig-card-2">
               <rect width="140" height="84" rx="6" fill="#C9965F" />
               <circle cx="112" cy="26" r="11" fill="none" stroke="#3a2614" strokeWidth="1.6" />
               <path d="M18 56h56M18 66h38" stroke="#3a2614" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            </g>
            {/* black + gold */}
            <g className="sig-card sig-card-3">
               <rect width="140" height="84" rx="6" fill="#111" />
               <path d="M18 24h40" stroke={`url(#${id}-gold)`} strokeWidth="4" strokeLinecap="round" />
               <path d="M18 60h70M18 69h48" stroke={`url(#${id}-gold)`} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            </g>
            {/* ivory with foil monogram (top) */}
            <g className="sig-card sig-card-4">
               <g clipPath={`url(#${id}-clip)`}>
                  <path d={card} fill="#FBF6EC" />
                  <rect x="-60" y="-10" width="40" height="110" fill="#fff" opacity="0.85" className="sig-foil" transform="skewX(-20)" />
               </g>
               <rect width="140" height="84" rx="6" fill="none" stroke="#E7DCC6" />
               <text x="70" y="44" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="700" fontSize="26" fill={`url(#${id}-gold)`}>
                  JA
               </text>
               <path d="M48 54h44" stroke={`url(#${id}-gold)`} strokeWidth="1.4" />
               <text x="70" y="68" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="6.5" letterSpacing="2" fill="#6b5b45">
                  JOJI ARTS STUDIO
               </text>
            </g>
         </g>
         <Sparkles id={id} points={[[40, 64, 7], [222, 52, 9], [130, 30, 6], [236, 150, 5]]} />
      </svg>
   )
}

const ART: Record<SignatureKind, () => JSX.Element> = { rigid: RigidArt, mailer: MailerArt, cards: CardsArt }

/* ------------------------------------------------------------------ */

/** Stand-alone illustration for flagship category pages — performs once on load, then on hover. */
export function SignatureShowcase({ kind, background, className }: { kind: SignatureKind; background: string; className?: string }) {
   const ref = useRef<HTMLDivElement>(null)
   const Art = ART[kind]

   useEffect(() => {
      const node = ref.current
      if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const open = setTimeout(() => node.setAttribute('data-active', ''), 700)
      const close = setTimeout(() => node.removeAttribute('data-active'), 3400)
      return () => {
         clearTimeout(open)
         clearTimeout(close)
      }
   }, [])

   return (
      <div ref={ref} className={cn('sig-panel relative grid place-items-center overflow-hidden rounded-[1.75rem] p-8', className)} style={{ background }}>
         <span aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:14px_14px]" />
         <div className="sig-art relative aspect-[260/220] w-full max-w-[360px]">
            <Art />
         </div>
      </div>
   )
}

export function SignaturePanel({ panel, className }: { panel: SignaturePanelData; className?: string }) {
   const ref = useRef<HTMLAnchorElement>(null)
   const Art = ART[panel.kind]

   // Touch screens have no hover — play the animation when the panel is centred in view.
   useEffect(() => {
      const node = ref.current
      if (!node || !window.matchMedia('(hover: none)').matches || !('IntersectionObserver' in window)) return
      const io = new IntersectionObserver(([e]) => node.toggleAttribute('data-active', e.intersectionRatio > 0.6), {
         threshold: [0, 0.6, 1],
      })
      io.observe(node)
      return () => io.disconnect()
   }, [])

   function onMove(e: PointerEvent<HTMLAnchorElement>) {
      if (e.pointerType !== 'mouse') return
      const node = ref.current!
      const r = node.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      node.style.setProperty('--ry', `${(x - 0.5) * 9}deg`)
      node.style.setProperty('--rx', `${(0.5 - y) * 7}deg`)
      node.style.setProperty('--mx', `${x * 100}%`)
      node.style.setProperty('--my', `${y * 100}%`)
   }

   function onLeave() {
      const node = ref.current!
      node.style.setProperty('--ry', '0deg')
      node.style.setProperty('--rx', '0deg')
   }

   return (
      <Link
         ref={ref}
         href={panel.href}
         onPointerMove={onMove}
         onPointerLeave={onLeave}
         className={cn('sig-panel group relative flex h-full flex-col overflow-hidden rounded-[2rem] p-6 text-white ring-1 ring-white/10 sm:p-7', className)}
         style={{ background: panel.background }}
      >
         <span aria-hidden className="sig-sheen pointer-events-none absolute inset-0" />
         <span aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:14px_14px]" />

         <div className="relative flex items-center justify-between">
            <span className="font-display text-sm font-bold tracking-[0.2em] text-white/55">0{panel.index}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#F3D88C] ring-1 ring-[#F3D88C]/30 backdrop-blur">
               <Star className="h-3 w-3 fill-current" /> Bestseller
            </span>
         </div>

         <div className="sig-art relative mx-auto my-4 aspect-[260/220] w-full max-w-[340px] sm:my-6">
            <Art />
         </div>

         <div className="relative mt-auto">
            <h3 className="font-display text-[2rem] font-extrabold leading-none tracking-[-0.03em] sm:text-[2.4rem]">{panel.name}</h3>
            <p className="mt-2 bg-[linear-gradient(100deg,#F7E3A1,#D9AE4F_45%,#FFF1C4_60%,#C99A3E)] bg-clip-text font-display text-lg font-semibold italic text-transparent sm:text-xl">
               {panel.promise}
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
               {panel.styles.map((s) => (
                  <li key={s} className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/85 ring-1 ring-white/10">
                     {s}
                  </li>
               ))}
            </ul>
            <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-4">
               <span className="text-sm text-white/65">{panel.count} styles to choose from</span>
               <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink transition duration-300 group-hover:gap-3 group-hover:bg-[#F3D88C]">
                  Design yours <ArrowRight className="h-4 w-4" />
               </span>
            </div>
         </div>
      </Link>
   )
}
