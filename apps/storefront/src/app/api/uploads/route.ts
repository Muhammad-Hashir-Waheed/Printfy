import { createUpload, UploadError } from '@/studio/server/files'
import { clientIp, handleError, jsonError, rateLimit } from '@/studio/server/util'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
   name: z.string().min(1).max(260),
   size: z.number().positive(),
   type: z.string().max(120).optional(),
})

/** Register an upload → returns where the browser should send the file. */
export async function POST(req: Request) {
   if (!rateLimit(`upload:${clientIp(req)}`, 60, 10 * 60_000)) {
      return jsonError(429, 'Too many uploads — please wait a few minutes.')
   }
   try {
      const body = schema.parse(await req.json())
      return NextResponse.json(await createUpload(body as { name: string; size: number; type?: string }))
   } catch (error) {
      if (error instanceof UploadError) return jsonError(error.status, error.message)
      return handleError(error, 'UPLOAD_CREATE')
   }
}
