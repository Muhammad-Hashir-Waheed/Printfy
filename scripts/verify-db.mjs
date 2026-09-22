import { createRequire } from 'module'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const storefrontDir = path.resolve(__dirname, '../apps/storefront')
const require = createRequire(path.join(storefrontDir, 'package.json'))
const { PrismaClient } = require('@prisma/client')

const envPath = path.join(storefrontDir, '.env')
if (fs.existsSync(envPath)) {
   for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
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
      if (process.env[key] === undefined) process.env[key] = value
   }
}

async function main() {
   if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is empty. Connect Supabase first.')
      process.exit(1)
   }

   const prisma = new PrismaClient()
   try {
      const products = await prisma.product.count()
      const brands = await prisma.brand.count()
      const categories = await prisma.category.count()
      console.log(
         JSON.stringify({ ok: true, products, brands, categories }, null, 2)
      )
   } finally {
      await prisma.$disconnect()
   }
}

main().catch((error) => {
   console.error(error)
   process.exit(1)
})
