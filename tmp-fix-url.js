const fs = require('fs')
const path = require('path')

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

function rewritePort(url, port) {
   // Support URLs that may have spaces or unusual formatting
   return url.replace(/@(127\.0\.0\.1|localhost):\d+/, `@$1:${port}`)
}

const adminEnvPath = path.join('apps', 'admin', '.env')
const storeEnvPath = path.join('apps', 'storefront', '.env')
const adminEnv = loadEnv(adminEnvPath)
const storeEnv = loadEnv(storeEnvPath)

let url = adminEnv.DATABASE_URL || storeEnv.DATABASE_URL
if (!url) {
   console.error('No DATABASE_URL found')
   process.exit(1)
}

const fixed = rewritePort(url, '5432')
console.log('USING_PORT', '5432')
console.log(
   'DB',
   (() => {
      try {
         const u = new URL(fixed.replace(/^postgres(ql)?:/, 'http:'))
         return u.pathname.replace(/^\//, '')
      } catch {
         return 'unknown'
      }
   })()
)

// Temporarily set for child prisma commands via output file
fs.writeFileSync(
   path.join('tmp-db-url.txt'),
   fixed,
   'utf8'
)
console.log('WROTE tmp-db-url.txt')
