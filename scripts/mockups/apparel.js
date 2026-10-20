// Apparel builders: flat-lay garments (tee, polo, hoodie, jacket, apron), folded stacks and a
// six-panel cap. Every garment is an extruded soft-edged outline whose fabric map is drawn in the
// same coordinates, so seams, ribbing, pockets and prints line up with the cut.
import * as THREE from 'three'

import { BRANDS, canvasTexture, drawLogo, rng } from './art.js'
import { M, block } from './studio.js'
import { grp, mesh } from './kit2.js'

const BEVEL = 0.05 // soft rolled edge
const BT = 0.025 // bevel thickness
const DEPTH = 0.012
const TOP = DEPTH + BT * 2 // height of the garment's top face

/* ───────── colour + canvas helpers ───────── */

const mix = (hex, to, t) => {
   const a = parseInt(hex.slice(1), 16), b = parseInt(to.slice(1), 16)
   const ch = (s) => Math.round(((a >> s) & 255) * (1 - t) + ((b >> s) & 255) * t)
   return `#${((1 << 24) + (ch(16) << 16) + (ch(8) << 8) + ch(0)).toString(16).slice(1)}`
}
const dark = (hex, t) => mix(hex, '#000000', t)
const light = (hex, t) => mix(hex, '#ffffff', t)
const isLight = (hex) => {
   const v = parseInt(hex.slice(1), 16)
   return ((v >> 16) & 255) * 0.3 + ((v >> 8) & 255) * 0.59 + (v & 255) * 0.11 > 150
}

/** Fine weave + soft fold shading so flat colour reads as cloth. */
function weave(c, w, h, color, { seed = 3, heather = 0, folds = true } = {}) {
   const r = rng(seed)
   const n = Math.round((w * h) / 45)
   c.lineWidth = 1
   for (let i = 0; i < n; i++) {
      c.strokeStyle = r() > 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
      const x = r() * w, y = r() * h
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + 1.5, y + 2.5); c.stroke()
   }
   if (heather) {
      for (let i = 0; i < n * heather; i++) {
         c.fillStyle = r() > 0.5 ? light(color, 0.35) : dark(color, 0.3)
         c.globalAlpha = 0.35
         c.fillRect(r() * w, r() * h, 1.6, 3)
      }
      c.globalAlpha = 1
   }
   if (folds) {
      for (let i = 0; i < 7; i++) {
         const x = r() * w, y = r() * h, rad = (0.15 + r() * 0.25) * Math.max(w, h)
         const g = c.createRadialGradient(x, y, 0, x, y, rad)
         const tone = i % 2 ? '255,255,255' : '0,0,0'
         g.addColorStop(0, `rgba(${tone},${i % 2 ? 0.05 : 0.07})`)
         g.addColorStop(1, `rgba(${tone},0)`)
         c.fillStyle = g
         c.fillRect(0, 0, w, h)
      }
   }
}

function fabric(map, color, { sheen = 0.22, rough = 0.92 } = {}) {
   return new THREE.MeshPhysicalMaterial({
      map, roughness: rough, sheen, sheenRoughness: 0.8, sheenColor: new THREE.Color(light(color, 0.15)), envMapIntensity: 0.45, side: THREE.DoubleSide,
   })
}

