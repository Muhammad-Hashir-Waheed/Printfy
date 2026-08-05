import { PACKAGING_CATEGORIES } from '@/lib/packaging-categories'
import { buildCatalogHref } from '@/lib/catalog-navigation'
import { CATALOG_IMAGES } from '@/lib/catalog-images'

export type PackagingMenuLink = {
   label: string
   href: string
   /** Single primary image for the menu row */
   image: string
   description?: string
}

export type PackagingMenuColumn = {
   title: string
   href: string
   /** Short blurb under the column title */
   blurb: string
   accent: string
   links: PackagingMenuLink[]
}

export type PackagingFeaturedCard = {
   title: string
   href: string
   image: string
   badge?: string
   description: string
}

function linksForType(productType: string): PackagingMenuLink[] {
   return PACKAGING_CATEGORIES.filter((c) => c.productType === productType).map((c) => ({
      label: c.title,
      href: c.href,
      image: c.images[0],
      description: c.description,
   }))
}

function linkForCategory(title: string): PackagingMenuLink {
   const c = PACKAGING_CATEGORIES.find((x) => x.title === title)
   return {
      label: title,
      href: c?.href ?? buildCatalogHref({ category: title }),
      image: c?.images[0] ?? CATALOG_IMAGES.customPackagingHero,
      description: c?.description,
   }
}

/** Clear category columns — each option maps to its own product family */
export const PACKAGING_MENU_COLUMNS: PackagingMenuColumn[] = [
   {
      title: 'Food Packaging',
      href: buildCatalogHref({ productType: 'Food Packaging' }),
      blurb: 'Boxes, bags & trays for restaurants',
      accent: 'bg-orange-500',
      links: linksForType('Food Packaging'),
   },
   {
      title: 'Shipping',
      href: buildCatalogHref({ productType: 'Shipping Packaging' }),
      blurb: 'Mailers & cartons for e-commerce',
      accent: 'bg-sky-500',
      links: linksForType('Shipping Packaging'),
   },
   {
      title: 'Retail',
      href: buildCatalogHref({ productType: 'Retail Packaging' }),
      blurb: 'Bags, tags & gift packaging',
      accent: 'bg-violet-500',
      links: linksForType('Retail Packaging'),
   },
   {
      title: 'Accessories',
      href: buildCatalogHref({ productType: 'Packaging Accessories' }),
      blurb: 'Stickers, tissue & inserts',
      accent: 'bg-emerald-500',
      links: linksForType('Packaging Accessories'),
   },
   {
      title: 'LED & Neon',
      href: buildCatalogHref({ productType: 'LED & Neon Signs' }),
      blurb: 'Custom neon & LED storefront signs',
      accent: 'bg-fuchsia-500',
      links: linksForType('LED & Neon Signs'),
   },
]

export const PACKAGING_QUICK_PICKS: PackagingMenuLink[] = [
   linkForCategory('Pizza Boxes'),
   linkForCategory('Mailer Boxes'),
   linkForCategory('Shopping Bags'),
   linkForCategory('Neon Signs'),
]

/** Featured spotlight cards in the mega menu aside */
export const PACKAGING_FEATURED_CARDS: PackagingFeaturedCard[] = [
   {
      title: 'LED & Neon Signs',
      href: buildCatalogHref({ productType: 'LED & Neon Signs' }),
      image: CATALOG_IMAGES.neonSign,
      badge: 'New',
      description: 'Custom neon, LED letters & light boxes for your storefront.',
   },
   {
      title: 'Food Packaging',
      href: buildCatalogHref({ productType: 'Food Packaging' }),
      image: CATALOG_IMAGES.customPackagingHero,
      description: 'Pizza boxes, burger boxes, fries cartons & takeout bags.',
   },
]

export const PACKAGING_NAV_ITEMS: PackagingMenuLink[] = [
   {
      label: 'All Packaging',
      href: '/products',
      image: CATALOG_IMAGES.customPackagingHero,
   },
   {
      label: 'Food Packaging',
      href: buildCatalogHref({ productType: 'Food Packaging' }),
      image: CATALOG_IMAGES.customBoxLarge,
   },
   {
      label: 'Shipping',
      href: buildCatalogHref({ productType: 'Shipping Packaging' }),
      image: CATALOG_IMAGES.mailer,
   },
   {
      label: 'Retail',
      href: buildCatalogHref({ productType: 'Retail Packaging' }),
      image: CATALOG_IMAGES.shoppingBag,
   },
   {
      label: 'Accessories',
      href: buildCatalogHref({ productType: 'Packaging Accessories' }),
      image: CATALOG_IMAGES.sticker,
   },
   {
      label: 'LED & Neon',
      href: buildCatalogHref({ productType: 'LED & Neon Signs' }),
      image: CATALOG_IMAGES.neonSign,
   },
]
