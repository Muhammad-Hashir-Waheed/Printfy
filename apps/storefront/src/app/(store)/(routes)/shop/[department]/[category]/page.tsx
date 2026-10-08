import { DEPARTMENTS, getCategory, getDepartment } from '@/catalog'
import { Breadcrumbs } from '@/components/store/breadcrumbs'
import { CatalogImage } from '@/components/store/catalog-image'
import { ProductGrid } from '@/components/store/product-grid'
import { QuoteBand } from '@/components/store/quote-band'
import { unitMoney } from '@/lib/money'
import config from '@/config/site'
import { cn } from '@/lib/utils'
import { Info } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Params = { params: { department: string; category: string } }

/** Every catalog path is pre-rendered; anything else is a real 404. */
export const dynamicParams = false

export function generateStaticParams() {
   return DEPARTMENTS.flatMap((d) =>
      d.categories.filter((c) => !c.external).map((c) => ({ department: d.slug, category: c.slug }))
   )
}

export function generateMetadata({ params }: Params): Metadata {
   const category = getCategory(params.department, params.category)
   if (!category) return {}
   return {
      title: `${category.name} — ${category.departmentName}`,
      description: `${category.blurb} Shop ${category.products.length} custom ${category.name.toLowerCase()} at Joji Arts.`,
      alternates: category.canonical ? { canonical: category.canonical.href } : undefined,
   }
}

export default function CategoryPage({ params }: Params) {
   const dept = getDepartment(params.department)
   const category = getCategory(params.department, params.category)
   if (!dept || !category || category.external) notFound()

   const dark = dept.dark
   const canonicalDept = category.canonical ? getDepartment(category.canonical.departmentSlug) : null

   return (
      <div style={{ ['--accent-hex' as string]: dept.accent }}>
         <section className={cn('relative overflow-hidden', dark && 'bg-[#0f0a14] text-white')}>
            {dark ? (
               <div className="pointer-events-none absolute -left-32 -top-32 h-[460px] w-[460px] rounded-full bg-[#ff2e88]/20 blur-[120px]" />
            ) : null}
            <div className="page-shell relative pb-10 pt-6 sm:pt-8">
               <Breadcrumbs
                  inverted={dark}
                  items={[
                     { href: '/shop', label: 'Shop' },
                     { href: dept.href, label: dept.name },
                     { label: category.name },
                  ]}
               />
               <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
                  <div>
                     <p className="eyebrow" style={{ color: dark ? '#ff7ab8' : dept.accent }}>
                        {dept.name}
                     </p>
                     <h1 className={cn('display-xl mt-3', dark && 'neon-text')}>{category.name}</h1>
                     <p className={cn('mt-4 max-w-xl text-[16px] leading-relaxed', dark ? 'text-white/70' : 'text-muted-foreground')}>
                        {category.blurb}{' '}
                        {config.showPrices && category.fromPrice ? (
                           <>
                              Prices from <strong className={dark ? 'text-white' : 'text-foreground'}>{unitMoney(category.fromPrice)}</strong>.
                           </>
                        ) : null}
                     </p>
                     {category.canonical && canonicalDept ? (
                        <p className={cn('mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm', dark ? 'bg-white/10' : 'bg-muted')}>
                           <Info className="h-4 w-4" /> Same range as{' '}
                           <Link href={category.canonical.href} className="font-semibold underline">
                              {canonicalDept.name} → {category.name}
                           </Link>
                        </p>
                     ) : null}
                  </div>
                  <div className="relative hidden aspect-[16/9] overflow-hidden rounded-[1.75rem] lg:block">
                     <CatalogImage image={category.image} label={category.name} accent={dept.accent} dark={dark} priority sizes="40vw" />
                  </div>
               </div>
            </div>
         </section>

         <section className="page-shell pt-8">
            <ProductGrid products={category.products} />
         </section>

         <section className="page-shell mt-16">
            <p className="eyebrow mb-4 text-muted-foreground">More in {dept.name}</p>
            <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
               {dept.categories
                  .filter((c) => c.slug !== category.slug)
                  .map((c) => (
                     <Link
                        key={c.slug}
                        href={c.href}
                        className="group flex shrink-0 items-center gap-3 rounded-full border bg-white py-1.5 pl-1.5 pr-4 transition hover:border-ink"
                     >
                        <span className="relative h-9 w-9 overflow-hidden rounded-full">
                           <CatalogImage image={c.image} label={c.name} accent={dept.accent} dark={dark} sizes="36px" />
                        </span>
                        <span className="text-sm font-medium">{c.name}</span>
                     </Link>
                  ))}
            </div>
         </section>

         <QuoteBand />
      </div>
   )
}
