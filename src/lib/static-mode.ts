function envValue(name: string) {
   return (process.env[name] ?? '').trim()
}

/** Static catalog only when Supabase DATABASE_URL is missing. */
export const USE_STATIC_STORE = !envValue('DATABASE_URL')
