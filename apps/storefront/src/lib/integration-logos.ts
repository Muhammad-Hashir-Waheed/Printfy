/**
 * Local public icons — served from /icons (also bundled under public/icons).
 * Avoids CDN breakage and keeps SSR/client imports simple.
 */
export const INTEGRATION_LOGOS = {
   shopify: '/icons/shopify.svg',
   amazon: '/icons/amazon.svg',
   etsy: '/icons/etsy.svg',
   woocommerce: '/icons/woocommerce.svg',
   wix: '/icons/wix.svg',
   squarespace: '/icons/squarespace.svg',
   square: '/icons/square.svg',
   bigcommerce: '/icons/bigcommerce.svg',
   webflow: '/icons/webflow.svg',
   stripe: '/icons/stripe.svg',
   paypal: '/icons/paypal.svg',
   shopware: '/icons/shopware.svg',
} as const