/** [['M',x,y], ['L',x,y], ['Q',cx,cy,x,y]] → dense point list */
function trace(cmds) {
   const pts = []
   let cur
   for (const cm of cmds) {
      if (cm[0] !== 'Q') {
         cur = [cm[1], cm[2]]
         pts.push(cur)
         continue
      }
      const [, cx, cy, x, y] = cm, p0 = cur
      for (let i = 1; i <= 18; i++) {
         const t = i / 18
         pts.push([(1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * cx + t * t * x, (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * cy + t * t * y])
      }
      cur = [x, y]
   }
   return pts
}
/** Right half (centre-top → centre-bottom, x ≥ 0) → full symmetric outline */
const mirror = (half) => [...half, ...half.slice(1, -1).reverse().map(([x, y]) => [-x, y])]
const flipX = (pts) => pts.map(([x, y]) => [-x, y])

/** Canvas painter in garment coordinates. */
function painter(c, b, w, h) {
   const X = (x) => ((x - b.x0) / (b.x1 - b.x0)) * w
   const Y = (y) => ((b.y1 - y) / (b.y1 - b.y0)) * h
   const S = w / (b.x1 - b.x0)
   const path = (pts, close = false) => {
      c.beginPath()
      pts.forEach(([x, y], i) => (i ? c.lineTo(X(x), Y(y)) : c.moveTo(X(x), Y(y))))
      if (close) c.closePath()
   }
   return {
      X, Y, S, path,
      fill: (pts, style) => { path(pts, true); c.fillStyle = style; c.fill() },
      line: (pts, style, width) => { path(pts); c.strokeStyle = style; c.lineWidth = width * S; c.lineJoin = c.lineCap = 'round'; c.stroke() },
      /** dashed top-stitch */
      stitch: (pts, style, width = 0.007) => {
         path(pts); c.setLineDash([S * 0.028, S * 0.018]); c.strokeStyle = style; c.lineWidth = width * S; c.stroke(); c.setLineDash([])
      },
      /** seam: soft shadow groove + stitch beside it */
      seam: (pts, color) => {
         path(pts); c.strokeStyle = dark(color, 0.22); c.globalAlpha = 0.5; c.lineWidth = S * 0.018; c.stroke(); c.globalAlpha = 1
         path(pts); c.strokeStyle = dark(color, 0.3); c.lineWidth = S * 0.006; c.stroke()
      },
      /** rib knit band between edge a→b and inner edge d→c */
      rib: ([a, bb, cc, d], color, n = 40) => {
         path([a, bb, cc, d], true); c.fillStyle = dark(color, 0.07); c.fill()
         c.strokeStyle = dark(color, 0.2); c.globalAlpha = 0.45; c.lineWidth = S * 0.006
         for (let k = 0; k <= n; k++) {
            const t = k / n
            const p = [a[0] + (bb[0] - a[0]) * t, a[1] + (bb[1] - a[1]) * t]
            const q = [d[0] + (cc[0] - d[0]) * t, d[1] + (cc[1] - d[1]) * t]
            path([p, q]); c.stroke()
         }
         c.globalAlpha = 1
      },
   }
}

function bounds(pts, pad = BEVEL + 0.02) {
   const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1])
   return { x0: Math.min(...xs) - pad, x1: Math.max(...xs) + pad, y0: Math.min(...ys) - pad, y1: Math.max(...ys) + pad }
}

function planarUV(geo, b) {
   const pos = geo.attributes.position
   const uv = new Float32Array(pos.count * 2)
   for (let i = 0; i < pos.count; i++) {
      uv[i * 2] = (pos.getX(i) - b.x0) / (b.x1 - b.x0)
      uv[i * 2 + 1] = (pos.getY(i) - b.y0) / (b.y1 - b.y0)
   }
   geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
}

/** Soft extruded panel in garment space (lies in XY, thickness along +Z). */
function panelMesh(outline, color, draw, { z = 0, px = 1400, heather = 0, seed = 3, sheen } = {}) {
   const b = bounds(outline)
   const tex = canvasTexture(px, Math.round((px * (b.y1 - b.y0)) / (b.x1 - b.x0)), (c, w, h) => {
      c.fillStyle = color
      c.fillRect(0, 0, w, h)
      weave(c, w, h, color, { heather, seed })
      draw?.(painter(c, b, w, h), c)
   })
   const shape = new THREE.Shape(outline.map(([x, y]) => new THREE.Vector2(x, y)))
   const geo = new THREE.ExtrudeGeometry(shape, { depth: DEPTH, bevelEnabled: true, bevelThickness: BT, bevelSize: BEVEL, bevelSegments: 4, curveSegments: 6 })
   planarUV(geo, b)
   const mat = fabric(tex, color, { sheen })
   const m = mesh(geo, [mat, mat])
   m.position.z = BT + z
   return m
}

