'use client'

import { HeroCollage } from '@/components/native/landing/hero-collage'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroSection() {
   return (
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-slate-50 via-white to-rose-50 dark:border-neutral-800 dark:from-neutral-950 dark:via-neutral-950 dark:to-red-950/30">
         <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-16 top-8 h-56 w-56 rounded-full bg-[#FF5A52]/15 blur-[80px] dark:bg-[#FF5A52]/20" />
            <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#7C5CFC]/10 blur-[90px] dark:bg-[#7C5CFC]/20" />
         </div>

         <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:px-12 lg:py-14">
            <div className="z-10 space-y-5 text-center lg:text-left">
               <p className="inline-flex items-center gap-2 rounded-full border border-red-200/80 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-600 shadow-sm dark:border-red-500/30 dark:bg-white/5 dark:text-[#5EEAD4]">
                  Packaging
                  <span className="h-1 w-1 rounded-full bg-[#FF5A52]" />
                  brand neon
               </p>

               <h1 className="text-[2.15rem] font-bold leading-[1.08] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[3.1rem]">
                  Custom packaging
                  <span className="block text-[#FF5A52]">that sells your brand</span>
               </h1>

               <p className="mx-auto max-w-lg text-[15px] leading-relaxed text-slate-600 dark:text-slate-300 lg:mx-0 sm:text-base">
                  Pizza boxes, bags, mailers — plus glowing neon &amp; LED logo signs.
                  Upload your logo, preview, and order in one place.
               </p>

               <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 lg:justify-start sm:text-sm">
                  {['Design', 'Preview', 'Customize', 'Order'].map((step, i) => (
                     <span key={step} className="inline-flex items-center gap-2.5">
                        {i > 0 ? (
                           <span className="text-slate-300 dark:text-white/20" aria-hidden>
                              →
                           </span>
                        ) : null}
                        {step}
                     </span>
                  ))}
               </div>

               <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center lg:justify-start">
                  <Link href="/products" className="w-full sm:w-auto">
                     <Button className="h-11 w-full rounded-xl bg-[#FF5A52] px-6 text-[15px] font-semibold text-white shadow-md transition hover:scale-[1.02] hover:bg-[#ff6d66] sm:h-12">
                        Shop packaging
                     </Button>
                  </Link>
                  <Link
                     href="/products?productType=led%20%26%20neon%20signs"
                     className="w-full sm:w-auto"
                  >
                     <Button
                        variant="outline"
                        className="h-11 w-full rounded-xl border-slate-300 bg-white px-6 text-[15px] font-semibold text-slate-900 hover:bg-slate-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800 sm:h-12"
                     >
                        Neon &amp; LED signs
                     </Button>
                  </Link>
               </div>

               <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  Trusted by food brands &amp; storefronts worldwide
               </p>
            </div>

            <HeroCollage className="relative z-10 w-full" />
         </div>
      </section>
   )
}
