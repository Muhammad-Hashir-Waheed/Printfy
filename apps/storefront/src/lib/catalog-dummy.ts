import { PACKAGING_CATEGORIES } from '@/lib/packaging-categories'
import { PACKAGING_PRODUCTS } from '@/lib/packaging-products'
import type { ProductWithIncludes } from '@/types/prisma'

export type CatalogProduct = ProductWithIncludes & {
   variants?: Array<{
      id: string
      name: string
      value: string
      priceModifier: number
      productId: string
   }>
}

export const DUMMY_BRANDS = [
   { id: 'brand-fannify', title: 'Fannify', description: 'House brand', logo: null },
   { id: 'brand-studio', title: 'Studio Print', description: 'Premium blanks', logo: null },
]

/** Packaging-only categories (Vistaprint-style leaf categories) */
export const DUMMY_CATEGORIES = PACKAGING_CATEGORIES.map((category) => ({
   id: category.id,
   title: category.title,
   description: category.description,
}))

export const DUMMY_PRODUCT_TYPES = [
   'Food Packaging',
   'Shipping Packaging',
   'Retail Packaging',
   'Packaging Accessories',
] as const

/** Full packaging catalog — 2–3 products per category */
export const DUMMY_PRODUCTS: CatalogProduct[] = PACKAGING_PRODUCTS
