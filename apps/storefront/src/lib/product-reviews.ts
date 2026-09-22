import prisma from '@/lib/prisma'

export type StoreReview = {
   id: string
   productId: string
   productTitle: string
   customerName: string | null
   text: string
   rating: number
   isVisible: boolean
}

async function reviewerId() {
   const reviewer = await prisma.user.upsert({
      where: { email: 'reviews@localhost' },
      update: {},
      create: {
         email: 'reviews@localhost',
         name: 'Customer',
      },
   })
   return reviewer.id
}

export async function listAdminReviews(): Promise<StoreReview[]> {
   return prisma.$queryRaw<StoreReview[]>`
      SELECT
         r.id,
         r."productId",
         p.title AS "productTitle",
         r."customerName",
         r.text,
         r.rating,
         r."isVisible"
      FROM "ProductReview" r
      INNER JOIN "Product" p ON p.id = r."productId"
      ORDER BY r."createdAt" DESC
   `
}

export async function getAdminReview(id: string) {
   const rows = await prisma.$queryRaw<StoreReview[]>`
      SELECT
         r.id,
         r."productId",
         p.title AS "productTitle",
         r."customerName",
         r.text,
         r.rating,
         r."isVisible"
      FROM "ProductReview" r
      INNER JOIN "Product" p ON p.id = r."productId"
      WHERE r.id = ${id}
      LIMIT 1
   `
   return rows[0] ?? null
}

export async function listVisibleProductReviews(productId: string) {
   return prisma.$queryRaw<
      Array<{
         id: string
         customerName: string | null
         text: string
         rating: number
      }>
   >`
      SELECT id, "customerName", text, rating
      FROM "ProductReview"
      WHERE "productId" = ${productId} AND "isVisible" = true
      ORDER BY "createdAt" DESC
   `
}

export async function createAdminReview(input: {
   productId: string
   customerName: string
   text: string
   rating: number
   isVisible: boolean
}) {
   const id = `rev_${crypto.randomUUID()}`
   const userId = await reviewerId()
   await prisma.$executeRaw`
      INSERT INTO "ProductReview" (
         id, text, rating, "productId", "userId", "customerName", "isVisible", "createdAt", "updatedAt"
      )
      VALUES (
         ${id},
         ${input.text},
         ${input.rating},
         ${input.productId},
         ${userId},
         ${input.customerName},
         ${input.isVisible},
         NOW(),
         NOW()
      )
   `
   return getAdminReview(id)
}

export async function updateAdminReview(
   id: string,
   input: {
      productId: string
      customerName: string
      text: string
      rating: number
      isVisible: boolean
   }
) {
   await prisma.$executeRaw`
      UPDATE "ProductReview"
      SET
         text = ${input.text},
         rating = ${input.rating},
         "productId" = ${input.productId},
         "customerName" = ${input.customerName},
         "isVisible" = ${input.isVisible},
         "updatedAt" = NOW()
      WHERE id = ${id}
   `
   return getAdminReview(id)
}

export async function deleteAdminReview(id: string) {
   await prisma.$executeRaw`DELETE FROM "ProductReview" WHERE id = ${id}`
}
