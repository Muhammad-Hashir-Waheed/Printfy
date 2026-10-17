import { DEPARTMENTS, getCategory, SIGNATURE_CATEGORIES } from '@/catalog'
import { ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'

import { CatalogImage } from './catalog-image'

/** Branded 404 — gets lost visitors back to the bestsellers and departments. */
export function NotFoundView() {
   const bestsellers = SIGNATURE_CATEGORIES.map((key) => {
      const [d, c] = key.split('/')
      return getCategory(d, c)
   }).filter(Boolean)

   return (
      <section className="page-shell py-14 sm:py-20">
         <div className="mx-auto max-w-2xl text-center">
            <p className="font-display text-7xl font-extrabold leading-none tracking-tight text-primary sm:text-8xl">404</p>
            <h1 className="display-lg mt-4">This page took a detour.</h1>
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground sm:text-base">
               The link may be old or the product may have moved. Here are the best places to pick up where you left off.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
               <Link href="/" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-7 font-semibold text-white transition hover:bg-ink/90">
                  Go home
               </Link>
               <Link href="/shop" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-7 font-semibold transition hover:border-ink">
                  Browse the shop
               </Link>
               <Link href="/quote" className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 font-semibold text-primary transition hover:bg-primary/5">
                  Get a quote <ArrowRight className="h-4 w-4" />
               </Link>
            </div>
         </div>

         <div className="mx-auto mt-14 max-w-4xl">
            <p className="eyebrow mb-4 text-center text-[#a8792a]">★ Our bestsellers</p>
            <ul className="grid gap-3 sm:grid-cols-3">
               {bestsellers.map((c) => (
                  <li key={c!.key}>
                     <Link href={c!.href} className="group relative block aspect-[4/3] overflow-hidden rounded-3xl bg-muted">
                        <CatalogImage image={c!.image} label={c!.name} accent={c!.accent} dark={c!.dark} sizes="(min-width:640px) 30vw, 100vw" className="transition duration-700 group-hover:scale-105" />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[linear-gradient(110deg,#F7E3A1,#D9AE4F_45%,#FFF1C4_60%,#C99A3E)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#3b2a0c]">
                           <Star className="h-3 w-3 fill-current" /> Bestseller
                        </span>
                        <span className="absolute inset-x-0 bottom-0 p-4 font-display text-xl font-bold text-white">{c!.name}</span>
                     </Link>
                  </li>
               ))}
            </ul>

            <p className="eyebrow mb-4 mt-12 text-center text-muted-foreground">Or browse a department</p>
            <ul className="flex flex-wrap justify-center gap-2">
               {DEPARTMENTS.map((d) => (
                  <li key={d.slug}>
                     <Link
                        href={d.href}
                        className="inline-flex h-10 items-center gap-2 rounded-full border border-ink/10 bg-white px-4 text-sm font-medium transition hover:border-ink"
                     >
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.accent }} />
                        {d.name}
                     </Link>
                  </li>
               ))}
            </ul>
         </div>
      </section>
   )
}
