import { ADMIN_COOKIE, ADMIN_COOKIE_MAX_AGE, adminConfigured, signAdminSession } from '@/studio/admin-session'
import { checkAdminCredentials } from '@/studio/server/admin'
import { clientIp, jsonError, rateLimit } from '@/studio/server/util'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({ email: z.string().max(200), password: z.string().max(200) })

export async function POST(req: Request) {
   if (!adminConfigured()) {
      return jsonError(503, 'Admin login is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SESSION_SECRET.')
   }
   if (!rateLimit(`admin-login:${clientIp(req)}`, 8, 15 * 60_000)) {
      return jsonError(429, 'Too many attempts. Try again in 15 minutes.')
   }
   const parsed = schema.safeParse(await req.json().catch(() => null))
   if (!parsed.success || !checkAdminCredentials(parsed.data.email, parsed.data.password)) {
      await new Promise((r) => setTimeout(r, 600))
      return jsonError(401, 'Wrong email or password.')
   }
   const res = NextResponse.json({ ok: true })
   res.cookies.set({
      name: ADMIN_COOKIE,
      value: await signAdminSession(parsed.data.email.trim().toLowerCase()),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: ADMIN_COOKIE_MAX_AGE,
   })
   return res
}

export async function DELETE() {
   const res = NextResponse.json({ ok: true })
   res.cookies.set({ name: ADMIN_COOKIE, value: '', path: '/', maxAge: 0 })
   return res
}
