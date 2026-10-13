import { cookies } from 'next/headers'

import { ADMIN_COOKIE, verifyAdminSession } from '../admin-session'
import { safeEqual } from './util'

export function checkAdminCredentials(email: string, password: string) {
   const okEmail = safeEqual(email.trim().toLowerCase(), (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase())
   const okPassword = safeEqual(password, process.env.ADMIN_PASSWORD ?? '')
   return okEmail && okPassword
}

/** For server components / route handlers. */
export async function currentAdmin() {
   return verifyAdminSession(cookies().get(ADMIN_COOKIE)?.value)
}

export async function isAdminRequest(req: Request) {
   const cookie = req.headers.get('cookie') ?? ''
   const match = cookie.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE}=([^;]+)`))
   return Boolean(await verifyAdminSession(match ? decodeURIComponent(match[1]) : null))
}
