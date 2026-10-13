#!/usr/bin/env node
/**
 * Review helper: for every product, search Pixabay with product-specific queries and
 * save up to 8 candidates per product to node_modules/.cache/pixabay/product-candidates.json.
 * Picks are then recorded in scripts/image-picks.mjs (PRODUCT_PICKS) and applied with
 * `node scripts/fetch-catalog-images.mjs --apply-picks`.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { GLOBAL_EXCLUDE } from './image-curation.mjs'
import { PRODUCT_QUERIES } from './product-queries.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const cacheDir = path.join(root, 'node_modules/.cache/pixabay')
const outFile = path.join(cacheDir, 'product-candidates.json')
const key = fs.readFileSync(path.join(root, '.env.local'), 'utf8').match(/^PIXABAY_API_KEY\s*=\s*["']?([^"'\r\n]+)/m)?.[1]
if (!key) throw new Error('PIXABAY_API_KEY missing in .env.local')

const slugify = (v) => v.trim().toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function search(q) {
   fs.mkdirSync(cacheDir, { recursive: true })
   const file = path.join(cacheDir, `${slugify(q)}-60.json`)
   if (fs.existsSync(file) && Date.now() - fs.statSync(file).mtimeMs < 24 * 3600e3) return JSON.parse(fs.readFileSync(file, 'utf8'))
   const url = `https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(q.slice(0, 100))}&image_type=photo&orientation=horizontal&safesearch=true&min_width=900&per_page=60`
   for (;;) {
      const res = await fetch(url)
      if (res.status === 429) {
         await sleep(((Number(res.headers.get('x-ratelimit-reset')) || 60) + 1) * 1000)
         continue
      }
      const data = res.ok ? await res.json() : { hits: [] }
      fs.writeFileSync(file, JSON.stringify(data))
      await sleep(650)
      return data
   }
}

const banned = (hit) => {
   const tokens = new Set((hit.tags ?? '').toLowerCase().split(/[^a-z0-9-]+/))
   return GLOBAL_EXCLUDE.some((b) => tokens.has(b))
}

const { DEPARTMENT_SEEDS } = await import(new URL('file:///' + path.join(root, 'src/catalog/data.ts').replace(/\\/g, '/')))
const only = process.argv[2]
const result = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, 'utf8')) : {}

for (const d of DEPARTMENT_SEEDS) {
   for (const c of d.categories) {
      for (const [name, , , q] of c.products) {
         const k = `${d.slug}/${c.slug}/${slugify(name)}`
         if (only && !k.startsWith(only)) continue
         const queries = PRODUCT_QUERIES[k] ?? [q ?? name, name]
         const seen = new Set()
         const list = []
         // Interleave results from each query so every phrasing gets a say
         const results = []
         for (const query of queries) results.push((await search(query)).hits ?? [])
         for (let i = 0; i < 20 && list.length < 8; i++) {
            for (const hits of results) {
               const hit = hits[i]
               if (!hit || seen.has(hit.id) || banned(hit)) continue
               seen.add(hit.id)
               list.push({
                  id: hit.id,
                  previewURL: hit.previewURL,
                  webformatURL: hit.webformatURL,
                  largeImageURL: hit.largeImageURL,
                  imageWidth: hit.imageWidth,
                  imageHeight: hit.imageHeight,
                  tags: hit.tags,
                  user: hit.user,
                  user_id: hit.user_id,
                  pageURL: hit.pageURL,
               })
               if (list.length >= 8) break
            }
         }
         result[k] = list
         console.log(`${k}: ${list.length}`)
      }
   }
}
fs.writeFileSync(outFile, JSON.stringify(result))
