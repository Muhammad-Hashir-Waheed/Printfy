import { DUMMY_BRANDS, DUMMY_CATEGORIES } from '@/lib/catalog-dummy'
import { getOfflineCatalogProducts } from '@/lib/catalog-offline'
import { Suspense } from 'react'

import { ProductsCatalogView } from './components/products-catalog-view'

/** Static shell + client filters (same pattern as /products/gallery — stable on Vercel) */
export default function ProductsPage() {
   const allProducts = getOfflineCatalogProducts()

   return (
      <Suspense
         fallback={
            <p className="py-8 text-sm text-muted-foreground">Loading catalog…</p>
         }
      >
         <ProductsCatalogView
            allProducts={allProducts}
            categories={DUMMY_CATEGORIES}
            brands={DUMMY_BRANDS}
         />
      </Suspense>
   )
}