/** Lay a garment-space group flat on the floor (garment top → away from camera). */
function layFlat(inner) {
   inner.rotation.x = -Math.PI / 2
   return grp(inner)
}

/** Tube lying on the garment (points in garment XY, height above the top face). */
function cord(pts, r, mat, lift = 0) {
   const curve = new THREE.CatmullRomCurve3(pts.map(([x, y]) => new THREE.Vector3(x, y, TOP + r + lift)))
   return mesh(new THREE.TubeGeometry(curve, 80, r, 10, false), mat)
}

/** Raised print / embroidery: logo drawn with a thread shadow. */
function printLogo(c, P, brandKey, x, y, size, { ink, maxWidth = 1.2, embroidered = false, emblem = true, tag = true } = {}) {
   c.save()
   if (embroidered) {
      c.shadowColor = 'rgba(0,0,0,0.45)'
      c.shadowBlur = 3
      c.shadowOffsetY = 2
   }
   drawLogo(c, BRANDS[brandKey], P.X(x), P.Y(y), P.S * size, { color: ink, emblem, tag, maxWidth: P.S * maxWidth })
   c.restore()
}

/* ───────── outlines (right half, garment units ≈ 18 cm) ───────── */

const TEE = trace([
   ['M', 0, 1.27], ['Q', 0.28, 1.28, 0.4, 1.38], ['L', 1.0, 1.2], ['L', 1.62, 0.62], ['L', 1.3, 0.26], ['L', 0.98, 0.5],
   ['Q', 0.94, -0.4, 1.0, -1.45], ['Q', 0.5, -1.52, 0, -1.48],
])
const LONG = trace([
   ['M', 0, 1.27], ['Q', 0.28, 1.28, 0.42, 1.38], ['L', 1.04, 1.2], ['L', 1.8, -0.9], ['L', 1.44, -1.04], ['L', 1.0, 0.42],
   ['L', 1.0, -1.45], ['Q', 0.5, -1.5, 0, -1.47],
])
const FRONT_NECK = trace([['M', 0.4, 1.38], ['Q', 0.33, 1.04, 0, 1.04]])

/* ───────── garments ───────── */

export function tee({ color = '#f3f1ec', brand = 'juno', ink, logoY = 0.32, logoSize = 0.2 } = {}) {
   const ink2 = ink || (isLight(color) ? BRANDS[brand].accent : '#ffffff')
   const body = panelMesh(mirror(TEE), color, (P, c) => {
      // inside of the back neck + care label
      P.fill([...trace([['M', -0.4, 1.38], ['Q', 0, 1.2, 0.4, 1.38]]), ...FRONT_NECK, ...flipX(FRONT_NECK).reverse()], dark(color, 0.2))
      P.fill([[-0.08, 1.25], [0.08, 1.25], [0.08, 1.18], [-0.08, 1.18]], light(color, 0.6))
      // collar rib
      const rib = (s) => [...FRONT_NECK.map(([x, y]) => [x * s, y]), ...flipX(FRONT_NECK).reverse().map(([x, y]) => [x * s, y])]
      P.line(rib(1).map(([x, y]) => [x, y - 0.035]), dark(color, 0.07), 0.07)
      P.stitch(rib(1).map(([x, y]) => [x * 1.02, y - 0.085]), dark(color, 0.25))
      for (const s of [1, -1]) {
         P.seam([[0.99 * s, 1.2], [0.96 * s, 0.82], [0.98 * s, 0.5]], color) // armhole
         P.stitch([[1.54 * s, 0.56], [1.24 * s, 0.31]], dark(color, 0.22)) // sleeve hem
         P.line([[1.62 * s, 0.62], [1.3 * s, 0.26]], dark(color, 0.08), 0.03)
      }
      P.stitch(trace([['M', -0.98, -1.36], ['Q', 0, -1.43, 0.98, -1.36]]), dark(color, 0.22))
      printLogo(c, P, brand, 0, logoY, logoSize, { ink: ink2, maxWidth: 1.1 })
   })
   const collar = cord(FRONT_NECK.concat(flipX(FRONT_NECK).reverse()).map(([x, y]) => [x * 0.99, y - 0.02]), 0.02, fabric(null, color))
   collar.material.color.set(dark(color, 0.04))
   return layFlat(grp(body, collar))
}

