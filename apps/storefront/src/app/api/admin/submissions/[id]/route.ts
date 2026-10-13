import { isAdminRequest } from '@/studio/server/admin'
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
   }),
   z.object({ action: z.literal('note'), text: z.string().trim().min(1).max(4000) }),
   z.object({ action: z.literal('message'), text: z.string().trim().min(1).max(2000) }),
   z.object({ action: z.literal('seen') }),
])

export async function PATCH(req: Request, { params }: Params) {
   if (!(await isAdminRequest(req))) return jsonError(401, 'Unauthorized')
   try {
      const body = schema.parse(await req.json())
      if (body.action === 'status' && body.status === 'changes_requested' && !body.message) {
         return jsonError(400, 'Tell the customer what needs to change.')
      }
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
      return updated ? NextResponse.json(updated) : jsonError(404, 'Not found')
   } catch (error) {
      return handleError(error, 'ADMIN_PATCH')
   }
}
