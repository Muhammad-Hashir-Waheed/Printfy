// Extended builders: food service, labels, print, displays, signage, screens.
import * as THREE from 'three'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

import { canvasTexture, drawLogo, printFace, rng, BRANDS } from './art.js'
import { M, block, normalizeUV, tray } from './studio.js'

const mesh = (geo, mat, { cast = true, receive = true } = {}) => {
   const m = new THREE.Mesh(geo, mat)
   m.castShadow = cast
   m.receiveShadow = receive
   return m
}
const grp = (...c) => {
   const g = new THREE.Group()
   for (const x of c) if (x) g.add(x)
   return g
}

/* ───────── Food service ───────── */

/** Paper cup (tapered) with optional lid and sleeve. */
export function cup({ rTop = 0.42, rBot = 0.3, h = 1.25, body, lid = '#f4f2ee', lidStyle = 'hot', sleeve, dome = false } = {}) {
   const g = new THREE.Group()
   g.add(mesh(new THREE.CylinderGeometry(rTop, rBot, h, 64, 1, true), body).at(0, h / 2, 0).turn(Math.PI))
   g.add(mesh(new THREE.CircleGeometry(rBot, 48), M.white()).at(0, 0.005, 0).turn(0, -Math.PI / 2))
   if (lidStyle === 'hot') {
      const lm = M.matte(lid)
      g.add(mesh(new THREE.CylinderGeometry(rTop * 1.04, rTop * 1.04, 0.07, 64), lm).at(0, h + 0.02, 0))
      g.add(mesh(new THREE.CylinderGeometry(rTop * 0.88, rTop * 1.0, 0.1, 64), lm).at(0, h + 0.1, 0))
   } else if (lidStyle === 'dome') {
      g.add(mesh(new THREE.SphereGeometry(rTop * 1.02, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), M.acrylic('#ffffff', { thickness: 0.02 })).at(0, h, 0).grow(1))
   } else if (lidStyle === 'flat') {
      g.add(mesh(new THREE.CylinderGeometry(rTop * 1.03, rTop * 1.03, 0.05, 64), M.acrylic('#ffffff', { thickness: 0.02 })).at(0, h + 0.02, 0))
   }
   if (sleeve) {
      const sh = h * 0.42
      const k = (rTop - rBot) / h
      const r1 = rBot + k * (h * 0.3), r2 = rBot + k * (h * 0.3 + sh)
      g.add(mesh(new THREE.CylinderGeometry(r2 * 1.03, r1 * 1.03, sh, 64, 1, true), sleeve).at(0, h * 0.3 + sh / 2, 0).turn(Math.PI))
   }
   return g
}

/** Molded pulp drink carrier with n cups. */
export function cupCarrier({ n = 2, cupOpts = {} } = {}) {
   const g = new THREE.Group()
   const pulp = new THREE.MeshStandardMaterial({ color: '#b9ad97', roughness: 1 })
   const cols = n === 4 ? 2 : 2, rows = n === 4 ? 2 : 1
   const W = cols * 1.05, D = rows * 1.05
   g.add(block(W, 0.16, D, pulp, 0.08).at(0, 0.08, 0))
   if (n === 2) g.add(block(0.08, 0.7, D * 0.6, pulp, 0.03).at(0, 0.5, 0))
   else {
      g.add(block(0.08, 0.6, D * 0.8, pulp, 0.03).at(0, 0.45, 0))
      g.add(block(W * 0.8, 0.6, 0.08, pulp, 0.03).at(0, 0.45, 0))
   }
   let i = 0
   for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      if (i++ >= n) break
      g.add(cup({ ...cupOpts }).at((c - (cols - 1) / 2) * 1.05, 0.1, (r - (rows - 1) / 2) * 1.05))
   }
   return g
}

