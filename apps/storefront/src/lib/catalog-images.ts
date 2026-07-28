/** Verified Unsplash URLs (HEAD 200) */
import burgerBoxImg from '@/assets/packaging/burger-box.jpg'
import friesCartonImg from '@/assets/packaging/fries-carton.jpg'
import heroDuoImg from '@/assets/packaging/hero-duo.jpg'
import pizzaBoxImg from '@/assets/packaging/pizza-box.jpg'
import takeoutBagImg from '@/assets/packaging/takeout-bag.jpg'

const q = 'q=80&w=1200&auto=format&fit=crop'

function assetSrc(img: string | { src: string }) {
   return typeof img === 'string' ? img : img.src
}

export const CATALOG_IMAGES = {
   teeWhite: `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?${q}`,
   teeFolded: `https://images.unsplash.com/photo-1503341504253-dff4815485f1?${q}`,
   teeStack: `https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?${q}`,
   teeHanger: `https://images.unsplash.com/photo-1576566588028-4147f3842f27?${q}`,
   polo: `https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?${q}`,
   tank: `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?${q}`,
   hoodie: `https://images.unsplash.com/photo-1556821840-3a63f95609a7?${q}`,
   sweatshirt: `https://images.unsplash.com/photo-1516826957135-700dedea698c?${q}`,
   pants: `https://images.unsplash.com/photo-1473966968600-fa801b869a1a?${q}`,
   leggings: `https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?${q}`,
   tote: `https://images.unsplash.com/photo-1590874103328-eac38a683ce7?${q}`,
   bag: `https://images.unsplash.com/photo-1584917865442-de89df76afd3?${q}`,
   backpack: `https://images.unsplash.com/photo-1553062407-98eeb64c6a62?${q}`,
   mailer:
      'https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg?auto=compress&cs=tinysrgb&w=1200',
   product: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?${q}`,
   mug: `https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?${q}`,
   coffee: `https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?${q}`,
   cap: `https://images.unsplash.com/photo-1560250097-0b93528c311a?${q}`,
   phone: `https://images.unsplash.com/photo-1601593346740-925612772716?${q}`,
   sticker: `https://images.unsplash.com/photo-1611162617474-5b21e879e113?${q}`,
   /** Bundled packaging shots — served from /_next/static (works on Vercel monorepo) */
   customBoxLarge: assetSrc(pizzaBoxImg),
   customBoxMedium: assetSrc(burgerBoxImg),
   customBoxSmall: assetSrc(friesCartonImg),
   customPaperBag: assetSrc(takeoutBagImg),
   /** Pizza box + burger box side by side — homepage hero */
   customPackagingHero: assetSrc(heroDuoImg),
   /** Print-on-demand apparel */
   customPrintApparel: `https://images.unsplash.com/photo-1503341504253-dff4815485f1?${q}`,
   customPrintTees: `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?${q}`,
} as const

export const DEFAULT_PRODUCT_IMAGE = CATALOG_IMAGES.product

/** Per-product canonical images (stable ids) */
export const PRODUCT_IMAGES_BY_ID: Record<string, string[]> = {
   'classic-crew-tee': [CATALOG_IMAGES.teeWhite, CATALOG_IMAGES.teeStack, CATALOG_IMAGES.teeHanger],
   'premium-tee': [CATALOG_IMAGES.teeFolded, CATALOG_IMAGES.teeStack],
   'pullover-hoodie': [CATALOG_IMAGES.hoodie, CATALOG_IMAGES.sweatshirt],
   'jogger-pants': [CATALOG_IMAGES.pants, CATALOG_IMAGES.leggings],
   leggings: [CATALOG_IMAGES.leggings, CATALOG_IMAGES.pants],
   'canvas-tote': [CATALOG_IMAGES.tote, CATALOG_IMAGES.bag],
   'drawstring-bag': [CATALOG_IMAGES.backpack],
   'mailer-box': [CATALOG_IMAGES.mailer, CATALOG_IMAGES.product],
   'sticker-pack': [CATALOG_IMAGES.sticker, CATALOG_IMAGES.product],
   'ceramic-mug': [CATALOG_IMAGES.mug, CATALOG_IMAGES.coffee],
   'poster-print': [CATALOG_IMAGES.sticker, CATALOG_IMAGES.product],
   'baseball-cap': [CATALOG_IMAGES.cap],
   'tank-top': [CATALOG_IMAGES.tank],
   'polo-shirt': [CATALOG_IMAGES.polo, CATALOG_IMAGES.teeFolded],
   sweatpants: [CATALOG_IMAGES.sweatshirt, CATALOG_IMAGES.pants],
   'custom-pizza-box': [CATALOG_IMAGES.customBoxLarge, CATALOG_IMAGES.customPackagingHero],
   'burger-box': [CATALOG_IMAGES.customBoxMedium, CATALOG_IMAGES.customBoxLarge],
   'fries-carton': [CATALOG_IMAGES.customBoxSmall, CATALOG_IMAGES.customBoxMedium],
   'meal-tray-lid': [CATALOG_IMAGES.customPackagingHero, CATALOG_IMAGES.customBoxMedium],
   'takeout-bag': [CATALOG_IMAGES.customPaperBag, CATALOG_IMAGES.mailer],
   'cup-carrier': [CATALOG_IMAGES.customBoxSmall, CATALOG_IMAGES.customPaperBag],
}

const BROKEN_UNSPLASH_IDS = [
   'photo-1618354691373-d851fcf5c3b0',
   'photo-1620799140408-f9f8e7b7ecb1',
   'photo-1622445265470-35b2494dd58e',
   'photo-1544966503-7cc5ac882d5f',
   'photo-1506629082955-511b05f03b55',
   'photo-1586075010923-aa2a337b7c52',
   'photo-1514228742587-6b1558fcca3e',
   'photo-1513475382585-d06e58bcb0e6',
   'photo-1588850561407-ed78c282e68b',
   'photo-1604719312566-8912f0863e2c',
   'photo-1563293902-0c8e82f4c4e8',
   'photo-1610369848071-ba2689bb9225',
   'photo-1607083206869-4bb07c11dbb0',
   'photo-1558618666-fcd25c85cd64',
]

export function isLikelyBrokenUnsplash(url: string) {
   return BROKEN_UNSPLASH_IDS.some((id) => url.includes(id))
}

export function getProductFallbackImage(productId?: string) {
   const canonical = productId ? PRODUCT_IMAGES_BY_ID[productId] : undefined
   return canonical?.[0] ?? DEFAULT_PRODUCT_IMAGE
}

export function resolveProductImages(
   productId: string,
   images?: string[] | null
): string[] {
   const canonical = PRODUCT_IMAGES_BY_ID[productId] ?? [DEFAULT_PRODUCT_IMAGE]

   if (!images?.length) {
      return canonical
   }

   const valid = images.filter(
      (url) =>
         typeof url === 'string' &&
         (url.startsWith('http') || url.startsWith('/')) &&
         !isLikelyBrokenUnsplash(url)
   )

   return valid.length > 0 ? valid : canonical
}
