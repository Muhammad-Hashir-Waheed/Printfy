/**
 * Feature switches.
 *
 *   ENABLE_ACCOUNTS=true → /login, /profile, /wishlist and the database-backed /api/*
 *                          (requires DATABASE_URL and JWT_SECRET_KEY)
 *
 * The Design Studio admin (/admin) is always on and protected by ADMIN_EMAIL /
 * ADMIN_PASSWORD / ADMIN_SESSION_SECRET. The old database admin lives in
 * src/app/_legacy and is not routed.
 */
export const FEATURES = {
   accounts: process.env.ENABLE_ACCOUNTS === 'true',
}

/** Public API routes that work without customer accounts (they do their own checks). */
export const PUBLIC_API_PREFIXES = ['/api/uploads', '/api/files/', '/api/submissions', '/api/design-review/']
