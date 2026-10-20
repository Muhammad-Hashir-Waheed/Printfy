// Category templates: a studio scene for every product that has no hand-tuned recipe.
// Each product gets its own brand + colourway (picked from its position) so no two match.
import * as THREE from 'three'

import { BRANDS } from '../art.js'
import { M, bag, block, cardStack, carton, cutShape, drawerBox, gableBox, hingedBox, lidBox, mailer, sheet, tissuePaper, tray, tube } from '../studio.js'
import { bannerStand, cup, letters3d, lightBox, panel, screen, screenContent, sticker, tableCover, tentCard, vessel, wallMaterial } from '../kit.js'
import {
   booklet, bottle, donut, easel, foldedBrochure, fries, grp, hangTag, hangWall, keychain, lanyard, mesh, mug, neonSign, paperRoll, pen, pizza, pouch, powerBank,
   productPacks, ribbonSpool, shelving, shield, smallBottles, stamp, sushiPiece, trophy, usbDrive, wallPoster,
} from '../kit2.js'
import { apron, cap, foldedStack, hoodie, jacket, polo, tee } from '../apparel.js'
import { P, candleJar, draw, dropperBottle, perfumeBottle, soapBar, tuckCarton } from './common.js'

/* ───────── helpers ───────── */

const ALL = ['north', 'ember', 'kaya', 'oak', 'nova', 'bloom', 'maison', 'bella', 'juno']
const FOOD = ['bella', 'ember', 'oak', 'juno']
const BEAUTY = ['kaya', 'bloom', 'maison', 'juno']
const TECH = ['nova', 'north', 'juno', 'ember']
const pick = (list, i) => list[i % list.length]
const brand = (k) => BRANDS[k]
const has = (p, ...words) => words.some((w) => p.key.includes(w))
const face = (aspect, b, extra = {}) => P(aspect, { brand: b, logoScale: 0.15, ...extra })
const wallFront = [0.22, 0.07, 1]

/** Two-product composition (hero + smaller sibling) used by many templates. */
const pair = (a, b, { gap = 1.5, view = [0.9, 0.85, 1.7], bg = 'warm', extra = {} } = {}) => ({
   bg,
   view,
   items: [a.at(-gap / 2 - 0.1, 0, 0.25).turn(0.35), b.at(gap / 2 + 0.2, 0, -0.35).turn(-0.35)],
   ...extra,
})

const art = (title, sub, colors) => (c, w, h) => {
   const g = c.createLinearGradient(0, 0, w, h)
   g.addColorStop(0, colors[0]); g.addColorStop(1, colors[1])
   c.fillStyle = g; c.fillRect(0, 0, w, h)
   c.fillStyle = 'rgba(255,255,255,0.13)'
   c.beginPath(); c.arc(w * 0.78, h * 0.4, Math.min(w, h) * 0.45, 0, 7); c.fill()
   c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'
   const lines = title.split('\n')
   let fs = Math.min(w * 0.12, h * 0.1)
   c.font = `900 ${fs}px Arial`
   const widest = Math.max(...lines.map((l) => c.measureText(l).width), 1)
   if (widest > w * 0.84) { fs *= (w * 0.84) / widest; c.font = `900 ${fs}px Arial` }
   lines.forEach((l, i) => c.fillText(l, w / 2, h * 0.42 - ((lines.length - 1) * fs * 1.15) / 2 + i * fs * 1.15))
   if (sub) { c.font = `400 ${Math.min(w * 0.045, h * 0.045)}px Arial`; c.fillText(sub, w / 2, h * 0.86) }
}

const lines = (ink = 'rgba(30,30,30,0.22)', top = 0.3, n = 12) => (c, w, h) => {
   c.fillStyle = ink
   for (let i = 0; i < n; i++) c.fillRect(w * 0.12, h * (top + i * 0.045), w * (i % 4 === 3 ? 0.45 : 0.76), Math.max(2, h * 0.008))
}

const signText = (text, { bg = '#11151c', ink = '#ffffff', icon, size = 0.34 } = {}) => (c, w, h) => {
   c.fillStyle = bg; c.fillRect(0, 0, w, h)
   c.fillStyle = ink; c.textBaseline = 'middle'
   let x = w * 0.08
   if (icon) { c.font = `900 ${h * 0.55}px Arial`; c.fillText(icon, x, h * 0.53); x = w * 0.3 }
   c.font = `800 ${h * size}px Arial`
   c.fillText(text, x, h * 0.53, w - x - w * 0.06)
}

/* ───────── templates by category ───────── */

const T = {}

/* Packaging */
T['packaging/corrugated-boxes'] = (p) => {
   const b = pick(['oak', 'north', 'ember', 'nova', 'juno', 'bella'], p.index)
   const big = has(p, 'heavy', 'moving')
   const cube = has(p, 'cube')
   const w = cube ? 1.5 : big ? 2.4 : 2.1, h = cube ? 1.5 : big ? 1.7 : 1.3, d = cube ? 1.5 : 1.5
   const tape = (c, W, H) => { c.fillStyle = 'rgba(200,170,120,0.9)'; c.fillRect(0, H * 0.44, W, H * 0.12) }
   const front = has(p, 'moving') ? P(w / h, { kraft: true, logo: false, draw: (c, W, H) => { c.fillStyle = 'rgba(30,20,10,0.75)'; c.beginPath(); c.ellipse(W / 2, H * 0.22, W * 0.09, H * 0.05, 0, 0, 7); c.fill(); c.font = `800 ${H * 0.1}px Arial`; c.textAlign = 'center'; c.fillText('KITCHEN · FRAGILE', W / 2, H * 0.6) } })
      : has(p, 'e-flute') ? face(w / h, b, { logoScale: 0.17, pattern: 'dots', patternAlpha: 0.15 }) : P(w / h, { brand: b, kraft: true, logoScale: 0.17 })
   if (has(p, 'tray-and-lid')) return pair(lidBox({ w: 2.2, h: 1.0, d: 1.6, base: M.kraft(), lid: P(1.37, { brand: b, kraft: true, logoScale: 0.15 }) }), lidBox({ w: 2.2, h: 1.0, d: 1.6, base: M.kraft(), lid: P(1.37, { brand: b, kraft: true, logoScale: 0.15 }), lidPos: 'beside', contents: tissuePaper(2.0, 1.4, '#efe6d6').at(0, 0.65, 0) }), { gap: 2.6 })
   return pair(
      carton({ w, h, d, faces: { all: M.kraft(), front, top: P(w / d, { kraft: true, logo: false, draw: tape }) } }),
      carton({ w: w * 0.7, h: h * 0.7, d: d * 0.7, faces: { all: M.kraft(), front: P(w / h, { brand: b, kraft: true, logoScale: 0.17 }) } }),
      { gap: w * 1.05 }
   )
}

T['packaging/mailer-boxes'] = (p) => {
   const b = pick(['ember', 'bloom', 'oak'], p.index)
   const B = brand(b)
   return pair(
      mailer({ outside: M.matte(B.paper), top: face(1.3, b, { pattern: 'confetti', patternAlpha: 0.2 }) }),
      mailer({ outside: M.matte(B.paper), inside: P(1, { brand: b, bg: '#fff8ef', logo: false, pattern: 'confetti', patternAlpha: 0.5 }), top: M.matte(B.paper), open: 110, tissue: '#fffaf2', contents: grp(soapBar('#e9dcc6').at(-0.5, 0.05, 0), candleJar('#efe6d6').at(0.5, 0.05, 0).grow(0.7)) }),
      { gap: 2.9 }
   )
}

T['packaging/rigid-boxes'] = (p) => {
   if (has(p, 'magnetic')) return { view: [0.6, 1.1, 1.6], items: [hingedBox({ w: 2.0, h: 0.75, d: 2.2, outside: M.softTouch('#16130f'), cover: face(0.9, 'maison', { logoScale: 0.14 }), inside: M.matte('#efe1c8'), openDeg: 105, hinge: 'back', contents: perfumeBottle('#e8c9a0', '#d9b56a').at(0, 0.05, 0.1).grow(0.8) }).turn(0.3)] }
   if (has(p, 'sleeve')) return { bg: 'sage', view: [0.9, 1.0, 1.6], items: [drawerBox({ w: 2.0, h: 0.8, d: 2.0, sleeve: face(1, 'oak', { bg: '#e8dcc8', ink: '#2f3a2c' }), drawer: M.matte('#2f3a2c'), inside: M.matte('#d9c39a'), pull: 0.3, ribbon: '#d9c39a' }).turn(0.5)] }
   return pair(lidBox({ w: 2, h: 0.9, d: 2, base: M.softTouch('#1b1a1c'), lid: face(1, 'juno', { bg: '#1b1a1c', ink: '#f4f1ea' }), ribbon: '#d42f25' }), lidBox({ w: 1.4, h: 0.7, d: 1.4, base: M.matte('#d42f25'), lid: M.matte('#d42f25'), lidPos: 'beside', contents: tissuePaper(1.3, 1.3, '#f6f2ee').at(0, 0.45, 0) }), { gap: 2.4 })
}

T['packaging/folding-cartons'] = (p) => {
   if (has(p, 'gable')) return pair(gableBox({ mat: face(1.2, 'bloom', { pattern: 'dots', patternAlpha: 0.25, logo: false }), frontMat: face(1.2, 'bloom', { pattern: 'dots', patternAlpha: 0.25 }) }), gableBox({ w: 1.3, h: 1.1, d: 0.9, roof: 0.6, mat: M.matte('#c4558a'), frontMat: face(1.2, 'bloom', { bg: '#c4558a', ink: '#fff' }) }), { gap: 2.0, bg: 'blush' })
   const b = has(p, 'cosmetic', 'makeup') ? pick(['kaya', 'bloom'], p.index) : 'north'
   const B = brand(b)
   const set = has(p, 'cosmetic-set')
   return pair(
      tuckCarton({ w: set ? 1.6 : 0.85, h: set ? 1.1 : 1.6, d: set ? 0.5 : 0.6, faces: { all: face(set ? 1.45 : 0.53, b, { logoScale: 0.2 }), top: M.matte(B.paper) } }),
      tuckCarton({ w: set ? 1.6 : 0.85, h: set ? 1.1 : 1.6, d: set ? 0.5 : 0.6, faces: { all: face(set ? 1.45 : 0.53, b, { bg: '#ffffff', ink: B.accent, logoScale: 0.2 }), top: M.white() }, flapMat: M.white(), open: 110 }),
      { gap: set ? 2.2 : 1.4, bg: b === 'north' ? 'cool' : 'blush' }
   )
}

T['packaging/kraft-boxes'] = (p) => {
   if (has(p, 'shipping')) return T['packaging/corrugated-boxes']({ ...p, index: 0, key: p.key })
   return pair(lidBox({ w: 1.6, h: 0.8, d: 1.6, base: M.kraft(), lid: P(1, { brand: 'oak', kraft: true, logoScale: 0.15 }), ribbon: '#2f3a2c' }), lidBox({ w: 1.6, h: 0.8, d: 1.6, base: M.kraft(), lid: P(1, { brand: 'oak', kraft: true, logoScale: 0.15 }), lidPos: 'beside', contents: tissuePaper(1.5, 1.5, '#efe6d6').at(0, 0.5, 0) }), { gap: 2.0 })
}

/* Food */
T['food-packaging/food-boxes'] = (p) => {
   const b = pick(FOOD, p.index)
   const B = brand(b)
   if (has(p, 'pizza')) {
      const lid = has(p, 'kraft') ? P(1, { brand: b, kraft: true, logoScale: 0.16 }) : face(1, b, { pattern: 'stripes', patternAlpha: 0.12 })
      const base = has(p, 'kraft') ? M.kraft() : M.white()
      return { view: [0.6, 1.2, 1.5], items: [lidBox({ w: 2.4, h: 0.32, d: 2.4, lidH: 0.3, base, lid }).at(-1.4, 0, 0.2).turn(0.3), lidBox({ w: 2.4, h: 0.32, d: 2.4, lidH: 0.3, base, lid, lidPos: 'beside', inside: base, contents: pizza(1.0).at(0, 0.03, 0) }).at(1.0, 0, -0.4).turn(-0.2)] }
   }
   if (has(p, 'burger')) return pair(mailer({ w: 1.4, h: 0.8, d: 1.4, outside: face(1.75, b, { logo: false }), top: face(1, b), inside: M.kraft() }), mailer({ w: 1.4, h: 0.8, d: 1.4, outside: face(1.75, b, { logo: false }), top: M.matte(B.paper), inside: M.kraft(), open: 100 }), { gap: 2.0 })
   if (has(p, 'fries')) return pair(grp(block(0.8, 1.0, 0.45, { all: face(0.8, b, { logoScale: 0.22 }), top: M.matte(B.paper) }, 0.02).at(0, 0.5, 0), fries().at(0, 0.35, 0)), grp(block(0.8, 1.0, 0.45, { all: face(0.8, b, { logoScale: 0.22, bg: '#fff8ef', ink: B.paper }) }, 0.02).at(0, 0.5, 0), fries().at(0, 0.35, 0)), { gap: 1.3 })
   if (has(p, 'donut')) return { bg: 'blush', view: [0.6, 1.3, 1.4], items: [lidBox({ w: 2.4, h: 0.4, d: 1.6, lidH: 0.3, base: M.white(), lid: face(1.5, 'bloom', { pattern: 'dots', patternAlpha: 0.25 }), lidPos: 'beside', inside: M.white(), contents: grp(...[-0.75, 0, 0.75].flatMap((x, i) => [donut(['#e7b8a8', '#c4558a', '#6b4226'][i]).at(x, 0.05, -0.35), donut(['#f2c14e', '#e7b8a8', '#c4558a'][i]).at(x, 0.05, 0.35)])) })] }
   if (has(p, 'noodle')) return pair(grp(mesh(new THREE.CylinderGeometry(0.62, 0.45, 1.1, 4, 1), face(1.2, b, { logoScale: 0.2 })).turn(Math.PI / 4).at(0, 0.55, 0), mesh(new THREE.TorusGeometry(0.32, 0.015, 8, 32, Math.PI), M.metal('#cfd2d6')).at(0, 1.1, 0)), grp(mesh(new THREE.CylinderGeometry(0.62, 0.45, 1.1, 4, 1), M.matte(B.paper)).turn(Math.PI / 4).at(0, 0.55, 0)), { gap: 1.8 })
   // bakery window box
   return pair(lidBox({ w: 1.8, h: 0.8, d: 1.4, base: M.white(), lid: P(1.3, { brand: b, bg: '#ffffff', ink: B.paper, logoScale: 0.1, logoY: 0.82, emblem: false, draw: draw.window('#f6e7c8', ['#e7b8a8', '#d9a35a', '#c4558a', '#f2c14e']) }) }), lidBox({ w: 1.8, h: 0.8, d: 1.4, base: M.white(), lid: M.white(), lidPos: 'beside', inside: M.white(), contents: grp(...[-0.5, 0, 0.5].map((x, i) => donut(['#e7b8a8', '#d9a35a', '#c4558a'][i]).at(x, 0.05, 0))) }), { gap: 2.4, bg: 'blush' })
}

