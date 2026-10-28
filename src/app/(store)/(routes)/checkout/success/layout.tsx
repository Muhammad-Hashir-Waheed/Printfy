import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Request sent',
   robots: { index: false },
}

export default function CheckoutSuccessLayout({ children }: { children: React.ReactNode }) {
   return children
}
