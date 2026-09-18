import { listAllCatalogProducts, listCatalogBrands, listCatalogCategories } from '@/lib/catalog'
import { Suspense } from 'react'

import { ProductsCatalogView } from './components/products-catalog-view'

export default async function ProductsPage() {
   const [allProducts, categories, brands] = await Promise.all([
      listAllCatalogProducts(),
      listCatalogCategories(),
      listCatalogBrands(),
   ])

   return (
      <Suspense
         fallback={
            <p className="py-8 text-sm text-muted-foreground">Loading catalog…</p>
         }
      >
         <ProductsCatalogView
            allProducts={allProducts}
            categories={categories}
            brands={brands}
         />
      </Suspense>
   )
}
