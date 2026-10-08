/** @type {import('next').NextConfig} */

const path = require('path')

module.exports = {
   // Lets a production build run alongside `next dev` (e.g. NEXT_DIST_DIR=.next-build)
   distDir: process.env.NEXT_DIST_DIR || '.next',
   eslint: {
      ignoreDuringBuilds: true,
   },
   transpilePackages: [
      'domain-checkout',
      'domain-fulfillment',
      'domain-orders',
      'domain-pricing',
   ],
   experimental: {
      outputFileTracingRoot: path.join(__dirname, '../../'),
      outputFileTracingIncludes: {
         '/*': ['./node_modules/.prisma/client/**'],
         '/api/**': ['./node_modules/.prisma/client/**'],
      },
   },
   webpack: (config) => {
      config.resolve.modules = [
         path.resolve(__dirname, 'node_modules'),
         ...(config.resolve.modules || []),
      ]
      return config
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
