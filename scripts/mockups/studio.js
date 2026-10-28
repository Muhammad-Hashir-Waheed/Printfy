// Studio mockup renderer — clean e-commerce product shots built from parametric 3D models.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'

import { backdropTexture, kraftTexture, paperGrain, printFace, radialTexture } from './art.js'

export const OUT_W = 1400
export const OUT_H = 1050
const SS = 1.6 // supersampling factor

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
renderer.setPixelRatio(1)
renderer.setSize(OUT_W * SS, OUT_H * SS)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.VSMShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.0
renderer.outputColorSpace = THREE.SRGBColorSpace
document.body.appendChild(renderer.domElement)

const pmrem = new THREE.PMREMGenerator(renderer)
const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

/* ───────────────────────── Materials ───────────────────────── */

/** Tag a material with its physical type — the Blender renderer (render.py) builds its PBR shader from it. */
export const tag = (kind, m) => {
   m.userData.kind = kind
   return m
}

export const M = {
   kraft: (tone = '#8f6840') => tag('cardboard', new THREE.MeshStandardMaterial({ map: kraftTexture(tone), roughness: 0.94, envMapIntensity: 0.5 })),
   white: (tone = '#f5f3ef') => tag('paper', new THREE.MeshStandardMaterial({ map: paperGrain(tone, 4, 0.035), roughness: 0.86, envMapIntensity: 0.6 })),
   matte: (color) => tag('matte', new THREE.MeshStandardMaterial({ color, roughness: 0.82, envMapIntensity: 0.6 })),
   softTouch: (color = '#1b1a1c') => tag('softtouch', new THREE.MeshStandardMaterial({ color, roughness: 0.85 })),
   gloss: (color) => tag('gloss', new THREE.MeshPhysicalMaterial({ color, roughness: 0.25, clearcoat: 0.7, clearcoatRoughness: 0.15 })),
   print: (aspect, opts, extra = {}) => {
      const m = new THREE.MeshStandardMaterial({ map: printFace(aspect, opts), roughness: extra.rough ?? 0.8, envMapIntensity: 0.6, ...extra.mat })
      if (extra.foil) {
         // hot-foil stamp: the logo / text areas are metallic, the rest stays paper
         m.metalnessMap = printFace(aspect, { ...opts, mask: true })
         m.metalness = 1
         m.userData.foilMask = m.metalnessMap
      }
      return tag(extra.kind || 'paper', m)
   },
   foil: (color = '#d4af37', rough = 0.22) => tag('foil', new THREE.MeshStandardMaterial({ color, metalness: 1, roughness: rough })),
   metal: (color = '#cfd2d6', rough = 0.32) => tag('metal', new THREE.MeshStandardMaterial({ color, metalness: 1, roughness: rough })),
   acrylic: (tint = '#ffffff', opts = {}) =>
      tag('glass', new THREE.MeshPhysicalMaterial({
         color: tint, metalness: 0, roughness: opts.rough ?? 0.04, transmission: 1, thickness: opts.thickness ?? 0.08,
         ior: 1.49, transparent: true, opacity: 1, envMapIntensity: 1.2, specularIntensity: 1,
      })),
   frosted: (tint = '#ffffff') =>
      tag('frosted', new THREE.MeshPhysicalMaterial({ color: tint, roughness: 0.45, transmission: 0.9, thickness: 0.1, ior: 1.45, transparent: true })),
   glow: (color, intensity = 3) => tag('emissive', new THREE.MeshStandardMaterial({ color: '#000', emissive: color, emissiveIntensity: intensity })),
   screen: (tex, intensity = 1.4) => tag('emissive', new THREE.MeshStandardMaterial({ color: '#000', emissive: '#fff', emissiveMap: tex, emissiveIntensity: intensity, roughness: 0.35 })),
   fabric: (color) => tag('cotton', new THREE.MeshStandardMaterial({ color, roughness: 0.95, map: paperGrain(color, 9, 0.08) })),
   wood: () => tag('wood', new THREE.MeshStandardMaterial({ map: kraftTexture('#8a6a4a', 11), roughness: 0.7 })),
}

/* ───────────────────────── Geometry helpers ───────────────────────── */

const faceOrder = ['right', 'left', 'top', 'bottom', 'front', 'back']

