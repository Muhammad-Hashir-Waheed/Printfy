#!/usr/bin/env node
/**
 * Renders studio product mockups with three.js in headless Chrome — every product is shot
 * from several angles (hero, front, high three-quarter / top-down, close-up detail).
 *
 *   node scripts/mockups/render.mjs                 render every product
 *   node scripts/mockups/render.mjs packaging/      only keys starting with a prefix (several allowed)
 *   node scripts/mockups/render.mjs --list          list product keys and whether they have a recipe
 *   node scripts/mockups/render.mjs --missing       only products that have no renders yet
 *
 * Scenes: hand-tuned recipes in recipes/*.js, otherwise the category template in recipes/auto.js.
 * Output: public/catalog/mockups/<product key>/<n>.jpg + src/catalog/mockup-manifest.ts
 * (mockups always win over Pixabay photos — see src/catalog/images.ts).
 */
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import puppeteer from 'puppeteer-core'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const outDir = path.join(root, 'public/catalog/mockups')
const manifestFile = path.join(root, 'src/catalog/mockup-manifest.ts')
const args = process.argv.slice(2)

/* ── Catalog: every product with its department / category context ── */
const { DEPARTMENT_SEEDS: DEPARTMENTS } = await import(pathToFileURL(path.join(root, 'src/catalog/data.ts')).href)
const slugify = (v) => v.trim().toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const catalog = []
for (const d of DEPARTMENTS) {
   for (const c of d.categories ?? []) {
      ;(c.products ?? []).forEach((p, index) => {
         catalog.push({
            key: `${d.slug}/${c.slug}/${slugify(p[0])}`,
            dept: d.slug,
            cat: c.slug,
            kind: c.kind,
            name: p[0],
            summary: p[1],
            index,
            accent: d.accent,
         })
      })
   }
}

const CHROME =
   process.env.CHROME_PATH ||
   ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome'].find((p) =>
      fs.existsSync(p)
   )
if (!CHROME) throw new Error('Chrome not found — set CHROME_PATH')

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json' }
const server = http.createServer((req, res) => {
   const url = decodeURIComponent(new URL(req.url, 'http://x').pathname)
   const file = path.join(root, url.startsWith('/node_modules/') ? url : path.join('scripts/mockups', url))
   if (!file.startsWith(root) || !fs.existsSync(file)) {
      res.writeHead(404).end()
      return
   }
   res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' })
   fs.createReadStream(file).pipe(res)
})
await new Promise((r) => server.listen(0, r))
const port = server.address().port

let browser, page
async function openStudio() {
   if (browser) await browser.close().catch(() => {})
   browser = await puppeteer.launch({
      executablePath: CHROME,
      headless: true,
      protocolTimeout: 600000,
      args: ['--enable-gpu-rasterization', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
   })
   page = await browser.newPage()
   page.on('pageerror', (e) => console.error('page error:', e.message))
   page.on('console', (m) => m.type() === 'error' && !/favicon|404/.test(m.text()) && console.error('console:', m.text()))
   await page.goto(`http://localhost:${port}/studio.html`)
   await page.waitForFunction('window.studioReady === true', { timeout: 60000 })
   await page.evaluate((c) => window.setCatalog(c), catalog)
}
await openStudio()

const renderable = new Set(await page.evaluate('window.renderableKeys()'))
if (args.includes('--list')) {
   for (const p of catalog) console.log(`${renderable.has(p.key) ? '✓' : '·'} ${p.key}`)
   console.log(`\n${renderable.size}/${catalog.length} products have a scene`)
   process.exit(0)
}
const prefixes = args.filter((a) => !a.startsWith('--'))
let keys = catalog.map((p) => p.key).filter((k) => renderable.has(k))
if (prefixes.length) keys = keys.filter((k) => prefixes.some((p) => k.startsWith(p)))
if (args.includes('--missing')) keys = keys.filter((k) => !fs.existsSync(path.join(outDir, k, '1.jpg')))

let ok = 0
const started = Date.now()
const RECYCLE_EVERY = 20 // fresh page now and then so GPU memory never piles up
for (const [i, key] of keys.entries()) {
   if (i && i % RECYCLE_EVERY === 0) await openStudio()
   const t = Date.now()
   for (let attempt = 1; attempt <= 2; attempt++) {
      try {
         const urls = await page.evaluate((k) => window.renderKey(k), key)
         const dir = path.join(outDir, key)
         fs.rmSync(dir, { recursive: true, force: true })
         fs.mkdirSync(dir, { recursive: true })
         urls.forEach((u, n) => fs.writeFileSync(path.join(dir, `${n + 1}.jpg`), Buffer.from(u.split(',')[1], 'base64')))
         fs.rmSync(`${dir}.jpg`, { force: true }) // single-image render from the previous layout
         ok++
         console.log(`✓ [${i + 1}/${keys.length}] ${key}  ${urls.length} views (${Date.now() - t} ms)`)
         break
      } catch (e) {
         console.error(`✗ ${key} (attempt ${attempt}): ${e.message}`)
         await openStudio() // the GPU process may have crashed — start clean and retry once
      }
   }
}
await browser.close().catch(() => {})
server.close()

/* ── Manifest: every product folder on disk → its ordered views ── */
const galleries = []
;(function walk(dir) {
   if (!fs.existsSync(dir)) return
   const files = fs.readdirSync(dir, { withFileTypes: true })
   const views = files.filter((f) => f.isFile() && /^\d+\.jpg$/.test(f.name)).map((f) => f.name).sort((a, b) => parseInt(a) - parseInt(b))
   if (views.length) galleries.push([path.relative(outDir, dir).replace(/\\/g, '/'), views])
   for (const f of files) if (f.isDirectory()) walk(path.join(dir, f.name))
})(outDir)
galleries.sort((a, b) => a[0].localeCompare(b[0]))
const body = galleries
   .map(([k, views]) => `   'p:${k}': [${views.map((v) => `{ src: '/catalog/mockups/${k}/${v}', width: 1400, height: 1050 }`).join(', ')}],`)
   .join('\n')
fs.writeFileSync(
   manifestFile,
   `// Generated by scripts/mockups/render.mjs — studio-rendered product galleries (do not edit).\nconst MOCKUPS: Record<string, Array<{ src: string; width: number; height: number }>> = {\n${body}\n}\n\nexport default MOCKUPS\n`
)
console.log(`\n${ok}/${keys.length} rendered in ${Math.round((Date.now() - started) / 1000)}s · ${galleries.length} product galleries in manifest`)
