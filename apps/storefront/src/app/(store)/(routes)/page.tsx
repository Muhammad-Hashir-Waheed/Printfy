import Carousel from '@/components/native/Carousel'
import { HeroSection } from '@/components/native/landing/hero-section'
import {
   NeonSignsSection,
   ProductShowcaseSection,
   TrustStripSection,
} from '@/components/native/landing/premium-sections'
import { CATALOG_IMAGES } from '@/lib/catalog-images'
import { ProductGrid, ProductSkeletonGrid } from '@/components/native/Product'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { getOfflineCatalogProducts } from '@/lib/catalog-offline'
import { isVariableValid } from '@/lib/utils'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

const FEATURED_IDS = [
   'custom-pizza-box',
   'burger-box',
   'custom-neon-sign',
   'mailer-box',
   'takeout-bag',
   'led-channel-letter',
   'sticker-pack',
   'branded-gift-box',
] as const

const showcaseSlides = [
   {
      image: CATALOG_IMAGES.customBoxLarge,
      eyebrow: 'Bestsellers',
      title: 'Pizza boxes that look like a billboard',
      subtitle: 'Full-color lids, grease-resistant stock — ready for delivery.',
      href: '/products/custom-pizza-box',
   },
   {
      image: CATALOG_IMAGES.neonSign,
      eyebrow: 'Brand neon',
      title: 'Neon logo signs for your storefront',
      subtitle: 'Custom illuminated wordmarks customers remember.',
      href: '/products/custom-neon-sign',
   },
   {
      image: CATALOG_IMAGES.mailer,
      eyebrow: 'Shipping',
      title: 'Mailers that unbox like a brand moment',
      subtitle: 'E-commerce mailer boxes with crisp logo print.',
      href: '/products/mailer-box',
   },
   {
      image: CATALOG_IMAGES.customPaperBag,
      eyebrow: 'Takeout',
      title: 'Bags that finish every order',
      subtitle: 'Kraft to-go bags with your logo on every handle.',
      href: '/products/takeout-bag',
   },
]

export default function Index() {
   const catalogProducts = getOfflineCatalogProducts()
   const byId = new Map(catalogProducts.map((p) => [p.id, p]))
   const featured = FEATURED_IDS.map((id) => byId.get(id)).filter(Boolean)

   return (
      <div className="flex flex-col gap-10 pb-6 sm:gap-12">
         <RevealOnScroll>
            <HeroSection />
         </RevealOnScroll>

         <RevealOnScroll>
            <section className="space-y-5">
               <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                     <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FF5A52]">
                        Shop now
                     </p>
                     <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Trending packaging
                     </h2>
                     <p className="mt-1 text-sm text-muted-foreground">
                        Hand-picked bestsellers — tap any card to customize.
                     </p>
                  </div>
                  <Link
                     href="/products"
                     className="inline-flex items-center gap-1 text-sm font-semibold text-[#FF5A52] hover:underline"
                  >
                     Browse catalog
                     <ArrowRightIcon className="h-4 w-4" />
                  </Link>
               </div>
               {isVariableValid(featured) ? (
                  <ProductGrid products={featured as any} />
               ) : (
                  <ProductSkeletonGrid />
               )}
            </section>
         </RevealOnScroll>

         <RevealOnScroll>
            <Carousel slides={showcaseSlides} />
         </RevealOnScroll>

         <RevealOnScroll>
            <NeonSignsSection />
         </RevealOnScroll>

         <RevealOnScroll>
            <ProductShowcaseSection />
         </RevealOnScroll>

         <RevealOnScroll>
            <TrustStripSection />
         </RevealOnScroll>
      </div>
   )
}
