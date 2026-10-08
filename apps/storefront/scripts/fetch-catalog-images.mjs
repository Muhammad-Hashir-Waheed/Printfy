#!/usr/bin/env node
/**
 * Picks a relevant Pixabay photo for every department, category and product in
 * src/catalog/data.ts, downloads it to public/catalog/ and records it in
 * src/catalog/image-manifest.json.
 *
 *   1. Put your key in apps/storefront/.env.local →  PIXABAY_API_KEY=xxxxxxxx
 *   2. npm run images:fetch
 *
 *   npm run images:fetch -- --only signage-displays          # one department
 *   npm run images:fetch -- --redo p:bags/pouches/zipper-pouch --query "zip pouch snacks"
 *
 * Pixabay rules respected: images are downloaded (no hotlinking), API responses
 * are cached for 24h, and the 100 requests / minute limit is honoured.
 * Resumable: keys already in the manifest are skipped.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const manifestPath = path.join(root, 'src/catalog/image-manifest.json')
const publicDir = path.join(root, 'public')
const cacheDir = path.join(root, 'node_modules/.cache/pixabay')

function readKey() {
   if (process.env.PIXABAY_API_KEY) return process.env.PIXABAY_API_KEY.trim()
   for (const file of ['.env.local', '.env']) {
      const p = path.join(root, file)
      if (!fs.existsSync(p)) continue
      const match = fs.readFileSync(p, 'utf8').match(/^PIXABAY_API_KEY\s*=\s*["']?([^"'\r\n]+)["']?/m)
      if (match) return match[1].trim()
   }
   return null
}

function arg(name) {
   const i = process.argv.indexOf(name)
   return i >= 0 ? process.argv[i + 1] : undefined
}

const slugify = (v) =>
   v.trim().toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const STOP = new Set(['and', 'the', 'for', 'with', 'custom', 'branded', 'printed'])
const words = (text) =>
   text
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 2 && !STOP.has(w))
      .map((w) => w.replace(/s$/, ''))

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** A photo must carry at least one of these tags to be used in the department. */
const DEPT_TAGS = {
   packaging: ['box', 'carton', 'package', 'packaging', 'cardboard', 'parcel', 'gift', 'present', 'container'],
   'food-packaging': ['food', 'pizza', 'burger', 'cup', 'coffee', 'box', 'bag', 'takeaway', 'container', 'fries', 'cake', 'bakery', 'meal', 'packaging', 'donut', 'bread', 'sushi', 'noodle', 'salad', 'soup', 'napkin', 'bottle', 'drink', 'ice cream', 'smoothie', 'carrier'],
   'retail-packaging': ['box', 'packaging', 'product', 'gift', 'paper', 'tag', 'card', 'ribbon', 'tissue', 'wrapping', 'display', 'cosmetic', 'candle', 'soap', 'jewelry', 'package', 'shop', 'store', 'shelf', 'leaflet'],
   bags: ['bag', 'tote', 'pouch', 'shopping', 'envelope', 'mailer', 'sack', 'jute', 'canvas', 'backpack', 'purse'],
   printing: ['card', 'paper', 'print', 'printing', 'stationery', 'envelope', 'flyer', 'brochure', 'letter', 'notebook', 'notepad', 'document', 'office', 'pen', 'desk', 'calendar', 'stamp', 'certificate', 'booklet', 'catalog', 'magazine', 'leaflet', 'menu', 'mail', 'folder', 'id'],
   'labels-stickers': ['label', 'sticker', 'tag', 'barcode', 'qr', 'code', 'bottle', 'jar', 'decal', 'seal', 'package'],
   marketing: ['poster', 'banner', 'flag', 'flyer', 'card', 'postcard', 'menu', 'calendar', 'canvas', 'print', 'sign', 'advertising', 'billboard', 'brochure', 'voucher', 'table', 'exhibition', 'event'],
   corporate: ['pen', 'mug', 'bottle', 'keychain', 'key', 'lanyard', 'shirt', 't-shirt', 'hoodie', 'cap', 'hat', 'apron', 'jacket', 'gift', 'notebook', 'diary', 'folder', 'trophy', 'award', 'desk', 'office', 'usb', 'power', 'mouse', 'stationery', 'uniform', 'clothing', 'polo', 'business', 'organizer'],
   'custom-packaging': ['box', 'packaging', 'bag', 'print', 'printing', 'design', 'paper', 'package', 'designer', 'prototype', 'printer', 'press'],
   'acrylic-plastic-packaging': ['acrylic', 'plastic', 'clear', 'transparent', 'glass', 'box', 'container', 'display', 'jar', 'case', 'showcase', 'cake', 'chocolate', 'gift', 'hamper', 'jewelry', 'cosmetic', 'storage'],
   'signage-displays': ['sign', 'neon', 'led', 'display', 'screen', 'letters', 'letter', 'logo', 'banner', 'billboard', 'signage', 'light', 'board', 'booth', 'exhibition', 'wall', 'storefront', 'shop', 'stand', 'backdrop', 'signboard', 'monitor', 'video', 'stage', 'window', 'reception', 'door', 'office', 'wedding', 'welcome', 'arrow', 'parking', 'safety', 'exit', 'emergency', 'menu', 'advertising', 'trade', 'fair', 'lettering', 'nameplate', 'plaque'],
}

