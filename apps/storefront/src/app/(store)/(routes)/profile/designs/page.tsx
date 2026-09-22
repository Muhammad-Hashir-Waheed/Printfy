'use client'

import { Heading } from '@/components/native/heading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { deleteDesign, getSavedDesigns, ProductCustomization } from '@/lib/designs'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function DesignsPage() {
   const [designs, setDesigns] = useState<ProductCustomization[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      ;(async () => {
         const data = await getSavedDesigns()
         setDesigns(data)
         setLoading(false)
      })()
   }, [])

   async function onDelete(productId: string) {
      await deleteDesign(productId)
      setDesigns(await getSavedDesigns())
   }

   return (
      <div className="space-y-6">
         <Heading
            title="Saved Designs"
            description="Your reusable custom print layouts."
         />
         {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
               {[...Array(6)].map((_, index) => (
                  <Card key={index} className="rounded-2xl border shadow-sm">
                     <CardContent className="space-y-3 p-4">
                        <div className="h-44 animate-pulse rounded-xl bg-muted" />
                        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                     </CardContent>
                  </Card>
               ))}
            </div>
         ) : null}

         {!loading && designs.length === 0 ? (
            <Card className="rounded-2xl border shadow-sm">
               <CardContent className="space-y-3 p-8 text-center">
                  <h3 className="text-lg font-semibold">No saved designs yet</h3>
                  <p className="text-sm text-muted-foreground">
                     Create and save your first custom design to reuse it later.
                  </p>
                  <Link href="/products">
                     <Button className="rounded-2xl">Start designing</Button>
                  </Link>
               </CardContent>
            </Card>
         ) : null}

         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {designs.map((design) => (
               <Card key={design.productId} className="group rounded-2xl border shadow-sm">
                  <CardContent className="space-y-3 p-4">
                     <div className="relative overflow-hidden rounded-2xl border bg-muted/20 p-2">
                        {design.designImage ? (
                           <img
                              src={design.designImage}
                              alt="Design preview"
                              className="h-44 w-full rounded-xl object-contain"
                           />
                        ) : (
                           <div className="flex h-44 items-center justify-center text-sm text-muted-foreground">
                              No preview
                           </div>
                        )}
                        <div className="absolute inset-0 hidden items-end justify-center gap-2 rounded-xl bg-black/45 p-3 transition duration-200 group-hover:flex">
                           <Link href={`/customize/${design.productId}`} className="w-full">
                              <Button size="sm" className="w-full">
                                 Edit
                              </Button>
                           </Link>
                           <Button
                              size="sm"
                              variant="secondary"
                              className="w-full"
                              onClick={() => onDelete(design.productId)}
                           >
                              Delete
                           </Button>
                        </div>
                     </div>
                     <div className={cn('text-sm text-muted-foreground')}>
                        {(design.variants ?? []).map((variant) => `${variant.name}: ${variant.value}`).join(' / ')}
                     </div>
                  </CardContent>
                  <CardFooter className="flex gap-2 p-4 pt-0">
                     <Link href={`/customize/${design.productId}`} className="w-full">
                        <Button className="w-full rounded-2xl">Edit</Button>
                     </Link>
                     <Button
                        variant="outline"
                        className="w-full rounded-2xl"
                        onClick={() => onDelete(design.productId)}
                     >
                        Delete
                     </Button>
                  </CardFooter>
               </Card>
            ))}
         </div>
      </div>
   )
}
