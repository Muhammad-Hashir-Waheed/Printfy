import config from '@/config/site'
import { ModalProvider } from '@/providers/modal-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { ToastProvider } from '@/providers/toast-provider'
import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Inter } from 'next/font/google'

import './globals.css'

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const display = Bricolage_Grotesque({
   subsets: ['latin'],
   variable: '--font-display',
   display: 'swap',
})

export const metadata: Metadata = {
   metadataBase: new URL(config.url),
   title: {
      default: `${config.name} — Custom Packaging, Printing & Signage`,
      template: `%s | ${config.name}`,
   },
   description: config.description,
   keywords: [
      'custom packaging',
      'printed boxes',
      'business cards',
      'labels and stickers',
      'acrylic boxes',
      'neon signs',
      'sign boards',
      'LED displays',
      'Joji Arts',
   ],
   authors: [{ name: config.name }],
   creator: config.name,
   publisher: config.name,
   openGraph: {
      type: 'website',
      siteName: config.name,
      title: `${config.name} — Custom Packaging, Printing & Signage`,
      description: config.description,
   },
   twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
   themeColor: '#FAF7F2',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <html lang="en" suppressHydrationWarning className={`${sans.variable} ${display.variable}`}>
         <body className="min-h-screen bg-background font-sans text-foreground antialiased">
            <ThemeProvider forcedTheme="light" defaultTheme="light" enableSystem={false}>
               <ToastProvider />
               <ModalProvider />
               {children}
            </ThemeProvider>
         </body>
      </html>
   )
}
