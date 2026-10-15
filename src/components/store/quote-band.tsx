import { ArrowRight, Clock, PenTool, Ruler } from 'lucide-react'
import Link from 'next/link'

export function QuoteBand({ title, text }: { title?: string; text?: string }) {
   return (
      <section className="page-shell mt-20 sm:mt-24">
         <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-12 text-white sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-black/10 blur-2xl" />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
               <div>
                  <p className="eyebrow text-white/70">Custom projects</p>
                  <h2 className="display-lg mt-3">{title ?? 'Something specific in mind? Let’s quote it.'}</h2>
                  <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/80 sm:text-base">
                     {text ??
                        'Custom sizes, special finishes, large volumes or a full signage fit-out — send us the details and a specialist will reply within one business day.'}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                     <Link
                        href="/quote"
                        className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-[15px] font-semibold text-ink transition hover:bg-white/90"
                     >
                        Request a quote <ArrowRight className="h-4 w-4" />
                     </Link>
                     <Link
                        href="/contact"
                        className="inline-flex h-12 items-center rounded-full border border-white/40 px-7 text-[15px] font-semibold transition hover:bg-white/10"
                     >
                        Talk to us
                     </Link>
                  </div>
               </div>
               <ul className="grid gap-3 text-[15px]">
                  {[
                     { icon: Clock, title: 'Reply within 1 business day', text: 'Real people, real pricing.' },
                     { icon: Ruler, title: 'Any size, shape or finish', text: 'Engineered around your product.' },
                     { icon: PenTool, title: 'Free artwork check', text: 'We fix issues before print.' },
                  ].map(({ icon: Icon, title: t, text: d }) => (
                     <li key={t} className="flex items-start gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-primary">
                           <Icon className="h-5 w-5" />
                        </span>
                        <span>
                           <span className="block font-semibold">{t}</span>
                           <span className="block text-sm text-white/75">{d}</span>
                        </span>
                     </li>
                  ))}
               </ul>
            </div>
         </div>
      </section>
   )
}
