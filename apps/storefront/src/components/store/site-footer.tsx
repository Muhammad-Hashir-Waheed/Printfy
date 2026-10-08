'use client'

import { DEPARTMENTS, type Department } from '@/catalog'
import config from '@/config/site'
import { cn } from '@/lib/utils'
import { ArrowUp, ArrowUpRight, Mail, Sparkle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { BrandLogo } from './brand-logo'
import { CatalogImage } from './catalog-image'
import { Magnetic, Marquee, RotatingWords, Spotlight, SpotlightGlow, WaveText } from './motion'

const HELP = [
   { href: '/quote', label: 'Request a quote' },
   { href: '/contact', label: 'Contact us' },
   { href: '/faq', label: 'FAQ & artwork guide' },
   { href: '/cart', label: config.showPrices ? 'Your cart' : 'Your quote list' },
]

const COMPANY = [
   { href: '/about', label: 'About Joji Arts' },
   { href: '/blog', label: 'Ideas & guides' },
   { href: '/credits', label: 'Photo credits' },
   { href: '/privacy', label: 'Privacy policy' },
   { href: '/terms', label: 'Terms of service' },
]

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
   return (
      <Link href={href} className="group inline-flex items-center gap-1.5 text-white/70 transition-colors hover:text-white">
         <span className="link-draw">{children}</span>
         <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
      </Link>
   )
}

/** Department links that show a photo preview trailing the cursor. */
function DepartmentLinks() {
   const [hovered, setHovered] = useState<Department | null>(null)
   const preview = useRef<HTMLDivElement>(null)
   const target = useRef({ x: 0, y: 0 })
   const pos = useRef({ x: 0, y: 0 })

   useEffect(() => {
      if (!hovered) return
      let raf = 0
      const loop = () => {
         pos.current.x += (target.current.x - pos.current.x) * 0.18
         pos.current.y += (target.current.y - pos.current.y) * 0.18
         if (preview.current) {
            preview.current.style.transform = `translate3d(${pos.current.x + 24}px, ${pos.current.y - 90}px, 0) rotate(${(target.current.x - pos.current.x) * 0.05}deg)`
         }
         raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
      return () => cancelAnimationFrame(raf)
   }, [hovered])

   return (
      <div
         onMouseMove={(e) => {
            target.current = { x: e.clientX, y: e.clientY }
            if (!hovered) pos.current = { x: e.clientX, y: e.clientY }
         }}
         onMouseLeave={() => setHovered(null)}
      >
         <ul className="grid grid-cols-1 gap-x-8 gap-y-1 min-[420px]:grid-cols-2">
            {DEPARTMENTS.map((d) => (
               <li key={d.slug}>
                  <Link
                     href={d.href}
                     onMouseEnter={() => setHovered(d)}
                     className="group flex items-center gap-3 py-1.5 text-[15px] text-white/70 transition-all duration-300 hover:translate-x-1.5 hover:text-white"
                  >
                     <span
                        className="h-1.5 w-1.5 rounded-full transition-all duration-300 group-hover:h-2.5 group-hover:w-2.5"
                        style={{ backgroundColor: d.accent, boxShadow: `0 0 12px ${d.accent}` }}
                     />
                     {d.name}
                  </Link>
               </li>
            ))}
         </ul>

         <div
            ref={preview}
            aria-hidden
            className={cn(
               'pointer-events-none fixed left-0 top-0 z-50 hidden h-44 w-64 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/20 transition-opacity duration-300 lg:block',
               hovered ? 'opacity-100' : 'opacity-0'
            )}
         >
            {DEPARTMENTS.map((d) => (
               <span key={d.slug} className={cn('absolute inset-0 transition-opacity duration-300', hovered?.slug === d.slug ? 'opacity-100' : 'opacity-0')}>
                  <CatalogImage image={d.image} label={d.name} accent={d.accent} dark={d.dark} sizes="256px" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute bottom-3 left-3 right-3 text-sm font-semibold text-white">{d.tagline}</span>
               </span>
            ))}
         </div>
      </div>
   )
}

function BackToTop() {
   const [progress, setProgress] = useState(0)
   useEffect(() => {
      const onScroll = () => {
         const max = document.documentElement.scrollHeight - window.innerHeight
         setProgress(max > 0 ? window.scrollY / max : 0)
      }
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
   }, [])

   const r = 22
   const c = 2 * Math.PI * r

   return (
      <button
         type="button"
         onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
         className={cn(
            'group fixed bottom-24 right-4 z-30 grid h-14 w-14 place-items-center rounded-full bg-white text-ink shadow-[0_15px_40px_-15px_rgba(30,20,10,.5)] transition-all duration-500 hover:-translate-y-1 lg:bottom-6 lg:right-6',
            progress > 0.15 ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
         )}
         aria-label="Back to top"
      >
         <svg viewBox="0 0 52 52" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
            <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(0,0,0,.08)" strokeWidth="3" />
            <circle cx="26" cy="26" r={r} fill="none" stroke="#D42F25" strokeWidth="3" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - progress)} />
         </svg>
         <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
      </button>
   )
}

