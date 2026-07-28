const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const PG_BIN = 'C:\\Program Files\\PostgreSQL\\18\\bin'
const PG_DATA = 'C:\\Program Files\\PostgreSQL\\18\\data'
const HBA = path.join(PG_DATA, 'pg_hba.conf')
const HBA_BAK = path.join(PG_DATA, 'pg_hba.conf.bak-cursor')
const PSQL = path.join(PG_BIN, 'psql.exe')
const PG_CTL = path.join(PG_BIN, 'pg_ctl.exe')

function loadEnv(file) {
   const env = {}
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

function run(cmd, args, opts = {}) {
   const r = spawnSync(cmd, args, {
      encoding: 'utf8',
      ...opts,
   })
   if (r.stdout) process.stdout.write(r.stdout)
   if (r.stderr) process.stderr.write(r.stderr)
   if (r.status !== 0) {
      throw new Error(`${cmd} failed with ${r.status}`)
   }
   return r
}

const adminEnvPath = path.join('apps', 'admin', '.env')
const storeEnvPath = path.join('apps', 'storefront', '.env')
const adminEnv = loadEnv(adminEnvPath)
let url = adminEnv.DATABASE_URL
if (!url) throw new Error('DATABASE_URL missing in apps/admin/.env')
url = url.replace(/@(127\.0\.0\.1|localhost):\d+/, '@$1:5432')

const u = new URL(url.replace(/^postgres(ql)?:/, 'http:'))
const password = decodeURIComponent(u.password)
const user = decodeURIComponent(u.username) || 'postgres'
const db = u.pathname.replace(/^\//, '') || 'nukta_print'

console.log('1) Backing up pg_hba.conf and enabling temporary trust for localhost...')
if (!fs.existsSync(HBA_BAK)) fs.copyFileSync(HBA, HBA_BAK)
let hba = fs.readFileSync(HBA, 'utf8')
hba = hba.replace(
   /^(host\s+all\s+all\s+127\.0\.0\.1\/32\s+)scram-sha-256/m,
   '$1trust'
)
hba = hba.replace(
   /^(host\s+all\s+all\s+::1\/128\s+)scram-sha-256/m,
   '$1trust'
)
fs.writeFileSync(HBA, hba, 'utf8')
run(PG_CTL, ['reload', '-D', PG_DATA])

console.log('2) Resetting postgres role password to match .env and ensuring DB exists...')
run(PSQL, ['-h', '127.0.0.1', '-p', '5432', '-U', user, '-d', 'postgres', '-v', 'ON_ERROR_STOP=1', '-c', `ALTER USER ${user} WITH PASSWORD '${password.replace(/'/g, "''")}';`])

const exists = spawnSync(
   PSQL,
   ['-h', '127.0.0.1', '-p', '5432', '-U', user, '-d', 'postgres', '-tAc', `SELECT 1 FROM pg_database WHERE datname='${db}'`],
   { encoding: 'utf8' }
)
if (exists.status !== 0) {
   console.error(exists.stderr || exists.stdout)
   throw new Error('Failed checking database existence')
}
if (!String(exists.stdout).trim()) {
   run(PSQL, ['-h', '127.0.0.1', '-p', '5432', '-U', user, '-d', 'postgres', '-c', `CREATE DATABASE "${db}"`])
} else {
   console.log(`Database ${db} already exists`)
}

console.log('3) Restoring pg_hba.conf auth...')
fs.copyFileSync(HBA_BAK, HBA)
run(PG_CTL, ['reload', '-D', PG_DATA])

console.log('4) Writing DATABASE_URL to admin + storefront .env (port 5432)...')
setEnvVar(adminEnvPath, 'DATABASE_URL', url)
setEnvVar(storeEnvPath, 'DATABASE_URL', url)

console.log('5) Verifying password auth...')
run(
   PSQL,
   ['-h', '127.0.0.1', '-p', '5432', '-U', user, '-d', db, '-c', 'SELECT current_database();'],
   { env: { ...process.env, PGPASSWORD: password } }
)

console.log('SETUP_OK')
