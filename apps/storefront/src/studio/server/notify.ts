import config from '@/config/site'
import type { Submission, SubmissionStatus } from '@/studio/types'

import {
   customerMessage,
   customerReceived,
   customerStatusUpdate,
   linksFor,
   teamCustomerReply,
   teamNewSubmission,
} from './email-templates'
import { sendMail, type SendResult } from './mailer'
import { timeline, updateSubmission } from './submissions'

/** Public base URL for links in emails (the site the request came in on). */
export function baseUrlFrom(req: Request) {
   const fromEnv = process.env.NEXT_PUBLIC_URL
   if (fromEnv && !/localhost|127\.0\.0\.1/.test(fromEnv)) return fromEnv.replace(/\/$/, '')
   const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
   const proto = req.headers.get('x-forwarded-proto') ?? (host?.startsWith('localhost') ? 'http' : 'https')
   return host ? `${proto}://${host}` : new URL(req.url).origin
}

const teamInbox = () => process.env.STUDIO_NOTIFY_EMAIL || config.ordersEmail

type Outgoing = { to: string; subject: string; html: string; text: string; replyTo?: string; audience: 'customer' | 'team' }

/** Send and record each email on the submission's (admin-only) timeline. */
async function deliver(s: Submission, mails: Outgoing[]) {
   const results: Array<Outgoing & { result: SendResult }> = []
   for (const mail of mails) results.push({ ...mail, result: await sendMail(mail) })
   await updateSubmission(s.id, (sub) => {
      for (const r of results) {
         sub.timeline.push(
            timeline({
               kind: 'email',
               by: 'system',
               text: r.audience === 'customer' ? 'Email to customer' : 'Email to team',
               email: { to: r.to, subject: r.subject, ok: r.result.ok, via: r.result.via, error: r.result.error },
            })
         )
      }
   }).catch((error) => console.error('[notify] could not log email', error))
   return results
}

export async function notifyNewSubmission(s: Submission, base: string) {
   const links = linksFor(s, base)
   const customer = customerReceived(s, links)
   const team = teamNewSubmission(s, links)
   return deliver(s, [
      { ...customer, to: s.customer.email, audience: 'customer' },
      { ...team, to: teamInbox(), audience: 'team' },
   ])
}

export async function notifyStatusChange(s: Submission, base: string, status: SubmissionStatus, message?: string) {
   const mail = customerStatusUpdate(s, linksFor(s, base), status, message)
   if (!mail) return []
   return deliver(s, [{ ...mail, to: s.customer.email, audience: 'customer' }])
}

export async function notifyStudioMessage(s: Submission, base: string, message: string) {
   const mail = customerMessage(s, linksFor(s, base), message)
   return deliver(s, [{ ...mail, to: s.customer.email, audience: 'customer' }])
}

export async function notifyCustomerReply(s: Submission, base: string, message: string | undefined, revisedFiles: number) {
   const mail = teamCustomerReply(s, linksFor(s, base), message, revisedFiles)
   return deliver(s, [{ ...mail, to: teamInbox(), audience: 'team' }])
}

export async function resendTrackingLink(s: Submission, base: string) {
   const mail = customerReceived(s, linksFor(s, base))
   return deliver(s, [{ ...mail, subject: `Your design tracking link — ${s.reference}`, to: s.customer.email, audience: 'customer' }])
}