export function SiteFooter() {
   return (
      <footer className="mt-24 overflow-hidden bg-ink text-white">
         {/* Department marquee */}
         <div className="border-b border-white/10 py-6">
            <Marquee speed={55}>
               {DEPARTMENTS.map((d) => (
                  <Link
                     key={d.slug}
                     href={d.href}
                     className="group flex items-center gap-8 px-4 font-display text-4xl font-extrabold tracking-tight text-transparent transition-colors duration-300 sm:text-6xl"
                     style={{ WebkitTextStroke: '1px rgba(255,255,255,.35)' }}
                  >
                     <span className="transition-all duration-300 group-hover:text-white" style={{ textShadow: 'none' }}>
                        {d.name}
                     </span>
                     <Sparkle className="h-6 w-6 shrink-0 transition-transform duration-700 group-hover:rotate-180" style={{ color: d.accent, fill: d.accent }} />
                  </Link>
               ))}
            </Marquee>
         </div>

         <Spotlight className="page-shell">
            <SpotlightGlow color="rgba(255,90,82,.14)" size={520} />
            <div className="relative z-10">
               {/* Big CTA */}
               <div className="grid gap-8 border-b border-white/10 py-14 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:py-20">
                  <h2 className="font-display text-4xl font-extrabold leading-[0.95] tracking-[-0.04em] sm:text-6xl">
                     Let&apos;s make your brand
                     <br />
                     <RotatingWords
                        words={['unforgettable.', 'glow.', 'stand out.', 'irresistible.']}
                        className="text-coral"
                     />
                  </h2>
                  <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                     <Magnetic>
                        <Link
                           href="/quote"
                           className="btn-shine group inline-flex h-14 items-center gap-2 rounded-full bg-primary px-8 text-base font-semibold text-white transition hover:bg-primary/90"
                        >
                           Start a project
                           <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </Link>
                     </Magnetic>
                     <Magnetic>
                        <a
                           href={`mailto:${config.email}`}
                           className="inline-flex h-14 items-center gap-2 rounded-full border border-white/20 px-7 text-base font-semibold transition hover:border-white hover:bg-white hover:text-ink"
                        >
                           <Mail className="h-5 w-5" /> Email us
                        </a>
                     </Magnetic>
                  </div>
               </div>

               {/* Links */}
               <div className="grid gap-10 py-14 lg:grid-cols-[1fr_2fr]">
                  <div className="max-w-sm">
                     <Link href="/" className="inline-block [&_svg]:h-11 [&_svg]:w-11 [&>span>span]:text-[1.7rem]">
                        <BrandLogo inverted />
                     </Link>
                     <p className="mt-5 text-[15px] leading-relaxed text-white/60">
                        Packaging, print and signage for brands that care how they show up. Designed, produced and
                        delivered by one team.
                     </p>
                     <a href={`mailto:${config.email}`} className="link-draw mt-5 inline-block text-[15px] font-medium text-white/85">
                        {config.email}
                     </a>
                     {config.phone ? <p className="mt-2 text-sm text-white/60">{config.phone}</p> : null}
                  </div>

                  <div className="grid gap-10 sm:grid-cols-[2fr_1fr_1fr]">
                     <div>
                        <p className="eyebrow mb-4 text-white/40">Shop</p>
                        <DepartmentLinks />
                     </div>
                     <div>
                        <p className="eyebrow mb-4 text-white/40">Help</p>
                        <ul className="space-y-2.5 text-[15px]">
                           {HELP.map((l) => (
                              <li key={l.href}>
                                 <FooterLink href={l.href}>{l.label}</FooterLink>
                              </li>
                           ))}
                        </ul>
                     </div>
                     <div>
                        <p className="eyebrow mb-4 text-white/40">Company</p>
                        <ul className="space-y-2.5 text-[15px]">
                           {COMPANY.map((l) => (
                              <li key={l.href}>
                                 <FooterLink href={l.href}>{l.label}</FooterLink>
                              </li>
                           ))}
                        </ul>
                     </div>
                  </div>
               </div>

               {/* Giant wordmark */}
               <Link href="/quote" aria-label="Start a project" className="block select-none pb-4">
                  <WaveText
                     text="Joji Arts"
                     className="font-display text-[23vw] font-extrabold leading-[0.8] tracking-[-0.06em] lg:text-[17rem]"
                     letterClassName="text-white/[0.08] group-hover/wave:text-coral"
                  />
               </Link>

               <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
                  <p>
                     © {new Date().getFullYear()} {config.name}. All rights reserved.
                  </p>
                  <p>Crafted with care · Photos via Pixabay</p>
               </div>
            </div>
         </Spotlight>

         <BackToTop />
      </footer>
   )
}
