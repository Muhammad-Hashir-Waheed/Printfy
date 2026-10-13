'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { EditIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

export type CategoryColumn = {
   id: string
   title: string
   image?: string | null
   products: number
}

export const columns: ColumnDef<CategoryColumn>[] = [
   {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
         <div className="flex items-center gap-3">
            {row.original.image ? (
               <img
                  src={row.original.image}
                  alt=""
                  className="h-10 w-10 rounded-md object-cover"
               />
            ) : (
               <div className="h-10 w-10 rounded-md bg-muted" />
            )}
            <span>{row.original.title}</span>
         </div>
      ),
   },
   {
      accessorKey: 'products',
      header: 'Products #',
   },
   {
      id: 'actions',
      cell: ({ row }) => (
         <Link href={`/admin/categories/${row.original.id}`}>
            <Button size="icon" variant="outline">
               <EditIcon className="h-4" />
            </Button>
         </Link>
      ),
   },
]

interface CategoriesClientProps {
   data: CategoryColumn[]
}

export const CategoriesClient: React.FC<CategoriesClientProps> = ({ data }) => {
   const params = useParams()
   const router = useRouter()

   return <DataTable searchKey="title" columns={columns} data={data} />
}
