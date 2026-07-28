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
   tote: CATALOG_IMAGES.tote,
   bag: CATALOG_IMAGES.bag,
   sticker: CATALOG_IMAGES.sticker,
   backpack: CATALOG_IMAGES.backpack,
   kraft: 'https://images.pexels.com/photos/5624983/pexels-photo-5624983.jpeg?auto=compress&cs=tinysrgb&w=1200',
   boxes: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1200&auto=format&fit=crop',
   stack: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?q=80&w=1200&auto=format&fit=crop',
   cups: 'https://images.pexels.com/photos/4553125/pexels-photo-4553125.jpeg?auto=compress&cs=tinysrgb&w=1200',
   foodpack: 'https://images.pexels.com/photos/6941019/pexels-photo-6941019.jpeg?auto=compress&cs=tinysrgb&w=1200',
   takeoutFood: 'https://images.pexels.com/photos/4393668/pexels-photo-4393668.jpeg?auto=compress&cs=tinysrgb&w=1200',
   packaging: 'https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg?auto=compress&cs=tinysrgb&w=1200',
   kraftBag: 'https://images.pexels.com/photos/5625116/pexels-photo-5625116.jpeg?auto=compress&cs=tinysrgb&w=1200',
   retailBag: 'https://images.pexels.com/photos/5625121/pexels-photo-5625121.jpeg?auto=compress&cs=tinysrgb&w=1200',
   tissue: 'https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?auto=compress&cs=tinysrgb&w=1200',
}

