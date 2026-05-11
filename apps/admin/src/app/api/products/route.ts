import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const productCreateSchema = z.object({
   title: z.string().min(1),
   description: z.string().optional(),
   images: z
      .array(z.union([z.string(), z.object({ url: z.string().min(1) })]))
      .default([]),
   price: z.coerce.number().min(0),
   discount: z.coerce.number().min(0).default(0),
   stock: z.coerce.number().int().min(0).default(0),
   categoryId: z.string().min(1),
   brandId: z.string().optional(),
   isFeatured: z.boolean().optional(),
   isAvailable: z.boolean().optional(),
   isCustomizable: z.boolean().optional(),
})

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const rawBody = await req.json()
      const payload = rawBody?.data ?? rawBody
      const parsed = productCreateSchema.parse(payload)
      const brands = await prisma.brand.findMany({
         select: { id: true },
         take: 1,
      })
      const brandId = parsed.brandId ?? brands[0]?.id
      if (!brandId) {
         return new NextResponse('A brand must exist before creating products', {
            status: 400,
         })
      }

      const normalizedImages = parsed.images.map((item) =>
         typeof item === 'string' ? item : item.url
      )

      const product = await prisma.product.create({
         data: {
            title: parsed.title,
            description: parsed.description,
            images: normalizedImages,
            keywords: [],
            price: parsed.price,
            discount: parsed.discount,
            stock: parsed.stock,
            isFeatured: parsed.isFeatured ?? false,
            isAvailable: parsed.isAvailable ?? false,
            brand: {
               connect: { id: brandId },
            },
            categories: {
               connect: { id: parsed.categoryId },
            },
            metadata: {
               isCustomizable: parsed.isCustomizable ?? true,
            },
         },
      })

      return NextResponse.json(product)
   } catch (error) {
      console.error('[PRODUCTS_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const { searchParams } = new URL(req.url)
      const categoryId = searchParams.get('categoryId') || undefined
      const isFeatured = searchParams.get('isFeatured')

      const products = await prisma.product.findMany()

      return NextResponse.json(products)
   } catch (error) {
      console.error('[PRODUCTS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
