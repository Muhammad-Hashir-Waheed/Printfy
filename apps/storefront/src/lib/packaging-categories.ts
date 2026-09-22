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

export const JOJI_PRODUCT_TYPES = [
   'Cosmetics',
   'Hotel & Food',
   'Perfume & Makeup Boxes',
   'Rigid Luxury Boxes',
   'Corrugated Boxes',
   'Branding & 3D Boards',
] as const

export type JojiProductType = (typeof JOJI_PRODUCT_TYPES)[number]

export type PackagingCategory = {
   id: string
   title: string
   description: string
   productType: JojiProductType
   q: string
   images: [string, string, string]
   href: string
}

export const PACKAGING_CATEGORIES: PackagingCategory[] = [
   {
      id: 'cat-cosmetic-cartons',
      title: 'Cosmetic Cartons',
      description: 'Folding cartons for creams, serums, and beauty sets',
      productType: 'Cosmetics',
      q: 'cosmetic',
      images: [I.productCarton, I.hangTags, I.rigidBox],
      href: packagingHref({ category: 'Cosmetic Cartons' }),
   },
   {
      id: 'cat-shopping-bags',
      title: 'Shopping Bags',
      description: 'Retail and salon shopping bags',
      productType: 'Cosmetics',
      q: 'shopping',
      images: [I.shoppingBag, I.retailBag, I.customPaperBag],
      href: packagingHref({ category: 'Shopping Bags' }),
   },
   {
      id: 'cat-hang-tags',
      title: 'Custom Tags',
      description: 'Hang tags for beauty and gift lines',
      productType: 'Cosmetics',
      q: 'tag',
      images: [I.hangTags, I.sticker, I.retailBag],
      href: packagingHref({ category: 'Custom Tags' }),
   },
   {
      id: 'cat-stickers',
      title: 'Stickers & Labels',
      description: 'Product labels, seals, and branding stickers',
      productType: 'Cosmetics',
      q: 'sticker',
      images: [I.sticker, I.hangTags, I.packagingInsert],
      href: packagingHref({ category: 'Stickers & Labels' }),
   },
   {
      id: 'cat-tissue',
      title: 'Tissue Paper',
      description: 'Printed tissue for unboxing',
      productType: 'Cosmetics',
      q: 'tissue',
      images: [I.tissuePaper, I.giftBoxesKraft, I.giftBox],
      href: packagingHref({ category: 'Tissue Paper' }),
   },
   {
      id: 'cat-inserts',
      title: 'Packaging Inserts',
      description: 'Care cards, thank-you notes, and promo inserts',
      productType: 'Cosmetics',
      q: 'insert',
      images: [I.packagingInsert, I.sticker, I.hangTags],
      href: packagingHref({ category: 'Packaging Inserts' }),
   },
   {
      id: 'cat-wrapping-paper',
      title: 'Wrapping Paper',
      description: 'Custom wrapping paper for beauty gifts',
      productType: 'Cosmetics',
      q: 'wrap',
      images: [I.wrappingPaper, I.tissuePaper, I.giftBox],
      href: packagingHref({ category: 'Wrapping Paper' }),
   },
   {
      id: 'cat-pizza-boxes',
      title: 'Pizza Boxes',
      description: 'Custom printed corrugated pizza boxes',
      productType: 'Hotel & Food',
      q: 'pizza',
      images: [I.customBoxLarge, I.customPackagingHero, I.bakeryBox],
      href: packagingHref({ category: 'Pizza Boxes' }),
   },
   {
      id: 'cat-burger-boxes',
      title: 'Burger Boxes',
      description: 'Clamshell burger and sandwich boxes',
      productType: 'Hotel & Food',
      q: 'burger',
      images: [I.customBoxMedium, I.foodContainer, I.customBoxSmall],
      href: packagingHref({ category: 'Burger Boxes' }),
   },
   {
      id: 'cat-fries-cartons',
      title: 'Fries Cartons',
      description: 'Open-top fries and sides cartons',
      productType: 'Hotel & Food',
      q: 'fries',
      images: [I.customBoxSmall, I.customBoxMedium, I.customPaperBag],
      href: packagingHref({ category: 'Fries Cartons' }),
   },
   {
      id: 'cat-takeout-bags',
      title: 'To Go Bags',
      description: 'Hotel and restaurant takeout bags',
      productType: 'Hotel & Food',
      q: 'takeout',
      images: [I.customPaperBag, I.shoppingBag, I.retailBag],
      href: packagingHref({ category: 'To Go Bags' }),
   },
   {
      id: 'cat-paper-cups',
      title: 'Paper Cups',
      description: 'Branded hot and cold paper cups',
      productType: 'Hotel & Food',
      q: 'cup',
      images: [I.paperCups, I.cupCarrier, I.customBoxSmall],
      href: packagingHref({ category: 'Paper Cups' }),
   },
   {
      id: 'cat-meal-trays',
      title: 'Meal Trays',
      description: 'Compartment trays with lids',
      productType: 'Hotel & Food',
      q: 'tray',
      images: [I.mealTray, I.foodContainer, I.customPackagingHero],
      href: packagingHref({ category: 'Meal Trays' }),
   },
   {
      id: 'cat-cup-carriers',
      title: 'Cup Carriers',
      description: '2-cup and 4-cup drink carriers',
      productType: 'Hotel & Food',
      q: 'carrier',
      images: [I.cupCarrier, I.paperCups, I.customPaperBag],
      href: packagingHref({ category: 'Cup Carriers' }),
   },
   {
      id: 'cat-bakery-boxes',
      title: 'Bakery Boxes',
      description: 'Window bakery and pastry boxes',
      productType: 'Hotel & Food',
      q: 'bakery',
      images: [I.bakeryBox, I.giftBoxesKraft, I.customBoxLarge],
      href: packagingHref({ category: 'Bakery Boxes' }),
   },
   {
      id: 'cat-food-containers',
      title: 'Food Containers',
      description: 'Clamshells and hinged food containers',
      productType: 'Hotel & Food',
      q: 'container',
      images: [I.foodContainer, I.mealTray, I.customBoxMedium],
      href: packagingHref({ category: 'Food Containers' }),
   },
   {
      id: 'cat-bottle-carriers',
      title: 'Bottle Carriers',
      description: 'Cardboard bottle and jar carriers',
      productType: 'Hotel & Food',
      q: 'bottle',
      images: [I.bottleCarrier, I.customBoxSmall, I.cupCarrier],
      href: packagingHref({ category: 'Bottle Carriers' }),
   },
   {
      id: 'cat-perfume-boxes',
      title: 'Perfume Boxes',
      description: 'Tall cartons and sleeves for fragrance bottles',
      productType: 'Perfume & Makeup Boxes',
      q: 'perfume',
      images: [I.productCarton, I.rigidBox, I.giftBox],
      href: packagingHref({ category: 'Perfume Boxes' }),
   },
   {
      id: 'cat-makeup-boxes',
      title: 'Makeup Boxes',
      description: 'Compact cartons for palettes, kits, and makeup sets',
      productType: 'Perfume & Makeup Boxes',
      q: 'makeup',
      images: [I.giftBox, I.productCarton, I.rigidBox],
      href: packagingHref({ category: 'Makeup Boxes' }),
   },
   {
      id: 'cat-gift-boxes',
      title: 'Gift Boxes',
      description: 'Branded gift and presentation boxes',
      productType: 'Rigid Luxury Boxes',
      q: 'gift',
      images: [I.giftBox, I.giftBoxesKraft, I.wrappingPaper],
      href: packagingHref({ category: 'Gift Boxes' }),
   },
   {
      id: 'cat-rigid-boxes',
      title: 'Rigid Boxes',
      description: 'Magnetic and drawer luxury rigid boxes',
      productType: 'Rigid Luxury Boxes',
      q: 'rigid',
      images: [I.rigidBox, I.productCarton, I.mailer],
      href: packagingHref({ category: 'Rigid Boxes' }),
   },
   {
      id: 'cat-mailer-boxes',
      title: 'Mailer Boxes',
      description: 'E-commerce mailer boxes with branding',
      productType: 'Corrugated Boxes',
      q: 'mailer',
      images: [I.mailer, I.shippingBoxes, I.shippingTapeBox],
      href: packagingHref({ category: 'Mailer Boxes' }),
   },
   {
      id: 'cat-shipping-boxes',
      title: 'Shipping Boxes',
      description: 'Corrugated shipping cartons',
      productType: 'Corrugated Boxes',
      q: 'shipping',
      images: [I.shippingBoxes, I.shippingTapeBox, I.mailer],
      href: packagingHref({ category: 'Shipping Boxes' }),
   },
   {
      id: 'cat-poly-mailers',
      title: 'Shipping Mailers',
      description: 'Poly and kraft shipping mailers',
      productType: 'Corrugated Boxes',
      q: 'poly',
      images: [I.polyMailer, I.mailer, I.shippingTapeBox],
      href: packagingHref({ category: 'Shipping Mailers' }),
   },
   {
      id: 'cat-neon-signs',
      title: 'Neon Signs',
      description: 'Custom neon signs for shops and events',
      productType: 'Branding & 3D Boards',
      q: 'neon',
      images: [I.neonSign, I.neonShop, I.ledSign],
      href: packagingHref({ category: 'Neon Signs' }),
   },
   {
      id: 'cat-led-signs',
      title: 'LED Signs',
      description: 'LED channel letters and storefront boards',
      productType: 'Branding & 3D Boards',
      q: 'led',
      images: [I.ledSign, I.neonSign, I.neonShop],
      href: packagingHref({ category: 'LED Signs' }),
   },
   {
      id: 'cat-lightbox-signs',
      title: 'Light Box Signs',
      description: 'Backlit light boxes and open / closed boards',
      productType: 'Branding & 3D Boards',
      q: 'lightbox',
      images: [I.neonShop, I.ledSign, I.neonSign],
      href: packagingHref({ category: 'Light Box Signs' }),
   },
   {
      id: 'cat-3d-boards',
      title: '3D Boards',
      description: 'Dimensional acrylic and 3D logo boards',
      productType: 'Branding & 3D Boards',
      q: '3d',
      images: [I.ledSign, I.neonBrandBrew, I.neonShop],
      href: packagingHref({ category: '3D Boards' }),
   },
]

export const PACKAGING_PRODUCT_TYPE_LIST = JOJI_PRODUCT_TYPES

export const TYPE_BY_CATEGORY: Record<string, JojiProductType> = Object.fromEntries(
   PACKAGING_CATEGORIES.map((category) => [category.title, category.productType])
) as Record<string, JojiProductType>

export function getPackagingCategoryByTitle(title: string) {
   return PACKAGING_CATEGORIES.find(
      (c) => c.title.toLowerCase() === title.trim().toLowerCase()
   )
}
