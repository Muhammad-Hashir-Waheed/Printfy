import { isAdminRequest } from '@/studio/server/admin'
import { listSubmissions } from '@/studio/server/submissions'
import { handleError, jsonError } from '@/studio/server/util'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
   if (!(await isAdminRequest(req))) return jsonError(401, 'Unauthorized')
   try {
      return NextResponse.json(await listSubmissions(), { headers: { 'Cache-Control': 'no-store' } })
   } catch (error) {
      return handleError(error, 'ADMIN_LIST')
   }
}
