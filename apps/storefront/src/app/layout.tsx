import { ModalProvider } from '@/providers/modal-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { ToastProvider } from '@/providers/toast-provider'
import { Inter } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
   title: 'Printfy',
   description: 'Custom packaging for food, retail, and shipping.',
   keywords: ['Printfy', 'Packaging', 'Custom Print', 'E-Commerce'],
   authors: [{ name: 'Printfy', url: 'https://github.com/sesto-dev' }],
   creator: 'Printfy',
   publisher: 'Printfy',
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