/** Rounded box with per-face materials: mats = Material | { front, back, left, right, top, bottom, all } */
export function block(w, h, d, mats, radius = 0.012) {
   const r = Math.min(radius, w / 2.2, h / 2.2, d / 2.2)
   const geo = r > 0.0005 ? new RoundedBoxGeometry(w, h, d, 3, r) : new THREE.BoxGeometry(w, h, d)
   let material = mats
   if (mats && !mats.isMaterial) material = faceOrder.map((f) => mats[f] || mats.all || M.white())
   const mesh = new THREE.Mesh(geo, material)
   mesh.castShadow = true
   mesh.receiveShadow = true
   return mesh
}

function group(...children) {
   const g = new THREE.Group()
   for (const c of children) if (c) g.add(c)
   return g
}

/** Chainable placement helpers on any Object3D */
THREE.Object3D.prototype.at = function (x = 0, y = 0, z = 0) {
   this.position.set(x, y, z)
   return this
}
THREE.Object3D.prototype.turn = function (y = 0, x = 0, z = 0) {
   this.rotation.set(x, y, z)
   return this
}
THREE.Object3D.prototype.grow = function (s = 1) {
   this.scale.setScalar(s)
   return this
}

/** Thin-walled open box (tray). faces: outside / inside materials. Origin at floor centre. */
export function tray(w, h, d, outside, inside, t = 0.025, skip = []) {
   const g = new THREE.Group()
   const parts = {
      bottom: [w, t, d, 0, t / 2, 0, { top: inside, all: outside }],
      front: [w, h, t, 0, h / 2, d / 2 - t / 2, { back: inside, all: outside }],
      back: [w, h, t, 0, h / 2, -d / 2 + t / 2, { front: inside, all: outside }],
      left: [t, h, d - 2 * t, -w / 2 + t / 2, h / 2, 0, { right: inside, all: outside }],
      right: [t, h, d - 2 * t, w / 2 - t / 2, h / 2, 0, { left: inside, all: outside }],
   }
   for (const [k, [bw, bh, bd, x, y, z, m]] of Object.entries(parts)) {
      if (skip.includes(k)) continue
      g.add(block(bw, bh, bd, m, 0.004).at(x, y, z))
   }
   return g
}

/* ───────────────────────── Packaging builders ───────────────────────── */

/** Closed carton / generic box. faces: { front, top, ... } materials. */
export function carton({ w = 1.4, h = 2, d = 0.9, faces, radius = 0.01 } = {}) {
   return group(block(w, h, d, faces, radius).at(0, h / 2, 0))
}

/** Two-piece rigid box with telescoping lid. lid: 'on' | 'lifted' | 'beside' */
export function lidBox({ w = 2, h = 1, d = 2, lidH = 0.32, base, lid, lidSide, inside, lidPos = 'on', ribbon, contents } = {}) {
   const g = new THREE.Group()
   const baseH = h - 0.02
   const insideMat = inside || base
   if (lidPos === 'on') {
      g.add(block(w, baseH, d, { all: base }, 0.012).at(0, baseH / 2, 0))
   } else {
      g.add(tray(w, baseH, d, base, insideMat, 0.03))
      if (contents) g.add(contents)
   }
   const lw = w + 0.05, ld = d + 0.05
   const lidMesh = block(lw, lidH, ld, { all: lidSide || base, top: lid, bottom: insideMat }, 0.014)
   if (lidPos === 'on') lidMesh.position.set(0, h - lidH / 2 + 0.01, 0)
   if (lidPos === 'lifted') {
      lidMesh.position.set(0, h + lidH / 2 + 0.55, -0.15)
      lidMesh.rotation.set(-0.32, 0.12, 0.06)
   }
   if (lidPos === 'beside') {
      // lid resting flat next to the open base, print facing up
      lidMesh.position.set(w * 1.18, lidH / 2, d * 0.18)
      lidMesh.rotation.set(0, -0.28, 0)
   }
   if (lidPos === 'leaning') {
      lidMesh.position.set(0.05, h * 0.62, -d / 2 - 0.08)
      lidMesh.rotation.set(-1.25, 0, 0)
   }
   g.add(lidMesh)
   if (ribbon && lidPos === 'on') {
      const rm = M.gloss(ribbon)
      g.add(block(0.16, 0.012, ld + 0.02, rm, 0.003).at(0, h + 0.012, 0))
      g.add(block(lw + 0.02, 0.012, 0.16, rm, 0.003).at(0, h + 0.012, 0))
      g.add(block(0.16, lidH + 0.01, 0.012, rm, 0.003).at(0, h - lidH / 2 + 0.01, ld / 2 + 0.006))
      g.add(bow(ribbon).at(0, h + 0.02, 0))
   }
   return g
}