/** Glass/plastic jar or bottle via lathe, with a label band. kind: 'jar' | 'wine' | 'cosmetic' */
export function vessel({ kind = 'jar', glass = '#ffffff', label, cap = '#2b2b2b', labelH } = {}) {
   const pts = []
   if (kind === 'jar') pts.push([0, 0], [0.48, 0], [0.5, 0.06], [0.5, 1.0], [0.42, 1.08], [0.4, 1.18], [0, 1.18])
   else if (kind === 'wine') pts.push([0, 0], [0.36, 0], [0.38, 0.05], [0.38, 1.6], [0.33, 1.85], [0.16, 2.15], [0.13, 2.25], [0.13, 2.85], [0, 2.85])
   else pts.push([0, 0], [0.34, 0], [0.36, 0.05], [0.36, 1.05], [0.3, 1.12], [0.2, 1.16], [0, 1.16])
   const geo = new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), 64)
   const isWine = kind === 'wine'
   const glassMat = isWine
      ? new THREE.MeshPhysicalMaterial({ color: '#2f4a2c', roughness: 0.08, transmission: 0.55, thickness: 0.3, ior: 1.5 })
      : M.acrylic(glass, { thickness: 0.25 })
   const g = grp(mesh(geo, glassMat))
   if (kind === 'jar') g.add(mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.22, 48), M.metal(cap, 0.4)).at(0, 1.22, 0))
   if (kind === 'cosmetic') g.add(mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.32, 48), M.gloss(cap)).at(0, 1.32, 0))
   if (isWine) g.add(mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.5, 32), M.foil(cap, 0.3)).at(0, 2.62, 0))
   if (label) {
      const r = kind === 'jar' ? 0.505 : kind === 'wine' ? 0.385 : 0.365
      const lh = labelH || (kind === 'wine' ? 0.8 : kind === 'jar' ? 0.6 : 0.6)
      const y = kind === 'wine' ? 0.75 : kind === 'jar' ? 0.48 : 0.5
      g.add(mesh(new THREE.CylinderGeometry(r, r, lh, 64, 1, true, -Math.PI * 0.55, Math.PI * 1.1), label).at(0, y, 0))
   }
   return g
}

/** Roll of labels with a tail unrolled across the floor. */
export function labelRoll({ r = 0.75, w = 0.7, labelTex, liner = '#f3efe7' } = {}) {
   const g = new THREE.Group()
   const roll = new THREE.Mesh(new THREE.CylinderGeometry(r, r, w, 64), [M.print(1, { logo: false, draw: labelTex, bg: liner }), M.matte(liner), M.matte(liner)])
   roll.castShadow = roll.receiveShadow = true
   roll.rotation.z = Math.PI / 2
   roll.position.y = r
   g.add(roll)
   g.add(mesh(new THREE.CylinderGeometry(0.28, 0.28, w + 0.01, 48), M.kraft('#9c7650')).at(0, r, 0).turn(0, 0, Math.PI / 2))
   const tail = block(w, 0.006, 1.8, { top: M.print(w / 1.8, { logo: false, bg: liner, draw: labelTex }), all: M.matte(liner) }, 0.001)
   tail.position.set(0, 0.003, r + 0.9)
   g.add(tail)
   return g
}

/** Flat die-cut sticker with a white border. shape: circle | rounded | star | blob */
export function sticker({ size = 0.9, shape = 'circle', face, t = 0.01, border = '#ffffff' } = {}) {
   const s = new THREE.Shape()
   const r = size / 2
   if (shape === 'circle') s.absarc(0, 0, r, 0, Math.PI * 2)
   else if (shape === 'rounded') {
      const k = r * 0.25
      s.moveTo(-r + k, -r); s.lineTo(r - k, -r); s.quadraticCurveTo(r, -r, r, -r + k); s.lineTo(r, r - k); s.quadraticCurveTo(r, r, r - k, r); s.lineTo(-r + k, r); s.quadraticCurveTo(-r, r, -r, r - k); s.lineTo(-r, -r + k); s.quadraticCurveTo(-r, -r, -r + k, -r)
   } else if (shape === 'star') {
      for (let i = 0; i < 10; i++) {
         const a = (i / 10) * Math.PI * 2 + Math.PI / 2, rr = i % 2 ? r * 0.55 : r
         i ? s.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : s.moveTo(Math.cos(a) * rr, Math.sin(a) * rr)
      }
   } else {
      const R = rng(size * 100)
      for (let i = 0; i <= 24; i++) {
         const a = (i / 24) * Math.PI * 2, rr = r * (0.82 + R() * 0.18)
         i ? s.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : s.moveTo(Math.cos(a) * rr, Math.sin(a) * rr)
      }
   }
   const geo = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: false, curveSegments: 48 })
   normalizeUV(geo)
   const m = mesh(geo, [face, M.matte(border)])
   m.rotation.x = -Math.PI / 2
   m.position.y = 0.002
   return grp(m)
}

/** Folded napkin stack. */
export function napkins({ size = 1.2, n = 8, mat, top } = {}) {
   const g = new THREE.Group()
   for (let i = 0; i < n; i++) g.add(block(size, 0.03, size, { all: mat, top: i === n - 1 ? top : mat }, 0.01).at(Math.sin(i) * 0.01, 0.015 + i * 0.03, Math.cos(i * 2) * 0.01).turn(Math.sin(i * 3) * 0.02))
   return g
}

