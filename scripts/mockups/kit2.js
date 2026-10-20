// More builders: promo products, gifts, prints, food items, racks, neon.
import * as THREE from 'three'

import { canvasTexture, printFace, rng } from './art.js'
import { M, block, normalizeUV, tray } from './studio.js'
import { letters3d } from './kit.js'

export const mesh = (geo, mat, { cast = true } = {}) => {
   const m = new THREE.Mesh(geo, mat)
   m.castShadow = cast
   m.receiveShadow = true
   return m
}
export const grp = (...c) => {
   const g = new THREE.Group()
   for (const x of c) if (x) g.add(x)
   return g
}
const P = (aspect, opts, extra) => M.print(aspect, opts, extra)

/* ───────── Promotional products ───────── */

export function pen({ body = '#1f3b57', trim = '#d9d9d9', len = 1.4, print } = {}) {
   const g = new THREE.Group()
   const r = 0.045
   const barrel = mesh(new THREE.CylinderGeometry(r, r, len * 0.62, 32), print || M.gloss(body))
   barrel.rotation.y = Math.PI
   g.add(barrel.at(0, 0, 0))
   g.add(mesh(new THREE.CylinderGeometry(r * 1.02, r * 1.02, len * 0.3, 32), M.gloss(body)).at(0, len * 0.46, 0))
   g.add(mesh(new THREE.CylinderGeometry(r * 0.9, r * 0.3, len * 0.1, 32), M.metal(trim, 0.2)).at(0, -len * 0.36, 0))
   g.add(mesh(new THREE.CylinderGeometry(r * 1.05, r * 1.05, 0.03, 32), M.metal(trim, 0.2)).at(0, len * 0.3, 0))
   g.add(block(0.02, len * 0.32, 0.03, M.metal(trim, 0.2), 0.008).at(0, len * 0.44, r + 0.012))
   const holder = new THREE.Group()
   holder.add(g)
   g.rotation.z = Math.PI / 2
   holder.position.y = r
   return holder
}

export function mug({ color = '#ffffff', print, r = 0.42, h = 0.95 } = {}) {
   const g = new THREE.Group()
   const body = mesh(new THREE.CylinderGeometry(r, r * 0.97, h, 64, 1, true), print || M.gloss(color))
   body.rotation.y = Math.PI
   g.add(body.at(0, h / 2, 0))
   g.add(mesh(new THREE.CylinderGeometry(r * 0.94, r * 0.94, h * 0.96, 64, 1, true), M.gloss(color)).at(0, h / 2 + 0.01, 0))
   g.add(mesh(new THREE.CircleGeometry(r * 0.94, 48), M.matte('#3b2416')).at(0, h * 0.88, 0).turn(0, -Math.PI / 2))
   g.add(mesh(new THREE.TorusGeometry(r * 0.98, 0.012, 8, 64), M.gloss(color)).at(0, h, 0).turn(0, Math.PI / 2))
   g.add(mesh(new THREE.CircleGeometry(r * 0.97, 48), M.gloss(color)).at(0, 0.004, 0).turn(0, -Math.PI / 2))
   const handle = mesh(new THREE.TorusGeometry(h * 0.26, 0.05, 16, 40, Math.PI * 1.25), M.gloss(color))
   handle.position.set(-r - h * 0.12, h * 0.5, 0)
   handle.rotation.z = Math.PI / 2 + Math.PI * 0.13
   handle.scale.set(1, 1.15, 1)
   g.add(handle)
   return g
}

export function bottle({ color = '#1f3b57', print, r = 0.3, h = 1.9, cap = '#1b1b1b' } = {}) {
   const g = new THREE.Group()
   const body = mesh(new THREE.CylinderGeometry(r, r, h * 0.82, 64), [print || M.metal(color, 0.35), M.metal(color, 0.35), M.metal(color, 0.35)])
   body.rotation.y = Math.PI
   g.add(body.at(0, h * 0.41, 0))
   g.add(mesh(new THREE.CylinderGeometry(r * 0.72, r, h * 0.08, 64), M.metal(color, 0.35)).at(0, h * 0.86, 0))
   g.add(mesh(new THREE.CylinderGeometry(r * 0.74, r * 0.74, h * 0.14, 48), M.gloss(cap)).at(0, h * 0.97, 0))
   g.add(mesh(new THREE.TorusGeometry(r * 0.32, 0.03, 10, 32), M.gloss(cap)).at(0, h * 1.07, 0))
   return g
}

