import { DUMMY_CATEGORIES, DUMMY_PRODUCT_TYPES } from '@/lib/catalog-dummy'
import { CATALOG_IMAGES } from '@/lib/catalog-images'
import { slugifyText } from '@/lib/slug'
import { getOfflineCatalogProducts } from '@/lib/catalog-offline'
import { getProductType } from '@/lib/catalog-client'

export function categoryFilterSlug(title: string) {
   return slugifyText(title)
}

export function brandFilterSlug(title: string) {
   return slugifyText(title)
}

export function productTypeFilterSlug(type: string) {
   return type.trim().toLowerCase()
}

export function buildCatalogHref(filters: {
   category?: string
   productType?: string
   brand?: string
   q?: string
}) {
   const params = new URLSearchParams()

   if (filters.category) {
      params.set('category', categoryFilterSlug(filters.category))
   }
   if (filters.productType) {
      params.set('productType', productTypeFilterSlug(filters.productType))
   }
   if (filters.brand) {
      params.set('brand', brandFilterSlug(filters.brand))
   }
   if (filters.q) {
      params.set('q', filters.q)
   }

   const query = params.toString()
   return query ? `/products?${query}` : '/products'
}

/** Food packaging tiles (homepage hero grid) */
export const FAST_FOOD_SHOWCASE_TILES = [
   {
      title: 'Pizza boxes',
      href: buildCatalogHref({ productType: 'Food Packaging', q: 'pizza' }),
      image: CATALOG_IMAGES.customBoxLarge,
   },
   {
      title: 'Burger boxes',
      href: buildCatalogHref({ productType: 'Food Packaging', q: 'burger' }),
      image: CATALOG_IMAGES.customBoxMedium,
   },
   {
      title: 'Fries cartons',
      href: buildCatalogHref({ productType: 'Food Packaging', q: 'fries' }),
      image: CATALOG_IMAGES.customBoxSmall,
   },
   {
      title: 'Takeout bags',
      href: buildCatalogHref({ productType: 'Food Packaging', q: 'takeout' }),
      image: CATALOG_IMAGES.customPaperBag,
   },
] as const

/** Compact homepage showcase — key packaging entry points */
export const SHOWCASE_TILES = [
   {
      title: 'Food packaging',
      href: buildCatalogHref({ productType: 'Food Packaging' }),
      image: CATALOG_IMAGES.customPackagingHero,
      imageClassName: 'object-center',
   },
   {
      title: 'Pizza boxes',
      href: buildCatalogHref({ category: 'Pizza Boxes' }),
      image: CATALOG_IMAGES.customBoxLarge,
   },
   {
      title: 'Burger boxes',
      href: buildCatalogHref({ category: 'Burger Boxes' }),
      image: CATALOG_IMAGES.customBoxMedium,
   },
   {
      title: 'Fries cartons',
      href: buildCatalogHref({ category: 'Fries Cartons' }),
      image: CATALOG_IMAGES.customBoxSmall,
   },
   {
      title: 'To go bags',
      href: buildCatalogHref({ category: 'To Go Bags' }),
      image: CATALOG_IMAGES.customPaperBag,
   },
   {
      title: 'Mailer boxes',
      href: buildCatalogHref({ category: 'Mailer Boxes' }),
      image: CATALOG_IMAGES.mailer,
   },
   {
      title: 'Shopping bags',
      href: buildCatalogHref({ category: 'Shopping Bags' }),
      image: CATALOG_IMAGES.shoppingBag,
   },
   {
      title: 'Stickers & labels',
      href: buildCatalogHref({ category: 'Stickers & Labels' }),
      image: CATALOG_IMAGES.sticker,
   },
   {
      title: 'Bakery boxes',
      href: buildCatalogHref({ category: 'Bakery Boxes' }),
      image: CATALOG_IMAGES.bakeryBox,
   },
   {
      title: 'Gift boxes',
      href: buildCatalogHref({ category: 'Gift Boxes' }),
      image: CATALOG_IMAGES.giftBox,
   },
   {
      title: 'Rigid boxes',
      href: buildCatalogHref({ category: 'Rigid Boxes' }),
      image: CATALOG_IMAGES.rigidBox,
   },
   {
      title: 'Food containers',
      href: buildCatalogHref({ category: 'Food Containers' }),
      image: CATALOG_IMAGES.foodContainer,
   },
] as const

export const PACKAGING_PRODUCT_TYPES = DUMMY_PRODUCT_TYPES

export const PACKAGING_CATEGORY_TITLES = DUMMY_CATEGORIES.map((c) => c.title)

export function getCatalogBrowseCounts() {
   const products = getOfflineCatalogProducts()

   const byCategory = Object.fromEntries(
      DUMMY_CATEGORIES.map((cat) => [
         cat.title,
         products.filter((p) => p.categories?.some((c) => c.title === cat.title)).length,
      ])
   ) as Record<string, number>

   const byProductType = Object.fromEntries(
      DUMMY_PRODUCT_TYPES.map((type) => [
         type,
         products.filter((p) => getProductType(p) === type).length,
      ])
   ) as Record<string, number>

   return { byCategory, byProductType, total: products.length }
}
