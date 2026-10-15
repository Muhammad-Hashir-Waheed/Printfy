import { resolveProductImages } from '@/lib/catalog-images'
import {
   DUMMY_PRODUCTS,
   type CatalogProduct,
} from '@/lib/catalog-dummy'

export type { CatalogProduct }

function normalizeOffline(product: CatalogProduct): CatalogProduct {
   return JSON.parse(
      JSON.stringify(
         {
            ...product,
            price: Number(product.price),
            discount: Number(product.discount),
            stock: Number(product.stock),
            images: resolveProductImages(product.id, product.images),
            variants: product.variants ?? [],
            keywords: Array.isArray(product.keywords) ? product.keywords : [],
         },
         (_key, value) => (value instanceof Date ? value.toISOString() : value)
      )
   ) as CatalogProduct
}

export function getOfflineCatalogProducts(): CatalogProduct[] {
   return DUMMY_PRODUCTS.map(normalizeOffline)
}
