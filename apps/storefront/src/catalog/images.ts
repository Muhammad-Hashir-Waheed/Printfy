import manifest from './image-manifest.json'

export type CatalogImage = {
   src: string
   width: number
   height: number
   alt: string
   /** Average colour, used as a placeholder while loading */
   color?: string
   credit?: { name: string; url: string }
}

type ManifestEntry = {
   id: number
   /** Local file under /public (downloaded by scripts/fetch-catalog-images.mjs) */
   file?: string
   /** Remote URL (legacy) */
   url?: string
   width: number
   height: number
   alt?: string
   color?: string
   photographer?: string
   photographerUrl?: string
}

const MANIFEST = manifest as Record<string, ManifestEntry>

/**
 * Photos that shipped with the original storefront. Used until the Pixabay
 * manifest provides a dedicated image for a key.
 */
const LEGACY: Record<string, string> = {
   'd:packaging': 'shipping-boxes',
   'c:packaging/corrugated-boxes': 'shipping-boxes',
   'c:packaging/mailer-boxes': 'mailer-box',
   'c:packaging/rigid-boxes': 'rigid-box',
   'c:packaging/folding-cartons': 'product-carton',
   'c:packaging/kraft-boxes': 'gift-boxes-kraft',
   'c:packaging/specialty-boxes': 'gift-box',
   'd:food-packaging': 'pizza-box',
   'c:food-packaging/food-boxes': 'pizza-box',
   'c:food-packaging/food-containers': 'food-containers',
   'c:food-packaging/food-bags': 'takeout-bag',
   'c:food-packaging/cups': 'paper-cups',
   'c:food-packaging/food-accessories': 'cup-carrier',
   'd:retail-packaging': 'product-carton',
   'c:retail-packaging/product-boxes': 'product-carton',
   'c:retail-packaging/display-boxes': 'gift-box',
   'c:retail-packaging/inserts': 'packaging-insert',
   'c:retail-packaging/specialty-packaging': 'tissue-paper',
   'd:bags': 'shopping-bags',
   'c:bags/paper-bags': 'retail-shopping-bag',
   'c:bags/kraft-bags': 'takeout-bag',
   'c:bags/fabric-bags': 'shopping-bags',
   'c:bags/pouches': 'poly-mailer',
   'd:labels-stickers': 'stickers-labels',
   'c:labels-stickers/product-labels': 'stickers-labels',
   'c:labels-stickers/stickers': 'stickers-labels',
   'c:labels-stickers/shipping-labels': 'shipping-tape-box',
   'd:custom-packaging': 'hero-duo',
   'c:custom-packaging/custom-boxes': 'mailer-box',
   'c:custom-packaging/custom-bags': 'retail-shopping-bag',
   'd:signage-displays': 'neon-shop',
   'c:signage-displays/neon-signs': 'neon-sign',
   'c:signage-displays/sign-boards': 'led-sign',
   'c:signage-displays/3d-raised-letter-signs': 'neon-brand-brew',
   // Products with an exact legacy match
   'p:food-packaging/food-boxes/custom-pizza-box': 'pizza-box',
   'p:food-packaging/food-boxes/branded-burger-box': 'burger-box',
   'p:food-packaging/food-boxes/fries-and-nugget-carton': 'fries-carton',
   'p:food-packaging/food-boxes/window-bakery-box': 'bakery-box',
   'p:food-packaging/food-containers/hinged-food-container': 'food-containers',
   'p:food-packaging/food-containers/kraft-meal-tray-with-lid': 'meal-tray',
   'p:food-packaging/food-bags/grease-resistant-takeout-bag': 'takeout-bag',
   'p:food-packaging/cups/hot-paper-cup': 'paper-cups',
   'p:food-packaging/food-accessories/4-cup-drink-carrier': 'cup-carrier',
   'p:food-packaging/food-accessories/4-bottle-carrier': 'bottle-carrier',
   'p:packaging/mailer-boxes/branded-mailer-box': 'mailer-box',
   'p:packaging/corrugated-boxes/corrugated-shipping-box': 'shipping-boxes',
   'p:packaging/rigid-boxes/premium-rigid-box': 'rigid-box',
   'p:packaging/kraft-boxes/kraft-gift-box': 'gift-boxes-kraft',
   'p:retail-packaging/specialty-packaging/custom-tissue-paper': 'tissue-paper',
   'p:retail-packaging/specialty-packaging/custom-wrapping-paper': 'wrapping-paper',
   'p:retail-packaging/specialty-packaging/custom-hang-tags': 'hang-tags',
   'p:retail-packaging/inserts/thank-you-insert-card': 'packaging-insert',
   'p:bags/paper-bags/paper-shopping-bag': 'retail-shopping-bag',
   'p:bags/pouches/custom-poly-mailer': 'poly-mailer',
   'p:signage-displays/neon-signs/custom-neon-signs': 'neon-sign',
   'p:signage-displays/neon-signs/neon-shop-signs': 'neon-shop',
   'p:signage-displays/neon-signs/neon-logo-signs': 'neon-brand-brew',
   'p:signage-displays/digital-sign-boards/led-digital-sign-boards': 'led-sign',
}

export function resolveImage(key: string, alt: string): CatalogImage | null {
   const entry = MANIFEST[key]
   if (entry && (entry.file || entry.url)) {
      return {
         src: (entry.file ?? entry.url) as string,
         width: entry.width,
         height: entry.height,
         alt: entry.alt || alt,
         color: entry.color,
         credit: entry.photographer
            ? { name: entry.photographer, url: entry.photographerUrl ?? 'https://pixabay.com' }
            : undefined,
      }
   }

   const legacy = LEGACY[key]
   if (legacy) {
      return { src: `/packaging/${legacy}.jpg`, width: 1200, height: 900, alt }
   }

   return null
}

export function listImageCredits() {
   const seen = new Map<string, string>()
   for (const entry of Object.values(MANIFEST)) {
      if (entry.photographer && !seen.has(entry.photographer)) {
         seen.set(entry.photographer, entry.photographerUrl ?? 'https://pixabay.com')
      }
   }
   return Array.from(seen, ([name, url]) => ({ name, url })).sort((a, b) =>
      a.name.localeCompare(b.name)
   )
}
