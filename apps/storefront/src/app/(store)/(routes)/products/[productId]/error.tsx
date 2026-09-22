'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect } from 'react'

export default function ProductError({
   error,
   reset,
}: {
   error: Error & { digest?: string }
   reset: () => void
}) {
   useEffect(() => {
      console.error('[PRODUCT_ERROR_BOUNDARY]', error)
   }, [error])

   return (
      <div className="mx-auto max-w-lg py-16 text-center">
         <h1 className="text-2xl font-semibold">Product unavailable</h1>
         <p className="mt-2 text-sm text-muted-foreground">
            We could not load this product right now. Please try again.
         </p>
         <div className="mt-6 flex justify-center gap-2">
            <Button className="rounded-2xl" onClick={reset}>
               Retry
            </Button>
            <Button asChild variant="outline" className="rounded-2xl">
               <Link href="/products">Browse catalog</Link>
            </Button>
         </div>
      </div>
   )
}
