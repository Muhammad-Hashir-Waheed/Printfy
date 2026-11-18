import { ContactForm } from './contact-form'
import { JsonLd, localBusinessJsonLd } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Contact Us — Lahore Office',
   description: 'Visit or contact Joji Arts at Lakshmi Chowk, Lahore — call or WhatsApp 0315-61-111-81 about custom packaging, printing, signage and bulk quotes.',
}

export default function ContactPage() {
   return (
      <>
         <JsonLd data={localBusinessJsonLd()} />
         <ContactForm />
      </>
   )
}
