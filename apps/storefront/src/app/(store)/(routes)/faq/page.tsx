import { ContentPage } from '@/components/native/content-page'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
   title: 'FAQ',
   description: 'Frequently asked questions about custom packaging orders, artwork, and shipping.',
}

const FAQS: Array<{ q: string; a: string }> = [
   {
      q: 'What packaging can I order?',
      a: 'Food packaging (pizza boxes, burger boxes, fries cartons, cups, trays), shipping packaging (mailers, shipping boxes), retail packaging (shopping bags, gift boxes, rigid boxes), and accessories (stickers, labels, tissue, inserts).',
   },
   {
      q: 'Can I add my logo?',
      a: 'Yes. Most products support custom branding. Upload high-resolution artwork (PNG, SVG, or PDF preferred) and follow the print guidelines on each product page.',
   },
   {
      q: 'How long does production take?',
      a: 'Typical lead time is a few business days after artwork approval, then shipping time depends on your destination. Exact estimates appear on product pages.',
   },
   {
      q: 'What file specs do you need?',
      a: 'Use 300 DPI at print size when possible. Keep important text inside safe margins. Vector files (SVG/PDF) work best for logos.',
   },
   {
      q: 'Can I order samples?',
      a: 'Yes for many items — start with a small quantity on the product page, or contact us for a sample pack quote.',
   },
   {
      q: 'Do you offer bulk discounts?',
      a: 'Larger quantities usually lower the unit price. For very large runs, contact support for a custom quote.',
   },
   {
      q: 'What if my order arrives damaged?',
      a: 'Contact us within 7 days with photos and your order number. We will arrange a reprint, replacement, or refund when there is a clear production or shipping defect.',
   },
   {
      q: 'How do I track my order?',
      a: 'After checkout you receive email updates. You can also reach support with your order ID via Contact or Telegram.',
   },
]

export default function FaqPage() {
   return (
      <ContentPage
         title="FAQ"
         description="Answers to common questions about ordering custom packaging."
      >
         {FAQS.map((item) => (
            <div key={item.q}>
               <h2>{item.q}</h2>
               <p>{item.a}</p>
            </div>
         ))}

         <h2>Still need help?</h2>
         <p>
            Visit <Link href="/contact">Contact</Link> or join{' '}
            <Link href="/telegram">Telegram</Link> for support.
         </p>
      </ContentPage>
   )
}