export function keychain({ shape = 'round', face, ring = '#cfd2d6' } = {}) {
   const g = new THREE.Group()
   const s = new THREE.Shape()
   if (shape === 'round') s.absarc(0, 0, 0.42, 0, Math.PI * 2)
   else {
      const w = 0.45, h = 0.7, k = 0.12
      s.moveTo(-w + k, -h); s.lineTo(w - k, -h); s.quadraticCurveTo(w, -h, w, -h + k); s.lineTo(w, h - k); s.quadraticCurveTo(w, h, w - k, h); s.lineTo(-w + k, h); s.quadraticCurveTo(-w, h, -w, h - k); s.lineTo(-w, -h + k); s.quadraticCurveTo(-w, -h, -w + k, -h)
   }
   const geo = new THREE.ExtrudeGeometry(s, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 3 })
   normalizeUV(geo)
   const tag = mesh(geo, [face, M.metal('#cfd2d6', 0.3)])
   tag.rotation.x = -Math.PI / 2
   tag.position.y = 0.04
   g.add(tag)
   const ringM = mesh(new THREE.TorusGeometry(0.22, 0.02, 12, 48), M.metal(ring, 0.2))
   ringM.rotation.x = -Math.PI / 2
   ringM.position.set(0, 0.03, -(shape === 'round' ? 0.62 : 0.92))
   g.add(ringM)
   return g
}

export function lanyard({ color = '#1f3b57', strap, card } = {}) {
   const g = new THREE.Group()
   const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.35, 0.02, 0.6), new THREE.Vector3(-0.9, 0.02, -0.6), new THREE.Vector3(0, 0.02, -1.6), new THREE.Vector3(0.9, 0.02, -0.6), new THREE.Vector3(0.35, 0.02, 0.6)])
   const geo = new THREE.TubeGeometry(curve, 120, 0.09, 4, false)
   const s = mesh(geo, strap || M.matte(color))
   s.scale.y = 0.12
   g.add(s)
   g.add(block(0.14, 0.04, 0.22, M.metal('#cfd2d6', 0.25), 0.02).at(0, 0.03, 0.75))
   if (card) g.add(block(0.9, 0.02, 1.35, { top: card, all: M.white() }, 0.04).at(0, 0.02, 1.55))
   return g
}

export function powerBank({ color = '#11151c', face } = {}) {
   return grp(block(0.75, 0.16, 1.45, { top: face || M.softTouch(color), all: M.softTouch(color) }, 0.07).at(0, 0.08, 0), block(0.2, 0.05, 0.02, M.matte('#050505'), 0.01).at(0, 0.09, 0.73))
}

export function usbDrive({ color = '#1f3b57', face } = {}) {
   return grp(block(0.45, 0.12, 1.0, { top: face || M.gloss(color), all: M.gloss(color) }, 0.05).at(0, 0.06, 0), block(0.28, 0.06, 0.28, M.metal('#d9d9d9', 0.2), 0.005).at(0, 0.06, 0.62))
}

export function trophy({ kind = 'crystal', face, base = '#16130f' } = {}) {
   const g = new THREE.Group()
   g.add(block(1.0, 0.3, 0.55, M.softTouch(base), 0.03).at(0, 0.15, 0))
   if (kind === 'star') {
      const s = new THREE.Shape()
      for (let i = 0; i < 10; i++) {
         const a = (i / 10) * Math.PI * 2 + Math.PI / 2, rr = i % 2 ? 0.28 : 0.6
         i ? s.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : s.moveTo(Math.cos(a) * rr, Math.sin(a) * rr)
      }
      const geo = new THREE.ExtrudeGeometry(s, { depth: 0.18, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03 })
      g.add(mesh(geo, M.acrylic('#ffffff', { thickness: 0.2 })).at(0, 1.05, -0.09))
   } else {
      const panel = mesh(new THREE.BoxGeometry(0.8, 1.3, 0.16), M.acrylic('#ffffff', { thickness: 0.18 }))
      g.add(panel.at(0, 0.95, 0))
      if (face) g.add(mesh(new THREE.PlaneGeometry(0.7, 1.1), new THREE.MeshStandardMaterial({ map: face.map, transparent: true, roughness: 0.4 })).at(0, 0.95, 0.081))
   }
   return g
}

