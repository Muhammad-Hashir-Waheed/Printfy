import { CATALOG_PRODUCT_IDS } from '@/lib/catalog'
import prisma from '@/lib/prisma'

const URL = process.env.NEXT_PUBLIC_URL

export const dynamic = 'force-dynamic'

export default async function sitemap() {
   const routes = ['', '/products', '/blog'].map((route) => ({
      url: `${URL}${route}`,
      lastModified: new Date().toISOString(),
   }))

   const catalogProductRoutes = CATALOG_PRODUCT_IDS.map((id) => ({
      url: `${URL}/products/${id}`,
      lastModified: new Date().toISOString(),
   }))

   try {
      const products = (await prisma.product.findMany()).map(
         ({ id, updatedAt }) => ({
            url: `${URL}/products/${id}`,
            lastModified: updatedAt,
         })
      )

      const blogs = (await prisma.blog.findMany()).map(({ slug, updatedAt }) => ({
         url: `${URL}/blog/${slug}`,
         lastModified: updatedAt,
      }))

      const productRoutes =
         products.length > 0 ? products : catalogProductRoutes

      return [...routes, ...productRoutes, ...blogs]
   } catch {
      return [...routes, ...catalogProductRoutes]
   }
}
