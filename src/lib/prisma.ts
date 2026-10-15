import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
   prisma?: PrismaClient
}

function resolveDatabaseUrl() {
   const raw = process.env.DATABASE_URL
   if (!raw) return raw

   const isBuild =
      process.env.NEXT_PHASE === 'phase-production-build' ||
      process.env.npm_lifecycle_event === 'build'
   if (!isBuild) return raw

   try {
      const parsed = new URL(raw)
      parsed.searchParams.set('connection_limit', '10')
      parsed.searchParams.set('pool_timeout', '30')
      return parsed.toString()
   } catch {
      return raw
   }
}

const prisma =
   globalForPrisma.prisma ??
   new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      datasources: process.env.DATABASE_URL
         ? { db: { url: resolveDatabaseUrl() } }
         : undefined,
   })

globalForPrisma.prisma = prisma

export default prisma
