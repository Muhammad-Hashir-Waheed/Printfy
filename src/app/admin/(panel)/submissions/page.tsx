import { getStorage } from '@/studio/server/storage'
import { listSubmissions } from '@/studio/server/submissions'
import { SubmissionInbox } from '@/studio/components/admin/submission-inbox'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Design inbox' }

export default async function SubmissionsPage() {
   const rows = getStorage() ? await listSubmissions() : []
   return (
      <Suspense>
         <SubmissionInbox initial={rows} />
      </Suspense>
   )
}
