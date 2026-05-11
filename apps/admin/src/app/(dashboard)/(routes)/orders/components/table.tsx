'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { CheckIcon, EditIcon, XIcon } from 'lucide-react'
import Link from 'next/link'

interface OrderTableProps {
   data: OrderColumn[]
}

export const OrderTable: React.FC<OrderTableProps> = ({ data }) => {
   return <DataTable searchKey="products" columns={OrderColumns} data={data} />
}

export type OrderColumn = {
   id: string
   isPaid: boolean
   payable: string
   number: string
   createdAt: string
   fulfillmentStatus: 'pending' | 'printing' | 'packed' | 'shipped' | 'delivered'
   hasCustomizedProduct: boolean
   previewImage?: string
}

export const OrderColumns: ColumnDef<OrderColumn>[] = [
   {
      accessorKey: 'number',
      header: 'Order Number',
   },
   {
      accessorKey: 'date',
      header: 'Date',
   },
   {
      accessorKey: 'payable',
      header: 'Payable',
   },
   {
      accessorKey: 'fulfillmentStatus',
      header: 'Fulfillment',
      cell: ({ row }) => {
         const status = row.original.fulfillmentStatus
         const classes: Record<string, string> = {
            pending: 'bg-slate-100 text-slate-700',
            printing: 'bg-blue-100 text-blue-700',
            packed: 'bg-amber-100 text-amber-700',
            shipped: 'bg-violet-100 text-violet-700',
            delivered: 'bg-emerald-100 text-emerald-700',
         }
         return (
            <Badge className={`rounded-2xl border-0 ${classes[status] ?? ''}`}>
               {status}
            </Badge>
         )
      },
   },
   {
      accessorKey: 'isPaid',
      header: 'Paid',
      cell: (props) => (props.cell.getValue() ? <CheckIcon /> : <XIcon />),
   },
   {
      accessorKey: 'hasCustomizedProduct',
      header: 'Custom',
      cell: ({ row }) =>
         row.original.hasCustomizedProduct ? (
            <Badge className="rounded-2xl">Customized</Badge>
         ) : (
            <Badge variant="secondary" className="rounded-2xl">
               Standard
            </Badge>
         ),
   },
   {
      accessorKey: 'previewImage',
      header: 'Preview',
      cell: ({ row }) =>
         row.original.previewImage ? (
            <img
               src={row.original.previewImage}
               alt="Customized product preview"
               className="h-10 w-10 rounded-xl border object-cover"
            />
         ) : (
            <span className="text-xs text-muted-foreground">-</span>
         ),
   },
   {
      id: 'actions',
      cell: ({ row }) => (
         <Link href={`/orders/${row.original.id}`}>
            <Button size="icon" variant="outline">
               <EditIcon className="h-4" />
            </Button>
         </Link>
      ),
   },
]
