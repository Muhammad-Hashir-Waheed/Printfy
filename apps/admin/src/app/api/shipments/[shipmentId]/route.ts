import { DomainFulfillmentError, updateShipmentStatus } from '@domain-fulfillment'
import prisma from '@/lib/prisma'
import { ShipmentStatusEnum } from '@prisma/client'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const patchShipmentSchema = z.object({
   status: z.nativeEnum(ShipmentStatusEnum),
   source: z.enum(['admin', 'system']).optional().default('admin'),
})

export async function GET(
   req: Request,
   { params }: { params: { shipmentId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

      const shipment = await prisma.shipment.findUnique({
         where: { id: params.shipmentId },
         include: { trackingEvents: { orderBy: { timestamp: 'desc' } } },
      })
      if (!shipment) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

      return NextResponse.json({ success: true, data: shipment })
   } catch (error) {
      console.error('[SHIPMENT_GET]', error)
      return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
   }
}

export async function PATCH(
   req: Request,
   { params }: { params: { shipmentId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

      const payload = patchShipmentSchema.parse(await req.json())
      const shipment = await updateShipmentStatus({
         prisma,
         shipmentId: params.shipmentId,
         status: payload.status,
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
         const status = error.code === 'SHIPMENT_NOT_FOUND' ? 404 : 400
         return NextResponse.json({ success: false, error: error.code }, { status })
      }

      console.error('[SHIPMENT_PATCH]', error)
      return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
   }
}
