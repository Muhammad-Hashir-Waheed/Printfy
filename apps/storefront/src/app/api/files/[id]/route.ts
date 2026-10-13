import { isAdminRequest } from '@/studio/server/admin'
import { originalKey, previewKey, readFileRecord } from '@/studio/server/files'
import { getStorage } from '@/studio/server/storage'
import { getForCustomer } from '@/studio/server/submissions'
import { handleError, jsonError, safeEqual } from '@/studio/server/util'

export const dynamic = 'force-dynamic'

/**
 * GET /api/files/{id}?part=preview|original[&download=1]
 *   Access: admin session, OR the file's upload token (?t=), OR a submission link (?s=&a=).
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
   const storage = getStorage()
   if (!storage) return jsonError(503, 'Storage not configured')
   const url = new URL(req.url)
   const part = url.searchParams.get('part') === 'original' ? 'original' : 'preview'
   const download = url.searchParams.get('download') === '1'

   try {
      const record = await readFileRecord(params.id)
      if (!record || record.status !== 'ready') return jsonError(404, 'Not found')

      let allowed = await isAdminRequest(req)
      if (!allowed) allowed = safeEqual(record.token, url.searchParams.get('t'))
      if (!allowed && url.searchParams.get('s')) {
         const sub = await getForCustomer(url.searchParams.get('s')!, url.searchParams.get('a'))
         allowed = Boolean(sub?.files[record.id])
      }
      if (!allowed) return jsonError(404, 'Not found')

      if (part === 'preview' && !record.hasPreview) return jsonError(404, 'No preview')
      const key = part === 'preview' ? previewKey(record.id) : originalKey(record)
      const filename = part === 'preview' ? `${record.name.replace(/\.[^.]+$/, '')}-preview.webp` : record.name

      const remote = await storage.readUrl(key, download ? filename : undefined)
      if (remote) return Response.redirect(remote, 302)

      const obj = await storage.get(key)
      if (!obj) return jsonError(404, 'Not found')

      // Only previews and PDFs/raster images render inline; everything else downloads.
      const inlineTypes: Record<string, string> = {
         pdf: 'application/pdf',
         png: 'image/png',
         jpg: 'image/jpeg',
         jpeg: 'image/jpeg',
         webp: 'image/webp',
      }
      const sniffed = sniff(obj.data)
      const type = part === 'preview' ? sniffed ?? 'image/webp' : inlineTypes[record.ext] ?? 'application/octet-stream'
      const inline = !download && (part === 'preview' || Boolean(inlineTypes[record.ext]))

      return new Response(new Uint8Array(obj.data), {
         headers: {
            'Content-Type': type,
            'Content-Length': String(obj.data.length),
            'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename="${encodeURIComponent(filename)}"`,
            'Cache-Control': 'private, max-age=300',
            'X-Content-Type-Options': 'nosniff',
            // Chrome's PDF viewer refuses to render under a CSP sandbox; images get the strict policy.
            ...(type === 'application/pdf'
               ? {}
               : { 'Content-Security-Policy': "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox" }),
         },
      })
   } catch (error) {
      return handleError(error, 'FILE_GET')
   }
}

function sniff(buf: Buffer) {
   if (buf.subarray(0, 4).toString('ascii') === 'RIFF') return 'image/webp'
   if (buf[0] === 0x89) return 'image/png'
   if (buf[0] === 0xff && buf[1] === 0xd8) return 'image/jpeg'
   return null
}
