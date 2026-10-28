/** @type {import('next').NextConfig} */

const securityHeaders = [
   { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
   { key: 'Content-Security-Policy', value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'" },
   { key: 'X-Content-Type-Options', value: 'nosniff' },
   { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
   { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
   { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
]

module.exports = {
   poweredByHeader: false,
   // Lets a production build run alongside `next dev` (e.g. NEXT_DIST_DIR=.next-build)
   distDir: process.env.NEXT_DIST_DIR || '.next',
   eslint: {
      ignoreDuringBuilds: true,
   },
   experimental: {
      outputFileTracingIncludes: {
         '/*': ['./node_modules/.prisma/client/**'],
         '/api/**': ['./node_modules/.prisma/client/**'],
      },
      // Local-only folders (dev uploads, test emails, side-by-side builds) never ship
      outputFileTracingExcludes: {
         '*': ['./.data/**', './.next-build/**'],
      },
   },
   images: {
      // Fewer candidate widths → much shorter srcset attributes on image-heavy pages
      deviceSizes: [640, 828, 1080, 1440, 1920],
      imageSizes: [64, 128, 256, 384],
      // Catalog photos are downloaded to /public/catalog by scripts/fetch-catalog-images.mjs.
      // Supabase is kept for uploads made from the (currently hidden) admin.
      remotePatterns: [
         { protocol: 'https', hostname: 'images.unsplash.com' },
         { protocol: 'https', hostname: '*.supabase.co' },
      ],
   },
   async headers() {
      return [{ source: '/:path*', headers: securityHeaders }]
   },
   async redirects() {
      return [
         { source: '/product', destination: '/shop', permanent: true },
         { source: '/products', destination: '/shop', permanent: false },
         { source: '/products/:path*', destination: '/shop', permanent: false },
         { source: '/customize/:path*', destination: '/shop', permanent: false },
         { source: '/telegram', destination: '/contact', permanent: false },
         { source: '/shop/custom-packaging/request-a-quote', destination: '/quote', permanent: true },
      ]
   },
}
