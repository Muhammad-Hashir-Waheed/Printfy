import { DEPARTMENT_SEEDS, type PresetKind, type ProductSeed } from './data'
import { resolveImage, type CatalogImage } from './images'
import { PRESETS, type Preset } from './presets'

export type { CatalogImage } from './images'
export type { OptionChoice, OptionGroup, Preset, QuantityTier } from './presets'

export type Product = {
   key: string
   slug: string
   name: string
   summary: string
   href: string
   departmentSlug: string
   departmentName: string
   categorySlug: string
   categoryName: string
   accent: string
   dark: boolean
   image: CatalogImage | null
   /** Starting unit price (at the default options and the first tier) */
   basePrice: number
   /** Quote-only product (no online checkout) */
   quote: boolean
   kind: PresetKind
   preset: Preset
}

export type Category = {
   key: string
   slug: string
   name: string
   blurb: string
   href: string
   departmentSlug: string
   departmentName: string
   accent: string
   dark: boolean
   image: CatalogImage | null
   products: Product[]
   /** The category whose products this one shows (Marketing → Flyers → Printing → Flyers) */
   canonical?: { departmentSlug: string; categorySlug: string; href: string }
   /** Links straight to a page (e.g. Request a Quote) */
   external?: boolean
   fromPrice: number | null
}

export type Department = {
   key: string
   slug: string
   name: string
   short: string
   tagline: string
   description: string
   accent: string
   dark: boolean
   href: string
   image: CatalogImage | null
   categories: Category[]
   productCount: number
}

export function slugify(value: string) {
   return value
      .trim()
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
}

/* ─────────────────────────── Build ─────────────────────────── */

function buildProduct(
   seed: ProductSeed,
   dept: (typeof DEPARTMENT_SEEDS)[number],
   cat: (typeof DEPARTMENT_SEEDS)[number]['categories'][number]
): Product {
   const [name, summary, price] = seed
   const slug = slugify(name)
   const key = `${dept.slug}/${cat.slug}/${slug}`
   const quote = typeof price === 'object' && price !== null
   const basePrice = quote ? (price as { quote: number }).quote : (price as number | undefined) ?? 1

   return {
      key,
      slug,
      name,
      summary,
      href: `/shop/${key}`,
      departmentSlug: dept.slug,
      departmentName: dept.name,
      categorySlug: cat.slug,
      categoryName: cat.name,
      accent: dept.accent,
      dark: Boolean(dept.dark),
      image: resolveImage(`p:${key}`, name),
      basePrice,
      quote: quote || cat.kind === 'digital' || cat.kind === 'led',
      kind: cat.kind,
      preset: PRESETS[cat.kind],
   }
}

function build() {
   const departments: Department[] = DEPARTMENT_SEEDS.map((dept) => {
      const categories: Category[] = dept.categories.map((cat) => {
         const key = `${dept.slug}/${cat.slug}`
         const products = cat.products.map((seed) => buildProduct(seed, dept, cat))
         return {
            key,
            slug: cat.slug,
            name: cat.name,
            blurb: cat.blurb,
            href: cat.href ?? `/shop/${key}`,
            departmentSlug: dept.slug,
            departmentName: dept.name,
            accent: dept.accent,
            dark: Boolean(dept.dark),
            image: resolveImage(`c:${key}`, cat.name),
            products,
            external: Boolean(cat.href),
            fromPrice: null,
         }
      })

      return {
         key: dept.slug,
         slug: dept.slug,
         name: dept.name,
         short: dept.short,
         tagline: dept.tagline,
         description: dept.description,
         accent: dept.accent,
         dark: Boolean(dept.dark),
         href: `/shop/${dept.slug}`,
         image: resolveImage(`d:${dept.slug}`, dept.name),
         categories,
         productCount: 0,
      }
   })

   // Resolve aliases (a category that re-uses another category's products)
   const byKey = new Map<string, Category>()
   departments.forEach((d) => d.categories.forEach((c) => byKey.set(c.key, c)))

   DEPARTMENT_SEEDS.forEach((deptSeed, di) => {
      deptSeed.categories.forEach((catSeed, ci) => {
         if (!catSeed.aliasOf) return
         const target = byKey.get(catSeed.aliasOf)
         if (!target) throw new Error(`Unknown aliasOf "${catSeed.aliasOf}"`)
         const category = departments[di].categories[ci]
         category.products = target.products
         category.canonical = {
            departmentSlug: target.departmentSlug,
            categorySlug: target.slug,
            href: target.href,
         }
         if (!category.image) category.image = target.image
      })
   })

   departments.forEach((d) => {
      d.categories.forEach((c) => {
         const prices = c.products.filter((p) => !p.quote).map((p) => startingUnitPrice(p))
         c.fromPrice = prices.length ? Math.min(...prices) : null
      })
      const own = new Set<string>()
      d.categories.forEach((c) => c.products.forEach((p) => own.add(p.key)))
      d.productCount = own.size
   })

   const products: Product[] = []
   departments.forEach((d) =>
      d.categories.forEach((c) => {
         if (!c.canonical) products.push(...c.products)
      })
   )

   return { departments, products, categories: Array.from(byKey.values()) }
}

/* ─────────────────────────── Pricing ─────────────────────────── */

export type Selections = Record<string, string>

export function defaultSelections(product: Product): Selections {
   const selections: Selections = {}
   for (const group of product.preset.options) {
      selections[group.id] = group.choices[0].label
   }
   return selections
}

