import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
   req: Request,
   { params }: { params: { addressId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!params.addressId) {
         return new NextResponse('addressId is required', { status: 400 })
      }

      const address = await prisma.address.findUniqueOrThrow({
         where: {
            userId,
            id: params.addressId,
         },
      })

      return NextResponse.json(address)
   } catch (error) {
      console.error('[ADDRESS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function PATCH(
   req: Request,
   { params }: { params: { addressId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!params.addressId) {
         return new NextResponse('addressId is required', { status: 400 })
      }

      const { address, city, phone, postalCode } = await req.json()

      const { count } = await prisma.address.updateMany({
         where: {
            userId,
            id: params.addressId,
         },
         data: {
            city,
            address,
            phone,
            postalCode,
         },
      })

      if (count === 0) {
         return new NextResponse('Address not found', { status: 404 })
      }

      return NextResponse.json({ id: params.addressId })
   } catch (error) {
      console.error('[ADDRESS_PATCH]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: { addressId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!params.addressId) {
         return new NextResponse('addressId is required', { status: 400 })
      }

      const { count } = await prisma.address.deleteMany({
         where: {
            userId,
            id: params.addressId,
         },
      })

      if (count === 0) {
         return new NextResponse('Address not found', { status: 404 })
      }

      return NextResponse.json({ id: params.addressId })
   } catch (error) {
      console.error('[ADDRESS_DELETE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
