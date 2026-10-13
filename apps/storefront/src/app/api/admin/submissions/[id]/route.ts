import { isAdminRequest } from '@/studio/server/admin'
import { baseUrlFrom, notifyStatusChange, notifyStudioMessage, resendTrackingLink } from '@/studio/server/notify'
import { getSubmission, timeline, updateSubmission } from '@/studio/server/submissions'
import { handleError, jsonError } from '@/studio/server/util'
import { STATUS_META, SUBMISSION_STATUSES } from '@/studio/types'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

type Params = { params: { id: string } }

export async function GET(req: Request, { params }: Params) {
   if (!(await isAdminRequest(req))) return jsonError(401, 'Unauthorized')
   try {
      const s = await getSubmission(params.id)
      return s ? NextResponse.json(s) : jsonError(404, 'Not found')
   } catch (error) {
      return handleError(error, 'ADMIN_GET')
   }
}

const schema = z.discriminatedUnion('action', [
   z.object({
      action: z.literal('status'),
      status: z.enum(SUBMISSION_STATUSES),
      /** Shown to the customer (required when requesting changes) */
      message: z.string().trim().max(2000).optional(),
      /** Email the customer about this change (default true) */
      notify: z.boolean().optional(),
   }),
   z.object({ action: z.literal('note'), text: z.string().trim().min(1).max(4000) }),
   z.object({ action: z.literal('message'), text: z.string().trim().min(1).max(2000), notify: z.boolean().optional() }),
   z.object({ action: z.literal('seen') }),
   z.object({ action: z.literal('resend_link') }),
])

export async function PATCH(req: Request, { params }: Params) {
   if (!(await isAdminRequest(req))) return jsonError(401, 'Unauthorized')
   try {
      const body = schema.parse(await req.json())
      if (body.action === 'status' && body.status === 'changes_requested' && !body.message) {
         return jsonError(400, 'Tell the customer what needs to change.')
      }
      const before = await getSubmission(params.id)
      if (!before) return jsonError(404, 'Not found')
      const statusChanged = body.action === 'status' && body.status !== before.status

      const updated = await updateSubmission(params.id, (s) => {
         s.seenByAdmin = true
         if (body.action === 'status' && body.status !== s.status) {
            s.status = body.status
            s.timeline.push(
               timeline({ kind: 'status', by: 'admin', status: body.status, text: `Marked as ${STATUS_META[body.status].label.toLowerCase()}` })
            )
            if (body.message) s.timeline.push(timeline({ kind: 'message', by: 'admin', text: body.message }))
         }
         if (body.action === 'note') s.timeline.push(timeline({ kind: 'note', by: 'admin', text: body.text }))
         if (body.action === 'message') s.timeline.push(timeline({ kind: 'message', by: 'admin', text: body.text }))
      })
      if (!updated) return jsonError(404, 'Not found')

      const base = baseUrlFrom(req)
      if (body.action === 'status' && statusChanged && body.notify !== false) {
         await notifyStatusChange(updated, base, body.status, body.message)
      } else if (body.action === 'message' && body.notify !== false) {
         await notifyStudioMessage(updated, base, body.text)
      } else if (body.action === 'resend_link') {
         await resendTrackingLink(updated, base)
      }
      return NextResponse.json(await getSubmission(params.id))
   } catch (error) {
      return handleError(error, 'ADMIN_PATCH')
   }
}
