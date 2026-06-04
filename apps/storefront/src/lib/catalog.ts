import { getProductType, isCustomizable } from '@/lib/catalog-client'
import { resolveProductImages } from '@/lib/catalog-images'
import { getOfflineCatalogProducts } from '@/lib/catalog-offline'
async function getPrisma() {
   const { default: prisma } = await import('@/lib/prisma')
   return prisma
}
import { slugify } from '@persepolis/slugify'
import {
   DUMMY_BRANDS,
   DUMMY_CATEGORIES,
   DUMMY_PRODUCTS,
   DUMMY_PRODUCT_TYPES,
   type CatalogProduct,
} from '@/lib/catalog-dummy'

export type { CatalogProduct }

/** Stable storefront product slugs (all PDP routes use these ids) */
export const CATALOG_PRODUCT_IDS = DUMMY_PRODUCTS.map((p) => p.id)

const CATALOG_ID_SET = new Set(CATALOG_PRODUCT_IDS)

export function isCatalogProductId(productId: string) {
   return CATALOG_ID_SET.has(productId)
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

/** Strip Dates / Prisma types so server → client components do not 500 on Vercel */
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

export { getOfflineCatalogProducts } from '@/lib/catalog-offline'

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

/** Keep DB rows in sync with catalog dummy (images, copy, variants) by stable product id */
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

function safeCatalogProduct(product: CatalogProduct): CatalogProduct | null {
   try {
      return mergeWithCatalogDefaults(product)
   } catch {
      const dummy = DUMMY_PRODUCTS.find((entry) => entry.id === product.id)
      return dummy ? normalizeProduct(dummy) : null
   }
}

/** Dummy catalog row + optional DB overlay (price/stock/variants) */
function overlayDbOnDummy(
   dummy: CatalogProduct,
   db: CatalogProduct | null | undefined
): CatalogProduct {
   if (!db) {
      return normalizeProduct(dummy)
   }

   return (
      safeCatalogProduct({
         ...(dummy as CatalogProduct),
         price: Number(db.price) || dummy.price,
         discount: Number(db.discount) ?? dummy.discount,
         stock: db.stock ?? dummy.stock,
         isAvailable: db.isAvailable ?? dummy.isAvailable,
         isFeatured: db.isFeatured ?? dummy.isFeatured,
         variants: db.variants?.length ? db.variants : dummy.variants,
      }) ?? normalizeProduct(dummy)
   )
}

/**
 * Full POD catalog: always every dummy product, merged with DB when available.
 * Production stays usable even when Prisma/DB is down or partially seeded.
 */
export async function listAllCatalogProducts(): Promise<CatalogProduct[]> {
   try {
      const dbProducts = await fetchDbProducts()
      const dbById = new Map(
         dbProducts.map((p) => [p.id, p as CatalogProduct])
      )

      const catalog = DUMMY_PRODUCTS.map((dummy) =>
         overlayDbOnDummy(dummy, dbById.get(dummy.id))
      )

      for (const db of dbProducts) {
         if (!CATALOG_ID_SET.has(db.id)) {
            const safe = safeCatalogProduct(db as CatalogProduct)
            if (safe) catalog.push(safe)
         }
      }

      return catalog
   } catch (error) {
      console.error('[CATALOG_LIST]', error)
      return getOfflineCatalogProducts()
   }
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
      filtered = filtered.filter(
         (p) => getProductType(p).toLowerCase() === productType
      )
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

export async function fetchDbProducts() {
   try {
      const prisma = await getPrisma()
      const products = await prisma.product.findMany({
         include: {
            brand: true,
            categories: true,
            variants: true,
         },
      })
      return products as CatalogProduct[]
   } catch {
      return []
   }
}

export async function getCatalogSnapshot(params: CatalogSearchParams = {}) {
   try {
      const dbProducts = await fetchDbProducts()
      const useDummy = dbProducts.length === 0

      const allProducts = await listAllCatalogProducts()
      const brands = useDummy
         ? DUMMY_BRANDS
         : await (await getPrisma()).brand.findMany().catch(() => DUMMY_BRANDS)
      const categories = useDummy
         ? DUMMY_CATEGORIES
         : await (await getPrisma()).category.findMany().catch(() => DUMMY_CATEGORIES)

      const filtered = filterProducts(allProducts, params)
      const sorted = sortProducts(filtered, params.sort)
      const page = Math.max(1, Number(params.page) || 1)
      const pageSize = 12
      const products = sorted.slice((page - 1) * pageSize, page * pageSize)

      return {
         products,
         total: sorted.length,
         brands,
         categories,
         productTypes: DUMMY_PRODUCT_TYPES,
         useDummy,
      }
   } catch (error) {
      console.error('[CATALOG_SNAPSHOT]', error)
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
}

export async function getCatalogProduct(
   productId: string
): Promise<CatalogProduct | null> {
   const dummy = DUMMY_PRODUCTS.find((p) => p.id === productId)

   if (dummy) {
      try {
         const dbProduct = await (
            await getPrisma()
         ).product.findUnique({
            where: { id: productId },
            include: {
               brand: true,
               categories: true,
               variants: true,
            },
         })
         return overlayDbOnDummy(
            dummy,
            dbProduct ? (dbProduct as CatalogProduct) : null
         )
      } catch (error) {
         console.error('[CATALOG_PRODUCT]', productId, error)
         return normalizeProduct(dummy)
      }
   }

   try {
      const dbProduct = await (
         await getPrisma()
      ).product.findUnique({
         where: { id: productId },
         include: {
            brand: true,
            categories: true,
            variants: true,
         },
      })
      if (dbProduct) {
         return safeCatalogProduct(dbProduct as CatalogProduct)
      }
   } catch (error) {
      console.error('[CATALOG_PRODUCT]', productId, error)
   }

   return null
}

export async function getRelatedProducts(
   product: CatalogProduct,
   limit = 4
): Promise<CatalogProduct[]> {
   const categoryTitle = product.categories?.[0]?.title
   const pool = await listAllCatalogProducts()

   return pool
      .filter(
         (p) =>
            p.id !== product.id &&
            (!categoryTitle ||
               p.categories?.some((c) => c.title === categoryTitle))
      )
      .slice(0, limit)
}
