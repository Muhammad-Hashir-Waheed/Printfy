import Carousel from '@/components/native/Carousel'
import { HeroSection } from '@/components/native/landing/hero-section'
import {
   FastFoodPackagingSection,
   GlobalReachSection,
   IntegrationsSection,
   NeonSignsSection,
   ProductShowcaseSection,
} from '@/components/native/landing/premium-sections'
import { CATALOG_IMAGES } from '@/lib/catalog-images'
import { ProductGrid, ProductSkeletonGrid } from '@/components/native/Product'
import { Heading } from '@/components/native/heading'
import { Separator } from '@/components/native/separator'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { getOfflineCatalogProducts } from '@/lib/catalog-offline'
import { isVariableValid } from '@/lib/utils'

const showcaseSlides = [
   {
      image: CATALOG_IMAGES.customPackagingHero,
      eyebrow: 'Featured',
      title: 'Custom packaging that sells your brand',
      subtitle: 'Pizza boxes, burger boxes, bags & more — printed with your logo.',
      href: '/products?productType=food%20packaging',
   },
   {
      image: CATALOG_IMAGES.customBoxLarge,
      eyebrow: 'Food packaging',
      title: 'Pizza boxes that look like a billboard',
      subtitle: 'Full-color lids, grease-resistant stock, ready for delivery.',
      href: '/products?q=pizza',
   },
   {
      image: CATALOG_IMAGES.neonSign,
      eyebrow: 'Brand neon',
      title: 'Neon logo signs for your storefront',
      subtitle: 'Custom illuminated brand wordmarks — glow that customers remember.',
      href: '/products?q=neon',
   },
   {
      image: CATALOG_IMAGES.customBoxMedium,
      eyebrow: 'Food packaging',
      title: 'Burger boxes built for takeout',
      subtitle: 'Clamshells and combo boxes with crisp logo print.',
      href: '/products?q=burger',
   },
   {
      image: CATALOG_IMAGES.neonShop,
      eyebrow: 'LED & neon',
      title: 'Script neon brand logos',
      subtitle: 'Boutique-style glowing name signs for cafés and restaurants.',
      href: '/products?q=neon',
   },
   {
      image: CATALOG_IMAGES.customPaperBag,
      eyebrow: 'Retail',
      title: 'Branded bags for every order',
      subtitle: 'Kraft to-go bags that finish the unboxing experience.',
      href: '/products?q=takeout',
   },
]

export default function Index() {
   const catalogProducts = getOfflineCatalogProducts()
   const safeProducts = catalogProducts.slice(0, 8)

   return (
      <div className="flex flex-col border-neutral-200 dark:border-neutral-700">
         <RevealOnScroll>
            <HeroSection />
         </RevealOnScroll>

         <RevealOnScroll>
            <Carousel slides={showcaseSlides} />
         </RevealOnScroll>

         <RevealOnScroll>
            <FastFoodPackagingSection />
         </RevealOnScroll>

         <RevealOnScroll>
            <NeonSignsSection />
         </RevealOnScroll>

         <RevealOnScroll>
            <ProductShowcaseSection />
         </RevealOnScroll>

         <RevealOnScroll>
            <GlobalReachSection />
         </RevealOnScroll>

         <RevealOnScroll>
            <IntegrationsSection />
         </RevealOnScroll>

         <RevealOnScroll>
            <Separator className="my-8" />
            <Heading
               title="Trending packaging"
               description="Custom fast food packaging and mailers — ready to customize."
            />
            {isVariableValid(safeProducts) ? (
               <ProductGrid products={safeProducts} />
            ) : (
               <ProductSkeletonGrid />
            )}
            <Separator className="my-8" />
         </RevealOnScroll>
      </div>
   )
}
