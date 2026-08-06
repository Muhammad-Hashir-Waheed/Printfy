import amazonLogo from '@/assets/amazon.svg'
import bigcommerceLogo from '@/assets/integrations/bigcommerce.svg'
import etsyLogo from '@/assets/integrations/etsy.svg'
import paypalLogo from '@/assets/integrations/paypal.svg'
import shopifyLogo from '@/assets/integrations/shopify.svg'
import shopwareLogo from '@/assets/integrations/shopware.svg'
import squareLogo from '@/assets/integrations/square.svg'
import squarespaceLogo from '@/assets/integrations/squarespace.svg'
import stripeLogo from '@/assets/integrations/stripe.svg'
import webflowLogo from '@/assets/integrations/webflow.svg'
import wixLogo from '@/assets/integrations/wix.svg'
import woocommerceLogo from '@/assets/integrations/woocommerce.svg'

function assetSrc(img: string | { src: string }) {
   return typeof img === 'string' ? img : img.src
}

/** Locally bundled logos — never rely on CDN (breaks on Vercel / blocked networks) */
export const INTEGRATION_LOGOS = {
   shopify: assetSrc(shopifyLogo),
   amazon: assetSrc(amazonLogo),
   etsy: assetSrc(etsyLogo),
   woocommerce: assetSrc(woocommerceLogo),
   wix: assetSrc(wixLogo),
   squarespace: assetSrc(squarespaceLogo),
   square: assetSrc(squareLogo),
   bigcommerce: assetSrc(bigcommerceLogo),
   webflow: assetSrc(webflowLogo),
   stripe: assetSrc(stripeLogo),
   paypal: assetSrc(paypalLogo),
   shopware: assetSrc(shopwareLogo),
} as const