/** Award shield: wooden board with a metal or acrylic plaque. */
export function shield({ wood = true, face } = {}) {
   const s = new THREE.Shape()
   s.moveTo(-0.7, 0.9); s.lineTo(0.7, 0.9); s.lineTo(0.7, -0.2); s.quadraticCurveTo(0.6, -0.8, 0, -1.05); s.quadraticCurveTo(-0.6, -0.8, -0.7, -0.2); s.lineTo(-0.7, 0.9)
   const geo = new THREE.ExtrudeGeometry(s, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 })
   normalizeUV(geo)
   const board = mesh(geo, wood ? M.wood() : M.acrylic('#ffffff', { thickness: 0.15 }))
   const g = grp(board.at(0, 1.05, 0))
   g.add(block(1.0, 0.75, 0.02, face, 0.01).at(0, 1.2, 0.16))
   g.add(block(0.9, 0.08, 0.6, M.wood(), 0.02).at(0, 0.04, 0.05))
   return g
}

export function stamp({ color = '#11151c', face } = {}) {
   const g = new THREE.Group()
   g.add(block(0.75, 0.35, 0.5, M.gloss(color), 0.06).at(0, 0.18, 0))
   g.add(block(0.6, 0.55, 0.38, M.frosted('#dfe9f2'), 0.05).at(0, 0.62, 0))
   g.add(block(0.65, 0.1, 0.42, { top: face || M.gloss(color), all: M.gloss(color) }, 0.04).at(0, 0.95, 0))
   return g
}

/* ───────── Pouches, tags, ribbon, wrap ───────── */

/** Stand-up pouch: puffed front/back with a gusset bottom and zip line. */
export function pouch({ w = 1.3, h = 1.8, d = 0.45, face, side, zip = true } = {}) {
   const geo = new THREE.BoxGeometry(w, h, d, 20, 30, 6)
   const p = geo.attributes.position
   for (let i = 0; i < p.count; i++) {
      const y = p.getY(i) / (h / 2), x = p.getX(i) / (w / 2)
      const taper = 0.35 + 0.65 * Math.pow(Math.min(1, Math.max(0, (1 - y) / 2)), 0.6) // flat at the top seal, full at the gusset
      const bulge = Math.max(0, 1 - x * x) * 0.5 + 0.5
      p.setZ(i, p.getZ(i) * taper * bulge)
   }
   geo.computeVertexNormals()
   const m = mesh(geo, [side || face, side || face, side || face, side || face, face, face])
   m.position.y = h / 2
   const g = grp(m)
   if (zip) g.add(block(w * 0.98, 0.025, 0.06, M.matte('#cbc3b6'), 0.005).at(0, h * 0.86, 0))
   return g
}

export function hangTag({ w = 0.6, h = 1.0, face, string = '#c9a227' } = {}) {
   const s = new THREE.Shape()
   const c = w * 0.25
   s.moveTo(-w / 2, -h / 2); s.lineTo(w / 2, -h / 2); s.lineTo(w / 2, h / 2 - c); s.lineTo(w / 2 - c, h / 2); s.lineTo(-w / 2 + c, h / 2); s.lineTo(-w / 2, h / 2 - c); s.lineTo(-w / 2, -h / 2)
   const hole = new THREE.Path()
   hole.absarc(0, h / 2 - c * 0.9, w * 0.06, 0, Math.PI * 2, true)
   s.holes.push(hole)
   const geo = new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: false })
   normalizeUV(geo)
   const tag = mesh(geo, [face, face])
   tag.rotation.x = -Math.PI / 2
   tag.position.y = 0.01
   const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.015, -(h / 2 - c * 0.9)), new THREE.Vector3(0.12, 0.015, -h * 0.75), new THREE.Vector3(-0.1, 0.015, -h * 1.05), new THREE.Vector3(0.2, 0.015, -h * 1.3)])
   return grp(tag, mesh(new THREE.TubeGeometry(curve, 40, 0.012, 6, false), M.matte(string)))
}

