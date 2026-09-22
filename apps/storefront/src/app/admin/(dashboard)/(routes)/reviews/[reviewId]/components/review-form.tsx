'use client'

import { AlertModal } from '@/components/modals/alert-modal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form'
import { Heading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import type { StoreReview } from '@/lib/product-reviews'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import * as z from 'zod'

const formSchema = z.object({
   productId: z.string().min(1, 'Select a product'),
   customerName: z.string().min(1, 'Name is required'),
   rating: z.coerce.number().int().min(1).max(5),
   text: z.string().min(1, 'Review is required'),
   isVisible: z.boolean().default(true),
})

type ReviewFormValues = z.infer<typeof formSchema>

export function ReviewForm({
   initialData,
   products,
}: {
   initialData: StoreReview | null
   products: Array<{ id: string; title: string }>
}) {
   const params = useParams()
   const router = useRouter()
   const [open, setOpen] = useState(false)
   const [loading, setLoading] = useState(false)

   const title = initialData ? 'Edit review' : 'Create review'
   const description = initialData
      ? 'Changes appear on the product page.'
      : 'Add a customer review. Visible reviews show on the website.'
   const toastMessage = initialData ? 'Review updated.' : 'Review created.'
   const action = initialData ? 'Save changes' : 'Create'

   const form = useForm<ReviewFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         productId: initialData?.productId ?? products[0]?.id ?? '',
         customerName: initialData?.customerName ?? '',
         rating: initialData?.rating ?? 5,
         text: initialData?.text ?? '',
         isVisible: initialData?.isVisible ?? true,
      },
   })

   const onSubmit = async (data: ReviewFormValues) => {
      try {
         setLoading(true)
         const response = initialData
            ? await fetch(`/api/admin/reviews/${params.reviewId}`, {
                 method: 'PATCH',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(data),
                 cache: 'no-store',
              })
            : await fetch(`/api/admin/reviews`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(data),
                 cache: 'no-store',
              })

         if (!response.ok) {
            throw new Error(await response.text())
         }

         router.refresh()
         router.push(`/admin/reviews`)
         toast.success(toastMessage)
      } catch {
         toast.error('Something went wrong.')
      } finally {
         setLoading(false)
      }
   }

   const onDelete = async () => {
      try {
         setLoading(true)
         const response = await fetch(`/api/admin/reviews/${params.reviewId}`, {
            method: 'DELETE',
            cache: 'no-store',
         })
         if (!response.ok) {
            throw new Error(await response.text())
         }
         router.refresh()
         router.push(`/admin/reviews`)
         toast.success('Review deleted.')
      } catch {
         toast.error('Something went wrong.')
      } finally {
         setLoading(false)
         setOpen(false)
      }
   }

   return (
      <>
         <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
         />
         <div className="flex items-center justify-between">
            <Heading title={title} description={description} />
            {initialData && (
               <Button
                  disabled={loading}
                  variant="destructive"
                  size="sm"
                  onClick={() => setOpen(true)}
               >
                  <Trash className="h-4" />
               </Button>
            )}
         </div>
         <Separator />
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="w-full space-y-8"
            >
               <div className="gap-8 md:grid md:grid-cols-3">
                  <FormField
                     control={form.control}
                     name="productId"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Product</FormLabel>
                           <Select
                              disabled={loading}
                              onValueChange={field.onChange}
                              value={field.value}
                           >
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder="Select a product" />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 {products.map((product) => (
                                    <SelectItem key={product.id} value={product.id}>
                                       {product.title}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="customerName"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Customer name</FormLabel>
                           <FormControl>
                              <Input
                                 disabled={loading}
                                 placeholder="Ayesha"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="rating"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Rating</FormLabel>
                           <Select
                              disabled={loading}
                              onValueChange={(value) => field.onChange(Number(value))}
                              value={String(field.value)}
                           >
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder="Rating" />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 {[5, 4, 3, 2, 1].map((rating) => (
                                    <SelectItem key={rating} value={String(rating)}>
                                       {rating} star{rating === 1 ? '' : 's'}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="text"
                     render={({ field }) => (
                        <FormItem className="md:col-span-3">
                           <FormLabel>Review</FormLabel>
                           <FormControl>
                              <Textarea
                                 disabled={loading}
                                 placeholder="What the customer said"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="isVisible"
                     render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                           <FormControl>
                              <Checkbox
                                 checked={field.value}
                                 onCheckedChange={field.onChange}
                              />
                           </FormControl>
                           <div className="space-y-1 leading-none">
                              <FormLabel>Show on website</FormLabel>
                              <FormDescription>
                                 Uncheck to hide this review from the product page.
                              </FormDescription>
                           </div>
                        </FormItem>
                     )}
                  />
               </div>
               <Button disabled={loading} className="ml-auto" type="submit">
                  {action}
               </Button>
            </form>
         </Form>
      </>
   )
}