T['food-packaging/food-containers'] = (p) => {
   const b = pick(FOOD, p.index)
   const clear = M.acrylic('#ffffff', { thickness: 0.04 })
   const food = grp(mesh(new THREE.SphereGeometry(0.45, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.matte('#8fb339')).grow(1).at(-0.2, 0.08, 0), mesh(new THREE.SphereGeometry(0.3, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.matte('#e76f51')).at(0.35, 0.08, 0.15))
   if (has(p, 'sushi')) return { view: [0.6, 1.1, 1.5], items: [block(2.4, 0.08, 1.4, M.gloss('#111'), 0.04).at(0, 0.04, 0), ...[...Array(8)].map((_, i) => sushiPiece(['#f08a5d', '#f6f2ea', '#e76f51', '#2b2b2b'][i % 4]).at(-0.9 + (i % 4) * 0.6, 0.08, i < 4 ? -0.3 : 0.3)), mesh(new THREE.BoxGeometry(2.45, 0.5, 1.45), clear).at(0, 0.33, 0), block(1.0, 0.02, 0.5, face(2, b, { logoScale: 0.3, emblem: false }), 0.005).at(0, 0.6, 0)] }
   if (has(p, 'salad')) return pair(grp(cup({ rTop: 0.85, rBot: 0.65, h: 0.55, body: P(5, { brand: b, kraft: true, logoScale: 0.4, emblem: false, fit: 0.3 }), lidStyle: 'dome' }), food.clone().grow(0.9).at(0, 0.1, 0)), cup({ rTop: 0.7, rBot: 0.55, h: 0.45, body: P(5, { kraft: true, logo: false }), lidStyle: 'dome' }), { gap: 2.0 })
   if (has(p, 'catering', 'meal-tray', 'compartment')) {
      const big = has(p, 'catering')
      const w = big ? 3 : 2.0, d = big ? 2 : 1.4
      const t = grp(tray(w, 0.35, d, has(p, 'kraft') ? M.kraft() : M.matte('#1b1b1b'), has(p, 'kraft') ? M.kraft() : M.matte('#1b1b1b'), 0.03), block(0.03, 0.33, d, has(p, 'kraft') ? M.kraft() : M.matte('#1b1b1b'), 0.003).at(-w * 0.15, 0.17, 0), block(w * 0.35, 0.33, 0.03, has(p, 'kraft') ? M.kraft() : M.matte('#1b1b1b'), 0.003).at(w * 0.16, 0.17, 0), food.clone().grow(0.8).at(-w * 0.33, 0.02, 0))
      return { view: [0.6, 1.2, 1.5], items: [t.at(-0.4, 0, 0.2).turn(0.2), block(w + 0.04, 0.12, d + 0.04, { top: has(p, 'kraft') ? P(w / d, { brand: b, kraft: true, logoScale: 0.12 }) : clear, all: has(p, 'kraft') ? M.kraft() : clear }, 0.02).at(1.6, 0.06, -1.2).turn(-0.3)] }
   }
   // hinged clamshell
   return pair(grp(block(1.5, 0.45, 1.3, M.white(), 0.12).at(0, 0.22, 0), block(1.5, 0.35, 1.3, { top: face(1.15, b, { bg: '#ffffff', ink: brand(b).paper, logoScale: 0.16 }), all: M.white() }, 0.14).at(0, 0.62, 0)), grp(tray(1.5, 0.45, 1.3, M.white(), M.white(), 0.04), food.clone().grow(0.6).at(0, 0.02, 0)), { gap: 2.0 })
}

T['food-packaging/food-bags'] = (p) => {
   const b = pick(FOOD, p.index)
   if (has(p, 'coffee')) return pair(pouch({ face: face(0.72, 'ember', { logoScale: 0.18 }) }), pouch({ w: 1.0, h: 1.4, face: P(0.72, { brand: 'ember', kraft: true, logoScale: 0.18 }) }), { gap: 1.6 })
   const kraft = has(p, 'kraft', 'sos', 'grease')
   const handles = has(p, 'takeout', 'grease') ? 'twisted' : 'diecut'
   return pair(bag({ w: 1.4, h: 1.9, d: 0.8, front: kraft ? P(0.74, { brand: b, kraft: true, logoScale: 0.18 }) : face(0.74, b), side: kraft ? M.kraft() : M.matte(brand(b).paper), handles, handleColor: '#8f6840' }), bag({ w: 1.0, h: 1.4, d: 0.6, front: kraft ? P(0.74, { brand: b, kraft: true, logoScale: 0.18 }) : face(0.74, b), side: kraft ? M.kraft() : M.matte(brand(b).paper), handles, handleColor: '#8f6840' }), { gap: 1.8, view: [0.6, 0.6, 1.7] })
}

T['food-packaging/cups'] = (p) => {
   const b = pick(['ember', 'bella', 'oak', 'bloom', 'north', 'kaya'], p.index)
   const B = brand(b)
   const body = (bg, ink) => P(3.2, { brand: b, bg, ink, logoScale: 0.32, emblem: false, fit: 0.3 })
   if (has(p, 'smoothie')) return pair(grp(cup({ rTop: 0.45, rBot: 0.34, h: 1.4, body: M.acrylic('#ffffff', { thickness: 0.02 }), lidStyle: 'dome' }), mesh(new THREE.CylinderGeometry(0.43, 0.33, 1.25, 48), M.matte('#e7849a')).at(0, 0.64, 0), mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 12), M.gloss('#1f3b57')).at(0.1, 1.5, 0).turn(0, 0, 0.12)), cup({ rTop: 0.4, rBot: 0.3, h: 1.1, body: M.acrylic('#ffffff', { thickness: 0.02 }), lidStyle: 'flat' }), { gap: 1.3, bg: 'blush' })
   if (has(p, 'ice-cream')) return pair(grp(cup({ rTop: 0.5, rBot: 0.36, h: 0.55, body: body(B.paper, B.ink), lidStyle: 'none' }), mesh(new THREE.SphereGeometry(0.45, 32, 16), M.matte('#f3d6e0')).at(0, 0.7, 0)), cup({ rTop: 0.45, rBot: 0.32, h: 0.5, body: body('#ffffff', B.paper), lidStyle: 'flat' }), { gap: 1.3, bg: 'blush' })
   if (has(p, 'cold')) return pair(grp(cup({ rTop: 0.45, rBot: 0.33, h: 1.45, body: body(B.paper, B.ink), lidStyle: 'flat' }), mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 12), M.gloss('#d42f25')).at(0.08, 1.7, 0).turn(0, 0, 0.1)), cup({ rTop: 0.4, rBot: 0.3, h: 1.2, body: body('#ffffff', B.paper), lidStyle: 'flat' }), { gap: 1.3 })
   const wall = has(p, 'double') ? 'ribbed' : null
   return pair(cup({ body: wall ? P(3.2, { brand: b, bg: B.paper, ink: B.ink, pattern: 'stripes', patternAlpha: 0.12, logoScale: 0.32, emblem: false, fit: 0.3 }) : body(B.paper, B.ink), lid: '#1b1b1b' }), cup({ rTop: 0.36, rBot: 0.27, h: 1.0, body: body('#ffffff', B.paper) }), { gap: 1.3 })
}

T['food-packaging/food-accessories'] = (p) => {
   const b = pick(FOOD, p.index)
   if (has(p, 'wine')) return pair(grp(block(0.9, 2.6, 0.9, { all: P(0.35, { brand: 'maison', kraft: true, logoScale: 0.3 }) }, 0.02).at(0, 1.3, 0), block(0.5, 0.25, 0.92, M.kraft(), 0.02).at(0, 2.75, 0)), vessel({ kind: 'wine', label: P(1.7, { brand: 'maison', logoScale: 0.3, fit: 0.5 }), cap: '#d9b56a' }).turn(0.45), { gap: 1.6, bg: 'warm' })
   if (has(p, '4-bottle')) {
      const c = grp(tray(1.6, 1.1, 1.2, P(1.45, { brand: b, kraft: true, logoScale: 0.18 }), M.kraft(), 0.03), block(0.03, 1.6, 1.15, M.kraft(), 0.004).at(0, 0.8, 0), block(1.55, 1.0, 0.03, M.kraft(), 0.004).at(0, 0.5, 0))
      for (const [x, z] of [[-0.4, -0.3], [0.4, -0.3], [-0.4, 0.3], [0.4, 0.3]]) c.add(grp(mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.3, 32), M.gloss('#3b2416')).at(0, 0.65, 0), mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.4, 24), M.gloss('#3b2416')).at(0, 1.5, 0)).at(x, 0.02, z))
      return { view: [0.8, 0.8, 1.6], items: [c.turn(0.35)] }
   }
   if (has(p, 'liners')) return { view: [0.4, 1.4, 1.3], items: [tray(2.4, 0.18, 1.8, M.gloss('#c8362b'), M.gloss('#c8362b'), 0.05).turn(0.2), block(2.2, 0.01, 1.6, { top: face(1.375, b, { pattern: 'grid', patternAlpha: 0.3, logoScale: 0.12, bg: '#f6efe3', ink: brand(b).paper }), all: M.white() }, 0.002).at(0, 0.06, 0).turn(0.2), fries().grow(0.6).at(0.3, -0.05, 0.1)] }
   // cutlery pouch
   return { view: [0.3, 1.7, 1.1], items: [0, 1].map((i) => grp(block(0.45, 0.05, 1.7, { top: face(0.26, b, { logoScale: 0.3, logoY: 0.6, emblem: false }), all: M.kraft() }, 0.02).at(0, 0.03, 0), block(0.06, 0.03, 0.5, M.metal('#cfd2d6', 0.25), 0.01).at(0, 0.03, -1.0)).at(i * 0.8 - 0.4, 0, i * 0.1).turn(0.15 - i * 0.3)) }
}

/* Retail packaging */
T['retail-packaging/product-boxes'] = (p) => {
   if (has(p, 'jewelry')) return pair(lidBox({ w: 1.0, h: 0.5, d: 1.0, base: M.softTouch('#3c2a4d'), lid: face(1, 'bloom', { bg: '#3c2a4d', ink: '#e7c9a0', logoScale: 0.18 }) }), lidBox({ w: 1.0, h: 0.5, d: 1.0, base: M.softTouch('#3c2a4d'), lid: M.softTouch('#3c2a4d'), lidPos: 'beside', inside: M.fabric('#1b1220'), contents: grp(mesh(new THREE.TorusGeometry(0.18, 0.04, 16, 48), M.foil('#e7c9a0', 0.15)).at(0, 0.4, 0)) }), { gap: 1.6, bg: 'blush', view: [0.8, 1.0, 1.6] })
   if (has(p, 'apparel')) return pair(lidBox({ w: 2.4, h: 0.45, d: 1.8, base: M.white(), lid: face(1.33, 'north', { logoScale: 0.14 }) }), lidBox({ w: 2.4, h: 0.45, d: 1.8, base: M.white(), lid: M.matte('#1f3b57'), lidPos: 'beside', inside: M.white(), contents: grp(tissuePaper(2.2, 1.6, '#f6f2ee').at(0, 0.28, 0), block(1.6, 0.14, 1.2, M.fabric('#d9cfc0'), 0.06).at(0, 0.32, 0)) }), { gap: 3.4, view: [0.6, 1.1, 1.6] })
   if (has(p, 'electronics')) return pair(lidBox({ w: 1.6, h: 0.5, d: 1.0, base: M.softTouch('#11151c'), lid: face(1.6, 'nova', { logoScale: 0.16 }) }), lidBox({ w: 1.6, h: 0.5, d: 1.0, base: M.softTouch('#11151c'), lid: M.softTouch('#11151c'), lidPos: 'beside', inside: M.softTouch('#1b1b1d'), contents: block(0.7, 0.06, 0.8, { top: P(0.9, { bg: '#0b0b0c', logo: false, draw: (c, w, h) => { c.fillStyle = '#1d4ed8'; c.fillRect(w * 0.06, h * 0.05, w * 0.88, h * 0.9) } }), all: M.matte('#0b0b0c') }, 0.05).at(0, 0.42, 0) }), { gap: 2.4, bg: 'cool', view: [0.8, 1.0, 1.6] })
   if (has(p, 'vape')) return pair(carton({ w: 0.6, h: 1.2, d: 0.35, faces: { all: face(0.5, 'nova', { gradient: ['#7a4cff', '#11151c'], logoScale: 0.2 }) } }), carton({ w: 0.45, h: 0.8, d: 0.3, faces: { all: face(0.56, 'nova', { gradient: ['#35c3ff', '#11151c'], logoScale: 0.2, text: 'MINT · 10ml', textY: 0.85, textSize: 0.1 }) } }), { gap: 1.0, bg: 'cool' })
   if (has(p, 'sweet')) return { bg: 'warm', view: [0.6, 1.2, 1.5], items: [lidBox({ w: 2.2, h: 0.45, d: 1.6, base: M.matte('#c8362b'), lid: P(1.37, { brand: 'bella', bg: '#c8362b', ink: '#f2c14e', logoScale: 0.1, logoY: 0.82, emblem: false, draw: draw.window('#f6e7c8', ['#f2c14e', '#e8a23a', '#f6e7c8', '#d9a35a']) }) }).at(-1.4, 0, 0.2).turn(0.3), lidBox({ w: 2.2, h: 0.45, d: 1.6, base: M.matte('#c8362b'), lid: M.matte('#c8362b'), lidPos: 'beside', inside: M.foil('#d9b56a', 0.35), contents: grp(...[...Array(6)].map((_, i) => block(0.42, 0.18, 0.42, M.matte(['#f2c14e', '#e8a23a', '#f6e7c8'][i % 3]), 0.08).at(-0.6 + (i % 3) * 0.6, 0.15, i < 3 ? -0.3 : 0.3))) }).at(1.0, 0, -0.4).turn(-0.2)] }
   if (has(p, 'tissue')) return pair(grp(block(1.8, 0.9, 1.0, { all: face(2, 'juno', { pattern: 'waves', patternAlpha: 0.2 }), top: P(1.8, { brand: 'juno', logo: false, pattern: 'waves', patternAlpha: 0.2, draw: (c, w, h) => { c.fillStyle = '#e9e4da'; c.beginPath(); c.ellipse(w / 2, h / 2, w * 0.3, h * 0.2, 0, 0, 7); c.fill() } }) }, 0.03).at(0, 0.45, 0), mesh(new THREE.ConeGeometry(0.25, 0.5, 4, 1, true), new THREE.MeshStandardMaterial({ color: '#fff', side: 2, roughness: 1 })).at(0, 1.1, 0)), carton({ w: 1.0, h: 1.1, d: 1.0, faces: { all: face(0.9, 'juno', { logoScale: 0.2 }) } }), { gap: 2.2, bg: 'cool' })
   return null
}

T['retail-packaging/display-boxes'] = () => ({
   bg: 'warm',
   view: [0.6, 0.9, 1.6],
   items: [grp(tray(2.4, 0.5, 1.0, face(4.8, 'oak', { kraft: true, logoScale: 0.6, emblem: false }), M.kraft(), 0.03, ['front']), block(2.4, 0.25, 0.03, { front: P(9.6, { brand: 'oak', kraft: true, logoScale: 0.7, emblem: false, tag: false }), all: M.kraft() }, 0.003).at(0, 0.12, 0.49), productPacks({ n: 5, spacing: 0.45, faces: [face(0.64, 'oak', { bg: '#e8dfcf', ink: '#2f3a2c', logoScale: 0.3, emblem: false, tag: false })] }).at(0, 0.03, 0))],
})

T['retail-packaging/inserts'] = (p) => {
   const b = pick(['kaya', 'north', 'ember'], p.index)
   const B = brand(b)
   const text = has(p, 'thank') ? 'thank you' : has(p, 'care') ? 'care guide' : '15% OFF'
   const card = P(0.7, { brand: b, bg: '#fff8ef', ink: B.accent === '#ffffff' ? B.paper : B.accent, logoScale: 0.14, logoY: 0.3, text, textFont: has(p, 'promo') ? 'Arial' : 'Georgia', textSize: 0.14, textY: 0.7, draw: has(p, 'promo') ? (c, w, h) => { c.fillStyle = '#111'; for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) if ((x * 3 + y * 5 + x * y) % 3) c.fillRect(w * 0.38 + x * w * 0.035, h * 0.78 + y * w * 0.035, w * 0.03, w * 0.03) } : null })
   return { bg: has(p, 'thank') ? 'blush' : 'warm', view: [0.45, 1.4, 1.3], items: [mailer({ w: 2.4, h: 0.75, d: 1.8, outside: M.matte(B.paper), inside: M.white(), open: 112, tissue: '#fffaf2' }).at(0.4, 0, -0.4), sheet({ w: 1.0, h: 1.4, t: 0.012, front: card }).at(-1.2, 0, 0.6).turn(0.2), sheet({ w: 1.0, h: 1.4, t: 0.012, front: card }).at(0.4, 0.62, -0.1).turn(-0.15)] }
}

T['retail-packaging/specialty-packaging'] = (p) => {
   const b = pick(['bloom', 'oak', 'kaya', 'north', 'maison', 'ember', 'oak', 'bloom'], p.index)
   const B = brand(b)
   if (has(p, 'ribbon')) return pair(ribbonSpool({ face: P(4, { brand: b, bg: B.accent, ink: '#fff', pattern: null, logoScale: 0.4, emblem: false, tag: false }) }), ribbonSpool({ face: P(4, { brand: 'maison', logoScale: 0.4, emblem: false, tag: false }), color: '#16130f' }), { gap: 1.8 })
   if (has(p, 'hang-tags', 'product-tags')) {
      const kraft = has(p, 'kraft')
      const f = (i) => (kraft ? P(0.6, { brand: 'oak', kraft: true, logoScale: 0.18 }) : face(0.6, b, { logoScale: 0.18, bg: i ? '#ffffff' : B.paper, ink: i ? B.accent : B.ink }))
      return { bg: kraft ? 'warm' : 'blush', view: [0.3, 1.7, 1.1], items: [0, 1, 2].map((i) => hangTag({ w: 0.7, h: 1.15, face: f(i % 2), string: kraft ? '#d9c39a' : B.accent }).at((i - 1) * 0.9, 0, i === 1 ? -0.2 : 0.2).turn((i - 1) * 0.25)) }
   }
   if (has(p, 'wrapping')) {
      const f = has(p, 'kraft') ? P(2.4, { brand: 'oak', kraft: true, pattern: 'monogram', patternInk: '#2f3a2c', patternAlpha: 0.5, logo: false }) : P(2.4, { brand: b, pattern: 'confetti', patternAlpha: 0.6, logo: false })
      return { view: [0.8, 1.0, 1.6], items: [paperRoll({ face: f }).at(-0.3, 0, -0.8), lidBox({ w: 1.2, h: 0.8, d: 1.2, base: f, lid: f, lidSide: f, ribbon: has(p, 'kraft') ? '#2f3a2c' : B.accent }).at(1.6, 0, 0.6).turn(-0.3)] }
   }
   // pattern tissue
   const t = tissuePaper(2.3, 1.7, '#ffffff')
   t.material = P(1.35, { brand: b, bg: B.paper, pattern: 'dots', patternInk: B.accent, patternAlpha: 0.6, logo: false }, { rough: 0.95 })
   t.material.side = 2
   return { bg: 'blush', view: [0.45, 1.4, 1.3], items: [mailer({ w: 2.6, h: 0.8, d: 2, outside: M.white('#f6f2ee'), inside: M.matte(B.paper), open: 112, contents: t.at(0, 0.62, 0) })] }
}

