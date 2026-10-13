import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createAdminReview, listAdminReviews } from '@/lib/product-reviews'

export const dynamic = 'force-dynamic'

const reviewSchema = z.object({
   productId: z.string().min(1),
   customerName: z.string().min(1, 'Name is required'),
   text: z.string().min(1, 'Review is required'),
   rating: z.coerce.number().int().min(1).max(5),
   isVisible: z.boolean().optional(),
})

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse('Unauthorized', { status: 401 })
      return NextResponse.json(await listAdminReviews())
   } catch (error) {
      console.error('[REVIEWS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse('Unauthorized', { status: 401 })

      const parsed = reviewSchema.parse(await req.json())
      const review = await createAdminReview({
         productId: parsed.productId,
         customerName: parsed.customerName.trim(),
         text: parsed.text.trim(),
         rating: parsed.rating,
         isVisible: parsed.isVisible ?? true,
      })
      return NextResponse.json(review)
   } catch (error) {
      console.error('[REVIEWS_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
