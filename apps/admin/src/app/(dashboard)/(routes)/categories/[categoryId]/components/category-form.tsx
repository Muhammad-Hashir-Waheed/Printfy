'use client'

import { AlertModal } from '@/components/modals/alert-modal'
import { Button } from '@/components/ui/button'
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form'
import { Heading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { Category } from '@prisma/client'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import * as z from 'zod'

const formSchema = z.object({
   title: z.string().min(2, 'Name is required'),
   description: z.string().optional(),
})

type CategoryFormValues = z.infer<typeof formSchema>

interface CategoryFormProps {
   initialData: Category | null
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData }) => {
   const params = useParams()
   const router = useRouter()

   const [open, setOpen] = useState(false)
   const [loading, setLoading] = useState(false)

   const title = initialData ? 'Edit category' : 'Create category'
   const description = initialData
      ? 'This name and description appear on the storefront catalog.'
      : 'Add a category. Products assigned to it will show on the website.'
   const toastMessage = initialData ? 'Category updated.' : 'Category created.'
   const action = initialData ? 'Save changes' : 'Create'

   const form = useForm<CategoryFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         title: initialData?.title ?? '',
         description: initialData?.description ?? '',
      },
   })

   const onSubmit = async (data: CategoryFormValues) => {
      try {
         setLoading(true)
         const response = initialData
            ? await fetch(`/api/categories/${params.categoryId}`, {
                 method: 'PATCH',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(data),
                 cache: 'no-store',
              })
            : await fetch(`/api/categories`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(data),
                 cache: 'no-store',
              })

         if (!response.ok) {
            throw new Error(await response.text())
         }

         router.refresh()
         router.push(`/categories`)
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

         const response = await fetch(`/api/categories/${params.categoryId}`, {
            method: 'DELETE',
            cache: 'no-store',
         })

         if (!response.ok) {
            throw new Error(await response.text())
         }

         router.refresh()
         router.push(`/categories`)
         toast.success('Category deleted.')
      } catch {
         toast.error(
            'Make sure you removed all products using this category first.'
         )
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
                     name="title"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Name</FormLabel>
                           <FormControl>
                              <Input
                                 disabled={loading}
                                 placeholder="e.g. Gift Boxes"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="description"
                     render={({ field }) => (
                        <FormItem className="md:col-span-2">
                           <FormLabel>Description</FormLabel>
                           <FormControl>
                              <Input
                                 disabled={loading}
                                 placeholder="Shown on the storefront catalog"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
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
