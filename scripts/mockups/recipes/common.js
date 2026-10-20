// Shared props and print helpers for recipes.
import * as THREE from 'three'
import { BRANDS, printFace } from '../art.js'
import { M, block } from '../studio.js'

export const P = (aspect, opts, extra) => M.print(aspect, opts, extra)

const mesh = (geo, mat) => {
   const m = new THREE.Mesh(geo, mat)
   m.castShadow = m.receiveShadow = true
   return m
}
const grp = (...c) => {
   const g = new THREE.Group()
   for (const x of c) if (x) g.add(x)
   return g
}

/** Carton with an open tuck flap at the top (hinged at the back). */
export function tuckCarton({ w = 1, h = 1.6, d = 0.6, faces, flapMat, open = 0 } = {}) {
   const g = grp(block(w, h, d, faces, 0.006).at(0, h / 2, 0))
   const flap = flapMat || faces.top || faces.all
   if (open) {
      const pv = new THREE.Group()
      pv.position.set(0, h, -d / 2)
      pv.add(block(w, 0.01, d, flap, 0.002).at(0, 0, d / 2))
      pv.add(block(w * 0.96, 0.01, d * 0.35, flap, 0.002).at(0, -0.02, d + d * 0.17).turn(0, -1.4))
      pv.rotation.x = -THREE.MathUtils.degToRad(open)
      g.add(pv)
   }
   return g
}

export function soapBar(color = '#e9dcc6') {
   return grp(block(0.85, 0.32, 0.55, M.matte(color), 0.12).at(0, 0.16, 0))
}

export function candleJar(wax = '#f1e7d6', label) {
   const g = grp(mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.9, 48), M.acrylic('#ffffff', { thickness: 0.2 })).at(0, 0.45, 0))
   g.add(mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.62, 48), M.matte(wax)).at(0, 0.33, 0))
   g.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.1, 8), M.matte('#222')).at(0, 0.68, 0))
   if (label) g.add(mesh(new THREE.CylinderGeometry(0.425, 0.425, 0.36, 48, 1, true, -1.2, 2.4), label).at(0, 0.45, 0))
   return g
}

export function perfumeBottle(liquid = '#e8c9a0', cap = '#c9a227') {
   return grp(
      mesh(new THREE.BoxGeometry(0.7, 0.85, 0.32), new THREE.MeshPhysicalMaterial({ color: liquid, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.05, transparent: true, opacity: 0.88 })).at(0, 0.425, 0),
      mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.12, 24), M.metal('#d9d9d9', 0.2)).at(0, 0.91, 0),
      block(0.3, 0.26, 0.3, M.foil(cap, 0.25), 0.03).at(0, 1.1, 0)
   )
}

export function dropperBottle(glass = '#c9895a', cap = '#1b1b1b') {
   return grp(
      mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.7, 40), M.acrylic(glass, { thickness: 0.3 })).at(0, 0.35, 0),
      mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.18, 32), M.gloss(cap)).at(0, 0.79, 0),
      mesh(new THREE.SphereGeometry(0.1, 24, 16), M.gloss(cap)).at(0, 0.95, 0)
   )
}

export function palette(colors = ['#e7b8a8', '#c98a7a', '#a3615a', '#f0d2b8', '#8a4f45', '#d9a08b']) {
   const g = grp(block(1.5, 0.08, 1.0, M.softTouch('#1b1a1c'), 0.02).at(0, 0.04, 0))
   colors.forEach((c, i) => g.add(block(0.4, 0.04, 0.36, M.matte(c), 0.02).at(-0.48 + (i % 3) * 0.48, 0.09, -0.2 + Math.floor(i / 3) * 0.42)))
   return g
}

