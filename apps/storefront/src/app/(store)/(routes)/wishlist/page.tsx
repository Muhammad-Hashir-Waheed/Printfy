'use client'

import { Heading } from '@/components/native/heading'
import { ProductCard } from '@/components/native/ProductCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuthenticated } from '@/hooks/useAuthentication'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function WishlistPage() {
   const { authenticated } = useAuthenticated()
   const [items, setItems] = useState<any[] | null>(null)
   const [error, setError] = useState<string | null>(null)
   /** The auth cookie is only readable after mount, so defer the signed-out state. */
   const [authChecked, setAuthChecked] = useState(false)

   useEffect(() => {
      setAuthChecked(true)
   }, [])

   useEffect(() => {
      if (!authenticated) return

      async function getWishlist() {
         try {
            const response = await fetch(`/api/wishlist`, {
               cache: 'no-store',
            })

            if (!response.ok) {
               setError('We could not load your wishlist right now.')
               setItems([])
               return
            }

            const json = await response.json()
            setItems(Array.isArray(json) ? json : (json?.items ?? []))
         } catch (error) {
            console.error({ error })
            setError('We could not load your wishlist right now.')
            setItems([])
         }
      }

      getWishlist()
   }, [authenticated])

   return (
      <div className="space-y-6 py-4">
         <Heading
            title="Wishlist"
            description="Packaging you saved to come back to later."
         />

         {authChecked && !authenticated ? (
            <Card className="rounded-2xl border shadow-sm">
               <CardContent className="space-y-3 p-8 text-center">
                  <h3 className="text-lg font-semibold">
                     Sign in to see your wishlist
                  </h3>
                  <p className="text-sm text-muted-foreground">
                     Your saved packaging is tied to your account.
                  </p>
                  <div className="flex flex-col justify-center gap-2 pt-2 sm:flex-row">
                     <Button asChild className="rounded-2xl">
                        <Link href="/login">Sign in</Link>
                     </Button>
                     <Button asChild variant="outline" className="rounded-2xl">
                        <Link href="/products">Browse packaging</Link>
                     </Button>
                  </div>
               </CardContent>
            </Card>
         ) : null}

         {authenticated && items === null ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
               {[...Array(4)].map((_, index) => (
                  <Card key={index} className="rounded-2xl border shadow-sm">
                     <CardContent className="space-y-3 p-4">
                        <div className="aspect-square animate-pulse rounded-xl bg-muted" />
                        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                     </CardContent>
                  </Card>
               ))}
            </div>
         ) : null}

         {authenticated && items !== null && items.length === 0 ? (
            <Card className="rounded-2xl border shadow-sm">
               <CardContent className="space-y-3 p-8 text-center">
                  <h3 className="text-lg font-semibold">Your wishlist is empty</h3>
                  <p className="text-sm text-muted-foreground">
                     {error ??
                        'Save packaging you like and it will show up here for quick reordering.'}
                  </p>
                  <div className="flex flex-col justify-center gap-2 pt-2 sm:flex-row">
                     <Button asChild className="rounded-2xl">
                        <Link href="/products">Browse packaging</Link>
                     </Button>
                     <Button asChild variant="outline" className="rounded-2xl">
                        <Link href="/products">Browse packaging</Link>
                     </Button>
                  </div>
               </CardContent>
            </Card>
         ) : null}

         {items && items.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
               {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
               ))}
            </div>
         ) : null}
      </div>
   )
}
