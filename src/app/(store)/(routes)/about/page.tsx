import { CATALOG_STATS, DEPARTMENTS } from '@/catalog'
import { ContentPage } from '@/components/native/content-page'
import config from '@/config/site'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
   title: 'About',
   description: `About ${config.name} — packaging, printing, labels, acrylic boxes and signage under one roof.`,
}

export default function AboutPage() {
   return (
      <ContentPage
         title="About Joji Arts"
         description="We help brands look their best everywhere a customer meets them — on the shelf, at the door, on the street and on the wall."
      >
         <h2>What we do</h2>
         <p>
            Joji Arts designs and produces packaging, print and signage. Our catalog covers {CATALOG_STATS.products}{' '}
            products across {CATALOG_STATS.departments} departments, so you can brand a box, a business card, a shop
            front and an exhibition booth with one team and one consistent look.
         </p>
         <ul>
            {DEPARTMENTS.map((d) => (
               <li key={d.slug}>
                  <Link href={d.href}>{d.name}</Link> — {d.tagline.toLowerCase()}
               </li>
            ))}
         </ul>

         <h2>How ordering works</h2>
         <ul>
            <li>Choose a product and set size, material, finish and quantity — prices update instantly.</li>
            <li>Upload your artwork, ask our designers to create it, or send it later.</li>
            <li>We check every file and send a digital proof with your invoice.</li>
            <li>Approve and pay — we produce, deliver and, for signage, install.</li>
         </ul>

         <h2>Custom work is our favourite work</h2>
         <p>
            Unusual size? Special finish? A full storefront or office fit-out? <Link href="/quote">Request a quote</Link>{' '}
            and a specialist will reply within one business day, or <Link href="/contact">get in touch</Link>.
         </p>
      </ContentPage>
   )
}
