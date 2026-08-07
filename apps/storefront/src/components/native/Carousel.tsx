'use client'

import { cn } from '@/lib/utils'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'

export type CarouselSlide = {
   image: string
   title?: string
   subtitle?: string
   href?: string
   eyebrow?: string
}

type CarouselProps = {
   images?: string[]
   slides?: CarouselSlide[]
}

export default function Carousel({ images = [], slides }: CarouselProps) {
   const items: CarouselSlide[] = useMemo(() => {
      if (slides?.length) return slides
      return images.map((image) => ({ image }))
   }, [images, slides])

   const autoplay = useMemo(
      () =>
         Autoplay({
            delay: 4500,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
         }),
      []
   )

   const [emblaRef, emblaApi] = useEmblaCarousel(
      { loop: true, align: 'center', skipSnaps: false },
      [autoplay]
   )

   const [selectedIndex, setSelectedIndex] = useState(0)
   const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

   const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
   const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
   const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

   useEffect(() => {
      if (!emblaApi) return

      const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
      const onInit = () => {
         setScrollSnaps(emblaApi.scrollSnapList())
         onSelect()
      }

      onInit()
      emblaApi.on('reInit', onInit)
      emblaApi.on('select', onSelect)

      return () => {
         emblaApi.off('reInit', onInit)
         emblaApi.off('select', onSelect)
      }
   }, [emblaApi])

   if (!items.length) return null

   const active = items[selectedIndex] ?? items[0]

   return (
      <section className="relative my-6">
         <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-[0_28px_70px_-36px_rgba(0,0,0,0.65)] ring-1 ring-black/5 dark:ring-white/10">
            {/* ambient glows */}
            <div className="pointer-events-none absolute -left-16 top-6 z-10 h-40 w-40 rounded-full bg-[#FF5A52]/20 blur-[80px]" />
            <div className="pointer-events-none absolute -right-12 bottom-6 z-10 h-44 w-44 rounded-full bg-[#7C5CFC]/15 blur-[90px]" />

            <div className="overflow-hidden" ref={emblaRef}>
               <div className="flex">
                  {items.map((slide, i) => (
                     <div
                        key={`${slide.image}-${i}`}
                        className="relative min-w-0 flex-[0_0_100%]"
                     >
                        <div className="relative aspect-[21/9] min-h-[200px] w-full sm:min-h-[260px] lg:min-h-[320px]">
                           <Image
                              src={slide.image}
                              fill
                              priority={i === 0}
                              sizes="(max-width: 1280px) 100vw, 1200px"
                              className={cn(
                                 'object-cover transition duration-700',
                                 i === selectedIndex ? 'scale-100' : 'scale-105'
                              )}
                              alt={slide.title ?? `Showcase ${i + 1}`}
                           />

                           {/* cinematic overlays */}
                           <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
                           <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent" />

                           {/* content */}
                           <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 sm:p-6 lg:p-8">
                              <div className="max-w-lg space-y-2">
                                 {slide.eyebrow ? (
                                    <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5EEAD4] backdrop-blur-md">
                                       {slide.eyebrow}
                                    </p>
                                 ) : null}
                                 {slide.title ? (
                                    <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
                                       {slide.title}
                                    </h2>
                                 ) : null}
                                 {slide.subtitle ? (
                                    <p className="max-w-md text-xs text-white/75 sm:text-sm">
                                       {slide.subtitle}
                                    </p>
                                 ) : null}
                                 {slide.href ? (
                                    <Link
                                       href={slide.href}
                                       className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-[#FF5A52] px-3.5 py-2 text-xs font-semibold text-white shadow-[0_0_24px_rgba(255,90,82,0.3)] transition hover:bg-[#ff6d66] sm:text-sm"
                                    >
                                       Explore collection
                                       <ChevronRight className="h-3.5 w-3.5" />
                                    </Link>
                                 ) : null}
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* glass controls */}
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-2.5 sm:px-4">
               <button
                  type="button"
                  onClick={scrollPrev}
                  aria-label="Previous slide"
                  className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-xl transition hover:scale-105 hover:bg-white/20 sm:h-10 sm:w-10"
               >
                  <ChevronLeft className="h-4 w-4" />
               </button>
               <button
                  type="button"
                  onClick={scrollNext}
                  aria-label="Next slide"
                  className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-xl transition hover:scale-105 hover:bg-white/20 sm:h-10 sm:w-10"
               >
                  <ChevronRight className="h-4 w-4" />
               </button>
            </div>

            {/* bottom chrome: progress + pills */}
            <div className="absolute inset-x-0 bottom-0 z-30 px-4 pb-4 sm:px-6 sm:pb-5">
               <div className="mb-4 h-[2px] overflow-hidden rounded-full bg-white/15">
                  <div
                     className="h-full rounded-full bg-gradient-to-r from-[#FF5A52] via-[#7C5CFC] to-[#5EEAD4] transition-all duration-500"
                     style={{
                        width: `${((selectedIndex + 1) / items.length) * 100}%`,
                     }}
                  />
               </div>

               <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-medium text-white/60">
                     <span className="text-white">{String(selectedIndex + 1).padStart(2, '0')}</span>
                     <span className="mx-1.5 text-white/30">/</span>
                     <span>{String(items.length).padStart(2, '0')}</span>
                     {active?.title ? (
                        <span className="ml-3 hidden text-white/80 sm:inline">{active.title}</span>
                     ) : null}
                  </p>

                  <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/30 p-1.5 backdrop-blur-xl">
                     {scrollSnaps.map((_, index) => {
                        const selected = index === selectedIndex
                        return (
                           <button
                              key={index}
                              type="button"
                              aria-label={`Go to slide ${index + 1}`}
                              onClick={() => scrollTo(index)}
                              className={cn(
                                 'h-2 rounded-full transition-all duration-300',
                                 selected
                                    ? 'w-8 bg-[#FF5A52] shadow-[0_0_16px_rgba(255,90,82,0.55)]'
                                    : 'w-2 bg-white/35 hover:bg-white/60'
                              )}
                           />
                        )
                     })}
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}
