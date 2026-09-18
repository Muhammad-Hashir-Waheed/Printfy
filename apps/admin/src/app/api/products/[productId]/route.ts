import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
   req: Request,
   { params }: { params: { productId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!params.productId) {
         return new NextResponse('Product id is required', { status: 400 })
      }

      const product = await prisma.product.findUniqueOrThrow({
         where: {
            id: params.productId,
         },
      })

      return NextResponse.json(product)
   } catch (error) {
      console.error('[PRODUCT_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: { productId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const product = await prisma.product.delete({
         where: {
            id: params.productId,
         },
      })

      return NextResponse.json(product)
   } catch (error) {
      console.error('[PRODUCT_DELETE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function PATCH(
   req: Request,
   { params }: { params: { productId: string } }
) {
   try {
      if (!params.productId) {
         return new NextResponse('Product Id is required', { status: 400 })
      }

      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const body = await req.json()
      const payload = body.data ?? body
      const {
         title,
         description,
         images,
         price,
         discount,
         stock,
         categoryId,
         brandId,
         isFeatured,
         isAvailable,
         isCustomizable,
      } = payload

      const existing = await prisma.product.findUnique({
         where: { id: params.productId },
      })

      const normalizedImages = Array.isArray(images)
         ? images.map((item: string | { url: string }) =>
              typeof item === 'string' ? item : item.url
           ).filter(Boolean)
         : existing?.images ?? []

      const metadata = {
         ...((existing as any)?.metadata ?? {}),
         isCustomizable: Boolean(isCustomizable),
      }

      const product = await prisma.product.update({
         where: {
            id: params.productId,
         },
         data: {
            title,
            description,
            images: normalizedImages,
            price,
            discount,
            stock,
            isFeatured,
            isAvailable,
            metadata,
            ...(brandId ? { brand: { connect: { id: brandId } } } : {}),
            ...(categoryId
               ? { categories: { set: [{ id: categoryId }] } }
               : {}),
         },
      })

      return NextResponse.json(product)
   } catch (error) {
      console.error('[PRODUCT_PATCH]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
