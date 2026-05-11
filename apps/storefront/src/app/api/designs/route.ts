import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const designSchema = z.object({
   productId: z.string().min(1),
   designJson: z.any(),
   previewUrl: z.string().optional(),
})

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const { searchParams } = new URL(req.url)
      const productId = searchParams.get('productId')

      if (productId) {
         const design = await prisma.design.findUnique({
            where: {
               UniqueUserProductDesign: {
                  userId,
                  productId,
               },
            },
         })
         return NextResponse.json(design)
      }

      const designs = await prisma.design.findMany({
         where: { userId },
         orderBy: { updatedAt: 'desc' },
      })
      return NextResponse.json(designs)
   } catch (error) {
      console.error('[DESIGNS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const payload = designSchema.parse(await req.json())

      const design = await prisma.design.upsert({
         where: {
            UniqueUserProductDesign: {
               userId,
               productId: payload.productId,
            },
         },
         create: {
            userId,
            productId: payload.productId,
            designJson: payload.designJson,
            previewUrl: payload.previewUrl,
         },
         update: {
            designJson: payload.designJson,
            previewUrl: payload.previewUrl,
         },
      })

      return NextResponse.json(design)
   } catch (error) {
      if (error instanceof z.ZodError) {
         return NextResponse.json(
            { message: 'Invalid design payload', issues: error.issues },
            { status: 400 }
         )
      }

      console.error('[DESIGNS_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function DELETE(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const { searchParams } = new URL(req.url)
      const productId = searchParams.get('productId')
      if (!productId) {
         return new NextResponse('Product id is required', { status: 400 })
      }

      await prisma.design.delete({
         where: {
            UniqueUserProductDesign: {
               userId,
               productId,
            },
         },
      })

      return NextResponse.json({ success: true })
   } catch (error) {
      console.error('[DESIGNS_DELETE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
