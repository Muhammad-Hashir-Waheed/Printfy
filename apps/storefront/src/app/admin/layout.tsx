import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Joji Arts Admin',
   description: 'Joji Arts packaging admin dashboard',
}

export default function AdminRootLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return children
}
