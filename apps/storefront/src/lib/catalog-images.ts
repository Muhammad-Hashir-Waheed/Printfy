/** Packaging catalog images — local assets preferred (reliable on Vercel) */
import bakeryBoxImg from '@/assets/packaging/bakery-box.jpg'
import bottleCarrierImg from '@/assets/packaging/bottle-carrier.jpg'
import burgerBoxImg from '@/assets/packaging/burger-box.jpg'
import cupCarrierImg from '@/assets/packaging/cup-carrier.jpg'
import foodContainersImg from '@/assets/packaging/food-containers.jpg'
import friesCartonImg from '@/assets/packaging/fries-carton.jpg'
import giftBoxImg from '@/assets/packaging/gift-box.jpg'
import giftBoxesKraftImg from '@/assets/packaging/gift-boxes-kraft.jpg'
import hangTagsImg from '@/assets/packaging/hang-tags.jpg'
import heroDuoImg from '@/assets/packaging/hero-duo.jpg'
import mailerBoxImg from '@/assets/packaging/mailer-box.jpg'
import mealTrayImg from '@/assets/packaging/meal-tray.jpg'
import packagingInsertImg from '@/assets/packaging/packaging-insert.jpg'
import paperCupsImg from '@/assets/packaging/paper-cups.jpg'
import pizzaBoxImg from '@/assets/packaging/pizza-box.jpg'
import polyMailerImg from '@/assets/packaging/poly-mailer.jpg'
import productCartonImg from '@/assets/packaging/product-carton.jpg'
import retailShoppingBagImg from '@/assets/packaging/retail-shopping-bag.jpg'
import rigidBoxImg from '@/assets/packaging/rigid-box.jpg'
import shippingBoxesImg from '@/assets/packaging/shipping-boxes.jpg'
import shippingTapeBoxImg from '@/assets/packaging/shipping-tape-box.jpg'
import shoppingBagsImg from '@/assets/packaging/shopping-bags.jpg'
import stickersLabelsImg from '@/assets/packaging/stickers-labels.jpg'
import takeoutBagImg from '@/assets/packaging/takeout-bag.jpg'
import tissuePaperImg from '@/assets/packaging/tissue-paper.jpg'
import wrappingPaperImg from '@/assets/packaging/wrapping-paper.jpg'
import neonSignImg from '@/assets/packaging/neon-sign.jpg'
import ledSignImg from '@/assets/packaging/led-sign.jpg'
import neonShopImg from '@/assets/packaging/neon-shop.jpg'

function assetSrc(img: string | { src: string }) {
   return typeof img === 'string' ? img : img.src
}

export const CATALOG_IMAGES = {
   /** Bundled packaging shots — served from /_next/static */
   customBoxLarge: assetSrc(pizzaBoxImg),
   customBoxMedium: assetSrc(burgerBoxImg),
   customBoxSmall: assetSrc(friesCartonImg),
   customPaperBag: assetSrc(takeoutBagImg),
   customPackagingHero: assetSrc(heroDuoImg),
   shoppingBag: assetSrc(shoppingBagsImg),
   retailBag: assetSrc(retailShoppingBagImg),
   mailer: assetSrc(mailerBoxImg),
   shippingBoxes: assetSrc(shippingBoxesImg),
   shippingTapeBox: assetSrc(shippingTapeBoxImg),
   sticker: assetSrc(stickersLabelsImg),
   bakeryBox: assetSrc(bakeryBoxImg),
   giftBox: assetSrc(giftBoxImg),
   giftBoxesKraft: assetSrc(giftBoxesKraftImg),
   rigidBox: assetSrc(rigidBoxImg),
   foodContainer: assetSrc(foodContainersImg),
   paperCups: assetSrc(paperCupsImg),
   cupCarrier: assetSrc(cupCarrierImg),
   polyMailer: assetSrc(polyMailerImg),
   hangTags: assetSrc(hangTagsImg),
   tissuePaper: assetSrc(tissuePaperImg),
   packagingInsert: assetSrc(packagingInsertImg),
   wrappingPaper: assetSrc(wrappingPaperImg),
   bottleCarrier: assetSrc(bottleCarrierImg),
   mealTray: assetSrc(mealTrayImg),
   productCarton: assetSrc(productCartonImg),
   neonSign: assetSrc(neonSignImg),
   ledSign: assetSrc(ledSignImg),
   neonShop: assetSrc(neonShopImg),
   /** Aliases used by older product records — point at matching category art */
   tote: assetSrc(shoppingBagsImg),
   bag: assetSrc(retailShoppingBagImg),
   backpack: assetSrc(polyMailerImg),
   product: assetSrc(productCartonImg),
   mug: assetSrc(paperCupsImg),
   coffee: assetSrc(cupCarrierImg),
   phone: assetSrc(hangTagsImg),
   cap: assetSrc(shoppingBagsImg),
   /** Legacy apparel keys kept for type safety (point at packaging) */
   teeWhite: assetSrc(pizzaBoxImg),
   teeFolded: assetSrc(burgerBoxImg),
   teeStack: assetSrc(friesCartonImg),
   teeHanger: assetSrc(takeoutBagImg),
   polo: assetSrc(mailerBoxImg),
   tank: assetSrc(shoppingBagsImg),
   hoodie: assetSrc(shippingBoxesImg),
   sweatshirt: assetSrc(giftBoxImg),
   pants: assetSrc(rigidBoxImg),
   leggings: assetSrc(bakeryBoxImg),
   customPrintApparel: assetSrc(heroDuoImg),
   customPrintTees: assetSrc(pizzaBoxImg),
} as const

