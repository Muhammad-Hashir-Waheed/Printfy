import { CATALOG_IMAGES } from '@/lib/catalog-images'
import { slugifyText } from '@/lib/slug'

type CatalogProduct = {
   id: string
   title: string
   description: string
   images: string[]
   keywords: string[]
   metadata: Record<string, unknown>
   price: number
   discount: number
   stock: number
   isPhysical: boolean
   isAvailable: boolean
   isFeatured: boolean
   brandId: string
   brand: unknown
   categories: unknown[]
   variants?: Array<{
      id: string
      name: string
      value: string
      priceModifier: number
      productId: string
   }>
   createdAt: Date
   updatedAt: Date
}

const brand = {
   id: 'brand-fannify',
   title: 'Fannify',
   description: 'House brand',
   logo: null,
} as any

function variants(
   productId: string,
   groups: Record<string, { values: string[]; modifiers?: number[] }>
) {
   const rows: NonNullable<CatalogProduct['variants']> = []
   for (const [name, config] of Object.entries(groups)) {
      config.values.forEach((value, index) => {
         rows.push({
            id: `${productId}-${name}-${value}`.toLowerCase().replace(/\s+/g, '-'),
            name,
            value,
            priceModifier: config.modifiers?.[index] ?? 0,
            productId,
         })
      })
   }
   return rows
}

function cat(title: string) {
   return {
      id: `cat-${slugifyText(title)}`,
      title,
      description: title,
   } as any
}