export function bow(color, s = 1) {
   const m = M.gloss(color)
   const g = new THREE.Group()
   for (const sign of [-1, 1]) {
      const loop = new THREE.Mesh(new THREE.TorusGeometry(0.2 * s, 0.05 * s, 12, 32), m)
      loop.scale.set(1.25, 1, 0.45)
      loop.position.set(sign * 0.22 * s, 0.1 * s, 0)
      loop.rotation.set(Math.PI / 2 - 0.5, 0, sign * 0.35)
      loop.castShadow = true
      g.add(loop)
   }
   const knot = new THREE.Mesh(new THREE.SphereGeometry(0.08 * s, 16, 12), m)
   knot.position.y = 0.06 * s
   knot.scale.set(1, 0.7, 1)
   knot.castShadow = true
   g.add(knot)
   return g
}

/** Roll-end mailer box. open: false | angle in degrees. */
export function mailer({ w = 2.6, h = 0.8, d = 2, outside, top, inside, open = false, tissue = false, contents } = {}) {
   const g = new THREE.Group()
   const t = 0.03
   const insideMat = inside || M.white()
   if (!open) {
      g.add(block(w, h, d, { all: outside, top: top || outside }, 0.03).at(0, h / 2, 0))
      // front tuck lip
      g.add(block(w * 0.94, 0.04, 0.05, outside, 0.015).at(0, h - 0.03, d / 2 + 0.012))
      return g
   }
   g.add(tray(w, h, d, outside, insideMat, t))
   if (tissue) g.add(tissuePaper(w * 0.92, d * 0.92, tissue === true ? '#ffffff' : tissue).at(0, h * 0.75, 0))
   if (contents) g.add(contents)
   // lid hinged at the back top edge
   const hinge = new THREE.Group()
   hinge.position.set(0, h, -d / 2)
   const lidPanel = block(w, t, d, { top: top || outside, bottom: insideMat, all: outside }, 0.008).at(0, t / 2, d / 2)
   const flap = block(w * 0.96, h * 0.92, t, { back: insideMat, all: outside }, 0.008).at(0, -h * 0.46, d - t / 2)
   hinge.add(lidPanel, flap)
   hinge.rotation.x = -THREE.MathUtils.degToRad(open)
   g.add(hinge)
   return g
}

export function tissuePaper(w, d, color = '#ffffff') {
   const geo = new THREE.PlaneGeometry(w, d, 40, 30)
   const p = geo.attributes.position
   for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i)
      p.setZ(i, Math.sin(x * 7.1 + y * 3.3) * 0.035 + Math.sin(x * 2.3 - y * 6.7) * 0.05 + Math.cos(x * 11 + y * 9) * 0.015)
   }
   geo.computeVertexNormals()
   const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness: 0.9, side: THREE.DoubleSide, transparent: true, opacity: 0.94 }))
   m.rotation.x = -Math.PI / 2
   m.castShadow = true
   m.receiveShadow = true
   return m
}

/** Rigid drawer box: sleeve + tray pulled out with a ribbon tab. */
export function drawerBox({ w = 2, h = 0.8, d = 2.6, sleeve, drawer, inside, pull = 0.42, ribbon = '#c9a227', contents } = {}) {
   const g = new THREE.Group()
   const t = 0.03
   const sl = new THREE.Group()
   sl.add(block(w, t, d, { all: sleeve, bottom: sleeve }, 0.006).at(0, t / 2, 0))
   sl.add(block(w, t, d, { all: sleeve }, 0.01).at(0, h - t / 2, 0))
   sl.add(block(t, h, d, sleeve, 0.006).at(-w / 2 + t / 2, h / 2, 0))
   sl.add(block(t, h, d, sleeve, 0.006).at(w / 2 - t / 2, h / 2, 0))
   g.add(sl)
   const tr = tray(w - 2 * t - 0.02, h - 2 * t - 0.02, d - 0.04, drawer, inside || drawer, 0.025)
   tr.position.set(0, t + 0.005, d * pull)
   if (contents) tr.add(contents)
   g.add(tr)
   // ribbon pull tab
   const tab = block(0.22, 0.012, 0.16, M.gloss(ribbon), 0.004)
   tab.position.set(0, t + h * 0.18, d * pull + d / 2 + 0.07)
   tab.rotation.x = 0.25
   g.add(tab)
   return g
}

