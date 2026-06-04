/**
 * Static storefront: no database required.
 * Set USE_STATIC_STORE=false and DATABASE_URL when you add Postgres.
 */
export const USE_STATIC_STORE =
   process.env.USE_STATIC_STORE !== 'false' && !process.env.DATABASE_URL
