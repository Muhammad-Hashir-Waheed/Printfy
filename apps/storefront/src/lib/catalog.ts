import prisma from '@/lib/prisma'
import { slugify } from '@persepolis/slugify'
import {
   DUMMY_BRANDS,
   DUMMY_CATEGORIES,
   DUMMY_PRODUCTS,
   DUMMY_PRODUCT_TYPES,
   type CatalogProduct,
} from '@/lib/catalog-dummy'

export type { CatalogProduct }

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

export type SelectedVariant = {
   name: string
   value: string
   priceModifier: number
}

export function groupVariants(
   variants: Array<{ name: string; value: string; priceModifier: number }>
) {
   const map = new Map<
      string,
      { name: string; options: Array<{ value: string; priceModifier: number }> }
   >()

   for (const variant of variants) {
      if (!map.has(variant.name)) {
         map.set(variant.name, { name: variant.name, options: [] })
      }
      const group = map.get(variant.name)!
      if (!group.options.some((o) => o.value === variant.value)) {
         group.options.push({
            value: variant.value,
            priceModifier: variant.priceModifier,
         })
      }
   }

   return Array.from(map.values())
}

export function getProductType(product: CatalogProduct) {
   const meta = product.metadata as Record<string, unknown> | null
   return typeof meta?.productType === 'string' ? meta.productType : 'General'
}

export function isCustomizable(product: CatalogProduct) {
   const meta = product.metadata as Record<string, unknown> | null
   return meta?.isCustomizable !== false
}

function normalizeProduct(product: CatalogProduct): CatalogProduct {
   return {
      ...product,
      variants: product.variants ?? [],
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
   const dbProducts = await fetchDbProducts()
   const useDummy = dbProducts.length === 0

   const allProducts = useDummy ? DUMMY_PRODUCTS : dbProducts
   const brands = useDummy
      ? DUMMY_BRANDS
      : await prisma.brand.findMany().catch(() => DUMMY_BRANDS)
   const categories = useDummy
      ? DUMMY_CATEGORIES
      : await prisma.category.findMany().catch(() => DUMMY_CATEGORIES)

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
}

export async function getCatalogProduct(
   productId: string
): Promise<CatalogProduct | null> {
   try {
      const product = await prisma.product.findUnique({
         where: { id: productId },
         include: {
            brand: true,
            categories: true,
            variants: true,
         },
      })
      if (product) return product as CatalogProduct
   } catch {
      // fall through to dummy
   }

   const dummy = DUMMY_PRODUCTS.find((p) => p.id === productId)
   return dummy ? normalizeProduct(dummy) : null
}

export async function getRelatedProducts(
   product: CatalogProduct,
   limit = 4
): Promise<CatalogProduct[]> {
   const categoryTitle = product.categories?.[0]?.title
   const dbProducts = await fetchDbProducts()
   const pool =
      dbProducts.length > 0
         ? dbProducts
         : DUMMY_PRODUCTS.map(normalizeProduct)

   return pool
      .filter(
         (p) =>
            p.id !== product.id &&
            (!categoryTitle ||
               p.categories?.some((c) => c.title === categoryTitle))
      )
      .slice(0, limit)
}
