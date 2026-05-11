'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { OrderWithIncludes } from '@/types/prisma'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'

const statusOrder = ['pending', 'printing', 'packed', 'shipped', 'delivered'] as const
const taskByStatus = {
   pending: 'print',
   printing: 'pack',
   packed: 'ship',
   shipped: null,
   delivered: null,
} as const

export function FulfillmentPanel({ order }: { order: OrderWithIncludes }) {
   const router = useRouter()
   const [loading, setLoading] = useState(false)

   const nextTaskType = taskByStatus[(order.fulfillmentStatus as keyof typeof taskByStatus) ?? 'pending']
   const nextTask = useMemo(
      () =>
         nextTaskType
            ? order.fulfillmentTasks.find(
                 (task) => task.type === nextTaskType && task.status !== 'completed'
              )
            : null,
      [order.fulfillmentTasks, nextTaskType]
   )

   async function completeNextTask() {
      if (!nextTask) return
      try {
         setLoading(true)
         const response = await fetch('/api/fulfillment/tasks', {
            method: 'PATCH',
            cache: 'no-store',
            body: JSON.stringify({ taskId: nextTask.id, source: 'admin' }),
         })

         if (!response.ok) {
            const json = await response.json().catch(() => ({}))
            throw new Error(json?.error ?? 'Failed')
         }

         toast.success('Fulfillment step updated')
         router.refresh()
      } catch (error) {
         toast.error(error instanceof Error ? error.message : 'Failed to update')
      } finally {
         setLoading(false)
      }
   }

   const shipment = order.shipment

   return (
      <div className="my-4 space-y-4 rounded-xl border p-4">
         <div className="flex items-center justify-between">
            <div>
               <p className="text-sm text-muted-foreground">Fulfillment status</p>
               <Badge className="mt-1 rounded-2xl capitalize">{order.fulfillmentStatus}</Badge>
            </div>
            <Button disabled={loading || !nextTask} onClick={completeNextTask}>
               {nextTask ? `Complete ${nextTask.type}` : 'No valid action'}
            </Button>
         </div>

         <div className="flex flex-wrap gap-2">
            {statusOrder.map((status, index) => {
               const currentIndex = statusOrder.indexOf(order.fulfillmentStatus as any)
               const active = index <= currentIndex
               return (
                  <span
                     key={status}
                     className={`rounded-full border px-3 py-1 text-xs capitalize ${active ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                  >
                     {status}
                  </span>
               )
            })}
         </div>

         <div className="space-y-2">
            <p className="text-sm font-semibold">Tasks</p>
            {order.fulfillmentTasks.map((task) => (
               <div key={task.id} className="flex items-center justify-between rounded-lg border p-2 text-sm">
                  <span className="capitalize">{task.type}</span>
                  <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                     {task.status}
                  </Badge>
               </div>
            ))}
         </div>

         {shipment ? (
            <div className="space-y-1 rounded-lg border p-3 text-sm">
               <p className="font-semibold">Shipment</p>
               <p>Carrier: {shipment.carrier}</p>
               <p>Tracking: {shipment.trackingNumber}</p>
               <p>Status: {shipment.status}</p>
            </div>
         ) : (
            <p className="text-sm text-muted-foreground">No shipment created yet.</p>
         )}
      </div>
   )
}
