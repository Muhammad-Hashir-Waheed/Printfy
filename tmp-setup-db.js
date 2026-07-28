const fs = require('fs')
const path = require('path')
const { execFileSync, spawnSync } = require('child_process')

function loadEnv(file) {
   const env = {}
   if (!fs.existsSync(file)) return env
   for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
      if (!m) continue
      let v = m[2].trim()
      if (
         (v.startsWith('"') && v.endsWith('"')) ||
         (v.startsWith("'") && v.endsWith("'"))
      ) {
         v = v.slice(1, -1)
      }
      env[m[1]] = v
   }
   return env
}

function setEnvVar(file, key, value) {
   let text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
   const re = new RegExp(`^\\s*${key}\\s*=.*$`, 'm')
   const line = `${key}="${value}"`
   if (re.test(text)) text = text.replace(re, line)
   else text = `${line}\n${text}`
   fs.writeFileSync(file, text, 'utf8')
}

const adminEnvPath = path.join('apps', 'admin', '.env')
const storeEnvPath = path.join('apps', 'storefront', '.env')
const adminEnv = loadEnv(adminEnvPath)

let url = adminEnv.DATABASE_URL
if (!url) {
   console.error('admin DATABASE_URL missing')
   process.exit(1)
}

url = url.replace(/@(127\.0\.0\.1|localhost):\d+/, '@$1:5432')
setEnvVar(adminEnvPath, 'DATABASE_URL', url)
setEnvVar(storeEnvPath, 'DATABASE_URL', url)
console.log('Updated admin + storefront DATABASE_URL to port 5432')

const u = new URL(url.replace(/^postgres(ql)?:/, 'http:'))
const password = decodeURIComponent(u.password)
const user = decodeURIComponent(u.username)
const db = u.pathname.replace(/^\//, '') || 'nukta_print'
const host = u.hostname
const port = u.port || '5432'
const psql = 'C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe'

const env = { ...process.env, PGPASSWORD: password }

function psqlRun(args, database = 'postgres') {
   const result = spawnSync(
      psql,
      ['-h', host, '-p', port, '-U', user, '-d', database, '-v', 'ON_ERROR_STOP=1', ...args],
      { env, encoding: 'utf8' }
   )
   if (result.stdout) process.stdout.write(result.stdout)
   if (result.stderr) process.stderr.write(result.stderr)
   if (result.status !== 0) {
      throw new Error(`psql failed: ${result.status}`)
   }
}

console.log('Ensuring database exists...')
const exists = spawnSync(
   psql,
   [
      '-h',
      host,
      '-p',
      port,
      '-U',
      user,
      '-d',
      'postgres',
      '-tAc',
      `SELECT 1 FROM pg_database WHERE datname='${db}'`,
   ],
   { env, encoding: 'utf8' }
)

if (exists.status !== 0) {
   console.error(exists.stderr || exists.stdout)
   console.error('Could not connect to local Postgres on 5432. Check password in apps/admin/.env')
   process.exit(1)
}

if (!String(exists.stdout).trim()) {
   console.log(`Creating database ${db}...`)
   psqlRun(['-c', `CREATE DATABASE "${db}"`])
} else {
   console.log(`Database ${db} already exists`)
}

console.log('DONE_SETUP')
