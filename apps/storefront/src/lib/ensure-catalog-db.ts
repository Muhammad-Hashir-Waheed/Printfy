import { DUMMY_BRANDS, DUMMY_CATEGORIES, DUMMY_PRODUCTS } from '@/lib/catalog-dummy'
import type { PrismaClient } from '@prisma/client'

/** Upsert catalog dummy products so checkout works without running seed manually */
export async function ensureCatalogProductsInDb(
   prisma: PrismaClient,
   productIds: string[]
) {
   for (const brand of DUMMY_BRANDS) {
      await prisma.brand.upsert({
         where: { title: brand.title },
         update: {},
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
         update: {},
         create: {
            id: category.id,
            title: category.title,
            description: category.description,
         },
      })
   }

   for (const productId of productIds) {
      const product = DUMMY_PRODUCTS.find((entry) => entry.id === productId)
      if (!product) continue

      const categoryTitle = product.categories?.[0]?.title
      const brandTitle = product.brand?.title
      if (!categoryTitle || !brandTitle) continue

      const category = await prisma.category.findUnique({
         where: { title: categoryTitle },
      })
      const brand = await prisma.brand.findUnique({
         where: { title: brandTitle },
      })
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
         },
      })

      for (const variant of product.variants ?? []) {
         await prisma.variant.upsert({
            where: { id: variant.id },
            update: {
               name: variant.name,
               value: variant.value,
               priceModifier: variant.priceModifier,
            },
            create: {
               id: variant.id,
               name: variant.name,
               value: variant.value,
               priceModifier: variant.priceModifier,
               productId: product.id,
            },
         })
      }
   }
}
