'use client'

import { DEPARTMENTS } from '@/catalog'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ArrowLeft, ChevronRight, HelpCircle, Info, MessageSquareQuote, Newspaper } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'

import { BrandLogo } from './brand-logo'
import { CatalogImage } from './catalog-image'

export function MobileMenu({ trigger }: { trigger: ReactNode }) {
   const [open, setOpen] = useState(false)
   const [deptSlug, setDeptSlug] = useState<string | null>(null)
   const pathname = usePathname()

   useEffect(() => {
      setOpen(false)
   }, [pathname])

   useEffect(() => {
      if (!open) setDeptSlug(null)
   }, [open])

   const dept = DEPARTMENTS.find((d) => d.slug === deptSlug)

   return (
      <Sheet open={open} onOpenChange={setOpen}>
         <SheetTrigger asChild>{trigger}</SheetTrigger>
         <SheetContent side="left" className="flex w-[88vw] max-w-sm flex-col gap-0 p-0">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="flex h-16 items-center border-b px-5">
               <Link href="/" onClick={() => setOpen(false)}>
                  <BrandLogo />
               </Link>
            </div>

            <div className="flex-1 overflow-y-auto">
               {dept ? (
                  <div className="animate-in slide-in-from-right-4 fade-in-0 duration-200">
                     <button
                        type="button"
                        onClick={() => setDeptSlug(null)}
                        className="flex w-full items-center gap-2 px-5 py-4 text-sm font-semibold text-muted-foreground"
                     >
                        <ArrowLeft className="h-4 w-4" /> All departments
                     </button>
                     <Link
                        href={dept.href}
                        className="relative mx-5 mb-4 block h-32 overflow-hidden rounded-2xl"
                     >
                        <CatalogImage image={dept.image} label={dept.name} accent={dept.accent} dark={dept.dark} sizes="360px" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                        <div className="absolute bottom-3 left-4 right-4 text-white">
                           <p className="font-display text-xl font-bold">{dept.name}</p>
                           <p className="text-xs text-white/80">Shop all {dept.productCount} products →</p>
                        </div>
                     </Link>
                     <ul className="px-3 pb-6">
                        {dept.categories.map((cat, i) => (
                           <li
                              key={cat.slug}
                              className="animate-in fade-in-0 slide-in-from-right-3 duration-500"
                              style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}
                           >
                              <Link
                                 href={cat.href}
                                 className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-muted"
                              >
                                 <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                                    <CatalogImage image={cat.image} label={cat.name} accent={dept.accent} dark={dept.dark} sizes="48px" />
                                 </span>
                                 <span className="flex-1">
                                    <span className="block text-[15px] font-medium">{cat.name}</span>
                                    {cat.products.length ? (
                                       <span className="block text-xs text-muted-foreground">
                                          {cat.products.length} products
                                       </span>
                                    ) : null}
                                 </span>
                                 <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              </Link>
                           </li>
                        ))}
                     </ul>
                  </div>
               ) : (
                  <div className="animate-in fade-in-0 duration-200">
                     <p className="eyebrow px-5 pb-2 pt-5 text-muted-foreground">Shop by department</p>
                     <ul className="px-3">
                        {DEPARTMENTS.map((d, i) => (
                           <li
                              key={d.slug}
                              className="animate-in fade-in-0 slide-in-from-left-3 duration-500"
                              style={{ animationDelay: `${80 + i * 35}ms`, animationFillMode: 'both' }}
                           >
                              <button
                                 type="button"
                                 onClick={() => setDeptSlug(d.slug)}
                                 className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left hover:bg-muted"
                              >
                                 <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                                    <CatalogImage image={d.image} label={d.name} accent={d.accent} dark={d.dark} sizes="40px" />
                                 </span>
                                 <span className="flex-1 text-[15px] font-medium">{d.name}</span>
                                 <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.accent }} />
                                 <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              </button>
                           </li>
                        ))}
                     </ul>
                     <div className="mx-5 my-4 border-t" />
                     <ul className="space-y-1 px-3 pb-8 text-[15px]">
                        {[
                           { href: '/quote', label: 'Request a quote', icon: MessageSquareQuote },
                           { href: '/contact', label: 'Help & contact', icon: HelpCircle },
                           { href: '/about', label: 'About Joji Arts', icon: Info },
                           { href: '/blog', label: 'Ideas & guides', icon: Newspaper },
                        ].map(({ href, label, icon: Icon }) => (
                           <li key={href}>
                              <Link href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-muted">
                                 <Icon className="h-5 w-5 text-muted-foreground" /> {label}
                              </Link>
                           </li>
                        ))}
                     </ul>
                  </div>
               )}
            </div>
         </SheetContent>
      </Sheet>
   )
}
