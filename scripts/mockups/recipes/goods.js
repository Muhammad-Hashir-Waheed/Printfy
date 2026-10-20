// Food service, bags, acrylic & plastic, display racks, corporate.
import * as THREE from 'three'
import { M, bag, block, carton, lidBox, mailer, tray } from '../studio.js'
import { cup, cupCarrier, napkins, sticker, wallMaterial } from '../kit.js'
import { P, perfumeBottle, soapBar } from './common.js'

const mesh = (geo, mat) => {
   const m = new THREE.Mesh(geo, mat)
   m.castShadow = m.receiveShadow = true
   return m
}

/** Clear acrylic box (walls + lid) with optional contents. */
function acrylicBox({ w = 1.6, h = 1.0, d = 1.6, tint = '#ffffff', lid = true, contents, lidMat, base } = {}) {
   const g = new THREE.Group()
   const a = M.acrylic(tint, { thickness: 0.06 })
   g.add(tray(w, h, d, a, a, 0.03))
   if (base) g.add(block(w - 0.06, 0.04, d - 0.06, base, 0.01).at(0, 0.05, 0))
   if (contents) g.add(contents)
   if (lid) g.add(block(w + 0.04, 0.05, d + 0.04, lidMat || a, 0.012).at(0, h + 0.025, 0))
   return g
}

function sweets(n = 9, colors = ['#e7b8a8', '#f2c14e', '#b9d7a3', '#c4558a', '#f6e7c8']) {
   const g = new THREE.Group()
   for (let i = 0; i < n; i++) {
      const s = mesh(new THREE.SphereGeometry(0.17, 24, 16), M.gloss(colors[i % colors.length]))
      s.position.set(((i % 3) - 1) * 0.4, 0.2, (Math.floor(i / 3) - 1) * 0.4)
      s.scale.y = 0.8
      g.add(s)
   }
   return g
}

function cake() {
   const g = new THREE.Group()
   g.add(mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.55, 48), M.matte('#f6e7c8')).at(0, 0.32, 0))
   g.add(mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.08, 48), M.gloss('#c4558a')).at(0, 0.6, 0))
   for (let i = 0; i < 8; i++) g.add(mesh(new THREE.SphereGeometry(0.06, 16, 12), M.gloss('#b8233a')).at(Math.cos(i) * 0.38, 0.68, Math.sin(i) * 0.38))
   return g
}

/** Padded / poly mailer envelope (pillowy flat bag). */
function mailerBag({ w = 1.7, h = 2.3, face, puff = 0.12 } = {}) {
   const geo = new THREE.BoxGeometry(w, puff, h, 24, 1, 24)
   const p = geo.attributes.position
   for (let i = 0; i < p.count; i++) {
      const x = p.getX(i) / (w / 2), z = p.getZ(i) / (h / 2)
      const k = Math.max(0, 1 - x * x) * Math.max(0, 1 - z * z)
      if (p.getY(i) > 0) p.setY(i, puff / 2 + k * puff * 1.6)
   }
   geo.computeVertexNormals()
   const m = mesh(geo, [face, face, face, face, face, face])
   m.position.y = puff / 2
   return m
}

