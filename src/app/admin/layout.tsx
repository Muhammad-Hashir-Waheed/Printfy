import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: { default: 'Design Studio', template: '%s · Joji Arts Studio' },
   robots: { index: false, follow: false },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
   return <div className="min-h-screen bg-[#f4f1ec]">{children}</div>
}
