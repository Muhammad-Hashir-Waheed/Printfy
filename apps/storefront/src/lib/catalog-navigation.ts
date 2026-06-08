import { DUMMY_CATEGORIES, DUMMY_PRODUCT_TYPES } from '@/lib/catalog-dummy'
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
const PKG = 'q=80&w=1200&auto=format&fit=crop'

export const FAST_FOOD_SHOWCASE_TILES = [
   {
      title: 'Pizza boxes',
      href: buildCatalogHref({ productType: 'Fast Food Packaging', q: 'pizza' }),
      image: `https://images.unsplash.com/photo-1604719312566-8912f0863e2c?${PKG}`,
   },
   {
      title: 'Burger boxes',
      href: buildCatalogHref({ productType: 'Fast Food Packaging', q: 'burger' }),
      image: `https://images.unsplash.com/photo-1563293902-0c8e82f4c4e8?${PKG}`,
   },
   {
      title: 'Fries cartons',
      href: buildCatalogHref({ productType: 'Fast Food Packaging', q: 'fries' }),
      image: `https://images.unsplash.com/photo-1610369848071-ba2689bb9225?${PKG}`,
   },
   {
      title: 'Takeout bags',
      href: buildCatalogHref({ productType: 'Fast Food Packaging', q: 'takeout' }),
      image: `https://images.unsplash.com/photo-1607083206869-4bb07c11dbb0?${PKG}`,
   },
] as const

/** Homepage showcase tiles → filtered catalog (not random single PDPs) */
export const SHOWCASE_TILES = [
   {
      title: 'Fast food packaging',
      href: buildCatalogHref({ productType: 'Fast Food Packaging' }),
      image: `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?${PKG}`,
      imageClassName: 'object-center',
   },
   {
      title: 'Pizza boxes',
      href: buildCatalogHref({ productType: 'Fast Food Packaging', q: 'pizza' }),
      image: `https://images.unsplash.com/photo-1604719312566-8912f0863e2c?${PKG}`,
   },
   {
      title: 'Burger boxes',
      href: buildCatalogHref({ productType: 'Fast Food Packaging', q: 'burger' }),
      image: `https://images.unsplash.com/photo-1563293902-0c8e82f4c4e8?${PKG}`,
   },
   {
      title: 'T-shirts',
      href: buildCatalogHref({ productType: 'T-Shirts' }),
      image:
         'https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1200&auto=format&fit=crop',
      imageClassName: 'object-top',
   },
   {
      title: 'Bags',
      href: buildCatalogHref({ productType: 'Bags' }),
      image:
         'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop',
      imageClassName: 'object-top',
   },
   {
      title: 'Coffee mugs',
      href: buildCatalogHref({ productType: 'Drinkware' }),
      image:
         'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=900&auto=format&fit=crop',
   },
   {
      title: 'Embroidered shirts',
      href: buildCatalogHref({ productType: 'T-Shirts' }),
      image:
         'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?q=80&w=900&auto=format&fit=crop',
   },
   {
      title: 'Stickers',
      href: buildCatalogHref({ productType: 'Packaging' }),
      image:
         'https://images.unsplash.com/photo-1601593346740-925612772716?q=80&w=900&auto=format&fit=crop',
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
      image:
         'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop',
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
      image:
         'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=900&auto=format&fit=crop',
   },
   {
      title: 'Accessories',
      href: buildCatalogHref({ productType: 'Accessories' }),
      image:
         'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=900&auto=format&fit=crop',
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
