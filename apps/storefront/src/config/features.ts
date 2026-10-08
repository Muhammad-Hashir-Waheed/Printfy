/**
 * Feature switches. The storefront currently runs as a static catalog:
 * no database, no admin portal, no customer accounts.
 *
 * Turn things back on later with environment variables:
 *   ENABLE_ADMIN=true      → /admin dashboard and /api/admin/*
 *   ENABLE_ACCOUNTS=true   → /login, /profile, /wishlist and the database-backed /api/*
 *
 * Both require DATABASE_URL and JWT_SECRET_KEY to be configured.
 */
export const FEATURES = {
   admin: process.env.ENABLE_ADMIN === 'true',
   accounts: process.env.ENABLE_ACCOUNTS === 'true',
}

/** API routes that work without a database and stay public. */
export const STATIC_API_ROUTES = ['/api/order-request']
