import { CATALOG_PRODUCT_IDS, getCatalogProduct, getProductType } from '@/lib/catalog'
import { buildCatalogHref } from '@/lib/catalog-navigation'
import { isVariableValid } from '@/lib/utils'
import { ChevronRightIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { DataSection } from './components/data'
import { ProductGallery } from './components/gallery'
import { RelatedProducts } from './components/related-products'

export function generateStaticParams() {
   return CATALOG_PRODUCT_IDS.map((productId) => ({ productId }))
}

type Props = {
   params: { productId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
   try {
      const product = await getCatalogProduct(params.productId)
      return {
         title: product?.title ?? 'Product',
         description: product?.description ?? 'Product detail',
         keywords: product?.keywords ?? ['product'],
         openGraph: {
            images: product?.images ?? [],
         },
      }
   } catch {
      return {
         title: 'Product',
         description: 'Product detail',
      }
   }
}

export default async function ProductPage({ params }: Props) {
   let product = null

   try {
      product = await getCatalogProduct(params.productId)
   } catch (error) {
      console.error('[PRODUCT_PAGE]', params.productId, error)
   }

   if (!isVariableValid(product)) {
      notFound()
   }

   return (
      <>
         <Breadcrumbs product={product} />
         <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-5">
            <ImageColumn product={product} />
            <DataSection product={product} />
         </div>
         <RelatedProducts product={product} />
      </>
   )
}

const ImageColumn = ({ product }: { product: { id: string; images?: string[] } }) => {
   return (
      <div className="relative col-span-3 min-h-[50vh] w-full overflow-hidden rounded-2xl border bg-muted/20 p-2 lg:sticky lg:top-24 lg:self-start">
         <ProductGallery productId={product.id} images={product?.images ?? []} />
      </div>
   )
}

const Breadcrumbs = ({
   product,
}: {
   product: {
      title?: string
      categories?: Array<{ title: string }>
   }
}) => {
   const category = product.categories?.[0]
   const productType = getProductType(product as any)

   return (
      <nav className="flex text-muted-foreground" aria-label="Breadcrumb">
         <ol className="inline-flex flex-wrap items-center gap-2">
            <li>
               <Link href="/" className="text-sm font-medium hover:underline">
                  Home
               </Link>
            </li>
            <li className="flex items-center gap-2">
               <ChevronRightIcon className="h-4 w-4" />
               <Link href="/products" className="text-sm font-medium hover:underline">
                  Products
               </Link>
            </li>
            {category ? (
               <li className="flex items-center gap-2">
                  <ChevronRightIcon className="h-4 w-4" />
                  <Link
                     href={buildCatalogHref({ category: category.title })}
                     className="text-sm font-medium hover:underline"
                  >
                     {category.title}
                  </Link>
               </li>
            ) : null}
            {productType ? (
               <li className="flex items-center gap-2">
                  <ChevronRightIcon className="h-4 w-4" />
                  <Link
                     href={buildCatalogHref({ productType })}
                     className="text-sm font-medium hover:underline"
                  >
                     {productType}
                  </Link>
               </li>
            ) : null}
            <li className="flex items-center gap-2" aria-current="page">
               <ChevronRightIcon className="h-4 w-4" />
               <span className="text-sm font-medium">{product?.title}</span>
            </li>
         </ol>
      </nav>
   )
}