/* Display racks */
const rackFaces = (brands) => brands.map((b) => P(0.64, { brand: b, logoScale: 0.3, emblem: false, tag: false }))
T['display-racks/cosmetic-beauty-racks'] = (p) => {
   const b = pick(['kaya', 'bloom', 'maison', 'kaya', 'bloom'], p.index)
   const B = brand(b)
   const lit = has(p, 'lit', 'skincare', 'perfume')
   const items = (i) => (has(p, 'perfume') ? grp(...[-0.75, -0.25, 0.25, 0.75].map((x, k) => perfumeBottle(['#e7b8a8', '#d9b56a', '#c4558a', '#f3e6ef'][(k + i) % 4], '#1b1b1b').grow(0.32).at(x, 0, 0))) : smallBottles({ n: has(p, 'nail') ? 8 : 6, spacing: has(p, 'nail') ? 0.22 : 0.3, colors: has(p, 'nail') ? ['#c4558a', '#d42f25', '#f2c14e', '#7a4cff', '#35c3ff'] : ['#e7b8a8', '#f3e6ef', '#c98a7a'] }))
   return { bg: 'blush', view: [0.5, 0.35, 1.6], pad: 0.95, aimY: 1, items: [shelving({ w: has(p, 'nail') ? 1.8 : 2.2, h: has(p, 'gondola') ? 3.6 : 3.0, d: 0.8, shelves: 4, side: M.matte(B.paper), back: face(0.7, b, { logo: false, pattern: 'botanical', patternAlpha: 0.15 }), header: face(4, b, { logoScale: 0.5, emblem: false, tag: false }), lit, shelf: M.acrylic('#ffffff', { thickness: 0.04 }), items }).turn(0.25)] }
}
T['display-racks/floor-standing-racks'] = (p) => {
   const b = pick(['ember', 'bella', 'nova', 'ember', 'nova'], p.index)
   const items = (i) => (has(p, 'pharmacy') ? productPacks({ n: 5, faces: [P(0.64, { bg: '#ffffff', logo: false, draw: draw.rx('VITALIS', 'supplement', ['#2a9d8f', '#e76f51', '#7a4cff'][i % 3]) })] }) : has(p, 'mobile') ? productPacks({ n: 5, w: 0.3, h: 0.45, d: 0.06, faces: rackFaces(['nova', 'north']) }) : productPacks({ n: 5, faces: rackFaces([b, 'oak', 'bella'].slice(i % 2)) }))
   return { bg: 'warm', view: [0.5, 0.35, 1.6], pad: 0.95, aimY: 1, items: [shelving({ w: has(p, 'gondola') ? 3.2 : 2.4, h: 3.4, d: 0.9, shelves: 5, side: has(p, 'snack') ? M.metal('#2a2a2a', 0.5) : M.white(), header: face(5, b, { logoScale: 0.55, emblem: false, tag: false }), shelf: has(p, 'snack') ? M.metal('#2a2a2a', 0.5) : M.white(), items }).turn(0.25)] }
}
T['display-racks/countertop-racks'] = (p) => {
   if (has(p, 'rotating')) {
      const g = grp(mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.6, 16), M.metal('#cfd2d6', 0.3)).at(0, 1.4, 0), mesh(new THREE.CylinderGeometry(0.6, 0.7, 0.1, 48), M.matte('#1b1b1b')).at(0, 0.05, 0))
      for (let r = 0; r < 3; r++) for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2; g.add(block(0.32, 0.45, 0.04, { front: P(0.7, { brand: ALL[(k + r) % 9], logoScale: 0.3, emblem: false, tag: false }), all: M.white() }, 0.01).at(Math.sin(a) * 0.32, 0.6 + r * 0.7, Math.cos(a) * 0.32).turn(a)) }
      return { bg: 'cool', view: [0.6, 0.45, 1.6], items: [g, block(0.8, 0.3, 0.04, { front: face(2.7, 'north', { logoScale: 0.3, emblem: false, tag: false }), all: M.white() }, 0.01).at(0, 2.85, 0)] }
   }
   if (has(p, 'tiered')) return { bg: 'blush', view: [0.6, 0.6, 1.6], items: [grp(...[0, 1, 2].map((i) => mesh(new THREE.CylinderGeometry(1.0 - i * 0.28, 1.0 - i * 0.28, 0.05, 64), M.white()).at(0, 0.3 + i * 0.55, 0)), mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.4, 16), M.foil('#d9b56a', 0.25)).at(0, 0.8, 0), ...[0, 1, 2].flatMap((i) => [...Array(6 - i * 2)].map((_, k) => { const a = (k / (6 - i * 2)) * Math.PI * 2, rr = 0.75 - i * 0.28; return lipBalmish(['#e7b8a8', '#c4558a', '#f3e6ef'][k % 3]).at(Math.cos(a) * rr, 0.33 + i * 0.55, Math.sin(a) * rr) })), block(1.2, 0.36, 0.04, { front: face(3.3, 'kaya', { logoScale: 0.4, emblem: false, tag: false }), all: M.white() }, 0.01).at(0, 1.75, 0))] }
   // checkout counter rack
   return { bg: 'warm', view: [0.6, 0.6, 1.6], items: [shelving({ w: 1.6, h: 1.6, d: 0.6, shelves: 3, side: M.metal('#2a2a2a', 0.5), header: face(3.2, 'ember', { logoScale: 0.45, emblem: false, tag: false }), shelf: M.metal('#2a2a2a', 0.5), items: () => productPacks({ n: 4, spacing: 0.36, w: 0.28, h: 0.36, d: 0.12, faces: rackFaces(['ember', 'bella', 'oak']) }) }).turn(0.3)] }
}
function lipBalmish(color) {
   return grp(mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.3, 20), M.gloss(color)).at(0, 0.15, 0), mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.1, 20), M.gloss('#ffffff')).at(0, 0.35, 0))
}
T['display-racks/wall-mounted-racks'] = (p) => {
   if (has(p, 'pegboard', 'slatwall')) {
      const peg = has(p, 'pegboard')
      const items = []
      for (let r = 0; r < 3; r++) for (let k = 0; k < 5; k++) items.push([-1.1 + k * 0.55, 0.85 + r * 0.75, P(0.68, { brand: ALL[(k + r * 2) % 9], logoScale: 0.3, emblem: false, tag: false })])
      return { wall: wallMaterial('plaster', '#e9e2d6'), view: wallFront, bg: 'warm', items: [hangWall({ w: 3.2, h: 2.4, kind: peg ? 'peg' : 'slat', panel: peg ? '#efe9df' : '#f6f3ee', items })] }
   }
   if (has(p, 'brochure')) return { wall: wallMaterial('plaster', '#e9e2d6'), view: wallFront, bg: 'cool', items: [grp(...[0, 1, 2].flatMap((r) => [0, 1, 2].map((k) => grp(block(0.8, 0.9, 0.02, { front: P(0.9, { brand: ALL[(k + r * 3) % 9], logoScale: 0.26, logoY: 0.35, text: 'Discover', textY: 0.8, textSize: 0.12 }), all: M.white() }, 0.004).at(0, 0.45, 0.08), block(0.86, 0.45, 0.02, M.acrylic('#ffffff', { thickness: 0.03 }), 0.004).at(0, 0.23, 0.14)).at(-1 + k, 0.4 + r * 1.05, 0))))] }
   return { wall: wallMaterial('plaster', '#ece6dc'), view: wallFront, bg: 'warm', items: [grp(...[0.9, 2.0].flatMap((y, r) => [block(3.0, 0.08, 0.5, M.white(), 0.01).at(0, y, 0.25), productPacks({ n: 5, spacing: 0.5, faces: rackFaces(ALL.slice(r * 3, r * 3 + 4)) }).at(0, y + 0.04, 0.25)])), lightBox({ w: 3.0, h: 0.5, d: 0.12, face: face(6, 'north', { logoScale: 0.5, emblem: false, tag: false }).map, glow: 1.2 }).at(0, 2.5, 0)] }
}

/* Bags */
const bagScene = (front, side, handles, handleColor, { size = 1, bg = 'warm', view = [0.6, 0.55, 1.7], second } = {}) =>
   pair(bag({ w: 1.6 * size, h: 2.0 * size, d: 0.75 * size, front, side, handles, handleColor }), bag({ w: 1.2 * size, h: 1.5 * size, d: 0.6 * size, front: second?.front || front, side: second?.side || side, handles, handleColor: second?.handleColor || handleColor }), { gap: 2.2 * size, bg, view })
T['bags/paper-bags'] = (p) => {
   const b = pick(['north', 'maison', 'north', 'bloom', 'juno', 'bloom'], p.index)
   const B = brand(b)
   if (has(p, 'white')) return bagScene(face(0.8, 'juno', { bg: '#ffffff' }), M.white('#ffffff'), 'twisted', '#ffffff', { bg: 'cool' })
   if (has(p, 'luxury')) return bagScene(face(0.8, 'maison'), M.softTouch('#16130f'), 'ribbon', '#d9b56a')
   if (has(p, 'rope')) return bagScene(face(0.8, 'bloom', { pattern: 'dots', patternAlpha: 0.2 }), M.matte(brand('bloom').paper), 'rope', '#c4558a', { bg: 'blush', second: { front: face(0.8, 'bloom', { bg: '#c4558a', ink: '#fff' }), side: M.matte('#c4558a'), handleColor: '#f3e6ef' } })
   return bagScene(face(0.8, b), M.matte(B.paper), 'twisted', B.accent === '#ffffff' ? '#d9d9d9' : B.accent, { second: { front: face(0.8, b, { bg: '#ffffff', ink: B.paper }), side: M.white() } })
}
T['bags/kraft-bags'] = (p) => {
   if (has(p, 'mini')) return bagScene(P(0.8, { brand: 'bloom', kraft: true, ink: '#3c2a4d', logoScale: 0.18 }), M.kraft(), 'twisted', '#c4558a', { size: 0.6, view: [0.6, 0.65, 1.6] })
   return bagScene(P(0.8, { brand: has(p, 'flat') ? 'ember' : 'oak', kraft: true, logoScale: 0.17 }), M.kraft(), has(p, 'flat') ? 'flat' : 'twisted', '#8f6840')
}
T['bags/fabric-bags'] = (p) => {
   if (has(p, 'velvet')) return { bg: 'blush', view: [0.6, 0.8, 1.6], items: [pouch({ w: 1.0, h: 1.2, d: 0.4, face: P(0.83, { brand: 'maison', bg: '#3c2a4d', ink: '#e7c9a0', logoScale: 0.2 }, { rough: 1 }), zip: false }).at(-0.6, 0, 0).turn(0.3), pouch({ w: 0.8, h: 1.0, d: 0.35, face: M.fabric('#7a1f3d'), zip: false }).at(0.7, 0, -0.3).turn(-0.3)] }
   const f = has(p, 'jute') ? M.fabric('#b08a5a') : has(p, 'non-woven') ? M.fabric('#2a9d8f') : M.fabric('#e9e4da')
   const ink = has(p, 'non-woven') ? '#ffffff' : '#2f3a2c'
   const bg = has(p, 'jute') ? '#b08a5a' : has(p, 'non-woven') ? '#2a9d8f' : '#e9e4da'
   const b = has(p, 'foldable') ? 'north' : 'oak'
   return pair(bag({ w: 1.8, h: 2.0, d: has(p, 'non-woven') ? 0.6 : 0.12, front: P(0.9, { brand: b, bg, ink, logoScale: 0.17 }, { rough: 1 }), side: f, handles: 'flat', handleColor: has(p, 'jute') ? '#e9e4da' : bg }), has(p, 'foldable') ? pouch({ w: 0.7, h: 0.8, d: 0.25, face: P(0.9, { brand: 'north', logoScale: 0.2 }, { rough: 1 }) }) : bag({ w: 1.4, h: 1.6, d: 0.12, front: P(0.9, { brand: b, bg, ink, logoScale: 0.17 }, { rough: 1 }), side: f, handles: 'flat', handleColor: bg }), { gap: 2.4, bg: 'sage', view: [0.5, 0.55, 1.7] })
}
T['bags/pouches'] = (p) => {
   if (has(p, 'kraft-paper-mailer')) return { view: [0.25, 1.9, 1.1], items: [block(1.7, 0.08, 2.3, { top: P(0.74, { brand: 'oak', kraft: true, logoScale: 0.16 }), all: M.kraft() }, 0.03).at(-0.6, 0.04, 0).turn(0.15), block(1.4, 0.08, 1.9, { top: P(0.74, { brand: 'oak', kraft: true, logoScale: 0.16 }), all: M.kraft() }, 0.03).at(1.1, 0.04, -0.1).turn(-0.2)] }
   const b = pick(['bella', 'ember', 'oak'], p.index)
   const flatBottom = has(p, 'flat-bottom')
   return pair(pouch({ w: flatBottom ? 1.2 : 1.3, h: 1.8, d: flatBottom ? 0.7 : 0.45, face: face(0.72, b, { logoScale: 0.18 }), zip: !flatBottom }), pouch({ w: 1.0, h: has(p, 'zipper') ? 1.1 : 1.4, d: 0.35, face: P(0.72, { brand: b, kraft: true, logoScale: 0.18 }) }), { gap: 1.7, view: [0.7, 0.6, 1.7] })
}

