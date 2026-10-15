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

export function clientIp(req: Request) {
   return (
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'local'
   )
}

/* ───────────── Responses ───────────── */

export function jsonError(status: number, message: string) {
   return NextResponse.json({ error: message }, { status })
}

export function handleError(error: unknown, scope: string) {
   if (error instanceof StorageNotConfiguredError) return jsonError(503, error.message)
   if (error && typeof error === 'object' && 'issues' in error) {
      return jsonError(400, 'Some details are missing or invalid.')
   }
   console.error(`[${scope}]`, error)
   return jsonError(500, 'Something went wrong. Please try again.')
}
