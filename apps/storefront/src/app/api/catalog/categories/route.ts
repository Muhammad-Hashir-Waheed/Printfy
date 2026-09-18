import { listCatalogCategories } from '@/lib/catalog'
import { NextResponse } from 'next/server'

export async function GET() {
   try {
      const categories = await listCatalogCategories()
      return NextResponse.json(categories)
   } catch (error) {
      console.error('[CATALOG_CATEGORIES]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
