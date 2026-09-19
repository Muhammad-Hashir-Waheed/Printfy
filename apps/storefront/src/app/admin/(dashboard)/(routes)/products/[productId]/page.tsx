import prisma from '@/lib/prisma'

import { ProductForm } from './components/product-form'

export default async function ProductPage({
   params,
}: {
   params: { productId: string }
}) {
   const product =
      params.productId === 'new'
         ? null
         : await prisma.product.findUnique({
              where: { id: params.productId },
              include: {
                 categories: true,
                 brand: true,
              },
           })

   const [categories, brands] = await Promise.all([
      prisma.category.findMany({ orderBy: { title: 'asc' } }),
      prisma.brand.findMany({ orderBy: { title: 'asc' } }),
   ])

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 pb-12 pt-6">
            <ProductForm
               categories={categories}
               brands={brands}
               initialData={product}
            />
         </div>
      </div>
   )
}
