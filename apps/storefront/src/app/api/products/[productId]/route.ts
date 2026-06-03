import { getCatalogProduct } from '@/lib/catalog'
import { NextResponse } from 'next/server'

export async function GET(
   _req: Request,
   { params }: { params: { productId: string } }
) {
   try {
      if (!params.productId) {
         return new NextResponse('Product id is required', { status: 400 })
      }

      const product = await getCatalogProduct(params.productId)

      if (!product) {
         return new NextResponse('Product not found', { status: 404 })
      }

      return NextResponse.json(product)
   } catch (error) {
      console.error('[PRODUCT_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
