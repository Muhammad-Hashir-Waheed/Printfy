import { CATALOG_STATS, DEPARTMENTS } from '@/catalog'
import { Breadcrumbs } from '@/components/store/breadcrumbs'
import { CatalogImage } from '@/components/store/catalog-image'
import { QuoteBand } from '@/components/store/quote-band'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
   title: 'Shop all products',
   description:
      'Browse every Joji Arts department — packaging, food packaging, bags, printing, labels, marketing, corporate, acrylic & plastic and signage.',
}

export default function ShopPage() {
   return (
      <>
         <section className="page-shell pb-10 pt-6 sm:pt-8">
            <Breadcrumbs items={[{ label: 'Shop' }]} />
            <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
               <div className="max-w-3xl">
                  <p className="eyebrow text-primary">The full catalog</p>
                  <h1 className="display-xl mt-4">Shop everything.</h1>
                  <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
                     {CATALOG_STATS.products} products across {CATALOG_STATS.departments} departments — all made to
                     order with your brand on them.
                  </p>
               </div>
               <nav aria-label="Jump to department" className="flex flex-wrap gap-2 lg:max-w-md lg:justify-end">
                  {DEPARTMENTS.map((d) => (
                     <a
                        key={d.slug}
                        href={`#${d.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-[13px] font-medium transition hover:border-ink"
                     >
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.accent }} />
                        {d.short}
                     </a>
                  ))}
               </nav>
            </div>
         </section>

         <div className="page-shell space-y-6">
            {DEPARTMENTS.map((d, i) => (
               <section
                  key={d.slug}
                  id={d.slug}
                  className={`scroll-mt-40 overflow-hidden rounded-[2rem] ${d.dark ? 'bg-[#0f0a14] text-white' : 'bg-white ring-1 ring-black/5'}`}
               >
                  <div className="grid lg:grid-cols-[minmax(280px,360px)_1fr]">
                     <Link href={d.href} className="group relative block min-h-[220px] overflow-hidden lg:min-h-full">
                        <CatalogImage image={d.image} label={d.name} accent={d.accent} dark={d.dark} priority={i < 2} sizes="(min-width:1024px) 360px, 100vw" className="transition duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                           <p className="eyebrow text-white/70">{String(i + 1).padStart(2, '0')}</p>
                           <h2 className="mt-1 font-display text-3xl font-extrabold leading-none tracking-tight">{d.name}</h2>
                           <p className="mt-2 text-sm text-white/80">{d.tagline}</p>
                        </div>
                     </Link>
                     <div className="p-5 sm:p-8">
                        <div className="mb-5 flex items-center justify-between gap-4">
                           <p className={`max-w-xl text-sm leading-relaxed ${d.dark ? 'text-white/70' : 'text-muted-foreground'}`}>
                              {d.description}
                           </p>
                           <Link
                              href={d.href}
                              className={`hidden shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition sm:inline-flex ${d.dark ? 'bg-white text-ink hover:bg-white/90' : 'bg-ink text-white hover:bg-ink/85'}`}
                           >
                              View all {d.productCount} <ArrowRight className="h-4 w-4" />
                           </Link>
                        </div>
                        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
                           {d.categories.map((c) => (
                              <li key={c.slug}>
                                 <Link href={c.href} className="group block">
                                    <span className={`relative block aspect-[4/3] overflow-hidden rounded-2xl ${d.dark ? 'bg-white/5' : 'bg-muted'}`}>
                                       <CatalogImage image={c.image} label={c.name} accent={d.accent} dark={d.dark} sizes="(min-width:1280px) 14vw, (min-width:640px) 28vw, 45vw" className="transition duration-700 group-hover:scale-105" />
                                    </span>
                                    <span className="mt-2 block text-sm font-semibold leading-tight group-hover:underline">{c.name}</span>
                                    <span className={`block text-xs ${d.dark ? 'text-white/55' : 'text-muted-foreground'}`}>
                                       {c.external ? 'Custom request' : `${c.products.length} products`}
                                    </span>
                                 </Link>
                              </li>
                           ))}
                        </ul>
                        <Link href={d.href} className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold sm:hidden ${d.dark ? 'text-white' : 'text-primary'}`}>
                           View all {d.productCount} products <ArrowRight className="h-4 w-4" />
                        </Link>
                     </div>
                  </div>
               </section>
            ))}
         </div>

         <QuoteBand />
      </>
   )
}