export function polo({ color = '#1f2f46', brand = 'north', ink = '#f2c14e' } = {}) {
   const half = trace([
      ['M', 0, 1.3], ['Q', 0.28, 1.3, 0.42, 1.4], ['L', 1.02, 1.22], ['L', 1.58, 0.66], ['L', 1.28, 0.3], ['L', 0.98, 0.54],
      ['Q', 0.94, -0.4, 1.0, -1.45], ['Q', 0.5, -1.5, 0, -1.48],
   ])
   const body = panelMesh(mirror(half), color, (P, c) => {
      // placket
      P.fill([[-0.11, 1.12], [0.11, 1.12], [0.11, 0.42], [-0.11, 0.42]], dark(color, 0.04))
      P.stitch([[-0.11, 1.12], [-0.11, 0.42], [0.11, 0.42], [0.11, 1.12]], light(color, 0.18))
      for (const s of [1, -1]) {
         P.seam([[1.0 * s, 1.22], [0.96 * s, 0.85], [0.98 * s, 0.54]], color)
         P.rib([[1.58 * s, 0.66], [1.28 * s, 0.3], [1.2 * s, 0.38], [1.5 * s, 0.73]], color, 22)
      }
      P.stitch(trace([['M', -0.98, -1.36], ['Q', 0, -1.43, 0.98, -1.36]]), dark(color, 0.25))
      // side vents
      for (const s of [1, -1]) P.line([[0.99 * s, -1.45], [0.98 * s, -1.25]], dark(color, 0.3), 0.012)
      printLogo(c, P, brand, 0.52, 0.72, 0.075, { ink, maxWidth: 0.42, embroidered: true, tag: false })
   }, { seed: 5 })
   // collar: back band + two points falling forward to the placket
   const collarHalf = [[0, 1.42], [0.47, 1.47], [0.55, 1.3], [0.34, 0.93], [0.08, 1.06], [0, 1.2]]
   const collarShape = [...collarHalf, ...flipX(collarHalf.slice(1, -1)).reverse()]
   const collar = panelMesh(collarShape, color, (P) => {
      for (const s of [1, -1]) P.stitch([[0.03 * s, 1.36], [0.43 * s, 1.41], [0.49 * s, 1.29], [0.32 * s, 0.98], [0.1 * s, 1.08]], light(color, 0.15))
      P.rib([[-0.5, 1.45], [0.5, 1.45], [0.5, 1.4], [-0.5, 1.4]], color, 60)
   }, { z: TOP - 0.02, px: 700 })
   const btn = (y) => mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 24), M.gloss(light(color, 0.75))).turn(0, Math.PI / 2).at(0, y, TOP + 0.01)
   return layFlat(grp(body, collar, btn(0.82), btn(0.6)))
}

