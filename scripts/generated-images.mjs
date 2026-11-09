/**
 * Turns the AI-generated product photos into catalog galleries.
 *
 * Source: assets/generated-images/<Department>/<Category>/<product-slug>/<any>.png|jpg
 * Output: public/catalog/generated/<department>/<category>/<product>/<n>.jpg
 *         src/catalog/generated-manifest.ts  (product galleries + category/department covers)
 *
 *   npm run images:generated
 *
 * Every image is normalised to a square JPEG (the shape most of the set was made in). Wide shots
 * are centred on a blurred extension of themselves, so card and gallery crops never cut the product.
 * Curation (lead image, hidden shots) lives in CURATION below.
 */
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(path.join(root, 'package.json'))
const sharp = require('sharp')

const SRC = path.join(root, 'assets/generated-images')
const OUT = path.join(root, 'public/catalog/generated')
const MANIFEST = path.join(root, 'src/catalog/generated-manifest.ts')
const MOCKUPS_DIR = path.join(root, 'public/catalog/mockups')
const MAX_SIDE = 1200
const MAX_VIEWS = 12

/** Folder names that differ from catalog slugs */
const ALIASES = {
   'food-packaging/food-boxes/fries-nugget-carton': 'food-packaging/food-boxes/fries-and-nugget-carton',
   'packaging/corrugated-boxes/moving-storage-box': 'packaging/corrugated-boxes/moving-and-storage-box',
   'packaging/corrugated-boxes/tray-lid-corrugated-box': 'packaging/corrugated-boxes/tray-and-lid-corrugated-box',
   'retail-packaging/product-boxes/vape-flavour-box': 'retail-packaging/product-boxes/vape-and-flavour-box',
   'corporate/corporate-gifts/awards-trophies': 'corporate/corporate-gifts/awards-and-trophies',
   'custom-packaging/custom-printing/prototype-sample-box': 'custom-packaging/custom-printing/prototype-and-sample-box',
   'display-racks/countertop-racks/brochure-card-holder': 'display-racks/countertop-racks/brochure-and-card-holder',
   'display-racks/floor-standing-racks/snack-beverage-rack': 'display-racks/floor-standing-racks/snack-and-beverage-rack',
   'signage-displays/3d-raised-letter-signs/gold-silver-letters': 'signage-displays/3d-raised-letter-signs/gold-and-silver-letters',
   'signage-displays/advertising-displays/step-repeat-walls': 'signage-displays/advertising-displays/step-and-repeat-walls',
}

/**
 * Curation lives in scripts/generated-images.curation.json:
 *   products["<catalog key without p:>"] — by file name without extension:
 *     lead — shown first (after variation-1, which always leads), in this order;
 *     last — moved to the end (collages, busy scenes, garbled lettering). Never applies to variation-1.
 *     Every generated photo is shown; curation only orders them.
 *   covers["c:<dept>/<category>" | "d:<dept>"] — [product key, image file name] used as that page's cover
 *     (always "variation-1", so covers match the products' lead photos).
 */
const { products: CURATION, covers: COVERS } = JSON.parse(fs.readFileSync(path.join(root, 'scripts/generated-images.curation.json'), 'utf8'))

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const stem = (f) => f.replace(/\.(png|jpe?g|webp)$/i, '')
const dirs = (d) => fs.readdirSync(d, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)

/** main → variation-1, -2… → variation-a, -b… → supporting → anything else */
function defaultRank(name) {
   if (name === 'main') return [0, 0]
   const n = name.match(/^variation-(\d+)$/)
   if (n) return [1, Number(n[1])]
   const a = name.match(/^variation-([a-z])$/)
   if (a) return [2, a[1].charCodeAt(0)]
   if (name === 'supporting') return [3, 0]
   return [4, 0]
}

function order(files, rule = {}) {
   const lead = rule.lead ?? []
   const last = new Set(rule.last ?? [])
   const rank = (f) => {
      const s = stem(f)
      // House rule: variation-1 is always the lead photo, whatever the curation says
      if (s === 'variation-1') return [-2, 0]
      if (lead.includes(s)) return [-1, lead.indexOf(s)]
      if (last.has(s)) return [9, 0]
      return defaultRank(s)
   }
   return files
      .sort((a, b) => {
         const [x, y] = [rank(a), rank(b)]
         return x[0] - y[0] || x[1] - y[1] || a.localeCompare(b)
      })
      .slice(0, MAX_VIEWS)
}

