import { getProductType, isCustomizable } from '@/lib/catalog-client'
import { resolveProductImages } from '@/lib/catalog-images'
import { getOfflineCatalogProducts } from '@/lib/catalog-offline'
import { slugify } from '@persepolis/slugify'
import {
   DUMMY_BRANDS,
   DUMMY_CATEGORIES,
   DUMMY_PRODUCTS,
   DUMMY_PRODUCT_TYPES,
   type CatalogProduct,
} from '@/lib/catalog-dummy'

export type { CatalogProduct }

export const CATALOG_PRODUCT_IDS = DUMMY_PRODUCTS.map((p) => p.id)

export function isCatalogProductId(productId: string) {
   return CATALOG_PRODUCT_IDS.includes(productId)
}

export type CatalogSearchParams = {
   sort?: string
   isAvailable?: string
   brand?: string
   category?: string
   productType?: string
   customizable?: string
   minPrice?: string
   maxPrice?: string
   q?: string
   page?: string
}

export type { SelectedVariant } from '@/lib/catalog-client'
export { getProductType, groupVariants, isCustomizable } from '@/lib/catalog-client'
export { getOfflineCatalogProducts } from '@/lib/catalog-offline'

function toSerializableCatalogProduct(product: CatalogProduct): CatalogProduct {
   return JSON.parse(
      JSON.stringify(product, (_key, value) => {
         if (value instanceof Date) {
            return value.toISOString()
         }
         return value
      })
   ) as CatalogProduct
}

function normalizeProduct(product: CatalogProduct): CatalogProduct {
   const normalized: CatalogProduct = {
      ...product,
      price: Number(product.price),
      discount: Number(product.discount),
      stock: Number(product.stock),
      images: resolveProductImages(product.id, product.images),
      variants: (product.variants ?? []).map((variant) => ({
         ...variant,
         priceModifier: Number(variant.priceModifier),
      })),
      keywords: Array.isArray(product.keywords) ? product.keywords : [],
   }

   return toSerializableCatalogProduct(normalized)
}

function mergeMetadata(
   ...sources: Array<unknown>
): CatalogProduct['metadata'] {
   const merged: Record<string, unknown> = {}
   for (const source of sources) {
      if (source && typeof source === 'object' && !Array.isArray(source)) {
         Object.assign(merged, source as Record<string, unknown>)
      }
   }
   return merged as CatalogProduct['metadata']
}

export function mergeWithCatalogDefaults(product: CatalogProduct): CatalogProduct {
   const dummy = DUMMY_PRODUCTS.find((entry) => entry.id === product.id)
   if (!dummy) {
      return normalizeProduct(product)
   }

   const merged: CatalogProduct = {
      ...dummy,
      ...product,
      title: product.title || dummy.title,
      description: product.description || dummy.description,
      price: product.price ?? dummy.price,
      discount: product.discount ?? dummy.discount,
      keywords: product.keywords?.length ? product.keywords : dummy.keywords,
      metadata: mergeMetadata(dummy.metadata, product.metadata),
      images: resolveProductImages(product.id, dummy.images),
      brand: product.brand ?? dummy.brand,
      categories: product.categories?.length ? product.categories : dummy.categories,
      variants: product.variants?.length ? product.variants : dummy.variants,
   }

   return normalizeProduct(merged)
}

function filterProducts(
   products: CatalogProduct[],
   params: CatalogSearchParams
) {
   const q = params.q?.trim().toLowerCase()
   const brand = params.brand?.trim().toLowerCase()
   const category = params.category?.trim().toLowerCase()
   const productType = params.productType?.trim().toLowerCase()
   const minPrice = params.minPrice ? Number(params.minPrice) : undefined
   const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined
   const onlyAvailable = params.isAvailable === 'true'
   const customizableOnly = params.customizable === 'true'

   let filtered = products.map(normalizeProduct)

   if (q) {
      filtered = filtered.filter(
         (p) =>
            p.title.toLowerCase().includes(q) ||
            (p.description ?? '').toLowerCase().includes(q) ||
            p.keywords.some((k) => k.toLowerCase().includes(q))
      )
   }

   if (brand) {
      filtered = filtered.filter(
         (p) =>
            slugify(p.brand?.title ?? '') === brand ||
            p.brand?.title?.toLowerCase().includes(brand)
      )
   }

   if (category) {
      filtered = filtered.filter((p) =>
         p.categories?.some(
            (c) =>
               slugify(c.title) === category ||
               c.title.toLowerCase().includes(category)
         )
      )
   }

   if (productType) {
      const wanted = decodeURIComponent(productType).trim().toLowerCase()
      filtered = filtered.filter((p) => {
         const type = getProductType(p)
         return (
            type.toLowerCase() === wanted ||
            slugify(type) === wanted ||
            type.toLowerCase().includes(wanted)
         )
      })
   }

   if (onlyAvailable) {
      filtered = filtered.filter((p) => p.isAvailable)
   }

   if (customizableOnly) {
      filtered = filtered.filter((p) => isCustomizable(p))
   }

   if (minPrice !== undefined && !Number.isNaN(minPrice)) {
      filtered = filtered.filter((p) => p.price - p.discount >= minPrice)
   }

   if (maxPrice !== undefined && !Number.isNaN(maxPrice)) {
      filtered = filtered.filter((p) => p.price - p.discount <= maxPrice)
   }

   return filtered
}

function sortProducts(products: CatalogProduct[], sort?: string) {
   const list = [...products]

   switch (sort) {
      case 'most_expensive':
         return list.sort((a, b) => b.price - a.price)
      case 'least_expensive':
         return list.sort((a, b) => a.price - b.price)
      case 'name_asc':
         return list.sort((a, b) => a.title.localeCompare(b.title))
      case 'newest':
         return list.sort(
            (a, b) =>
               new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
         )
      case 'featured':
      default:
         return list.sort((a, b) => {
            if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1
            return a.title.localeCompare(b.title)
         })
   }
}

export async function listAllCatalogProducts(): Promise<CatalogProduct[]> {
   return getOfflineCatalogProducts()
}

export async function getCatalogSnapshot(params: CatalogSearchParams = {}) {
   const allProducts = getOfflineCatalogProducts()
   const filtered = filterProducts(allProducts, params)
   const sorted = sortProducts(filtered, params.sort)
   const page = Math.max(1, Number(params.page) || 1)
   const pageSize = 12
   const products = sorted.slice((page - 1) * pageSize, page * pageSize)

   return {
      products,
      total: sorted.length,
      brands: DUMMY_BRANDS,
      categories: DUMMY_CATEGORIES,
      productTypes: DUMMY_PRODUCT_TYPES,
      useDummy: true,
   }
}

export async function getCatalogProduct(
   productId: string
): Promise<CatalogProduct | null> {
   const dummy = DUMMY_PRODUCTS.find((p) => p.id === productId)
   return dummy ? normalizeProduct(dummy) : null
}

export async function getRelatedProducts(
   product: CatalogProduct,
   limit = 4
): Promise<CatalogProduct[]> {
   const categoryTitle = product.categories?.[0]?.title
   const pool = getOfflineCatalogProducts()

   return pool
      .filter(
         (p) =>
            p.id !== product.id &&
            (!categoryTitle ||
               p.categories?.some((c) => c.title === categoryTitle))
      )
      .slice(0, limit)
}
