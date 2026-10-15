import { DEPARTMENTS, searchCategories, searchProducts } from '@/catalog'
import { Breadcrumbs } from '@/components/store/breadcrumbs'
import { CatalogImage } from '@/components/store/catalog-image'
import { ProductGrid } from '@/components/store/product-grid'
import { SearchBox } from '@/components/store/search-box'
import type { Metadata } from 'next'
import Link from 'next/link'

type Props = { searchParams: { q?: string } }

export function generateMetadata({ searchParams }: Props): Metadata {
   const q = searchParams.q?.trim()
   return { title: q ? `Search: ${q}` : 'Search', robots: { index: false } }
}

export default function SearchPage({ searchParams }: Props) {
   const q = (searchParams.q ?? '').trim().slice(0, 80)
   const products = q ? searchProducts(q, 120) : []
   const categories = q ? searchCategories(q, 8) : []

   return (
      <div className="page-shell pb-10 pt-6 sm:pt-8">
         <Breadcrumbs items={[{ label: 'Search' }]} />
         <h1 className="display-lg mt-6">{q ? <>Results for “{q}”</> : 'Search the catalog'}</h1>
         <SearchBox className="mt-6 max-w-2xl" />

         {categories.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
               {categories.map((c) => (
                  <Link
                     key={c.key}
                     href={c.href}
                     className="flex items-center gap-3 rounded-full border bg-white py-1.5 pl-1.5 pr-4 transition hover:border-ink"
                  >
                     <span className="relative h-9 w-9 overflow-hidden rounded-full">
                        <CatalogImage image={c.image} label={c.name} accent={c.accent} dark={c.dark} sizes="36px" />
                     </span>
                     <span className="text-sm">
                        <span className="font-semibold">{c.name}</span>{' '}
                        <span className="text-muted-foreground">in {c.departmentName}</span>
                     </span>
                  </Link>
               ))}
            </div>
         ) : null}

         <div className="mt-10">
            {products.length ? (
               <ProductGrid products={products} showCategory />
            ) : q ? (
               <div className="rounded-[2rem] border bg-white p-10 text-center">
                  <h2 className="font-display text-2xl font-bold">No exact matches</h2>
                  <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                     We make plenty of things that aren&apos;t in the catalog. Tell us what you need and we&apos;ll quote it.
                  </p>
                  <Link href="/quote" className="mt-6 inline-flex h-12 items-center rounded-full bg-primary px-7 font-semibold text-white">
                     Request a quote
                  </Link>
               </div>
            ) : (
               <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {DEPARTMENTS.map((d) => (
                     <Link key={d.slug} href={d.href} className="group relative aspect-[4/3] overflow-hidden rounded-3xl">
                        <CatalogImage image={d.image} label={d.name} accent={d.accent} dark={d.dark} sizes="25vw" className="transition duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                        <p className="absolute bottom-4 left-4 right-4 font-display text-lg font-bold text-white">{d.name}</p>
                     </Link>
                  ))}
               </div>
            )}
         </div>
      </div>
   )
}
