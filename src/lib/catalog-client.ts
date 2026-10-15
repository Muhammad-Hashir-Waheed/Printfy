import type { CatalogProduct } from '@/lib/catalog-dummy'
import { slugifyText } from '@/lib/slug'

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

export function filterCatalogProducts(
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

   let filtered = [...products]

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
            slugifyText(p.brand?.title ?? '') === brand ||
            p.brand?.title?.toLowerCase().includes(brand)
      )
   }

   if (category) {
      filtered = filtered.filter((p) =>
         p.categories?.some(
            (c) =>
               slugifyText(c.title) === category ||
               c.title.toLowerCase().includes(category)
         )
      )
   }

   if (productType) {
      let wanted = productType.trim().toLowerCase()
      try {
         wanted = decodeURIComponent(wanted).trim().toLowerCase()
      } catch {
         /* use raw param */
      }
      filtered = filtered.filter((p) => {
         const type = getProductType(p)
         const typeLower = type.toLowerCase()
         const typeSlug = slugifyText(type)
         return (
            typeLower === wanted ||
            typeSlug === wanted ||
            typeSlug === slugifyText(wanted) ||
            typeLower.includes(wanted)
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

export function sortCatalogProducts(products: CatalogProduct[], sort?: string) {
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