function product(input: {
   id: string
   title: string
   description: string
   images: string[]
   keywords: string[]
   productType: string
   categoryTitle: string
   price: number
   featured?: boolean
   sizeValues?: string[]
}): CatalogProduct {
   return {
      id: input.id,
      title: input.title,
      description: input.description,
      images: input.images,
      keywords: input.keywords,
      metadata: {
         productType: input.productType,
         packagingCategory: input.categoryTitle,
         isCustomizable: true,
         leadTimeDays: 4,
      },
      price: input.price,
      discount: 0,
      stock: 5000,
      isPhysical: true,
      isAvailable: true,
      isFeatured: input.featured ?? true,
      brandId: brand.id,
      brand,
      categories: [cat(input.categoryTitle)],
      variants: variants(input.id, {
         Size: {
            values: input.sizeValues ?? ['Small', 'Medium', 'Large'],
            modifiers: [0, 0.1, 0.2],
         },
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
   }
}

const I = CATALOG_IMAGES

/** 2–3 products per packaging category with related images */
export const PACKAGING_PRODUCTS: CatalogProduct[] = [
   // Pizza Boxes
   product({
      id: 'custom-pizza-box',
      title: 'Custom Pizza Box',
      description: 'Grease-resistant corrugated pizza boxes with full-color lid print.',
      images: [I.customBoxLarge, I.customPackagingHero, I.mailer],
      keywords: ['pizza', 'pizza box', 'food packaging'],
      productType: 'Food Packaging',
      categoryTitle: 'Pizza Boxes',
      price: 0.89,
      sizeValues: ['10"', '12"', '14"', '16"'],
   }),
   product({
      id: 'kraft-pizza-box',
      title: 'Kraft Pizza Box',
      description: 'Eco kraft pizza box with one-color logo print on the lid.',
      images: [I.customPackagingHero, I.customBoxLarge, I.customBoxMedium],
      keywords: ['pizza', 'kraft', 'pizza box'],
      productType: 'Food Packaging',
      categoryTitle: 'Pizza Boxes',
      price: 0.75,
   }),
   product({
      id: 'window-pizza-box',
      title: 'Window Pizza Box',
      description: 'White pizza box with clear window panel for display.',
      images: [I.customBoxLarge, I.mailer, I.customPackagingHero],
      keywords: ['pizza', 'window', 'display box'],
      productType: 'Food Packaging',
      categoryTitle: 'Pizza Boxes',
      price: 0.95,
   }),

   // Burger Boxes
   product({
      id: 'burger-box',
      title: 'Branded Burger Box',
      description: 'Fold-top burger clamshell with custom logo print.',
      images: [I.customBoxMedium, I.customBoxLarge, I.customBoxSmall],
      keywords: ['burger', 'clamshell', 'burger box'],
      productType: 'Food Packaging',
      categoryTitle: 'Burger Boxes',
      price: 0.42,
   }),
   product({
      id: 'sandwich-clamshell',
      title: 'Sandwich Clamshell',
      description: 'Paperboard clamshell for burgers, wraps, and sandwiches.',
      images: [I.customBoxMedium, I.customPackagingHero, I.customBoxSmall],
      keywords: ['burger', 'sandwich', 'clamshell'],
      productType: 'Food Packaging',
      categoryTitle: 'Burger Boxes',
      price: 0.38,
   }),
   product({
      id: 'large-burger-box',
      title: 'Large Combo Burger Box',
      description: 'Extra room burger box for double stacks and combo meals.',
      images: [I.customBoxMedium, I.customPaperBag, I.customBoxLarge],
      keywords: ['burger', 'combo', 'box'],
      productType: 'Food Packaging',
      categoryTitle: 'Burger Boxes',
      price: 0.55,
   }),

   // Fries Cartons
   product({
      id: 'fries-carton',
      title: 'Fries & Nugget Carton',
      description: 'Open-top carton for fries, nuggets, and sides.',
      images: [I.customBoxSmall, I.customBoxMedium, I.customBoxLarge],
      keywords: ['fries', 'nugget', 'carton'],
      productType: 'Food Packaging',
      categoryTitle: 'Fries Cartons',
      price: 0.28,
   }),
   product({
      id: 'sides-scoop',
      title: 'Sides Scoop Carton',
      description: 'Tall scoop carton for fries and onion rings.',
      images: [I.customBoxSmall, I.customPaperBag, I.customBoxMedium],
      keywords: ['fries', 'scoop', 'sides'],
      productType: 'Food Packaging',
      categoryTitle: 'Fries Cartons',
      price: 0.22,
   }),
   product({
      id: 'kids-fries-box',
      title: 'Kids Fries Box',
      description: 'Small branded fries carton for kids meals.',
      images: [I.customBoxSmall, I.customPackagingHero, I.customBoxSmall],
      keywords: ['fries', 'kids', 'carton'],
      productType: 'Food Packaging',
      categoryTitle: 'Fries Cartons',
      price: 0.18,
   }),

   // To Go Bags
   product({
      id: 'takeout-bag',
      title: 'Grease-Resistant Takeout Bag',
      description: 'Twisted-handle paper bag for burgers and combo orders.',
      images: [I.customPaperBag, I.mailer, I.tote],
      keywords: ['takeout', 'to go', 'paper bag'],
      productType: 'Food Packaging',
      categoryTitle: 'To Go Bags',
      price: 0.35,
   }),
   product({
      id: 'sos-bag',
      title: 'SOS Grocery Takeout Bag',
      description: 'Self-opening style paper bag for food delivery.',
      images: [I.customPaperBag, I.bag, I.backpack],
      keywords: ['takeout', 'sos', 'delivery bag'],
      productType: 'Food Packaging',
      categoryTitle: 'To Go Bags',
      price: 0.31,
   }),
   product({
      id: 'kraft-to-go-bag',
      title: 'Kraft To-Go Bag',
      description: 'Natural kraft takeout bag with one-color branding.',
      images: [I.customPaperBag, I.customPackagingHero, I.mailer],
      keywords: ['takeout', 'kraft', 'to go'],
      productType: 'Food Packaging',
      categoryTitle: 'To Go Bags',
      price: 0.29,
   }),

   // Paper Cups
   product({
      id: 'hot-paper-cup',
      title: 'Hot Paper Cup',
      description: 'Double-wall hot cup with full-wrap custom print.',
      images: [I.mug, I.coffee, I.customBoxSmall],
      keywords: ['cup', 'paper cup', 'hot drink'],
      productType: 'Food Packaging',
      categoryTitle: 'Paper Cups',
      price: 0.19,
      sizeValues: ['8oz', '12oz', '16oz'],
   }),
   product({
      id: 'cold-paper-cup',
      title: 'Cold Paper Cup',
      description: 'PE-lined cold cup for sodas and iced drinks.',
      images: [I.coffee, I.mug, I.customPaperBag],
      keywords: ['cup', 'cold cup', 'soda'],
      productType: 'Food Packaging',
      categoryTitle: 'Paper Cups',
      price: 0.17,
      sizeValues: ['12oz', '16oz', '20oz'],
   }),
   product({
      id: 'branded-sip-cup',
      title: 'Branded Sip Cup',
      description: 'Cafe-style paper cup with lid-ready rim.',
      images: [I.mug, I.customBoxSmall, I.coffee],
      keywords: ['cup', 'cafe', 'paper cup'],
      productType: 'Food Packaging',
      categoryTitle: 'Paper Cups',
      price: 0.21,
   }),

   // Meal Trays
   product({
      id: 'meal-tray-lid',
      title: 'Kraft Meal Tray with Lid',
      description: 'Compartment meal tray for bowls and combos.',
      images: [I.customPackagingHero, I.customBoxMedium, I.customPaperBag],
      keywords: ['tray', 'meal tray', 'combo'],
      productType: 'Food Packaging',
      categoryTitle: 'Meal Trays',
      price: 0.65,
   }),
   product({
      id: 'single-meal-tray',
      title: 'Single Compartment Tray',
      description: 'One-compartment kraft tray with clear lid option.',
      images: [I.customBoxMedium, I.customPackagingHero, I.mailer],
      keywords: ['tray', 'single', 'takeout'],
      productType: 'Food Packaging',
      categoryTitle: 'Meal Trays',
      price: 0.48,
   }),
   product({
      id: 'catering-tray',
      title: 'Catering Meal Tray',
      description: 'Large catering tray for family and party orders.',
      images: [I.customPackagingHero, I.mailer, I.customBoxLarge],
      keywords: ['tray', 'catering', 'family'],
      productType: 'Food Packaging',
      categoryTitle: 'Meal Trays',
      price: 1.15,
   }),

   // Cup Carriers
   product({
      id: 'cup-carrier',
      title: '4-Cup Drink Carrier',
      description: 'Sturdy drink carrier for delivery and pickup.',
      images: [I.customBoxSmall, I.customPaperBag, I.mug],
      keywords: ['carrier', 'cup carrier', 'drink'],
      productType: 'Food Packaging',
      categoryTitle: 'Cup Carriers',
      price: 0.52,
      sizeValues: ['2-cup', '4-cup'],
   }),
   product({
      id: '2-cup-carrier',
      title: '2-Cup Drink Carrier',
      description: 'Compact two-cup carrier with side branding panels.',
      images: [I.mug, I.customBoxSmall, I.customPaperBag],
      keywords: ['carrier', '2-cup', 'drink holder'],
      productType: 'Food Packaging',
      categoryTitle: 'Cup Carriers',
      price: 0.34,
   }),
   product({
      id: 'tray-cup-carrier',
      title: 'Tray-Style Cup Carrier',
      description: 'Flat tray carrier for counter and drive-thru.',
      images: [I.customBoxSmall, I.coffee, I.customBoxMedium],
      keywords: ['carrier', 'tray', 'cups'],
      productType: 'Food Packaging',
      categoryTitle: 'Cup Carriers',
      price: 0.44,
   }),

   // Mailer Boxes
   product({
      id: 'mailer-box',
      title: 'Branded Mailer Box',
      description: 'E-commerce mailer box with interior and exterior print.',
      images: [I.mailer, I.product, I.customPackagingHero],
      keywords: ['mailer', 'mailer box', 'shipping'],
      productType: 'Shipping Packaging',
      categoryTitle: 'Mailer Boxes',
      price: 1.25,
   }),
   product({
      id: 'rigid-mailer-box',
      title: 'Rigid Mailer Box',
      description: 'Premium rigid mailer for beauty and apparel brands.',
      images: [I.mailer, I.customBoxLarge, I.product],
      keywords: ['mailer', 'rigid', 'subscription box'],
      productType: 'Shipping Packaging',
      categoryTitle: 'Mailer Boxes',
      price: 2.1,
   }),
   product({
      id: 'lite-mailer-box',
      title: 'Lite Mailer Box',
      description: 'Lightweight mailer box for lightweight SKUs.',
      images: [I.mailer, I.customBoxMedium, I.customPaperBag],
      keywords: ['mailer', 'lite', 'ecommerce'],
      productType: 'Shipping Packaging',
      categoryTitle: 'Mailer Boxes',
      price: 0.95,
   }),

   // Shipping Boxes
   product({
      id: 'shipping-carton',
      title: 'Corrugated Shipping Box',
      description: 'Strong shipping carton with optional outer branding.',
      images: [I.mailer, I.product, I.backpack],
      keywords: ['shipping', 'carton', 'box'],
      productType: 'Shipping Packaging',
      categoryTitle: 'Shipping Boxes',
      price: 1.45,
   }),
   product({
      id: 'heavy-duty-ship-box',
      title: 'Heavy-Duty Shipping Box',
      description: 'Double-wall shipping box for fragile goods.',
      images: [I.product, I.mailer, I.customPackagingHero],
      keywords: ['shipping', 'heavy duty', 'corrugated'],
      productType: 'Shipping Packaging',
      categoryTitle: 'Shipping Boxes',
      price: 2.35,
   }),
   product({
      id: 'cube-ship-box',
      title: 'Cube Shipping Box',
      description: 'Square cube carton ideal for subscription kits.',
      images: [I.mailer, I.customBoxLarge, I.product],
      keywords: ['shipping', 'cube', 'subscription'],
      productType: 'Shipping Packaging',
      categoryTitle: 'Shipping Boxes',
      price: 1.65,
   }),

   // Shipping Mailers
   product({
      id: 'poly-mailer',
      title: 'Custom Poly Mailer',
      description: 'Waterproof poly mailer with full-color face print.',
      images: [I.backpack, I.bag, I.mailer],
      keywords: ['poly', 'mailer', 'shipping mailer'],
      productType: 'Shipping Packaging',
      categoryTitle: 'Shipping Mailers',
      price: 0.28,
   }),
   product({
      id: 'kraft-mailer',
      title: 'Kraft Paper Mailer',
      description: 'Eco kraft mailer envelope for soft goods.',
      images: [I.customPaperBag, I.mailer, I.tote],
      keywords: ['poly', 'kraft mailer', 'envelope'],
      productType: 'Shipping Packaging',
      categoryTitle: 'Shipping Mailers',
      price: 0.32,
   }),
   product({
      id: 'bubble-mailer',
      title: 'Branded Bubble Mailer',
      description: 'Padded bubble mailer with exterior branding strip.',
      images: [I.bag, I.backpack, I.mailer],
      keywords: ['poly', 'bubble', 'padded mailer'],
      productType: 'Shipping Packaging',
      categoryTitle: 'Shipping Mailers',
      price: 0.48,
   }),

   // Shopping Bags
   product({
      id: 'canvas-tote',
      title: 'Canvas Shopping Tote',
      description: 'Reusable tote bag with custom front print.',
      images: [I.tote, I.bag, I.backpack],
      keywords: ['shopping', 'tote', 'bag'],
      productType: 'Retail Packaging',
      categoryTitle: 'Shopping Bags',
      price: 4.5,
   }),
   product({
      id: 'paper-shopping-bag',
      title: 'Paper Shopping Bag',
      description: 'Retail paper shopping bag with twisted handles.',
      images: [I.bag, I.customPaperBag, I.tote],
      keywords: ['shopping', 'paper bag', 'retail'],
      productType: 'Retail Packaging',
      categoryTitle: 'Shopping Bags',
      price: 0.55,
   }),
   product({
      id: 'luxury-shopper',
      title: 'Luxury Shopper Bag',
      description: 'Thick paper shopper with ribbon handles.',
      images: [I.tote, I.customPaperBag, I.bag],
      keywords: ['shopping', 'luxury', 'shopper'],
      productType: 'Retail Packaging',
      categoryTitle: 'Shopping Bags',
      price: 1.2,
   }),

   // Product Packaging
   product({
      id: 'product-sleeve',
      title: 'Product Sleeve Carton',
      description: 'Slip sleeve packaging for bottles and jars.',
      images: [I.mailer, I.product, I.customBoxMedium],
      keywords: ['product', 'sleeve', 'carton'],
      productType: 'Retail Packaging',
      categoryTitle: 'Product Packaging',
      price: 0.72,
   }),
   product({
      id: 'folding-carton',
      title: 'Folding Product Carton',
      description: 'Retail folding carton with tuck top.',
      images: [I.product, I.mailer, I.customBoxLarge],
      keywords: ['product', 'folding carton', 'retail box'],
      productType: 'Retail Packaging',
      categoryTitle: 'Product Packaging',
      price: 0.88,
   }),
   product({
      id: 'window-product-box',
      title: 'Window Product Box',
      description: 'Display carton with clear product window.',
      images: [I.customBoxLarge, I.product, I.mailer],
      keywords: ['product', 'window box', 'display'],
      productType: 'Retail Packaging',
      categoryTitle: 'Product Packaging',
      price: 1.05,
   }),

   // Custom Tags
   product({
      id: 'hang-tag-set',
      title: 'Custom Hang Tags',
      description: 'Die-cut hang tags for retail apparel and gifts.',
      images: [I.sticker, I.product, I.phone],
      keywords: ['tag', 'hang tag', 'retail tag'],
      productType: 'Retail Packaging',
      categoryTitle: 'Custom Tags',
      price: 0.12,
   }),
   product({
      id: 'kraft-hang-tag',
      title: 'Kraft Hang Tag',
      description: 'Eco kraft hang tag with one-color stamp print.',
      images: [I.sticker, I.customPaperBag, I.mailer],
      keywords: ['tag', 'kraft', 'hang tag'],
      productType: 'Retail Packaging',
      categoryTitle: 'Custom Tags',
      price: 0.09,
   }),
   product({
      id: 'fold-over-tag',
      title: 'Fold-Over Product Tag',
      description: 'Fold-over tag for jewelry and small goods.',
      images: [I.phone, I.sticker, I.product],
      keywords: ['tag', 'fold over', 'jewelry tag'],
      productType: 'Retail Packaging',
      categoryTitle: 'Custom Tags',
      price: 0.15,
   }),

   // Stickers & Labels
   product({
      id: 'sticker-pack',
      title: 'Custom Sticker Pack',
      description: 'Waterproof vinyl stickers for branding and seals.',
      images: [I.sticker, I.phone, I.product],
      keywords: ['sticker', 'label', 'seal'],
      productType: 'Packaging Accessories',
      categoryTitle: 'Stickers & Labels',
      price: 4.99,
   }),
   product({
      id: 'shipping-labels',
      title: 'Custom Shipping Labels',
      description: 'Roll labels for cartons and mailers.',
      images: [I.sticker, I.mailer, I.product],
      keywords: ['sticker', 'shipping label', 'roll label'],
      productType: 'Packaging Accessories',
      categoryTitle: 'Stickers & Labels',
      price: 0.08,
   }),
   product({
      id: 'closure-seal',
      title: 'Package Closure Seal',
      description: 'Round closure seals for mailer boxes and bags.',
      images: [I.sticker, I.customPaperBag, I.phone],
      keywords: ['sticker', 'seal', 'closure'],
      productType: 'Packaging Accessories',
      categoryTitle: 'Stickers & Labels',
      price: 0.06,
   }),

   // Tissue Paper
   product({
      id: 'printed-tissue',
      title: 'Custom Tissue Paper',
      description: 'Branded tissue sheets for unboxing moments.',
      images: [I.tote, I.bag, I.customPaperBag],
      keywords: ['tissue', 'tissue paper', 'unboxing'],
      productType: 'Packaging Accessories',
      categoryTitle: 'Tissue Paper',
      price: 0.11,
   }),
   product({
      id: 'logo-tissue-pack',
      title: 'Logo Tissue Pack',
      description: 'Bulk logo tissue for retail wrapping.',
      images: [I.bag, I.tote, I.mailer],
      keywords: ['tissue', 'logo', 'wrapping'],
      productType: 'Packaging Accessories',
      categoryTitle: 'Tissue Paper',
      price: 0.09,
   }),
   product({
      id: 'pattern-tissue',
      title: 'Pattern Tissue Paper',
      description: 'Full-bleed pattern tissue for gift packaging.',
      images: [I.customPaperBag, I.tote, I.bag],
      keywords: ['tissue', 'pattern', 'gift wrap'],
      productType: 'Packaging Accessories',
      categoryTitle: 'Tissue Paper',
      price: 0.13,
   }),

   // Packaging Inserts
   product({
      id: 'thank-you-insert',
      title: 'Thank-You Insert Card',
      description: 'Branded insert card for mailer boxes.',
      images: [I.sticker, I.mailer, I.product],
      keywords: ['insert', 'thank you', 'card'],
      productType: 'Packaging Accessories',
      categoryTitle: 'Packaging Inserts',
      price: 0.14,
   }),
   product({
      id: 'product-care-card',
      title: 'Product Care Insert',
      description: 'Care instructions insert for apparel and goods.',
      images: [I.phone, I.sticker, I.mailer],
      keywords: ['insert', 'care card', 'instructions'],
      productType: 'Packaging Accessories',
      categoryTitle: 'Packaging Inserts',
      price: 0.12,
   }),
   product({
      id: 'promo-insert-card',
      title: 'Promo Insert Card',
      description: 'Discount / QR promo card for packages.',
      images: [I.product, I.sticker, I.phone],
      keywords: ['insert', 'promo', 'qr card'],
      productType: 'Packaging Accessories',
      categoryTitle: 'Packaging Inserts',
      price: 0.1,
   }),

   // Bakery Boxes
   product({
      id: 'window-bakery-box',
      title: 'Window Bakery Box',
      description: 'Clear-window pastry boxes for cakes and cookies.',
      images: [I.customBoxLarge, I.customPackagingHero, I.mailer],
      keywords: ['bakery', 'pastry', 'window box'],
      productType: 'Food Packaging',
      categoryTitle: 'Bakery Boxes',
      price: 0.72,
   }),
   product({
      id: 'kraft-bakery-box',
      title: 'Kraft Bakery Box',
      description: 'Eco kraft bakery boxes with one-color logo.',
      images: [I.customPackagingHero, I.customBoxMedium, I.customPaperBag],
      keywords: ['bakery', 'kraft', 'pastry'],
      productType: 'Food Packaging',
      categoryTitle: 'Bakery Boxes',
      price: 0.65,
   }),
   product({
      id: 'donut-bakery-box',
      title: 'Donut Bakery Box',
      description: 'Flat bakery boxes sized for donuts and sweets.',
      images: [I.customBoxMedium, I.customBoxLarge, I.mailer],
      keywords: ['bakery', 'donut', 'sweets'],
      productType: 'Food Packaging',
      categoryTitle: 'Bakery Boxes',
      price: 0.58,
   }),

   // Food Containers
   product({
      id: 'hinged-food-container',
      title: 'Hinged Food Container',
      description: 'Leak-resistant hinged clamshell containers.',
      images: [I.customBoxMedium, I.customPackagingHero, I.customBoxSmall],
      keywords: ['container', 'clamshell', 'food'],
      productType: 'Food Packaging',
      categoryTitle: 'Food Containers',
      price: 0.55,
   }),
   product({
      id: 'compartmented-container',
      title: 'Compartmented Container',
      description: 'Multi-compartment containers for combo meals.',
      images: [I.customPackagingHero, I.customBoxMedium, I.customPaperBag],
      keywords: ['container', 'compartment', 'meal'],
      productType: 'Food Packaging',
      categoryTitle: 'Food Containers',
      price: 0.68,
   }),
   product({
      id: 'salad-food-container',
      title: 'Salad Food Container',
      description: 'Clear-lid salad and bowl-style containers.',
      images: [I.customBoxSmall, I.customBoxMedium, I.customPackagingHero],
      keywords: ['container', 'salad', 'bowl'],
      productType: 'Food Packaging',
      categoryTitle: 'Food Containers',
      price: 0.62,
   }),

   // Gift Boxes
   product({
      id: 'branded-gift-box',
      title: 'Branded Gift Box',
      description: 'Presentation gift boxes with full-color branding.',
      images: [I.mailer, I.product, I.customPackagingHero],
      keywords: ['gift', 'presentation', 'box'],
      productType: 'Retail Packaging',
      categoryTitle: 'Gift Boxes',
      price: 1.45,
   }),
   product({
      id: 'kraft-gift-box',
      title: 'Kraft Gift Box',
      description: 'Natural kraft gift boxes for boutique brands.',
      images: [I.customPaperBag, I.mailer, I.tote],
      keywords: ['gift', 'kraft', 'boutique'],
      productType: 'Retail Packaging',
      categoryTitle: 'Gift Boxes',
      price: 1.2,
   }),
   product({
      id: 'magnetic-gift-box',
      title: 'Magnetic Gift Box',
      description: 'Luxury magnetic-lid gift boxes.',
      images: [I.product, I.mailer, I.customBoxLarge],
      keywords: ['gift', 'magnetic', 'luxury'],
      productType: 'Retail Packaging',
      categoryTitle: 'Gift Boxes',
      price: 2.1,
   }),

   // Rigid Boxes
   product({
      id: 'premium-rigid-box',
      title: 'Premium Rigid Box',
      description: 'Heavyweight rigid boxes for premium products.',
      images: [I.mailer, I.product, I.customBoxLarge],
      keywords: ['rigid', 'premium', 'box'],
      productType: 'Retail Packaging',
      categoryTitle: 'Rigid Boxes',
      price: 2.4,
   }),
   product({
      id: 'drawer-rigid-box',
      title: 'Drawer Rigid Box',
      description: 'Slide-drawer rigid packaging for unboxing.',
      images: [I.product, I.mailer, I.customPackagingHero],
      keywords: ['rigid', 'drawer', 'unboxing'],
      productType: 'Retail Packaging',
      categoryTitle: 'Rigid Boxes',
      price: 2.75,
   }),
   product({
      id: 'sleeve-rigid-box',
      title: 'Sleeve Rigid Box',
      description: 'Rigid base with removable branded sleeve.',
      images: [I.customBoxLarge, I.product, I.mailer],
      keywords: ['rigid', 'sleeve', 'box'],
      productType: 'Retail Packaging',
      categoryTitle: 'Rigid Boxes',
      price: 2.55,
   }),

   // Wrapping Paper
   product({
      id: 'custom-wrapping-paper',
      title: 'Custom Wrapping Paper',
      description: 'Full-bleed printed wrapping paper rolls.',
      images: [I.customPaperBag, I.tote, I.bag],
      keywords: ['wrap', 'wrapping', 'paper'],
      productType: 'Packaging Accessories',
      categoryTitle: 'Wrapping Paper',
      price: 0.35,
   }),
   product({
      id: 'kraft-wrapping-paper',
      title: 'Kraft Wrapping Paper',
      description: 'Eco kraft wrap with logo repeat print.',
      images: [I.bag, I.customPaperBag, I.tote],
      keywords: ['wrap', 'kraft', 'eco'],
      productType: 'Packaging Accessories',
      categoryTitle: 'Wrapping Paper',
      price: 0.28,
   }),
   product({
      id: 'pattern-wrapping-paper',
      title: 'Pattern Wrapping Paper',
      description: 'Seasonal and branded pattern wraps.',
      images: [I.tote, I.bag, I.mailer],
      keywords: ['wrap', 'pattern', 'seasonal'],
      productType: 'Packaging Accessories',
      categoryTitle: 'Wrapping Paper',
      price: 0.32,
   }),

   // Bottle Carriers
   product({
      id: '4-bottle-carrier',
      title: '4-Bottle Carrier',
      description: 'Cardboard carriers for bottles and jars.',
      images: [I.customBoxSmall, I.mug, I.customPaperBag],
      keywords: ['bottle', 'carrier', 'jar'],
      productType: 'Food Packaging',
      categoryTitle: 'Bottle Carriers',
      price: 0.85,
      sizeValues: ['2-pack', '4-pack', '6-pack'],
   }),
   product({
      id: 'wine-bottle-carrier',
      title: 'Wine Bottle Carrier',
      description: 'Tall bottle carriers for wine and spirits.',
      images: [I.mug, I.customBoxMedium, I.customBoxSmall],
      keywords: ['bottle', 'wine', 'carrier'],
      productType: 'Food Packaging',
      categoryTitle: 'Bottle Carriers',
      price: 0.95,
   }),
   product({
      id: 'kraft-bottle-carrier',
      title: 'Kraft Bottle Carrier',
      description: 'Natural kraft bottle carriers with handle.',
      images: [I.customPaperBag, I.customBoxSmall, I.mug],
      keywords: ['bottle', 'kraft', 'carrier'],
      productType: 'Food Packaging',
      categoryTitle: 'Bottle Carriers',
      price: 0.78,
   }),
]
