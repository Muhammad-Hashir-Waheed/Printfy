import { createHash, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'

import { StorageNotConfiguredError } from './storage'

export const newId = () => randomUUID()
export const newToken = () => randomBytes(24).toString('base64url')

/** Constant-time string comparison (hashes first so lengths never leak). */
export function safeEqual(a: string | null | undefined, b: string | null | undefined) {
   if (!a || !b) return false
   const ha = createHash('sha256').update(a).digest()
   const hb = createHash('sha256').update(b).digest()
   return timingSafeEqual(ha, hb)
}

export function reference(prefix = 'JA') {
   const d = new Date()
   const date = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`
   const rand = randomBytes(3).toString('hex').toUpperCase().slice(0, 5)
   return `${prefix}-${date}-${rand}`
}

/* ───────────── Best-effort in-memory rate limiter (per server instance) ───────────── */

const buckets = new Map<string, { count: number; reset: number }>()

export function rateLimit(key: string, limit: number, windowMs: number) {
   const now = Date.now()
   const entry = buckets.get(key)
   if (!entry || entry.reset < now) {
      buckets.set(key, { count: 1, reset: now + windowMs })
      if (buckets.size > 5000) {
         for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k)
      }
      return true
   }
   entry.count++
   return entry.count <= limit
}

/** Checks a bucket without counting a hit. */
export function isRateLimited(key: string, limit: number) {
   const entry = buckets.get(key)
   return Boolean(entry && entry.reset >= Date.now() && entry.count >= limit)
}

/**
 * The caller's IP for rate limiting. Prefers headers our host sets itself (Cloudflare and Vercel
 * overwrite these, so they can't be spoofed); otherwise takes the *last* X-Forwarded-For hop —
 * the one appended by the proxy in front of us — never the first, which the client controls.
 * On Cloudflare, CF-Connecting-IP is checked first: X-Real-IP is passed through from the client there.
 */
export function clientIp(req: Request) {
   const h = req.headers
   const trusted = h.get('cf-connecting-ip') || h.get('x-vercel-forwarded-for') || h.get('x-real-ip')
   if (trusted) return trusted.split(',')[0].trim()
   const hops = h.get('x-forwarded-for')?.split(',').map((s) => s.trim()).filter(Boolean)
   return hops?.length ? hops[hops.length - 1] : 'local'
}

/* ───────────── Responses ───────────── */

export function jsonError(status: number, message: string) {
   return NextResponse.json({ error: message }, { status })
}

export function handleError(error: unknown, scope: string) {
   if (error instanceof StorageNotConfiguredError) return jsonError(503, error.message)
   // Malformed JSON body from req.json()
   if (error instanceof SyntaxError) return jsonError(400, 'Invalid request body.')
   if (error && typeof error === 'object' && 'issues' in error) {
      return jsonError(400, 'Some details are missing or invalid.')
   }
   console.error(`[${scope}]`, error)
   return jsonError(500, 'Something went wrong. Please try again.')
}
