import { currentAdmin } from '@/studio/server/admin'
import { getStorage } from '@/studio/server/storage'
import { listSubmissions } from '@/studio/server/submissions'
import { AdminShell } from '@/studio/components/admin/admin-shell'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
   const admin = await currentAdmin()
   if (!admin) redirect('/admin/login')

   const storage = getStorage()
   const rows = storage ? await listSubmissions().catch(() => []) : []
   const inbox = rows.filter((r) => r.status === 'new' || !r.seenByAdmin).length

   return (
      <AdminShell email={admin.email} inboxCount={inbox} storage={storage?.kind ?? null}>
         {children}
      </AdminShell>
   )
}
