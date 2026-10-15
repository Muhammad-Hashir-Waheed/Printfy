import { ContactForm } from './contact-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Contact',
   description: 'Contact us about custom packaging orders, artwork, and bulk quotes.',
}

export default function ContactPage() {
   return <ContactForm />
}