/** Tags we never want: trademarks, tobacco, weapons, etc. */
const BLOCK = new Set(
   'chanel dior gucci prada boss hugo apple iphone ipad samsung nike adidas coca cola pepsi starbucks mcdonald mcdonalds kfc burger-king amazon ikea lego disney cigarette cigarettes tobacco smoking smoke bullet bullets ammunition cartridge weapon gun pistol rifle drug drugs nude sexy lingerie bikini blood skull death war'.split(' ')
)

async function search(key, query) {
   fs.mkdirSync(cacheDir, { recursive: true })
   const cacheFile = path.join(cacheDir, `${slugify(query)}.json`)
   if (fs.existsSync(cacheFile) && Date.now() - fs.statSync(cacheFile).mtimeMs < 24 * 3600 * 1000) {
      return JSON.parse(fs.readFileSync(cacheFile, 'utf8'))
   }

   const url =
      `https://pixabay.com/api/?key=${encodeURIComponent(key)}` +
      `&q=${encodeURIComponent(query.slice(0, 100))}` +
      `&image_type=photo&orientation=horizontal&safesearch=true&min_width=900&per_page=40`

   for (;;) {
      const res = await fetch(url)
      if (res.status === 429) {
         const wait = (Number(res.headers.get('x-ratelimit-reset')) || 60) * 1000 + 1000
         console.log(`  rate limited — waiting ${Math.round(wait / 1000)}s`)
         await sleep(wait)
         continue
      }
      if (res.status === 400) {
         const text = await res.text()
         if (/key/i.test(text)) throw new Error(`Pixabay rejected the API key: ${text}`)
         return { hits: [] }
      }
      if (!res.ok) throw new Error(`Pixabay HTTP ${res.status}`)
      const data = await res.json()
      fs.writeFileSync(cacheFile, JSON.stringify(data))
      // stay comfortably under 100 requests / minute
      const remaining = Number(res.headers.get('x-ratelimit-remaining'))
      if (remaining <= 2) {
         const wait = (Number(res.headers.get('x-ratelimit-reset')) || 60) * 1000 + 1000
         await sleep(wait)
      } else {
         await sleep(650)
      }
      return data
   }
}

async function download(url, dest) {
   const res = await fetch(url)
   if (!res.ok) throw new Error(`download HTTP ${res.status}`)
   fs.mkdirSync(path.dirname(dest), { recursive: true })
   fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()))
}