export function hoodie({ color = '#9aa0a6', brand = 'nova', ink, heather = 0.25 } = {}) {
   const ink2 = ink || (isLight(color) ? '#11151c' : '#ffffff')
   const body = panelMesh(mirror(LONG), color, (P, c) => {
      P.fill([...trace([['M', -0.42, 1.38], ['Q', 0, 1.2, 0.42, 1.38]]), ...trace([['M', 0.42, 1.38], ['Q', 0.3, 1.06, 0, 1.08]]), ...flipX(trace([['M', 0.42, 1.38], ['Q', 0.3, 1.06, 0, 1.08]])).reverse()], dark(color, 0.28))
      for (const s of [1, -1]) {
         P.seam([[1.02 * s, 1.2], [0.98 * s, 0.8], [1.0 * s, 0.42]], color)
         P.rib([[1.8 * s, -0.9], [1.44 * s, -1.04], [1.38 * s, -0.84], [1.73 * s, -0.7]], color, 26)
      }
      P.rib([[-1.0, -1.45], [1.0, -1.45], [1.0, -1.2], [-1.0, -1.2]], color, 90)
      // kangaroo pocket
      const pocket = [[-0.55, -0.32], [0.55, -0.32], [0.82, -0.72], [0.82, -1.18], [-0.82, -1.18], [-0.82, -0.72]]
      P.fill(pocket, dark(color, 0.03))
      P.line([[-0.55, -0.32], [0.55, -0.32]], dark(color, 0.18), 0.02)
      for (const s of [1, -1]) P.line([[0.55 * s, -0.32], [0.82 * s, -0.72]], dark(color, 0.45), 0.03)
      P.stitch([[-0.52, -0.37], [0.52, -0.37], [0.77, -0.73]], light(color, 0.2))
      P.stitch([[-0.52, -0.37], [-0.77, -0.73]], light(color, 0.2))
      printLogo(c, P, brand, 0, 0.42, 0.2, { ink: ink2, maxWidth: 1.15, heather })
   }, { heather, seed: 7 })
   // hood lying flat behind the neck
   const hoodPts = []
   for (let i = 0; i <= 40; i++) {
      const a = -0.25 + (Math.PI + 0.5) * (i / 40)
      hoodPts.push([Math.cos(a) * 0.66, 1.72 + Math.sin(a) * 0.6])
   }
   hoodPts.push([-0.5, 1.2], [0.5, 1.2])
   const hood = panelMesh(hoodPts, color, (P) => {
      P.seam([[0, 2.32], [0, 1.62]], color)
      P.fill(trace([['M', -0.6, 1.5], ['Q', 0, 1.95, 0.6, 1.5], ['Q', 0, 1.2, -0.6, 1.5]]), dark(color, 0.3))
      P.line(trace([['M', -0.6, 1.5], ['Q', 0, 1.95, 0.6, 1.5]]), dark(color, 0.08), 0.05)
   }, { z: -0.02, px: 700, heather, seed: 9 })
   const string = M.matte(light(color, 0.7))
   const tip = M.metal('#cfd2d6', 0.3)
   const parts = [body, hood]
   for (const s of [1, -1]) {
      parts.push(mesh(new THREE.TorusGeometry(0.03, 0.01, 8, 24), tip).at(0.13 * s, 1.1, TOP + 0.01))
      parts.push(cord([[0.13 * s, 1.1], [0.16 * s, 0.85], [0.12 * s, 0.6], [0.18 * s, 0.4]], 0.014, string))
      parts.push(mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.1, 12), tip).turn(0, 0, 0.3 * s).at(0.19 * s, 0.33, TOP + 0.018))
   }
   return layFlat(grp(...parts))
}

export function jacket({ color = '#22303f', brand = 'north', ink = '#ffffff', trim } = {}) {
   const half = trace([
      ['M', 0, 1.5], ['Q', 0.28, 1.52, 0.44, 1.56], ['L', 0.46, 1.36], ['L', 1.06, 1.2], ['L', 1.82, -0.92], ['L', 1.46, -1.06], ['L', 1.02, 0.42],
      ['L', 1.02, -1.45], ['L', 0, -1.45],
   ])
   const t2 = trim || dark(color, 0.25)
   const body = panelMesh(mirror(half), color, (P, c) => {
      P.fill([[-0.44, 1.56], [0.44, 1.56], [0.46, 1.36], [-0.46, 1.36]], dark(color, 0.08)) // stand collar
      P.stitch([[-0.44, 1.4], [0.44, 1.4]], light(color, 0.2))
      for (const s of [1, -1]) {
         P.seam([[0.46 * s, 1.36], [0.9 * s, 0.95], [1.04 * s, 1.2]], color) // yoke
         P.seam([[1.04 * s, 1.2], [1.0 * s, 0.8], [1.02 * s, 0.42]], color)
         P.fill([[1.82 * s, -0.92], [1.46 * s, -1.06], [1.41 * s, -0.92], [1.77 * s, -0.78]], t2) // cuff
         P.line([[0.38 * s, -0.35], [0.62 * s, -0.95]], dark(color, 0.5), 0.025) // zipped welt pocket
         P.stitch([[0.42 * s, -0.33], [0.66 * s, -0.93]], light(color, 0.2))
         P.stitch([[0.08 * s, 1.36], [0.08 * s, -1.38]], light(color, 0.15))
      }
      P.fill([[-1.02, -1.45], [1.02, -1.45], [1.02, -1.33], [-1.02, -1.33]], t2)
      printLogo(c, P, brand, 0.52, 0.62, 0.085, { ink, maxWidth: 0.42, embroidered: true, tag: false })
   }, { seed: 11, sheen: 0.25 })
   const zipMat = M.metal('#b9bdc2', 0.35)
   const tape = mesh(new THREE.BoxGeometry(0.05, 2.98, 0.012), M.matte(dark(color, 0.35))).at(0, 0.04, TOP + 0.006)
   const teeth = mesh(new THREE.BoxGeometry(0.022, 2.96, 0.016), zipMat).at(0, 0.04, TOP + 0.01)
   const pull = mesh(new THREE.BoxGeometry(0.05, 0.16, 0.014), zipMat).at(0.012, 1.3, TOP + 0.022).turn(0, 0, 0.12)
   return layFlat(grp(body, tape, teeth, pull))
}

