import { NotFoundView } from '@/components/store/not-found-view'
import { SiteFooter } from '@/components/store/site-footer'
import { SiteHeader } from '@/components/store/site-header'

export const metadata = {
   title: 'Page not found',
}

export default function NotFound() {
   return (
      <>
         <SiteHeader />
         <main id="main">
            <NotFoundView />
         </main>
         <SiteFooter />
      </>
   )
}