/* ───────── Print ───────── */

/** Triangular table tent card. */
export function tentCard({ w = 1.4, h = 1.0, face } = {}) {
   const g = new THREE.Group()
   const ang = 0.38
   for (const s of [-1, 1]) {
      const p = block(w, h, 0.012, { front: face, back: face, all: M.white() }, 0.002)
      const pv = new THREE.Group()
      pv.position.y = h * Math.cos(ang)
      p.position.y = -h / 2
      pv.add(p)
      pv.rotation.x = s * ang
      pv.rotation.y = s === 1 ? 0 : Math.PI
      g.add(pv)
   }
   return g
}

/** Presentation folder: closed folder standing with sheets peeking out. */
export function folder({ w = 2.1, h = 2.9, cover, inside, sheetsMat } = {}) {
   const g = new THREE.Group()
   g.add(block(w, 0.03, h, { top: cover, all: inside || M.white() }, 0.006).at(0, 0.025, 0))
   g.add(block(w * 0.96, 0.02, h * 0.98, sheetsMat || M.white(), 0.002).at(0.08, 0.005, -0.08).turn(0.03))
   return g
}

/** Notebook with printed cover and elastic band. */
export function notebook({ w = 1.5, h = 2.1, t = 0.14, cover, band = '#1b1b1b', pages = '#f3efe6' } = {}) {
   const g = new THREE.Group()
   g.add(block(w, t, h, { all: M.matte(pages), top: cover, bottom: cover, left: cover }, 0.02).at(0, t / 2, 0))
   g.add(block(0.04, t + 0.012, h + 0.01, M.matte(band), 0.004).at(w * 0.38, t / 2, 0))
   return g
}

/* ───────── Displays ───────── */

/** Cardboard counter display: open tray with a printed header card at the back. */
export function counterDisplay({ w = 2, d = 1.2, h = 0.45, headerH = 1.1, outside, inside, header, items } = {}) {
   const g = new THREE.Group()
   g.add(tray(w, h, d, outside, inside || outside, 0.03))
   g.add(block(w, headerH, 0.03, { front: header, all: outside }, 0.004).at(0, h + headerH / 2 - 0.05, -d / 2 + 0.015))
   if (items) g.add(items)
   return g
}

/** Free-standing floor display unit with shelves. */
export function floorDisplay({ w = 1.6, h = 4.2, d = 1.1, shelves = 4, side, header, shelfFront, items } = {}) {
   const g = new THREE.Group()
   const t = 0.04
   g.add(block(t, h, d, side, 0.006).at(-w / 2, h / 2, 0))
   g.add(block(t, h, d, side, 0.006).at(w / 2, h / 2, 0))
   g.add(block(w, h, t, side, 0.006).at(0, h / 2, -d / 2))
   g.add(block(w + t, 0.9, t, { front: header, all: side }, 0.006).at(0, h + 0.4, -d / 2 + 0.02))
   for (let i = 0; i < shelves; i++) {
      const y = 0.25 + (i * (h - 0.4)) / shelves
      g.add(block(w, t, d, M.white(), 0.004).at(0, y, 0))
      g.add(block(w, 0.28, t, { front: shelfFront || side, all: side }, 0.004).at(0, y + 0.12, d / 2))
      if (items) g.add(items(i).at(0, y + t / 2, 0))
   }
   return g
}

/** Row of small products (lip balms, bottles...) for displays. */
export function productRow({ n = 6, spacing = 0.3, make } = {}) {
   const g = new THREE.Group()
   for (let i = 0; i < n; i++) g.add(make(i).at((i - (n - 1) / 2) * spacing, 0, 0))
   return g
}

export function lipBalm(color = '#e7b8a8') {
   return grp(mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.42, 24), M.gloss(color)).at(0, 0.21, 0), mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.16, 24), M.gloss('#ffffff')).at(0, 0.5, 0))
}

/* ───────── Signage ───────── */

const fontCache = {}
async function loadFont(name = 'helvetiker_bold') {
   if (!fontCache[name]) fontCache[name] = await new FontLoader().loadAsync(`/node_modules/three/examples/fonts/${name}.typeface.json`)
   return fontCache[name]
}