export function ribbonSpool({ color = '#c4558a', face, w = 0.5 } = {}) {
   const g = new THREE.Group()
   const roll = mesh(new THREE.CylinderGeometry(0.62, 0.62, w, 64), [face || M.gloss(color), M.gloss(color), M.gloss(color)])
   roll.rotation.z = Math.PI / 2
   roll.position.y = 0.66
   g.add(roll)
   for (const x of [-w / 2 - 0.02, w / 2 + 0.02]) g.add(mesh(new THREE.CylinderGeometry(0.66, 0.66, 0.03, 64), M.white()).at(x, 0.66, 0).turn(0, 0, Math.PI / 2))
   g.add(block(w * 0.98, 0.006, 1.8, { top: face || M.gloss(color), all: M.gloss(color) }, 0.001).at(0, 0.004, 1.2))
   return g
}

export function paperRoll({ r = 0.32, len = 2.6, face } = {}) {
   const g = new THREE.Group()
   const roll = mesh(new THREE.CylinderGeometry(r, r, len, 64), [face, M.kraft('#9c7650'), M.kraft('#9c7650')])
   roll.rotation.z = Math.PI / 2
   roll.position.y = r
   g.add(roll)
   g.add(block(len * 0.98, 0.006, 1.6, { top: face, all: face }, 0.001).at(0, 0.004, r + 0.8))
   return g
}

/* ───────── Prints ───────── */

/** Folding brochure standing on its folds. panels: 2 (bi-fold) or 3 (tri-fold). */
export function foldedBrochure({ panels = 3, w = 0.9, h = 1.9, faces } = {}) {
   const g = new THREE.Group()
   const ang = panels === 3 ? 0.55 : 0.5
   for (let i = 0; i < panels; i++) {
      const pv = new THREE.Group()
      pv.add(block(w, h, 0.01, { front: faces[i], back: faces[i], all: M.white() }, 0.002).at(w / 2, h / 2, 0))
      const offset = i - (panels - 1) / 2
      pv.position.x = offset * w * Math.cos(ang) - w * 0.45
      pv.position.z = (i % 2) * w * Math.sin(ang) * 0.9
      pv.rotation.y = i % 2 ? ang : -ang
      g.add(pv)
   }
   return g
}

/** Booklet / catalog: page block with cover. */
export function booklet({ w = 1.5, h = 2.1, t = 0.1, cover, back } = {}) {
   return grp(block(w, t, h, { top: cover, bottom: back || cover, left: M.matte('#e9e4da'), right: M.white(), front: M.white(), back: M.white() }, 0.01).at(0, t / 2, 0))
}

/** Framed / mounted poster on a wall. kind: frame | canvas | foam | plain */
export function wallPoster({ w = 1.8, h = 2.4, face, kind = 'frame', frame = '#1b1b1b' } = {}) {
   const g = new THREE.Group()
   const t = kind === 'canvas' ? 0.12 : kind === 'foam' ? 0.05 : 0.01
   g.add(block(w, h, t, { front: face, all: kind === 'canvas' ? face : M.white() }, 0.004).at(0, h / 2, t / 2 + 0.02))
   if (kind === 'frame') {
      const fm = M.matte(frame)
      g.add(block(w + 0.1, 0.06, 0.06, fm, 0.01).at(0, h + 0.02, 0.05), block(w + 0.1, 0.06, 0.06, fm, 0.01).at(0, -0.02, 0.05))
      g.add(block(0.06, h + 0.1, 0.06, fm, 0.01).at(-w / 2 - 0.02, h / 2, 0.05), block(0.06, h + 0.1, 0.06, fm, 0.01).at(w / 2 + 0.02, h / 2, 0.05))
   }
   return g
}

