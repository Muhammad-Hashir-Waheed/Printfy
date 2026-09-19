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
import { Switch } from '@/components/ui/switch'
import { zodResolver } from '@hookform/resolvers/zod'
import { Brand, Category, Prisma } from '@prisma/client'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import * as z from 'zod'

const formSchema = z.object({
   title: z.string().min(1),
   description: z.string().optional(),
   images: z.string().array(),
   imageUrl: z.string().optional(),
   price: z.coerce.number().min(0),
   discount: z.coerce.number().min(0),
   stock: z.coerce.number().min(0),
   categoryId: z.string().min(1, 'Select a category'),
   brandId: z.string().min(1, 'Select a brand'),
   isFeatured: z.boolean().default(false).optional(),
   isAvailable: z.boolean().default(true).optional(),
   isCustomizable: z.boolean().default(true).optional(),
})

type ProductFormValues = z.infer<typeof formSchema>

type AdminProduct = Prisma.ProductGetPayload<{
   include: {
      brand: true
      categories: true
   }
}>

interface ProductFormProps {
   initialData: AdminProduct | null
   categories: Category[]
   brands: Brand[]
}

export const ProductForm: React.FC<ProductFormProps> = ({
   initialData,
   categories,
   brands,
}) => {
   const params = useParams()
   const router = useRouter()

   const [open, setOpen] = useState(false)
   const [loading, setLoading] = useState(false)

   const title = initialData ? 'Edit product' : 'Create product'
   const description = initialData
      ? 'Changes appear on the storefront catalog.'
      : 'Add a product. Assign a category so it shows on the website.'
   const toastMessage = initialData ? 'Product updated.' : 'Product created.'
   const action = initialData ? 'Save changes' : 'Create'

   const form = useForm<ProductFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         title: initialData?.title ?? '',
         description: initialData?.description ?? '',
         images: initialData?.images ?? [],
         imageUrl: '',
         price: initialData ? Number(initialData.price) : 0,
         discount: initialData ? Number(initialData.discount) : 0,
         stock: initialData ? Number(initialData.stock) : 0,
         categoryId: initialData?.categories?.[0]?.id ?? '',
         brandId: initialData?.brandId ?? brands[0]?.id ?? '',
         isFeatured: initialData?.isFeatured ?? false,
         isAvailable: initialData?.isAvailable ?? true,
         isCustomizable: Boolean(
            (initialData as { metadata?: { isCustomizable?: boolean } } | null)
               ?.metadata?.isCustomizable ?? true
         ),
      },
   })

   const onSubmit = async (data: ProductFormValues) => {
      try {
         setLoading(true)
         const payload = {
            ...data,
            images: data.imageUrl?.trim()
               ? [...data.images, data.imageUrl.trim()]
               : data.images,
         }

         const response = initialData
            ? await fetch(`/api/admin/products/${params.productId}`, {
                 method: 'PATCH',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(payload),
                 cache: 'no-store',
              })
            : await fetch(`/api/admin/products`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(payload),
                 cache: 'no-store',
              })

         if (!response.ok) {
            throw new Error(await response.text())
         }

         router.refresh()
         router.push(`/admin/products`)
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

         const response = await fetch(`/api/admin/products/${params.productId}`, {
            method: 'DELETE',
            cache: 'no-store',
         })

         if (!response.ok) {
            throw new Error(await response.text())
         }

         router.refresh()
         router.push(`/admin/products`)
         toast.success('Product deleted.')
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
               <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Images</FormLabel>
                        <div className="mb-3 flex flex-wrap gap-3">
                           {field.value.map((url) => (
                              <div key={url} className="relative">
                                 <img
                                    src={url}
                                    alt=""
                                    className="h-24 w-24 rounded-md object-cover"
                                 />
                                 <Button
                                    type="button"
                                    size="icon"
                                    variant="destructive"
                                    className="absolute right-1 top-1 h-6 w-6"
                                    onClick={() =>
                                       field.onChange(
                                          field.value.filter((item) => item !== url)
                                       )
                                    }
                                 >
                                    <Trash className="h-3 w-3" />
                                 </Button>
                              </div>
                           ))}
                        </div>
                        <FormField
                           control={form.control}
                           name="imageUrl"
                           render={({ field: urlField }) => (
                              <FormItem>
                                 <FormLabel>Add image URL</FormLabel>
                                 <FormControl>
                                    <Input
                                       disabled={loading}
                                       placeholder="https://..."
                                       {...urlField}
                                    />
                                 </FormControl>
                                 <FormDescription>
                                    Paste an image URL. It is saved with the product.
                                 </FormDescription>
                              </FormItem>
                           )}
                        />
                        <FormMessage />
                     </FormItem>
                  )}
               />
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
                                 placeholder="Product title"
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
                                 placeholder="Shown on the product page"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="price"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Price</FormLabel>
                           <FormControl>
                              <Input
                                 type="number"
                                 disabled={loading}
                                 placeholder="9.99"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="discount"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Discount</FormLabel>
                           <FormControl>
                              <Input
                                 type="number"
                                 disabled={loading}
                                 placeholder="0"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="stock"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Stock</FormLabel>
                           <FormControl>
                              <Input
                                 type="number"
                                 disabled={loading}
                                 placeholder="10"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="categoryId"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Category</FormLabel>
                           <Select
                              disabled={loading}
                              onValueChange={field.onChange}
                              value={field.value}
                           >
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 {categories.map((category) => (
                                    <SelectItem
                                       key={category.id}
                                       value={category.id}
                                    >
                                       {category.title}
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
                     name="brandId"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Brand</FormLabel>
                           <Select
                              disabled={loading}
                              onValueChange={field.onChange}
                              value={field.value}
                           >
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder="Select a brand" />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 {brands.map((brand) => (
                                    <SelectItem key={brand.id} value={brand.id}>
                                       {brand.title}
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
                     name="isFeatured"
                     render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                           <FormControl>
                              <Checkbox
                                 checked={field.value}
                                 onCheckedChange={field.onChange}
                              />
                           </FormControl>
                           <div className="space-y-1 leading-none">
                              <FormLabel>Featured</FormLabel>
                              <FormDescription>
                                 Show this product on the homepage
                              </FormDescription>
                           </div>
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="isAvailable"
                     render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                           <FormControl>
                              <Checkbox
                                 checked={field.value}
                                 onCheckedChange={field.onChange}
                              />
                           </FormControl>
                           <div className="space-y-1 leading-none">
                              <FormLabel>Available</FormLabel>
                              <FormDescription>
                                 Show this product in the store catalog
                              </FormDescription>
                           </div>
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="isCustomizable"
                     render={({ field }) => (
                        <FormItem className="rounded-md border p-4">
                           <div className="flex items-center justify-between">
                              <div className="space-y-1 leading-none">
                                 <FormLabel>Customizable</FormLabel>
                                 <FormDescription>
                                    Enable product personalization.
                                 </FormDescription>
                              </div>
                              <FormControl>
                                 <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                 />
                              </FormControl>
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
