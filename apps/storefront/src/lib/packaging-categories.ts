import { CATALOG_IMAGES as I } from '@/lib/catalog-images'
import { slugifyText } from '@/lib/slug'

/** Local href builder — avoids circular import via catalog-navigation → catalog-dummy */
function packagingHref(filters: { productType?: string; category?: string; q?: string }) {
   const params = new URLSearchParams()
   if (filters.category) params.set('category', slugifyText(filters.category))
   if (filters.productType) params.set('productType', filters.productType.trim().toLowerCase())
   if (filters.q) params.set('q', filters.q)
   const query = params.toString()
   return query ? `/products?${query}` : '/products'
}

export type PackagingCategory = {
   id: string
   title: string
   description: string
   /** Broad type used in productType filters */
   productType: string
   /** Search query for gallery filtering */
   q: string
   /** Exactly 3 related images for this category — primary first, unique per category */
   images: [string, string, string]
   href: string
}

/**
 * Each category gets a unique primary image (index 0).
 * Secondary thumbs stay in the same product family so the mega-menu doesn't repeat
 * the same 3-image strip across unrelated rows.
 */
export const PACKAGING_CATEGORIES: PackagingCategory[] = [
   {
      id: 'cat-pizza-boxes',
      title: 'Pizza Boxes',
      description: 'Custom printed corrugated pizza boxes',
      productType: 'Food Packaging',
      q: 'pizza',
      images: [I.customBoxLarge, I.customPackagingHero, I.bakeryBox],
      href: packagingHref({ category: 'Pizza Boxes' }),
   },
   {
      id: 'cat-burger-boxes',
      title: 'Burger Boxes',
      description: 'Clamshell burger & sandwich boxes',
      productType: 'Food Packaging',
      q: 'burger',
      images: [I.customBoxMedium, I.foodContainer, I.customBoxSmall],
      href: packagingHref({ category: 'Burger Boxes' }),
   },
   {
      id: 'cat-fries-cartons',
      title: 'Fries Cartons',
      description: 'Open-top fries & sides cartons',
      productType: 'Food Packaging',
      q: 'fries',
      images: [I.customBoxSmall, I.customBoxMedium, I.customPaperBag],
      href: packagingHref({ category: 'Fries Cartons' }),
   },
   {
      id: 'cat-takeout-bags',
      title: 'To Go Bags',
      description: 'Grease-resistant takeout paper bags',
      productType: 'Food Packaging',
      q: 'takeout',
      images: [I.customPaperBag, I.shoppingBag, I.retailBag],
      href: packagingHref({ category: 'To Go Bags' }),
   },
   {
      id: 'cat-paper-cups',
      title: 'Paper Cups',
      description: 'Branded hot & cold paper cups',
      productType: 'Food Packaging',
      q: 'cup',
      images: [I.paperCups, I.cupCarrier, I.customBoxSmall],
      href: packagingHref({ category: 'Paper Cups' }),
   },
   {
      id: 'cat-meal-trays',
      title: 'Meal Trays',
      description: 'Compartment trays with lids',
      productType: 'Food Packaging',
      q: 'tray',
      images: [I.mealTray, I.foodContainer, I.customPackagingHero],
      href: packagingHref({ category: 'Meal Trays' }),
   },
   {
      id: 'cat-cup-carriers',
      title: 'Cup Carriers',
      description: '2-cup and 4-cup drink carriers',
      productType: 'Food Packaging',
      q: 'carrier',
      images: [I.cupCarrier, I.paperCups, I.customPaperBag],
      href: packagingHref({ category: 'Cup Carriers' }),
   },
   {
      id: 'cat-mailer-boxes',
      title: 'Mailer Boxes',
      description: 'E-commerce mailer boxes with branding',
      productType: 'Shipping Packaging',
      q: 'mailer',
      images: [I.mailer, I.shippingBoxes, I.shippingTapeBox],
      href: packagingHref({ category: 'Mailer Boxes' }),
   },
   {
      id: 'cat-shipping-boxes',
      title: 'Shipping Boxes',
      description: 'Corrugated shipping cartons',
      productType: 'Shipping Packaging',
      q: 'shipping',
      images: [I.shippingBoxes, I.shippingTapeBox, I.mailer],
      href: packagingHref({ category: 'Shipping Boxes' }),
   },
   {
      id: 'cat-poly-mailers',
      title: 'Shipping Mailers',
      description: 'Poly & kraft shipping mailers',
      productType: 'Shipping Packaging',
      q: 'poly',
      images: [I.polyMailer, I.mailer, I.shippingTapeBox],
      href: packagingHref({ category: 'Shipping Mailers' }),
   },
   {
      id: 'cat-shopping-bags',
      title: 'Shopping Bags',
      description: 'Custom retail shopping bags',
      productType: 'Retail Packaging',
      q: 'shopping',
      images: [I.shoppingBag, I.retailBag, I.customPaperBag],
      href: packagingHref({ category: 'Shopping Bags' }),
   },
   {
      id: 'cat-product-packaging',
      title: 'Product Packaging',
      description: 'Product sleeves, cartons & wraps',
      productType: 'Retail Packaging',
      q: 'product',
      images: [I.productCarton, I.rigidBox, I.giftBoxesKraft],
      href: packagingHref({ category: 'Product Packaging' }),
   },
   {
      id: 'cat-hang-tags',
      title: 'Custom Tags',
      description: 'Hang tags for retail apparel & gifts',
      productType: 'Retail Packaging',
      q: 'tag',
      images: [I.hangTags, I.sticker, I.retailBag],
      href: packagingHref({ category: 'Custom Tags' }),
   },
   {
      id: 'cat-stickers',
      title: 'Stickers & Labels',
      description: 'Branding stickers and packaging labels',
      productType: 'Packaging Accessories',
      q: 'sticker',
      images: [I.sticker, I.hangTags, I.packagingInsert],
      href: packagingHref({ category: 'Stickers & Labels' }),
   },
   {
      id: 'cat-tissue',
      title: 'Tissue Paper',
      description: 'Custom printed tissue for unboxing',
      productType: 'Packaging Accessories',
      q: 'tissue',
      images: [I.tissuePaper, I.giftBoxesKraft, I.giftBox],
      href: packagingHref({ category: 'Tissue Paper' }),
   },
   {
      id: 'cat-inserts',
      title: 'Packaging Inserts',
      description: 'Insert cards, thank-you notes & cards',
      productType: 'Packaging Accessories',
      q: 'insert',
      images: [I.packagingInsert, I.sticker, I.hangTags],
      href: packagingHref({ category: 'Packaging Inserts' }),
   },
   {
      id: 'cat-bakery-boxes',
      title: 'Bakery Boxes',
      description: 'Window bakery & pastry boxes',
      productType: 'Food Packaging',
      q: 'bakery',
      images: [I.bakeryBox, I.giftBoxesKraft, I.customBoxLarge],
      href: packagingHref({ category: 'Bakery Boxes' }),
   },
   {
      id: 'cat-food-containers',
      title: 'Food Containers',
      description: 'Clamshells & hinged food containers',
      productType: 'Food Packaging',
      q: 'container',
      images: [I.foodContainer, I.mealTray, I.customBoxMedium],
      href: packagingHref({ category: 'Food Containers' }),
   },
   {
      id: 'cat-gift-boxes',
      title: 'Gift Boxes',
      description: 'Branded gift & presentation boxes',
      productType: 'Retail Packaging',
      q: 'gift',
      images: [I.giftBox, I.giftBoxesKraft, I.wrappingPaper],
      href: packagingHref({ category: 'Gift Boxes' }),
   },
   {
      id: 'cat-rigid-boxes',
      title: 'Rigid Boxes',
      description: 'Premium rigid & magnetic closure boxes',
      productType: 'Retail Packaging',
      q: 'rigid',
      images: [I.rigidBox, I.productCarton, I.mailer],
      href: packagingHref({ category: 'Rigid Boxes' }),
   },
   {
      id: 'cat-wrapping-paper',
      title: 'Wrapping Paper',
      description: 'Custom printed wrapping paper rolls',
      productType: 'Packaging Accessories',
      q: 'wrap',
      images: [I.wrappingPaper, I.tissuePaper, I.giftBox],
      href: packagingHref({ category: 'Wrapping Paper' }),
   },
   {
      id: 'cat-bottle-carriers',
      title: 'Bottle Carriers',
      description: 'Cardboard bottle & jar carriers',
      productType: 'Food Packaging',
      q: 'bottle',
      images: [I.bottleCarrier, I.customBoxSmall, I.cupCarrier],
      href: packagingHref({ category: 'Bottle Carriers' }),
   },
   {
      id: 'cat-neon-signs',
      title: 'Neon Signs',
      description: 'Custom neon & LED neon-style signs for shops and events',
      productType: 'LED & Neon Signs',
      q: 'neon',
      images: [I.neonSign, I.neonShop, I.ledSign],
      href: packagingHref({ category: 'Neon Signs' }),
   },
   {
      id: 'cat-led-signs',
      title: 'LED Signs',
      description: 'Bright LED channel letters and storefront LED boards',
      productType: 'LED & Neon Signs',
      q: 'led',
      images: [I.ledSign, I.neonSign, I.neonShop],
      href: packagingHref({ category: 'LED Signs' }),
   },
   {
      id: 'cat-lightbox-signs',
      title: 'Light Box Signs',
      description: 'Backlit light boxes and open / closed neon boards',
      productType: 'LED & Neon Signs',
      q: 'lightbox',
      images: [I.neonShop, I.ledSign, I.neonSign],
      href: packagingHref({ category: 'Light Box Signs' }),
   },
]

export const PACKAGING_PRODUCT_TYPE_LIST = [
   'Food Packaging',
   'Shipping Packaging',
   'Retail Packaging',
   'Packaging Accessories',
   'LED & Neon Signs',
] as const

export function getPackagingCategoryByTitle(title: string) {
   return PACKAGING_CATEGORIES.find(
      (c) => c.title.toLowerCase() === title.trim().toLowerCase()
   )
}
