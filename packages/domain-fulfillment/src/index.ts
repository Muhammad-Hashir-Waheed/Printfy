import type { Prisma, PrismaClient } from '@prisma/client'
import {
   FulfillmentStatusEnum,
   FulfillmentTaskStatusEnum,
   FulfillmentTaskTypeEnum,
   ShipmentStatusEnum,
} from '@prisma/client'

export class DomainFulfillmentError extends Error {
   code:
      | 'INVALID_TRANSITION'
      | 'TASK_NOT_FOUND'
      | 'ORDER_NOT_FOUND'
      | 'SHIPMENT_ALREADY_EXISTS'
      | 'SHIPMENT_NOT_FOUND'
      | 'DUPLICATE_TRACKING_EVENT'

   constructor(code: DomainFulfillmentError['code']) {
      super(code)
      this.code = code
   }
}

const ALLOWED_TRANSITIONS: Record<FulfillmentStatusEnum, FulfillmentStatusEnum[]> = {
   pending: ['printing'],
   printing: ['packed'],
   packed: ['shipped'],
   shipped: ['delivered'],
   delivered: [],
}

export function validateTransition(
   current: FulfillmentStatusEnum,
   next: FulfillmentStatusEnum
) {
   return ALLOWED_TRANSITIONS[current]?.includes(next) ?? false
}

type EventSource = 'system' | 'admin'

async function logFulfillmentEvent(
   tx: Prisma.TransactionClient,
   {
      orderId,
      type,
      source,
      statusBefore,
      statusAfter,
      payload,
   }: {
      orderId: string
      type: string
      source: EventSource
      statusBefore?: string | null
      statusAfter?: string | null
      payload?: Prisma.InputJsonValue
   }
) {
   await tx.fulfillmentEvent.create({
      data: {
         orderId,
         type,
         source,
         statusBefore: statusBefore ?? null,
         statusAfter: statusAfter ?? null,
         payload,
      },
   })
}

export async function initializeOrderFulfillment(
   tx: Prisma.TransactionClient,
   orderId: string
) {
   await tx.fulfillmentTask.createMany({
      data: [
         { orderId, type: FulfillmentTaskTypeEnum.print, status: FulfillmentTaskStatusEnum.pending },
         { orderId, type: FulfillmentTaskTypeEnum.pack, status: FulfillmentTaskStatusEnum.pending },
         { orderId, type: FulfillmentTaskTypeEnum.ship, status: FulfillmentTaskStatusEnum.pending },
      ],
      skipDuplicates: true,
   })

   await logFulfillmentEvent(tx, {
      orderId,
      type: 'tasks_initialized',
      source: 'system',
      statusBefore: null,
      statusAfter: FulfillmentStatusEnum.pending,
   })
}

async function updateOrderFulfillmentStatusInternal(
   tx: Prisma.TransactionClient,
   {
      orderId,
      nextStatus,
      source,
      reason,
   }: {
      orderId: string
      nextStatus: FulfillmentStatusEnum
      source: EventSource
      reason: string
   }
) {
   const order = await tx.order.findUnique({
      where: { id: orderId },
      select: { id: true, fulfillmentStatus: true },
   })
   if (!order) throw new DomainFulfillmentError('ORDER_NOT_FOUND')

   if (order.fulfillmentStatus === nextStatus) return order
   if (!validateTransition(order.fulfillmentStatus, nextStatus)) {
      throw new DomainFulfillmentError('INVALID_TRANSITION')
   }

   const updated = await tx.order.update({
      where: { id: orderId },
      data: { fulfillmentStatus: nextStatus },
   })

   await logFulfillmentEvent(tx, {
      orderId,
      type: reason,
      source,
      statusBefore: order.fulfillmentStatus,
      statusAfter: nextStatus,
   })

   return updated
}

export async function completeFulfillmentTask({
   prisma,
   taskId,
   source = 'admin',
}: {
   prisma: PrismaClient
   taskId: string
   source?: EventSource
}) {
   return prisma.$transaction(async (tx) => {
      const task = await tx.fulfillmentTask.findUnique({
         where: { id: taskId },
         include: { order: { select: { id: true, fulfillmentStatus: true } } },
      })
      if (!task) throw new DomainFulfillmentError('TASK_NOT_FOUND')

      const before = task.status
      if (before !== FulfillmentTaskStatusEnum.completed) {
         await tx.fulfillmentTask.update({
            where: { id: taskId },
            data: { status: FulfillmentTaskStatusEnum.completed },
         })
      }

      await logFulfillmentEvent(tx, {
         orderId: task.orderId,
         type: 'task_completed',
         source,
         statusBefore: before,
         statusAfter: FulfillmentTaskStatusEnum.completed,
         payload: { taskId, taskType: task.type },
      })

      const nextStatusByTask: Partial<Record<FulfillmentTaskTypeEnum, FulfillmentStatusEnum>> = {
         print: FulfillmentStatusEnum.printing,
         pack: FulfillmentStatusEnum.packed,
         ship: FulfillmentStatusEnum.shipped,
      }
      const nextStatus = nextStatusByTask[task.type]
      if (!nextStatus) return task

      await updateOrderFulfillmentStatusInternal(tx, {
         orderId: task.orderId,
         nextStatus,
         source,
         reason: 'order_status_transition',
      })

      return tx.fulfillmentTask.findUnique({ where: { id: taskId } })
   })
}

