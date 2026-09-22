'use client'

import { Button } from '@/components/ui/button'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronsUpDownIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'

export function UserCombobox({ initialValue }) {
   const [open, setOpen] = React.useState(false)
   const [value, setValue] = React.useState('')

   const categories = [
      {
         title: 'Edit Profile',
         description: 'Update your account details.',
         value: '/profile/edit',
      },
      {
         title: 'Orders',
         description: 'Visit your orders.',
         value: '/profile/orders',
      },
      {
         title: 'Payments',
         description: 'Review your payment history.',
         value: '/profile/payments',
      },
      {
         title: 'Addresses',
         description: 'Visit your addresses.',
         value: '/profile/addresses',
      },
      {
         title: 'Saved Designs',
         description: 'Reuse your custom print layouts.',
         value: '/profile/designs',
      },
   ]

   function getCategoryTitle() {
      for (const category of categories) {
         if (value.includes(category.value)) return category.title
      }
      return 'My Account'
   }

   useEffect(() => {
      setValue(initialValue)
   }, [initialValue])

   return (
      <DropdownMenu>
         <DropdownMenuTrigger>
            <Button variant="outline" className="flex gap-2">
               <p>{getCategoryTitle()}</p>
               <ChevronsUpDownIcon className="h-4" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent>
            {categories.map(({ title, value }) => (
               <Link href={value} key={title}>
                  <DropdownMenuItem>{title}</DropdownMenuItem>
               </Link>
            ))}
         </DropdownMenuContent>
      </DropdownMenu>
   )
}
