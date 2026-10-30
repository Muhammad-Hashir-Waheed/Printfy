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
}

/**
 * Per product (catalog key without "p:"), by file name without extension:
 *   lead — shown first;  last — moved to the end (collages, busy scenes, garbled lettering);
 *   hide — never shown (unused: every generated photo is shown, the weak ones just never lead).
 * A product whose every image is hidden keeps its studio render.
 */
const CURATION = {
   // Comparison collages with caption text, mostly bottle carriers
   'food-packaging/food-accessories/4-cup-drink-carrier': { last: ['variation-1', 'variation-2'] },
   // Brand lettering garbled in every shot ("JOS GROCERY", "JOJI A-OCERY")
   'food-packaging/food-bags/sos-grocery-bag': { last: ['variation-1', 'variation-2', 'variation-3'] },
   'food-packaging/food-bags/kraft-to-go-bag': { last: ['variation-3'] }, // "JOJI TO-ARTS"
   'food-packaging/food-bags/grease-resistant-takeout-bag': { last: ['variation-3'] }, // "TAKEARTS"
   'food-packaging/cups/clear-pet-smoothie-cup': { last: ['variation-2'] }, // mostly mugs
   'food-packaging/cups/hot-paper-cup': { last: ['Gemini_Generated_Image_3rvu2s3rvu2s3rvu'] },
   'food-packaging/food-boxes/custom-pizza-box': { last: ['variation-1'] }, // "JOJI ART"
   'food-packaging/food-boxes/cake-box': { lead: ['variation-3', 'variation-2'], last: ['variation-1'] },
   'food-packaging/food-boxes/large-combo-burger-box': { last: ['variation-1'] },
   'food-packaging/food-boxes/donut-box': { last: ['variation-1'] },
   'food-packaging/food-boxes/fries-and-nugget-carton': { last: ['variation-1'] },
   'food-packaging/food-boxes/window-pizza-box': { last: ['variation-1'] },
   'food-packaging/food-containers/kraft-meal-tray-with-lid': { last: ['variation-3'] },
   'packaging/corrugated-boxes/cube-shipping-box': { last: ['variation-3'] },
   'packaging/corrugated-boxes/e-flute-retail-box': { last: ['variations'] },
   'packaging/corrugated-boxes/moving-and-storage-box': { last: ['variation-3'] },
   'packaging/folding-cartons/pharmaceutical-carton': { last: ['variation-3'] }, // red-cross emblem, "JUD-AID"
   'packaging/kraft-boxes/kraft-gift-box': { lead: ['variation-5', 'variation-2'], last: ['variation-4'] }, // "Gift Calency"
   'packaging/kraft-boxes/kraft-tuck-box': { lead: ['variation-2'], last: ['variation-3'] }, // "TUCK BECX"
   'packaging/kraft-boxes/kraft-pillow-box': { lead: ['variation-1', 'variation-4'], last: ['variation-3'] }, // not a pillow box
   'packaging/mailer-boxes/branded-mailer-box': { last: ['variation-1'] },
   'packaging/mailer-boxes/lite-mailer-box': { lead: ['main', 'variation-a', 'variation-b', 'variation-c'] },
   'packaging/rigid-boxes/collapsible-rigid-box': { last: ['variation-3'] },
   'packaging/rigid-boxes/drawer-rigid-box': { last: ['variation-3', 'variation-4'] },
   'packaging/rigid-boxes/magnetic-closure-box': { last: ['variation-3', 'variation-4', 'variation-5'] },
   'packaging/rigid-boxes/premium-rigid-box': { last: ['variation-3', 'variation-5'] },
   'packaging/rigid-boxes/sleeve-rigid-box': { last: ['variation-3'] },
}

/** Category and department covers: [product key, image file name] */
const COVERS = {
   'd:food-packaging': ['food-packaging/food-boxes/custom-pizza-box', 'variation-2'],
   'd:packaging': ['packaging/kraft-boxes/kraft-shipping-box', 'variation-3'],
   'd:retail-packaging': ['retail-packaging/product-boxes/jewelry-box', 'variation-3'],
   'c:food-packaging/cups': ['food-packaging/cups/double-wall-coffee-cup', 'variation-1'],
   'c:food-packaging/food-accessories': ['food-packaging/food-accessories/4-bottle-carrier', 'variation-3'],
   'c:food-packaging/food-bags': ['food-packaging/food-bags/bakery-bread-bag', 'variation-2'],
   'c:food-packaging/food-boxes': ['food-packaging/food-boxes/branded-burger-box', 'variation-1'],
   'c:food-packaging/food-containers': ['food-packaging/food-containers/salad-bowl-container', 'variation-3'],
   'c:packaging/corrugated-boxes': ['packaging/corrugated-boxes/corrugated-shipping-box', 'main'],
   'c:packaging/folding-cartons': ['packaging/folding-cartons/tuck-end-carton', 'variation-1'],
   'c:packaging/kraft-boxes': ['packaging/kraft-boxes/kraft-window-box', 'variation-3'],
   'c:packaging/mailer-boxes': ['packaging/mailer-boxes/rigid-mailer-box', 'variation-3'],
   'c:packaging/rigid-boxes': ['packaging/rigid-boxes/magnetic-closure-box', 'variation-1'],
   'c:packaging/specialty-boxes': ['packaging/specialty-boxes/hexagon-box', 'variation-2'],
   'c:retail-packaging/display-boxes': ['retail-packaging/display-boxes/counter-display-box', 'variation-1'],
   'c:retail-packaging/product-boxes': ['retail-packaging/product-boxes/candle-box', 'variation-3'],
}

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
   const hide = new Set(rule.hide ?? [])
   const lead = rule.lead ?? []
   const last = new Set(rule.last ?? [])
   const rank = (f) => {
      const s = stem(f)
      if (lead.includes(s)) return [-1, lead.indexOf(s)]
      if (last.has(s)) return [9, 0]
      return defaultRank(s)
   }
   return files
      .filter((f) => !hide.has(stem(f)))
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
