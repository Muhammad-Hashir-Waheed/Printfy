#!/usr/bin/env node
/**
 * Renders studio product mockups with three.js in headless Chrome — every product is shot
 * from several angles (hero, front, high three-quarter / top-down, close-up detail).
 *
 *   node scripts/mockups/render.mjs                 render every product
 *   node scripts/mockups/render.mjs packaging/      only keys starting with a prefix (several allowed)
 *   node scripts/mockups/render.mjs --list          list product keys and whether they have a recipe
 *   node scripts/mockups/render.mjs --missing       only products that have no renders yet
 *   node scripts/mockups/render.mjs --blender ...   photoreal: export each scene to glTF and render it in Blender / Cycles
 *                                                   (scripts/mockups/render.py; assets via fetch-assets.mjs)
 *   --out=<dir>                                     write views to <dir>/<key>/ instead (preview — manifest untouched)
 *   --width=1600 --samples=256                      Blender output width (4:3) and max adaptive samples
 *
 * Scenes: hand-tuned recipes in recipes/*.js, otherwise the category template in recipes/auto.js.
 * Output: public/catalog/mockups/<product key>/<n>.jpg + src/catalog/mockup-manifest.ts
 * (mockups always win over Pixabay photos — see src/catalog/images.ts).
 */
import fs from 'node:fs'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import puppeteer from 'puppeteer-core'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const liveDir = path.join(root, 'public/catalog/mockups')
const manifestFile = path.join(root, 'src/catalog/mockup-manifest.ts')
const args = process.argv.slice(2)
const flag = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=')
const BLENDER = args.includes('--blender')
const outDir = flag('out') ? path.resolve(flag('out')) : liveDir
const preview = outDir !== liveDir

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

const RECYCLE_EVERY = 20 // fresh page now and then so GPU memory never piles up
if (BLENDER) {
   await renderWithBlender(keys)
   process.exit(0)
}

let ok = 0
const started = Date.now()
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
if (!preview) writeManifest()
console.log(`\n${ok}/${keys.length} rendered in ${Math.round((Date.now() - started) / 1000)}s`)

/* ── Blender / Cycles path: export each scene from the studio page, render the batch in Blender ── */
async function renderWithBlender(keys) {
   const blender =
      process.env.BLENDER_PATH ||
      [
         path.join(process.env.LOCALAPPDATA || '', 'Programs/BlenderPortable/blender-4.5.14-windows-x64/blender.exe'),
         'C:/Program Files/Blender Foundation/Blender 4.5/blender.exe',
         '/Applications/Blender.app/Contents/MacOS/Blender',
         '/usr/bin/blender',
      ].find((p) => fs.existsSync(p))
   if (!blender) throw new Error('Blender not found — set BLENDER_PATH')
   const assets = path.join(root, 'scripts/mockups/assets')
   if (!fs.existsSync(path.join(assets, 'hdri'))) throw new Error('Assets missing — run node scripts/mockups/fetch-assets.mjs')

   const cache = path.join(root, 'scripts/mockups/.cache')
   const jobs = []
   for (const [i, key] of keys.entries()) {
      if (i && i % RECYCLE_EVERY === 0) await openStudio()
      const { glb, meta } = await page.evaluate((k) => window.exportKey(k), key)
      const dir = path.join(cache, key)
      fs.rmSync(dir, { recursive: true, force: true })
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(path.join(dir, 'scene.glb'), Buffer.from(glb, 'base64'))
      for (const [name, m] of Object.entries(meta.materials)) {
         if (!m.foilMask) continue
         const file = path.join(dir, `${name}-foil.png`)
         fs.writeFileSync(file, Buffer.from(m.foilMask.split(',')[1], 'base64'))
         m.foilMask = file
      }
      fs.writeFileSync(path.join(dir, 'scene.json'), JSON.stringify(meta, null, 1))
      jobs.push({ key, glb: path.join(dir, 'scene.glb'), meta: path.join(dir, 'scene.json'), out: path.join(outDir, key) })
      console.log(`→ exported ${key}`)
   }
   await browser.close().catch(() => {})
   server.close()

   const width = Number(flag('width') || 1600)
   const jobsFile = path.join(cache, 'jobs.json')
   const timings = path.join(cache, 'timings.json')
   fs.writeFileSync(jobsFile, JSON.stringify({ assets, width, height: Math.round((width * 3) / 4), samples: Number(flag('samples') || 256), timings, jobs }, null, 1))
   const t = Date.now()
   const run = spawnSync(blender, ['-b', '--factory-startup', '-P', path.join(root, 'scripts/mockups/render.py'), '--', jobsFile], { stdio: 'inherit' })
   if (run.status !== 0) throw new Error(`Blender exited with ${run.status}`)
   if (!preview) writeManifest()
   console.log(`\nBlender: ${jobs.length} products in ${Math.round((Date.now() - t) / 1000)}s on ${os.cpus()[0].model}${preview ? ` → ${outDir} (preview, manifest untouched)` : ''}`)
}

/** Width × height from a JPEG's SOF marker. */
function jpegSize(file) {
   const b = fs.readFileSync(file)
   for (let i = 2; i + 9 < b.length; ) {
      const marker = b[i + 1]
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) }
      i += 2 + b.readUInt16BE(i + 2)
   }
   return { width: 1400, height: 1050 }
}

/* ── Manifest: every product folder on disk → its ordered views ── */
function writeManifest() {
   const galleries = []
   ;(function walk(dir) {
      if (!fs.existsSync(dir)) return
      const files = fs.readdirSync(dir, { withFileTypes: true })
      const views = files.filter((f) => f.isFile() && /^\d+\.jpg$/.test(f.name)).map((f) => f.name).sort((a, b) => parseInt(a) - parseInt(b))
      if (views.length) galleries.push([path.relative(liveDir, dir).split(path.sep).join('/'), views.map((v) => ({ v, ...jpegSize(path.join(dir, v)) }))])
      for (const f of files) if (f.isDirectory()) walk(path.join(dir, f.name))
   })(liveDir)
   galleries.sort((a, b) => a[0].localeCompare(b[0]))
   const body = galleries
      .map(([k, views]) => `   'p:${k}': [${views.map(({ v, width, height }) => `{ src: '/catalog/mockups/${k}/${v}', width: ${width}, height: ${height} }`).join(', ')}],`)
      .join('\n')
   fs.writeFileSync(
      manifestFile,
      `// Generated by scripts/mockups/render.mjs — studio-rendered product galleries (do not edit).\nconst MOCKUPS: Record<string, Array<{ src: string; width: number; height: number }>> = {\n${body}\n}\n\nexport default MOCKUPS\n`
   )
   console.log(`${galleries.length} product galleries in manifest`)
}