export function apron({ color = '#6b4a33', brand = 'ember', ink = '#f3e6cf', strap = '#e9dcc6' } = {}) {
   const half = trace([['M', 0, 1.45], ['L', 0.52, 1.45], ['L', 0.52, 0.8], ['Q', 0.56, 0.22, 0.95, 0.15], ['L', 0.95, -1.75], ['Q', 0.5, -1.8, 0, -1.78]])
   const body = panelMesh(mirror(half), color, (P, c) => {
      P.stitch([[-0.47, 1.4], [0.47, 1.4]], light(color, 0.35))
      for (const s of [1, -1]) P.stitch([[0.9 * s, 0.12], [0.9 * s, -1.7]], light(color, 0.35))
      P.stitch(trace([['M', -0.9, -1.69], ['Q', 0, -1.74, 0.9, -1.69]]), light(color, 0.35))
      const pocket = [[-0.72, -0.32], [0.72, -0.32], [0.72, -1.0], [-0.72, -1.0]]
      P.fill(pocket, dark(color, 0.05))
      P.line([[-0.72, -0.32], [0.72, -0.32]], dark(color, 0.3), 0.02)
      P.stitch([[-0.68, -0.36], [-0.68, -0.96], [0.68, -0.96], [0.68, -0.36]], light(color, 0.35))
      P.stitch([[0, -0.36], [0, -0.96]], light(color, 0.35))
      printLogo(c, P, brand, 0, 0.98, 0.16, { ink, maxWidth: 0.86 })
   }, { seed: 13, heather: 0.15, sheen: 0.2 })
   const s = M.matte(strap)
   const brass = M.metal('#c9a227', 0.3)
   const rivets = [[-0.72, -0.32], [0.72, -0.32], [0, -0.32]].map(([x, y]) => mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.012, 16), brass).turn(0, Math.PI / 2).at(x, y, TOP + 0.006))
   const flatStrap = (pts) => {
      const m = cord(pts, 0.04, s, -0.03)
      m.scale.z = 0.35
      return m
   }
   return layFlat(grp(
      body, ...rivets,
      flatStrap([[0.46, 1.42], [0.44, 1.9], [0.2, 2.2], [-0.2, 2.2], [-0.44, 1.9], [-0.46, 1.42]]),
      flatStrap([[0.93, 0.08], [1.35, -0.05], [1.55, -0.55], [1.4, -1.1], [1.55, -1.5]]),
      flatStrap([[-0.93, 0.08], [-1.32, -0.1], [-1.42, -0.7], [-1.62, -1.2]]),
   ))
}

