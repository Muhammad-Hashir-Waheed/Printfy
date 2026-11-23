import type { SeoContent } from '@/catalog/seo-content'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { JsonLd } from '@/lib/seo'
import { cn } from '@/lib/utils'
import { RichText } from '@/components/store/rich-text'

/** Buying guide and FAQs below a department or category's products, with FAQPage schema. */
export function SeoContentSection({ content, dark }: { content: SeoContent; dark?: boolean }) {
   const faqJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: content.faqs.map((f) => ({
         '@type': 'Question',
         name: f.q,
         acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
   }

   return (
      <section className="page-shell mt-16">
         <JsonLd data={faqJsonLd} />
         <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
               <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{content.heading}</h2>
               <div className={cn('mt-4 space-y-4 text-[15px] leading-relaxed', dark ? 'text-white/70' : 'text-muted-foreground')}>
                  {content.paragraphs.map((p, i) => (
                     <p key={i}>
                        <RichText text={p} linkClassName={dark ? 'text-white' : 'text-foreground'} />
                     </p>
                  ))}
               </div>
            </div>
            <div>
               <h2 className="font-display text-xl font-bold tracking-tight">Frequently asked questions</h2>
               <Accordion type="multiple" className="mt-3 border-t">
                  {content.faqs.map((f, i) => (
                     <AccordionItem key={i} value={`faq-${i}`}>
                        <AccordionTrigger className="text-left text-base font-semibold">{f.q}</AccordionTrigger>
                        <AccordionContent
                           className={cn('text-sm leading-relaxed', dark ? 'text-white/70' : 'text-muted-foreground')}
                        >
                           {f.a}
                        </AccordionContent>
                     </AccordionItem>
                  ))}
               </Accordion>
            </div>
         </div>
      </section>
   )
}
