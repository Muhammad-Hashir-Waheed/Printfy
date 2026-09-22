'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader } from '@/components/ui/loader'
import { useAuthenticated } from '@/hooks/useAuthentication'
import { format } from 'date-fns'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { UserCombobox } from '../components/switcher'
import { UserForm } from './components/user-form'

export default function UserPage() {
   const { authenticated } = useAuthenticated()
   const [user, setUser] = useState(null)
   const [error, setError] = useState<string | null>(null)
   const pathname = usePathname()

   useEffect(() => {
      if (!authenticated) return

      async function getUser() {
         try {
            const response = await fetch(`/api/profile`, {
               cache: 'no-store',
            })

            if (!response.ok) {
               setError('We could not load your profile right now.')
               return
            }

            const json = await response.json()

            setUser(json)
         } catch (error) {
            console.error({ error })
            setError('We could not load your profile right now.')
         }
      }

      getUser()
   }, [authenticated])

   function UserCard() {
      return (
         <Card className="my-4 bg-muted-foreground/5">
            <CardContent className="py-6">
               <UserForm initialData={user} />
            </CardContent>
         </Card>
      )
   }

   return (
      <div className="flex-col">
         <div className="flex-1 ">
            <div className="flex items-center justify-between">
               <UserCombobox initialValue={pathname} />
            </div>
            {user ? (
               <UserCard />
            ) : error ? (
               <Card className="my-4 rounded-2xl border shadow-sm">
                  <CardContent className="space-y-3 p-8 text-center">
                     <h3 className="text-lg font-semibold">
                        Profile unavailable
                     </h3>
                     <p className="text-sm text-muted-foreground">{error}</p>
                     <div className="flex flex-col justify-center gap-2 pt-2 sm:flex-row">
                        <Button asChild className="rounded-2xl">
                           <Link href="/products">Browse packaging</Link>
                        </Button>
                        <Button asChild variant="outline" className="rounded-2xl">
                           <Link href="/login">Sign in again</Link>
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            ) : (
               <Card className="my-4 bg-muted-foreground/5">
                  <CardContent>
                     <div className="h-[20vh]">
                        <div className="h-full my-4 flex items-center justify-center">
                           <Loader />
                        </div>
                     </div>
                  </CardContent>
               </Card>
            )}
         </div>
      </div>
   )
}
