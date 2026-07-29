import { ContentPage } from '@/components/native/content-page'
import config from '@/config/site'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
   title: 'About',
   description: `About ${config.name} — custom packaging for food, retail, and shipping.`,
}

export default function AboutPage() {
   return (
      <ContentPage
         title="About us"
         description={`${config.name} helps brands package products with custom-printed boxes, bags, mailers, and labels.`}
      >
         <h2>What we do</h2>
         <p>
            We specialize in packaging for restaurants, e-commerce brands, and retailers — from
            pizza and burger boxes to mailer boxes, shopping bags, stickers, and gift packaging.
            Upload your branding, choose sizes, and order production-ready packaging without
            dealing with multiple suppliers.
         </p>

         <h2>Why packaging matters</h2>
         <p>
            Great packaging protects products, strengthens your brand at every handoff, and turns
            unboxing into a marketing moment. We focus on practical print quality, clear lead
            times, and a catalog built around real packaging categories.
         </p>

         <h2>How ordering works</h2>
         <ul>
            <li>Browse packaging categories in our gallery</li>
            <li>Pick a product, size, and quantity</li>
            <li>Add your logo or artwork</li>
            <li>Checkout and track production & shipping</li>
         </ul>

         <h2>Get in touch</h2>
         <p>
            Have a large or custom run? Visit{' '}
            <Link href="/contact">Contact</Link>, check the <Link href="/faq">FAQ</Link>, or join
            our <Link href="/telegram">Telegram</Link> support channel.
         </p>
      </ContentPage>
   )
}
