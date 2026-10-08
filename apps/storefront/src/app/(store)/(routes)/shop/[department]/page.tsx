import { DEPARTMENTS, getDepartment } from '@/catalog'
import { Breadcrumbs } from '@/components/store/breadcrumbs'
import { CategoryCard, ProductCard, SectionHeading } from '@/components/store/cards'
import { CatalogImage } from '@/components/store/catalog-image'
import { Reveal } from '@/components/store/motion'
import { QuoteBand } from '@/components/store/quote-band'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Params = { params: { department: string } }

/** Every catalog path is pre-rendered; anything else is a real 404. */
export const dynamicParams = false

export function generateStaticParams() {
   return DEPARTMENTS.map((d) => ({ department: d.slug }))
}

export function generateMetadata({ params }: Params): Metadata {
   const dept = getDepartment(params.department)
   if (!dept) return {}
   return { title: dept.name, description: dept.description }
}

export default function DepartmentPage({ params }: Params) {
   const dept = getDepartment(params.department)
   if (!dept) notFound()

   const dark = dept.dark
   const picks = dept.categories
      .filter((c) => !c.canonical)
      .flatMap((c) => c.products.slice(0, 2))
      .slice(0, 8)

   return (
      <div style={{ ['--accent-hex' as string]: dept.accent }}>
         <section className={cn('relative overflow-hidden', dark ? 'bg-[#0f0a14] text-white' : '')}>
            {dark ? (
               <>
                  <div className="pointer-events-none absolute -left-40 -top-20 h-[520px] w-[520px] rounded-full bg-[#ff2e88]/25 blur-[120px]" />
                  <div className="pointer-events-none absolute -right-20 bottom-0 h-[420px] w-[420px] rounded-full bg-[#2ee6ff]/15 blur-[120px]" />
               </>
            ) : (
               <div
                  className="pointer-events-none absolute -right-32 -top-32 h-[560px] w-[560px] rounded-full opacity-25 blur-[110px]"
                  style={{ backgroundColor: dept.accent }}
               />
            )}
            <div className="page-shell relative grid gap-10 pb-14 pt-6 sm:pt-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pb-20">
               <div>
                  <Breadcrumbs inverted={dark} items={[{ href: '/shop', label: 'Shop' }, { label: dept.name }]} />
                  <p className="eyebrow mt-10" style={{ color: dark ? '#ff7ab8' : dept.accent }}>
                     {dept.categories.length} categories · {dept.productCount} products
                  </p>
                  <h1 className={cn('display-xl mt-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-700', dark && 'neon-text animate-flicker')}>{dept.name}</h1>
                  <p className={cn('mt-3 font-display text-2xl font-semibold tracking-tight', dark ? 'text-white/90' : 'text-ink/80')}>
                     {dept.tagline}
                  </p>
                  <p className={cn('mt-5 max-w-xl text-[16px] leading-relaxed', dark ? 'text-white/70' : 'text-muted-foreground')}>
                     {dept.description}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-2">
                     {dept.categories.map((c) => (
                        <Link
                           key={c.slug}
                           href={c.href}
                           className={cn(
                              'rounded-full border px-4 py-2 text-sm font-medium transition',
                              dark
                                 ? 'border-white/15 text-white/85 hover:border-white hover:text-white'
                                 : 'border-ink/10 bg-white hover:border-ink'
                           )}
                        >
                           {c.name}
                        </Link>
                     ))}
                  </div>
               </div>
               <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-40px_rgba(30,20,10,0.6)] animate-in fade-in-0 zoom-in-95 duration-1000 lg:aspect-[5/4]">
                  <CatalogImage image={dept.image} label={dept.name} accent={dept.accent} dark={dark} priority sizes="(min-width:1024px) 45vw, 100vw" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
               </div>
            </div>
         </section>

         <section className="page-shell py-14 sm:py-20">
            <SectionHeading eyebrow="Categories" title={`Shop ${dept.name.toLowerCase()}`} />
            <Reveal stagger={80} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
               {dept.categories.map((c, i) => (
                  <CategoryCard key={c.slug} category={c} priority={i < 3} />
               ))}
            </Reveal>
         </section>

         {picks.length ? (
            <section className="page-shell pb-6">
               <SectionHeading eyebrow="Popular picks" title={`Best of ${dept.short.toLowerCase()}`} />
               <Reveal stagger={60} className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                  {picks.map((p) => (
                     <ProductCard key={p.key} product={p} showCategory />
                  ))}
               </Reveal>
            </section>
         ) : null}

         <QuoteBand
            title={dark ? 'Planning a sign or a full fit-out?' : undefined}
            text={
               dark
                  ? 'Send us photos and measurements of your space. We will design a layout, quote it and handle fabrication and installation.'
                  : undefined
            }
         />
      </div>
   )
}
