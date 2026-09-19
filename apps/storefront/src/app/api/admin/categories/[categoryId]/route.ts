import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'


export const dynamic = 'force-dynamic'
export async function GET(
   req: Request,
   { params }: { params: { categoryId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!params.categoryId) {
         return new NextResponse('Category id is required', { status: 400 })
      }

      const category = await prisma.category.findUnique({
         where: { id: params.categoryId },
      })

      return NextResponse.json(category)
   } catch (error) {
      console.error('[CATEGORY_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: { categoryId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!params.categoryId) {
         return new NextResponse('Category id is required', { status: 400 })
      }

      await prisma.category.update({
         where: { id: params.categoryId },
         data: {
            products: { set: [] },
            banners: { set: [] },
         },
      })

      const category = await prisma.category.delete({
         where: { id: params.categoryId },
      })

      return NextResponse.json(category)
   } catch (error) {
      console.error('[CATEGORY_DELETE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function PATCH(
   req: Request,
   { params }: { params: { categoryId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const body = await req.json()
      const title = String(body.title ?? '').trim()
      const description = String(body.description ?? '').trim() || null

      if (!title) {
         return new NextResponse('Name is required', { status: 400 })
      }

      if (!params.categoryId) {
         return new NextResponse('Category id is required', { status: 400 })
      }

      const updatedCategory = await prisma.category.update({
         where: { id: params.categoryId },
         data: { title, description },
      })

      return NextResponse.json(updatedCategory)
   } catch (error) {
      console.error('[CATEGORY_PATCH]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
