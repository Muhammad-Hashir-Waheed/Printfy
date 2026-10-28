import config from '@/config/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: config.showPrices ? 'Checkout' : 'Request your quote',
   robots: { index: false },
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
   return children
}