/** Poster on an easel (foam board). */
export function easel({ w = 1.6, h = 2.1, face } = {}) {
   const g = new THREE.Group()
   const wood = M.wood()
   g.add(block(w, h, 0.05, { front: face, all: M.white() }, 0.006).at(0, 1.2 + h / 2, 0.05).turn(0, -0.12))
   for (const x of [-w * 0.42, w * 0.42]) g.add(block(0.06, 3.6, 0.06, wood, 0.01).at(x, 1.75, 0).turn(0, -0.12))
   g.add(block(0.06, 3.4, 0.06, wood, 0.01).at(0, 1.6, -0.55).turn(0, 0.25))
   g.add(block(w + 0.2, 0.08, 0.14, wood, 0.01).at(0, 1.18, 0.2))
   return g
}

/* ───────── Food items ───────── */

export function pizza(r = 1.0) {
   const g = new THREE.Group()
   g.add(mesh(new THREE.CylinderGeometry(r, r, 0.08, 64), M.matte('#d9a35a')).at(0, 0.04, 0))
   g.add(mesh(new THREE.CylinderGeometry(r * 0.9, r * 0.9, 0.02, 64), M.matte('#c8452e')).at(0, 0.09, 0))
   g.add(mesh(new THREE.CylinderGeometry(r * 0.86, r * 0.86, 0.02, 64), M.matte('#f2d27a')).at(0, 0.1, 0))
   const R = rng(11)
   for (let i = 0; i < 14; i++) {
      const a = R() * Math.PI * 2, d = Math.sqrt(R()) * r * 0.75
      g.add(mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.02, 24), M.matte('#a8322a')).at(Math.cos(a) * d, 0.12, Math.sin(a) * d))
   }
   return g
}

export function donut(color = '#e7b8a8') {
   return grp(mesh(new THREE.TorusGeometry(0.2, 0.1, 16, 32), M.matte('#d9a35a')).turn(0, Math.PI / 2).at(0, 0.1, 0), mesh(new THREE.TorusGeometry(0.2, 0.085, 16, 32, Math.PI * 2), M.gloss(color)).turn(0, Math.PI / 2).at(0, 0.14, 0))
}

export function fries() {
   const g = new THREE.Group()
   const R = rng(5)
   for (let i = 0; i < 22; i++) {
      const f = block(0.05, 0.5 + R() * 0.3, 0.05, M.matte('#f2c14e'), 0.01)
      f.position.set((R() - 0.5) * 0.4, 0.55, (R() - 0.5) * 0.25)
      f.rotation.set((R() - 0.5) * 0.4, 0, (R() - 0.5) * 0.4)
      g.add(f)
   }
   return g
}

export function sushiPiece(top = '#f08a5d') {
   return grp(block(0.28, 0.14, 0.16, M.matte('#f6f2ea'), 0.05).at(0, 0.07, 0), block(0.3, 0.06, 0.17, M.matte(top), 0.03).at(0, 0.16, 0))
}

/* ───────── Racks & shelving ───────── */

/** Shelving unit with product rows. opts.header = material for a (lit) header panel. */
export function shelving({ w = 2.4, h = 3.6, d = 0.9, shelves = 4, side, back, header, lit = false, shelf, items } = {}) {
   const g = new THREE.Group()
   const t = 0.05
   g.add(block(t, h, d, side, 0.01).at(-w / 2, h / 2, 0), block(t, h, d, side, 0.01).at(w / 2, h / 2, 0))
   g.add(block(w, h, t, back || side, 0.01).at(0, h / 2, -d / 2))
   if (header) g.add(lit ? grp(block(w + 0.1, 0.6, 0.15, M.matte('#1b1b1b'), 0.02), mesh(new THREE.PlaneGeometry(w, 0.5), M.screen(header.map, 1.3)).at(0, 0, 0.08)).at(0, h + 0.32, -d / 2 + 0.1) : block(w + 0.1, 0.6, 0.06, { front: header, all: side }, 0.01).at(0, h + 0.32, -d / 2 + 0.05))
   for (let i = 0; i < shelves; i++) {
      const y = 0.25 + (i * (h - 0.5)) / Math.max(1, shelves - 1) * (shelves > 1 ? 0.92 : 0)
      g.add(block(w, t, d, shelf || M.white(), 0.005).at(0, y, 0))
      if (items) g.add(items(i).at(0, y + t / 2, 0.05))
   }
   return g
}

