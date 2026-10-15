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
            delay: 5000,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
         }),
      []
   )

   const [emblaRef, emblaApi] = useEmblaCarousel(
      { loop: true, align: 'start', skipSnaps: false },
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

   return (
      <section className="relative" aria-roledescription="carousel" aria-label="Featured collections">
         <div className="overflow-hidden rounded-2xl bg-neutral-950" ref={emblaRef}>
            <div className="flex">
               {items.map((slide, i) => (
                  <div
                     key={`${slide.image}-${i}`}
                     className="relative min-w-0 flex-[0_0_100%]"
                     role="group"
                     aria-roledescription="slide"
                     aria-label={`${i + 1} of ${items.length}`}
                  >
                     <div className="relative aspect-[16/9] w-full sm:aspect-[2/1]">
                        <Image
                           src={slide.image}
                           fill
                           priority={i === 0}
                           sizes="(max-width: 1440px) 100vw, 1440px"
                           className="object-cover"
                           alt={slide.title ?? `Showcase ${i + 1}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                        <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-8 lg:p-10">
                           <div className="max-w-xl space-y-3">
                              {slide.eyebrow ? (
                                 <p className="typo-eyebrow text-white/80">{slide.eyebrow}</p>
                              ) : null}
                              {slide.title ? (
                                 <h2 className="typo-h2 text-white">{slide.title}</h2>
                              ) : null}
                              {slide.subtitle ? (
                                 <p className="max-w-md typo-body text-white/75">{slide.subtitle}</p>
                              ) : null}
                              {slide.href ? (
                                 <Link
                                    href={slide.href}
                                    className="mt-1 inline-flex h-10 items-center rounded-xl bg-[#FF5A52] px-4 typo-body font-semibold text-white transition hover:bg-[#ff6d66]"
                                 >
                                    Explore collection
                                 </Link>
                              ) : null}
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="mt-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
               {scrollSnaps.map((_, index) => (
                  <button
                     key={index}
                     type="button"
                     aria-label={`Go to slide ${index + 1}`}
                     aria-current={index === selectedIndex ? 'true' : undefined}
                     onClick={() => scrollTo(index)}
                     className={cn(
                        'h-2 rounded-full transition-all duration-300',
                        index === selectedIndex
                           ? 'w-6 bg-[#FF5A52]'
                           : 'w-2 bg-foreground/20 hover:bg-foreground/40'
                     )}
                  />
               ))}
            </div>

            <div className="flex items-center gap-2">
               <p className="typo-body tabular-nums text-muted-foreground" aria-live="polite">
                  {selectedIndex + 1} / {items.length}
               </p>
               <button
                  type="button"
                  onClick={scrollPrev}
                  aria-label="Previous slide"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border bg-background text-foreground transition hover:bg-muted"
               >
                  <ChevronLeft className="h-4 w-4" />
               </button>
               <button
                  type="button"
                  onClick={scrollNext}
                  aria-label="Next slide"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border bg-background text-foreground transition hover:bg-muted"
               >
                  <ChevronRight className="h-4 w-4" />
               </button>
            </div>
         </div>
      </section>
   )
}
