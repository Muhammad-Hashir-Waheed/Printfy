import config from '@/config/site'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
   const base = config.url.replace(/\/$/, '')
   return {
      rules: {
         userAgent: '*',
         allow: '/',
         // '/quote?' stops Google crawling one quote URL per product (/quote?product=...);
         // they all canonicalise to /quote, and crawling them slows down indexing of real pages
         disallow: ['/admin', '/api', '/profile', '/login', '/cart', '/checkout', '/search', '/quote?'],
      },
      sitemap: `${base}/sitemap.xml`,
   }
}
