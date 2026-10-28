#!/usr/bin/env node
/**
 * Downloads the CC0 lighting + material assets used by the Blender renderer (render.py)
 * into scripts/mockups/assets/ — re-run any time; existing files are kept.
 *
 *   HDRI      Poly Haven  (https://polyhaven.com, CC0)
 *   Textures  Poly Haven + ambientCG (https://ambientcg.com, CC0)
 *
 * Every material ends up as assets/<name>/{color,rough,normal}.jpg (normal = OpenGL convention).
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'assets')
const UA = { 'User-Agent': 'joji-arts-mockups/1.0' }

const HDRIS = ['studio_small_09']
const POLYHAVEN = {
   cotton: 'cotton_jersey', // knit for tees / hoodies
   plaster: 'plaster_grey_04', // light grey studio table
   oak: 'oak_veneer_01', // warm wooden table
}
const AMBIENTCG = {
   paper: 'Paper001', // white card stock
   cardboard: 'Cardboard002', // smooth kraft board
}

async function download(url, file) {
   if (fs.existsSync(file)) return false
   const res = await fetch(url, { headers: UA })
   if (!res.ok) throw new Error(`${res.status} ${url}`)
   fs.mkdirSync(path.dirname(file), { recursive: true })
   fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()))
   return true
}
const json = async (url) => (await fetch(url, { headers: UA })).json()

for (const id of HDRIS) {
   const files = await json(`https://api.polyhaven.com/files/${id}`)
   const got = await download(files.hdri['2k'].hdr.url, path.join(dir, 'hdri', `${id}.hdr`))
   console.log(`${got ? '↓' : '·'} hdri/${id}.hdr`)
}

for (const [name, id] of Object.entries(POLYHAVEN)) {
   const files = await json(`https://api.polyhaven.com/files/${id}`)
   const maps = { color: files.Diffuse, rough: files.Rough, normal: files.nor_gl }
   for (const [map, entry] of Object.entries(maps)) {
      const got = await download(entry['2k'].jpg.url, path.join(dir, name, `${map}.jpg`))
      console.log(`${got ? '↓' : '·'} ${name}/${map}.jpg  (${id})`)
   }
}

for (const [name, id] of Object.entries(AMBIENTCG)) {
   const target = path.join(dir, name)
   if (['color', 'rough', 'normal'].every((m) => fs.existsSync(path.join(target, `${m}.jpg`)))) {
      console.log(`· ${name}/*  (${id})`)
      continue
   }
   const zip = path.join(dir, `${id}.zip`)
   await download(`https://ambientcg.com/get?file=${id}_2K-JPG.zip`, zip)
   const tmp = path.join(dir, `${id}-unzipped`)
   fs.rmSync(tmp, { recursive: true, force: true })
   fs.mkdirSync(tmp, { recursive: true })
   // Windows' bsdtar — Git's GNU tar would read the drive letter as a remote host
   execFileSync(process.platform === 'win32' ? path.join(process.env.SystemRoot || 'C:/Windows', 'System32/tar.exe') : 'tar', ['-xf', zip, '-C', tmp])
   fs.mkdirSync(target, { recursive: true })
   const pick = (suffix) => fs.readdirSync(tmp).find((f) => f.endsWith(`_${suffix}.jpg`))
   for (const [map, suffix] of [['color', 'Color'], ['rough', 'Roughness'], ['normal', 'NormalGL']]) {
      fs.copyFileSync(path.join(tmp, pick(suffix)), path.join(target, `${map}.jpg`))
   }
   fs.rmSync(tmp, { recursive: true, force: true })
   fs.rmSync(zip, { force: true })
   console.log(`↓ ${name}/{color,rough,normal}.jpg  (${id})`)
}

fs.writeFileSync(
   path.join(dir, 'CREDITS.txt'),
   `All assets are CC0 (public domain).\nHDRI: ${HDRIS.join(', ')} — Poly Haven\nTextures: ${Object.values(POLYHAVEN).join(', ')} — Poly Haven; ${Object.values(AMBIENTCG).join(', ')} — ambientCG\n`
)
