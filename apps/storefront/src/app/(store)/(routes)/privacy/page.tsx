import { ContentPage } from '@/components/native/content-page'
import config from '@/config/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Privacy Policy',
   description: `How ${config.name} collects, uses, and protects your personal information.`,
}

export default function PrivacyPolicyPage() {
   return (
      <ContentPage
         title="Privacy Policy"
         description="Last updated: July 2026. This policy explains how we handle your data when you browse or order custom packaging."
      >
         <h2>1. Information We Collect</h2>
         <p>
            When you place an order, create an account, or contact support, we may collect your
            name, email address, phone number, shipping address, billing details, and order
            history. We also collect basic technical data such as browser type, device, and pages
            visited to keep the storefront secure and reliable.
         </p>

         <h2>2. How We Use Your Information</h2>
         <ul>
            <li>Process, print, and ship packaging orders</li>
            <li>Send order confirmations, production updates, and delivery notices</li>
            <li>Provide customer support and resolve issues</li>
            <li>Improve our catalog, pricing tools, and website experience</li>
            <li>Prevent fraud and protect our platform</li>
         </ul>

         <h2>3. Payments</h2>
         <p>
            Payment card details are processed by our payment providers. We do not store full card
            numbers on our servers. Payment providers may process data according to their own
            privacy policies.
         </p>

         <h2>4. Sharing</h2>
         <p>
            We share information only with trusted partners needed to fulfill orders — such as
            printers, logistics carriers, email providers, and payment processors. We do not sell
            your personal information.
         </p>

         <h2>5. Data Retention</h2>
         <p>
            We keep order and account records as long as needed for fulfillment, accounting, legal
            compliance, and customer support, then delete or anonymize them when no longer
            required.
         </p>

         <h2>6. Your Choices</h2>
         <p>
            You may request access, correction, or deletion of your personal data by emailing{' '}
            <a href="mailto:support@printfy.com">support@printfy.com</a>. You can also unsubscribe from
            marketing emails at any time.
         </p>

         <h2>7. Contact</h2>
         <p>
            Questions about this Privacy Policy? Visit our{' '}
            <a href="/contact">Contact</a> page or email{' '}
            <a href="mailto:support@printfy.com">support@printfy.com</a>.
         </p>
      </ContentPage>
   )
}
