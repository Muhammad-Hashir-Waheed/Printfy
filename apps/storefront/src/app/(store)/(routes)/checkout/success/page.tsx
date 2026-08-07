import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export default function CheckoutSuccessPage({
   searchParams,
}: {
   searchParams: { orderId?: string; number?: string }
}) {
   /** Demo checkouts are not persisted, so there is no order detail page to link to. */
   const hasTrackableOrder =
      !!searchParams.orderId && !searchParams.orderId.startsWith('demo-')

   return (
      <div className="mx-auto max-w-lg py-12">
         <Card className="rounded-2xl border shadow-sm">
            <CardContent className="space-y-4 p-8 text-center">
               <h1 className="text-2xl font-semibold">Order placed successfully</h1>
               <p className="text-sm text-muted-foreground">
                  Thank you for your purchase. Your print order is now being processed.
               </p>
               {searchParams.number ? (
                  <p className="text-sm font-medium">Order #{searchParams.number}</p>
               ) : null}
               <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-center">
                  <Button asChild className="rounded-2xl">
                     <Link href="/products">Continue shopping</Link>
                  </Button>
                  {hasTrackableOrder ? (
                     <Button asChild variant="outline" className="rounded-2xl">
                        <Link href={`/profile/orders/${searchParams.orderId}`}>
                           View order
                        </Link>
                     </Button>
                  ) : (
                     <Button asChild variant="outline" className="rounded-2xl">
                        <Link href="/products">Browse packaging</Link>
                     </Button>
                  )}
               </div>
            </CardContent>
         </Card>
      </div>
   )
}
