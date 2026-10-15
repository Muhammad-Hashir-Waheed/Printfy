import { NextResponse } from 'next/server'
import { z } from 'zod'

import { deleteAdminReview, updateAdminReview } from '@/lib/product-reviews'

export const dynamic = 'force-dynamic'

const reviewSchema = z.object({
   productId: z.string().min(1),
   customerName: z.string().min(1, 'Name is required'),
   text: z.string().min(1, 'Review is required'),
   rating: z.coerce.number().int().min(1).max(5),
   isVisible: z.boolean().optional(),
})

export async function PATCH(
   req: Request,
   { params }: { params: { reviewId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse('Unauthorized', { status: 401 })
      if (!params.reviewId) {
         return new NextResponse('Review id is required', { status: 400 })
      }

      const parsed = reviewSchema.parse(await req.json())
      const review = await updateAdminReview(params.reviewId, {
         productId: parsed.productId,
         customerName: parsed.customerName.trim(),
         text: parsed.text.trim(),
         rating: parsed.rating,
         isVisible: parsed.isVisible ?? true,
      })
      return NextResponse.json(review)
   } catch (error) {
      console.error('[REVIEW_PATCH]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: { reviewId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse('Unauthorized', { status: 401 })
      if (!params.reviewId) {
         return new NextResponse('Review id is required', { status: 400 })
      }

      await deleteAdminReview(params.reviewId)
      return NextResponse.json({ ok: true })
   } catch (error) {
      console.error('[REVIEW_DELETE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
