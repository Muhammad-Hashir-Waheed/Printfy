import { claimFiles, UploadError } from '@/studio/server/files'
import { customerView, getForCustomer, timeline, updateSubmission } from '@/studio/server/submissions'
import { clientIp, handleError, jsonError, rateLimit } from '@/studio/server/util'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

type Params = { params: { id: string } }

export async function GET(req: Request, { params }: Params) {
   try {
      const s = await getForCustomer(params.id, new URL(req.url).searchParams.get('t'))
      if (!s) return jsonError(404, 'Not found')
      return NextResponse.json(customerView(s))
   } catch (error) {
      return handleError(error, 'REVIEW_GET')
   }
}

const replySchema = z.object({
   token: z.string().min(10).max(200),
   message: z.string().trim().max(2000).optional(),
   files: z.array(z.object({ id: z.string().uuid(), token: z.string().min(10).max(200) })).max(10).default([]),
})

/** Customer replies — optionally with a revised file. */
export async function POST(req: Request, { params }: Params) {
   if (!rateLimit(`reply:${clientIp(req)}`, 20, 10 * 60_000)) return jsonError(429, 'Too many requests.')
   try {
      const body = replySchema.parse(await req.json())
      if (!body.message && !body.files.length) return jsonError(400, 'Add a message or a file.')
      const current = await getForCustomer(params.id, body.token)
      if (!current) return jsonError(404, 'Not found')
      if (current.status === 'archived' || current.status === 'completed') {
         return jsonError(409, 'This request is closed — please start a new one.')
      }
      const files = await claimFiles(body.files)

      const updated = await updateSubmission(params.id, (s) => {
         Object.assign(s.files, files)
         s.timeline.push(
            timeline({
               kind: body.files.length ? 'revision' : 'customer_message',
               by: 'customer',
               text: body.message,
               fileIds: Object.keys(files),
            })
         )
         if (body.files.length && s.status === 'changes_requested') {
            s.status = 'in_review'
            s.timeline.push(timeline({ kind: 'status', by: 'system', status: 'in_review', text: 'Revised artwork received' }))
         }
         s.seenByAdmin = false
      })
      return NextResponse.json(customerView(updated as NonNullable<typeof updated>))
   } catch (error) {
      if (error instanceof UploadError) return jsonError(error.status, error.message)
      return handleError(error, 'REVIEW_REPLY')
   }
}
