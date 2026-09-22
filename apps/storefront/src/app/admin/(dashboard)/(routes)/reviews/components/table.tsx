'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { CheckIcon, EditIcon, XIcon } from 'lucide-react'
import Link from 'next/link'

export type ReviewColumn = {
   id: string
   product: string
   customerName: string
   rating: number
   text: string
   isVisible: boolean
}

export const columns: ColumnDef<ReviewColumn>[] = [
   {
      accessorKey: 'product',
      header: 'Product',
   },
   {
      accessorKey: 'customerName',
      header: 'Customer',
   },
   {
      accessorKey: 'rating',
      header: 'Rating',
   },
   {
      accessorKey: 'text',
      header: 'Review',
      cell: ({ row }) => (
         <span className="line-clamp-2 max-w-xs">{row.original.text}</span>
      ),
   },
   {
      accessorKey: 'isVisible',
      header: 'Visible',
      cell: (props) => (props.cell.getValue() ? <CheckIcon /> : <XIcon />),
   },
   {
      id: 'actions',
      cell: ({ row }) => (
         <Link href={`/admin/reviews/${row.original.id}`}>
            <Button size="icon" variant="outline">
               <EditIcon className="h-4" />
            </Button>
         </Link>
      ),
   },
]

export function ReviewsTable({ data }: { data: ReviewColumn[] }) {
   return <DataTable searchKey="product" columns={columns} data={data} />
}
