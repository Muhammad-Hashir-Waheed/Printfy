import { ProductGrid, ProductSkeletonGrid } from '@/components/native/Product'
import { Heading } from '@/components/native/heading'
import { Separator } from '@/components/native/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import prisma from '@/lib/prisma'
import { isVariableValid } from '@/lib/utils'

import {
   AvailableToggle,
   BrandCombobox,
   CategoriesCombobox,
   SortBy,
} from './components/options'

export default async function Products({ searchParams }) {
   const { sort, isAvailable, brand, category, q, page = 1 } = searchParams ?? null

   const orderBy = getOrderBy(sort)
   let brands = []
   let categories = []
   let products = []

   try {
      brands = await prisma.brand.findMany()
      categories = await prisma.category.findMany()
      products = await prisma.product.findMany({
         where: {
            isAvailable: isAvailable == 'true' || sort ? true : undefined,
            title: {
               contains: q,
               mode: 'insensitive',
            },
            brand: {
               title: {
                  contains: brand,
                  mode: 'insensitive',
               },
            },
            categories: {
               some: {
                  title: {
                     contains: category,
                     mode: 'insensitive',
                  },
               },
            },
         },
         orderBy,
         skip: (page - 1) * 12,
         take: 12,
         include: {
            brand: true,
            categories: true,
         },
      })
   } catch {
      // Keep products page usable when database is not configured.
   }

   return (
      <>
         <Heading
            title="Products"
            description="Below is a list of products you have in your cart."
         />
         <div className="mb-4 block md:hidden">
            <Sheet>
               <SheetTrigger asChild>
                  <Button variant="secondary" className="w-full">
                     Filters
                  </Button>
               </SheetTrigger>
               <SheetContent side="bottom" className="h-[70vh] overflow-y-auto rounded-t-2xl p-4">
                  <SheetTitle className="mb-4">Product Filters</SheetTitle>
                  <div className="grid grid-cols-1 gap-3">
                     <SortBy initialData={sort} />
                     <CategoriesCombobox
                        initialCategory={category}
                        categories={categories}
                     />
                     <BrandCombobox initialBrand={brand} brands={brands} />
                     <AvailableToggle initialData={isAvailable} />
                  </div>
               </SheetContent>
            </Sheet>
         </div>
         <div className="mb-6 hidden grid-cols-2 gap-3 md:grid md:grid-cols-3 lg:grid-cols-4">
            <SortBy initialData={sort} />
            <CategoriesCombobox
               initialCategory={category}
               categories={categories}
            />
            <BrandCombobox initialBrand={brand} brands={brands} />
            <AvailableToggle initialData={isAvailable} />
         </div>
         <Separator className="mb-6" />
         {isVariableValid(products) && products.length > 0 ? (
            <ProductGrid products={products} />
         ) : isVariableValid(products) && products.length === 0 ? (
            <Card className="rounded-2xl border shadow-sm">
               <CardContent className="p-8 text-center">
                  <h3 className="text-lg font-semibold">No products found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                     Try adjusting filters or search query.
                  </p>
               </CardContent>
            </Card>
         ) : (
            <ProductSkeletonGrid />
         )}
      </>
   )
}

function getOrderBy(sort) {
   let orderBy

   switch (sort) {
      case 'featured':
         orderBy = {
            orders: {
               _count: 'desc',
            },
         }
         break
      case 'most_expensive':
         orderBy = {
            price: 'desc',
         }
         break
      case 'least_expensive':
         orderBy = {
            price: 'asc',
         }
         break

      default:
         orderBy = {
            orders: {
               _count: 'desc',
            },
         }
         break
   }

   return orderBy
}