/** Keeps only valid labels; unknown or missing values fall back to the default. */
export function sanitizeSelections(product: Product, input?: Selections | null): Selections {
   const selections = defaultSelections(product)
   for (const group of product.preset.options) {
      const value = input?.[group.id]
      if (value && group.choices.some((c) => c.label === value)) {
         selections[group.id] = value
      }
   }
   return selections
}

export function quantityTiers(product: Product) {
   return product.preset.tiers
}

export function isValidQuantity(product: Product, qty: number) {
   return product.preset.tiers.some((tier) => tier.qty === qty)
}

function round(value: number, places = 2) {
   const factor = 10 ** places
   return Math.round(value * factor) / factor
}

export function priceFor(product: Product, selections: Selections, qty: number) {
   const tiers = product.preset.tiers
   const tier = [...tiers].reverse().find((t) => qty >= t.qty) ?? tiers[0]

   let multiplier = 1
   for (const group of product.preset.options) {
      const choice = group.choices.find((c) => c.label === selections[group.id])
      multiplier *= choice?.mult ?? 1
   }

   const listUnit = product.basePrice * multiplier
   const raw = listUnit * tier.factor
   // Fractions of a cent only matter for very cheap items (labels, cards)
   const unit = round(raw, raw < 0.1 ? 3 : 2)
   const total = round(unit * qty)
   const savings = Math.round((1 - tier.factor) * 100)

   return { unit, total, qty, savings, listUnit: round(listUnit, 3) }
}

export function startingUnitPrice(product: Product) {
   const tiers = product.preset.tiers
   return priceFor(product, defaultSelections(product), tiers[tiers.length - 1].qty).unit
}

/* ─────────────────────────── Lookups ─────────────────────────── */

const CATALOG = build()

export const DEPARTMENTS = CATALOG.departments
export const ALL_PRODUCTS = CATALOG.products

export function getDepartment(slug: string) {
   return DEPARTMENTS.find((d) => d.slug === slug)
}

export function getCategory(departmentSlug: string, categorySlug: string) {
   return getDepartment(departmentSlug)?.categories.find((c) => c.slug === categorySlug)
}

export function getProduct(departmentSlug: string, categorySlug: string, productSlug: string) {
   const category = getCategory(departmentSlug, categorySlug)
   if (!category || category.canonical) return undefined
   return category.products.find((p) => p.slug === productSlug)
}

export function getProductByKey(key: string) {
   return ALL_PRODUCTS.find((p) => p.key === key)
}

export function relatedProducts(product: Product, limit = 8) {
   const category = getCategory(product.departmentSlug, product.categorySlug)
   const siblings = (category?.products ?? []).filter((p) => p.key !== product.key)
   if (siblings.length >= limit) return siblings.slice(0, limit)
   const dept = getDepartment(product.departmentSlug)
   const more = (dept?.categories ?? [])
      .filter((c) => !c.canonical && c.slug !== product.categorySlug)
      .flatMap((c) => c.products)
   return [...siblings, ...more].slice(0, limit)
}

/** Hand-picked bestsellers for the home page */
export const POPULAR_KEYS = [
   'printing/business-cards/premium-matte-business-cards',
   'signage-displays/neon-signs/custom-neon-signs',
   'packaging/mailer-boxes/branded-mailer-box',
   'acrylic-plastic-packaging/acrylic-boxes/acrylic-gift-boxes',
   'food-packaging/food-boxes/custom-pizza-box',
   'labels-stickers/stickers/die-cut-stickers',
   'signage-displays/advertising-displays/roll-up-banners',
   'bags/paper-bags/luxury-shopper-bag',
   'packaging/rigid-boxes/magnetic-closure-box',
   'signage-displays/3d-raised-letter-signs/3d-acrylic-letters',
   'food-packaging/cups/double-wall-coffee-cup',
   'corporate/apparel/custom-t-shirts',
]

export function popularProducts() {
   return POPULAR_KEYS.map(getProductByKey).filter(Boolean) as Product[]
}

/* ─────────────────────────── Search ─────────────────────────── */

export function searchProducts(query: string, limit = 60) {
   const terms = query
      .toLowerCase()
      .replace(/&/g, ' and ')
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 1)
   if (!terms.length) return []

   const scored = ALL_PRODUCTS.map((product) => {
      const name = product.name.toLowerCase()
      const cat = product.categoryName.toLowerCase()
      const dept = product.departmentName.toLowerCase()
      const summary = product.summary.toLowerCase()
      let score = 0
      for (const term of terms) {
         const stem = term.replace(/s$/, '')
         if (name.includes(stem)) score += name.startsWith(stem) ? 6 : 4
         else if (cat.includes(stem)) score += 3
         else if (dept.includes(stem)) score += 2
         else if (summary.includes(stem)) score += 1
         else return { product, score: 0 }
      }
      return { product, score }
   })

   return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
      .slice(0, limit)
      .map((s) => s.product)
}

export function searchCategories(query: string, limit = 6) {
   const q = query.trim().toLowerCase()
   if (q.length < 2) return []
   return CATALOG.categories
      .filter((c) => !c.external && (c.name.toLowerCase().includes(q) || c.departmentName.toLowerCase().includes(q)))
      .slice(0, limit)
}

export const CATALOG_STATS = {
   departments: DEPARTMENTS.length,
   categories: CATALOG.categories.length,
   products: ALL_PRODUCTS.length,
}
