import { ProductCard } from '@/components/native/ProductCard'
import { Separator } from '@/components/native/separator'
import { getRelatedProducts, type CatalogProduct } from '@/lib/catalog'

export async function RelatedProducts({ product }: { product: CatalogProduct }) {
   let related: CatalogProduct[] = []

   try {
      related = await getRelatedProducts(product, 4)
   } catch (error) {
      console.error('[RELATED_PRODUCTS]', error)
      return null
   }

   if (!related.length) return null

   return (
      <section className="mt-12">
         <Separator className="mb-6" />
         <h2 className="mb-2 text-2xl font-semibold">You may also like</h2>
         <p className="mb-6 text-sm text-muted-foreground">
            Similar items from the same category.
         </p>
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
               <ProductCard key={item.id} product={item as any} />
            ))}
         </div>
      </section>
   )
}
