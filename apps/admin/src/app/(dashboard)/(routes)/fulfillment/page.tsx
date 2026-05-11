import { Badge } from '@/components/ui/badge'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import prisma from '@/lib/prisma'

export default async function FulfillmentPage() {
   const [tasks, shipments] = await Promise.all([
      prisma.fulfillmentTask.findMany({
         include: { order: { select: { number: true, fulfillmentStatus: true } } },
         orderBy: { updatedAt: 'desc' },
         take: 20,
      }),
      prisma.shipment.findMany({
         include: { order: { select: { number: true } }, trackingEvents: true },
         orderBy: { updatedAt: 'desc' },
         take: 20,
      }),
   ])

   return (
      <div className="my-6 space-y-4">
         <Heading
            title="Fulfillment"
            description="Tasks, shipment status, and tracking timeline."
         />
         <Separator />

         <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2 rounded-xl border p-4">
               <h3 className="text-sm font-semibold">Recent Tasks</h3>
               {tasks.map((task) => (
                  <div
                     key={task.id}
                     className="flex items-center justify-between rounded-lg border p-2 text-sm"
                  >
                     <div>
                        <p>Order #{task.order.number}</p>
                        <p className="text-xs text-muted-foreground capitalize">{task.type}</p>
                     </div>
                     <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                        {task.status}
                     </Badge>
                  </div>
               ))}
            </div>

            <div className="space-y-2 rounded-xl border p-4">
               <h3 className="text-sm font-semibold">Recent Shipments</h3>
               {shipments.map((shipment) => (
                  <div key={shipment.id} className="rounded-lg border p-3 text-sm">
                     <div className="flex items-center justify-between">
                        <p>Order #{shipment.order.number}</p>
                        <Badge className="capitalize">{shipment.status}</Badge>
                     </div>
                     <p className="mt-1 text-xs text-muted-foreground">
                        {shipment.carrier} - {shipment.trackingNumber}
                     </p>
                     <p className="mt-2 text-xs">Events: {shipment.trackingEvents.length}</p>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}
