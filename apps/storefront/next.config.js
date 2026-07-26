/** @type {import('next').NextConfig} */

const path = require('path')

module.exports = {
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
      // Local /public assets must resolve on Vercel monorepo root deploys
      // (apps/storefront/public is synced to repo-root /public at build time).
      remotePatterns: [
         {
            protocol: 'https',
            hostname: '**',
         },
      ],
   },
   async redirects() {
      return [
         {
            source: '/product',
            destination: '/products',
            permanent: true,
         },
         {
            source: '/favicon.ico',
            destination: '/icon.svg',
            permanent: false,
         },
         {
            source: '/favicon.svg',
            destination: '/icon.svg',
            permanent: false,
         },
      ]
   },
}
