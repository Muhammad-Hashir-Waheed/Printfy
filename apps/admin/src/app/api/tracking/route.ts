import { addTrackingEvent, DomainFulfillmentError } from '@domain-fulfillment'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const trackingSchema = z.object({
   shipmentId: z.string().min(1),
   status: z.string().min(1),
   location: z.string().min(1),
   timestamp: z.coerce.date().optional(),
   source: z.enum(['admin', 'system']).optional().default('admin'),
})

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

      const payload = trackingSchema.parse(await req.json())
      const event = await addTrackingEvent({
         prisma,
         shipmentId: payload.shipmentId,
         status: payload.status,
         location: payload.location,
         timestamp: payload.timestamp ?? new Date(),
         source: payload.source,
      })

      return NextResponse.json({ success: true, data: event })
   } catch (error) {
      if (error instanceof z.ZodError) {
         return NextResponse.json(
            { success: false, error: 'Validation failed', details: error.flatten() },
            { status: 400 }
         )
      }
      if (error instanceof DomainFulfillmentError) {
         const statusByCode = {
            SHIPMENT_NOT_FOUND: 404,
            DUPLICATE_TRACKING_EVENT: 409,
         } as const
         const status = statusByCode[error.code] ?? 400
         return NextResponse.json({ success: false, error: error.code }, { status })
      }

      console.error('[TRACKING_POST]', error)
      return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
   }
}