async function main() {
   const key = readKey()
   if (!key) {
      console.error('\nMissing PIXABAY_API_KEY.\nAdd it to apps/storefront/.env.local like this:\n\n   PIXABAY_API_KEY=your-key-here\n')
      process.exit(1)
   }

   const { DEPARTMENT_SEEDS } = await import(
      new URL('file:///' + path.join(root, 'src/catalog/data.ts').replace(/\\/g, '/'))
   )

   const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {}

   // Drop entries from the previous provider (or files that went missing)
   for (const [k, v] of Object.entries(manifest)) {
      if (!v.file || !fs.existsSync(path.join(publicDir, v.file))) delete manifest[k]
   }

   /** @type {Array<{key: string, queries: string[], label: string, large: boolean}>} */
   const jobs = []
   for (const d of DEPARTMENT_SEEDS) {
      jobs.push({ key: `d:${d.slug}`, dept: d.slug, queries: [d.imageQuery, d.name], label: d.name, large: true })
      for (const c of d.categories) {
         const cq = c.imageQuery ?? c.name
         jobs.push({ key: `c:${d.slug}/${c.slug}`, dept: d.slug, queries: [cq, c.name, d.imageQuery], label: c.name, large: true })
         for (const [name, , , q] of c.products) {
            jobs.push({
               key: `p:${d.slug}/${c.slug}/${slugify(name)}`,
               dept: d.slug,
               queries: [q ?? name, name, cq],
               label: name,
               large: false,
            })
         }
      }
   }

   const only = arg('--only')
   const redo = arg('--redo')
   const redoQuery = arg('--query')

   let todo = jobs.filter((j) => !manifest[j.key])
   if (only) todo = todo.filter((j) => j.key.slice(2).startsWith(only))
   if (redo) {
      const job = jobs.find((j) => j.key === redo)
      if (!job) throw new Error(`Unknown key ${redo}`)
      const old = manifest[redo]
      delete manifest[redo]
      todo = [{ ...job, queries: redoQuery ? [redoQuery] : job.queries, exclude: old?.id }]
   }

   const used = new Set(Object.values(manifest).map((e) => e.id))
   console.log(`${jobs.length} images in catalog · ${jobs.length - todo.length} done · ${todo.length} to fetch\n`)

   const save = () => fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1) + '\n')
   let failed = 0

   for (const [i, job] of todo.entries()) {
      let pick = null
      let usedQuery = ''
      let fallback = null
      for (const query of job.queries.filter(Boolean)) {
         const data = await search(key, query)
         const wanted = [...new Set(words(query))]
         const head = wanted[wanted.length - 1]
         const allowed = DEPT_TAGS[job.dept] ?? []
         const candidates = (data.hits ?? []).filter((h) => {
            if (used.has(h.id) || h.id === job.exclude) return false
            const raw = (h.tags ?? '').toLowerCase()
            const tagWords = raw.split(/[^a-z0-9-]+/)
            if (tagWords.some((t) => BLOCK.has(t))) return false
            return allowed.length === 0 || allowed.some((a) => raw.includes(a))
         })
         if (!candidates.length) continue
         // Score by how many query words appear in the photo's tags; the head noun
         // (last word, e.g. "box") counts double. Keep Pixabay's ranking as a tiebreak.
         const ranked = candidates
            .map((hit, index) => {
               const tags = new Set(words(hit.tags ?? ''))
               const tagText = [...tags].join(' ')
               const matched = wanted.filter((w) => tags.has(w) || tagText.includes(w))
               const ratio = (matched.length + (matched.includes(head) ? 1 : 0)) / (wanted.length + 1)
               return { hit, ratio, score: ratio * 100 - index * 0.4 + Math.min(hit.likes ?? 0, 300) / 150 }
            })
            .sort((a, b) => b.score - a.score)
         if (!fallback || ranked[0].score > fallback.score) fallback = { ...ranked[0], query }
         if (ranked[0].ratio >= 0.6) {
            pick = ranked[0].hit
            usedQuery = query
            break
         }
      }
      if (!pick && fallback) {
         pick = fallback.hit
         usedQuery = fallback.query
      }

      if (!pick) {
         failed++
         console.warn(`! [${i + 1}/${todo.length}] ${job.key}: no results`)
         continue
      }

      // webformatURL is 640px; Pixabay also serves _960 / _340 variants of the same file.
      // Prefer the 960px rendition for banners, fall back to large / web formats.
      const wantSize = job.large ? 960 : 640
      const sources = [
         [pick.webformatURL.replace(/_640(\.\w+)$/, `_${wantSize}$1`), wantSize],
         [pick.largeImageURL, 1280],
         [pick.webformatURL, 640],
      ]
      const ext = path.extname(new URL(pick.webformatURL).pathname) || '.jpg'
      const file = `/catalog/${job.key.replace(':', '/')}${ext}`
      let size = 0
      for (const [src, w] of sources) {
         try {
            await download(src, path.join(publicDir, file))
            size = w
            break
         } catch {
            // try the next rendition
         }
      }
      if (!size) {
         failed++
         console.warn(`! ${job.key}: download failed`)
         continue
      }

      used.add(pick.id)
      const ratio = pick.imageHeight / pick.imageWidth
      manifest[job.key] = {
         id: pick.id,
         file,
         width: size,
         height: Math.round(size * ratio),
         alt: `${job.label} — ${pick.tags}`,
         photographer: pick.user,
         photographerUrl: `https://pixabay.com/users/${pick.user}-${pick.user_id}/`,
         pageUrl: pick.pageURL,
         query: usedQuery,
         source: 'pixabay',
      }
      if ((i + 1) % 10 === 0) save()
      console.log(`✓ [${i + 1}/${todo.length}] ${job.key}  ←  ${pick.tags}`)
   }

   save()
   console.log(`\nDone. ${todo.length - failed} downloaded${failed ? `, ${failed} failed (run again to retry)` : ''}.`)
}

main().catch((error) => {
   console.error('\n' + error.message)
   process.exit(1)
})