/** Extruded 3D letters (centered, sitting on y=0 or mounted on a wall at z=0). */
export async function letters3d({ text = 'JUNO', size = 1, depth = 0.18, face, side, font = 'helvetiker_bold', bevel = 0.012 } = {}) {
   const f = await loadFont(font)
   const geo = new TextGeometry(text, { font: f, size, depth, curveSegments: 10, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel * 0.7, bevelSegments: 3 })
   geo.computeBoundingBox()
   const b = geo.boundingBox
   geo.translate(-(b.max.x + b.min.x) / 2, -b.min.y, 0)
   const m = mesh(geo, [face, side || face])
   return grp(m)
}

/** Wall: painted plaster / concrete / wood slats. */
export function wallMaterial(kind = 'plaster', tone = '#e9e4dc') {
   if (kind === 'wood') return M.wood()
   const tex = canvasTexture(1024, 512, (ctx, w, h) => {
      ctx.fillStyle = tone
      ctx.fillRect(0, 0, w, h)
      const r = rng(kind === 'concrete' ? 21 : 5)
      for (let i = 0; i < 18000; i++) {
         ctx.fillStyle = r() > 0.5 ? `rgba(255,255,255,${0.04 * r()})` : `rgba(0,0,0,${(kind === 'concrete' ? 0.07 : 0.025) * r()})`
         ctx.fillRect(r() * w, r() * h, 2, 2)
      }
   }, { repeat: [6, 3] })
   return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 })
}

/** Roll-up / pull-up banner stand. kind: rollup | x | l */
export function bannerStand({ kind = 'rollup', w = 0.85, h = 2.0, graphic } = {}) {
   const g = new THREE.Group()
   const alu = M.metal('#c9cdd2', 0.3)
   const H = h * 2
   const W = w * 2
   if (kind === 'rollup') {
      g.add(block(W + 0.12, 0.16, 0.36, alu, 0.05).at(0, 0.08, 0))
      g.add(block(W, H, 0.012, { front: graphic, all: M.white() }, 0.002).at(0, 0.16 + H / 2, 0.02))
      g.add(block(W + 0.04, 0.05, 0.05, alu, 0.01).at(0, 0.16 + H, 0.02))
   } else if (kind === 'x') {
      g.add(block(W, H, 0.01, { front: graphic, all: M.white() }, 0.002).at(0, 0.12 + H / 2, 0.06))
      for (const s of [-1, 1]) {
         const rod = mesh(new THREE.CylinderGeometry(0.018, 0.018, Math.hypot(W, H) * 1.02, 12), alu)
         rod.position.set(0, 0.12 + H / 2, 0)
         rod.rotation.z = s * Math.atan2(W, H)
         g.add(rod)
      }
      for (const s of [-1, 1]) g.add(mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.9, 12), alu).at(s * 0.35, 0.18, -0.25).turn(0, s * 0.5, 0.0).turn(0, 0, 0))
   } else {
      g.add(block(W, H, 0.012, { front: graphic, all: M.white() }, 0.002).at(0, 0.1 + H / 2, 0))
      g.add(mesh(new THREE.CylinderGeometry(0.025, 0.025, H, 12), alu).at(0, 0.1 + H / 2, -0.35).turn(0, 0, 0))
      g.add(block(W * 0.6, 0.04, 0.8, alu, 0.01).at(0, 0.02, -0.1))
   }
   return g
}

/** Feather flag on a pole with a cross base. */
export function featherFlag({ h = 4.6, w = 1.1, graphic } = {}) {
   const s = new THREE.Shape()
   s.moveTo(0, 0)
   s.lineTo(0, h)
   s.quadraticCurveTo(w * 1.1, h * 0.98, w, h * 0.72)
   s.quadraticCurveTo(w * 0.95, h * 0.3, w * 0.75, 0.1)
   s.lineTo(0, 0)
   const geo = new THREE.ExtrudeGeometry(s, { depth: 0.01, bevelEnabled: false, curveSegments: 40 })
   normalizeUV(geo)
   const flag = mesh(geo, [graphic, graphic])
   flag.position.set(0.03, 0.5, 0)
   const g = grp(flag, mesh(new THREE.CylinderGeometry(0.025, 0.025, h + 0.5, 12), M.metal('#2a2a2a', 0.4)).at(0, (h + 0.5) / 2, 0))
   for (const a of [0, Math.PI / 2]) g.add(block(1.1, 0.06, 0.08, M.metal('#2a2a2a', 0.4), 0.01).at(0, 0.03, 0).turn(a))
   return g
}

