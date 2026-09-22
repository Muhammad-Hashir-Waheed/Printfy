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
         <Navbar>{children}</Navbar>
      </>
   )
}
