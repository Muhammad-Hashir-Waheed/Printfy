import { listAllCatalogProducts } from '@/lib/catalog'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
   try {
      const products = await listAllCatalogProducts()
      return NextResponse.json(products)
   } catch (error) {
      console.error('[PRODUCTS_LIST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
