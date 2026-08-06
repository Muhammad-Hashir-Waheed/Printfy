import { ContentPage } from '@/components/native/content-page'
import config from '@/config/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Terms & Conditions',
   description: `Terms governing use of ${config.name} and custom packaging orders.`,
}

export default function TermsPage() {
   return (
      <ContentPage
         title="Terms & Conditions"
         description="Last updated: July 2026. By using this storefront or placing an order, you agree to these terms."
      >
         <h2>1. Overview</h2>
         <p>
            {config.name} offers custom packaging products for food service, retail, and shipping.
            These Terms & Conditions govern browsing, ordering, payment, production, and delivery.
         </p>

         <h2>2. Orders & Custom Artwork</h2>
         <ul>
            <li>Orders become binding once payment is confirmed.</li>
            <li>
               You confirm you own or have rights to any logos, artwork, or text uploaded for
               printing.
            </li>
            <li>
               We may reject artwork that is illegal, infringing, or unsuitable for production.
            </li>
            <li>
               Proof approval (when offered) is final — changes after approval may require a new
               order.
            </li>
         </ul>

         <h2>3. Pricing & Payment</h2>
         <p>
            Prices are shown in the catalog and may change without notice for future orders.
            Taxes, shipping, and rush fees (if any) are calculated at checkout. Full payment is
            required before production unless otherwise agreed in writing.
         </p>

         <h2>4. Production & Lead Times</h2>
         <p>
            Estimated lead times are shown on product pages and are approximate. Delays can occur
            due to artwork issues, material availability, or carrier events. We will notify you of
            material delays when possible.
         </p>

         <h2>5. Shipping & Delivery</h2>
         <p>
            Risk of loss passes to you when the carrier receives the shipment. Provide a complete,
            accurate delivery address. Failed deliveries due to incorrect addresses may incur
            reshipment fees.
         </p>

         <h2>6. Returns & Defects</h2>
         <p>
            Custom-printed packaging is generally non-returnable. If items arrive damaged or with a
            clear production defect, contact us within 7 days of delivery with photos and your
            order number. We may reprint, replace, or refund at our discretion.
         </p>

         <h2>7. Limitation of Liability</h2>
         <p>
            To the maximum extent permitted by law, {config.name} is not liable for indirect,
            incidental, or consequential damages. Our total liability for any order is limited to
            the amount you paid for that order.
         </p>

         <h2>8. Contact</h2>
         <p>
            Questions about these terms? Email{' '}
            <a href="mailto:support@printfy.com">support@printfy.com</a> or use the{' '}
            <a href="/contact">Contact</a> page.
         </p>
      </ContentPage>
   )
}
