import { DUMMY_BRANDS, DUMMY_CATEGORIES } from '@/lib/catalog-dummy'
import { PACKAGING_CATEGORY_TITLES } from '@/lib/catalog-navigation'
import { getOfflineCatalogProducts } from '@/lib/catalog-offline'
import { Suspense } from 'react'

import { ProductsCatalogView } from './components/products-catalog-view'

/** Static shell + client filters (same pattern as /products/gallery — stable on Vercel) */
export default function ProductsPage() {
   const allProducts = getOfflineCatalogProducts()
   const categories = DUMMY_CATEGORIES.filter((category) =>
      (PACKAGING_CATEGORY_TITLES as readonly string[]).includes(category.title)
   )

   return (
      <Suspense
         fallback={
            <p className="py-8 text-sm text-muted-foreground">Loading catalog…</p>
         }
      >
         <ProductsCatalogView
            allProducts={allProducts}
            categories={categories}
            brands={DUMMY_BRANDS}
         />
      </Suspense>
   )
}
