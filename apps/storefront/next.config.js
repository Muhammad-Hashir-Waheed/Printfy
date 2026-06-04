/** @type {import('next').NextConfig} */

const path = require('path')

const storefrontDir = __dirname
/** Vercel "Root Directory" = apps/storefront → do not trace outside that folder */
const buildingFromStorefrontRoot =
   path.resolve(process.cwd()) === path.resolve(storefrontDir)

const nextConfig = {
   eslint: {
      ignoreDuringBuilds: true,
   },
   transpilePackages: [
      'domain-checkout',
      'domain-fulfillment',
      'domain-orders',
      'domain-pricing',
   ],
   webpack: (config) => {
      config.resolve.modules = [
         path.resolve(__dirname, 'node_modules'),
         ...(config.resolve.modules || []),
      ]
      return config
   },
   images: {
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
            destination: '/favicon.svg',
            permanent: false,
         },
      ]
   },
}

if (!buildingFromStorefrontRoot) {
   nextConfig.experimental = {
      outputFileTracingRoot: path.join(__dirname, '../../'),
   }
}

module.exports = nextConfig
