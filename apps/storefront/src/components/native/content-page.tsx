import { Breadcrumbs } from '@/components/store/breadcrumbs'
import Link from 'next/link'
import type { ReactNode } from 'react'

export function ContentPage({
   title,
   description,
   children,
}: {
   title: string
   description?: string
   children: ReactNode
}) {
   return (
      <div className="page-shell pb-10 pt-6 sm:pt-8">
         <Breadcrumbs items={[{ label: title }]} />
         <article className="mx-auto mt-8 max-w-3xl">
            <header className="mb-10">
               <h1 className="display-lg">{title}</h1>
               {description ? (
                  <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">{description}</p>
               ) : null}
            </header>
            <div className="space-y-5 text-[15px] leading-relaxed text-foreground/90 md:text-base [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_li]:ml-5 [&_li]:list-disc [&_p]:text-muted-foreground [&_ul]:space-y-1.5 [&_ul]:text-muted-foreground">
               {children}
            </div>
            <div className="mt-14 flex flex-col gap-4 rounded-3xl bg-white p-6 ring-1 ring-black/5 sm:flex-row sm:items-center sm:justify-between">
               <p className="text-[15px]">
                  <span className="font-semibold">Need help with a project?</span>{' '}
                  <span className="text-muted-foreground">We reply within one business day.</span>
               </p>
               <div className="flex gap-2">
                  <Link href="/contact" className="inline-flex h-11 items-center rounded-full border px-5 text-sm font-semibold hover:border-ink">
                     Contact
                  </Link>
                  <Link href="/quote" className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white hover:bg-ink/85">
                     Get a quote
                  </Link>
               </div>
            </div>
         </article>
      </div>
   )
}
