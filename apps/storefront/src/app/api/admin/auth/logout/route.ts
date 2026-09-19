import {
   ADMIN_LOGGED_IN_COOKIE,
   ADMIN_TOKEN_COOKIE,
} from '@/lib/admin-auth'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
   const response = NextResponse.redirect(new URL('/admin/login', req.url))
   response.cookies.delete(ADMIN_TOKEN_COOKIE)
   response.cookies.delete(ADMIN_LOGGED_IN_COOKIE)
   return response
}
