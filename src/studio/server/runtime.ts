/**
 * Hosted platforms have no lasting disk: Vercel's is read-only and Cloudflare Workers' is a
 * per-request in-memory stand-in. There, uploads and records must go to Supabase and emails to a
 * real provider — the local `.data/` fallbacks would silently lose data.
 */
export function hasPersistentDisk() {
   if (process.env.VERCEL) return false
   if (typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers') return false
   return true
}
