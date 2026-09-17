import { PACKAGING_CATEGORIES, JOJI_PRODUCT_TYPES } from '@/lib/packaging-categories'
import { buildCatalogHref } from '@/lib/catalog-navigation'
import { CATALOG_IMAGES } from '@/lib/catalog-images'

export type PackagingMenuLink = {
   label: string
   href: string
   image: string
   description?: string
}

export type PackagingMenuColumn = {
   title: string
   href: string
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

const COLUMN_META: Record<
   (typeof JOJI_PRODUCT_TYPES)[number],
   { blurb: string; accent: string }
> = {
   Cosmetics: {
      blurb: 'Cartons, bags, tags & unboxing extras',
      accent: 'bg-rose-500',
   },
   'Hotel & Food': {
      blurb: 'Boxes, bags & trays for kitchens',
      accent: 'bg-orange-500',
   },
   'Perfume & Makeup Boxes': {
      blurb: 'Fragrance sleeves & makeup kits',
      accent: 'bg-fuchsia-500',
   },
   'Rigid Luxury Boxes': {
      blurb: 'Magnetic, drawer & gift boxes',
      accent: 'bg-amber-500',
   },
   'Corrugated Boxes': {
      blurb: 'Mailers, cartons & shipping',
      accent: 'bg-sky-500',
   },
   'Branding & 3D Boards': {
      blurb: 'Neon, LED & dimensional signs',
      accent: 'bg-violet-500',
   },
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

export const PACKAGING_MENU_COLUMNS: PackagingMenuColumn[] = JOJI_PRODUCT_TYPES.map((title) => ({
   title,
   href: buildCatalogHref({ productType: title }),
   blurb: COLUMN_META[title].blurb,
   accent: COLUMN_META[title].accent,
   links: linksForType(title),
}))

export const PACKAGING_QUICK_PICKS: PackagingMenuLink[] = [
   linkForCategory('Cosmetic Cartons'),
   linkForCategory('Pizza Boxes'),
   linkForCategory('Perfume Boxes'),
   linkForCategory('Rigid Boxes'),
   linkForCategory('Mailer Boxes'),
   linkForCategory('3D Boards'),
]

export const PACKAGING_FEATURED_CARDS: PackagingFeaturedCard[] = [
   {
      title: 'Perfume & Makeup Boxes',
      href: buildCatalogHref({ productType: 'Perfume & Makeup Boxes' }),
      image: CATALOG_IMAGES.rigidBox,
      badge: 'New',
      description: 'Luxury fragrance sleeves and magnetic makeup kits.',
   },
   {
      title: 'Branding & 3D Boards',
      href: buildCatalogHref({ productType: 'Branding & 3D Boards' }),
      image: CATALOG_IMAGES.neonSign,
      description: 'Neon, LED letters, light boxes, and 3D logo boards.',
   },
]

const NAV_SHORT_LABEL: Record<(typeof JOJI_PRODUCT_TYPES)[number], string> = {
   Cosmetics: 'Cosmetics',
   'Hotel & Food': 'Hotel & Food',
   'Perfume & Makeup Boxes': 'Perfume',
   'Rigid Luxury Boxes': 'Rigid Boxes',
   'Corrugated Boxes': 'Corrugated',
   'Branding & 3D Boards': 'Branding',
}

export const PACKAGING_NAV_ITEMS: Array<
   PackagingMenuLink & { columnTitle?: string }
> = JOJI_PRODUCT_TYPES.map((title) => {
   const column = PACKAGING_MENU_COLUMNS.find((c) => c.title === title)!
   const first = column.links[0]
   return {
      label: NAV_SHORT_LABEL[title],
      href: column.href,
      image: first?.image ?? CATALOG_IMAGES.customPackagingHero,
      columnTitle: title,
      description: column.blurb,
   }
})
