import { PACKAGING_CATEGORIES } from '@/lib/packaging-categories'
import { buildCatalogHref } from '@/lib/catalog-navigation'
import { CATALOG_IMAGES } from '@/lib/catalog-images'

export type PackagingMenuLink = {
   label: string
   href: string
   /** Up to 3 related category images */
   images?: string[]
   image?: string
}

export type PackagingMenuColumn = {
   title: string
   href: string
   links: PackagingMenuLink[]
}

export type PackagingFeaturedCard = {
   title: string
   href: string
   image: string
   images: string[]
   alt: string
}

function linksForType(productType: string) {
   return PACKAGING_CATEGORIES.filter((c) => c.productType === productType).map((c) => ({
      label: c.title,
      href: c.href,
      images: [...c.images],
      image: c.images[0],
   }))
}

function linkForCategory(title: string): PackagingMenuLink {
   const c = PACKAGING_CATEGORIES.find((x) => x.title === title)
   return {
      label: title,
      href: c?.href ?? buildCatalogHref({ category: title }),
      images: c ? [...c.images] : undefined,
      image: c?.images[0],
   }
}

/** Vistaprint-style packaging mega menu — every title & link is clickable */
export const PACKAGING_MENU_COLUMNS: PackagingMenuColumn[] = [
   {
      title: 'Food Packaging',
      href: buildCatalogHref({ productType: 'Food Packaging' }),
      links: linksForType('Food Packaging'),
   },
   {
      title: 'Shipping Packaging',
      href: buildCatalogHref({ productType: 'Shipping Packaging' }),
      links: linksForType('Shipping Packaging'),
   },
   {
      title: 'Retail Packaging',
      href: buildCatalogHref({ productType: 'Retail Packaging' }),
      links: linksForType('Retail Packaging'),
   },
   {
      title: 'Packaging Accessories',
      href: buildCatalogHref({ productType: 'Packaging Accessories' }),
      links: linksForType('Packaging Accessories'),
   },
]

export const PACKAGING_SIDE_COLUMNS: PackagingMenuColumn[] = [
   {
      title: 'Best sellers',
      href: buildCatalogHref({ productType: 'Food Packaging', q: 'pizza' }),
      links: [
         linkForCategory('Pizza Boxes'),
         linkForCategory('Mailer Boxes'),
         linkForCategory('Shopping Bags'),
         linkForCategory('Paper Cups'),
      ],
   },
   {
      title: 'New Arrivals',
      href: buildCatalogHref({ productType: 'Food Packaging' }),
      links: [
         linkForCategory('Bakery Boxes'),
         linkForCategory('Gift Boxes'),
         linkForCategory('Rigid Boxes'),
         linkForCategory('Bottle Carriers'),
      ],
   },
   {
      title: 'Shop By Industry',
      href: buildCatalogHref({ productType: 'Food Packaging' }),
      links: [
         {
            label: 'Food & Beverage',
            href: buildCatalogHref({ productType: 'Food Packaging' }),
            image: CATALOG_IMAGES.customPackagingHero,
            images: [
               CATALOG_IMAGES.customBoxLarge,
               CATALOG_IMAGES.customBoxMedium,
               CATALOG_IMAGES.customPaperBag,
            ],
         },
         {
            label: 'Retail & E-commerce',
            href: buildCatalogHref({ productType: 'Shipping Packaging' }),
            image: CATALOG_IMAGES.mailer,
            images: [CATALOG_IMAGES.mailer, CATALOG_IMAGES.tote, CATALOG_IMAGES.bag],
         },
         {
            label: 'Beauty & Gift',
            href: buildCatalogHref({ productType: 'Retail Packaging' }),
            image: CATALOG_IMAGES.product,
            images: [CATALOG_IMAGES.product, CATALOG_IMAGES.sticker, CATALOG_IMAGES.tote],
         },
      ],
   },
]

export const PACKAGING_NAV_ITEMS: PackagingMenuLink[] = [
   { label: 'All Packaging', href: '/products' },
   { label: 'Food Packaging', href: buildCatalogHref({ productType: 'Food Packaging' }) },
   { label: 'Shipping', href: buildCatalogHref({ productType: 'Shipping Packaging' }) },
   { label: 'Retail', href: buildCatalogHref({ productType: 'Retail Packaging' }) },
   { label: 'Accessories', href: buildCatalogHref({ productType: 'Packaging Accessories' }) },
   { label: 'Best Sellers', href: buildCatalogHref({ category: 'Pizza Boxes' }) },
]

/** Featured image cards — click opens that category gallery */
export const PACKAGING_FEATURED_CARDS: PackagingFeaturedCard[] =
   PACKAGING_CATEGORIES.slice(0, 8).map((category) => ({
      title: category.title,
      href: category.href,
      image: category.images[0],
      images: [...category.images],
      alt: category.description,
   }))
