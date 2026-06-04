import {
   BlogPostGrid,
   BlogPostSkeletonGrid,
} from '@/components/native/BlogCard'
import Carousel from '@/components/native/Carousel'
import { HeroSection } from '@/components/native/landing/hero-section'
import {
   GlobalReachSection,
   IntegrationsSection,
   ProductShowcaseSection,
   ProfitEstimatorSection,
} from '@/components/native/landing/premium-sections'
import { ProductGrid, ProductSkeletonGrid } from '@/components/native/Product'
import { Heading } from '@/components/native/heading'
import { Separator } from '@/components/native/separator'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { getOfflineCatalogProducts } from '@/lib/catalog-offline'
import { getStaticBlogs } from '@/lib/static-blogs'
import { isVariableValid } from '@/lib/utils'

const dummyBanners = [
   {
      image:
         'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=1400&auto=format&fit=crop',
   },
   {
      image:
         'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?q=80&w=1400&auto=format&fit=crop',
   },
   {
      image:
         'https://images.unsplash.com/photo-1618354691438-25bc04584c23?q=80&w=1400&auto=format&fit=crop',
   },
]

const dummyProducts: any[] = [
   {
      id: 'dummy-1',
      title: 'Custom T-Shirt',
      description: 'Ultra-soft cotton tee for your brand or event.',
      images: [
         'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
      ],
      keywords: ['tshirt', 'custom', 'print'],
      price: 24.9,
      discount: 4.9,
      stock: 40,
      isAvailable: true,
      isFeatured: true,
      brand: { id: 'b1', title: 'Fannify Basics' },
      categories: [{ id: 'c1', title: 'Apparel' }],
      metadata: { isCustomizable: true },
   },
   {
      id: 'dummy-2',
      title: 'Photo Mug',
      description: '11oz ceramic mug with high-resolution print.',
      images: [
         'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1200&auto=format&fit=crop',
      ],
      keywords: ['mug', 'gift'],
      price: 14.9,
      discount: 0,
      stock: 30,
      isAvailable: true,
      isFeatured: true,
      brand: { id: 'b1', title: 'Fannify Basics' },
      categories: [{ id: 'c2', title: 'Drinkware' }],
      metadata: { isCustomizable: true },
   },
   {
      id: 'dummy-3',
      title: 'Logo Hoodie',
      description: 'Warm fleece hoodie for teams and creators.',
      images: [
         'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop',
      ],
      keywords: ['hoodie', 'winter'],
      price: 49.9,
      discount: 10,
      stock: 20,
      isAvailable: true,
      isFeatured: true,
      brand: { id: 'b2', title: 'Fannify Pro' },
      categories: [{ id: 'c1', title: 'Apparel' }],
      metadata: { isCustomizable: true },
   },
   {
      id: 'dummy-4',
      title: 'Business Cards',
      description: 'Premium matte business cards with sharp finish.',
      images: [
         'https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=1200&auto=format&fit=crop',
      ],
      keywords: ['cards', 'business'],
      price: 19.9,
      discount: 2,
      stock: 100,
      isAvailable: true,
      isFeatured: true,
      brand: { id: 'b3', title: 'Fannify Print' },
      categories: [{ id: 'c3', title: 'Marketing' }],
      metadata: { isCustomizable: true },
   },
   {
      id: 'dummy-5',
      title: 'Sticker Pack',
      description: 'Waterproof vinyl stickers for branding and packaging.',
      images: [
         'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop',
      ],
      keywords: ['stickers', 'labels'],
      price: 12.9,
      discount: 1,
      stock: 120,
      isAvailable: true,
      isFeatured: true,
      brand: { id: 'b3', title: 'Fannify Print' },
      categories: [{ id: 'c3', title: 'Marketing' }],
      metadata: { isCustomizable: true },
   },
   {
      id: 'dummy-6',
      title: 'Canvas Tote Bag',
      description: 'Heavy-duty reusable tote with custom front print.',
      images: [
         'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?q=80&w=1200&auto=format&fit=crop',
      ],
      keywords: ['tote', 'bag'],
      price: 18.9,
      discount: 3,
      stock: 56,
      isAvailable: true,
      isFeatured: true,
      brand: { id: 'b2', title: 'Fannify Pro' },
      categories: [{ id: 'c1', title: 'Apparel' }],
      metadata: { isCustomizable: true },
   },
]

export default function Index() {
   const catalogProducts = getOfflineCatalogProducts()
   const featured = catalogProducts.filter((p) => p.isFeatured)
   const safeProducts = (
      featured.length > 0 ? featured : catalogProducts.length > 0 ? catalogProducts : dummyProducts
   ).slice(0, 8)
   const safeBlogs = getStaticBlogs()
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
            <ProductShowcaseSection />
         </RevealOnScroll>

         <RevealOnScroll>
            <ProfitEstimatorSection />
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
               title="Trending products"
               description="Best-selling print products available for instant customization."
            />
            {isVariableValid(safeProducts) ? (
               <ProductGrid products={safeProducts} />
            ) : (
               <ProductSkeletonGrid />
            )}
            <Separator className="my-8" />
         </RevealOnScroll>

         <RevealOnScroll>
            <Heading
               title="Learn & grow"
               description="Tips to improve conversion and product quality."
            />
            {isVariableValid(safeBlogs) ? (
               <BlogPostGrid blogs={safeBlogs} />
            ) : (
               <BlogPostSkeletonGrid />
            )}
         </RevealOnScroll>
      </div>
   )
}
