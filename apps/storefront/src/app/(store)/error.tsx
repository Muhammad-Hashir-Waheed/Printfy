'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect } from 'react'

export default function StoreError({
   error,
   reset,
}: {
   error: Error & { digest?: string }
   reset: () => void
}) {
   useEffect(() => {
      console.error('[STORE_ERROR]', error)
   }, [error])

   return (
      <div className="mx-auto max-w-lg py-20 text-center">
         <h1 className="text-2xl font-semibold">Something went wrong</h1>
         <p className="mt-2 text-sm text-muted-foreground">
            The store could not load this page. Please try again.
         </p>
         <div className="mt-6 flex justify-center gap-2">
            <Button className="rounded-2xl" onClick={reset}>
               Retry
            </Button>
            <Button asChild variant="outline" className="rounded-2xl">
               <Link href="/">Go home</Link>
            </Button>
         </div>
      </div>
   )
}
