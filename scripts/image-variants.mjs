/**
 * Pre-sized WebP copies of every catalog image, so the site needs no image optimisation server.
 *
 *   public/catalog/x/1.jpg → public/_v/256/catalog/x/1.webp, public/_v/640/…, public/_v/1080/…
 *
 * src/lib/image-loader.ts points next/image at the smallest copy that covers the requested width.
 * On Cloudflare these are plain static files: free, cached at the edge, and never run the Worker.
 * Runs before every build and dev start; unchanged images are skipped.
 *
 *   npm run images:variants [-- --force]
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(path.join(root, 'package.json'))
const sharp = require('sharp')

/** Keep in sync with VARIANT_WIDTHS in src/lib/image-loader.ts */
const WIDTHS = [256, 640, 1080]
const SOURCES = ['catalog', 'packaging']
const PUBLIC = path.join(root, 'public')
const OUT = path.join(PUBLIC, '_v')
const force = process.argv.includes('--force')

const files = []
const walk = (dir) => {
   if (!fs.existsSync(dir)) return
   for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) walk(full)
      else if (/\.(jpe?g|png|webp)$/i.test(e.name)) files.push(full)
   }
}
SOURCES.forEach((s) => walk(path.join(PUBLIC, s)))

const target = (file, w) =>
   path.join(OUT, String(w), path.relative(PUBLIC, file)).replace(/\.(jpe?g|png|webp)$/i, '.webp')

const jobs = []
for (const file of files) {
   const mtime = fs.statSync(file).mtimeMs
   for (const w of WIDTHS) {
      const out = target(file, w)
      if (!force && fs.existsSync(out) && fs.statSync(out).mtimeMs >= mtime) continue
      jobs.push({ file, w, out })
   }
}

let done = 0
const worker = async () => {
   for (let job = jobs.shift(); job; job = jobs.shift()) {
      fs.mkdirSync(path.dirname(job.out), { recursive: true })
      await sharp(job.file)
         .resize({ width: job.w, withoutEnlargement: true })
         .webp({ quality: job.w <= 256 ? 70 : 76, effort: 4 })
         .toFile(job.out)
      done++
   }
}
const total = jobs.length
sharp.concurrency(1)
await Promise.all(Array.from({ length: Math.max(1, os.cpus().length - 1) }, worker))

// Drop copies whose source image was removed
let removed = 0
const expected = new Set(files.flatMap((f) => WIDTHS.map((w) => target(f, w))))
const prune = (dir) => {
   if (!fs.existsSync(dir)) return
   for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) {
         prune(full)
         if (!fs.readdirSync(full).length) fs.rmdirSync(full)
      } else if (!expected.has(full)) {
         fs.rmSync(full)
         removed++
      }
   }
}
prune(OUT)

console.log(`image variants: ${files.length} images × ${WIDTHS.length} widths — ${done}/${total} written, ${removed} stale removed`)
