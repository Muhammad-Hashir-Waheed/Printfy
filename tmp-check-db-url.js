const fs = require('fs')

function parse(file) {
   if (!fs.existsSync(file)) return { file, missing: true }
   const t = fs.readFileSync(file, 'utf8')
   const m = t.match(/DATABASE_URL\s*=\s*["']?([^"'\r\n]+)["']?/)
   if (!m) return { file, missingUrl: true }
   try {
      const u = new URL(m[1].replace(/^postgres(ql)?:/, 'http:'))
      return {
         file,
         host: u.hostname,
         port: u.port || '5432',
         db: u.pathname.replace(/^\//, ''),
         user: decodeURIComponent(u.username),
         hasPassword: Boolean(u.password),
      }
   } catch (e) {
      return { file, err: e.message }
   }
}

console.log(
   JSON.stringify(
      [parse('apps/admin/.env'), parse('apps/storefront/.env')],
      null,
      2
   )
)