export default {
   /* ───────── Food ───────── */
   'food-packaging/cups/cup-sleeves': () => ({
      bg: 'warm',
      view: [0.8, 0.5, 1.7],
      items: [
         cup({ body: M.white(), sleeve: P(3.2, { fit: 0.3, brand: 'ember', logoScale: 0.32, emblem: false }) }).at(-0.55, 0, 0),
         cup({ body: M.white(), sleeve: P(3.2, { fit: 0.3, brand: 'ember', bg: '#fff6ea', ink: '#b5432a', logoScale: 0.32, emblem: false, pattern: 'dots', patternAlpha: 0.2 }), lid: '#1b1b1b' }).at(0.55, 0, -0.35),
      ],
   }),
   'food-packaging/food-accessories/2-cup-drink-carrier': () => ({
      bg: 'warm',
      view: [0.8, 0.7, 1.7],
      items: [cupCarrier({ n: 2, cupOpts: { body: P(3.2, { fit: 0.3, brand: 'ember', logoScale: 0.32, emblem: false }) } })],
   }),
   'food-packaging/food-accessories/4-cup-drink-carrier': () => ({
      bg: 'warm',
      view: [0.8, 0.85, 1.6],
      items: [cupCarrier({ n: 4, cupOpts: { body: P(3.2, { fit: 0.3, brand: 'ember', logoScale: 0.32, emblem: false }) } })],
   }),
   'food-packaging/food-accessories/printed-napkins': () => ({
      bg: 'sage',
      view: [0.5, 1.3, 1.4],
      items: [
         napkins({ mat: M.white('#fbfaf6'), top: P(1, { brand: 'bella', bg: '#fbfaf6', ink: '#c8362b', logoScale: 0.14, logoY: 0.72 }) }).at(-0.7, 0, 0).turn(0.2),
         napkins({ size: 1.0, n: 6, mat: M.matte('#c8362b'), top: P(1, { brand: 'bella', logoScale: 0.14 }) }).at(0.9, 0, -0.2).turn(-0.3),
      ],
   }),
   'food-packaging/food-accessories/branded-food-seals': () => ({
      bg: 'warm',
      view: [0.6, 0.8, 1.7],
      items: [
         carton({ w: 1.8, h: 0.7, d: 1.4, faces: { all: M.kraft() } }).at(-0.5, 0, 0).turn(0.25),
         sticker({ size: 0.6, shape: 'circle', face: P(1, { brand: 'bella', logoScale: 0.18, emblem: false }) }).at(-0.5, 0.7, 0).turn(0.25),
         sticker({ size: 0.6, shape: 'circle', face: P(1, { brand: 'bella', bg: '#f6e7c8', ink: '#c8362b', logoScale: 0.18, emblem: false }) }).at(1.0, 0, 0.3),
         sticker({ size: 0.5, shape: 'circle', face: P(1, { brand: 'bella', logoScale: 0.18, emblem: false }) }).at(1.3, 0, -0.4),
      ],
   }),
   'food-packaging/food-bags/sandwich-bag': () => ({
      bg: 'warm',
      view: [0.6, 0.7, 1.7],
      items: [
         bag({ w: 1.1, h: 1.6, d: 0.45, front: P(0.69, { brand: 'bella', bg: '#f6efe3', ink: '#c8362b', logoScale: 0.18, pattern: 'grid', patternInk: '#c8362b', patternAlpha: 0.25 }), side: M.white('#f6efe3'), handles: 'diecut' }).at(-0.5, 0, 0).turn(0.25),
         bag({ w: 1.1, h: 1.6, d: 0.45, front: P(0.69, { kraft: true, brand: 'bella', ink: '#c8362b', logoScale: 0.18 }), side: M.kraft(), handles: 'diecut' }).at(0.8, 0, -0.35).turn(-0.3),
      ],
   }),
   'food-packaging/food-bags/bakery-bread-bag': () => ({
      bg: 'warm',
      view: [0.6, 0.6, 1.7],
      items: [
         bag({ w: 0.9, h: 2.4, d: 0.45, front: P(0.375, { brand: 'oak', kraft: true, logoScale: 0.3, logoY: 0.55 }), side: M.kraft(), handles: 'diecut', windowMat: M.acrylic('#ffffff', { thickness: 0.01 }) }).at(-0.4, 0, 0).turn(0.25),
         bag({ w: 0.9, h: 2.4, d: 0.45, front: P(0.375, { brand: 'oak', bg: '#f4ead8', ink: '#2f3a2c', logoScale: 0.3, logoY: 0.55 }), side: M.white('#f4ead8'), handles: 'diecut' }).at(0.7, 0, -0.3).turn(-0.2),
      ],
   }),
   'food-packaging/food-boxes/cake-box': () => ({
      bg: 'blush',
      view: [0.7, 1.0, 1.6],
      items: [lidBox({ w: 1.6, h: 1.1, d: 1.6, base: M.white(), lid: P(1, { brand: 'bloom', pattern: 'dots', patternAlpha: 0.25, logoScale: 0.15 }), lidPos: 'beside', inside: M.white(), contents: cake() })],
   }),
   'food-packaging/food-boxes/large-combo-burger-box': () => ({
      bg: 'warm',
      view: [0.8, 0.95, 1.6],
      items: [
         mailer({ w: 1.6, h: 0.9, d: 1.6, outside: P(1.78, { brand: 'bella', bg: '#2b2b2b', logo: false }), top: P(1, { brand: 'bella', bg: '#2b2b2b', ink: '#f2c14e', logoScale: 0.16 }), inside: M.kraft() }).at(-0.7, 0, 0.1).turn(0.3),
         mailer({ w: 1.6, h: 0.9, d: 1.6, outside: P(1.78, { brand: 'bella', bg: '#2b2b2b', logo: false }), top: M.matte('#2b2b2b'), inside: M.kraft(), open: 100 }).at(1.1, 0, -0.35).turn(-0.3),
      ],
   }),
   'food-packaging/food-boxes/window-pizza-box': () => ({
      bg: 'warm',
      view: [0.4, 1.4, 1.3],
      items: [lidBox({ w: 2.6, h: 0.35, d: 2.6, lidH: 0.33, base: M.kraft(), lid: P(1, { brand: 'bella', kraft: true, ink: '#c8362b', logoScale: 0.1, logoY: 0.82, emblem: false, draw: (c, w, h) => { c.fillStyle = '#e4b35a'; c.beginPath(); c.arc(w / 2, h * 0.42, h * 0.3, 0, 7); c.fill(); c.fillStyle = '#c8362b'; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(w / 2 + Math.cos(i * 0.7) * h * 0.18, h * 0.42 + Math.sin(i * 0.7) * h * 0.18, h * 0.035, 0, 7); c.fill() } const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, 'rgba(255,255,255,0.4)'); g.addColorStop(0.5, 'rgba(255,255,255,0)'); c.fillStyle = g; c.beginPath(); c.arc(w / 2, h * 0.42, h * 0.32, 0, 7); c.fill(); c.strokeStyle = 'rgba(0,0,0,0.3)'; c.lineWidth = 4; c.stroke() } }) })],
   }),
   'food-packaging/food-containers/soup-container': () => ({
      bg: 'warm',
      view: [0.8, 0.7, 1.7],
      items: [
         cup({ rTop: 0.55, rBot: 0.45, h: 0.75, body: P(3.5, { fit: 0.3, brand: 'oak', kraft: true, logoScale: 0.4, emblem: false }), lidStyle: 'flat' }).at(-0.6, 0, 0),
         cup({ rTop: 0.48, rBot: 0.4, h: 0.6, body: P(3.5, { fit: 0.3, brand: 'oak', bg: '#f4ead8', ink: '#2f3a2c', logoScale: 0.4, emblem: false }), lidStyle: 'flat' }).at(0.65, 0, -0.35),
      ],
   }),

   /* ───────── Bags ───────── */
   'bags/kraft-bags/kraft-shopping-bag': () => ({
      view: [0.6, 0.55, 1.7],
      items: [
         bag({ front: P(0.8, { brand: 'oak', kraft: true, logoScale: 0.17 }), side: M.kraft(), handles: 'twisted', handleColor: '#a77a4b' }).at(-0.9, 0, 0).turn(0.3),
         bag({ w: 1.2, h: 1.5, d: 0.6, front: P(0.8, { brand: 'oak', kraft: true, logoScale: 0.17 }), side: M.kraft(), handles: 'twisted', handleColor: '#a77a4b' }).at(0.9, 0, -0.4).turn(-0.3),
      ],
   }),
   'bags/kraft-bags/kraft-bag-with-window': () => ({
      view: [0.6, 0.6, 1.7],
      items: [
         bag({ w: 1.2, h: 1.8, d: 0.6, front: P(0.67, { brand: 'oak', kraft: true, logoScale: 0.17, logoY: 0.8, emblem: false }), side: M.kraft(), handles: 'diecut', windowMat: new THREE.MeshPhysicalMaterial({ color: '#d9a85a', roughness: 0.1, transmission: 0.3 }) }).at(-0.5, 0, 0).turn(0.25),
         bag({ w: 1.2, h: 1.8, d: 0.6, front: P(0.67, { brand: 'oak', kraft: true, logoScale: 0.17, logoY: 0.8, emblem: false }), side: M.kraft(), handles: 'diecut', windowMat: new THREE.MeshPhysicalMaterial({ color: '#8b5a2b', roughness: 0.1, transmission: 0.3 }) }).at(0.9, 0, -0.35).turn(-0.3),
      ],
   }),
   'bags/paper-bags/boutique-ribbon-bag': () => ({
      bg: 'blush',
      view: [0.6, 0.55, 1.7],
      items: [
         bag({ front: P(0.8, { brand: 'bloom', logoScale: 0.17 }), side: M.matte('#f3e6ef'), handles: 'ribbon', handleColor: '#c4558a' }).at(-0.85, 0, 0).turn(0.3),
         bag({ w: 1.2, h: 1.5, d: 0.6, front: P(0.8, { brand: 'bloom', bg: '#c4558a', ink: '#fff', logoScale: 0.17 }), side: M.matte('#c4558a'), handles: 'ribbon', handleColor: '#f3e6ef' }).at(0.9, 0, -0.4).turn(-0.3),
      ],
   }),
   'bags/paper-bags/laminated-paper-bag': () => ({
      bg: 'cool',
      view: [0.6, 0.55, 1.7],
      items: [
         bag({ front: P(0.8, { brand: 'north', logoScale: 0.17 }, { rough: 0.25, mat: { metalness: 0 } }), side: M.gloss('#1f3b57'), handles: 'rope', handleColor: '#f2c14e' }).at(-0.85, 0, 0).turn(0.3),
         bag({ w: 1.2, h: 1.5, d: 0.6, front: P(0.8, { brand: 'north', bg: '#f2c14e', ink: '#1f3b57', logoScale: 0.17 }, { rough: 0.25 }), side: M.gloss('#f2c14e'), handles: 'rope', handleColor: '#1f3b57' }).at(0.9, 0, -0.4).turn(-0.3),
      ],
   }),
   'bags/fabric-bags/canvas-tote-bag': () => ({
      bg: 'sage',
      view: [0.5, 0.55, 1.7],
      items: [
         bag({ w: 1.8, h: 2.0, d: 0.12, front: P(0.9, { brand: 'oak', bg: '#eee6d6', ink: '#2f3a2c', logoScale: 0.17 }, { rough: 1 }), side: M.fabric('#eee6d6'), handles: 'flat', handleColor: '#e3d9c6' }).at(-0.6, 0, 0).turn(0.2),
         bag({ w: 1.6, h: 1.8, d: 0.12, front: P(0.9, { brand: 'oak', bg: '#2f3a2c', ink: '#eee6d6', logoScale: 0.17 }, { rough: 1 }), side: M.fabric('#2f3a2c'), handles: 'flat', handleColor: '#2f3a2c' }).at(1.2, 0, -0.5).turn(-0.25),
      ],
   }),
   'bags/fabric-bags/cotton-drawstring-bag': () => ({
      bg: 'cool',
      view: [0.5, 0.5, 1.7],
      items: [
         bag({ w: 1.5, h: 1.9, d: 0.1, front: P(0.79, { brand: 'north', bg: '#e9e4da', ink: '#1f3b57', logoScale: 0.17 }, { rough: 1 }), side: M.fabric('#e9e4da'), handles: 'rope', handleColor: '#1f3b57' }).at(-0.4, 0, 0).turn(0.2),
         bag({ w: 1.3, h: 1.7, d: 0.1, front: P(0.79, { brand: 'north', logoScale: 0.17 }, { rough: 1 }), side: M.fabric('#1f3b57'), handles: 'rope', handleColor: '#f2c14e' }).at(1.1, 0, -0.4).turn(-0.2),
      ],
   }),
   'custom-packaging/custom-bags/custom-fabric-bags': () => ({
      bg: 'warm',
      view: [0.5, 0.55, 1.7],
      items: [
         bag({ w: 1.8, h: 2.0, d: 0.12, front: P(0.9, { brand: 'ember', bg: '#f1e9dc', ink: '#b5432a', logoScale: 0.17 }, { rough: 1 }), side: M.fabric('#f1e9dc'), handles: 'flat', handleColor: '#b5432a' }).at(-0.6, 0, 0).turn(0.2),
         bag({ w: 1.6, h: 1.8, d: 0.12, front: P(0.9, { brand: 'ember', logoScale: 0.17 }, { rough: 1 }), side: M.fabric('#b5432a'), handles: 'flat', handleColor: '#f1e9dc' }).at(1.2, 0, -0.5).turn(-0.25),
      ],
   }),
   'bags/pouches/branded-bubble-mailer': () => ({
      bg: 'blush',
      view: [0.25, 1.9, 1.1],
      items: [
         mailerBag({ face: P(0.74, { brand: 'kaya', logoScale: 0.16, pattern: 'botanical', patternAlpha: 0.25 }, { rough: 0.45 }) }).at(-0.6, 0, 0).turn(0.15),
         mailerBag({ w: 1.4, h: 1.9, face: P(0.74, { brand: 'kaya', bg: '#9a5b4c', ink: '#fff', logoScale: 0.16 }, { rough: 0.45 }) }).at(1.1, 0, -0.1).turn(-0.2),
      ],
   }),
   'bags/pouches/custom-poly-mailer': () => ({
      bg: 'cool',
      view: [0.25, 1.9, 1.1],
      items: [
         mailerBag({ puff: 0.07, face: P(0.74, { brand: 'north', logoScale: 0.16, pattern: 'stripes', patternInk: '#f2c14e', patternAlpha: 0.15 }, { rough: 0.35 }) }).at(-0.6, 0, 0).turn(0.15),
         mailerBag({ w: 1.4, h: 1.9, puff: 0.07, face: P(0.74, { brand: 'north', bg: '#f2c14e', ink: '#1f3b57', logoScale: 0.16 }, { rough: 0.35 }) }).at(1.1, 0, -0.1).turn(-0.2),
      ],
   }),

   /* ───────── Acrylic & plastic ───────── */
   'acrylic-plastic-packaging/acrylic-boxes/acrylic-boxes-with-lids': () => ({
      bg: 'cool',
      view: [0.8, 0.9, 1.6],
      items: [
         acrylicBox({ contents: sweets() }).at(-0.8, 0, 0.1).turn(0.3),
         acrylicBox({ w: 1.1, h: 0.8, d: 1.1, contents: sweets(4, ['#b9d7a3', '#f2c14e']).grow(0.7) }).at(1.1, 0, -0.4).turn(-0.3),
      ],
   }),
   'acrylic-plastic-packaging/acrylic-boxes/acrylic-cake-boxes': () => ({
      bg: 'blush',
      view: [0.8, 0.75, 1.6],
      items: [acrylicBox({ w: 1.5, h: 1.25, d: 1.5, base: M.gloss('#c4558a'), contents: cake().at(0, 0.06, 0), lidMat: M.acrylic('#ffffff') })],
   }),
   'acrylic-plastic-packaging/acrylic-boxes/acrylic-display-boxes': () => ({
      bg: 'warm',
      view: [0.7, 0.75, 1.6],
      items: [
         block(1.4, 0.18, 1.4, M.softTouch('#16130f'), 0.02).at(0, 0.09, 0),
         acrylicBox({ w: 1.2, h: 1.4, d: 1.2, lid: true, contents: perfumeBottle('#e8c9a0', '#d9b56a').at(0, 0.0, 0).grow(0.9) }).at(0, 0.18, 0),
      ],
   }),
   'acrylic-plastic-packaging/acrylic-boxes/acrylic-gift-boxes': () => ({
      bg: 'blush',
      view: [0.8, 0.9, 1.6],
      items: [acrylicBox({ w: 1.5, h: 1.0, d: 1.5, contents: sweets(9, ['#c4558a', '#f3e6ef', '#d9b56a']), lidMat: M.acrylic('#ffffff') }).turn(0.3)],
   }),
   'acrylic-plastic-packaging/acrylic-boxes/acrylic-hamper-boxes': () => ({
      bg: 'warm',
      view: [0.8, 0.9, 1.6],
      items: [acrylicBox({ w: 2.2, h: 1.2, d: 1.5, base: M.kraft(), contents: new THREE.Group().add(perfumeBottle().at(-0.6, 0.05, 0).grow(0.8), soapBar('#d9e3cf').at(0.3, 0.05, 0.3), sweets(3, ['#f2c14e', '#c4558a']).at(0.5, 0.05, -0.3).grow(0.7)), lidMat: M.acrylic('#ffffff') }).turn(0.3)],
   }),
   'acrylic-plastic-packaging/acrylic-boxes/acrylic-sweet-boxes': () => ({
      bg: 'blush',
      view: [0.8, 0.95, 1.6],
      items: [
         acrylicBox({ w: 1.3, h: 0.7, d: 1.3, contents: sweets(9, ['#e7b8a8', '#b9d7a3', '#f2c14e']).grow(0.8) }).at(-0.8, 0, 0.1).turn(0.3),
         acrylicBox({ w: 1.3, h: 0.7, d: 1.3, contents: sweets(9, ['#c4558a', '#f3e6ef']).grow(0.8) }).at(0.9, 0, -0.3).turn(-0.3),
      ],
   }),
   'acrylic-plastic-packaging/acrylic-boxes/custom-shape-acrylic-boxes': () => ({
      bg: 'cool',
      view: [0.8, 0.9, 1.6],
      items: [
         new THREE.Group().add(mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.9, 6, 1, false), M.acrylic('#ffffff', { thickness: 0.06 })).at(0, 0.45, 0), sweets(5, ['#f2c14e', '#c4558a']).grow(0.7).at(0, 0.02, 0)).at(-0.8, 0, 0),
         new THREE.Group().add(mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.1, 64), M.acrylic('#ffffff', { thickness: 0.06 })).at(0, 0.55, 0), sweets(4, ['#b9d7a3']).grow(0.6).at(0, 0.02, 0)).at(1.0, 0, -0.3),
      ],
   }),
   'acrylic-plastic-packaging/acrylic-boxes/magnetic-acrylic-boxes': () => ({
      bg: 'warm',
      view: [0.6, 1.0, 1.6],
      items: [acrylicBox({ w: 1.8, h: 0.6, d: 1.3, base: M.softTouch('#16130f'), contents: new THREE.Group().add(perfumeBottle('#e8c9a0', '#d9b56a').turn(0, -Math.PI / 2).at(0, 0.25, 0).grow(0.65)), lidMat: M.acrylic('#ffffff') }).turn(0.3)],
   }),
   'acrylic-plastic-packaging/acrylic-boxes/printed-acrylic-boxes': () => ({
      bg: 'cool',
      view: [0.8, 0.9, 1.6],
      items: [acrylicBox({ w: 1.6, h: 1.0, d: 1.6, contents: sweets(), lidMat: P(1, { brand: 'bloom', bg: '#f3e6ef', logoScale: 0.16 }, { rough: 0.2 }) }).turn(0.3)],
   }),
   'acrylic-plastic-packaging/plastic-packaging/clear-plastic-boxes': () => ({
      bg: 'cool',
      view: [0.8, 0.85, 1.6],
      items: [
         acrylicBox({ w: 1.4, h: 0.6, d: 1.0, contents: sweets(6, ['#f2c14e', '#e7b8a8']).grow(0.6) }).at(-0.8, 0, 0.1).turn(0.3),
         acrylicBox({ w: 1.4, h: 0.6, d: 1.0, contents: sweets(6, ['#b9d7a3']).grow(0.6) }).at(-0.75, 0.66, 0.05).turn(0.2),
         acrylicBox({ w: 1.0, h: 0.5, d: 0.8, contents: sweets(4, ['#c4558a']).grow(0.5) }).at(0.9, 0, -0.3).turn(-0.3),
      ],
   }),
   'acrylic-plastic-packaging/plastic-packaging/pet-boxes': () => ({
      bg: 'blush',
      view: [0.8, 0.8, 1.6],
      items: [
         acrylicBox({ w: 0.9, h: 1.5, d: 0.6, lidMat: M.matte('#9a5b4c'), contents: new THREE.Group().add(perfumeBottle('#e7b8a8', '#9a5b4c').grow(0.85)) }).at(-0.5, 0, 0).turn(0.3),
         acrylicBox({ w: 0.8, h: 1.2, d: 0.5, lidMat: M.matte('#9a5b4c'), contents: new THREE.Group().add(perfumeBottle('#f3e6ef', '#9a5b4c').grow(0.7)) }).at(0.7, 0, -0.3).turn(-0.3),
      ],
   }),
   'acrylic-plastic-packaging/plastic-packaging/plastic-gift-boxes': () => ({
      bg: 'blush',
      view: [0.8, 0.95, 1.6],
      items: [acrylicBox({ w: 1.5, h: 0.9, d: 1.5, contents: sweets(9, ['#c4558a', '#d9b56a', '#f3e6ef']), lidMat: M.acrylic('#f3d0de') }).turn(0.3)],
   }),
   'acrylic-plastic-packaging/plastic-packaging/pp-boxes': () => ({
      bg: 'cool',
      view: [0.8, 0.9, 1.6],
      items: [
         lidBox({ w: 1.6, h: 0.9, d: 1.1, base: M.frosted('#f4f4f4'), lid: M.frosted('#dfe9f2'), lidSide: M.frosted('#dfe9f2') }).at(-0.7, 0, 0.1).turn(0.3),
         lidBox({ w: 1.6, h: 0.9, d: 1.1, base: M.frosted('#f4f4f4'), lid: M.frosted('#dfe9f2'), lidSide: M.frosted('#dfe9f2') }).at(-0.65, 0.94, 0.05).turn(0.22),
         lidBox({ w: 1.2, h: 0.7, d: 0.9, base: M.frosted('#f4f4f4'), lid: M.frosted('#f2c14e'), lidSide: M.frosted('#f2c14e') }).at(1.0, 0, -0.4).turn(-0.3),
      ],
   }),
   'acrylic-plastic-packaging/plastic-packaging/pvc-boxes': () => ({
      bg: 'warm',
      view: [0.8, 0.85, 1.6],
      items: [
         acrylicBox({ w: 0.9, h: 1.4, d: 0.9, lidMat: M.acrylic('#ffffff'), base: P(1, { brand: 'ember', logo: false }), contents: new THREE.Group().add(carton({ w: 0.7, h: 1.1, d: 0.7, faces: { all: P(0.64, { brand: 'ember', logoScale: 0.22 }) } }).at(0, 0.06, 0)) }).at(-0.5, 0, 0).turn(0.3),
         acrylicBox({ w: 0.8, h: 1.0, d: 0.8, lidMat: M.acrylic('#ffffff'), contents: sweets(4, ['#b5432a', '#fff6ea']).grow(0.6) }).at(0.8, 0, -0.3).turn(-0.3),
      ],
   }),

   /* ───────── Display racks ───────── */
   'display-racks/countertop-racks/acrylic-countertop-display': () => ({
      bg: 'blush',
      view: [0.7, 0.75, 1.6],
      items: (() => {
         const a = M.acrylic('#ffffff', { thickness: 0.06 })
         const g = new THREE.Group()
         ;[[2.2, 0.06, 1.2, 0, 0.03, 0], [2.2, 0.06, 0.8, 0, 0.5, -0.2], [2.2, 0.06, 0.5, 0, 0.95, -0.35], [2.2, 1.0, 0.06, 0, 0.5, -0.6], [0.06, 1.0, 1.2, -1.07, 0.5, 0], [0.06, 1.0, 1.2, 1.07, 0.5, 0]].forEach(([w, h, d, x, y, z]) => g.add(block(w, h, d, a, 0.01).at(x, y, z)))
         ;[-0.75, -0.25, 0.25, 0.75].forEach((x, i) => {
            g.add(perfumeBottle(['#e7b8a8', '#d9b56a', '#c4558a', '#f3e6ef'][i], '#1b1b1b').grow(0.35).at(x, 0.06, 0.3))
            g.add(perfumeBottle(['#f3e6ef', '#e7b8a8', '#d9b56a', '#c4558a'][i], '#1b1b1b').grow(0.32).at(x, 0.53, -0.05))
         })
         g.add(block(2.0, 0.3, 0.02, P(6.6, { brand: 'kaya', logoScale: 0.6, emblem: false, tag: false }), 0.004).at(0, 1.2, -0.6))
         return [g]
      })(),
   }),
   'display-racks/countertop-racks/brochure-and-card-holder': () => ({
      bg: 'cool',
      view: [0.6, 0.6, 1.7],
      items: (() => {
         const a = M.acrylic('#ffffff', { thickness: 0.06 })
         const g = new THREE.Group()
         ;[-1, 0, 1].forEach((i) => {
            const slot = new THREE.Group()
            slot.add(block(1.0, 0.04, 0.5, a, 0.01).at(0, 0.02, 0))
            slot.add(block(1.0, 1.4, 0.03, a, 0.01).at(0, 0.7, 0.2))
            slot.add(block(1.0, 0.5, 0.03, a, 0.01).at(0, 0.25, -0.2).turn(0, -0.25))
            const b = block(0.95, 1.35, 0.02, { front: P(0.7, { brand: ['north', 'ember', 'oak'][i + 1], logoScale: 0.22, logoY: 0.35, text: 'Brochure', textY: 0.8, textSize: 0.12 }), all: M.white() }, 0.003)
            b.position.set(0, 0.72, 0.1)
            b.rotation.x = -0.18
            slot.add(b)
            slot.position.x = i * 1.1
            g.add(slot)
         })
         return [g]
      })(),
   }),
   'display-racks/wall-mounted-racks/floating-wall-display': () => ({
      bg: 'warm',
      wall: wallMaterial('plaster', '#ece6dc'),
      wallZ: -0.6,
      view: [0.22, 0.07, 1],
      items: (() => {
         const g = new THREE.Group()
         ;[0.9, 2.0].forEach((y) => {
            g.add(block(3.2, 0.1, 0.5, M.wood(), 0.02).at(0, y, -0.33))
            ;[-1.1, -0.35, 0.4, 1.1].forEach((x, i) => g.add(carton({ w: 0.42, h: 0.6, d: 0.32, faces: { all: P(0.7, { brand: ['oak', 'kaya', 'ember', 'bloom'][(i + Math.round(y)) % 4], logoScale: 0.26, emblem: false, tag: false }) } }).at(x, y + 0.05, -0.33)))
         })
         return [g]
      })(),
   }),

   /* ───────── Corporate ───────── */
   'corporate/promotional-products/mouse-pads': () => ({
      bg: 'cool',
      view: [0.35, 1.7, 1.2],
      items: [
         block(2.4, 0.05, 1.9, { top: P(1.26, { brand: 'nova', logoScale: 0.12, logoY: 0.82, emblem: false, pattern: 'waves', patternInk: '#35c3ff', patternAlpha: 0.35 }), all: M.matte('#11151c') }, 0.06).at(-0.3, 0.025, 0).turn(0.12),
         block(2.0, 0.05, 1.6, { top: P(1.25, { brand: 'nova', bg: '#f3f4f6', ink: '#11151c', logoScale: 0.12 }), all: M.matte('#f3f4f6') }, 0.06).at(2.2, 0.025, -0.5).turn(-0.2),
      ],
   }),
   'corporate/corporate-gifts/employee-welcome-kits': () => ({
      bg: 'sage',
      view: [0.45, 1.3, 1.3],
      items: [
         mailer({ w: 3.0, h: 0.8, d: 2.2, outside: M.matte('#1f3b57'), inside: P(1.36, { brand: 'north', bg: '#f2c14e', logo: false, pattern: 'dots', patternInk: '#1f3b57', patternAlpha: 0.2 }), top: M.matte('#1f3b57'), open: 110, contents: new THREE.Group().add(
            block(1.0, 0.12, 1.4, { top: P(0.71, { brand: 'north', logoScale: 0.16 }), all: M.matte('#efe9df') }, 0.02).at(-0.75, 0.1, 0),
            mesh(new THREE.CylinderGeometry(0.32, 0.3, 0.75, 40), M.white()).at(0.35, 0.42, -0.35),
            block(0.08, 0.06, 1.1, M.gloss('#f2c14e'), 0.02).at(0.4, 0.08, 0.5).turn(0.3),
            block(0.9, 0.06, 0.55, { top: P(1.64, { brand: 'north', logoScale: 0.2 }), all: M.matte('#1f3b57') }, 0.01).at(0.85, 0.08, 0.25).turn(-0.2)
         ) }),
      ],
   }),
}
