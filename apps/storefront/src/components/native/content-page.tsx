import { Separator } from '@/components/native/separator'
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
      <article className="mx-auto max-w-3xl px-1 py-6 sm:px-2 lg:px-0">
         <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
            {description ? (
               <p className="mt-2 text-muted-foreground">{description}</p>
            ) : null}
         </header>
         <div className="space-y-6 text-sm leading-relaxed text-foreground/90 md:text-base [&_a]:font-medium [&_a]:text-red-600 [&_a]:underline [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_li]:ml-5 [&_li]:list-disc [&_p]:text-muted-foreground [&_ul]:space-y-1">
            {children}
         </div>
         <Separator className="my-10" />
         <p className="text-sm text-muted-foreground">
            Need help?{' '}
            <Link href="/contact" className="font-medium text-red-600 underline">
               Contact us
            </Link>{' '}
            or read the{' '}
            <Link href="/faq" className="font-medium text-red-600 underline">
               FAQ
            </Link>
            .
         </p>
      </article>
   )
}
