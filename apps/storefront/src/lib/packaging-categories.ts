import { CATALOG_IMAGES } from '@/lib/catalog-images'
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
   /** Exactly 3 related images for this category */
   images: [string, string, string]
   href: string
}

const img = {
   pizza: CATALOG_IMAGES.customBoxLarge,
   burger: CATALOG_IMAGES.customBoxMedium,
   fries: CATALOG_IMAGES.customBoxSmall,
   takeout: CATALOG_IMAGES.customPaperBag,
   hero: CATALOG_IMAGES.customPackagingHero,
   mailer: CATALOG_IMAGES.mailer,
   shipping: CATALOG_IMAGES.shippingBoxes,
   tote: CATALOG_IMAGES.shoppingBag,
   bag: CATALOG_IMAGES.retailBag,
   sticker: CATALOG_IMAGES.sticker,
   bakery: CATALOG_IMAGES.bakeryBox,
   gift: CATALOG_IMAGES.giftBox,
   giftKraft: CATALOG_IMAGES.giftBoxesKraft,
   rigid: CATALOG_IMAGES.rigidBox,
   foodContainer: CATALOG_IMAGES.foodContainer,
}

/** Vistaprint-style packaging leaf categories — every entry is clickable */
export const PACKAGING_CATEGORIES: PackagingCategory[] = [
   {
      id: 'cat-pizza-boxes',
      title: 'Pizza Boxes',
      description: 'Custom printed corrugated pizza boxes',
      productType: 'Food Packaging',
      q: 'pizza',
      images: [img.pizza, img.hero, img.burger],
      href: packagingHref({ productType: 'Food Packaging', q: 'pizza' }),
   },
   {
      id: 'cat-burger-boxes',
      title: 'Burger Boxes',
      description: 'Clamshell burger & sandwich boxes',
      productType: 'Food Packaging',
      q: 'burger',
      images: [img.burger, img.foodContainer, img.pizza],
      href: packagingHref({ productType: 'Food Packaging', q: 'burger' }),
   },
   {
      id: 'cat-fries-cartons',
      title: 'Fries Cartons',
      description: 'Open-top fries & sides cartons',
      productType: 'Food Packaging',
      q: 'fries',
      images: [img.fries, img.burger, img.takeout],
      href: packagingHref({ productType: 'Food Packaging', q: 'fries' }),
   },
   {
      id: 'cat-takeout-bags',
      title: 'To Go Bags',
      description: 'Grease-resistant takeout paper bags',
      productType: 'Food Packaging',
      q: 'takeout',
      images: [img.takeout, img.tote, img.bag],
      href: packagingHref({ productType: 'Food Packaging', q: 'takeout' }),
   },
   {
      id: 'cat-paper-cups',
      title: 'Paper Cups',
      description: 'Branded hot & cold paper cups',
      productType: 'Food Packaging',
      q: 'cup',
      images: [img.fries, img.takeout, img.foodContainer],
      href: packagingHref({ productType: 'Food Packaging', q: 'cup' }),
   },
   {
      id: 'cat-meal-trays',
      title: 'Meal Trays',
      description: 'Compartment trays with lids',
      productType: 'Food Packaging',
      q: 'tray',
      images: [img.foodContainer, img.hero, img.burger],
      href: packagingHref({ productType: 'Food Packaging', q: 'tray' }),
   },
   {
      id: 'cat-cup-carriers',
      title: 'Cup Carriers',
      description: '2-cup and 4-cup drink carriers',
      productType: 'Food Packaging',
      q: 'carrier',
      images: [img.fries, img.takeout, img.foodContainer],
      href: packagingHref({ productType: 'Food Packaging', q: 'carrier' }),
   },
   {
      id: 'cat-mailer-boxes',
      title: 'Mailer Boxes',
      description: 'E-commerce mailer boxes with branding',
      productType: 'Shipping Packaging',
      q: 'mailer',
      images: [img.mailer, img.shipping, img.rigid],
      href: packagingHref({ productType: 'Shipping Packaging', q: 'mailer' }),
   },
   {
      id: 'cat-shipping-boxes',
      title: 'Shipping Boxes',
      description: 'Corrugated shipping cartons',
      productType: 'Shipping Packaging',
      q: 'shipping',
      images: [img.shipping, img.mailer, img.rigid],
      href: packagingHref({ productType: 'Shipping Packaging', q: 'shipping' }),
   },
   {
      id: 'cat-poly-mailers',
      title: 'Shipping Mailers',
      description: 'Poly & kraft shipping mailers',
      productType: 'Shipping Packaging',
      q: 'poly',
      images: [img.mailer, img.shipping, img.tote],
      href: packagingHref({ productType: 'Shipping Packaging', q: 'poly' }),
   },
   {
      id: 'cat-shopping-bags',
      title: 'Shopping Bags',
      description: 'Custom retail shopping bags',
      productType: 'Retail Packaging',
      q: 'shopping',
      images: [img.tote, img.bag, img.takeout],
      href: packagingHref({ productType: 'Retail Packaging', q: 'shopping' }),
   },
   {
      id: 'cat-product-packaging',
      title: 'Product Packaging',
      description: 'Product sleeves, cartons & wraps',
      productType: 'Retail Packaging',
      q: 'product',
      images: [img.rigid, img.giftKraft, img.mailer],
      href: packagingHref({ productType: 'Retail Packaging', q: 'product' }),
   },
   {
      id: 'cat-hang-tags',
      title: 'Custom Tags',
      description: 'Hang tags for retail apparel & gifts',
      productType: 'Retail Packaging',
      q: 'tag',
      images: [img.sticker, img.gift, img.bag],
      href: packagingHref({ productType: 'Retail Packaging', q: 'tag' }),
   },
   {
      id: 'cat-stickers',
      title: 'Stickers & Labels',
      description: 'Branding stickers and packaging labels',
      productType: 'Packaging Accessories',
      q: 'sticker',
      images: [img.sticker, img.gift, img.bag],
      href: packagingHref({ productType: 'Packaging Accessories', q: 'sticker' }),
   },
   {
      id: 'cat-tissue',
      title: 'Tissue Paper',
      description: 'Custom printed tissue for unboxing',
      productType: 'Packaging Accessories',
      q: 'tissue',
      images: [img.giftKraft, img.gift, img.tote],
      href: packagingHref({ productType: 'Packaging Accessories', q: 'tissue' }),
   },
   {
      id: 'cat-inserts',
      title: 'Packaging Inserts',
      description: 'Insert cards, thank-you notes & cards',
      productType: 'Packaging Accessories',
      q: 'insert',
      images: [img.sticker, img.mailer, img.gift],
      href: packagingHref({ productType: 'Packaging Accessories', q: 'insert' }),
   },
   {
      id: 'cat-bakery-boxes',
      title: 'Bakery Boxes',
      description: 'Window bakery & pastry boxes',
      productType: 'Food Packaging',
      q: 'bakery',
      images: [img.bakery, img.giftKraft, img.pizza],
      href: packagingHref({ productType: 'Food Packaging', q: 'bakery' }),
   },
   {
      id: 'cat-food-containers',
      title: 'Food Containers',
      description: 'Clamshells & hinged food containers',
      productType: 'Food Packaging',
      q: 'container',
      images: [img.foodContainer, img.burger, img.takeout],
      href: packagingHref({ productType: 'Food Packaging', q: 'container' }),
   },
   {
      id: 'cat-gift-boxes',
      title: 'Gift Boxes',
      description: 'Branded gift & presentation boxes',
      productType: 'Retail Packaging',
      q: 'gift',
      images: [img.gift, img.giftKraft, img.rigid],
      href: packagingHref({ productType: 'Retail Packaging', q: 'gift' }),
   },
   {
      id: 'cat-rigid-boxes',
      title: 'Rigid Boxes',
      description: 'Premium rigid & magnetic closure boxes',
      productType: 'Retail Packaging',
      q: 'rigid',
      images: [img.rigid, img.gift, img.mailer],
      href: packagingHref({ productType: 'Retail Packaging', q: 'rigid' }),
   },
   {
      id: 'cat-wrapping-paper',
      title: 'Wrapping Paper',
      description: 'Custom printed wrapping paper rolls',
      productType: 'Packaging Accessories',
      q: 'wrap',
      images: [img.giftKraft, img.gift, img.sticker],
      href: packagingHref({ productType: 'Packaging Accessories', q: 'wrap' }),
   },
   {
      id: 'cat-bottle-carriers',
      title: 'Bottle Carriers',
      description: 'Cardboard bottle & jar carriers',
      productType: 'Food Packaging',
      q: 'bottle',
      images: [img.fries, img.takeout, img.foodContainer],
      href: packagingHref({ productType: 'Food Packaging', q: 'bottle' }),
   },
]

export const PACKAGING_PRODUCT_TYPE_LIST = [
   'Food Packaging',
   'Shipping Packaging',
   'Retail Packaging',
   'Packaging Accessories',
] as const

export function getPackagingCategoryByTitle(title: string) {
   return PACKAGING_CATEGORIES.find(
      (c) => c.title.toLowerCase() === title.trim().toLowerCase()
   )
}
