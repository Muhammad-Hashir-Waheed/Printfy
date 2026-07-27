'use client'

import { ToggleSwitch } from '@/components/native/landing/toggle-switch'
import { Button } from '@/components/ui/button'
import { CATALOG_IMAGES } from '@/lib/catalog-images'
import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'
import { useState } from 'react'

export function HeroSection() {
   const [mode, setMode] = useState<'selling' | 'personal'>('selling')

   return (
      <section className="relative left-1/2 mb-8 min-h-[85vh] w-screen -translate-x-1/2 bg-gradient-to-r from-gray-50 to-blue-100 dark:from-neutral-950 dark:to-slate-900">
         <div className="mx-auto grid min-h-[85vh] max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-2 lg:gap-12 lg:px-12 lg:py-12">
            <div className="space-y-6 text-center lg:text-left">
               <div className="flex justify-center lg:justify-start">
                  <ToggleSwitch active={mode} onChange={setMode} />
               </div>
               <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-6xl">
                  Custom packaging for fast food & print apparel
               </h1>
               <p className="mx-auto max-w-md text-base text-slate-600 dark:text-slate-300 lg:mx-0 lg:text-lg">
                  Pizza boxes, burger boxes, fries cartons, takeout bags — plus t-shirts,
                  hoodies, and merch. Design, customize, and order in minutes.
               </p>
               <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-start">
                  <Link href="/products?productType=fast%20food%20packaging" className="w-full sm:w-auto">
                     <Button className="h-12 w-full rounded-lg bg-red-500 px-6 text-white shadow-md transition duration-200 hover:scale-105 hover:bg-red-600 hover:shadow-md">
                        Shop packaging
                     </Button>
                  </Link>
                  <Link href="/products?productType=t-shirts" className="w-full sm:w-auto">
                     <Button
                        variant="outline"
                        className="h-12 w-full rounded-lg border-slate-300 bg-white px-6 text-slate-900 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-600 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800 dark:hover:text-white"
                     >
                        Shop apparel
                     </Button>
                  </Link>
                  <Link
                     href="/privacy"
                     className="inline-flex w-full items-center justify-center gap-1 font-medium text-slate-700 transition duration-200 hover:scale-105 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white sm:w-auto"
                  >
                     Get enterprise support
                     <ArrowRightIcon className="h-4 w-4" />
                  </Link>
               </div>
               <p className="text-sm text-slate-500/80 dark:text-slate-400">Featuring: loola Co.</p>
            </div>

            <div className="relative flex items-center justify-center">
               <div className="grid w-full max-w-xl grid-cols-2 gap-3 lg:translate-y-6">
                  <div className="overflow-hidden rounded-xl bg-card shadow-2xl ring-1 ring-slate-200/80 dark:ring-slate-700">
                     <img
                        src={CATALOG_IMAGES.customBoxLarge}
                        alt="Custom printed pizza box packaging"
                        className="h-[200px] w-full object-cover sm:h-[260px] md:h-[320px]"
                     />
                     <p className="bg-white px-3 py-2 text-center text-xs font-medium text-slate-700 dark:bg-neutral-900 dark:text-slate-200 sm:text-sm">
                        Pizza boxes
                     </p>
                  </div>
                  <div className="overflow-hidden rounded-xl bg-card shadow-2xl ring-1 ring-slate-200/80 dark:ring-slate-700">
                     <img
                        src={CATALOG_IMAGES.customBoxMedium}
                        alt="Custom printed burger box packaging"
                        className="h-[200px] w-full object-cover sm:h-[260px] md:h-[320px]"
                     />
                     <p className="bg-white px-3 py-2 text-center text-xs font-medium text-slate-700 dark:bg-neutral-900 dark:text-slate-200 sm:text-sm">
                        Burger boxes
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}
