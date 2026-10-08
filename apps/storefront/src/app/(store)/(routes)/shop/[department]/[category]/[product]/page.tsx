import {
   ALL_PRODUCTS,
   getCategory,
   getDepartment,
   getProduct,
   relatedProducts,
   startingUnitPrice,
} from '@/catalog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Breadcrumbs } from '@/components/store/breadcrumbs'
import { PriceTag, ProductCard, SectionHeading } from '@/components/store/cards'
import { Configurator } from '@/components/store/configurator'
import { Reveal } from '@/components/store/motion'
import { ProductGallery } from '@/components/store/product-gallery'
import config from '@/config/site'
import { BadgeCheck, Check, Leaf, ShieldCheck, Truck } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Params = { params: { department: string; category: string; product: string } }

/** Every catalog path is pre-rendered; anything else is a real 404. */
export const dynamicParams = false

export function generateStaticParams() {
   return ALL_PRODUCTS.map((p) => ({
      department: p.departmentSlug,
      category: p.categorySlug,
      product: p.slug,
   }))
}

export function generateMetadata({ params }: Params): Metadata {
   const product = getProduct(params.department, params.category, params.product)
   if (!product) return {}
   return {
      title: product.name,
      description: `${product.summary} Custom ${product.name.toLowerCase()} from ${config.name} — ${product.preset.leadTime} production.`,
      openGraph: product.image ? { images: [{ url: `${product.image.src}?auto=compress&w=1200` }] } : undefined,
   }
}

export default function ProductPage({ params }: Params) {
   const product = getProduct(params.department, params.category, params.product)
   const dept = getDepartment(params.department)
   const category = getCategory(params.department, params.category)
   if (!product || !dept || !category) notFound()

   const gallery = [
      { image: product.image, caption: product.name },
      { image: category.image, caption: category.name },
      { image: dept.image, caption: dept.name },
   ].filter((g, i, all) => i === 0 || (g.image && all.findIndex((x) => x.image?.src === g.image?.src) === i))

   const related = relatedProducts(product, 8)
   const { preset } = product

   const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.summary,
      category: `${dept.name} > ${category.name}`,
      brand: { '@type': 'Brand', name: config.name },
      image: product.image?.src,
      ...(config.showPrices
         ? {
              offers: {
                 '@type': 'AggregateOffer',
                 priceCurrency: config.currency,
                 lowPrice: product.quote ? product.basePrice : startingUnitPrice(product),
                 availability: 'https://schema.org/InStock',
              },
           }
         : {}),
   }

   return (
      <div className="pb-24 lg:pb-0" style={{ ['--accent-hex' as string]: dept.accent }}>
         <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
         <div className="page-shell pt-6 sm:pt-8">
            <Breadcrumbs
               items={[
                  { href: '/shop', label: 'Shop' },
                  { href: dept.href, label: dept.name },
                  { href: category.href, label: category.name },
                  { label: product.name },
               ]}
            />
         </div>

         <section className="page-shell mt-6 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
            <ProductGallery images={gallery} label={product.name} accent={dept.accent} dark={dept.dark} />

            <div>
               <p className="eyebrow" style={{ color: dept.accent }}>
                  {category.name}
               </p>
               <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-5xl">
                  {product.name}
               </h1>
               <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">{product.summary}</p>
               <PriceTag product={product} className="mt-3 text-base" />

               <ul className="mt-6 grid gap-2 border-y py-5 text-sm sm:grid-cols-2">
                  {preset.highlights.map((h) => (
                     <li key={h} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {h}
                     </li>
                  ))}
                  <li className="flex items-start gap-2">
                     <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> Lead time {preset.leadTime}
                  </li>
               </ul>

               <div className="mt-8">
                  <Configurator productKey={product.key} />
               </div>

               <ul className="mt-8 grid grid-cols-2 gap-3 text-[13px]">
                  {[
                     { icon: BadgeCheck, text: 'Free artwork check & digital proof' },
                     { icon: ShieldCheck, text: 'Reprint guarantee on print defects' },
                     { icon: Truck, text: config.showPrices ? `Free shipping over $${config.freeShippingOver}` : 'Tracked delivery to your door' },
                     { icon: Leaf, text: 'Recyclable & FSC options' },
                  ].map(({ icon: Icon, text }) => (
                     <li key={text} className="flex items-center gap-2.5 rounded-2xl bg-white p-3 ring-1 ring-black/5">
                        <Icon className="h-5 w-5 shrink-0" style={{ color: dept.accent }} /> {text}
                     </li>
                  ))}
               </ul>

               <Accordion type="multiple" defaultValue={['specs']} className="mt-8 border-t">
                  <AccordionItem value="specs">
                     <AccordionTrigger className="text-base font-semibold">Specifications</AccordionTrigger>
                     <AccordionContent>
                        <dl className="divide-y rounded-2xl border bg-white text-sm">
                           {[['Category', `${dept.name} · ${category.name}`], ...preset.specs, ['Production', preset.leadTime]].map(
                              ([k, v]) => (
                                 <div key={k} className="grid grid-cols-[140px_1fr] gap-3 px-4 py-3">
                                    <dt className="text-muted-foreground">{k}</dt>
                                    <dd className="font-medium">{v}</dd>
                                 </div>
                              )
                           )}
                        </dl>
                     </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="artwork">
                     <AccordionTrigger className="text-base font-semibold">Artwork guidelines</AccordionTrigger>
                     <AccordionContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                        <p>Send vector PDF, AI or EPS files where possible. Raster images should be 300 dpi at final size.</p>
                        <p>Add 3 mm bleed on every edge and keep text 3 mm inside the trim line. Convert fonts to outlines.</p>
                        <p>Not sure? Upload what you have — our pre-press team checks every file and sends a free proof.</p>
                     </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="delivery">
                     <AccordionTrigger className="text-base font-semibold">Delivery & returns</AccordionTrigger>
                     <AccordionContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                        <p>
                           Production takes {preset.leadTime} after you approve your proof.{' '}
                           {config.showPrices
                              ? `Shipping is a flat $${config.shippingFlat}, free on orders over $${config.freeShippingOver}.`
                              : 'Delivery options and costs are included in your quote.'}
                        </p>
                        <p>Custom printed items can&apos;t be returned, but if anything arrives damaged or misprinted we reprint it free.</p>
                     </AccordionContent>
                  </AccordionItem>
               </Accordion>
            </div>
         </section>

         {related.length ? (
            <section className="page-shell mt-20 sm:mt-28">
               <SectionHeading
                  eyebrow="You may also like"
                  title={`More ${category.name.toLowerCase()}`}
                  action={{ href: category.href, label: 'View all' }}
               />
               <Reveal stagger={60} className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                  {related.map((p) => (
                     <ProductCard key={p.key} product={p} />
                  ))}
               </Reveal>
            </section>
         ) : null}
      </div>
   )
}
