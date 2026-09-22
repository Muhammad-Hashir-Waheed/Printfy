import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { listAdminReviews } from '@/lib/product-reviews'
import { Plus } from 'lucide-react'
import Link from 'next/link'

import { ReviewsTable, ReviewColumn } from './components/table'

export default async function ReviewsPage() {
   const reviews = await listAdminReviews()

   const formattedReviews: ReviewColumn[] = reviews.map((review) => ({
      id: review.id,
      product: review.productTitle,
      customerName: review.customerName || 'Customer',
      rating: review.rating,
      text: review.text,
      isVisible: review.isVisible,
   }))

   return (
      <div className="my-6 block space-y-4">
         <div className="flex items-center justify-between">
            <Heading
               title={`Reviews (${reviews.length})`}
               description="Customer reviews shown on product pages"
            />
            <Link href="/admin/reviews/new">
               <Button>
                  <Plus className="mr-2 h-4" /> Add New
               </Button>
            </Link>
         </div>
         <Separator />
         <ReviewsTable data={formattedReviews} />
      </div>
   )
}
