import prisma from '@/lib/prisma'


// Site map !
const URL = process.env.NEXT_PUBLIC_URL

export const dynamic = 'force-dynamic'

export default async function sitemap() {
   const routes = ['', '/products', '/blog'].map((route) => ({
      url: `${URL}${route}`,
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

      return [...routes, ...products, ...blogs]
   } catch {
      return routes
   }
}
