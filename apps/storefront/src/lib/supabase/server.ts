import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function supabaseUrl() {
   const url = process.env.NEXT_PUBLIC_SUPABASE_URL
   if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
   return url
}

function supabaseAnonKey() {
   const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
   if (!key) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
   return key
}

export function createClient() {
   const cookieStore = cookies()

   return createServerClient(supabaseUrl(), supabaseAnonKey(), {
      cookies: {
         getAll() {
            return cookieStore.getAll()
         },
         setAll(cookiesToSet) {
            try {
               cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)
               )
            } catch {
               // Called from a Server Component; middleware can refresh the session.
            }
         },
      },
   })
}