/** Book-style / magnetic box: tray + cover hinged on the left (book) or back (magnetic). */
export function hingedBox({ w = 2, h = 0.7, d = 2.6, outside, cover, inside, openDeg = 70, hinge = 'left', contents, insert } = {}) {
   const g = new THREE.Group()
   const t = 0.035
   g.add(tray(w, h, d, outside, inside || outside, t))
   if (insert) g.add(insert)
   if (contents) g.add(contents)
   const pivot = new THREE.Group()
   const coverMat = cover || outside
   if (hinge === 'left') {
      pivot.position.set(-w / 2 - 0.02, h + 0.01, 0)
      pivot.add(block(w + 0.04, t, d + 0.04, { top: coverMat, bottom: inside || coverMat, all: coverMat }, 0.01).at(w / 2 + 0.02, t / 2, 0))
      pivot.rotation.z = THREE.MathUtils.degToRad(openDeg)
   } else {
      pivot.position.set(0, h + 0.01, -d / 2 - 0.02)
      pivot.add(block(w + 0.04, t, d + 0.04, { top: coverMat, bottom: inside || coverMat, all: coverMat }, 0.01).at(0, t / 2, d / 2 + 0.02))
      pivot.add(block(w + 0.04, h * 0.7, t, { back: inside || coverMat, all: coverMat }, 0.01).at(0, -h * 0.35, d + 0.04))
      pivot.rotation.x = -THREE.MathUtils.degToRad(openDeg)
   }
   g.add(pivot)
   return g
}

/** Round tube / cylinder box with lid. */
export function tube({ r = 0.55, h = 2.2, body, lid, lidTop, lidH = 0.5, sides = 64, lidLift = 0 } = {}) {
   const g = new THREE.Group()
   const b = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h - lidH * 0.7, sides, 1), [body, M.matte('#e8e2d8'), M.matte('#e8e2d8')])
   b.position.y = (h - lidH * 0.7) / 2
   b.rotation.y = Math.PI // print centre faces the camera
   b.castShadow = b.receiveShadow = true
   const l = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.035, r * 1.035, lidH, sides, 1), [lid || body, lidTop || lid || body, lid || body])
   l.position.y = h - lidH / 2 + lidLift
   l.castShadow = l.receiveShadow = true
   g.add(b, l)
   return g
}

/** Pillow box: lens-shaped profile extruded along its length. */
export function pillowBox({ w = 2.2, bulge = 0.55, len = 1.5, mat } = {}) {
   const s = new THREE.Shape()
   s.moveTo(-w / 2, 0)
   s.quadraticCurveTo(0, bulge * 1.15, w / 2, 0)
   s.quadraticCurveTo(0, -bulge * 1.15, -w / 2, 0)
   const geo = new THREE.ExtrudeGeometry(s, { depth: len, bevelEnabled: true, bevelThickness: 0.18, bevelSize: 0.02, bevelSegments: 10, curveSegments: 48 })
   geo.translate(0, 0, -len / 2)
   normalizeUV(geo)
   const m = new THREE.Mesh(geo, mat)
   m.castShadow = m.receiveShadow = true
   m.rotation.x = 0
   m.position.y = bulge * 0.58
   return group(m)
}

