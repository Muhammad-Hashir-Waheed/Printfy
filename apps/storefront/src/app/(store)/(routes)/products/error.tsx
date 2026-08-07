'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ProductsError({
   reset,
}: {
   error: Error & { digest?: string }
   reset: () => void
}) {
   return (
      <div className="mx-auto max-w-lg py-16 text-center">
         <h1 className="text-2xl font-semibold">Could not load products</h1>
         <p className="mt-2 text-sm text-muted-foreground">
            Try the full gallery or refresh the page.
         </p>
         <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button className="rounded-2xl" onClick={reset}>
               Retry
            </Button>
            <Button asChild variant="outline" className="rounded-2xl">
               <Link href="/products">Shop packaging</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-2xl">
               <Link href="/">Home</Link>
            </Button>
         </div>
      </div>
   )
}
