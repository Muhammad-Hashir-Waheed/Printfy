'use client'

import { HeroCollage } from '@/components/native/landing/hero-collage'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroSection() {
   return (
      <section className="relative overflow-hidden">
         <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-16 top-8 h-56 w-56 rounded-full bg-[#FF5A52]/12 blur-[80px]" />
            <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-slate-200/50 blur-[90px] dark:bg-white/5" />
         </div>

         <div className="relative grid items-center gap-8 py-6 md:grid-cols-2 md:gap-10 lg:py-10">
            <div className="z-10 space-y-5 text-center md:text-left">
               <p className="typo-eyebrow inline-flex items-center gap-2 text-[#FF5A52]">
                  Joji Arts
                  <span className="h-1 w-1 rounded-full bg-[#FF5A52]" />
                  custom print
               </p>

               <h1 className="typo-hero text-slate-900 dark:text-white">
                  If you need it,
                  <span className="block text-[#FF5A52]">we print it.</span>
               </h1>

               <p className="mx-auto max-w-lg typo-body text-slate-600 dark:text-slate-300 md:mx-0">
                  Packaging for cosmetics, hotels, perfume, luxury rigid boxes, corrugated
                  cartons, and 3D branding boards. Upload your logo, preview, and order.
               </p>

               <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 typo-body text-slate-500 dark:text-slate-400 md:justify-start">
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

               <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center md:justify-start">
                  <Link href="/products" className="w-full sm:w-auto">
                     <Button className="h-11 w-full bg-[#FF5A52] px-6 font-semibold text-white shadow-md hover:bg-[#ff6d66] sm:w-auto">
                        Shop now
                     </Button>
                  </Link>
                  <Link href="/products?productType=cosmetics" className="w-full sm:w-auto">
                     <Button
                        variant="outline"
                        className="h-11 w-full border-slate-300 bg-white px-6 font-semibold text-slate-900 hover:bg-slate-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800 sm:w-auto"
                     >
                        Start with cosmetics
                     </Button>
                  </Link>
               </div>
            </div>

            <HeroCollage className="relative z-10 w-full" />
         </div>
      </section>
   )
}