/** Gable box with carry handle. */
export function gableBox({ w = 1.8, h = 1.5, d = 1.2, roof = 0.8, mat, frontMat } = {}) {
   const g = new THREE.Group()
   g.add(block(w, h, d, { all: mat, front: frontMat || mat }, 0.01).at(0, h / 2, 0))
   const s = new THREE.Shape()
   s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w * 0.08, roof); s.lineTo(w * 0.08, roof + 0.38); s.lineTo(-w * 0.08, roof + 0.38); s.lineTo(-w * 0.08, roof); s.lineTo(-w / 2, 0)
   const hole = new THREE.Path()
   hole.absellipse(0, roof + 0.18, w * 0.05, 0.07, 0, Math.PI * 2, true)
   s.holes.push(hole)
   for (const z of [-d / 2 + 0.01, d / 2 - 0.01]) {
      const geo = new THREE.ExtrudeGeometry(s, { depth: 0.02, bevelEnabled: false })
      normalizeUV(geo)
      const m = new THREE.Mesh(geo, mat)
      m.position.set(0, h, z - 0.01)
      m.castShadow = true
      g.add(m)
   }
   // sloped roof panels
   const slope = Math.hypot(w / 2 - w * 0.08, roof)
   const ang = Math.atan2(roof, w / 2 - w * 0.08)
   for (const sign of [-1, 1]) {
      const p = block(slope, 0.02, d, mat, 0.004)
      p.position.set(sign * (w / 4 + w * 0.04), h + roof / 2, 0)
      p.rotation.z = sign * -ang
      g.add(p)
   }
   return g
}

/** Prism box (hexagon etc.) with lid. */
export function prismBox({ r = 0.9, h = 0.9, sides = 6, body, lid, lidSide, lidH = 0.28, lidLift = 0 } = {}) {
   const g = new THREE.Group()
   const b = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, sides), [body, body, body])
   b.position.y = h / 2
   const l = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.04, r * 1.04, lidH, sides), [lidSide || body, lid, lid])
   l.position.y = h - lidH / 2 + 0.02 + lidLift
   b.castShadow = l.castShadow = true
   b.receiveShadow = l.receiveShadow = true
   g.add(b, l)
   g.rotation.y = Math.PI / sides
   return g
}

/** Paper / laminated / kraft shopping bag. handles: twisted | flat | ribbon | rope | diecut */
export function bag({ w = 1.6, h = 2, d = 0.75, front, side, inside, handles = 'twisted', handleColor = '#b88a58', windowMat = null } = {}) {
   const g = new THREE.Group()
   const t = 0.012
   const insideMat = inside || M.white('#efe9df')
   const body = tray(w, h, d, side || front, insideMat, t, [])
   // replace front/back with printed panels
   body.children[1].material = faceOrder.map((f) => (f === 'front' ? front : f === 'back' ? insideMat : side || front))
   body.children[2].material = faceOrder.map((f) => (f === 'back' ? front : f === 'front' ? insideMat : side || front))
   g.add(body)
   // gusset crease hint on the sides
   for (const sx of [-1, 1]) {
      const crease = new THREE.Mesh(new THREE.PlaneGeometry(0.004, h * 0.98), new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0.08 }))
      crease.position.set(sx * (w / 2 + 0.001), h / 2, 0)
      crease.rotation.y = sx * Math.PI / 2
      g.add(crease)
   }
   if (windowMat) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.42, h * 0.32), windowMat)
      win.position.set(0, h * 0.42, d / 2 + 0.002)
      g.add(win)
   }
   if (handles === 'diecut') return g
   const hm = handles === 'ribbon' ? M.gloss(handleColor) : M.matte(handleColor)
   const radius = handles === 'rope' ? 0.035 : handles === 'twisted' ? 0.022 : 0.03
   for (const z of [d / 2 - 0.02, -d / 2 + 0.02]) {
      const curve = new THREE.CatmullRomCurve3([
         new THREE.Vector3(-w * 0.22, h - 0.14, z),
         new THREE.Vector3(-w * 0.2, h + 0.35, z),
         new THREE.Vector3(0, h + 0.62, z),
         new THREE.Vector3(w * 0.2, h + 0.35, z),
         new THREE.Vector3(w * 0.22, h - 0.14, z),
      ])
      const tubeGeo = new THREE.TubeGeometry(curve, 64, radius, 10, false)
      const mesh = new THREE.Mesh(tubeGeo, hm)
      if (handles === 'flat' || handles === 'ribbon') mesh.scale.z = 1
      mesh.castShadow = true
      g.add(mesh)
      if (handles === 'flat' || handles === 'ribbon') {
         // flatten into a strap
         const strap = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.045, 4, false), hm)
         strap.scale.set(1, 1, 0.25)
         strap.position.z = z * 0.75
         strap.castShadow = true
         g.remove(mesh)
         g.add(strap)
      }
   }
   return g
}

/* ───────────────────────── Flat print builders ───────────────────────── */

