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

const dummyBanners = [
   { image: CATALOG_IMAGES.customPackagingHero },
   { image: CATALOG_IMAGES.customBoxLarge },
   { image: CATALOG_IMAGES.neonSign },
   { image: CATALOG_IMAGES.customBoxMedium },
   { image: CATALOG_IMAGES.neonShop },
   { image: CATALOG_IMAGES.customPaperBag },
]

export default function Index() {
   const catalogProducts = getOfflineCatalogProducts()
   const safeProducts = catalogProducts.slice(0, 8)
   const safeBanners = dummyBanners

   return (
      <div className="flex flex-col border-neutral-200 dark:border-neutral-700">
         <RevealOnScroll>
            <HeroSection />
         </RevealOnScroll>

         <RevealOnScroll>
            <Carousel images={safeBanners.map((obj) => obj.image)} />
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
