import { createShipment, DomainFulfillmentError } from '@domain-fulfillment'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const createShipmentSchema = z.object({
   orderId: z.string().min(1),
   carrier: z.string().min(1),
   trackingNumber: z.string().min(1),
   source: z.enum(['admin', 'system']).optional().default('admin'),
})

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

      const { searchParams } = new URL(req.url)
      const orderId = searchParams.get('orderId') ?? undefined

      const shipments = await prisma.shipment.findMany({
         where: orderId ? { orderId } : undefined,
         include: { trackingEvents: { orderBy: { timestamp: 'desc' } } },
         orderBy: { createdAt: 'desc' },
      })

      return NextResponse.json({ success: true, data: shipments })
   } catch (error) {
      console.error('[SHIPMENTS_GET]', error)
      return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
   }
}

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

      const payload = createShipmentSchema.parse(await req.json())
      const shipment = await createShipment({
         prisma,
         orderId: payload.orderId,
         carrier: payload.carrier,
         trackingNumber: payload.trackingNumber,
         source: payload.source,
      })

      return NextResponse.json({ success: true, data: shipment })
   } catch (error) {
      if (error instanceof z.ZodError) {
         return NextResponse.json(
            { success: false, error: 'Validation failed', details: error.flatten() },
            { status: 400 }
         )
      }
      if (error instanceof DomainFulfillmentError) {
         const status = error.code === 'SHIPMENT_ALREADY_EXISTS' ? 409 : 400
         return NextResponse.json({ success: false, error: error.code }, { status })
      }

      console.error('[SHIPMENTS_POST]', error)
      return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
   }
}
