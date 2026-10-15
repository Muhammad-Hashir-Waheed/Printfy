import prisma from '@/lib/prisma'

export async function setCategoryImage(id: string, image: string | null) {
   await prisma.$executeRaw`
      UPDATE "Category"
      SET image = ${image}
      WHERE id = ${id}
   `
}

export async function getCategoryImages(): Promise<Record<string, string | null>> {
   const rows = await prisma.$queryRaw<Array<{ id: string; image: string | null }>>`
      SELECT id, image FROM "Category"
   `
   return Object.fromEntries(rows.map((row) => [row.id, row.image]))
}

export async function getCategoryImage(id: string) {
   const rows = await prisma.$queryRaw<Array<{ image: string | null }>>`
      SELECT image FROM "Category" WHERE id = ${id}
   `
   return rows[0]?.image ?? null
}
