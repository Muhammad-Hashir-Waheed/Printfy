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

/** Fast food packaging tiles (homepage hero grid) */
export const FAST_FOOD_SHOWCASE_TILES = [
   {
      title: 'Pizza boxes',
      href: buildCatalogHref({ productType: 'Fast Food Packaging', q: 'pizza' }),
      image: CATALOG_IMAGES.customBoxLarge,
   },
   {
      title: 'Burger boxes',
      href: buildCatalogHref({ productType: 'Fast Food Packaging', q: 'burger' }),
      image: CATALOG_IMAGES.customBoxMedium,
   },
   {
      title: 'Fries cartons',
      href: buildCatalogHref({ productType: 'Fast Food Packaging', q: 'fries' }),
      image: CATALOG_IMAGES.customBoxSmall,
   },
   {
      title: 'Takeout bags',
      href: buildCatalogHref({ productType: 'Fast Food Packaging', q: 'takeout' }),
      image: CATALOG_IMAGES.customPaperBag,
   },
] as const

/** Homepage showcase tiles → filtered catalog (not random single PDPs) */
export const SHOWCASE_TILES = [
   {
      title: 'Fast food packaging',
      href: buildCatalogHref({ productType: 'Fast Food Packaging' }),
      image: CATALOG_IMAGES.customPackagingHero,
      imageClassName: 'object-center',
   },
   {
      title: 'Pizza boxes',
      href: buildCatalogHref({ productType: 'Fast Food Packaging', q: 'pizza' }),
      image: CATALOG_IMAGES.customBoxLarge,
   },
   {
      title: 'Burger boxes',
      href: buildCatalogHref({ productType: 'Fast Food Packaging', q: 'burger' }),
      image: CATALOG_IMAGES.customBoxMedium,
   },
   {
      title: 'T-shirts',
      href: buildCatalogHref({ productType: 'T-Shirts' }),
      image: CATALOG_IMAGES.teeFolded,
      imageClassName: 'object-top',
   },
   {
      title: 'Bags',
      href: buildCatalogHref({ productType: 'Bags' }),
      image: CATALOG_IMAGES.bag,
      imageClassName: 'object-top',
   },
   {
      title: 'Coffee mugs',
      href: buildCatalogHref({ productType: 'Drinkware' }),
      image: CATALOG_IMAGES.mug,
   },
   {
      title: 'Embroidered shirts',
      href: buildCatalogHref({ productType: 'T-Shirts' }),
      image: CATALOG_IMAGES.polo,
   },
   {
      title: 'Stickers',
      href: buildCatalogHref({ productType: 'Packaging' }),
      image: CATALOG_IMAGES.phone,
   },
   {
      title: 'Leggings',
      href: buildCatalogHref({ productType: 'Pants' }),
      image:
         'https://images.pexels.com/photos/4210866/pexels-photo-4210866.jpeg?auto=compress&cs=tinysrgb&w=1200',
   },
   {
      title: 'Hoodies',
      href: buildCatalogHref({ productType: 'Hoodies' }),
      image: CATALOG_IMAGES.hoodie,
   },
   {
      title: 'Flags & posters',
      href: buildCatalogHref({ productType: 'Home & Office' }),
      image:
         'https://images.pexels.com/photos/4386429/pexels-photo-4386429.jpeg?auto=compress&cs=tinysrgb&w=1200',
      imageClassName: 'object-center',
   },
   {
      title: 'Pants',
      href: buildCatalogHref({ productType: 'Pants' }),
      image: CATALOG_IMAGES.pants,
   },
   {
      title: 'Accessories',
      href: buildCatalogHref({ productType: 'Accessories' }),
      image: CATALOG_IMAGES.sweatshirt,
   },
] as const

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
