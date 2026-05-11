/** @type {import('next').NextConfig} */

const path = require('path')

module.exports = {
    transpilePackages: [
        'domain-checkout',
        'domain-fulfillment',
        'domain-orders',
        'domain-pricing',
    ],
    experimental: {
        outputFileTracingRoot: path.join(__dirname, '../../'),
    },
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
        ]
    },
}
