import Footer from '@/components/native/Footer'
import Header from '@/components/native/nav/parent'
import { ScrollProgress } from '@/components/ui/scroll-progress'

export default async function DashboardLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <>
         <ScrollProgress />
         <Header />
         <div className="px-4 sm:px-6 lg:px-12">
            {children}
         </div>
         <Footer />
      </>
   )
}
