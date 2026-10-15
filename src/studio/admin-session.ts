import { SignJWT, jwtVerify } from 'jose'

/**
 * Admin session for the Design Studio dashboard (edge-safe: used by middleware too).
 *
 * Configure in .env.local / Vercel:
 *   ADMIN_EMAIL=you@jojiarts.com
 *   ADMIN_PASSWORD=a-long-password
 *   ADMIN_SESSION_SECRET=at-least-32-random-characters
 */
export const ADMIN_COOKIE = 'joji_admin'
const MAX_AGE_HOURS = 12

function secret() {
   const value = process.env.ADMIN_SESSION_SECRET
   if (!value || value.length < 32) return null
   return new TextEncoder().encode(value)
}

export function adminConfigured() {
   return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && secret())
}

export async function signAdminSession(email: string) {
   const key = secret()
   if (!key) throw new Error('ADMIN_SESSION_SECRET is missing or shorter than 32 characters')
   return new SignJWT({ role: 'admin', email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(`${MAX_AGE_HOURS}h`)
      .setAudience('joji-studio')
      .sign(key)
}

export async function verifyAdminSession(token: string | undefined | null) {
   const key = secret()
   if (!token || !key) return null
   try {
      const { payload } = await jwtVerify(token, key, { audience: 'joji-studio' })
      return payload.role === 'admin' ? { email: String(payload.email ?? '') } : null
   } catch {
      return null
   }
}

export const ADMIN_COOKIE_MAX_AGE = MAX_AGE_HOURS * 3600