/** Draped table with a fitted printed cover. */
export function tableCover({ w = 3, d = 1.4, h = 1.45, front, top, sides } = {}) {
   return grp(block(w, h, d, { front, top: top || sides, all: sides }, 0.03).at(0, h / 2, 0))
}

/** Printed wall panel / backdrop. */
export function panel({ w = 4, h = 2.5, t = 0.04, face, edge, standoffs = false, frame = null } = {}) {
   const g = grp(block(w, h, t, { front: face, all: edge || M.white() }, 0.004).at(0, h / 2, t / 2))
   if (standoffs) for (const [x, y] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) g.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 24), M.metal('#d9dcdf', 0.2)).at(x * (w / 2 - 0.18), h / 2 + y * (h / 2 - 0.18), t + 0.04).turn(0, Math.PI / 2, Math.PI / 2))
   if (frame) {
      const fm = M.metal(frame, 0.35)
      g.add(block(w + 0.1, 0.06, t + 0.06, fm, 0.01).at(0, h + 0.03, t / 2), block(w + 0.1, 0.06, t + 0.06, fm, 0.01).at(0, -0.03, t / 2))
      g.add(block(0.06, h, t + 0.06, fm, 0.01).at(-w / 2 - 0.02, h / 2, t / 2), block(0.06, h, t + 0.06, fm, 0.01).at(w / 2 + 0.02, h / 2, t / 2))
   }
   return g
}

/** Illuminated light box sign (back-lit). */
export function lightBox({ w = 3, h = 1, d = 0.25, face, frame = '#2a2a2a', glow = 1.6 } = {}) {
   return grp(
      block(w, h, d, M.metal(frame, 0.4), 0.02).at(0, h / 2, d / 2),
      mesh(new THREE.PlaneGeometry(w - 0.12, h - 0.12), M.screen(face, glow)).at(0, h / 2, d + 0.002)
   )
}

/** LED screen with bezel; tex is a CanvasTexture of the content. */
export function screen({ w = 3.2, h = 1.8, tex, bezel = '#0b0b0c', glow = 1.25, stand = null, pixel = true } = {}) {
   const g = grp(block(w + 0.08, h + 0.08, 0.1, M.matte(bezel), 0.02).at(0, h / 2, 0.05))
   const face = mesh(new THREE.PlaneGeometry(w, h), M.screen(tex, glow))
   face.position.set(0, h / 2, 0.101)
   g.add(face)
   if (stand === 'totem') g.add(block(w * 0.5, 0.08, 0.6, M.matte(bezel), 0.02).at(0, -0.3, 0.05), block(0.12, 0.3, 0.12, M.matte(bezel), 0.02).at(0, -0.15, 0.05))
   return g
}

/** Screen content: gradient + headline + shapes. */
export function screenContent(aspect, { brand = 'nova', headline = 'NEW SEASON', sub = 'Now in store', colors = ['#1d4ed8', '#9333ea'], pixel = false } = {}) {
   const b = BRANDS[brand]
   return canvasTexture(1024, Math.round(1024 / aspect), (ctx, w, h) => {
      const gr = ctx.createLinearGradient(0, 0, w, h)
      gr.addColorStop(0, colors[0])
      gr.addColorStop(1, colors[1])
      ctx.fillStyle = gr
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = 'rgba(255,255,255,0.12)'
      ctx.beginPath(); ctx.arc(w * 0.82, h * 0.3, h * 0.5, 0, 7); ctx.fill()
      ctx.beginPath(); ctx.arc(w * 0.1, h * 1.0, h * 0.45, 0, 7); ctx.fill()
      ctx.fillStyle = '#fff'
      ctx.textAlign = 'left'
      ctx.font = `900 ${Math.min(h * 0.2, w * 0.1)}px Arial`
      ctx.fillText(headline, w * 0.07, h * 0.5)
      ctx.font = `400 ${Math.min(h * 0.08, w * 0.04)}px Arial`
      ctx.fillText(sub, w * 0.07, h * 0.66)
      drawLogo(ctx, { ...b, ink: '#ffffff' }, w * 0.82, h * 0.82, Math.min(h, w) * 0.07, { emblem: false, tag: false })
      if (pixel) {
         ctx.fillStyle = 'rgba(0,0,0,0.35)'
         const s = Math.max(4, Math.round(w / 220))
         for (let x = 0; x < w; x += s) ctx.fillRect(x, 0, 1, h)
         for (let y = 0; y < h; y += s) ctx.fillRect(0, y, w, 1)
      }
   })
}

export { BRANDS, printFace }
