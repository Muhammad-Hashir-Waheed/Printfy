import { ModalProvider } from '@/providers/modal-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { ToastProvider } from '@/providers/toast-provider'
import { Inter } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
   metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'http://localhost:7777'),
   title: 'Joji Arts',
   description:
      'Custom packaging for cosmetics, hotels, perfume, luxury boxes, corrugated cartons, and 3D branding.',
   keywords: [
      'Joji Arts',
      'Custom Packaging',
      'Cosmetics',
      'Hotel Packaging',
      'Perfume Boxes',
      'Rigid Boxes',
      'Corrugated Boxes',
      '3D Boards',
   ],
   authors: [{ name: 'Joji Arts' }],
   creator: 'Joji Arts',
   publisher: 'Joji Arts',
   icons: {
      icon: '/favicon.svg',
   },
}

export default async function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <html lang="en" suppressHydrationWarning>
         <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
            <ThemeProvider>
               <ToastProvider />
               <ModalProvider />
               {children}
            </ThemeProvider>
         </body>
      </html>
   )
}
