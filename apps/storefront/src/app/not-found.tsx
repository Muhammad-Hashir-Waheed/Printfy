import Footer from '@/components/native/Footer'
import { NotFoundContent } from '@/components/native/not-found-content'
import Header from '@/components/native/nav/parent'

export const metadata = {
   title: 'Page not found',
}

export default function NotFound() {
   return (
      <>
         <Header />
         <div className="px-4 sm:px-6 lg:px-12">
            <NotFoundContent />
         </div>
         <Footer />
      </>
   )
}