/** Square JPEG; non-square shots sit centred on a blurred, enlarged copy of themselves. */
async function squareJpeg(file, outFile) {
   const meta = await sharp(file).metadata()
   const side = Math.min(MAX_SIDE, Math.max(meta.width, meta.height))
   let img
   if (Math.abs(meta.width - meta.height) <= 2) {
      img = sharp(file).resize(side, side, { fit: 'cover' })
   } else {
      const backdrop = await sharp(file).resize(side, side, { fit: 'cover' }).blur(40).modulate({ brightness: 1.04 }).toBuffer()
      const fg = await sharp(file).resize(side, side, { fit: 'inside' }).toBuffer()
      img = sharp(backdrop).composite([{ input: fg, gravity: 'center' }])
   }
   await img.jpeg({ quality: 82, mozjpeg: true }).toFile(outFile)
   return { width: side, height: side }
}

if (!fs.existsSync(SRC)) {
   console.error(`No source folder at ${path.relative(root, SRC)}`)
   process.exit(1)
}

fs.rmSync(OUT, { recursive: true, force: true })
const galleries = {}
const fileOf = {} // "<key>|<stem>" → output entry, for covers
let written = 0

for (const d of dirs(SRC)) {
   for (const c of dirs(path.join(SRC, d))) {
      for (const p of dirs(path.join(SRC, d, c))) {
         const raw = `${slug(d)}/${slug(c)}/${p.toLowerCase()}`
         const key = ALIASES[raw] ?? raw
         const srcDir = path.join(SRC, d, c, p)
         const files = order(
            fs.readdirSync(srcDir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)),
            CURATION[key]
         )
         if (!files.length) continue
         const outDir = path.join(OUT, key)
         fs.mkdirSync(outDir, { recursive: true })
         galleries[key] = []
         for (const [i, f] of files.entries()) {
            const size = await squareJpeg(path.join(srcDir, f), path.join(outDir, `${i + 1}.jpg`))
            const entry = { src: `/catalog/generated/${key}/${i + 1}.jpg`, ...size }
            galleries[key].push(entry)
            fileOf[`${key}|${stem(f)}`] = entry
            written++
         }
      }
   }
}

const covers = {}
for (const [coverKey, [productKey, name]] of Object.entries(COVERS)) {
   const entry = fileOf[`${productKey}|${name}`]
   if (!entry) throw new Error(`Cover ${coverKey}: ${productKey}/${name} is not in the output`)
   covers[coverKey] = [entry]
}

const line = (k, views) => `   '${k}': [${views.map((v) => `{ src: '${v.src}', width: ${v.width}, height: ${v.height} }`).join(', ')}],`
const keys = Object.keys(galleries).sort()
fs.writeFileSync(
   MANIFEST,
   `// Generated by scripts/generated-images.mjs — AI-generated product photos (do not edit).
// These win over the studio renders in mockup-manifest.ts.
const GENERATED: Record<string, Array<{ src: string; width: number; height: number }>> = {
${[...Object.keys(covers).sort().map((k) => line(k, covers[k])), ...keys.map((k) => line(`p:${k}`, galleries[k]))].join('\n')}
}

export default GENERATED
`
)

// The old studio renders for these products are now unused
let removed = 0
for (const key of keys) {
   const dir = path.join(MOCKUPS_DIR, key)
   if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true })
      removed++
   }
}

const mockupManifest = path.join(root, 'src/catalog/mockup-manifest.ts')
const replaced = new Set(keys.map((k) => `'p:${k}':`))
const kept = fs
   .readFileSync(mockupManifest, 'utf8')
   .split('\n')
   .filter((l) => !replaced.has(l.trim().split(' ')[0]))
fs.writeFileSync(mockupManifest, kept.join('\n'))

console.log(`${keys.length} products, ${written} images, ${Object.keys(covers).length} covers → ${path.relative(root, MANIFEST)}`)
console.log(`Removed ${removed} superseded studio-render folders from public/catalog/mockups`)
