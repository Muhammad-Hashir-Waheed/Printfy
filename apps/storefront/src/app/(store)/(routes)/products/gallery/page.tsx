import { ProductGrid } from '@/components/native/Product'
import { Heading } from '@/components/native/heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getOfflineCatalogProducts } from '@/lib/catalog-offline'
import Link from 'next/link'

import { CategoryBrowseBar } from '../components/category-browse'

/** Full packaging gallery — static list, no query params (stable on Vercel) */
export default function ProductsGalleryPage() {
   const products = getOfflineCatalogProducts()

   return (
      <>
         <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <Heading
               title="All packaging"
               description="Complete gallery of packaging products ready to customize and order."
            />
            <div className="flex flex-wrap gap-2">
               <Badge variant="secondary" className="rounded-2xl">
                  {products.length} products
               </Badge>
               <Button asChild variant="outline" className="rounded-2xl">
                  <Link href="/products">Filter & search</Link>
               </Button>
            </div>
         </div>

         <CategoryBrowseBar />

         <p className="mb-4 text-sm text-muted-foreground">
            Tap a packaging category above to filter, or browse the full grid below.
         </p>

         <div className="min-w-0">
            <ProductGrid products={products as any} />
         </div>
      </>
   )
}
