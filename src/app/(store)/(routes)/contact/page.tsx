import { ContactForm } from './contact-form'
import config from '@/config/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Contact',
   description: 'Contact us about custom packaging orders, artwork, and bulk quotes.',
}

export default function ContactPage() {
   const { address } = config
   /** Business details for search engines — address, map and pin all come from the site config. */
   const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: config.name,
      description: config.description,
      url: config.url,
      email: config.email,
      ...(config.phone ? { telephone: config.phone } : {}),
      address: {
         '@type': 'PostalAddress',
         streetAddress: `${address.line1}, ${address.line2}`,
         addressLocality: address.city,
         addressRegion: address.region,
         addressCountry: address.countryCode,
      },
      geo: { '@type': 'GeoCoordinates', latitude: address.geo.lat, longitude: address.geo.lng },
      hasMap: address.mapsUrl,
   }

   return (
      <>
         <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
         <ContactForm />
      </>
   )
}
