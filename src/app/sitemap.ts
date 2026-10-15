import { ALL_PRODUCTS, DEPARTMENTS } from '@/catalog'
import config from '@/config/site'
import { getStaticBlogs } from '@/lib/static-blogs'
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
   const base = config.url.replace(/\/$/, '')
   const pages = ['', '/shop', '/quote', '/about', '/contact', '/faq', '/blog', '/privacy', '/terms']

   return [
      ...pages.map((path) => ({ url: `${base}${path}`, priority: path === '' ? 1 : 0.6 })),
      ...DEPARTMENTS.map((d) => ({ url: `${base}${d.href}`, priority: 0.9 })),
      ...DEPARTMENTS.flatMap((d) =>
         d.categories
            .filter((c) => !c.external && !c.canonical)
            .map((c) => ({ url: `${base}${c.href}`, priority: 0.8 }))
      ),
      ...ALL_PRODUCTS.map((p) => ({ url: `${base}${p.href}`, priority: 0.7 })),
      ...getStaticBlogs().map((b) => ({ url: `${base}/blog/${b.slug}`, priority: 0.5 })),
   ]
}
