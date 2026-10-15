import { customerView, getForCustomer } from '@/studio/server/submissions'
import { getStorage } from '@/studio/server/storage'
import { CustomerReview } from '@/studio/components/customer-review'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
   title: 'Your design',
   robots: { index: false, follow: false },
}

export default async function DesignReviewPage({
   params,
   searchParams,
}: {
   params: { id: string }
   searchParams: { t?: string }
}) {
   if (!getStorage()) notFound()
   const submission = await getForCustomer(params.id, searchParams.t ?? null)
   if (!submission) notFound()
   return <CustomerReview initial={customerView(submission)} token={searchParams.t!} />
}