/** Simple face artwork drawers */
export const draw = {
   rx: (title, sub, color) => (ctx, w, h) => {
      ctx.fillStyle = color
      ctx.fillRect(0, h * 0.62, w, h * 0.12)
      ctx.fillStyle = '#1b2a3a'
      ctx.textAlign = 'center'
      ctx.font = `900 ${Math.min(w, h) * 0.13}px Arial`
      ctx.fillText(title, w / 2, h * 0.42)
      ctx.font = `400 ${Math.min(w, h) * 0.06}px Arial`
      ctx.fillText(sub, w / 2, h * 0.52)
      ctx.fillStyle = '#fff'
      ctx.font = `700 ${Math.min(w, h) * 0.055}px Arial`
      ctx.fillText('60 TABLETS', w / 2, h * 0.695)
   },
   window: (fill = '#f6e7c8', items = ['#e7b8a8', '#f2c14e', '#b9d7a3', '#c4558a']) => (ctx, w, h) => {
      const x = w * 0.18, y = h * 0.22, ww = w * 0.64, hh = h * 0.42
      ctx.fillStyle = fill
      ctx.fillRect(x, y, ww, hh)
      items.forEach((c, i) => {
         ctx.fillStyle = c
         ctx.beginPath()
         ctx.arc(x + ww * (0.2 + 0.2 * i), y + hh * 0.55, hh * 0.24, 0, 7)
         ctx.fill()
      })
      const gl = ctx.createLinearGradient(x, y, x + ww, y + hh)
      gl.addColorStop(0, 'rgba(255,255,255,0.45)')
      gl.addColorStop(0.4, 'rgba(255,255,255,0)')
      ctx.fillStyle = gl
      ctx.fillRect(x, y, ww, hh)
      ctx.strokeStyle = 'rgba(0,0,0,0.25)'
      ctx.lineWidth = 3
      ctx.strokeRect(x, y, ww, hh)
   },
   lock: () => (ctx, w, h) => {
      ctx.strokeStyle = 'rgba(60,40,20,0.55)'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(0, h / 2); ctx.lineTo(w * 0.35, h * 0.2); ctx.lineTo(w * 0.65, h * 0.2); ctx.lineTo(w, h / 2)
      ctx.moveTo(0, h / 2); ctx.lineTo(w * 0.35, h * 0.8); ctx.lineTo(w * 0.65, h * 0.8); ctx.lineTo(w, h / 2)
      ctx.stroke()
   },
   dieline: () => (ctx, w, h) => {
      ctx.strokeStyle = '#d42f25'
      ctx.lineWidth = 4
      const u = w / 6
      ctx.strokeRect(u, h * 0.3, u * 4, h * 0.4)
      ctx.setLineDash([16, 12])
      ctx.strokeStyle = '#1d4ed8'
      for (let i = 2; i < 5; i++) { ctx.beginPath(); ctx.moveTo(u * i, h * 0.3); ctx.lineTo(u * i, h * 0.7); ctx.stroke() }
      ctx.setLineDash([])
      ctx.strokeStyle = '#d42f25'
      ctx.strokeRect(u * 2, h * 0.12, u, h * 0.18)
      ctx.strokeRect(u * 2, h * 0.7, u, h * 0.18)
      ctx.fillStyle = '#555'
      ctx.font = `700 ${h * 0.03}px Arial`
      ctx.fillText('CUT', u, h * 0.27)
      ctx.fillStyle = '#1d4ed8'
      ctx.fillText('FOLD', u * 2.1, h * 0.75)
   },
   fragile: () => (ctx, w, h) => {
      ctx.strokeStyle = 'rgba(40,25,10,0.7)'
      ctx.fillStyle = 'rgba(40,25,10,0.7)'
      ctx.lineWidth = Math.min(w, h) * 0.012
      const s = Math.min(w, h) * 0.12
      for (const x of [w * 0.12, w * 0.12 + s * 1.3]) {
         ctx.beginPath(); ctx.moveTo(x, h * 0.86); ctx.lineTo(x, h * 0.86 - s); ctx.stroke()
         ctx.beginPath(); ctx.moveTo(x - s * 0.3, h * 0.86 - s * 0.7); ctx.lineTo(x, h * 0.86 - s); ctx.lineTo(x + s * 0.3, h * 0.86 - s * 0.7); ctx.stroke()
      }
      ctx.font = `800 ${s * 0.4}px Arial`
      ctx.fillText('THIS SIDE UP', w * 0.62, h * 0.82)
   },
}

export { BRANDS, printFace }
