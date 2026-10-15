'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader } from '@/components/ui/loader'
import { useAuthenticated } from '@/hooks/useAuthentication'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { AddressForm } from './components/address-form'

export default function AddressPage({
   params,
}: {
   params: { addressId: string }
}) {
   const { authenticated } = useAuthenticated()
   const isNew = params.addressId === 'new'

   const [address, setAddress] = useState(null)
   const [loading, setLoading] = useState(!isNew)
   const [error, setError] = useState<string | null>(null)

   useEffect(() => {
      if (isNew || !authenticated) return

      async function getAddress() {
         try {
            const response = await fetch(`/api/addresses/${params.addressId}`, {
               cache: 'no-store',
            })

            if (!response.ok) {
               setError('We could not load this address.')
               return
            }

            setAddress(await response.json())
         } catch {
            setError('We could not load this address.')
         } finally {
            setLoading(false)
         }
      }

      getAddress()
   }, [authenticated, isNew, params.addressId])

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 p-8 pt-6">
            {loading && !error ? (
               <Card className="rounded-2xl border shadow-sm">
                  <CardContent className="flex h-[20vh] items-center justify-center">
                     <Loader />
                  </CardContent>
               </Card>
            ) : error ? (
               <Card className="rounded-2xl border shadow-sm">
                  <CardContent className="space-y-3 p-8 text-center">
                     <h3 className="text-lg font-semibold">Address not found</h3>
                     <p className="text-sm text-muted-foreground">{error}</p>
                     <div className="flex flex-col justify-center gap-2 pt-2 sm:flex-row">
                        <Button asChild className="rounded-2xl">
                           <Link href="/profile/addresses">All addresses</Link>
                        </Button>
                        <Button asChild variant="outline" className="rounded-2xl">
                           <Link href="/profile/addresses/new">Add an address</Link>
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            ) : (
               <AddressForm initialData={address} />
            )}
         </div>
      </div>
   )
}
