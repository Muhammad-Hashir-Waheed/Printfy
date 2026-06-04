import { CATALOG_PRODUCT_IDS } from '@/lib/catalog'
import { getStaticBlogs } from '@/lib/static-blogs'

const URL = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:7777'

export default function sitemap() {
   const routes = ['', '/products', '/blog'].map((route) => ({
      url: `${URL}${route}`,
      lastModified: new Date().toISOString(),
   }))

   const productRoutes = CATALOG_PRODUCT_IDS.map((id) => ({
      url: `${URL}/products/${id}`,
      lastModified: new Date().toISOString(),
   }))

   const blogRoutes = getStaticBlogs().map((post) => ({
      url: `${URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
   }))

   return [...routes, ...productRoutes, ...blogRoutes]
}
