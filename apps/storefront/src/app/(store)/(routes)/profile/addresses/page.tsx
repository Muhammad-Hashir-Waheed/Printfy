'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader } from '@/components/ui/loader'
import { useAuthenticated } from '@/hooks/useAuthentication'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { UserCombobox } from '../components/switcher'
import type { AddressColumn } from './components/table'
import { AddressTable } from './components/table'

export default function AddressesPage() {
   const { authenticated } = useAuthenticated()
   const [addresses, setAddresses] = useState<any[] | null>(null)
   const [error, setError] = useState<string | null>(null)
   const pathname = usePathname()

   useEffect(() => {
      if (!authenticated) return

      async function getAddresses() {
         try {
            const response = await fetch(`/api/addresses`, {
               cache: 'no-store',
            })

            if (!response.ok) {
               setError('We could not load your addresses right now.')
               setAddresses([])
               return
            }

            const json = await response.json()
            setAddresses(Array.isArray(json) ? json : [])
         } catch (error) {
            console.error({ error })
            setError('We could not load your addresses right now.')
            setAddresses([])
         }
      }

      getAddresses()
   }, [authenticated])

   return (
      <div className="flex-col">
         <div className="flex-1 ">
            <div className="flex items-center justify-between">
               <UserCombobox initialValue={pathname} />
               <Link href="/profile/addresses/new">
                  <Button>
                     <PlusIcon className="mr-2 h-4" /> Add New
                  </Button>
               </Link>
            </div>
            {addresses === null ? (
               <Card className="my-2">
                  <CardContent>
                     <div className="h-[20vh]">
                        <div className="h-full my-4 flex items-center justify-center">
                           <Loader />
                        </div>
                     </div>
                  </CardContent>
               </Card>
            ) : addresses.length === 0 ? (
               <Card className="my-4 rounded-2xl border shadow-sm">
                  <CardContent className="space-y-3 p-8 text-center">
                     <h3 className="text-lg font-semibold">No addresses saved</h3>
                     <p className="text-sm text-muted-foreground">
                        {error ??
                           'Add a delivery address so checkout can be completed faster.'}
                     </p>
                     <Button asChild className="mt-2 rounded-2xl">
                        <Link href="/profile/addresses/new">Add an address</Link>
                     </Button>
                  </CardContent>
               </Card>
            ) : (
               <AddressSection addresses={addresses} />
            )}
         </div>
      </div>
   )
}

function AddressSection({ addresses }) {
   const formattedAddresses: AddressColumn[] = addresses.map((address) => ({
      id: address.id,
      city: address.city,
      address: address.address,
      phone: address.phone,
      postal: address.postalCode,
   }))

   return <AddressTable data={formattedAddresses} />
}
