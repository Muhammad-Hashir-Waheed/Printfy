import { Breadcrumbs } from '@/components/store/breadcrumbs'
import { QuoteForm } from '@/components/store/quote-form'
import config from '@/config/site'
import { Clock, MessageCircle, PenTool, Ruler } from 'lucide-react'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
   title: 'Request a quote',
   description: 'Custom sizes, special finishes, bulk orders and signage projects — get a tailored quote from Joji Arts within one business day.',
}

export default function QuotePage() {
   return (
      <div className="page-shell pb-10 pt-6 sm:pt-8">
         <Breadcrumbs items={[{ label: 'Request a quote' }]} />
         <div className="mt-8 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
               <p className="eyebrow text-primary">Custom projects</p>
               <h1 className="display-xl mt-4">Let&apos;s build something.</h1>
               <p className="mt-5 max-w-md text-[17px] leading-relaxed text-muted-foreground">
                  Tell us about your packaging, print or signage project. A specialist will come back with pricing,
                  samples and a timeline.
               </p>
               <ul className="mt-10 space-y-5">
                  {[
                     { icon: Clock, title: 'Reply within 1 business day', text: 'Pricing, options and lead times.' },
                     { icon: Ruler, title: 'Any size, any material', text: 'Engineered around your product or space.' },
                     { icon: PenTool, title: 'Design support included', text: 'Mock-ups and proofs before production.' },
                     { icon: MessageCircle, title: 'Talk to a human', text: `Prefer email? Write to ${config.email}` },
                  ].map(({ icon: Icon, title, text }) => (
                     <li key={title} className="flex gap-4">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-ink text-white">
                           <Icon className="h-5 w-5" />
                        </span>
                        <span>
                           <span className="block font-semibold">{title}</span>
                           <span className="block text-sm text-muted-foreground">{text}</span>
                        </span>
                     </li>
                  ))}
               </ul>
            </div>
            <Suspense fallback={<div className="h-[640px] animate-pulse rounded-[2rem] bg-muted" />}>
               <QuoteForm />
            </Suspense>
         </div>
      </div>
   )
}