/** A flat printed sheet (card, letterhead, flyer...) lying on the floor. */
export function sheet({ w = 2.1, h = 2.97, t = 0.008, front, back, edge } = {}) {
   const m = block(w, t, h, { top: front, bottom: back || M.white(), all: edge || M.white() }, 0.002)
   m.position.y = t / 2
   return group(m)
}

/** A stack of cards. */
export function cardStack({ w = 0.85, h = 0.55, n = 12, t = 0.012, front, edge, jitter = 0.01 } = {}) {
   const g = new THREE.Group()
   for (let i = 0; i < n; i++) {
      const c = block(w, t, h, { top: i === n - 1 ? front : edge || M.white(), all: edge || M.white() }, 0.002)
      c.position.set(Math.sin(i * 7.3) * jitter, t / 2 + i * t, Math.cos(i * 3.1) * jitter)
      c.rotation.y = Math.sin(i * 1.7) * 0.01
      g.add(c)
   }
   return g
}

/** Shape with hole (tags, door hangers) extruded thin. outline: 'tag' | 'hanger' */
export function cutShape({ w = 1, h = 1.8, t = 0.012, outline = 'tag', mat, back } = {}) {
   const s = new THREE.Shape()
   if (outline === 'tag') {
      const c = w * 0.22
      s.moveTo(-w / 2, -h / 2); s.lineTo(w / 2, -h / 2); s.lineTo(w / 2, h / 2 - c); s.lineTo(w / 2 - c, h / 2); s.lineTo(-w / 2 + c, h / 2); s.lineTo(-w / 2, h / 2 - c); s.lineTo(-w / 2, -h / 2)
      const hole = new THREE.Path(); hole.absarc(0, h / 2 - c * 0.9, w * 0.07, 0, Math.PI * 2, true); s.holes.push(hole)
   } else {
      const r = w * 0.2
      s.moveTo(-w / 2, -h / 2); s.lineTo(w / 2, -h / 2); s.lineTo(w / 2, h / 2); s.lineTo(-w / 2, h / 2); s.lineTo(-w / 2, -h / 2)
      const hole = new THREE.Path(); hole.absarc(0, h / 2 - r * 1.35, r, 0, Math.PI * 2, true); s.holes.push(hole)
   }
   const geo = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: false })
   normalizeUV(geo)
   const m = new THREE.Mesh(geo, [mat, back || M.white()])
   m.castShadow = m.receiveShadow = true
   return group(m)
}

/** Planar UVs from the XY bounding box so textures map once across a shape. */
export function normalizeUV(geo) {
   geo.computeBoundingBox()
   const b = geo.boundingBox
   const pos = geo.attributes.position
   const uv = new Float32Array(pos.count * 2)
   for (let i = 0; i < pos.count; i++) {
      uv[i * 2] = (pos.getX(i) - b.min.x) / (b.max.x - b.min.x || 1)
      uv[i * 2 + 1] = (pos.getY(i) - b.min.y) / (b.max.y - b.min.y || 1)
   }
   geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
   return geo
}

/* ───────────────────────── Scene + render ───────────────────────── */

const BACKDROPS = {
   warm: ['#f7f2eb', '#e6ddd1'],
   cool: ['#f1f3f6', '#dde2e8'],
   blush: ['#f8eeeb', '#ead9d3'],
   sage: ['#eef1ea', '#d9dfd2'],
   dark: ['#25211f', '#0d0c0c'],
   night: ['#141a2a', '#05070d'],
}

/**
 * spec: { items: Object3D[], view: [x,y,z] direction, bg, exposure, bloom, light, shadow, pad, target, wall }
 */
