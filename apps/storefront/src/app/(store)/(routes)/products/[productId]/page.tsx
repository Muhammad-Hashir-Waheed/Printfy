import prisma from '@/lib/prisma'
import { isVariableValid } from '@/lib/utils'
import { ChevronRightIcon } from 'lucide-react'
import type { Metadata, ResolvingMetadata } from 'next'
import Link from 'next/link'

import { DataSection } from './components/data'
import { ProductGallery } from './components/gallery'

type Props = {
   params: { productId: string }
   searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
   { params, searchParams }: Props,
   parent: ResolvingMetadata
): Promise<Metadata> {
   let product = null
   try {
      product = await prisma.product.findUnique({
         where: {
            id: params.productId,
         },
      })
   } catch {
      product = null
   }

   return {
      title: product?.title ?? 'Product',
      description: product?.description ?? 'Product detail',
      keywords: product?.keywords ?? ['product'],
      openGraph: {
         images: product?.images ?? [],
      },
   }
}

export default async function Product({
   params,
}: {
   params: { productId: string }
}) {
   let product = null
   try {
      product = await prisma.product.findUnique({
         where: {
            id: params.productId,
         },
         include: {
            brand: true,
            categories: true,
            variants: true,
         },
      })
   } catch {
      product = null
   }

   if (isVariableValid(product)) {
      return (
         <>
            <Breadcrumbs product={product} />
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-5">
               <ImageColumn product={product} />
               <DataSection product={product} />
            </div>
         </>
      )
   }

   return (
      <div className="rounded-2xl border bg-card p-8 shadow-sm">
         <h2 className="text-xl font-semibold">Product unavailable</h2>
         <p className="mt-2 text-sm text-muted-foreground">
            This product cannot be loaded right now. Please try again later.
         </p>
      </div>
   )
}

const ImageColumn = ({ product }) => {
   return (
      <div className="relative col-span-3 min-h-[50vh] w-full overflow-hidden rounded-2xl border bg-muted/20 p-2">
         <ProductGallery images={product?.images ?? []} />
      </div>
   )
}

const Breadcrumbs = ({ product }) => {
   return (
      <nav className="flex text-muted-foreground" aria-label="Breadcrumb">
         <ol className="inline-flex items-center gap-2">
            <li className="inline-flex items-center">
               <Link
                  href="/"
                  className="inline-flex items-center text-sm font-medium"
               >
                  Home
               </Link>
            </li>
            <li>
               <div className="flex items-center gap-2">
                  <ChevronRightIcon className="h-4" />
                  <Link className="text-sm font-medium" href="/products">
                     Products
                  </Link>
               </div>
            </li>
            <li aria-current="page">
               <div className="flex items-center gap-2">
                  <ChevronRightIcon className="h-4" />
                  <span className="text-sm font-medium">{product?.title}</span>
               </div>
            </li>
         </ol>
      </nav>
   )
}
