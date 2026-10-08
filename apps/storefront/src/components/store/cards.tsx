import { startingUnitPrice, type Category, type Department, type Product } from '@/catalog'
import config from '@/config/site'
import { roundMoney, unitMoney } from '@/lib/money'
import { cn } from '@/lib/utils'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

import { CatalogImage } from './catalog-image'

export function PriceTag({ product, className }: { product: Product; className?: string }) {
   if (!config.showPrices) {
      return (
         <p className={cn('inline-flex items-center gap-1.5 text-[13px] font-semibold', className)}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: product.accent }} />
            {product.quote ? 'Made to order · request a quote' : 'Price on request'}
         </p>
      )
   }
   if (product.quote) {
      return (
         <p className={cn('text-sm', className)}>
            <span className="text-muted-foreground">From </span>
            <span className="font-semibold">{roundMoney(product.basePrice)}</span>
            <span className="text-muted-foreground"> · quote</span>
         </p>
      )
   }
   return (
      <p className={cn('text-sm', className)}>
         <span className="text-muted-foreground">From </span>
         <span className="font-semibold">{unitMoney(startingUnitPrice(product))}</span>
         <span className="text-muted-foreground"> / {product.preset.unit}</span>
      </p>
   )
}

export function ProductCard({
   product,
   priority,
   showCategory,
}: {
   product: Product
   priority?: boolean
   showCategory?: boolean
}) {
   return (
      <Link href={product.href} className="group block">
         <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-[0_0_0_rgba(0,0,0,0)] transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[0_24px_40px_-24px_rgba(30,20,10,.55)]">
            <CatalogImage
               image={product.image}
               label={product.name}
               accent={product.accent}
               dark={product.dark}
               priority={priority}
               sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw"
               className="transition duration-700 ease-out group-hover:scale-[1.06]"
            />
            {product.quote ? (
               <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                  Made to order
               </span>
            ) : null}
            <span className="absolute bottom-3 right-3 grid h-9 w-9 translate-y-2 place-items-center rounded-full bg-white text-ink opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
               <ArrowUpRight className="h-4 w-4" />
            </span>
         </div>
         <div className="pt-3">
            {showCategory ? (
               <p className="mb-0.5 text-xs font-medium" style={{ color: product.accent }}>
                  {product.categoryName}
               </p>
            ) : null}
            <h3 className="font-sans text-[15px] font-semibold leading-snug transition group-hover:text-primary">
               {product.name}
            </h3>
            <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-muted-foreground">{product.summary}</p>
            <PriceTag product={product} className="mt-1.5" />
         </div>
      </Link>
   )
}

export function CategoryCard({ category, priority }: { category: Category; priority?: boolean }) {
   return (
      <Link href={category.href} className="group relative block overflow-hidden rounded-3xl bg-muted">
         <div className="relative aspect-[5/4]">
            <CatalogImage
               image={category.image}
               label={category.name}
               accent={category.accent}
               dark={category.dark}
               priority={priority}
               sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
               className="transition duration-700 ease-out group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
         </div>
         <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
            <div className="min-w-0">
               <h3 className="font-display text-xl font-bold leading-tight sm:text-2xl">{category.name}</h3>
               <p className="mt-1 line-clamp-1 text-sm text-white/75">
                  {category.external
                     ? category.blurb
                     : `${category.products.length} products${config.showPrices && category.fromPrice ? ` · from ${unitMoney(category.fromPrice)}` : ''}`}
               </p>
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-ink transition duration-300 group-hover:rotate-[-45deg]">
               <ArrowRight className="h-4 w-4" />
            </span>
         </div>
      </Link>
   )
}

export function DepartmentTile({ department }: { department: Department }) {
   return (
      <Link href={department.href} className="group flex flex-col items-center gap-3 text-center">
         <span
            className="relative block aspect-square w-full overflow-hidden rounded-full ring-1 ring-black/5 transition duration-500 group-hover:ring-4"
            style={{ ['--tw-ring-color' as string]: department.accent }}
         >
            <CatalogImage
               image={department.image}
               label={department.name}
               accent={department.accent}
               dark={department.dark}
               sizes="(min-width: 1024px) 12vw, 30vw"
               className="transition duration-700 group-hover:scale-110"
            />
         </span>
         <span className="text-[13.5px] font-semibold leading-tight sm:text-sm">{department.name}</span>
      </Link>
   )
}

export function SectionHeading({
   eyebrow,
   title,
   description,
   action,
   className,
}: {
   eyebrow?: string
   title: React.ReactNode
   description?: React.ReactNode
   action?: { href: string; label: string }
   className?: string
}) {
   return (
      <div className={cn('mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between', className)}>
         <div className="max-w-2xl">
            {eyebrow ? <p className="eyebrow mb-3 text-primary">{eyebrow}</p> : null}
            <h2 className="display-lg">{title}</h2>
            {description ? <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground sm:text-base">{description}</p> : null}
         </div>
         {action ? (
            <Link
               href={action.href}
               className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold transition hover:border-ink sm:self-auto"
            >
               {action.label}
               <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
         ) : null}
      </div>
   )
}
