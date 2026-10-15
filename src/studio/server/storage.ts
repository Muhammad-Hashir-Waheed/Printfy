import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { promises as fs } from 'node:fs'
import path from 'node:path'

/**
 * Object storage for design files and submission records.
 *
 *  - Supabase Storage when SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and
 *    SUPABASE_SERVICE_ROLE_KEY are set — required in production (Vercel's disk is read-only).
 *  - A local `.data/` folder otherwise (development only, git-ignored).
 */
export interface Storage {
   kind: 'local' | 'supabase'
   put(key: string, data: Buffer | string, contentType: string): Promise<void>
   get(key: string): Promise<{ data: Buffer; contentType: string } | null>
   exists(key: string): Promise<boolean>
   list(prefix: string): Promise<string[]>
   remove(key: string): Promise<void>
   /** A URL the browser can PUT the file to directly (Supabase); null = upload through our API */
   uploadTarget(key: string): Promise<{ url: string; form: boolean } | null>
   /** A short-lived URL to read the file (Supabase); null = stream through our API */
   readUrl(key: string, downloadName?: string): Promise<string | null>
}

const BUCKET = process.env.SUPABASE_DESIGNS_BUCKET || 'joji-designs'

const CONTENT_TYPES: Record<string, string> = {
   json: 'application/json',
   pdf: 'application/pdf',
   png: 'image/png',
   jpg: 'image/jpeg',
   jpeg: 'image/jpeg',
   webp: 'image/webp',
   svg: 'image/svg+xml',
   tif: 'image/tiff',
   tiff: 'image/tiff',
   zip: 'application/zip',
}

export function contentTypeFor(key: string) {
   const ext = key.split('.').pop()?.toLowerCase() ?? ''
   return CONTENT_TYPES[ext] ?? 'application/octet-stream'
}

/* ───────────────────────── Local disk ───────────────────────── */

function localStorage(): Storage {
   const root = path.join(process.cwd(), '.data')
   const resolve = (key: string) => {
      const full = path.resolve(root, key)
      if (!full.startsWith(root)) throw new Error('Invalid storage key')
      return full
   }

   return {
      kind: 'local',
      async put(key, data) {
         const full = resolve(key)
         await fs.mkdir(path.dirname(full), { recursive: true })
         const tmp = `${full}.${process.pid}.tmp`
         await fs.writeFile(tmp, data)
         await fs.rename(tmp, full)
      },
      async get(key) {
         try {
            return { data: await fs.readFile(resolve(key)), contentType: contentTypeFor(key) }
         } catch {
            return null
         }
      },
      async exists(key) {
         try {
            await fs.access(resolve(key))
            return true
         } catch {
            return false
         }
      },
      async list(prefix) {
         const dir = resolve(prefix)
         try {
            const entries = await fs.readdir(dir)
            return entries.filter((e) => !e.endsWith('.tmp')).map((e) => `${prefix.replace(/\/$/, '')}/${e}`)
         } catch {
            return []
         }
      },
      async remove(key) {
         await fs.rm(resolve(key), { force: true, recursive: true })
      },
      async uploadTarget() {
         return null
      },
      async readUrl() {
         return null
      },
   }
}

/* ───────────────────────── Supabase ───────────────────────── */

let bucketReady: Promise<void> | null = null

function supabaseStorage(url: string, serviceKey: string): Storage {
   const client: SupabaseClient = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
   })
   const bucket = () => client.storage.from(BUCKET)

   const ensureBucket = () => {
      bucketReady ??= (async () => {
         const { data } = await client.storage.getBucket(BUCKET)
         if (!data) {
            const { error } = await client.storage.createBucket(BUCKET, { public: false })
            if (error && !/already exists/i.test(error.message)) throw error
         }
      })().catch((error) => {
         bucketReady = null
         throw error
      })
      return bucketReady
   }

   return {
      kind: 'supabase',
      async put(key, data, contentType) {
         await ensureBucket()
         const { error } = await bucket().upload(key, data, { contentType, upsert: true, cacheControl: '0' })
         if (error) throw error
      },
      async get(key) {
         await ensureBucket()
         const { data, error } = await bucket().download(key)
         if (error || !data) return null
         return { data: Buffer.from(await data.arrayBuffer()), contentType: data.type || contentTypeFor(key) }
      },
      async exists(key) {
         await ensureBucket()
         const dir = key.split('/').slice(0, -1).join('/')
         const name = key.split('/').pop()
         const { data } = await bucket().list(dir, { search: name, limit: 5 })
         return Boolean(data?.some((f) => f.name === name))
      },
      async list(prefix) {
         await ensureBucket()
         const dir = prefix.replace(/\/$/, '')
         const out: string[] = []
         for (let offset = 0; ; offset += 1000) {
            const { data, error } = await bucket().list(dir, { limit: 1000, offset })
            if (error) throw error
            out.push(...(data ?? []).map((f) => `${dir}/${f.name}`))
            if (!data || data.length < 1000) break
         }
         return out
      },
      async remove(key) {
         await ensureBucket()
         const { data } = await bucket().list(key)
         const nested = (data ?? []).map((f) => `${key}/${f.name}`)
         await bucket().remove([key, ...nested])
      },
      async uploadTarget(key) {
         await ensureBucket()
         const { data, error } = await bucket().createSignedUploadUrl(key, { upsert: true })
         if (error || !data) throw error ?? new Error('Could not create upload URL')
         return { url: data.signedUrl, form: true }
      },
      async readUrl(key, downloadName) {
         await ensureBucket()
         const { data, error } = await bucket().createSignedUrl(key, 600, downloadName ? { download: downloadName } : undefined)
         if (error || !data) return null
         return data.signedUrl
      },
   }
}

/* ───────────────────────── Selection ───────────────────────── */

let instance: Storage | null | undefined

export function getStorage(): Storage | null {
   if (instance !== undefined) return instance
   const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
   const key = process.env.SUPABASE_SERVICE_ROLE_KEY
   if (url && key) instance = supabaseStorage(url, key)
   else if (process.env.VERCEL) instance = null // read-only filesystem: storage must be configured
   else instance = localStorage()
   return instance
}

export class StorageNotConfiguredError extends Error {
   constructor() {
      super('Design storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.')
   }
}

export function requireStorage(): Storage {
   const storage = getStorage()
   if (!storage) throw new StorageNotConfiguredError()
   return storage
}
