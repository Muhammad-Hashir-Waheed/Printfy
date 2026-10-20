// Packaging, custom packaging and retail packaging scenes.
import { M, bag, block, carton, drawerBox, hingedBox, lidBox, mailer, pillowBox, prismBox, sheet, tissuePaper, tube } from '../studio.js'
import { counterDisplay, floorDisplay, lipBalm, productRow } from '../kit.js'
import * as THREE from 'three'
import { P, candleJar, draw, dropperBottle, palette, perfumeBottle, soapBar, tuckCarton } from './common.js'

const handle = () => {
   const h = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.06, 16, 48, Math.PI), M.matte('#1f3b57'))
   h.position.set(0, 1.6, 0)
   h.castShadow = true
   return h
}

const kraftLogo = (aspect, brand = 'oak', extra = {}) => P(aspect, { brand, kraft: true, logoScale: 0.16, ...extra })

export default {
   /* ───────── Mailer boxes ───────── */
   'packaging/mailer-boxes/branded-mailer-box': () => ({
      view: [0.9, 1.05, 1.7],
      items: [
         mailer({ outside: M.matte('#1f3b57'), top: P(1.3, { brand: 'north', pattern: 'dots', patternAlpha: 0.12, logoScale: 0.16 }) }).at(-1.45, 0, 0.35).turn(0.42),
         mailer({ outside: M.matte('#1f3b57'), inside: P(1, { brand: 'north', bg: '#f2c14e', logo: false, pattern: 'stripes', patternInk: '#1f3b57', patternAlpha: 0.18 }), top: M.matte('#1f3b57'), open: 112, tissue: '#f7f4ee' }).at(1.6, 0, -0.55).turn(-0.38),
      ],
   }),
   'packaging/mailer-boxes/kraft-mailer-box': () => ({
      view: [0.8, 1.05, 1.7],
      items: [
         mailer({ w: 2.4, h: 0.75, d: 1.8, outside: M.kraft(), top: kraftLogo(2.4 / 1.8) }).at(-1.35, 0, 0.3).turn(0.35),
         mailer({ w: 2.4, h: 0.75, d: 1.8, outside: M.kraft(), inside: M.kraft('#b88a58'), open: 105, tissue: '#efe6d6' }).at(1.5, 0, -0.5).turn(-0.3),
      ],
   }),
   'packaging/mailer-boxes/inside-printed-mailer-box': () => ({
      bg: 'blush',
      view: [0.55, 1.25, 1.4],
      items: [mailer({ outside: M.white('#f6f2ee'), inside: P(1.3, { brand: 'kaya', pattern: 'botanical', patternInk: '#9a5b4c', patternAlpha: 0.45, logoScale: 0.11, ink: '#9a5b4c' }), top: P(1.3, { brand: 'kaya', bg: '#f6f2ee', ink: '#9a5b4c', logoScale: 0.12 }), open: 108 })],
   }),
   'packaging/mailer-boxes/lite-mailer-box': () => ({
      bg: 'cool',
      view: [0.9, 1.0, 1.7],
      items: [
         mailer({ w: 2.2, h: 0.55, d: 1.6, outside: M.white(), top: P(1.375, { brand: 'juno', bg: '#f5f3ef', logoScale: 0.14 }) }).at(-0.9, 0, 0.4).turn(0.3),
         mailer({ w: 2.2, h: 0.55, d: 1.6, outside: M.white(), top: P(1.375, { brand: 'juno', bg: '#f5f3ef', logoScale: 0.14 }) }).at(-0.75, 0.551, 0.3).turn(0.18),
         mailer({ w: 1.6, h: 0.5, d: 1.2, outside: M.white(), top: P(1.33, { brand: 'juno', bg: '#f5f3ef', logoScale: 0.14 }) }).at(1.3, 0, -0.4).turn(-0.5),
      ],
   }),
   'packaging/mailer-boxes/rigid-mailer-box': () => ({
      view: [0.8, 1.0, 1.6],
      items: [mailer({ w: 2.4, h: 0.85, d: 1.9, outside: M.softTouch('#16130f'), inside: M.matte('#d9b56a'), top: P(2.4 / 1.9, { brand: 'maison', logoScale: 0.14 }), open: 100, tissue: '#16130f' })],
   }),

   /* ───────── Rigid boxes ───────── */
   'packaging/rigid-boxes/lift-off-lid-box': () => ({
      view: [0.7, 1.05, 1.6],
      items: [lidBox({ w: 2, h: 1, d: 2, base: M.matte('#e9dfd3'), lid: P(1, { brand: 'bloom', bg: '#e9dfd3', ink: '#3c2a4d', logoScale: 0.14 }), inside: M.matte('#c4558a'), lidPos: 'beside', contents: tissuePaper(1.85, 1.85, '#f6e6ef').at(0, 0.62, 0) })],
   }),
   'packaging/rigid-boxes/drawer-rigid-box': () => ({
      bg: 'sage',
      view: [0.9, 1.05, 1.5],
      items: [drawerBox({ w: 1.9, h: 0.75, d: 2.5, sleeve: P(0.76, { brand: 'oak', bg: '#2f3a2c', ink: '#d9c39a', logoScale: 0.12 }), drawer: M.matte('#e8dcc8'), inside: M.matte('#cdbb9c'), pull: 0.42, ribbon: '#d9c39a' }).turn(0.5)],
   }),
   'packaging/rigid-boxes/book-style-rigid-box': () => ({
      view: [0.2, 1.1, 1.6],
      items: [
         hingedBox({ w: 1.8, h: 0.6, d: 2.5, outside: M.softTouch('#1d2a3a'), inside: M.matte('#efe6d8'), openDeg: 115, hinge: 'left' }).at(0.9, 0, 0).turn(0.15),
         block(1.84, 0.62, 2.54, { all: M.softTouch('#1d2a3a'), top: P(0.72, { brand: 'maison', bg: '#1d2a3a', logoScale: 0.12 }) }, 0.02).at(-1.6, 0.31, 0.2).turn(0.3),
      ],
   }),
   'packaging/rigid-boxes/collapsible-rigid-box': () => ({
      bg: 'cool',
      view: [0.9, 1.0, 1.6],
      items: [
         lidBox({ w: 2.2, h: 1.1, d: 1.6, base: M.matte('#e7e3dc'), lid: P(1.375, { brand: 'juno', bg: '#e7e3dc', logoScale: 0.15 }) }).at(-0.9, 0, 0.2).turn(0.35),
         block(2.6, 0.06, 1.9, { all: M.matte('#e7e3dc'), top: P(1.37, { brand: 'juno', bg: '#e7e3dc', logoScale: 0.12 }) }, 0.01).at(1.55, 0.09, -0.45).turn(-0.4),
         block(2.6, 0.06, 1.9, M.matte('#d8d3cb'), 0.01).at(1.6, 0.03, -0.4).turn(-0.36),
      ],
   }),

   /* ───────── Corrugated / folding cartons / kraft ───────── */
   'packaging/corrugated-boxes/printed-corrugated-box': () => ({
      view: [0.9, 0.85, 1.7],
      items: [
         carton({ w: 2.2, h: 1.5, d: 1.6, faces: { all: M.kraft(), front: kraftLogo(1.47, 'oak', { logoScale: 0.18, draw: draw.fragile() }), top: P(1.37, { brand: 'oak', kraft: true, logo: false, band: null, draw: (c, w, h) => { c.fillStyle = 'rgba(200,170,120,0.85)'; c.fillRect(0, h * 0.44, w, h * 0.12) } }) } }).at(-0.9, 0, 0.2).turn(0.3),
         carton({ w: 1.6, h: 1.1, d: 1.2, faces: { all: M.kraft(), front: kraftLogo(1.45, 'oak', { logoScale: 0.18 }) } }).at(1.25, 0, -0.3).turn(-0.35),
      ],
   }),
   'packaging/folding-cartons/auto-lock-bottom-carton': () => ({
      bg: 'cool',
      view: [0.9, 0.9, 1.7],
      items: [
         carton({ w: 0.9, h: 1.8, d: 0.9, faces: { all: P(0.5, { brand: 'ember', logoScale: 0.18 }), top: M.matte('#b5432a') } }).at(-0.6, 0, 0).turn(0.35),
         carton({ w: 0.9, h: 1.8, d: 0.9, faces: { all: P(0.5, { brand: 'ember', logoScale: 0.18 }), back: P(1, { bg: '#c86a52', logo: false, draw: draw.lock() }) } }).at(1.0, 0.45, 0.1).turn(-0.5, -Math.PI / 2 + 0.0, 0),
      ],
   }),
   'packaging/folding-cartons/perfume-sleeve-carton': () => ({
      bg: 'warm',
      view: [0.6, 0.75, 1.7],
      items: [
         carton({ w: 0.75, h: 1.7, d: 0.6, faces: { all: M.softTouch('#16130f'), front: P(0.44, { brand: 'maison', logoScale: 0.22, logoY: 0.45 }) } }).at(-0.45, 0, 0).turn(0.25),
         perfumeBottle('#e8c9a0', '#d9b56a').at(0.65, 0, 0.25),
      ],
   }),
   'packaging/folding-cartons/pharmaceutical-carton': () => ({
      bg: 'cool',
      view: [0.85, 0.75, 1.7],
      items: [
         carton({ w: 1.6, h: 0.8, d: 0.6, faces: { all: M.white('#fbfbfb'), front: P(2, { bg: '#fbfbfb', logo: false, draw: draw.rx('VITALIS D3', '1000 IU · dietary supplement', '#2a9d8f') }) } }).at(-0.6, 0, 0.1).turn(0.25),
         carton({ w: 1.6, h: 0.8, d: 0.6, faces: { all: M.white('#fbfbfb'), front: P(2, { bg: '#fbfbfb', logo: false, draw: draw.rx('VITALIS C', '500 mg · dietary supplement', '#e76f51') }) } }).at(0.9, 0, -0.3).turn(-0.3),
      ],
   }),
   'packaging/kraft-boxes/kraft-pillow-box': () => ({
      view: [0.7, 1.0, 1.6],
      items: [
         pillowBox({ w: 2.0, bulge: 0.5, len: 1.3, mat: M.kraft() }).at(-0.6, 0, 0.2).turn(0.4),
         pillowBox({ w: 1.6, bulge: 0.4, len: 1.0, mat: kraftLogo(1.4, 'oak', { logoScale: 0.12 }) }).at(1.2, 0, -0.4).turn(-0.3),
      ],
   }),
   'packaging/kraft-boxes/kraft-soap-box': () => ({
      bg: 'sage',
      view: [0.8, 0.9, 1.6],
      items: [
         carton({ w: 1.0, h: 0.4, d: 0.7, faces: { all: M.kraft(), top: kraftLogo(1.43, 'oak', { logoScale: 0.15 }) } }).at(-0.6, 0, 0.1).turn(0.3),
         carton({ w: 1.0, h: 0.4, d: 0.7, faces: { all: M.kraft(), top: kraftLogo(1.43, 'oak', { logoScale: 0.15 }) } }).at(-0.55, 0.405, 0.05).turn(0.2),
         soapBar('#d9e3cf').at(0.9, 0, 0.1).turn(-0.4),
      ],
   }),
   'packaging/kraft-boxes/kraft-tuck-box': () => ({
      view: [0.8, 1.0, 1.7],
      items: [
         tuckCarton({ w: 1.0, h: 1.5, d: 0.6, faces: { all: M.kraft(), front: kraftLogo(0.67, 'oak', { logoScale: 0.22 }) } }).at(-0.7, 0, 0).turn(0.3),
         tuckCarton({ w: 1.0, h: 1.5, d: 0.6, faces: { all: M.kraft(), front: kraftLogo(0.67, 'oak', { logoScale: 0.22 }) }, flapMat: M.kraft(), open: 115 }).at(0.7, 0, -0.2).turn(-0.3),
      ],
   }),
   'packaging/kraft-boxes/kraft-window-box': () => ({
      view: [0.5, 1.4, 1.4],
      items: [lidBox({ w: 2.2, h: 0.6, d: 1.6, lidH: 0.22, base: M.kraft(), lid: P(1.37, { brand: 'oak', kraft: true, logoScale: 0.1, logoY: 0.82, emblem: false, draw: draw.window('#f6efe3') }) })],
   }),

   /* ───────── Specialty ───────── */
   'packaging/specialty-boxes/briefcase-handle-box': () => ({
      view: [0.8, 0.8, 1.7],
      items: [
         carton({ w: 2.2, h: 1.6, d: 0.7, faces: { all: M.matte('#1f3b57'), front: P(1.37, { brand: 'north', logoScale: 0.15 }) } }),
         handle(),
      ],
   }),
   'packaging/specialty-boxes/cylinder-tube-box': () => ({
      bg: 'blush',
      view: [0.8, 0.7, 1.7],
      items: [
         tube({ r: 0.5, h: 2.0, body: P(3.1, { fit: 0.3, brand: 'kaya', pattern: 'botanical', patternInk: '#9a5b4c', patternAlpha: 0.3, logoScale: 0.3 }), lid: M.matte('#9a5b4c') }).at(-0.6, 0, 0),
         tube({ r: 0.4, h: 1.5, body: P(3.1, { fit: 0.3, brand: 'kaya', logoScale: 0.3 }), lid: M.matte('#9a5b4c'), lidLift: 0 }).at(0.7, 0, -0.3),
      ],
   }),
   'packaging/specialty-boxes/hexagon-box': () => ({
      bg: 'warm',
      view: [0.8, 1.2, 1.6],
      items: [
         prismBox({ r: 0.9, h: 0.8, body: M.softTouch('#16130f'), lid: P(1, { brand: 'maison', logoScale: 0.16, rot: 90 }) }).at(-0.7, 0, 0),
         prismBox({ r: 0.6, h: 0.6, body: M.matte('#d9b56a'), lid: M.matte('#d9b56a') }).at(1.0, 0, -0.3),
      ],
   }),
   'packaging/specialty-boxes/luxury-perfume-box': () => ({
      view: [0.5, 1.15, 1.5],
      items: [hingedBox({ w: 1.6, h: 0.7, d: 2.2, outside: M.softTouch('#16130f'), cover: P(0.73, { brand: 'maison', logoScale: 0.12 }), inside: M.matte('#efe1c8'), openDeg: 105, hinge: 'back', insert: block(1.5, 0.3, 2.1, M.matte('#2a2420'), 0.02).at(0, 0.18, 0), contents: perfumeBottle('#e8c9a0', '#d9b56a').at(0, 0.3, 0.1).grow(0.95) })],
   }),
   'packaging/specialty-boxes/magnetic-makeup-box': () => ({
      bg: 'blush',
      view: [0.5, 1.3, 1.5],
      items: [hingedBox({ w: 1.9, h: 0.4, d: 1.4, outside: M.matte('#e7b8a8'), cover: P(1.36, { brand: 'kaya', logoScale: 0.14 }), inside: M.matte('#f6e3dc'), openDeg: 100, hinge: 'back', contents: palette().at(0, 0.04, 0.05) })],
   }),
   'packaging/specialty-boxes/pillow-box': () => ({
      bg: 'blush',
      view: [0.7, 1.0, 1.6],
      items: [
         pillowBox({ w: 2.0, bulge: 0.5, len: 1.3, mat: P(1.4, { brand: 'bloom', pattern: 'confetti', patternAlpha: 0.5, logoScale: 0.13 }) }).at(-0.6, 0, 0.2).turn(0.35),
         pillowBox({ w: 1.6, bulge: 0.4, len: 1.0, mat: P(1.4, { brand: 'bloom', bg: '#c4558a', ink: '#ffffff', logoScale: 0.14 }) }).at(1.2, 0, -0.4).turn(-0.3),
      ],
   }),
   'packaging/specialty-boxes/sliding-sleeve-box': () => ({
      bg: 'warm',
      view: [0.9, 1.1, 1.5],
      items: [drawerBox({ w: 1.6, h: 0.5, d: 2.4, sleeve: P(0.67, { brand: 'ember', logoScale: 0.12 }), drawer: M.matte('#fff6ea'), inside: M.kraft(), pull: 0.35, ribbon: '#b5432a' }).turn(0.55)],
   }),

   /* ───────── Custom packaging ───────── */
   'custom-packaging/custom-boxes/custom-luxury-box': () => ({
      view: [0.8, 1.0, 1.6],
      items: [
         lidBox({ w: 2, h: 0.9, d: 2, base: M.softTouch('#16130f'), lid: P(1, { brand: 'maison', logoScale: 0.14 }) }).at(-0.7, 0, 0.1).turn(0.3),
         lidBox({ w: 1.3, h: 0.6, d: 1.3, base: M.matte('#d9b56a'), lid: M.matte('#d9b56a') }).at(1.2, 0, -0.3).turn(-0.4),
      ],
   }),
   'custom-packaging/custom-boxes/custom-shape-box': () => ({
      bg: 'cool',
      view: [0.8, 1.0, 1.7],
      items: [
         prismBox({ r: 0.75, h: 0.7, body: M.matte('#1f3b57'), lid: P(1, { brand: 'north', logoScale: 0.16, rot: 90 }) }).at(-1.5, 0, 0.1),
         pillowBox({ w: 1.6, bulge: 0.42, len: 1.0, mat: P(1.4, { brand: 'north', logoScale: 0.13 }) }).at(0.2, 0, 0.4).turn(-0.2),
         tube({ r: 0.38, h: 1.5, body: P(3.1, { fit: 0.3, brand: 'north', logoScale: 0.28 }), lid: M.matte('#f2c14e') }).at(1.6, 0, -0.4),
      ],
   }),
   'custom-packaging/custom-printing/prototype-and-sample-box': () => ({
      bg: 'cool',
      view: [0.5, 1.4, 1.4],
      items: [
         carton({ w: 1.3, h: 0.9, d: 1.0, faces: { all: M.white('#fbfbfb') } }).at(-1.0, 0, -0.2).turn(0.4),
         sheet({ w: 2.6, h: 1.9, t: 0.006, front: P(1.37, { bg: '#fbfbfb', logo: false, draw: draw.dieline() }) }).at(0.7, 0, 0.3).turn(-0.15),
      ],
   }),
   'custom-packaging/custom-bags/custom-luxury-bags': () => ({
      view: [0.6, 0.6, 1.7],
      items: [
         bag({ front: P(0.8, { brand: 'maison', logoScale: 0.16 }), side: M.softTouch('#16130f'), handles: 'ribbon', handleColor: '#d9b56a' }).at(-0.9, 0, 0).turn(0.3),
         bag({ w: 1.2, h: 1.5, d: 0.6, front: P(0.8, { brand: 'maison', logoScale: 0.16 }), side: M.softTouch('#16130f'), handles: 'ribbon', handleColor: '#d9b56a' }).at(0.9, 0, -0.4).turn(-0.3),
      ],
   }),

   /* ───────── Retail: display boxes ───────── */
   'retail-packaging/display-boxes/counter-display-box': () => ({
      bg: 'warm',
      view: [0.6, 0.8, 1.7],
      items: [counterDisplay({ outside: P(4, { brand: 'ember', logo: false }), header: P(1.8, { brand: 'ember', logoScale: 0.2 }), items: productRow({ n: 4, spacing: 0.45, make: () => carton({ w: 0.36, h: 0.55, d: 0.25, faces: { all: P(0.65, { brand: 'ember', logoScale: 0.3, emblem: false, tag: false }) } }) }).at(0, 0.04, 0.05) })],
   }),
   'retail-packaging/display-boxes/lip-balm-display-box': () => ({
      bg: 'blush',
      view: [0.6, 0.9, 1.6],
      items: [counterDisplay({ w: 1.6, d: 0.9, h: 0.35, headerH: 0.8, outside: P(4, { brand: 'kaya', logo: false, pattern: 'botanical', patternAlpha: 0.3 }), header: P(2, { brand: 'kaya', logoScale: 0.22 }), items: productRow({ n: 6, spacing: 0.22, make: (i) => lipBalm(['#e7b8a8', '#c4558a', '#f0d2b8'][i % 3]) }).at(0, 0.04, 0.1) })],
   }),
   'retail-packaging/display-boxes/point-of-sale-display': () => ({
      bg: 'cool',
      view: [0.6, 0.7, 1.7],
      items: [counterDisplay({ w: 2.2, d: 1.2, h: 0.5, headerH: 1.6, outside: M.matte('#11151c'), header: P(1.37, { brand: 'nova', logoScale: 0.18, text: 'NEW · TRY ME', textY: 0.85 }), items: productRow({ n: 4, spacing: 0.5, make: () => carton({ w: 0.4, h: 0.7, d: 0.3, faces: { all: P(0.57, { brand: 'nova', logoScale: 0.28, emblem: false, tag: false }) } }) }).at(0, 0.04, 0.1) })],
   }),
   'retail-packaging/display-boxes/window-display-box': () => ({
      bg: 'warm',
      view: [0.8, 0.8, 1.7],
      items: [
         carton({ w: 1.6, h: 1.2, d: 0.5, faces: { all: M.matte('#2f3a2c'), front: P(1.33, { brand: 'oak', bg: '#2f3a2c', ink: '#d9c39a', logoScale: 0.1, logoY: 0.83, emblem: false, draw: draw.window('#efe6d6', ['#c49a6c', '#a77a4b', '#d9c39a', '#8a6a4a']) }) } }).at(-0.6, 0, 0).turn(0.3),
         carton({ w: 1.6, h: 1.2, d: 0.5, faces: { all: M.matte('#2f3a2c'), front: P(1.33, { brand: 'oak', bg: '#2f3a2c', ink: '#d9c39a', logoScale: 0.1, logoY: 0.83, emblem: false, draw: draw.window('#efe6d6', ['#c49a6c', '#a77a4b', '#d9c39a', '#8a6a4a']) }) } }).at(1.1, 0, -0.4).turn(-0.3),
      ],
   }),
   'retail-packaging/display-boxes/floor-display-unit': () => ({
      bg: 'warm',
      view: [0.6, 0.35, 1.7],
      pad: 1.0,
      aimY: 1,
      items: [floorDisplay({ side: P(0.3, { brand: 'ember', logo: false }), header: P(1.9, { brand: 'ember', logoScale: 0.2 }), shelfFront: P(6, { brand: 'ember', logo: false, text: 'FRESHLY ROASTED', textY: 0.7, textSize: 0.5 }), items: () => productRow({ n: 4, spacing: 0.36, make: () => carton({ w: 0.3, h: 0.55, d: 0.22, faces: { all: P(0.55, { brand: 'ember', logoScale: 0.3, emblem: false, tag: false }) } }) }) })],
   }),

   /* ───────── Retail: inserts ───────── */
   'retail-packaging/inserts/cardboard-box-insert': () => ({
      view: [0.45, 1.45, 1.3],
      items: [
         mailer({ w: 2.4, h: 0.8, d: 1.8, outside: M.kraft(), inside: M.kraft('#b88a58'), open: 115 }),
         block(2.3, 0.6, 0.03, M.kraft('#b88a58'), 0.004).at(0, 0.33, 0),
         block(0.03, 0.6, 1.7, M.kraft('#b88a58'), 0.004).at(-0.4, 0.33, 0),
         block(0.03, 0.6, 1.7, M.kraft('#b88a58'), 0.004).at(0.4, 0.33, 0),
         dropperBottle().at(-0.8, 0.04, -0.45).grow(0.75),
         dropperBottle('#8fb39a').at(0, 0.04, 0.45).grow(0.75),
         dropperBottle().at(0.8, 0.04, -0.45).grow(0.75),
      ],
   }),
   'retail-packaging/inserts/foam-insert': () => ({
      bg: 'cool',
      view: [0.45, 1.35, 1.35],
      items: [hingedBox({ w: 2.2, h: 0.6, d: 1.6, outside: M.softTouch('#1b1b1d'), inside: M.softTouch('#2a2a2c'), openDeg: 100, hinge: 'back', insert: block(2.1, 0.45, 1.5, M.softTouch('#141415'), 0.02).at(0, 0.26, 0), contents: [-0.6, 0, 0.6].reduce((g, x) => g.add(dropperBottle('#c9895a').turn(0, Math.PI / 2).at(x, 0.62, 0).grow(0.8)) && g, block(0.01, 0.01, 0.01, M.matte('#000'))) })],
   }),
   'retail-packaging/inserts/fragrance-cards': () => ({
      bg: 'warm',
      view: [0.4, 1.4, 1.2],
      items: [
         sheet({ w: 0.55, h: 1.6, t: 0.01, front: P(0.34, { brand: 'maison', logoScale: 0.3, logoY: 0.35 }) }).at(-0.5, 0, 0).turn(0.2),
         sheet({ w: 0.55, h: 1.6, t: 0.01, front: P(0.34, { brand: 'maison', bg: '#f4ead8', ink: '#16130f', logoScale: 0.3, logoY: 0.35 }) }).at(0.15, 0.011, 0.1).turn(-0.15),
         perfumeBottle('#e8c9a0', '#d9b56a').at(1.0, 0, -0.3),
      ],
   }),
   'retail-packaging/inserts/product-leaflet': () => ({
      bg: 'cool',
      view: [0.4, 1.4, 1.2],
      items: [
         sheet({ w: 1.4, h: 2.0, front: P(0.7, { brand: 'kaya', logoScale: 0.12, logoY: 0.25, draw: (c, w, h) => { c.fillStyle = 'rgba(154,91,76,0.55)'; for (let i = 0; i < 9; i++) c.fillRect(w * 0.12, h * (0.45 + i * 0.05), w * (0.6 + (i % 3) * 0.1), h * 0.012) } }) }).at(-0.4, 0, 0).turn(0.15),
         carton({ w: 0.8, h: 1.3, d: 0.5, faces: { all: P(0.62, { brand: 'kaya', logoScale: 0.2 }) } }).at(1.1, 0, -0.3).turn(-0.3),
      ],
   }),

   /* ───────── Retail: product boxes ───────── */
   'retail-packaging/product-boxes/candle-box': () => ({
      bg: 'sage',
      view: [0.8, 0.8, 1.7],
      items: [
         carton({ w: 1.0, h: 1.05, d: 1.0, faces: { all: P(0.95, { brand: 'oak', bg: '#e8dfcf', ink: '#2f3a2c', pattern: 'botanical', patternAlpha: 0.18, logoScale: 0.18 }), top: M.matte('#2f3a2c') } }).at(-0.6, 0, 0).turn(0.3),
         candleJar('#efe6d6', P(2, { brand: 'oak', bg: '#e8dfcf', ink: '#2f3a2c', logoScale: 0.3, emblem: false })).at(0.8, 0, 0.1),
      ],
   }),
   'retail-packaging/product-boxes/cosmetic-product-box': () => ({
      bg: 'blush',
      view: [0.8, 0.8, 1.7],
      items: [
         carton({ w: 0.7, h: 1.4, d: 0.7, faces: { all: P(0.5, { brand: 'kaya', logoScale: 0.22 }) } }).at(-0.7, 0, 0).turn(0.3),
         carton({ w: 0.6, h: 1.0, d: 0.6, faces: { all: P(0.6, { brand: 'kaya', bg: '#f6e3dc', ink: '#9a5b4c', logoScale: 0.22 }) } }).at(0.15, 0, 0.35).turn(-0.1),
         dropperBottle('#c9895a').at(0.95, 0, -0.1),
      ],
   }),
   'retail-packaging/product-boxes/electric-box': () => ({
      bg: 'cool',
      view: [0.8, 0.8, 1.7],
      items: [
         carton({ w: 1.6, h: 1.1, d: 0.9, faces: { all: M.matte('#11151c'), front: P(1.45, { brand: 'nova', logoScale: 0.14, text: 'SMART LED · 9W', textY: 0.86, textSize: 0.07 }), top: P(1.8, { brand: 'nova', logo: false, pattern: 'grid', patternInk: '#35c3ff', patternAlpha: 0.4 }) } }).at(-0.5, 0, 0).turn(0.35),
         carton({ w: 0.8, h: 1.2, d: 0.8, faces: { all: P(0.67, { brand: 'nova', logoScale: 0.2 }) } }).at(1.2, 0, -0.35).turn(-0.3),
      ],
   }),
   'retail-packaging/product-boxes/parts-box': () => ({
      bg: 'cool',
      view: [0.9, 0.9, 1.7],
      items: [
         carton({ w: 1.6, h: 0.7, d: 1.1, faces: { all: M.white('#fbfbfb'), front: P(2.3, { brand: 'nova', bg: '#fbfbfb', ink: '#11151c', logoScale: 0.16, emblem: false, text: 'PART No. NV-2041', textY: 0.85, textSize: 0.08 }) } }).at(-0.6, 0, 0.2).turn(0.3),
         carton({ w: 1.6, h: 0.7, d: 1.1, faces: { all: M.white('#fbfbfb'), front: P(2.3, { brand: 'nova', bg: '#fbfbfb', ink: '#11151c', logoScale: 0.16, emblem: false, text: 'PART No. NV-2042', textY: 0.85, textSize: 0.08 }) } }).at(-0.55, 0.705, 0.15).turn(0.22),
         carton({ w: 1.1, h: 0.6, d: 0.8, faces: { all: M.white('#fbfbfb'), front: P(1.83, { brand: 'nova', bg: '#fbfbfb', ink: '#11151c', logoScale: 0.16, emblem: false }) } }).at(1.2, 0, -0.3).turn(-0.4),
      ],
   }),
   'retail-packaging/product-boxes/soap-box': () => ({
      bg: 'sage',
      view: [0.8, 0.95, 1.6],
      items: [
         carton({ w: 1.0, h: 0.4, d: 0.7, faces: { all: P(2.5, { brand: 'bloom', bg: '#c4558a', ink: '#fff', logo: false }), top: P(1.43, { brand: 'bloom', pattern: 'botanical', patternAlpha: 0.3, logoScale: 0.16 }) } }).at(-0.6, 0, 0.1).turn(0.3),
         carton({ w: 1.0, h: 0.4, d: 0.7, faces: { all: P(2.5, { brand: 'oak', kraft: true, logo: false }), top: kraftLogo(1.43, 'oak') } }).at(0.4, 0, 0.55).turn(-0.1),
         soapBar('#f3e6ef').at(1.1, 0, -0.4).turn(-0.4),
      ],
   }),
   'retail-packaging/product-boxes/window-product-box': () => ({
      bg: 'warm',
      view: [0.8, 0.8, 1.7],
      items: [
         carton({ w: 1.2, h: 1.6, d: 0.5, faces: { all: M.matte('#c8362b'), front: P(0.75, { brand: 'bella', logoScale: 0.12, logoY: 0.82, emblem: false, draw: draw.window('#f6e7c8', ['#f2c14e', '#e8b04a', '#f2c14e', '#e8b04a']) }) } }).at(-0.6, 0, 0).turn(0.3),
         carton({ w: 1.2, h: 1.6, d: 0.5, faces: { all: M.matte('#c8362b'), front: P(0.75, { brand: 'bella', logoScale: 0.12, logoY: 0.82, emblem: false, draw: draw.window('#f6e7c8', ['#f2c14e', '#e8b04a', '#f2c14e', '#e8b04a']) }) } }).at(0.9, 0, -0.35).turn(-0.3),
      ],
   }),

   /* ───────── Retail: specialty ───────── */
   'retail-packaging/specialty-packaging/custom-tissue-paper': () => {
      const t = tissuePaper(2.3, 1.7, '#ffffff')
      t.material = P(1.35, { brand: 'kaya', bg: '#f6e3dc', pattern: 'monogram', patternAlpha: 0.5, logo: false }, { rough: 0.95 })
      t.material.side = 2
      return {
         bg: 'blush',
         view: [0.45, 1.4, 1.3],
         items: [mailer({ w: 2.6, h: 0.8, d: 2, outside: M.white('#f6f2ee'), inside: M.matte('#e7b8a8'), open: 112, contents: t.at(0, 0.62, 0) })],
      }
   },
}
