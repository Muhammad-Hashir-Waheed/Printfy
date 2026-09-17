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
   'cosmetic-set-box',
   'custom-pizza-box',
   'luxury-perfume-box',
   'premium-rigid-box',
   'shipping-carton',
   '3d-acrylic-board',
   'magnetic-makeup-box',
   'branded-gift-box',
] as const

const showcaseSlides = [
   {
      image: CATALOG_IMAGES.productCarton,
      eyebrow: 'Cosmetics',
      title: 'Packaging that belongs on the vanity',
      subtitle: 'Cartons, bags, tags, and unboxing extras for beauty brands.',
      href: '/products?productType=cosmetics',
   },
   {
      image: CATALOG_IMAGES.customPackagingHero,
      eyebrow: 'Hotel & Food',
      title: 'Kitchen-ready boxes, cups, and bags',
      subtitle: 'Printed packaging for hotels, restaurants, and catering.',
      href: '/products?productType=hotel+%26+food',
   },
   {
      image: CATALOG_IMAGES.rigidBox,
      eyebrow: 'Perfume & Makeup',
      title: 'Boxes made for fragrance and kits',
      subtitle: 'Sleeves, magnetic lids, and window makeup cartons.',
      href: '/products?productType=perfume+%26+makeup+boxes',
   },
   {
      image: CATALOG_IMAGES.neonSign,
      eyebrow: 'Branding',
      title: '3D boards that light the storefront',
      subtitle: 'Neon, LED letters, light boxes, and dimensional logos.',
      href: '/products?productType=branding+%26+3d+boards',
   },
]

export default function Index() {
   const catalogProducts = getOfflineCatalogProducts()
   const byId = new Map(catalogProducts.map((p) => [p.id, p]))
   const featured = FEATURED_IDS.map((id) => byId.get(id)).filter(Boolean)

   return (
      <div className="flex flex-col gap-12 pb-4">
         <HeroSection />

         <RevealOnScroll>
            <ProductShowcaseSection />
         </RevealOnScroll>

         <RevealOnScroll>
            <section className="space-y-5">
               <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                     <p className="typo-eyebrow text-[#FF5A52]">Bestsellers</p>
                     <h2 className="typo-h2">Start with these</h2>
                     <p className="mt-1 typo-body text-muted-foreground">
                        One pick from each line — tap a card to customize.
                     </p>
                  </div>
                  <Link
                     href="/products"
                     className="inline-flex items-center gap-1 typo-body font-semibold text-[#FF5A52] hover:underline"
                  >
                     Shop all products
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
            <TrustStripSection />
         </RevealOnScroll>
      </div>
   )
}