/** Vistaprint-style packaging leaf categories — every entry is clickable */
export const PACKAGING_CATEGORIES: PackagingCategory[] = [
   {
      id: 'cat-pizza-boxes',
      title: 'Pizza Boxes',
      description: 'Custom printed corrugated pizza boxes',
      productType: 'Food Packaging',
      q: 'pizza',
      images: [img.pizza, img.hero, img.foodpack],
      href: packagingHref({ productType: 'Food Packaging', q: 'pizza' }),
   },
   {
      id: 'cat-burger-boxes',
      title: 'Burger Boxes',
      description: 'Clamshell burger & sandwich boxes',
      productType: 'Food Packaging',
      q: 'burger',
      images: [img.burger, img.pizza, img.foodpack],
      href: packagingHref({ productType: 'Food Packaging', q: 'burger' }),
   },
   {
      id: 'cat-fries-cartons',
      title: 'Fries Cartons',
      description: 'Open-top fries & sides cartons',
      productType: 'Food Packaging',
      q: 'fries',
      images: [img.fries, img.burger, img.cups],
      href: packagingHref({ productType: 'Food Packaging', q: 'fries' }),
   },
   {
      id: 'cat-takeout-bags',
      title: 'To Go Bags',
      description: 'Grease-resistant takeout paper bags',
      productType: 'Food Packaging',
      q: 'takeout',
      images: [img.takeout, img.kraftBag, img.takeoutFood],
      href: packagingHref({ productType: 'Food Packaging', q: 'takeout' }),
   },
   {
      id: 'cat-paper-cups',
      title: 'Paper Cups',
      description: 'Branded hot & cold paper cups',
      productType: 'Food Packaging',
      q: 'cup',
      images: [img.cups, img.fries, img.takeoutFood],
      href: packagingHref({ productType: 'Food Packaging', q: 'cup' }),
   },
   {
      id: 'cat-meal-trays',
      title: 'Meal Trays',
      description: 'Compartment trays with lids',
      productType: 'Food Packaging',
      q: 'tray',
      images: [img.hero, img.foodpack, img.burger],
      href: packagingHref({ productType: 'Food Packaging', q: 'tray' }),
   },
   {
      id: 'cat-cup-carriers',
      title: 'Cup Carriers',
      description: '2-cup and 4-cup drink carriers',
      productType: 'Food Packaging',
      q: 'carrier',
      images: [img.cups, img.takeout, img.fries],
      href: packagingHref({ productType: 'Food Packaging', q: 'carrier' }),
   },
   {
      id: 'cat-mailer-boxes',
      title: 'Mailer Boxes',
      description: 'E-commerce mailer boxes with branding',
      productType: 'Shipping Packaging',
      q: 'mailer',
      images: [img.mailer, img.packaging, img.boxes],
      href: packagingHref({ productType: 'Shipping Packaging', q: 'mailer' }),
   },
   {
      id: 'cat-shipping-boxes',
      title: 'Shipping Boxes',
      description: 'Corrugated shipping cartons',
      productType: 'Shipping Packaging',
      q: 'shipping',
      images: [img.boxes, img.stack, img.mailer],
      href: packagingHref({ productType: 'Shipping Packaging', q: 'shipping' }),
   },
   {
      id: 'cat-poly-mailers',
      title: 'Shipping Mailers',
      description: 'Poly & kraft shipping mailers',
      productType: 'Shipping Packaging',
      q: 'poly',
      images: [img.kraft, img.packaging, img.stack],
      href: packagingHref({ productType: 'Shipping Packaging', q: 'poly' }),
   },
   {
      id: 'cat-shopping-bags',
      title: 'Shopping Bags',
      description: 'Custom retail shopping bags',
      productType: 'Retail Packaging',
      q: 'shopping',
      images: [img.tote, img.bag, img.retailBag],
      href: packagingHref({ productType: 'Retail Packaging', q: 'shopping' }),
   },
   {
      id: 'cat-product-packaging',
      title: 'Product Packaging',
      description: 'Product sleeves, cartons & wraps',
      productType: 'Retail Packaging',
      q: 'product',
      images: [img.packaging, img.boxes, img.stack],
      href: packagingHref({ productType: 'Retail Packaging', q: 'product' }),
   },
   {
      id: 'cat-hang-tags',
      title: 'Custom Tags',
      description: 'Hang tags for retail apparel & gifts',
      productType: 'Retail Packaging',
      q: 'tag',
      images: [img.sticker, img.tissue, img.kraft],
      href: packagingHref({ productType: 'Retail Packaging', q: 'tag' }),
   },
   {
      id: 'cat-stickers',
      title: 'Stickers & Labels',
      description: 'Branding stickers and packaging labels',
      productType: 'Packaging Accessories',
      q: 'sticker',
      images: [img.sticker, img.kraft, img.tissue],
      href: packagingHref({ productType: 'Packaging Accessories', q: 'sticker' }),
   },
   {
      id: 'cat-tissue',
      title: 'Tissue Paper',
      description: 'Custom printed tissue for unboxing',
      productType: 'Packaging Accessories',
      q: 'tissue',
      images: [img.tissue, img.kraftBag, img.retailBag],
      href: packagingHref({ productType: 'Packaging Accessories', q: 'tissue' }),
   },
   {
      id: 'cat-inserts',
      title: 'Packaging Inserts',
      description: 'Insert cards, thank-you notes & cards',
      productType: 'Packaging Accessories',
      q: 'insert',
      images: [img.sticker, img.packaging, img.tissue],
      href: packagingHref({ productType: 'Packaging Accessories', q: 'insert' }),
   },
   {
      id: 'cat-bakery-boxes',
      title: 'Bakery Boxes',
      description: 'Window bakery & pastry boxes',
      productType: 'Food Packaging',
      q: 'bakery',
      images: [img.foodpack, img.pizza, img.boxes],
      href: packagingHref({ productType: 'Food Packaging', q: 'bakery' }),
   },
   {
      id: 'cat-food-containers',
      title: 'Food Containers',
      description: 'Clamshells & hinged food containers',
      productType: 'Food Packaging',
      q: 'container',
      images: [img.burger, img.takeoutFood, img.foodpack],
      href: packagingHref({ productType: 'Food Packaging', q: 'container' }),
   },
   {
      id: 'cat-gift-boxes',
      title: 'Gift Boxes',
      description: 'Branded gift & presentation boxes',
      productType: 'Retail Packaging',
      q: 'gift',
      images: [img.boxes, img.packaging, img.tissue],
      href: packagingHref({ productType: 'Retail Packaging', q: 'gift' }),
   },
   {
      id: 'cat-rigid-boxes',
      title: 'Rigid Boxes',
      description: 'Premium rigid & magnetic closure boxes',
      productType: 'Retail Packaging',
      q: 'rigid',
      images: [img.packaging, img.boxes, img.stack],
      href: packagingHref({ productType: 'Retail Packaging', q: 'rigid' }),
   },
   {
      id: 'cat-wrapping-paper',
      title: 'Wrapping Paper',
      description: 'Custom printed wrapping paper rolls',
      productType: 'Packaging Accessories',
      q: 'wrap',
      images: [img.tissue, img.kraftBag, img.retailBag],
      href: packagingHref({ productType: 'Packaging Accessories', q: 'wrap' }),
   },
   {
      id: 'cat-bottle-carriers',
      title: 'Bottle Carriers',
      description: 'Cardboard bottle & jar carriers',
      productType: 'Food Packaging',
      q: 'bottle',
      images: [img.cups, img.fries, img.takeout],
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
