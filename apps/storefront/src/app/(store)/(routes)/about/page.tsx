import { ContentPage } from '@/components/native/content-page'
import config from '@/config/site'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
   title: 'About',
   description: `About ${config.name} — custom packaging for cosmetics, hotels, perfume, luxury boxes, corrugated cartons, and 3D branding.`,
}

export default function AboutPage() {
   return (
      <ContentPage
         title="About us"
         description={`${config.name} prints packaging for beauty brands, hotels, fragrance houses, and storefronts.`}
      >
         <h2>What we do</h2>
         <p>
            We specialize in packaging across six lines: cosmetics, hotel and food service,
            perfume and makeup boxes, rigid luxury boxes, corrugated shipping, and 3D branding
            boards. Upload your branding, choose sizes, and order production-ready packaging
            without juggling suppliers.
         </p>

         <h2>Why packaging matters</h2>
         <p>
            Great packaging protects products, strengthens your brand at every handoff, and turns
            unboxing into a marketing moment. We focus on practical print quality, clear lead
            times, and a catalog built around real packaging categories.
         </p>

         <h2>How ordering works</h2>
         <ul>
            <li>Browse a packaging line in our gallery</li>
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