export async function render(spec) {
   const scene = new THREE.Scene()
   const dark = spec.bg === 'dark' || spec.bg === 'night'
   const bd = Array.isArray(spec.bg) ? spec.bg : BACKDROPS[spec.bg || 'warm']
   scene.background = backdropTexture(bd[0], bd[1], dark ? 0.35 : 0.12)
   scene.environment = envTex
   scene.environmentIntensity = spec.env ?? (dark ? 0.35 : 0.9)

   const root = new THREE.Group()
   for (const it of spec.items) root.add(it)
   scene.add(root)
   root.updateMatrixWorld(true)

   // floor: shadow catcher + soft contact shadow
   const box = new THREE.Box3().setFromObject(root)
   const size = box.getSize(new THREE.Vector3())
   const centre = box.getCenter(new THREE.Vector3())
   const floor = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShadowMaterial({ opacity: spec.shadow ?? (dark ? 0.5 : 0.2) }))
   floor.rotation.x = -Math.PI / 2
   floor.receiveShadow = true
   scene.add(floor)
   if (spec.contact !== false) {
      const ao = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: radialTexture(dark ? 'rgba(0,0,0,0.7)' : 'rgba(40,25,10,0.38)'), transparent: true, depthWrite: false }))
      ao.rotation.x = -Math.PI / 2
      ao.scale.set(size.x * 1.25 + 0.4, size.z * 1.35 + 0.4, 1)
      ao.position.set(centre.x, 0.002, centre.z)
      scene.add(ao)
   }
   if (spec.wall) {
      const wall = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), spec.wall)
      wall.position.set(0, 15, spec.wallZ ?? -0.02)
      wall.receiveShadow = true
      scene.add(wall)
   }

   // lights
   const key = new THREE.DirectionalLight('#fff7ee', spec.key ?? (dark ? 1.2 : 2.6))
   const kd = spec.light || [-0.55, 1, 0.75]
   const reach = Math.max(size.x, size.y, size.z) * 3 + 6
   key.position.set(centre.x + kd[0] * reach, kd[1] * reach, centre.z + kd[2] * reach)
   key.target.position.copy(centre)
   key.castShadow = true
   key.shadow.mapSize.set(4096, 4096)
   key.shadow.radius = spec.softness ?? 14
   key.shadow.blurSamples = 24
   key.shadow.bias = -0.0004
   const sc = key.shadow.camera
   const ext = Math.max(size.x, size.z, size.y) * 1.4 + 2
   sc.left = -ext; sc.right = ext; sc.top = ext; sc.bottom = -ext; sc.near = 0.1; sc.far = reach * 3
   scene.add(key, key.target)
   const rim = new THREE.DirectionalLight('#eef3ff', dark ? 0.6 : 0.7)
   rim.position.set(centre.x + reach * 0.7, reach * 0.6, centre.z - reach * 0.8)
   scene.add(rim)
   scene.add(new THREE.HemisphereLight('#ffffff', '#d9cbb8', dark ? 0.1 : 0.35))

   const { sphere, views, baseTarget } = framing(spec, box)

   renderer.toneMappingExposure = spec.exposure ?? 1
   const out = document.createElement('canvas')
   out.width = OUT_W
   out.height = OUT_H
   const octx = out.getContext('2d')
   octx.imageSmoothingEnabled = true
   octx.imageSmoothingQuality = 'high'
   const urls = []
   for (const v of views) {
      const cam = new THREE.PerspectiveCamera(spec.fov ?? 26, OUT_W / OUT_H, 0.05, 500)
      const dir = new THREE.Vector3(...v.dir).normalize()
      const target = baseTarget.clone().add(new THREE.Vector3(0, size.y * (v.lift ?? 0), 0))
      const fovR = THREE.MathUtils.degToRad(cam.fov / 2)
      const dist = (sphere.radius / Math.sin(fovR)) * v.pad
      cam.position.copy(target).addScaledVector(dir, dist)
      if (cam.position.y < 0.05) cam.position.y = 0.05
      cam.lookAt(target)
      if (spec.bloom) {
         const composer = new EffectComposer(renderer)
         composer.addPass(new RenderPass(scene, cam))
         composer.addPass(new UnrealBloomPass(new THREE.Vector2(OUT_W * SS, OUT_H * SS), spec.bloom.strength ?? 0.9, spec.bloom.radius ?? 0.5, spec.bloom.threshold ?? 0.85))
         composer.addPass(new OutputPass())
         composer.render()
         composer.dispose()
      } else {
         renderer.render(scene, cam)
      }
      // downsample to the final size (supersampled anti-aliasing) and encode
      octx.drawImage(renderer.domElement, 0, 0, OUT_W, OUT_H)
      urls.push(out.toDataURL('image/jpeg', 0.88))
   }

   // free GPU memory between renders
   if (scene.background?.dispose) scene.background.dispose()
   dispose(scene)
   return urls
}

