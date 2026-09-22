import prisma from '@/lib/prisma'
import { getCategoryImage } from '@/lib/category-image'

import { CategoryForm } from './components/category-form'

const CategoryPage = async ({
   params,
}: {
   params: { categoryId: string }
}) => {
   const category =
      params.categoryId === 'new'
         ? null
         : await prisma.category.findUnique({
              where: { id: params.categoryId },
           })
   const image = category ? await getCategoryImage(category.id) : null

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 p-8 pt-6">
            <CategoryForm
               initialData={category ? { ...category, image } : null}
            />
         </div>
      </div>
   )
}

export default CategoryPage
