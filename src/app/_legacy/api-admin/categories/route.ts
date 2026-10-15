import prisma from '@/lib/prisma'
import { setCategoryImage } from '@/lib/category-image'
import { NextResponse } from 'next/server'


export const dynamic = 'force-dynamic'
export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const body = await req.json()
      const title = String(body.title ?? '').trim()
      const description = String(body.description ?? '').trim() || null
      const image = String(body.image ?? '').trim() || null

      if (!title) {
         return new NextResponse('Name is required', { status: 400 })
      }

      const category = await prisma.category.create({
         data: { title, description },
      })
      await setCategoryImage(category.id, image)
      return NextResponse.json({ ...category, image })
   } catch (error) {
      console.error('[CATEGORIES_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function GET() {
   try {
      const categories = await prisma.category.findMany({
         orderBy: { title: 'asc' },
      })

      return NextResponse.json(categories)
   } catch (error) {
      console.error('[CATEGORIES_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
