import {
   completeFulfillmentTask,
   DomainFulfillmentError,
} from '@domain-fulfillment'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const taskUpdateSchema = z.object({
   taskId: z.string().min(1),
   source: z.enum(['admin', 'system']).optional().default('admin'),
})

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

      const { searchParams } = new URL(req.url)
      const orderId = searchParams.get('orderId') ?? undefined

      const tasks = await prisma.fulfillmentTask.findMany({
         where: orderId ? { orderId } : undefined,
         orderBy: [{ createdAt: 'desc' }],
      })

      return NextResponse.json({ success: true, data: tasks })
   } catch (error) {
      console.error('[FULFILLMENT_TASKS_GET]', error)
      return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
   }
}

export async function PATCH(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

      const payload = taskUpdateSchema.parse(await req.json())
      const task = await completeFulfillmentTask({
         prisma,
         taskId: payload.taskId,
         source: payload.source,
      })

      return NextResponse.json({ success: true, data: task })
   } catch (error) {
      if (error instanceof z.ZodError) {
         return NextResponse.json(
            { success: false, error: 'Validation failed', details: error.flatten() },
            { status: 400 }
         )
      }
      if (error instanceof DomainFulfillmentError) {
         const status = error.code === 'TASK_NOT_FOUND' ? 404 : 400
         return NextResponse.json({ success: false, error: error.code }, { status })
      }

      console.error('[FULFILLMENT_TASKS_PATCH]', error)
      return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
   }
}