/** Folded garment (shop-folded square, neckline at the back edge). */
export function folded({ color = '#1f3b57', brand = 'north', ink, kind = 'tee', w = 1.3, d = 1.45, h = 0.13, logoSize = 0.24 } = {}) {
   const ink2 = ink || (isLight(color) ? BRANDS[brand].accent : '#ffffff')
   const top = canvasTexture(900, Math.round((900 * d) / w), (c, W, H) => {
      c.fillStyle = color
      c.fillRect(0, 0, W, H)
      weave(c, W, H, color, { seed: 21, heather: kind === 'hoodie' ? 0.2 : 0 })
      for (const [x0, x1] of [[0, W * 0.09], [W, W * 0.91]]) {
         const g = c.createLinearGradient(x0, 0, x1, 0)
         g.addColorStop(0, 'rgba(0,0,0,0.16)'); g.addColorStop(1, 'rgba(0,0,0,0)')
         c.fillStyle = g; c.fillRect(0, 0, W, H)
      }
      if (kind !== 'jacket') {
         const r = W * (kind === 'polo' ? 0.2 : 0.18)
         c.fillStyle = dark(color, 0.22)
         c.beginPath(); c.ellipse(W / 2, 0, r, r * 0.75, 0, 0, Math.PI); c.fill()
         c.strokeStyle = dark(color, 0.07); c.lineWidth = W * 0.04
         c.beginPath(); c.ellipse(W / 2, 0, r + W * 0.02, r * 0.75 + W * 0.02, 0, 0, Math.PI); c.stroke()
         if (kind === 'polo') {
            c.fillStyle = dark(color, 0.05)
            c.fillRect(W / 2 - W * 0.05, r * 0.75, W * 0.1, H * 0.3)
            for (const y of [0.85, 1.2]) { c.fillStyle = light(color, 0.75); c.beginPath(); c.arc(W / 2, r * y, W * 0.016, 0, 7); c.fill() }
         }
      } else {
         c.fillStyle = '#b9bdc2'; c.fillRect(W / 2 - 4, 0, 8, H)
      }
      if (kind === 'hoodie') {
         c.fillStyle = dark(color, 0.08)
         c.fillRect(0, H * 0.86, W, H * 0.14)
      }
      c.save()
      if (kind === 'polo' || kind === 'jacket') {
         c.shadowColor = 'rgba(0,0,0,0.45)'; c.shadowBlur = 3; c.shadowOffsetY = 2
         drawLogo(c, BRANDS[brand], W * 0.7, H * 0.36, W * 0.07, { color: ink2, emblem: false, tag: false, maxWidth: W * 0.3 })
      } else {
         drawLogo(c, BRANDS[brand], W / 2, H * 0.55, W * logoSize * 0.5, { color: ink2, maxWidth: W * 0.62 })
      }
      c.restore()
   })
   const side = canvasTexture(256, 64, (c, W, H) => {
      c.fillStyle = color; c.fillRect(0, 0, W, H)
      c.strokeStyle = 'rgba(0,0,0,0.18)'; c.lineWidth = 2
      for (const y of [0.3, 0.62]) { c.beginPath(); c.moveTo(0, H * y); c.lineTo(W, H * y); c.stroke() }
   })
   const g = grp(block(w, h, d, { top: fabric(top, color), all: fabric(side, color) }, 0.05).at(0, h / 2, 0))
   return g
}

/** Folded stack: [{color, brand, ink}] bottom → top */
export function foldedStack(items, opts = {}) {
   const h = opts.h ?? 0.13
   return grp(...items.map((it, i) => folded({ ...opts, ...it }).at((i % 2 ? 0.03 : -0.02), i * h, (i % 2 ? -0.02 : 0.02)).turn(i % 2 ? 0.035 : -0.02)))
}

