import { completeUpload, MAX_BYTES, MAX_PREVIEW_BYTES, receivePart, UploadError } from '@/studio/server/files'
import { getStorage } from '@/studio/server/storage'
import { handleError, jsonError } from '@/studio/server/util'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

type Params = { params: { id: string } }

/** Local storage only: receive the raw file bytes. (With Supabase the browser uploads directly.) */
export async function PUT(req: Request, { params }: Params) {
   if (getStorage()?.kind !== 'local') return jsonError(404, 'Not found')
   const url = new URL(req.url)
   const part = url.searchParams.get('part') === 'preview' ? 'preview' : 'original'
   const token = url.searchParams.get('t') ?? ''
   const declared = Number(req.headers.get('content-length') ?? 0)
   if (declared > (part === 'original' ? MAX_BYTES : MAX_PREVIEW_BYTES)) return jsonError(413, 'File too large.')
   try {
      await receivePart(params.id, token, part, Buffer.from(await req.arrayBuffer()))
      return NextResponse.json({ ok: true })
   } catch (error) {
      if (error instanceof UploadError) return jsonError(error.status, error.message)
      return handleError(error, 'UPLOAD_PART')
   }
}

const completeSchema = z.object({
   token: z.string().min(10).max(200),
   hasPreview: z.boolean().optional(),
   width: z.number().optional(),
   height: z.number().optional(),
})

/** Confirm the upload finished. */
export async function POST(req: Request, { params }: Params) {
   try {
      const body = completeSchema.parse(await req.json())
      const file = await completeUpload(params.id, body.token, body)
      return NextResponse.json({ file })
   } catch (error) {
      if (error instanceof UploadError) return jsonError(error.status, error.message)
      return handleError(error, 'UPLOAD_COMPLETE')
   }
}