export function productPacks({ n = 5, spacing = 0.42, w = 0.32, h = 0.5, d = 0.22, faces } = {}) {
   const g = new THREE.Group()
   for (let i = 0; i < n; i++) g.add(block(w, h, d, { all: faces[i % faces.length] }, 0.01).at((i - (n - 1) / 2) * spacing, h / 2, 0))
   return g
}

export function smallBottles({ n = 6, spacing = 0.3, colors = ['#e7b8a8', '#c4558a', '#f0d2b8'], cap = '#1b1b1b' } = {}) {
   const g = new THREE.Group()
   for (let i = 0; i < n; i++) {
      const b = grp(mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.4, 24), M.gloss(colors[i % colors.length])).at(0, 0.2, 0), mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.12, 24), M.gloss(cap)).at(0, 0.46, 0))
      g.add(b.at((i - (n - 1) / 2) * spacing, 0, 0))
   }
   return g
}

/** Pegboard / slatwall panel with hanging packs. */
export function hangWall({ w = 3, h = 2.4, kind = 'peg', panel = '#efe9df', items = [] } = {}) {
   const tex = canvasTexture(1024, 820, (c, W, H) => {
      c.fillStyle = panel; c.fillRect(0, 0, W, H)
      if (kind === 'peg') {
         c.fillStyle = 'rgba(0,0,0,0.35)'
         for (let y = 20; y < H; y += 34) for (let x = 20; x < W; x += 34) { c.beginPath(); c.arc(x, y, 4, 0, 7); c.fill() }
      } else {
         for (let y = 30; y < H; y += 60) { c.fillStyle = 'rgba(0,0,0,0.22)'; c.fillRect(0, y, W, 8); c.fillStyle = 'rgba(255,255,255,0.4)'; c.fillRect(0, y + 8, W, 2) }
      }
   })
   const g = grp(block(w, h, 0.06, { front: new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }), all: M.matte(panel) }, 0.01).at(0, h / 2 + 0.3, 0.03))
   items.forEach(([x, y, mat], i) => {
      g.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.35, 8), M.metal('#cfd2d6', 0.25)).at(x, y + 0.42, 0.22).turn(0, Math.PI / 2))
      g.add(block(0.42, 0.62, 0.05, { front: mat, all: M.white() }, 0.01).at(x, y, 0.3))
   })
   return g
}

/* ───────── Neon ───────── */

/** Neon sign: glowing script on a clear acrylic panel. */
export async function neonSign({ text = 'open', color = '#ff4fa3', font = 'gentilis_bold', size = 0.75, panel = true, backer = M.acrylic('#ffffff', { thickness: 0.04 }) } = {}) {
   const g = new THREE.Group()
   const letters = await letters3d({ text, font, size, depth: 0.04, bevel: 0.03, face: M.glow(new THREE.Color(color).lerp(new THREE.Color('#ffffff'), 0.35), 1.3), side: M.glow(color, 1.0) })
   letters.position.set(0, 0, 0.08)
   g.add(letters)
   letters.updateMatrixWorld(true)
   const box = new THREE.Box3().setFromObject(letters)
   const s = box.getSize(new THREE.Vector3())
   if (panel) g.add(block(s.x + 0.5, s.y + 0.5, 0.04, backer, 0.03).at(0, s.y / 2, 0.02))
   // soft light the sign casts on the wall
   const light = new THREE.PointLight(color, 6, 3.5, 1.6)
   light.position.set(0, s.y / 2, 0.6)
   g.add(light)
   return g
}

export { P }
