import config from '@/config/site'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
   const base = config.url.replace(/\/$/, '')
   return {
      rules: {
         userAgent: '*',
         allow: '/',
         disallow: ['/admin', '/api', '/profile', '/login', '/cart', '/checkout', '/search'],
      },
      sitemap: `${base}/sitemap.xml`,
   }
}
