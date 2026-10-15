/** @type {import('next').NextConfig} */

module.exports = {
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
      // Catalog photos are downloaded to /public/catalog by scripts/fetch-catalog-images.mjs.
      // Supabase is kept for uploads made from the (currently hidden) admin.
      remotePatterns: [
         { protocol: 'https', hostname: 'images.unsplash.com' },
         { protocol: 'https', hostname: '*.supabase.co' },
      ],
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