/** Six-panel structured cap with curved brim; logo embroidered on the front panels. */
export function cap({ color = '#1f3b57', brimColor, brand = 'north', ink = '#ffffff', r = 0.62 } = {}) {
   const bc = brimColor || color
   const crownTex = canvasTexture(2048, 512, (c, w, h) => {
      c.fillStyle = color; c.fillRect(0, 0, w, h)
      weave(c, w, h, color, { seed: 31, folds: false })
      for (let k = 0; k < 6; k++) {
         const x = ((0.25 + k / 6) % 1) * w
         c.strokeStyle = dark(color, 0.3); c.lineWidth = 6
         c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke()
         c.setLineDash([10, 7]); c.strokeStyle = light(color, 0.18); c.lineWidth = 2.5
         for (const o of [-11, 11]) { c.beginPath(); c.moveTo(x + o, h * 0.08); c.lineTo(x + o, h); c.stroke() }
         c.setLineDash([])
         const ex = ((0.25 + 1 / 12 + k / 6) % 1) * w
         if (k !== 5) { c.fillStyle = dark(color, 0.45); c.beginPath(); c.arc(ex, h * 0.3, 8, 0, 7); c.fill(); c.strokeStyle = light(color, 0.15); c.lineWidth = 3; c.stroke() }
      }
      c.setLineDash([10, 7]); c.strokeStyle = light(color, 0.18); c.lineWidth = 2.5
      c.beginPath(); c.moveTo(0, h * 0.95); c.lineTo(w, h * 0.95); c.stroke(); c.setLineDash([])
      c.save()
      c.translate(0.25 * w, h * 0.62)
      c.scale(1.18, 1)
      c.shadowColor = 'rgba(0,0,0,0.5)'; c.shadowBlur = 3; c.shadowOffsetY = 2
      drawLogo(c, BRANDS[brand], 0, 0, h * 0.15, { color: ink, emblem: false, tag: false, maxWidth: w * 0.13 })
      c.restore()
   })
   const crown = mesh(new THREE.SphereGeometry(r, 96, 48, 0, Math.PI * 2, 0, Math.PI / 2), fabric(crownTex, color))
   crown.scale.set(1, 1.08, 1.1)
   const button = mesh(new THREE.SphereGeometry(r * 0.075, 24, 12), fabric(null, color)).at(0, r * 1.08, 0)
   button.material.color.set(color)
   button.scale.y = 0.45

   const brimTex = canvasTexture(1024, 256, (c, w, h) => {
      c.fillStyle = bc; c.fillRect(0, 0, w, h)
      weave(c, w, h, bc, { seed: 33, folds: false })
      c.setLineDash([9, 6]); c.strokeStyle = light(bc, 0.2); c.lineWidth = 2.5
      for (const v of [0.22, 0.38, 0.54, 0.7, 0.86]) { c.beginPath(); c.moveTo(0, h * (1 - v)); c.lineTo(w, h * (1 - v)); c.stroke() }
   })
   const seg = 72, rows = 10, reach0 = r * 1.2
   const geo = new THREE.PlaneGeometry(1, 1, seg, rows)
   const pos = geo.attributes.position
   const brimPoint = (u, t) => {
      const a = (u - 0.5) * 2 * 1.08
      const reach = reach0 * Math.pow(Math.max(0, Math.cos((a / 1.08) * (Math.PI / 2))), 0.45)
      const ix = Math.sin(a) * r, iz = Math.cos(a) * r * 1.1
      let dx = Math.sin(a) * 0.45, dz = Math.cos(a) * 1.1 * 0.45 + 0.55
      const n = Math.hypot(dx, dz); dx /= n; dz /= n
      const y = -t * reach * 0.12 - Math.sin(a) ** 2 * t * reach * 0.35
      return [ix + dx * reach * t, y, iz + dz * reach * t]
   }
   for (let i = 0; i < pos.count; i++) pos.setXYZ(i, ...brimPoint(pos.getX(i) + 0.5, pos.getY(i) + 0.5))
   geo.computeVertexNormals()
   const brimMesh = mesh(geo, fabric(brimTex, bc, { sheen: 0.3 }))
   const rim = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({ length: 41 }, (_, i) => new THREE.Vector3(...brimPoint(i / 40, 1)))), 80, 0.014, 8, false), fabric(null, bc))
   rim.material.color.set(dark(bc, 0.05))
   const band = mesh(new THREE.TorusGeometry(r, 0.012, 8, 96), fabric(null, color)).turn(0, Math.PI / 2)
   band.scale.set(1, 1.1, 1)
   band.material.color.set(dark(color, 0.1))
   const inner = grp(crown, button, brimMesh, rim, band)
   inner.rotation.x = -0.08
   inner.position.y = r * 0.2
   return grp(inner)
}