export const DEFAULT_PRODUCT_IMAGE = CATALOG_IMAGES.customPackagingHero

/** Per-product canonical images (stable ids) */
export const PRODUCT_IMAGES_BY_ID: Record<string, string[]> = {
   'custom-pizza-box': [CATALOG_IMAGES.customBoxLarge, CATALOG_IMAGES.customPackagingHero],
   'burger-box': [CATALOG_IMAGES.customBoxMedium, CATALOG_IMAGES.customBoxLarge],
   'fries-carton': [CATALOG_IMAGES.customBoxSmall, CATALOG_IMAGES.customBoxMedium],
   'meal-tray-lid': [CATALOG_IMAGES.mealTray, CATALOG_IMAGES.foodContainer],
   'takeout-bag': [CATALOG_IMAGES.customPaperBag, CATALOG_IMAGES.shoppingBag],
   'cup-carrier': [CATALOG_IMAGES.cupCarrier, CATALOG_IMAGES.paperCups],
   'hot-paper-cup': [CATALOG_IMAGES.paperCups, CATALOG_IMAGES.cupCarrier],
   'mailer-box': [CATALOG_IMAGES.mailer, CATALOG_IMAGES.shippingBoxes],
   'poly-mailer': [CATALOG_IMAGES.polyMailer, CATALOG_IMAGES.mailer],
   'sticker-pack': [CATALOG_IMAGES.sticker, CATALOG_IMAGES.giftBox],
   'canvas-tote': [CATALOG_IMAGES.shoppingBag, CATALOG_IMAGES.retailBag],
   'hang-tag-set': [CATALOG_IMAGES.hangTags, CATALOG_IMAGES.sticker],
   'printed-tissue': [CATALOG_IMAGES.tissuePaper, CATALOG_IMAGES.giftBox],
   'thank-you-insert': [CATALOG_IMAGES.packagingInsert, CATALOG_IMAGES.sticker],
   'custom-wrapping-paper': [CATALOG_IMAGES.wrappingPaper, CATALOG_IMAGES.giftBoxesKraft],
   '4-bottle-carrier': [CATALOG_IMAGES.bottleCarrier, CATALOG_IMAGES.customBoxSmall],
   'product-sleeve': [CATALOG_IMAGES.productCarton, CATALOG_IMAGES.rigidBox],
   'custom-neon-sign': [CATALOG_IMAGES.neonSign, CATALOG_IMAGES.neonShop],
   'led-channel-letter': [CATALOG_IMAGES.ledSign, CATALOG_IMAGES.neonSign],
   'shop-open-neon': [CATALOG_IMAGES.neonShop, CATALOG_IMAGES.neonSign],
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
