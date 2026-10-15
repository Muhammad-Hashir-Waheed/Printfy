import { SiteFooter } from '@/components/store/site-footer'
import { SiteHeader } from '@/components/store/site-header'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
   return (
      <>
         <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
         >
            Skip to content
         </a>
         <SiteHeader />
         <main id="main">{children}</main>
         <SiteFooter />
      </>
   )
}
