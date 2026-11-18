import { PwaRegister } from '@/components/pwa-register'
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
      default: `Custom Packaging, Printing & Signage in Lahore | ${config.name}`,
      template: `%s | ${config.name}`,
   },
   description: config.description,
   // './' resolves against each page's own path, so every page gets a self-referencing canonical
   alternates: { canonical: './' },
   authors: [{ name: config.name }],
   creator: config.name,
   publisher: config.name,
   openGraph: {
      type: 'website',
      siteName: config.name,
      title: `Custom Packaging, Printing & Signage in Lahore | ${config.name}`,
      description: config.description,
      locale: 'en_PK',
   },
   twitter: { card: 'summary_large_image' },
   // Installed as an app (home screen): name, plus full-screen launch on iPhone
   applicationName: config.name,
   appleWebApp: { capable: true, title: config.name, statusBarStyle: 'default' },
   // Meta-tag verification is optional (the domain is verified by DNS); rendered only when set
   ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
      : {}),
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
            <PwaRegister />
         </body>
      </html>
   )
}
