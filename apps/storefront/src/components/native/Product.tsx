import { ImageSkeleton } from '@/components/native/icons'
import { ProductCard } from '@/components/native/ProductCard'
import type { ProductWithIncludes } from '@/types/prisma'
import Link from 'next/link'

export const ProductGrid = ({
   products,
}: {
   products: ProductWithIncludes[]
}) => {
   return (
      <div className="mb-6 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
         {products.map((product) => (
            <ProductCard product={product} key={product.id} />
         ))}
      </div>
   )
}

export const ProductSkeletonGrid = () => {
   return (
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
         {[...Array(12)].map(() => (
            <ProductSkeleton key={Math.random()} />
         ))}
      </div>
   )
}

export function ProductSkeleton() {
   return (
      <Link href="#">
         <div className="animate-pulse rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
            <div className="relative h-full w-full">
               <div className="flex h-40 w-full items-center justify-center rounded bg-neutral-300 dark:bg-neutral-700 ">
                  <ImageSkeleton />
               </div>
            </div>
            <div className="p-5">
               <div className="w-full">
                  <div className="mb-4 h-2.5 w-48 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                  <div className="mb-2.5 h-2 max-w-[480px] rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                  <div className="mb-2.5 h-2 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                  <div className="mb-2.5 h-2 max-w-[440px] rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                  <div className="mb-2.5 h-2 max-w-[460px] rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                  <div className="h-2 max-w-[360px] rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
               </div>
            </div>
         </div>
      </Link>
   )
}
