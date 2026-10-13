import { getSubmission, updateSubmission } from '@/studio/server/submissions'
import { SubmissionDetail } from '@/studio/components/admin/submission-detail'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Review design' }

export default async function SubmissionPage({ params }: { params: { id: string } }) {
   let submission = await getSubmission(params.id)
   if (!submission) notFound()
   if (!submission.seenByAdmin) {
      submission =
         (await updateSubmission(params.id, (s) => {
            s.seenByAdmin = true
         })) ?? submission
   }
   return <SubmissionDetail initial={submission} />
}
