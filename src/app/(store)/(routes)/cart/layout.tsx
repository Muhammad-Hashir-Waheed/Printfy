import config from '@/config/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: config.showPrices ? 'Cart' : 'Quote list',
   robots: { index: false },
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
   return children
}
