import { listVisibleProductReviews } from '@/lib/product-reviews'
import { Star } from 'lucide-react'

export async function ProductReviews({ productId }: { productId: string }) {
   const reviews = await listVisibleProductReviews(productId)

   if (!reviews.length) return null

   return (
      <section className="mt-10 space-y-4 rounded-2xl border bg-card p-6">
         <h2 className="typo-card-title">Customer reviews</h2>
         <div className="space-y-4">
            {reviews.map((review) => (
               <article key={review.id} className="rounded-xl border p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                     <p className="text-sm font-medium">
                        {review.customerName || 'Customer'}
                     </p>
                     <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, index) => (
                           <Star
                              key={index}
                              className={
                                 index < review.rating
                                    ? 'h-4 w-4 fill-amber-400 text-amber-400'
                                    : 'h-4 w-4 text-muted-foreground'
                              }
                           />
                        ))}
                     </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.text}</p>
               </article>
            ))}
         </div>
      </section>
   )
}
