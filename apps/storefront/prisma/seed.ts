import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { join } from 'path'
import { DUMMY_BRANDS, DUMMY_CATEGORIES, DUMMY_PRODUCTS } from '../src/lib/catalog-dummy'

const prisma = new PrismaClient({
   datasources: {
      db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL },
   },
})

async function main() {
   console.log('Seeding POD catalog...')

   for (const brand of DUMMY_BRANDS) {
      await prisma.brand.upsert({
         where: { title: brand.title },
         update: { description: brand.description, logo: brand.logo },
         create: {
            id: brand.id,
            title: brand.title,
            description: brand.description,
            logo: brand.logo,
         },
      })
   }

   for (const category of DUMMY_CATEGORIES) {
      await prisma.category.upsert({
         where: { title: category.title },
         update: { description: category.description },
         create: {
            id: category.id,
            title: category.title,
            description: category.description,
         },
      })
   }

   for (const product of DUMMY_PRODUCTS) {
      const categoryTitle = product.categories?.[0]?.title
      const brandTitle = product.brand?.title

      const category = categoryTitle
         ? await prisma.category.findUnique({ where: { title: categoryTitle } })
         : null
      const brand = brandTitle
         ? await prisma.brand.findUnique({ where: { title: brandTitle } })
         : null

      if (!category || !brand) continue

      await prisma.variant.deleteMany({ where: { productId: product.id } })

      await prisma.product.upsert({
         where: { id: product.id },
         update: {
            title: product.title,
            description: product.description,
            images: product.images,
            keywords: product.keywords,
            metadata: product.metadata as object,
            price: product.price,
            discount: product.discount,
            stock: product.stock,
            isPhysical: product.isPhysical,
            isAvailable: product.isAvailable,
            isFeatured: product.isFeatured,
            brandId: brand.id,
            categories: { set: [{ id: category.id }] },
         },
         create: {
            id: product.id,
            title: product.title,
            description: product.description,
            images: product.images,
            keywords: product.keywords,
            metadata: product.metadata as object,
            price: product.price,
            discount: product.discount,
            stock: product.stock,
            isPhysical: product.isPhysical,
            isAvailable: product.isAvailable,
            isFeatured: product.isFeatured,
            brandId: brand.id,
            categories: { connect: [{ id: category.id }] },
            variants: {
               create: (product.variants ?? []).map((v) => ({
                  id: v.id,
                  name: v.name,
                  value: v.value,
                  priceModifier: v.priceModifier,
               })),
            },
         },
      })

      if (product.variants?.length) {
         for (const v of product.variants) {
            await prisma.variant.upsert({
               where: { id: v.id },
               update: {
                  name: v.name,
                  value: v.value,
                  priceModifier: v.priceModifier,
               },
               create: {
                  id: v.id,
                  name: v.name,
                  value: v.value,
                  priceModifier: v.priceModifier,
                  productId: product.id,
               },
            })
         }
      }
   }

   console.log(`Seeded ${DUMMY_PRODUCTS.length} products.`)

   try {
      const rlsSql = readFileSync(join(__dirname, 'rls.sql'), 'utf8')
      const start = rlsSql.indexOf('DO $$')
      await prisma.$executeRawUnsafe(start >= 0 ? rlsSql.slice(start) : rlsSql)
      console.log('Enabled RLS on public tables (Prisma still bypasses as the postgres/prisma role).')
   } catch (error) {
      console.warn(
         'RLS SQL skipped (run it as the table owner in Supabase):',
         error instanceof Error ? error.message : error
      )
   }
}

main()
   .then(() => prisma.$disconnect())
   .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
   })