/* Printing */
const cardBackDraw = (b) => (c, w, h) => {
   const B = brand(b)
   c.fillStyle = B.ink === '#ffffff' ? '#11151c' : B.ink
   c.textAlign = 'left'
   c.font = `700 ${h * 0.11}px Arial`; c.fillText('Alex Morgan', w * 0.09, h * 0.36)
   c.font = `400 ${h * 0.065}px Arial`; c.globalAlpha = 0.75; c.fillText('Creative Director', w * 0.09, h * 0.47)
   c.font = `400 ${h * 0.06}px Arial`; c.globalAlpha = 0.85
   ;['+00 123 456 789', 'hello@example.com', 'www.example.com'].forEach((l, i) => c.fillText(l, w * 0.09, h * (0.66 + i * 0.09)))
   c.globalAlpha = 1
}
T['printing/business-cards'] = (p) => {
   const b = pick(['juno', 'nova', 'north', 'maison', 'oak', 'ember', 'bloom'], p.index)
   const B = brand(b)
   const square = has(p, 'square')
   const w = square ? 0.65 : 0.9, h = square ? 0.65 : 0.55
   let front = P(w / h, { brand: b, logoScale: 0.2 })
   if (has(p, 'foil')) front = P(w / h, { brand: 'maison', logoScale: 0.2 }, { mat: { metalness: 0.45, roughness: 0.3 } })
   if (has(p, 'spot-uv')) front = P(w / h, { brand: 'nova', logoScale: 0.2, pattern: 'waves', patternInk: '#35c3ff', patternAlpha: 0.25 }, { rough: 0.25 })
   const edge = M.matte(has(p, 'foil') ? '#16130f' : B.paper)
   const back = P(w / h, { brand: b, bg: '#ffffff', logo: false, draw: cardBackDraw(has(p, 'foil') ? 'maison' : b) })
   const rounded = has(p, 'rounded')
   return {
      bg: 'cool',
      view: [0.35, 1.8, 1.1],
      items: [
         cardStack({ w, h, n: 14, front, edge }).at(-0.55, 0, 0.1).turn(0.25),
         (rounded ? grp(block(w, 0.012, h, { top: back, all: M.white() }, 0.06).at(0, 0.006, 0)) : sheet({ w, h, t: 0.012, front: back, edge: M.white() })).at(0.6, 0, -0.15).turn(-0.3),
         (rounded ? grp(block(w, 0.012, h, { top: front, all: edge }, 0.06).at(0, 0.006, 0)) : sheet({ w, h, t: 0.012, front, edge })).at(0.25, 0, 0.55).turn(0.6),
      ],
   }
}
T['printing/letterheads'] = () => ({
   bg: 'cool',
   view: [0.25, 1.9, 1.0],
   items: [
      sheet({ w: 2.1, h: 2.97, front: P(0.707, { brand: 'north', bg: '#ffffff', ink: '#1f3b57', logoScale: 0.05, logoY: 0.1, emblem: false, draw: lines('rgba(31,59,87,0.2)', 0.3, 14) }) }).at(-1.2, 0, 0).turn(0.08),
      sheet({ w: 2.1, h: 2.97, front: P(0.707, { brand: 'north', pattern: 'monogram', patternAlpha: 0.25, logo: false }) }).at(1.1, 0, 0.1).turn(-0.08),
   ],
})
T['printing/envelopes'] = (p) => {
   const b = pick(['juno', 'north', 'nova', 'oak', 'oak', 'bloom'], p.index)
   const B = brand(b)
   const invite = has(p, 'invitation')
   const win = has(p, 'window')
   const big = has(p, 'c4'), mid = has(p, 'c5')
   const w = big ? 2.3 : mid ? 2.1 : 2.2, h = big ? 3.2 : mid ? 1.5 : 1.1
   const bg = invite ? '#f3e6ef' : '#ffffff'
   const env = P(w / h, { brand: invite ? 'bloom' : b, bg, ink: invite ? '#c4558a' : B.paper === '#f4f1ea' ? '#1b1b1b' : B.paper, logoScale: big ? 0.07 : 0.11, logoY: 0.22, emblem: false, draw: win ? (c, W, H) => { c.fillStyle = 'rgba(200,215,225,0.6)'; c.fillRect(W * 0.08, H * 0.45, W * 0.45, H * 0.3); c.strokeStyle = 'rgba(0,0,0,0.15)'; c.strokeRect(W * 0.08, H * 0.45, W * 0.45, H * 0.3) } : null })
   const back = P(w / h, { bg, logo: false, draw: (c, W, H) => { c.strokeStyle = 'rgba(0,0,0,0.18)'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(W / 2, H * 0.55); c.lineTo(W, 0); c.stroke() } })
   return { bg: invite ? 'blush' : 'cool', view: [0.25, 1.9, 1.0], items: [sheet({ w, h, front: env }).at(-0.4, 0, 0.25).turn(0.12), sheet({ w, h, front: back }).at(0.6, 0.01, -0.5).turn(-0.15), ...(invite ? [sheet({ w: w * 0.9, h: h * 0.9, front: P(w / h, { brand: 'bloom', bg: '#fffaf6', logoScale: 0.12, text: 'You are invited', textFont: 'Georgia', textSize: 0.12, textY: 0.75 }) }).at(1.3, 0.02, 0.5).turn(-0.35)] : [])] }
}
T['printing/flyers'] = (p) => {
   const b = pick(['ember', 'north', 'nova', 'bella'], p.index)
   const B = brand(b)
   const menu = has(p, 'menu')
   const f = (i) => P(0.707, { logo: false, draw: menu ? (c, w, h) => { c.fillStyle = '#fbf6ec'; c.fillRect(0, 0, w, h); c.fillStyle = '#c8362b'; c.font = `italic 700 ${h * 0.06}px Georgia`; c.textAlign = 'center'; c.fillText('Pasta Bella', w / 2, h * 0.1); c.textAlign = 'left'; c.fillStyle = '#2b2b2b'; ['Margherita', 'Carbonara', 'Arrabbiata', 'Lasagne', 'Tiramisu', 'Panna cotta'].forEach((t, k) => { c.font = `700 ${h * 0.03}px Arial`; c.fillText(t, w * 0.1, h * (0.24 + k * 0.11)); c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(w * 0.1, h * (0.27 + k * 0.11), w * 0.6, h * 0.006); c.fillStyle = '#2b2b2b' }) } : art(i ? 'SUMMER\nSALE' : 'GRAND\nOPENING', 'www.example.com', [B.paper, B.accent === '#ffffff' ? '#111' : B.accent]) })
   return { bg: 'cool', view: [0.25, 1.9, 1.0], items: [sheet({ w: 2.1, h: 2.97, front: f(0) }).at(-0.9, 0, 0).turn(0.1), sheet({ w: 2.1, h: 2.97, front: f(1) }).at(1.0, 0.01, 0.2).turn(-0.12), ...(has(p, 'premium') ? [sheet({ w: 2.1, h: 2.97, front: f(0) }).at(-0.85, 0.012, -0.02).turn(0.06)] : [])] }
}
T['printing/brochures'] = (p) => {
   const b = pick(['nova', 'oak', 'north', 'kaya'], p.index)
   const B = brand(b)
   const cover = P(0.71, { brand: b, logoScale: 0.16, logoY: 0.4, pattern: 'grid', patternAlpha: 0.2 })
   const inner = P(0.45, { bg: '#ffffff', logo: false, draw: lines('rgba(30,30,30,0.22)', 0.2, 14) })
   if (has(p, 'bi-fold', 'tri-fold')) return { bg: 'cool', view: [0.5, 1.2, 1.4], items: [foldedBrochure({ panels: has(p, 'tri') ? 3 : 2, faces: [P(0.47, { brand: b, logoScale: 0.3 }), inner, P(0.47, { brand: b, logo: false, draw: art('', '', [B.paper, '#111']) })] })] }
   const thick = has(p, 'catalog') ? 0.22 : 0.08
   return { bg: 'cool', view: [0.4, 1.4, 1.2], items: [booklet({ t: thick, cover }).at(-0.9, 0, 0.1).turn(0.15), booklet({ t: thick, cover: P(0.71, { brand: b, bg: '#ffffff', ink: B.paper, logoScale: 0.16, logoY: 0.4 }) }).at(0.9, 0, -0.2).turn(-0.2), booklet({ t: thick, cover }).at(-0.85, thick + 0.002, 0.05).turn(0.05)] }
}
T['printing/office-stationery'] = (p) => {
   const b = pick(['nova', 'oak', 'north', 'juno', 'nova', 'north', 'maison', 'oak', 'north', 'oak'], p.index)
   const B = brand(b)
   if (has(p, 'notepads')) return { bg: 'cool', view: [0.4, 1.5, 1.2], items: [grp(block(1.5, 0.25, 2.1, { top: P(0.71, { brand: b, bg: '#ffffff', ink: B.paper, logoScale: 0.06, logoY: 0.08, emblem: false, draw: lines('rgba(30,30,30,0.15)', 0.2, 16) }), all: M.white() }, 0.01).at(0, 0.125, 0), block(1.52, 0.05, 0.12, M.matte(B.paper), 0.01).at(0, 0.26, -1.0)).at(-0.8, 0, 0).turn(0.2), pen({ body: B.paper }).at(0.8, 0, 0.2).turn(0.5)] }
   if (has(p, 'calendar')) return { bg: 'warm', view: [0.6, 0.6, 1.6], items: [tentCard({ w: 1.8, h: 1.1, face: P(1.64, { logo: false, draw: (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = B.paper; c.fillRect(0, 0, w, h * 0.22); c.fillStyle = '#fff'; c.font = `800 ${h * 0.12}px Arial`; c.fillText('OCTOBER 2026', w * 0.06, h * 0.14); c.fillStyle = '#2b2b2b'; c.font = `400 ${h * 0.055}px Arial`; for (let d = 0; d < 31; d++) c.fillText(String(d + 1), w * (0.08 + (d % 7) * 0.13), h * (0.36 + Math.floor(d / 7) * 0.13)) } }) }).turn(0.3)] }
   if (has(p, 'id-cards')) return { bg: 'cool', view: [0.3, 1.7, 1.1], items: [lanyard({ color: '#1d4ed8', card: P(0.67, { logo: false, draw: (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#11151c'; c.fillRect(0, 0, w, h * 0.22); c.fillStyle = '#35c3ff'; c.font = `900 ${h * 0.08}px Arial`; c.textAlign = 'center'; c.fillText('NOVA LABS', w / 2, h * 0.13); c.fillStyle = '#d9dee6'; c.fillRect(w * 0.3, h * 0.3, w * 0.4, h * 0.3); c.fillStyle = '#11151c'; c.font = `800 ${h * 0.06}px Arial`; c.fillText('Sam Taylor', w / 2, h * 0.7); c.font = `400 ${h * 0.04}px Arial`; c.fillText('ENGINEERING', w / 2, h * 0.77); for (let k = 0; k < 30; k++) if (k % 3) c.fillRect(w * 0.2 + k * w * 0.02, h * 0.84, w * 0.012, h * 0.08) } }) })] }
   if (has(p, 'stamps')) return { bg: 'cool', view: [0.7, 0.8, 1.6], items: [stamp({ color: '#11151c', face: P(1.8, { brand: 'nova', bg: '#11151c', logoScale: 0.3, emblem: false, tag: false }) }).at(-0.4, 0, 0).turn(0.4), sheet({ w: 1.6, h: 1.1, front: P(1.45, { bg: '#ffffff', logo: false, draw: (c, w, h) => { c.strokeStyle = '#1d4ed8'; c.lineWidth = 6; c.strokeRect(w * 0.2, h * 0.25, w * 0.6, h * 0.4); c.fillStyle = '#1d4ed8'; c.font = `900 ${h * 0.1}px Arial`; c.textAlign = 'center'; c.fillText('NOVA LABS', w / 2, h * 0.43); c.font = `700 ${h * 0.06}px Arial`; c.fillText('APPROVED · 20/10/2026', w / 2, h * 0.56) } }) }).at(0.9, 0, 0.3).turn(-0.2)] }
   if (has(p, 'shields')) return { bg: 'warm', view: [0.5, 0.45, 1.6], items: [shield({ wood: true, face: P(1.33, { brand: 'maison', bg: '#d9b56a', ink: '#16130f', logoScale: 0.12, text: 'EMPLOYEE OF THE YEAR', textY: 0.85, textSize: 0.08 }, { mat: { metalness: 0.7, roughness: 0.3 } }) }).at(-0.8, 0, 0).turn(0.25), shield({ wood: false, face: P(1.33, { brand: 'nova', bg: '#e9edf2', ink: '#11151c', logoScale: 0.12, text: 'EXCELLENCE 2026', textY: 0.85, textSize: 0.08 }, { mat: { metalness: 0.4, roughness: 0.3 } }) }).at(0.9, 0, -0.3).turn(-0.25)] }
   if (has(p, 'file-covers')) return { bg: 'cool', view: [0.3, 1.7, 1.1], items: [block(2.2, 0.05, 3.0, { top: P(0.73, { brand: 'north', logoScale: 0.12, logoY: 0.3, pattern: 'stripes', patternInk: '#f2c14e', patternAlpha: 0.12 }), all: M.matte('#1f3b57') }, 0.02).at(-0.8, 0.025, 0).turn(0.1), block(2.2, 0.05, 3.0, { top: P(0.73, { brand: 'north', bg: '#f2c14e', ink: '#1f3b57', logoScale: 0.12, logoY: 0.3 }), all: M.matte('#f2c14e') }, 0.02).at(1.2, 0.025, -0.2).turn(-0.12)] }
   if (has(p, 'society-maps')) return { bg: 'warm', view: [0.3, 1.6, 1.1], items: [sheet({ w: 3.4, h: 2.4, t: 0.03, front: P(1.42, { logo: false, draw: (c, w, h) => { c.fillStyle = '#f7f3ea'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8e6c8'; c.fillRect(w * 0.05, h * 0.08, w * 0.25, h * 0.35); const R = 7; for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) { c.fillStyle = ['#f2d6a2', '#e9c3a8', '#cfe0f2'][(i + j) % 3]; c.fillRect(w * (0.36 + i * 0.1), h * (0.1 + j * 0.2), w * 0.09, h * 0.17); c.fillStyle = '#555'; c.font = `700 ${h * 0.03}px Arial`; c.fillText(`${String.fromCharCode(65 + j)}-${i + 1}`, w * (0.37 + i * 0.1), h * (0.2 + j * 0.2)) } c.fillStyle = '#bdbdbd'; c.fillRect(0, h * 0.5, w * 0.32, h * 0.05); c.fillStyle = '#1f3b57'; c.font = `900 ${h * 0.05}px Arial`; c.fillText('GREEN VALLEY SOCIETY', w * 0.05, h * 0.92) } }) }).turn(0.1)] }
   return null
}

/* Labels & stickers */
T['labels-stickers/product-labels'] = (p) => {
   if (has(p, 'bottle-labels')) return pair(vessel({ kind: 'wine', label: P(1.7, { brand: 'oak', bg: '#f4ead8', ink: '#2f3a2c', logoScale: 0.3, fit: 0.5 }), cap: '#2f3a2c' }).turn(0.45), vessel({ kind: 'cosmetic', glass: '#9cc3d5', label: P(2.4, { brand: 'oak', bg: '#f4ead8', ink: '#2f3a2c', logoScale: 0.3, fit: 0.42, text: 'SPRING WATER', textY: 0.85, textSize: 0.14 }), cap: '#2f3a2c' }).grow(1.2).turn(0.45), { gap: 1.4, bg: 'sage', view: [0.8, 0.5, 1.7] })
   if (has(p, 'cosmetic-labels')) return pair(vessel({ kind: 'cosmetic', glass: '#f3e6ef', label: P(2.4, { brand: 'kaya', bg: '#ffffff', ink: '#9a5b4c', logoScale: 0.3, fit: 0.42 }), cap: '#9a5b4c' }).grow(1.3).turn(0.45), vessel({ kind: 'jar', glass: '#f6e3dc', label: P(2.8, { brand: 'kaya', bg: '#9a5b4c', ink: '#ffffff', logoScale: 0.3, fit: 0.42 }), cap: '#ffffff' }).turn(0.45), { gap: 1.4, bg: 'blush', view: [0.8, 0.55, 1.7] })
   if (has(p, 'clear-labels')) return pair(vessel({ kind: 'cosmetic', glass: '#e8a23a', label: new THREE.MeshStandardMaterial({ map: P(2.4, { brand: 'juno', bg: 'rgba(0,0,0,0)', ink: '#ffffff', logoScale: 0.3, fit: 0.42 }).map, transparent: true }), cap: '#1b1b1b' }).grow(1.3).turn(0.45), vessel({ kind: 'cosmetic', glass: '#7fb7a4', label: new THREE.MeshStandardMaterial({ map: P(2.4, { brand: 'juno', bg: 'rgba(0,0,0,0)', ink: '#ffffff', logoScale: 0.3, fit: 0.42 }).map, transparent: true }), cap: '#1b1b1b' }).grow(1.1).turn(0.45), { gap: 1.3, bg: 'cool', view: [0.8, 0.55, 1.7] })
   // food labels
   return pair(vessel({ kind: 'jar', glass: '#c8362b', label: P(2.8, { brand: 'bella', bg: '#fbf6ec', ink: '#c8362b', logoScale: 0.3, emblem: false, fit: 0.42, text: 'PASSATA', textY: 0.85, textSize: 0.16 }), cap: '#c8362b' }).turn(0.5), carton({ w: 1.0, h: 1.4, d: 0.5, faces: { all: M.kraft(), front: P(0.71, { bg: '#fbf6ec', logo: false, draw: (c, w, h) => { c.fillStyle = '#2b2b2b'; c.font = `900 ${h * 0.07}px Arial`; c.fillText('INGREDIENTS', w * 0.08, h * 0.12); for (let i = 0; i < 9; i++) { c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(w * 0.08, h * (0.2 + i * 0.07), w * (0.5 + (i % 3) * 0.12), h * 0.012) } c.strokeStyle = '#2b2b2b'; c.lineWidth = 3; c.strokeRect(w * 0.08, h * 0.82, w * 0.84, h * 0.12) } }) } }), { gap: 1.6, view: [0.8, 0.6, 1.7] })
}
T['labels-stickers/stickers'] = (p) => {
   const b = pick(ALL, p.index)
   const holo = has(p, 'holographic')
   const f = (k, s) => (holo ? P(1, { brand: k, logoScale: 0.18, gradient: ['#ffb3e6', '#a8fff0'] }, { mat: { metalness: 0.6, roughness: 0.2 } }) : P(1, { brand: k, logoScale: 0.18, ...s }))
   if (has(p, 'sticker-sheets')) return { bg: 'sage', view: [0.25, 1.9, 1.0], items: [sheet({ w: 2.1, h: 2.97, front: P(0.707, { bg: '#ffffff', logo: false, draw: (c, w, h) => { const ks = ['ember', 'north', 'bloom', 'nova', 'oak', 'kaya']; ks.forEach((k, i) => { const B = BRANDS[k]; c.fillStyle = B.paper; c.beginPath(); c.arc(w * (0.3 + (i % 2) * 0.4), h * (0.18 + Math.floor(i / 2) * 0.3), w * 0.16, 0, 7); c.fill(); c.fillStyle = B.ink; c.font = `800 ${w * 0.05}px Arial`; c.textAlign = 'center'; c.fillText(B.name, w * (0.3 + (i % 2) * 0.4), h * (0.19 + Math.floor(i / 2) * 0.3), w * 0.26) }) } }) }).turn(0.1)] }
   if (has(p, 'closure-seals')) return { bg: 'blush', view: [0.5, 1.3, 1.4], items: [mailer({ w: 2.2, h: 0.7, d: 1.6, outside: M.white('#f6f2ee'), top: M.white('#f6f2ee') }).turn(0.2), sticker({ size: 0.5, shape: 'circle', face: f('kaya') }).at(0, 0.72, 0.6), sticker({ size: 0.5, shape: 'circle', face: f('kaya', { bg: '#9a5b4c', ink: '#fff' }) }).at(1.6, 0, 0.8)] }
   const shapes = has(p, 'circle') ? ['circle', 'circle', 'circle', 'circle'] : ['blob', 'star', 'rounded', 'circle']
   const ks = [b, ALL[(p.index + 2) % 9], ALL[(p.index + 4) % 9], ALL[(p.index + 6) % 9]]
   return { bg: holo ? 'cool' : 'warm', view: [0.25, 1.9, 1.0], items: ks.map((k, i) => sticker({ size: 0.8 - (i % 2) * 0.15, shape: shapes[i], face: f(k) }).at([-0.9, 0.1, 0.95, -0.2][i], 0, [-0.3, 0.35, -0.35, -0.55 + 1.2][i])) }
}
T['labels-stickers/shipping-labels'] = (p) => {
   const fragile = has(p, 'fragile')
   const ret = has(p, 'return')
   const lab = fragile
      ? (c, w, h) => { c.fillStyle = '#d42f25'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.font = `900 ${h * 0.3}px Arial`; c.textAlign = 'center'; c.fillText('FRAGILE', w / 2, h * 0.45); c.font = `700 ${h * 0.12}px Arial`; c.fillText('HANDLE WITH CARE', w / 2, h * 0.75) }
      : ret
        ? (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = '#2f3a2c'; c.font = `700 ${h * 0.14}px Arial`; c.fillText('Return to: Oak & Fern', w * 0.06, h * 0.32); c.font = `400 ${h * 0.11}px Arial`; c.fillText('12 Example Street, City', w * 0.06, h * 0.55); c.fillText('Postcode 10001', w * 0.06, h * 0.75) }
        : (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = '#1f3b57'; c.fillRect(0, 0, w, h * 0.22); c.fillStyle = '#fff'; c.font = `900 ${h * 0.1}px Arial`; c.fillText('NORTH/ROW', w * 0.05, h * 0.14); c.fillStyle = '#111'; c.font = `700 ${h * 0.08}px Arial`; c.fillText('SHIP TO: Jordan Lee', w * 0.05, h * 0.38); c.font = `400 ${h * 0.065}px Arial`; c.fillText('24 Sample Road, Example City', w * 0.05, h * 0.5); for (let k = 0; k < 40; k++) if (k % 3) c.fillRect(w * 0.05 + k * w * 0.022, h * 0.62, w * 0.012, h * 0.25) }
   const lw = ret ? 1.0 : 1.2, lh = ret ? 0.4 : fragile ? 0.55 : 0.9
   return { view: [0.85, 0.9, 1.6], items: [carton({ w: 2.0, h: 1.3, d: 1.5, faces: { all: M.kraft(), top: P(1.33, { kraft: true, logo: false, draw: (c, w, h) => { c.save(); c.translate(w * 0.25, h * 0.22); c.scale(lw / 2.4, lh / 1.6); lab(c, w, h); c.restore() } }) } }).at(-0.6, 0, 0).turn(0.3), ...[0, 1, 2].map((i) => block(lw, 0.01, lh, { top: P(lw / lh, { logo: false, draw: lab }), all: M.white() }, 0.003).at(1.4 + i * 0.05, 0.005 + i * 0.011, 0.6 - i * 0.05).turn(-0.3 + i * 0.08))] }
}
T['labels-stickers/barcode-qr-labels'] = (p) => {
   const qr = has(p, 'qr')
   const serial = has(p, 'serial')
   const draw1 = (i) => (c, w, h) => {
      c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#111'
      if (qr) { const s = Math.min(w, h) * 0.7; for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) { const corner = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13); const on = corner ? (x % 6 === 0 || y % 6 === 0 || (x % 6 > 1 && x % 6 < 5 && y % 6 > 1 && y % 6 < 5) ? 1 : 0) : (x * 7 + y * 13 + x * y + i) % 3 === 0; if (on) c.fillRect((w - s) / 2 + (x * s) / 21, h * 0.08 + (y * s) / 21, s / 21 + 0.5, s / 21 + 0.5) } c.font = `800 ${h * 0.09}px Arial`; c.textAlign = 'center'; c.fillText('SCAN FOR MENU', w / 2, h * 0.93); return }
      let x = w * 0.08, k = 0
      while (x < w * 0.92) { const bw = ((k * 7919 + i) % 5) + 2; if (k % 2 === 0) c.fillRect(x, h * 0.15, bw * (w / 420), h * 0.5); x += bw * (w / 420) + w / 320; k++ }
      c.font = `700 ${h * 0.14}px Arial`; c.textAlign = 'center'; c.fillText(serial ? `SN-2026-${String(4800 + i).padStart(6, '0')}` : `5 012345 6789${i}`, w / 2, h * 0.86)
   }
   const lw = qr ? 0.8 : 1.4, lh = qr ? 0.9 : 0.6
   return { bg: 'cool', view: [0.3, 1.8, 1.0], items: [0, 1, 2, 3, 4, 5].map((i) => block(lw, 0.01, lh, { top: P(lw / lh, { logo: false, draw: draw1(i) }), all: M.white() }, qr ? 0.04 : 0.02).at((i % 3) * (lw + 0.2) - (lw + 0.2), 0.005, Math.floor(i / 3) * (lh + 0.2) - (lh + 0.2) / 2).turn((i - 2.5) * 0.04)) }
}

/* Marketing */
T['marketing/posters'] = (p) => {
   const b = pick(['north', 'ember', 'oak', 'bloom', 'nova'], p.index)
   const B = brand(b)
   const f = P(0.75, { logo: false, draw: art(has(p, 'event') ? 'LIVE\nTONIGHT' : has(p, 'canvas') ? '' : 'NEW\nSEASON', has(p, 'event') ? 'doors 8pm · example.com' : 'www.example.com', [B.paper, B.accent === '#ffffff' ? '#111' : B.accent]) })
   if (has(p, 'foam')) return { bg: 'warm', view: [0.5, 0.35, 1.6], items: [easel({ face: f })] }
   if (has(p, 'canvas')) return { wall: wallMaterial('plaster', '#ece6dc'), view: wallFront, bg: 'warm', items: [wallPoster({ w: 2.6, h: 1.8, kind: 'canvas', face: P(1.44, { logo: false, draw: (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#f2c14e'); g.addColorStop(0.55, '#e76f51'); g.addColorStop(1, '#264653'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = '#264653'; c.beginPath(); c.moveTo(0, h * 0.75); for (let x = 0; x <= w; x += 20) c.lineTo(x, h * (0.7 + Math.sin(x / 90) * 0.06)); c.lineTo(w, h); c.lineTo(0, h); c.fill(); c.fillStyle = '#fff6ea'; c.beginPath(); c.arc(w * 0.7, h * 0.4, h * 0.12, 0, 7); c.fill() } }) }).at(0, 0.6, 0)] }
   const large = has(p, 'large')
   return { wall: wallMaterial('plaster', large ? '#2b2a2c' : '#ece6dc'), view: wallFront, bg: large ? 'dark' : 'warm', items: large ? [wallPoster({ w: 4.2, h: 2.6, kind: 'plain', face: P(1.6, { logo: false, draw: art('BIG.\nBOLD.', 'large format print', [B.paper, '#111']) }) }).at(0, 0.3, 0)] : [wallPoster({ w: 1.6, h: 2.2, face: f }).at(-1.0, 0.6, 0), wallPoster({ w: 1.6, h: 2.2, face: P(0.73, { logo: false, draw: art('SHOP\nNOW', 'www.example.com', ['#111', B.paper]) }) }).at(1.0, 0.6, 0)] }
}
T['marketing/banners'] = () => ({
   bg: 'cool',
   view: [0.45, 0.25, 1.5],
   items: [0, 1].map((i) => grp(mesh(new THREE.CylinderGeometry(0.06, 0.08, 5, 16), M.metal('#5a5f66', 0.4)).at(0, 2.5, 0), block(0.9, 0.04, 0.04, M.metal('#5a5f66', 0.4), 0.01).at(0.45, 4.6, 0), block(0.9, 0.04, 0.04, M.metal('#5a5f66', 0.4), 0.01).at(0.45, 2.6, 0), block(0.85, 1.95, 0.01, { front: P(0.44, { logo: false, draw: art(i ? 'CITY\nFESTIVAL' : 'NORTH/ROW\nOPEN', 'this weekend', i ? ['#d42f25', '#1f3b57'] : ['#1f3b57', '#0c1724']) }), back: P(0.44, { logo: false, draw: art('WELCOME', '', ['#1f3b57', '#0c1724']) }), all: M.white() }, 0.002).at(0.45, 3.6, 0)).at(i * 2.2 - 1.1, 0, i * -0.6).turn(-0.3 + i * 0.1)),
})
T['marketing/promotional-materials'] = (p) => {
   const b = pick(['bloom', 'bloom', 'maison', 'ember', 'ember', 'bella', 'north'], p.index)
   const B = brand(b)
   if (has(p, 'wall-calendars')) return { wall: wallMaterial('plaster', '#ece6dc'), view: wallFront, bg: 'warm', items: [wallPoster({ w: 1.6, h: 2.4, kind: 'plain', face: P(0.67, { logo: false, draw: (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); const g = c.createLinearGradient(0, 0, w, h * 0.5); g.addColorStop(0, '#1f3b57'); g.addColorStop(1, '#f2c14e'); c.fillStyle = g; c.fillRect(0, 0, w, h * 0.5); c.fillStyle = '#fff'; c.font = `900 ${h * 0.05}px Arial`; c.fillText('NORTH/ROW 2027', w * 0.06, h * 0.08); c.fillStyle = '#2b2b2b'; c.font = `800 ${h * 0.035}px Arial`; c.fillText('JANUARY', w * 0.06, h * 0.56); c.font = `400 ${h * 0.025}px Arial`; for (let d = 0; d < 31; d++) c.fillText(String(d + 1), w * (0.08 + (d % 7) * 0.13), h * (0.63 + Math.floor(d / 7) * 0.065)) } }) }).at(0, 0.5, 0)] }
   if (has(p, 'table-tent')) return null
   const f = has(p, 'menu-cards')
      ? P(0.71, { logo: false, draw: (c, w, h) => { c.fillStyle = '#fbf6ec'; c.fillRect(0, 0, w, h); c.fillStyle = '#c8362b'; c.font = `italic 700 ${h * 0.07}px Georgia`; c.textAlign = 'center'; c.fillText('Pasta Bella', w / 2, h * 0.12); c.fillStyle = '#2b2b2b'; ['Antipasti', 'Primi', 'Secondi', 'Dolci'].forEach((t, k) => { c.font = `800 ${h * 0.035}px Arial`; c.fillText(t.toUpperCase(), w / 2, h * (0.25 + k * 0.18)); c.fillStyle = 'rgba(0,0,0,0.25)'; for (let j = 0; j < 2; j++) c.fillRect(w * 0.2, h * (0.29 + k * 0.18 + j * 0.04), w * 0.6, h * 0.008); c.fillStyle = '#2b2b2b' }) } })
      : has(p, 'gift-vouchers')
        ? P(2.1, { brand: 'maison', logoScale: 0.16, logoY: 0.4, text: 'GIFT VOUCHER · 50', textY: 0.82, textSize: 0.1 }, { mat: { metalness: 0.3, roughness: 0.4 } })
        : has(p, 'loyalty')
          ? P(1.64, { brand: 'ember', logoScale: 0.14, logoY: 0.3, draw: (c, w, h) => { c.strokeStyle = '#fff6ea'; c.lineWidth = 4; for (let k = 0; k < 8; k++) { c.beginPath(); c.arc(w * (0.15 + (k % 4) * 0.23), h * (0.62 + Math.floor(k / 4) * 0.22), h * 0.08, 0, 7); c.stroke() } } })
          : P(1.42, { brand: b, logoScale: 0.14, pattern: has(p, 'greeting') ? 'botanical' : 'confetti', patternAlpha: 0.4, text: has(p, 'greeting') ? 'with love' : 'hello from the city', textFont: 'Georgia', textSize: 0.1, textY: 0.8 })
   const dims = has(p, 'menu-cards') ? [1.6, 2.26] : has(p, 'gift-vouchers') ? [2.1, 1.0] : has(p, 'loyalty') ? [0.9, 0.55] : [1.6, 1.13]
   return { bg: has(p, 'greeting') ? 'blush' : 'warm', view: [0.3, 1.8, 1.1], items: [sheet({ w: dims[0], h: dims[1], t: 0.02, front: f }).at(-0.6, 0, 0.1).turn(0.18), sheet({ w: dims[0], h: dims[1], t: 0.02, front: f }).at(0.7, 0.02, -0.25).turn(-0.22), ...(has(p, 'greeting') ? [sheet({ w: 1.7, h: 1.2, front: P(1.42, { bg: '#f3e6ef', logo: false }) }).at(1.0, 0, 0.7).turn(-0.4)] : [])] }
}

/* Corporate */
T['corporate/promotional-products'] = (p) => {
   const b = pick(['nova', 'ember', 'north', 'bloom', 'nova', 'nova', 'north', 'juno'], p.index)
   const B = brand(b)
   if (has(p, 'pens')) return { bg: 'cool', view: [0.4, 1.4, 1.3], items: [0, 1, 2].map((i) => pen({ body: ['#1f3b57', '#11151c', '#d42f25'][i], print: P(8, { brand: ['north', 'nova', 'juno'][i], bg: ['#1f3b57', '#11151c', '#d42f25'][i], ink: '#ffffff', logoScale: 0.6, emblem: false, tag: false, fit: 0.3 }) }).at(0, 0, (i - 1) * 0.35).turn(0.3 + i * 0.05)) }
   if (has(p, 'mugs')) return pair(mug({ color: '#ffffff', print: P(3, { brand: 'ember', bg: '#ffffff', ink: '#b5432a', logoScale: 0.3, fit: 0.32 }) }).turn(0.5), mug({ color: '#b5432a', print: P(3, { brand: 'ember', logoScale: 0.3, fit: 0.32 }) }).turn(0.5), { gap: 1.6 })
   if (has(p, 'water-bottles')) return pair(bottle({ color: '#1f3b57', print: P(1.5, { brand: 'north', logoScale: 0.3, emblem: false, fit: 0.28 }, { mat: { metalness: 0.5, roughness: 0.35 } }) }), bottle({ color: '#d9dce0', h: 1.6, print: P(1.5, { brand: 'north', bg: '#d9dce0', ink: '#1f3b57', logoScale: 0.3, emblem: false, fit: 0.28 }, { mat: { metalness: 0.6, roughness: 0.3 } }) }), { gap: 1.2, bg: 'cool', view: [0.8, 0.5, 1.7] })
   if (has(p, 'keychains')) return { bg: 'warm', view: [0.3, 1.8, 1.1], items: [keychain({ shape: 'round', face: P(1, { brand: 'bloom', logoScale: 0.2 }) }).at(-0.8, 0, 0.2).turn(0.3), keychain({ shape: 'rect', face: P(0.64, { brand: 'oak', kraft: true, logoScale: 0.2 }) }).at(0.6, 0, 0).turn(-0.4), keychain({ shape: 'round', face: P(1, { brand: 'maison', logoScale: 0.2 }, { mat: { metalness: 0.6, roughness: 0.3 } }) }).at(0, 0, -0.9).turn(0.8)] }
   if (has(p, 'lanyards')) return { bg: 'cool', view: [0.3, 1.8, 1.1], items: [lanyard({ strap: P(14, { brand: 'nova', logoScale: 0.6, emblem: false, tag: false }), card: P(0.67, { brand: 'nova', logoScale: 0.2, logoY: 0.3, text: 'VISITOR', textY: 0.8, textSize: 0.12 }) })] }
   if (has(p, 'power-banks')) return pair(powerBank({ color: '#11151c', face: P(0.52, { brand: 'nova', logoScale: 0.3 }) }), powerBank({ color: '#f4f1ea', face: P(0.52, { brand: 'nova', bg: '#f4f1ea', ink: '#11151c', logoScale: 0.3 }) }), { gap: 1.4, bg: 'cool', view: [0.4, 1.4, 1.3] })
   if (has(p, 'usb')) return { bg: 'cool', view: [0.4, 1.4, 1.3], items: ['#1f3b57', '#d42f25', '#11151c'].map((c, i) => usbDrive({ color: c, face: P(0.45, { brand: ['north', 'juno', 'nova'][i], bg: c, ink: '#fff', logoScale: 0.4, emblem: false, tag: false }) }).at((i - 1) * 0.75, 0, i === 1 ? 0.2 : 0).turn(0.3 - i * 0.2)) }
   return null
}
T['corporate/corporate-gifts'] = (p) => {
   if (has(p, 'executive')) return { bg: 'warm', view: [0.45, 1.3, 1.3], items: [hingedBox({ w: 2.6, h: 0.5, d: 1.8, outside: M.softTouch('#16130f'), cover: P(1.44, { brand: 'maison', logoScale: 0.14 }), inside: M.fabric('#2a2420'), openDeg: 100, hinge: 'back', contents: grp(block(1.0, 0.1, 1.4, { top: P(0.71, { brand: 'maison', logoScale: 0.16 }), all: M.softTouch('#16130f') }, 0.02).at(-0.6, 0.1, 0), pen({ body: '#16130f', trim: '#d9b56a' }).at(0.35, 0.05, 0.4), bottle({ color: '#16130f', h: 1.4, r: 0.22 }).turn(0, 0, Math.PI / 2).at(0.4, 0.27, -0.2)) })] }
   if (has(p, 'diaries')) return pair(grp(block(1.5, 0.18, 2.1, { top: P(0.71, { brand: 'oak', bg: '#3b2416', ink: '#d9c39a', logoScale: 0.14 }), all: M.matte('#efe9df'), left: M.matte('#3b2416') }, 0.03).at(0, 0.09, 0)), grp(block(1.5, 0.18, 2.1, { top: P(0.71, { brand: 'north', logoScale: 0.14 }), all: M.matte('#efe9df'), left: M.matte('#1f3b57') }, 0.03).at(0, 0.09, 0)), { gap: 1.9, view: [0.4, 1.4, 1.3] })
   if (has(p, 'leather')) return pair(grp(block(2.2, 0.09, 2.9, { top: P(0.76, { brand: 'maison', bg: '#3b2416', ink: '#d9b56a', logoScale: 0.1, logoY: 0.3 }, { rough: 0.6 }), all: M.matte('#3b2416') }, 0.05).at(0, 0.045, 0)), grp(block(2.2, 0.09, 2.9, { top: P(0.76, { brand: 'maison', bg: '#16130f', ink: '#d9b56a', logoScale: 0.1, logoY: 0.3 }, { rough: 0.6 }), all: M.matte('#16130f') }, 0.05).at(0, 0.045, 0)), { gap: 2.5, view: [0.4, 1.4, 1.3] })
   if (has(p, 'organisers')) return { bg: 'warm', view: [0.7, 0.8, 1.6], items: [grp(tray(2.4, 0.5, 1.0, M.wood(), M.wood(), 0.06), block(0.06, 0.48, 0.95, M.wood(), 0.01).at(-0.4, 0.24, 0), block(0.06, 0.48, 0.95, M.wood(), 0.01).at(0.4, 0.24, 0), pen({ body: '#16130f' }).turn(0, 0, 1.2).at(-0.8, 0.5, 0), sheet({ w: 0.7, h: 0.5, front: P(1.4, { brand: 'oak', logoScale: 0.2 }) }).at(0.8, 0.07, 0), block(0.25, 0.1, 0.9, { top: P(0.28, { brand: 'oak', bg: '#3b2416', ink: '#d9c39a', logoScale: 0.5, emblem: false, tag: false }), all: M.wood() }, 0.01).at(0, 0.5, 0.48)).turn(0.3)] }
   if (has(p, 'awards')) return pair(trophy({ kind: 'crystal', face: P(0.64, { brand: 'nova', bg: 'rgba(0,0,0,0)', ink: '#1f3b57', logoScale: 0.18, text: 'INNOVATION 2026', textY: 0.85, textSize: 0.08 }) }), trophy({ kind: 'star' }), { gap: 1.5, bg: 'cool', view: [0.6, 0.45, 1.7] })
   return null
}

T['corporate/apparel'] = (p) => {
   const flat = [0.18, 1.9, 1.0]
   if (has(p, 't-shirts')) return { bg: 'cool', view: flat, items: [tee({ color: '#f3f1ec', brand: 'juno' }).at(-0.75, 0, 0).turn(0.06), foldedStack([{ color: '#2b2b2b', brand: 'nova' }, { color: '#b5432a', brand: 'ember' }, { color: '#1f3b57', brand: 'north' }]).at(2.4, 0, 0.5).turn(-0.22)] }
   if (has(p, 'polo')) return { bg: 'warm', view: flat, items: [polo({ color: '#1f2f46', brand: 'north', ink: '#f2c14e' }).at(-0.7, 0, 0).turn(-0.05), foldedStack([{ color: '#5f7a63', brand: 'oak', ink: '#f3eee4' }, { color: '#f4f2ee', brand: 'north', ink: '#1f3b57' }], { kind: 'polo' }).at(2.35, 0, 0.45).turn(-0.2)] }
   if (has(p, 'hoodies')) return { bg: 'cool', view: flat, items: [hoodie({ color: '#6c737b', brand: 'nova' }).at(-0.85, 0, 0.1).turn(0.05), foldedStack([{ color: '#1b1b1d', brand: 'nova', ink: '#35c3ff' }, { color: '#c9b79c', brand: 'oak', ink: '#2f3a2c' }], { kind: 'hoodie', h: 0.17 }).at(2.6, 0, 0.55).turn(-0.25)] }
   if (has(p, 'caps')) return { bg: 'warm', view: [0.7, 0.55, 1.6], items: [cap({ color: '#1f3b57', brand: 'north' }).at(-1.25, 0, 0.25).turn(0.55), cap({ color: '#1b1b1d', brand: 'nova', ink: '#35c3ff' }).at(0.2, 0, -0.55).turn(-0.15), cap({ color: '#d9cbb0', brimColor: '#2f3a2c', brand: 'oak', ink: '#2f3a2c' }).at(1.45, 0, 0.45).turn(-0.85)] }
   if (has(p, 'aprons')) return { bg: 'warm', view: flat, items: [apron().at(-0.3, 0, 0).turn(0.04), mug({ color: '#ffffff', print: P(3, { brand: 'ember', bg: '#ffffff', ink: '#b5432a', logoScale: 0.3, fit: 0.32 }) }).grow(0.5).at(1.9, 0, 0.9).turn(0.6)] }
   if (has(p, 'jackets')) return { bg: 'cool', view: flat, items: [jacket({ color: '#22303f', brand: 'north' }).at(-0.8, 0, 0).turn(0.04), cap({ color: '#22303f', brand: 'north', r: 0.55 }).at(2.35, 0, 0.6).turn(-0.4)] }
   return null
}

/* Custom packaging & services */
T['custom-packaging/custom-boxes'] = (p) => {
   if (has(p, 'size')) return { bg: 'cool', view: [0.8, 0.9, 1.6], items: [carton({ w: 2.4, h: 1.0, d: 1.6, faces: { all: M.kraft(), front: P(2.4, { brand: 'oak', kraft: true, logoScale: 0.18 }) } }).at(-1.4, 0, 0.3).turn(0.35), carton({ w: 1.4, h: 1.4, d: 1.4, faces: { all: M.kraft(), front: P(1, { brand: 'oak', kraft: true, logoScale: 0.18 }) } }).at(1.0, 0, -0.2).turn(-0.3), carton({ w: 0.8, h: 0.5, d: 0.8, faces: { all: M.kraft(), front: P(1.6, { brand: 'oak', kraft: true, logoScale: 0.18 }) } }).at(2.4, 0, 0.6).turn(-0.5)] }
   if (has(p, 'die-cut')) return pair(gableBox({ mat: P(1.2, { brand: 'ember', logo: false }), frontMat: face(1.2, 'ember') }), lidBox({ w: 1.6, h: 0.7, d: 1.2, base: M.matte('#b5432a'), lid: P(1.33, { brand: 'ember', logoScale: 0.1, logoY: 0.82, emblem: false, draw: draw.window('#fff6ea', ['#b5432a', '#e8a23a', '#6b4226', '#b5432a']) }) }), { gap: 2.2 })
   // custom printed box: edge-to-edge print inside and out
   return { bg: 'blush', view: [0.8, 1.0, 1.6], items: [mailer({ outside: P(1.3, { brand: 'bloom', pattern: 'botanical', patternAlpha: 0.35, logo: false }), top: P(1.3, { brand: 'bloom', pattern: 'botanical', patternAlpha: 0.35, logoScale: 0.15 }) }).at(-1.45, 0, 0.35).turn(0.42), mailer({ outside: P(1.3, { brand: 'bloom', pattern: 'botanical', patternAlpha: 0.35, logo: false }), inside: P(1, { brand: 'bloom', bg: '#c4558a', pattern: 'dots', patternInk: '#fff', patternAlpha: 0.4, logo: false }), top: P(1.3, { brand: 'bloom', pattern: 'botanical', patternAlpha: 0.35, logo: false }), open: 110 }).at(1.6, 0, -0.55).turn(-0.38)] }
}
T['custom-packaging/custom-bags'] = (p) => (has(p, 'size') ? { bg: 'warm', view: [0.6, 0.5, 1.7], items: [[1.2, 1.4], [1.6, 2.0], [2.0, 2.5]].map(([w, h], i) => bag({ w, h, d: w * 0.45, front: P(0.8, { brand: 'oak', kraft: true, logoScale: 0.17 }), side: M.kraft(), handles: 'twisted', handleColor: '#8f6840' }).at(i * 2.0 - 2.0, 0, -i * 0.3).turn(0.2)) } : bagScene(face(0.8, 'north', { pattern: 'stripes', patternInk: '#f2c14e', patternAlpha: 0.15 }), M.matte('#1f3b57'), 'rope', '#f2c14e', { bg: 'cool' }))
T['custom-packaging/custom-printing'] = (p) => {
   if (has(p, 'brand-launch-kit')) return { view: [0.9, 1.0, 1.6], items: [lidBox({ w: 1.6, h: 0.7, d: 1.6, base: M.softTouch('#2f3a2c'), lid: face(1, 'oak', { bg: '#2f3a2c', ink: '#d9c39a' }) }).at(-1.6, 0, 0.2).turn(0.3), mailer({ w: 2.0, h: 0.65, d: 1.5, outside: M.kraft(), top: P(1.33, { brand: 'oak', kraft: true, logoScale: 0.16 }) }).at(0.6, 0, -0.6).turn(-0.2), cardStack({ w: 0.9, h: 0.55, n: 10, front: P(1.64, { brand: 'oak', bg: '#2f3a2c', ink: '#d9c39a', logoScale: 0.2 }), edge: M.matte('#2f3a2c') }).at(0.7, 0, 0.9).turn(0.4)] }
   if (has(p, 'design-service')) return { bg: 'cool', view: [0.35, 1.6, 1.2], items: [sheet({ w: 2.8, h: 2.0, front: P(1.4, { bg: '#ffffff', logo: false, draw: draw.dieline() }) }).turn(0.1), carton({ w: 0.9, h: 1.3, d: 0.6, faces: { all: face(0.69, 'kaya', { logoScale: 0.22 }) } }).at(1.9, 0, -0.4).turn(-0.3), pen({ body: '#d42f25' }).at(-0.6, 0.008, 0.7).turn(0.6)] }
   if (has(p, 'large-volume')) return { bg: 'cool', view: [0.9, 0.8, 1.6], items: [block(3.0, 0.3, 2.2, M.wood(), 0.02).at(0, 0.15, 0), ...[...Array(12)].map((_, i) => carton({ w: 0.95, h: 0.7, d: 0.7, faces: { all: M.kraft(), front: P(1.36, { brand: 'north', kraft: true, logoScale: 0.18 }) } }).at(-0.98 + (i % 3) * 0.98, 0.3 + Math.floor(i / 6) * 0.7, Math.floor(i / 3) % 2 ? 0.37 : -0.37))] }
   // custom print job: a spread of printed items
   return { bg: 'warm', view: [0.35, 1.6, 1.2], items: [sheet({ w: 1.6, h: 2.2, front: P(0.73, { logo: false, draw: art('ANY\nPRINT', 'we make it', ['#d42f25', '#1b1b1b']) }) }).at(-1.0, 0, 0).turn(0.12), cardStack({ w: 0.9, h: 0.55, n: 8, front: P(1.64, { brand: 'juno', logoScale: 0.2 }) }).at(0.6, 0, 0.5).turn(-0.3), sticker({ size: 0.7, face: P(1, { brand: 'juno', logoScale: 0.18 }) }).at(1.0, 0, -0.6), carton({ w: 0.7, h: 0.9, d: 0.5, faces: { all: face(0.78, 'juno') } }).at(0.2, 0, -0.9).turn(-0.4)] }
}

/* Acrylic & plastic */
const acrylicBox = ({ w = 1.6, h = 1.0, d = 1.6, tint = '#ffffff', lidMat, base, contents } = {}) => {
   const a = M.acrylic(tint, { thickness: 0.06 })
   return grp(tray(w, h, d, a, a, 0.03), base ? block(w - 0.06, 0.04, d - 0.06, base, 0.01).at(0, 0.05, 0) : null, contents, block(w + 0.04, 0.05, d + 0.04, lidMat || a, 0.012).at(0, h + 0.025, 0))
}
const balls = (n, colors, r = 0.17) => grp(...[...Array(n)].map((_, i) => mesh(new THREE.SphereGeometry(r, 24, 16), M.gloss(colors[i % colors.length])).at(((i % 3) - 1) * r * 2.35, r * 1.15, (Math.floor(i / 3) - 1) * r * 2.35)))
T['acrylic-plastic-packaging/acrylic-boxes'] = (p) => {
   const ring = () => grp(block(0.7, 0.3, 0.7, M.fabric('#1b1220'), 0.08).at(0, 0.2, 0), mesh(new THREE.TorusGeometry(0.16, 0.035, 16, 48), M.foil('#e7c9a0', 0.15)).at(0, 0.48, 0))
   if (has(p, 'jewelry')) return pair(acrylicBox({ w: 1.0, h: 0.75, d: 1.0, base: M.softTouch('#16130f'), contents: ring() }), acrylicBox({ w: 0.8, h: 0.6, d: 0.8, tint: '#f3d0de', contents: grp(mesh(new THREE.TorusGeometry(0.2, 0.02, 12, 48), M.foil('#d9d9d9', 0.15)).turn(0, 1.2).at(0, 0.25, 0)) }), { gap: 1.5, bg: 'blush' })
   if (has(p, 'cosmetic')) return pair(acrylicBox({ w: 1.6, h: 0.9, d: 1.0, contents: grp(...[-0.5, 0, 0.5].map((x, i) => dropperBottle(['#c9895a', '#e7b8a8', '#8fb39a'][i]).grow(0.8).at(x, 0.04, 0))) }), acrylicBox({ w: 1.0, h: 0.7, d: 0.8, tint: '#f3d0de', contents: balls(3, ['#f3e6ef'], 0.15) }), { gap: 2.2, bg: 'blush' })
   if (has(p, 'storage')) return { bg: 'cool', view: [0.8, 0.85, 1.6], items: [acrylicBox({ w: 1.6, h: 0.6, d: 1.1, contents: balls(6, ['#35c3ff', '#f2c14e'], 0.13) }).at(-0.5, 0, 0).turn(0.3), acrylicBox({ w: 1.6, h: 0.6, d: 1.1, contents: balls(6, ['#d42f25', '#ffffff'], 0.13) }).at(-0.45, 0.66, -0.05).turn(0.24), acrylicBox({ w: 1.6, h: 0.6, d: 1.1 }).at(1.4, 0, -0.5).turn(-0.3)] }
   if (has(p, 'window')) return pair(lidBox({ w: 1.6, h: 0.8, d: 1.6, base: M.softTouch('#2f3a2c'), lid: P(1, { brand: 'oak', bg: '#2f3a2c', ink: '#d9c39a', logoScale: 0.12, logoY: 0.85, emblem: false, draw: draw.window('#efe6d6', ['#d9c39a', '#c49a6c', '#8a6a4a', '#d9c39a']) }, { rough: 0.3 }) }), acrylicBox({ w: 1.2, h: 0.7, d: 1.2, contents: balls(4, ['#d9c39a', '#8a6a4a'], 0.15) }), { gap: 2.0, bg: 'sage' })
   if (has(p, 'laser')) return pair(acrylicBox({ w: 1.5, h: 1.0, d: 1.5, lidMat: P(1, { bg: '#e9eef2', logo: false, draw: (c, w, h) => { c.strokeStyle = 'rgba(255,255,255,0.95)'; c.lineWidth = 6; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(w / 2, h / 2, w * (0.08 + i * 0.07), 0, 7); c.stroke() } c.fillStyle = '#1f3b57'; c.font = `italic 700 ${h * 0.09}px Georgia`; c.textAlign = 'center'; c.fillText('Sam & Jo', w / 2, h * 0.53) } }, { rough: 0.2 }), contents: balls(4, ['#f3e6ef', '#d9b56a'], 0.15) }), acrylicBox({ w: 1.0, h: 0.7, d: 1.0, tint: '#d9ecf2' }), { gap: 2.0, bg: 'cool' })
   // clear / custom / product boxes
   const tints = { clear: '#ffffff', custom: '#bfe3f0', product: '#ffffff' }
   const tint = has(p, 'custom') ? tints.custom : '#ffffff'
   return pair(acrylicBox({ w: 1.4, h: 1.2, d: 1.0, tint, contents: carton({ w: 0.9, h: 0.95, d: 0.6, faces: { all: face(0.95, has(p, 'product') ? 'nova' : 'ember', { logoScale: 0.2 }) } }).at(0, 0.04, 0) }), acrylicBox({ w: 1.0, h: 0.8, d: 1.0, tint, contents: balls(4, ['#d42f25', '#f2c14e'], 0.15) }), { gap: 2.0, bg: 'cool' })
}
T['acrylic-plastic-packaging/plastic-packaging'] = (p) => {
   if (has(p, 'cosmetic-containers', 'product-containers')) return { bg: 'blush', view: [0.8, 0.6, 1.6], items: [vessel({ kind: 'jar', glass: '#f6e3dc', label: P(2.8, { brand: 'kaya', bg: '#ffffff', ink: '#9a5b4c', logoScale: 0.3, fit: 0.42 }), cap: '#ffffff' }).at(-0.8, 0, 0).turn(0.45), vessel({ kind: 'cosmetic', glass: '#ffffff', label: P(2.4, { brand: 'kaya', bg: '#ffffff', ink: '#9a5b4c', logoScale: 0.3, fit: 0.42 }), cap: '#9a5b4c' }).grow(1.4).at(0.6, 0, -0.3).turn(0.45), vessel({ kind: 'jar', glass: '#ffffff', cap: '#9a5b4c' }).grow(0.7).at(1.6, 0, 0.4)] }
   if (has(p, 'food-containers')) return pair(grp(block(1.5, 0.45, 1.3, M.acrylic('#ffffff', { thickness: 0.04 }), 0.12).at(0, 0.22, 0), block(1.5, 0.35, 1.3, M.acrylic('#ffffff', { thickness: 0.04 }), 0.14).at(0, 0.62, 0), balls(6, ['#8fb339', '#e76f51', '#f2c14e'], 0.13)), cup({ rTop: 0.55, rBot: 0.45, h: 0.6, body: M.acrylic('#ffffff', { thickness: 0.03 }), lidStyle: 'flat' }), { gap: 2.0, bg: 'warm' })
   const hang = has(p, 'display')
   const b = has(p, 'gift') ? 'bloom' : 'north'
   return pair(grp(acrylicBox({ w: 0.9, h: 1.4, d: 0.5, lidMat: M.acrylic('#ffffff'), contents: carton({ w: 0.7, h: 1.1, d: 0.35, faces: { all: face(0.64, b, { logoScale: 0.22 }) } }).at(0, 0.04, 0) }), hang ? block(0.5, 0.25, 0.03, M.acrylic('#ffffff'), 0.01).at(0, 1.55, 0) : null), acrylicBox({ w: 0.8, h: 0.6, d: 0.8, tint: has(p, 'gift') ? '#f3d0de' : '#ffffff', contents: balls(4, [brand(b).paper, '#ffffff'], 0.14) }), { gap: 1.4, bg: has(p, 'gift') ? 'blush' : 'cool' })
}

/* Signage */
const signWall = (tone = '#ece7df', kind = 'plaster') => wallMaterial(kind, tone)
T['signage-displays/sign-boards'] = (p) => {
   const b = pick(['nova', 'north', 'oak', 'ember', 'bella', 'kaya', 'juno', 'maison'], p.index)
   const B = brand(b)
   if (has(p, 'parking')) return { bg: 'cool', view: [0.5, 0.3, 1.5], items: [grp(mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.2, 16), M.metal('#8a8f96', 0.4)).at(0, 1.6, 0), block(1.2, 1.2, 0.04, { front: P(1, { logo: false, draw: (c, w, h) => { c.fillStyle = '#1a5fb4'; c.fillRect(0, 0, w, h); c.strokeStyle = '#fff'; c.lineWidth = 16; c.strokeRect(w * 0.06, h * 0.06, w * 0.88, h * 0.88); c.fillStyle = '#fff'; c.font = `900 ${h * 0.65}px Arial`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('P', w / 2, h * 0.55) } }), all: M.metal('#c9cdd2') }, 0.03).at(0, 2.8, 0.05), block(1.2, 0.4, 0.04, { front: P(3, { logo: false, draw: signText('VISITORS ONLY', { bg: '#ffffff', ink: '#1a5fb4', size: 0.4 }) }), all: M.metal('#c9cdd2') }, 0.02).at(0, 2.0, 0.05)).turn(0.25)] }
   if (has(p, 'directional')) return { bg: 'cool', view: [0.5, 0.3, 1.5], items: [grp(mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.4, 16), M.metal('#2a2a2a', 0.4)).at(0, 1.7, 0), ...[['Reception →', 0], ['← Parking', 0.6], ['Café →', 1.2]].map(([t, k], i) => block(1.8, 0.4, 0.05, { front: P(4.5, { logo: false, draw: signText(t, { bg: '#11151c', ink: '#ffffff', size: 0.45 }) }), back: P(4.5, { logo: false, draw: signText(t, { bg: '#11151c', ink: '#ffffff', size: 0.45 }) }), all: M.metal('#2a2a2a') }, 0.01).at(i % 2 ? -0.75 : 0.75, 3.0 - k, 0).turn(i * 0.25))).turn(0.25)] }
   if (has(p, 'shop-sign', 'outdoor')) {
      const facade = grp(block(5.2, 3.2, 0.2, M.matte('#e9e4da'), 0.01).at(0, 1.6, -0.1), block(3.0, 2.0, 0.05, M.acrylic('#cfe3ea', { thickness: 0.02 }), 0.005).at(-0.6, 1.0, 0.02), block(1.0, 2.2, 0.08, M.matte('#2a2a2a'), 0.01).at(1.8, 1.1, 0.02))
      return { bg: 'cool', view: [0.4, 0.2, 1.4], items: [facade, lightBox({ w: 4.8, h: 0.8, d: 0.25, face: face(6, b, { logoScale: 0.55, emblem: false, tag: false }).map, glow: 1.1 }).at(0, 2.45, 0.05)] }
   }
   const kinds = {
      acrylic: { face: face(2, b, {}, { rough: 0.15 }), standoffs: true, edge: M.acrylic('#ffffff') },
      acp: { face: face(2, b, { pattern: 'stripes', patternAlpha: 0.1 }), frame: '#c9cdd2' },
      pvc: { face: face(2, b, { bg: '#ffffff', ink: B.paper }), edge: M.white() },
      vinyl: { face: face(2, b), edge: M.white() },
      '3d-sign': { face: M.matte(B.paper), edge: M.matte(B.paper), raised: true },
      indoor: { face: face(2, b, { bg: '#f4f1ea', ink: B.paper === '#f4f1ea' ? '#1b1b1b' : B.paper }), standoffs: true },
   }
   const k = Object.keys(kinds).find((x) => p.key.includes(x)) || 'indoor'
   const cfg = kinds[k]
   const board = panel({ w: 3.2, h: 1.6, t: 0.04, face: cfg.face, edge: cfg.edge, standoffs: cfg.standoffs, frame: cfg.frame }).at(0, 0.7, 0)
   if (cfg.raised) return async () => ({ wall: signWall(), view: wallFront, bg: 'warm', items: [board, (await letters3d({ text: B.name, size: 0.34, depth: 0.08, face: M.matte(B.ink === '#ffffff' ? '#ffffff' : B.ink) })).at(0, 1.3, 0.06)] })
   return { wall: signWall(), view: wallFront, bg: 'warm', items: [board] }
}
T['signage-displays/3d-raised-letter-signs'] = (p) => {
   const cfg = has(p, 'stainless') ? { text: 'NOVA', face: M.metal('#e4e6e9', 0.12), wall: ['#2b2a2c'], bg: 'dark' } : has(p, 'pvc') ? { text: 'bloomfield', font: 'gentilis_bold', face: M.matte('#c4558a'), wall: ['#f3e6ef'], bg: 'blush' } : { text: 'EMBER', face: M.metal('#b8b2ab', 0.4), side: M.metal('#8f8a84', 0.45), wall: ['#bdb9b2', 'concrete'], bg: 'cool' }
   return async () => ({ wall: wallMaterial(cfg.wall[1] || 'plaster', cfg.wall[0]), view: wallFront, bg: cfg.bg, env: cfg.bg === 'dark' ? 1 : undefined, items: [(await letters3d({ text: cfg.text, font: cfg.font, size: 0.8, depth: 0.18, face: cfg.face, side: cfg.side })).at(0, 0.9, 0)] })
}
const NEON = {
   'led-neon-signs': ['good vibes', '#ff4fa3'], 'custom-neon-signs': ['hello', '#35c3ff'], 'neon-logo-signs': ['Ember', '#ffb36b'], 'neon-name-signs': ['Sofia', '#ff7ad9'],
   'neon-quotes': ['dream big', '#a78bfa'], 'neon-wall-signs': ['create', '#4ade80'], 'neon-shop-signs': ['open', '#ff3b3b'], 'neon-restaurant-signs': ['pizza', '#ffd166'],
   'neon-bar-signs': ['cheers', '#22d3ee'], 'neon-event-signs': ['party', '#f472b6'], 'neon-wedding-signs': ['better together', '#ffb8d9'], 'neon-acrylic-signs': ['studio', '#60a5fa'],
   'custom-shape-neon-signs': ['love', '#fb7185'], 'neon-bedroom-signs': ['sweet dreams', '#c4b5fd'],
}
T['signage-displays/neon-signs'] = (p) => {
   const n = NEON[p.key.split('/').pop()]
   if (!n) return null
   return async () => ({ wall: wallMaterial('concrete', '#2a2624'), view: wallFront, bg: 'night', bloom: { strength: 0.75, radius: 0.12, threshold: 0.5 }, key: 0.3, env: 0.25, items: [(await neonSign({ text: n[0], color: n[1], size: n[0].length > 10 ? 0.5 : 0.75 })).at(0, 1.0, 0)] })
}
const screenScene = (content, { bg = 'dark', wall = true, w = 3.6, h = 2.0, stand, bloom = { strength: 0.45, radius: 0.5, threshold: 0.85 } } = {}) => ({ ...(wall ? { wall: wallMaterial('plaster', '#2b2a2c') } : {}), bg, view: wall ? wallFront : [0.4, 0.2, 1.4], bloom, items: [screen({ w, h, tex: screenContent(w / h, content), stand }).at(0, wall ? 0.6 : 0.3, 0)] })
T['signage-displays/digital-sign-boards'] = (p) => {
   if (has(p, 'menu-boards', 'restaurant')) {
      const menu = (title, col) => screenContent(0.57, { brand: 'bella', headline: title, sub: 'pasta · pizza · dolci', colors: col })
      return { wall: wallMaterial('wood'), bg: 'warm', view: wallFront, bloom: { strength: 0.35, radius: 0.5, threshold: 0.9 }, items: [0, 1, 2].map((i) => screen({ w: 1.15, h: 2.0, tex: menu(['MENU', 'COMBOS', 'DOLCI'][i], i === 1 ? ['#c8362b', '#5a120c'] : ['#2b2b2b', '#c8362b']) }).at((i - 1) * 1.3, 0.8, 0)) }
   }
   if (has(p, 'programmable', 'electronic-message', 'led-digital')) return { wall: wallMaterial('concrete', '#3a3633'), bg: 'night', view: wallFront, bloom: { strength: 0.6, radius: 0.35, threshold: 0.85 }, items: [screen({ w: 3.8, h: 1.2, glow: 1.3, tex: screenContent(3.2, { brand: 'nova', headline: has(p, 'electronic') ? 'WELCOME · CLINIC OPEN 9–5' : 'SALE TODAY · 30% OFF', sub: '', colors: ['#030303', '#030303'], pixel: true }) }).at(0, 1.0, 0)] }
   if (has(p, 'outdoor')) return screenScene({ brand: 'north', headline: 'NORTH/ROW', sub: 'flagship store · open', colors: ['#1f3b57', '#f2c14e'], pixel: true }, { wall: false, bg: 'night', w: 4.2, h: 2.3 })
   return screenScene({ brand: 'nova', headline: 'NOVA LABS', sub: 'welcome to our showroom', colors: ['#0ea5e9', '#7a4cff'] })
}
T['signage-displays/led-displays'] = (p) => {
   if (has(p, 'fine-pitch')) return screenScene({ brand: 'kaya', headline: 'GLOW', sub: 'ultra-sharp detail', colors: ['#e7b8a8', '#9a5b4c'] }, { w: 3.6, h: 2.0 })
   if (has(p, 'rental')) return { bg: 'night', view: [0.45, 0.25, 1.4], bloom: { strength: 0.5, radius: 0.5, threshold: 0.85 }, items: [screen({ w: 3.2, h: 1.8, tex: screenContent(1.78, { brand: 'ember', headline: 'LIVE NOW', sub: 'event screen hire', colors: ['#b5432a', '#4a0b07'], pixel: true }) }).at(0, 1.2, 0), block(0.2, 1.3, 0.2, M.metal('#2a2a2a', 0.5), 0.02).at(-1.2, 0.65, -0.1), block(0.2, 1.3, 0.2, M.metal('#2a2a2a', 0.5), 0.02).at(1.2, 0.65, -0.1), block(3.0, 0.1, 0.9, M.metal('#2a2a2a', 0.5), 0.02).at(0, 0.05, 0)] }
   return screenScene({ brand: has(p, 'commercial') ? 'bella' : 'north', headline: has(p, 'commercial') ? 'OPEN LATE' : 'VIDEO WALL', sub: 'seamless modular display', colors: has(p, 'commercial') ? ['#c8362b', '#2b2b2b'] : ['#7a4cff', '#1d4ed8'], pixel: true }, { w: 4.8, h: 2.7 })
}
T['signage-displays/advertising-displays'] = (p) => {
   if (has(p, 'pop-up')) return { bg: 'cool', view: [0.4, 0.3, 1.5], items: [mesh(new THREE.CylinderGeometry(3.0, 3.0, 2.6, 64, 1, true, Math.PI * 0.72, Math.PI * 0.56), new THREE.MeshStandardMaterial({ map: (() => { const t = P(2.4, { logo: false, draw: art('NOVA LABS', 'booth 24', ['#1d4ed8', '#11151c']) }).map; t.wrapS = THREE.RepeatWrapping; t.repeat.x = -1; return t })(), side: THREE.DoubleSide, roughness: 0.8 })).at(0, 1.3, 2.4), bannerStand({ kind: 'rollup', w: 0.55, h: 1.5, graphic: P(0.37, { logo: false, draw: art('DEMO', '', ['#35c3ff', '#1d4ed8']) }) }).at(1.6, 0, 0.6).turn(-0.4)] }
   // exhibition stands
   return { bg: 'cool', view: [0.6, 0.5, 1.4], items: [block(6, 0.08, 4, M.matte('#d9d4cb'), 0.01).at(0, 0.04, 0.5), panel({ w: 5.6, h: 2.8, t: 0.12, face: P(2, { logo: false, draw: art('OAK & FERN', 'sustainable goods', ['#2f3a2c', '#5a6b4f']) }) }).at(0, 0.08, -1.4), block(5.6, 0.5, 0.1, { front: P(11, { brand: 'oak', bg: '#2f3a2c', ink: '#d9c39a', logoScale: 0.6, emblem: false, tag: false }), all: M.matte('#2f3a2c') }, 0.01).at(0, 3.2, -1.4), tableCover({ w: 2.0, d: 0.7, h: 1.1, front: P(2.86, { brand: 'oak', bg: '#2f3a2c', ink: '#d9c39a', logoScale: 0.18 }), sides: M.matte('#2f3a2c') }).at(-1.2, 0.08, 0.6), shelving({ w: 1.2, h: 1.8, d: 0.5, shelves: 3, side: M.wood(), items: () => productPacks({ n: 3, spacing: 0.34, w: 0.28, h: 0.4, d: 0.2, faces: rackFaces(['oak']) }) }).at(1.8, 0.08, -0.8)] }
}
T['signage-displays/retail-shop-branding'] = (p) => {
   const b = pick(['bella', 'north', 'ember', 'kaya', 'oak', 'bloom'], p.index)
   const B = brand(b)
   const glass = new THREE.MeshStandardMaterial({ color: '#dcebf0', roughness: 0.05, transparent: true, opacity: 0.22, depthWrite: false })
   const shopfront = (sign, deco = []) => ({ bg: 'cool', view: [0.35, 0.2, 1.4], items: [block(5.6, 3.6, 0.2, M.matte('#2a2a2a'), 0.01).at(0, 1.8, -0.15), block(3.6, 2.3, 0.04, M.matte('#f1ebe2'), 0.01).at(-0.7, 1.15, -0.6), block(3.6, 2.3, 0.02, glass, 0.001).at(-0.7, 1.15, 0.0), block(1.0, 2.3, 0.08, M.wood(), 0.01).at(1.9, 1.15, 0.0), sign, ...deco] })
   if (has(p, 'shop-front', 'storefront')) return shopfront(lightBox({ w: 5.2, h: 0.8, d: 0.25, face: face(6.5, b, { logoScale: 0.55, emblem: false, tag: false }).map, glow: 1.1 }).at(0, 2.55, 0.0), has(p, 'storefront') ? [block(1.2, 0.8, 0.05, { front: face(1.5, b, { logoScale: 0.2 }), all: M.matte(B.paper) }, 0.01).at(-1.6, 1.0, 0.03)] : [])
   if (has(p, 'window-vinyl', 'glass-frosting')) {
      const frost = has(p, 'frosting')
      const film = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.2), new THREE.MeshStandardMaterial({ map: P(1.55, { bg: 'rgba(0,0,0,0)', logo: false, draw: frost ? (c, w, h) => { c.fillStyle = 'rgba(245,248,250,0.85)'; c.fillRect(0, h * 0.3, w, h * 0.4); c.globalCompositeOperation = 'destination-out'; c.font = `900 ${h * 0.14}px Arial`; c.textAlign = 'center'; c.fillText('NOVA LABS', w / 2, h * 0.54); c.globalCompositeOperation = 'source-over' } : (c, w, h) => { c.fillStyle = '#ffffff'; c.font = `italic 700 ${h * 0.16}px Georgia`; c.textAlign = 'center'; c.fillText(B.name, w / 2, h * 0.4); c.font = `700 ${h * 0.06}px Arial`; c.fillText('OPEN DAILY · 8AM – 8PM', w / 2, h * 0.56) } }).map, transparent: true }))
      return shopfront(lightBox({ w: 5.2, h: 0.6, d: 0.2, face: face(8.6, frost ? 'nova' : b, { logoScale: 0.55, emblem: false, tag: false }).map, glow: 1.0 }).at(0, 2.7, 0.0), [film.at(-0.7, 1.2, 0.02)])
   }
   if (has(p, 'wall-branding')) return { wall: wallMaterial('plaster', '#ece7df'), items: [block(5.4, 2.7, 0.012, { front: P(2, { logo: false, draw: (c, w, h) => { const g = c.createLinearGradient(0, 0, w, 0); g.addColorStop(0, '#2f3a2c'); g.addColorStop(1, '#5a6b4f'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.globalAlpha = 0.25; c.strokeStyle = '#d9c39a'; c.lineWidth = 3; for (let i = 0; i < 30; i++) { c.beginPath(); c.arc((i * 137) % w, (i * 71) % h, 60, 0, 3); c.stroke() } c.globalAlpha = 1; c.fillStyle = '#d9c39a'; c.font = `900 ${h * 0.12}px Arial`; c.textAlign = 'center'; c.fillText('GROW SOMETHING GOOD', w / 2, h * 0.55) } }), all: M.white() }, 0.002).at(0, 1.75, 0.01), block(1.6, 0.9, 0.7, M.wood(), 0.03).at(-1.6, 0.45, 1.0), block(0.7, 0.7, 0.7, M.matte('#d9c39a'), 0.2).at(1.5, 0.35, 1.2)], view: wallFront, bg: 'sage' }
   if (has(p, 'counter-signs')) return { bg: 'warm', view: [0.5, 0.45, 1.5], items: [block(4, 1.0, 1.4, M.wood(), 0.02).at(0, 0.5, 0), tentCard({ w: 1.2, h: 0.8, face: face(1.5, 'ember', { text: 'Pay here', textY: 0.85, textSize: 0.12 }) }).at(-0.5, 1.0, 0).turn(0.3), grp(block(0.9, 1.2, 0.04, { front: face(0.75, 'ember', { text: 'Tap to pay', textY: 0.85, textSize: 0.1 }), all: M.acrylic('#ffffff') }, 0.02).at(0, 0.6, 0), block(0.9, 0.04, 0.4, M.acrylic('#ffffff'), 0.01).at(0, 0.02, 0.1)).at(1.0, 1.0, -0.2).turn(-0.3)] }
   if (has(p, 'hanging-signs')) return { bg: 'cool', view: [0.4, 0.05, 1.3], aimY: 1, items: [...[-1.5, 1.5].map((x, i) => grp(mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.2, 6), M.metal('#cfd2d6')).at(-0.9, 2.6, 0), mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.2, 6), M.metal('#cfd2d6')).at(0.9, 2.6, 0), block(2.2, 0.8, 0.05, { front: P(2.75, { logo: false, draw: signText(['FRESH PRODUCE', 'BAKERY'][i], { bg: ['#2f3a2c', '#b5432a'][i], ink: '#fff', size: 0.36 }) }), back: P(2.75, { logo: false, draw: signText(['FRESH PRODUCE', 'BAKERY'][i], { bg: ['#2f3a2c', '#b5432a'][i], ink: '#fff', size: 0.36 }) }), all: M.white() }, 0.01).at(0, 1.6, 0)).at(x, 0, i * -1.0).turn(i * 0.15))] }
   if (has(p, 'in-store')) return { bg: 'warm', view: [0.55, 0.45, 1.6], items: [grp(...[0, 1, 2].map((i) => block(1.8 - i * 0.4, 0.5, 1.8 - i * 0.4, { all: P(3.6, { brand: 'ember', logo: false, pattern: 'confetti', patternAlpha: 0.4 }), top: M.white() }, 0.02).at(0, 0.25 + i * 0.5, 0)), ...[...Array(6)].map((_, i) => block(0.3, 0.45, 0.22, { all: P(0.67, { brand: 'ember', logoScale: 0.3, emblem: false, tag: false }) }, 0.01).at(-0.5 + (i % 3) * 0.5, 1.5 + 0.22, (Math.floor(i / 3) - 0.5) * 0.4)), block(1.6, 1.0, 0.04, { front: P(1.6, { logo: false, draw: art('NEW\nBLEND', 'try it today', ['#b5432a', '#4a0b07']) }), all: M.white() }, 0.01).at(0, 2.6, -0.5))] }
   return null
}
T['signage-displays/office-corporate-signage'] = (p) => {
   const b = pick(['nova', 'north', 'oak', 'nova', 'juno', 'north', 'maison', 'nova', 'juno', 'nova', 'juno', 'north'], p.index)
   const B = brand(b)
   if (has(p, 'reception-logos')) return async () => ({ wall: wallMaterial('wood'), view: [0.3, 0.25, 1], bg: 'warm', items: [(await letters3d({ text: 'NOVA LABS', size: 0.55, depth: 0.1, face: M.metal('#e4e6e9', 0.15) })).at(0, 2.0, 0), block(3.6, 1.1, 0.9, { all: M.matte('#11151c'), top: M.matte('#2b2d31') }, 0.04).at(0, 0.55, 1.8)] })
   if (has(p, 'reception-signs', 'company-name')) return { wall: wallMaterial('plaster', '#ece7df'), view: wallFront, bg: 'warm', items: [panel({ w: 3.4, h: 1.3, t: 0.04, face: face(2.6, b, { bg: has(p, 'company') ? '#11151c' : '#f4f1ea', ink: has(p, 'company') ? '#ffffff' : B.paper === '#f4f1ea' ? '#1b1b1b' : B.paper, text: has(p, 'company') ? 'HEAD OFFICE · LEVEL 4' : 'WELCOME', textY: 0.86, textSize: 0.08 }), standoffs: true, edge: M.acrylic('#ffffff') }).at(0, 0.7, 0)] }
   if (has(p, 'directional')) return { wall: wallMaterial('plaster', '#ece7df'), view: wallFront, bg: 'warm', items: [panel({ w: 2.2, h: 1.6, t: 0.03, face: P(1.37, { logo: false, draw: (c, w, h) => { c.fillStyle = '#f4f1ea'; c.fillRect(0, 0, w, h); c.fillStyle = '#d42f25'; c.fillRect(0, 0, w * 0.04, h); c.textBaseline = 'middle'; [['→', 'Meeting rooms 1–4'], ['←', 'Kitchen & lounge'], ['↑', 'Studio · Level 2'], ['↓', 'Reception']].forEach(([a, t], i) => { const y = h * (0.15 + i * 0.23); c.fillStyle = '#d42f25'; c.font = `900 ${h * 0.12}px Arial`; c.fillText(a, w * 0.1, y); c.fillStyle = '#1b1b1b'; c.font = `700 ${h * 0.08}px Arial`; c.fillText(t, w * 0.26, y, w * 0.7) }) } }), standoffs: true }).at(0, 0.7, 0)] }
   if (has(p, 'floor-signs')) return { bg: 'warm', view: [0.6, 0.4, 1.5], items: [grp(block(1.2, 1.9, 0.05, { front: P(0.63, { logo: false, draw: (c, w, h) => { c.fillStyle = '#f2c14e'; c.fillRect(0, 0, w, h); c.fillStyle = '#1b1b1b'; c.beginPath(); c.moveTo(w / 2, h * 0.12); c.lineTo(w * 0.85, h * 0.5); c.lineTo(w * 0.15, h * 0.5); c.fill(); c.fillStyle = '#f2c14e'; c.font = `900 ${h * 0.2}px Arial`; c.textAlign = 'center'; c.fillText('!', w / 2, h * 0.46); c.fillStyle = '#1b1b1b'; c.font = `900 ${h * 0.08}px Arial`; c.fillText('CAUTION', w / 2, h * 0.65); c.font = `700 ${h * 0.05}px Arial`; c.fillText('WET FLOOR', w / 2, h * 0.75) } }), all: M.gloss('#f2c14e') }, 0.04).at(0, 0.95, 0.25).turn(0, -0.25), block(1.2, 1.9, 0.05, M.gloss('#f2c14e'), 0.04).at(0, 0.95, -0.25).turn(0, 0.25)).turn(0.4), block(1.8, 0.01, 1.8, { top: P(1, { logo: false, draw: (c, w, h) => { c.fillStyle = '#1d4ed8'; c.beginPath(); c.arc(w / 2, h / 2, w * 0.48, 0, 7); c.fill(); c.fillStyle = '#fff'; c.font = `900 ${h * 0.14}px Arial`; c.textAlign = 'center'; c.fillText('KEEP 2M', w / 2, h * 0.5); c.font = `700 ${h * 0.08}px Arial`; c.fillText('APART', w / 2, h * 0.64) } }), all: M.white() }, 0.003).at(1.9, 0.005, 0.4)] }
   if (has(p, 'safety', 'emergency')) {
      const emergency = has(p, 'emergency')
      const s1 = emergency ? (c, w, h) => { c.fillStyle = '#0f8a3d'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.font = `900 ${h * 0.45}px Arial`; c.textBaseline = 'middle'; c.fillText('⇦', w * 0.06, h * 0.52); c.font = `800 ${h * 0.3}px Arial`; c.fillText('EXIT', w * 0.42, h * 0.53) } : (c, w, h) => { c.fillStyle = '#1a5fb4'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.font = `800 ${h * 0.18}px Arial`; c.textAlign = 'center'; c.fillText('EYE PROTECTION', w / 2, h * 0.4); c.fillText('MUST BE WORN', w / 2, h * 0.65) }
      const s2 = emergency ? (c, w, h) => { c.fillStyle = '#c8102e'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.font = `800 ${h * 0.2}px Arial`; c.textAlign = 'center'; c.fillText('FIRE', w / 2, h * 0.38); c.fillText('EXTINGUISHER', w / 2, h * 0.64) } : (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.strokeStyle = '#c8102e'; c.lineWidth = h * 0.08; c.beginPath(); c.arc(w * 0.25, h / 2, h * 0.34, 0, 7); c.stroke(); c.beginPath(); c.moveTo(w * 0.13, h * 0.26); c.lineTo(w * 0.37, h * 0.74); c.stroke(); c.fillStyle = '#1b1b1b'; c.font = `800 ${h * 0.17}px Arial`; c.fillText('NO SMOKING', w * 0.48, h * 0.56) }
      return { wall: wallMaterial('plaster', '#ece7df'), view: wallFront, bg: 'cool', items: [panel({ w: 2.0, h: 0.8, t: 0.02, face: P(2.5, { logo: false, draw: s1 }) }).at(-1.2, 1.2, 0), panel({ w: 2.0, h: 0.8, t: 0.02, face: P(2.5, { logo: false, draw: s2 }) }).at(1.2, 1.2, 0)] }
   }
   return null
}
T['signage-displays/event-exhibition-signage'] = (p) => {
   if (has(p, 'stage')) return { bg: 'night', view: [0.3, 0.25, 1.3], key: 1.6, items: [block(7, 0.6, 3, M.matte('#141416'), 0.02).at(0, 0.3, 0.4), panel({ w: 6.4, h: 3.0, t: 0.08, face: P(2.13, { logo: false, draw: art('NOVA LABS\nSUMMIT 2026', 'main stage', ['#1d4ed8', '#7a4cff']) }), frame: '#2a2a2a' }).at(0, 0.6, -0.9), block(0.9, 1.0, 0.6, { front: P(0.9, { brand: 'nova', logoScale: 0.3 }), all: M.matte('#11151c') }, 0.02).at(-1.8, 0.6 + 0.5, 0.8)] }
   const easelSign = (face2, x = 0, rot = 0.2) => easel({ w: 1.4, h: 1.9, face: face2 }).at(x, 0, 0).turn(rot)
   if (has(p, 'wedding')) return { bg: 'blush', view: [0.5, 0.35, 1.6], items: [easelSign(P(0.74, { brand: 'bloom', bg: '#fffaf6', ink: '#3c2a4d', logoScale: 0.1, logoY: 0.18, pattern: 'botanical', patternInk: '#8fae8b', patternAlpha: 0.3, text: 'Sam & Jo', textFont: 'Georgia', textSize: 0.14, textY: 0.52, draw: (c, w, h) => { c.fillStyle = 'rgba(60,42,77,0.5)'; for (let i = 0; i < 8; i++) c.fillRect(w * 0.2, h * (0.62 + i * 0.035), w * 0.6, h * 0.008) } }))] }
   if (has(p, 'welcome')) return { bg: 'warm', view: [0.5, 0.35, 1.6], items: [easelSign(P(0.74, { brand: 'oak', bg: '#f4ead8', ink: '#2f3a2c', logoScale: 0.12, logoY: 0.25, text: 'WELCOME', textSize: 0.16, textY: 0.6, draw: (c, w, h) => { c.fillStyle = '#2f3a2c'; c.font = `400 ${h * 0.04}px Arial`; c.textAlign = 'center'; c.fillText('to the Oak & Fern market', w / 2, h * 0.7) } }))] }
   // direction signs
   return { bg: 'cool', view: [0.5, 0.3, 1.5], items: [grp(mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.8, 16), M.metal('#2a2a2a', 0.4)).at(0, 1.4, 0), block(0.8, 0.06, 0.8, M.metal('#2a2a2a', 0.4), 0.02).at(0, 0.03, 0), ...[['Hall A →', '#1d4ed8'], ['← Registration', '#d42f25'], ['Café →', '#0f8a3d']].map(([t, col], i) => block(1.8, 0.4, 0.04, { front: P(4.5, { logo: false, draw: signText(t, { bg: col, ink: '#fff', size: 0.45 }) }), all: M.white() }, 0.01).at(i % 2 ? -0.7 : 0.7, 2.5 - i * 0.55, 0.03))).turn(0.25)] }
}

/* Packaging specialty boxes & others covered by hand recipes return null here. */

/** Scene factory for a product without a hand-tuned recipe (null → no render). */
export function autoRecipe(p) {
   if (!p) return null
   const t = T[`${p.dept}/${p.cat}`]
   if (!t) return null
   const r = t(p)
   if (!r) return null
   return typeof r === 'function' ? r : () => r
}
