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
         <main className="page-shell py-5">{children}</main>
         <Footer />
      </>
   )
}
