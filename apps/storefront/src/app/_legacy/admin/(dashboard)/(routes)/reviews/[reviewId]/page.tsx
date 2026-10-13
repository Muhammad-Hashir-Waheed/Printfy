import prisma from '@/lib/prisma'
import { getAdminReview } from '@/lib/product-reviews'

import { ReviewForm } from './components/review-form'

export default async function ReviewPage({
   params,
}: {
   params: { reviewId: string }
}) {
   const review =
      params.reviewId === 'new' ? null : await getAdminReview(params.reviewId)

   const products = await prisma.product.findMany({
      orderBy: { title: 'asc' },
      select: { id: true, title: true },
   })

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 pb-12 pt-6">
            <ReviewForm initialData={review} products={products} />
         </div>
      </div>
   )
}
