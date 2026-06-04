import type { CatalogProduct } from '@/lib/catalog-dummy'

export type { CatalogProduct }

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
