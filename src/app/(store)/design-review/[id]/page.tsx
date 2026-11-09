import { customerView, getForCustomer } from '@/studio/server/submissions'
import { getStorage } from '@/studio/server/storage'
import { CustomerReview } from '@/studio/components/customer-review'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

export const dynamic = 'force-dynamic'

type Props = {
   params: Promise<{ id: string }>
   searchParams: Promise<{ t?: string }>
}

/** One lookup per request, shared by generateMetadata and the page */
const load = cache(async (id: string, token: string | null) => (getStorage() ? getForCustomer(id, token) : null))

/**
 * The lookup runs here first because metadata is resolved before the response starts:
 * a wrong id or token therefore returns a real 404 status, not a 200 with "not found" content.
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
   const [{ id }, { t }] = await Promise.all([props.params, props.searchParams])
   if (!(await load(id, t ?? null))) notFound()
   return { title: 'Your design', robots: { index: false, follow: false } }
}

export default async function DesignReviewPage(props: Props) {
   const [{ id }, { t }] = await Promise.all([props.params, props.searchParams])
   const submission = await load(id, t ?? null)
   if (!submission) notFound()
   return <CustomerReview initial={customerView(submission)} token={t!} />
}
