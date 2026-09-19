import Navbar from '@/components/admin-navbar'
import { ScrollProgress } from '@/components/ui/scroll-progress'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <>
         <ScrollProgress />
         <Navbar />
         <div className="px-4 sm:px-6 lg:px-12">
            {children}
         </div>
      </>
   )
}
