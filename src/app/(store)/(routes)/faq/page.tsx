import { ContentPage } from '@/components/native/content-page'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
   title: 'FAQ',
   description: 'Frequently asked questions about custom packaging orders, artwork, and shipping.',
}

const FAQS: Array<{ q: string; a: string }> = [
   {
      q: 'What can I order from Joji Arts?',
      a: 'Eleven departments: packaging, food packaging, retail packaging, bags, printing, labels & stickers, marketing, corporate, custom packaging, acrylic & plastic packaging, and signage & displays — from business cards and mailer boxes to neon signs and LED video walls.',
   },
   {
      q: 'Can I add my logo?',
      a: 'Yes. Most products support custom branding. Upload high-resolution artwork (PNG, SVG, or PDF preferred) and follow the print guidelines on each product page.',
   },
   {
      q: 'How long does production take?',
      a: 'Most printed products are produced in 3–10 business days after you approve your proof; signage and LED displays take 1–6 weeks. Every product page shows its lead time.',
   },
   {
      q: 'What file specs do you need?',
      a: 'Use 300 DPI at print size when possible. Keep important text inside safe margins. Vector files (SVG/PDF) work best for logos.',
   },
   {
      q: 'How do I get a price?',
      a: 'Choose your products and options, add them to your quote list and send the request — it takes a minute. We reply within one business day with pricing, a digital proof and lead time. You only pay once you approve.',
   },
   {
      q: 'Can I order samples or prototypes?',
      a: 'Yes. Order a Prototype & Sample Box from Custom Packaging, or request a quote for a sample pack.',
   },
   {
      q: 'Do you offer bulk discounts?',
      a: 'Yes — larger runs bring the unit price down. Add the quantity you need to your quote list and we will price every tier for you. For very large runs we can quote offset pricing.',
   },
   {
      q: 'What if my order arrives damaged?',
      a: 'Contact us within 7 days with photos and your order number. We will arrange a reprint, replacement, or refund when there is a clear production or shipping defect.',
   },
   {
      q: 'How do I track my order?',
      a: 'We email you at every step: proof, production and dispatch with a tracking link. Questions? Reply to any of our emails or contact us with your order reference.',
   },
]

export default function FaqPage() {
   return (
      <ContentPage
         title="FAQ"
         description="Answers to common questions about ordering packaging, print and signage."
      >
         {FAQS.map((item) => (
            <div key={item.q}>
               <h2>{item.q}</h2>
               <p>{item.a}</p>
            </div>
         ))}

         <h2>Still need help?</h2>
         <p>
            Visit <Link href="/contact">Contact</Link> or{' '}
            <Link href="/quote">request a quote</Link> for custom work.
         </p>
      </ContentPage>
   )
}