/** Free GPU memory held by a scene graph. */
function dispose(root) {
   root.traverse((o) => {
      if (o.geometry) o.geometry.dispose()
      const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []
      for (const m of mats) {
         for (const k of ['map', 'emissiveMap', 'metalnessMap']) if (m[k] && !m[k].__shared) m[k].dispose()
         m.dispose()
      }
   })
}

/** Camera set for a scene — hero first, then the shot preset (front, high / top-down, close-up). */
function framing(spec, box) {
   const size = box.getSize(new THREE.Vector3())
   const centre = box.getCenter(new THREE.Vector3())
   const sphere = box.getBoundingSphere(new THREE.Sphere())
   const heroDir = spec.view || [1, 0.85, 1.7]
   const heroN = new THREE.Vector3(...heroDir).normalize()
   const shot = spec.shot || (spec.wall ? 'wall' : heroN.y > 0.72 ? 'flat' : 'floor')
   const side = heroDir[0] >= 0 ? 1 : -1
   const PRESETS = {
      floor: [
         { dir: [side * 0.1, 0.3, 1], pad: 0.84 },
         { dir: [side * -0.85, 1.35, 1.0], pad: 0.84 },
         { dir: heroDir, pad: 0.5, lift: 0.18 },
      ],
      flat: [
         { dir: [0.02, 3, 0.3], pad: 0.8 },
         { dir: [side * -1.1, 0.5, 1.25], pad: 0.78 },
         { dir: heroDir, pad: 0.48 },
      ],
      wall: [
         { dir: [0.03, 0.04, 1], pad: 0.84 },
         { dir: [-0.62, 0.1, 1], pad: 0.84 },
         { dir: [0.55, 0.14, 1], pad: 0.52, lift: 0.08 },
      ],
   }
   const views = [{ dir: heroDir, pad: spec.pad ?? 0.86 }, ...(spec.views || PRESETS[shot])].slice(0, spec.viewCount ?? 4)
   const baseTarget = spec.target ? new THREE.Vector3(...spec.target) : centre.clone().setY(centre.y * (spec.aimY ?? (spec.wall ? 1 : 0.85)))

   return { size, centre, sphere, views, baseTarget }
}

/** PNG of a canvas, flipped vertically — GLTFExporter flips texture images the same way (glTF UV origin is top-left). */
function flippedPng(img) {
   const c = document.createElement('canvas')
   c.width = img.width
   c.height = img.height
   const ctx = c.getContext('2d')
   ctx.translate(0, c.height)
   ctx.scale(1, -1)
   ctx.drawImage(img, 0, 0)
   return c.toDataURL('image/png')
}

/**
 * Scene → glTF + render notes for the Blender / Cycles renderer (render.py).
 * Same items and camera set as render(); materials are named m0…mN and described
 * (physical type, foil mask) in meta.materials.
 */
export async function exportScene(spec) {
   const root = new THREE.Group()
   for (const it of spec.items) root.add(it)
   root.updateMatrixWorld(true)
   const box = new THREE.Box3().setFromObject(root)
   const { size, sphere, views, baseTarget } = framing(spec, box)

   const materials = {}
   let n = 0
   root.traverse((o) => {
      if (!o.isMesh) return
      for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
         if (m.name && materials[m.name]) continue
         m.name = `m${n++}`
         materials[m.name] = {
            kind: m.userData.kind || 'generic',
            foilMask: m.userData.foilMask ? flippedPng(m.userData.foilMask.image) : null,
         }
         m.userData = {} // userData would travel as glTF extras (it holds textures)
      }
   })

   const glb = await new GLTFExporter().parseAsync(root, { binary: true, maxTextureSize: 4096 })
   const bytes = new Uint8Array(glb)
   let bin = ''
   for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
   dispose(root)

   return {
      glb: btoa(bin),
      meta: {
         bg: typeof spec.bg === 'string' ? spec.bg : 'warm',
         light: spec.light || [-0.55, 1, 0.75],
         exposure: spec.exposure ?? 1,
         radius: sphere.radius,
         views: views.map((v) => {
            const t = baseTarget.clone().add(new THREE.Vector3(0, size.y * (v.lift ?? 0), 0))
            return { dir: new THREE.Vector3(...v.dir).normalize().toArray(), pad: v.pad, target: t.toArray() }
         }),
         materials,
      },
   }
}
