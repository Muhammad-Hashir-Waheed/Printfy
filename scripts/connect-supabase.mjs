/**
 * Writes apps/storefront/.env (shop + admin at /admin).
 *
 *   node scripts/connect-supabase.mjs --init
 *     Create local env files (JWT, URLs). Leaves DATABASE_URL empty until connected.
 *
 *   node scripts/connect-supabase.mjs --from-status
 *     After `npx supabase start`, copy local API URL, keys, and DB URL into .env.
 *
 *   node scripts/connect-supabase.mjs --database-url "..." --direct-url "..." --url "https://xxxx.supabase.co" --anon "eyJ..."
 *     Cloud project: Dashboard → Connect (6543 transaction + 5432 session) and API keys.
 */
import { execFileSync } from 'child_process'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const root = path.resolve(__dirname, '..')
const storeEnv = path.join(root, 'apps/storefront/.env')

function arg(name, fallback = '') {
   const index = process.argv.indexOf(`--${name}`)
   if (index === -1 || !process.argv[index + 1]) return fallback
   return process.argv[index + 1]
}

function hasFlag(name) {
   return process.argv.includes(`--${name}`)
}

function readEnv(filePath) {
   if (!fs.existsSync(filePath)) return {}
   const map = {}
   for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      let value = trimmed.slice(eq + 1).trim()
      if (
         (value.startsWith('"') && value.endsWith('"')) ||
         (value.startsWith("'") && value.endsWith("'"))
      ) {
         value = value.slice(1, -1)
      }
      map[key] = value
   }
   return map
}

function quote(value) {
   return `"${String(value ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

function appendQuery(url, params) {
   let next = url
   for (const [key, value] of Object.entries(params)) {
      if (new RegExp(`[?&]${key}=`).test(next)) continue
      next += `${next.includes('?') ? '&' : '?'}${key}=${value}`
   }
   return next
}

function normalizeDatabaseUrl(url, { pooled = false } = {}) {
   let next = String(url || '').trim()
   if (!next) return ''
   if (pooled) {
      next = appendQuery(next, {
         pgbouncer: 'true',
         connection_limit: '1',
      })
   }
   if (/supabase\.(co|com)/i.test(next)) {
      next = appendQuery(next, { sslmode: 'require' })
   }
   return next
}

function isPooledUrl(url) {
   return /:(6543)(\/|\?|$)/.test(url)
}

const STORE_KEYS = [
   'DATABASE_URL',
   'DIRECT_URL',
   'NEXT_PUBLIC_SUPABASE_URL',
   'NEXT_PUBLIC_SUPABASE_ANON_KEY',
   'NEXT_PUBLIC_URL',
   'JWT_SECRET_KEY',
]

function writeEnv(filePath, overrides, extraLines = [], allowedKeys) {
   const existing = readEnv(filePath)
   const merged = { ...existing, ...overrides }
   if (!merged.JWT_SECRET_KEY) {
      merged.JWT_SECRET_KEY = crypto.randomBytes(48).toString('hex')
   }

   const lines = [
      '# Generated for Supabase. Do not commit this file.',
      ...extraLines,
      '',
   ]

   for (const key of allowedKeys) {
      if (merged[key] === undefined) continue
      lines.push(`${key}=${quote(merged[key])}`)
   }

   fs.mkdirSync(path.dirname(filePath), { recursive: true })
   fs.writeFileSync(filePath, `${lines.join('\n')}\n`)
}

function writeStore(shared, extraStore = {}) {
   const jwt =
      readEnv(storeEnv).JWT_SECRET_KEY || crypto.randomBytes(48).toString('hex')

   writeEnv(
      storeEnv,
      {
         NEXT_PUBLIC_URL: 'http://localhost:7777',
         JWT_SECRET_KEY: jwt,
         ...shared,
         ...extraStore,
      },
      ['# Storefront + admin (/admin)'],
      STORE_KEYS
   )
}

function parseStatusEnv(raw) {
   const map = {}
   for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/)
      if (!match) continue
      let value = match[2].trim()
      if (
         (value.startsWith('"') && value.endsWith('"')) ||
         (value.startsWith("'") && value.endsWith("'"))
      ) {
         value = value.slice(1, -1)
      }
      map[match[1]] = value
   }
   return map
}

if (hasFlag('init')) {
   writeStore({
      DATABASE_URL: readEnv(storeEnv).DATABASE_URL || '',
      DIRECT_URL: readEnv(storeEnv).DIRECT_URL || '',
      NEXT_PUBLIC_SUPABASE_URL: readEnv(storeEnv).NEXT_PUBLIC_SUPABASE_URL || '',
      NEXT_PUBLIC_SUPABASE_ANON_KEY:
         readEnv(storeEnv).NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
   })
   console.log('Wrote apps/storefront/.env')
   console.log(
      'DATABASE_URL is empty — catalog stays static until you connect Supabase.'
   )
   process.exit(0)
}

if (hasFlag('from-status')) {
   let raw
   try {
      raw = execFileSync('npx', ['supabase', 'status', '-o', 'env'], {
         cwd: root,
         encoding: 'utf8',
         stdio: ['ignore', 'pipe', 'pipe'],
         shell: true,
      })
   } catch (error) {
      console.error(error.stderr || error.message)
      console.error('Start local Supabase first: npx supabase start')
      process.exit(1)
   }

   const status = parseStatusEnv(raw)
   const dbUrl = status.DB_URL || status.DATABASE_URL || ''
   const apiUrl = status.API_URL || status.NEXT_PUBLIC_SUPABASE_URL || ''
   const anon = status.ANON_KEY || status.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

   if (!dbUrl || !apiUrl || !anon) {
      console.error('supabase status did not return DB_URL / API_URL / ANON_KEY')
      process.exit(1)
   }

   writeStore({
      DATABASE_URL: dbUrl,
      DIRECT_URL: dbUrl,
      NEXT_PUBLIC_SUPABASE_URL: apiUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: anon,
   })
   console.log('Wrote env from local `supabase status`')
   console.log(
      'Next: npm --prefix apps/storefront run db:push && npm --prefix apps/storefront run db:seed'
   )
   process.exit(0)
}

const databaseUrlRaw = arg('database-url')
const directUrlRaw = arg('direct-url') || databaseUrlRaw
const supabaseUrl = arg('url')
const anon = arg('anon')

if (!databaseUrlRaw || !directUrlRaw || !supabaseUrl || !anon) {
   console.error(
      'Missing required flags: --database-url --direct-url --url --anon'
   )
   console.error('Or use: node scripts/connect-supabase.mjs --init')
   process.exit(1)
}

writeStore({
   DATABASE_URL: normalizeDatabaseUrl(databaseUrlRaw, {
      pooled: isPooledUrl(databaseUrlRaw) || hasFlag('pooled'),
   }),
   DIRECT_URL: normalizeDatabaseUrl(directUrlRaw, { pooled: false }),
   NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
   NEXT_PUBLIC_SUPABASE_ANON_KEY: anon,
})

console.log('Wrote apps/storefront/.env')
console.log(
   'Next: npm --prefix apps/storefront run db:push && npm --prefix apps/storefront run db:seed'
)