export async function createShipment({
   prisma,
   orderId,
   carrier,
   trackingNumber,
   source = 'admin',
}: {
   prisma: PrismaClient
   orderId: string
   carrier: string
   trackingNumber: string
   source?: EventSource
}) {
   return prisma.$transaction(async (tx) => {
      const existing = await tx.shipment.findUnique({ where: { orderId } })
      if (existing) throw new DomainFulfillmentError('SHIPMENT_ALREADY_EXISTS')

      const shipment = await tx.shipment.create({
         data: {
            orderId,
            carrier,
            trackingNumber,
            status: ShipmentStatusEnum.shipped,
            shippedAt: new Date(),
         },
      })

      await logFulfillmentEvent(tx, {
         orderId,
         type: 'shipment_created',
         source,
         statusBefore: null,
         statusAfter: shipment.status,
         payload: { shipmentId: shipment.id, trackingNumber },
      })

      await updateOrderFulfillmentStatusInternal(tx, {
         orderId,
         nextStatus: FulfillmentStatusEnum.shipped,
         source,
         reason: 'shipment_created',
      })

      return shipment
   })
}

export async function addTrackingEvent({
   prisma,
   shipmentId,
   status,
   location,
   timestamp,
   source = 'system',
}: {
   prisma: PrismaClient
   shipmentId: string
   status: string
   location: string
   timestamp: Date
   source?: EventSource
}) {
   return prisma.$transaction(async (tx) => {
      const shipment = await tx.shipment.findUnique({
         where: { id: shipmentId },
         select: { id: true, orderId: true, status: true },
      })
      if (!shipment) throw new DomainFulfillmentError('SHIPMENT_NOT_FOUND')

      const duplicate = await tx.trackingEvent.findUnique({
         where: {
            UniqueTrackingEvent: {
               shipmentId,
               status,
               location,
               timestamp,
            },
         },
      })
      if (duplicate) {
         throw new DomainFulfillmentError('DUPLICATE_TRACKING_EVENT')
      }

      const event = await tx.trackingEvent.create({
         data: {
            shipmentId,
            status,
            location,
            timestamp,
         },
      })

      await logFulfillmentEvent(tx, {
         orderId: shipment.orderId,
         type: 'tracking_event_added',
         source,
         statusBefore: shipment.status,
         statusAfter: status,
         payload: { shipmentId, status, location, timestamp },
      })

      return event
   })
}

export async function updateShipmentStatus({
   prisma,
   shipmentId,
   status,
   source = 'admin',
}: {
   prisma: PrismaClient
   shipmentId: string
   status: ShipmentStatusEnum
   source?: EventSource
}) {
   return prisma.$transaction(async (tx) => {
      const shipment = await tx.shipment.findUnique({
         where: { id: shipmentId },
         include: { order: { select: { id: true, fulfillmentStatus: true } } },
      })
      if (!shipment) throw new DomainFulfillmentError('SHIPMENT_NOT_FOUND')

      const beforeStatus = shipment.status
      const updated = await tx.shipment.update({
         where: { id: shipmentId },
         data: {
            status,
            ...(status === ShipmentStatusEnum.delivered ? { deliveredAt: new Date() } : {}),
         },
      })

      await logFulfillmentEvent(tx, {
         orderId: shipment.orderId,
         type: 'shipment_status_updated',
         source,
         statusBefore: beforeStatus,
         statusAfter: status,
         payload: { shipmentId },
      })

      if (status === ShipmentStatusEnum.delivered) {
         await updateOrderFulfillmentStatusInternal(tx, {
            orderId: shipment.orderId,
            nextStatus: FulfillmentStatusEnum.delivered,
            source,
            reason: 'shipment_delivered',
         })
      }

      return updated
   })
}

const STEP_DELAY_MS = 1200

function runStep(
   fn: () => Promise<void>,
   delay: number
) {
   setTimeout(async () => {
      try {
         await fn()
      } catch (error) {
         console.error('[FULFILLMENT_STEP_ERROR]', error)
      }
   }, delay)
}

export function processOrderAsync({
   prisma,
   orderId,
}: {
   prisma: PrismaClient
   orderId: string
}) {
   runStep(async () => {
      const task = await prisma.fulfillmentTask.findUnique({
         where: {
            UniqueOrderFulfillmentTaskType: {
               orderId,
               type: FulfillmentTaskTypeEnum.print,
            },
         },
      })
      if (task) await completeFulfillmentTask({ prisma, taskId: task.id, source: 'system' })
   }, STEP_DELAY_MS)

   runStep(async () => {
      const task = await prisma.fulfillmentTask.findUnique({
         where: {
            UniqueOrderFulfillmentTaskType: {
               orderId,
               type: FulfillmentTaskTypeEnum.pack,
            },
         },
      })
      if (task) await completeFulfillmentTask({ prisma, taskId: task.id, source: 'system' })
   }, STEP_DELAY_MS * 2)

   runStep(async () => {
      const task = await prisma.fulfillmentTask.findUnique({
         where: {
            UniqueOrderFulfillmentTaskType: {
               orderId,
               type: FulfillmentTaskTypeEnum.ship,
            },
         },
      })
      if (task) await completeFulfillmentTask({ prisma, taskId: task.id, source: 'system' })

      const hasShipment = await prisma.shipment.findUnique({ where: { orderId } })
      if (!hasShipment) {
         const trackingNumber = `MOCK-${Date.now()}-${orderId.slice(-6).toUpperCase()}`
         const shipment = await createShipment({
            prisma,
            orderId,
            carrier: 'MockCarrier',
            trackingNumber,
            source: 'system',
         })
         await addTrackingEvent({
            prisma,
            shipmentId: shipment.id,
            status: 'shipped',
            location: 'Fulfillment Center',
            timestamp: new Date(),
            source: 'system',
         })
      }
   }, STEP_DELAY_MS * 3)
}
