// Printing, labels & stickers, marketing materials.
import * as THREE from 'three'
import { M, block, carton, cardStack, cutShape, mailer, sheet } from '../studio.js'
import { folder, labelRoll, notebook, sticker, tentCard, vessel, wallMaterial } from '../kit.js'
import { BRANDS, P, draw } from './common.js'

/* ───────── artwork helpers ───────── */
function cardBack(brandKey, ink) {
   return (ctx, w, h) => {
      const b = BRANDS[brandKey]
      ctx.fillStyle = ink || b.ink
      ctx.textAlign = 'left'
      ctx.font = `700 ${h * 0.11}px Arial`
      ctx.fillText('Alex Morgan', w * 0.09, h * 0.36)
      ctx.font = `400 ${h * 0.065}px Arial`
      ctx.globalAlpha = 0.75
      ctx.fillText('Creative Director', w * 0.09, h * 0.47)
      ctx.globalAlpha = 0.85
      ctx.font = `400 ${h * 0.06}px Arial`
      ;['+00 123 456 789', 'hello@example.com', 'www.example.com'].forEach((l, i) => ctx.fillText(l, w * 0.09, h * (0.66 + i * 0.09)))
      ctx.globalAlpha = 1
      ctx.fillStyle = b.accent
      ctx.fillRect(w * 0.09, h * 0.53, w * 0.12, h * 0.012)
   }
}

/** Letterhead body: logo top-left, address lines, paragraph bars. */
const letter = (brandKey, { accent, cont = false } = {}) => (ctx, w, h) => {
   const b = BRANDS[brandKey]
   ctx.fillStyle = accent || b.accent
   if (!cont) ctx.fillRect(0, 0, w, h * 0.012)
   ctx.fillStyle = 'rgba(30,30,30,0.18)'
   const start = cont ? 0.1 : 0.32
   for (let i = 0; i < 16; i++) ctx.fillRect(w * 0.12, h * (start + i * 0.035), w * (i % 5 === 4 ? 0.45 : 0.76), h * 0.008)
   ctx.fillStyle = b.ink === '#ffffff' ? '#333' : b.ink
   ctx.font = `400 ${h * 0.012}px Arial`
   ctx.textAlign = 'center'
   ctx.fillText('12 Example Street · City · +00 123 456 789 · hello@example.com', w / 2, h * 0.96)
}

const labelSheet = (color, ink) => (ctx, w, h) => {
   const cols = 3, rows = 5
   for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = w * (0.2 + c * 0.3), y = h * (0.12 + r * 0.19), rr = Math.min(w * 0.12, h * 0.08)
      ctx.fillStyle = color
      ctx.beginPath(); ctx.arc(x, y, rr, 0, 7); ctx.fill()
      ctx.fillStyle = ink
      ctx.font = `700 italic ${rr * 0.5}px Georgia`
      ctx.textAlign = 'center'
      ctx.fillText('bloom', x, y + rr * 0.15)
   }
}

const rollLabels = (ctx, w, h) => {
   for (let y = 0; y < h; y += h / 6) {
      ctx.fillStyle = '#c4558a'
      ctx.beginPath(); ctx.roundRect(w * 0.12, y + h * 0.02, w * 0.76, h / 6 - h * 0.04, 20); ctx.fill()
      ctx.fillStyle = '#fff'
      ctx.font = `700 italic ${h * 0.045}px Georgia`
      ctx.textAlign = 'center'
      ctx.fillText('bloomfield', w / 2, y + h / 12 + h * 0.015)
   }
}

const barcode = (label = 'INV-004817') => (ctx, w, h) => {
   ctx.fillStyle = '#111'
   let x = w * 0.08
   let i = 0
   while (x < w * 0.92) {
      const bw = ((i * 7919) % 5) + 2
      if (i % 2 === 0) ctx.fillRect(x, h * 0.18, bw * (w / 400), h * 0.5)
      x += bw * (w / 400) + w / 300
      i++
   }
   ctx.font = `700 ${h * 0.13}px Arial`
   ctx.textAlign = 'center'
   ctx.fillText(label, w / 2, h * 0.88)
}

const shippingLabel = (ctx, w, h) => {
   ctx.fillStyle = '#fff'
   ctx.fillRect(0, 0, w, h)
   ctx.fillStyle = '#111'
   ctx.font = `800 ${h * 0.06}px Arial`
   ctx.fillText('SHIP TO:', w * 0.06, h * 0.1)
   ctx.font = `400 ${h * 0.045}px Arial`
   ;['Jordan Lee', '24 Sample Road', 'Example City 10001'].forEach((t, i) => ctx.fillText(t, w * 0.06, h * (0.18 + i * 0.06)))
   barcode('1Z 999 AA1 0123 4567')(ctx, w, h * 0.92)
}

export default {
   /* ───────── Business cards ───────── */
   'printing/business-cards/kraft-business-cards': () => ({
      view: [0.35, 1.8, 1.1],
      items: [
         cardStack({ w: 0.9, h: 0.55, n: 14, front: P(1.64, { brand: 'oak', kraft: true, logoScale: 0.2 }), edge: M.kraft() }).at(-0.55, 0, 0.1).turn(0.25),
         sheet({ w: 0.9, h: 0.55, t: 0.012, front: P(1.64, { brand: 'oak', kraft: true, logo: false, draw: cardBack('oak') }), edge: M.kraft() }).at(0.6, 0, -0.15).turn(-0.3),
      ],
   }),
   'printing/business-cards/premium-matte-business-cards': () => ({
      bg: 'cool',
      view: [0.35, 1.8, 1.1],
      items: [
         cardStack({ w: 0.9, h: 0.55, n: 14, front: P(1.64, { brand: 'nova', logoScale: 0.18 }), edge: M.matte('#11151c') }).at(-0.55, 0, 0.1).turn(0.25),
         sheet({ w: 0.9, h: 0.55, t: 0.012, front: P(1.64, { brand: 'nova', bg: '#f3f4f6', logo: false, draw: cardBack('nova', '#11151c') }), edge: M.matte('#11151c') }).at(0.6, 0, -0.15).turn(-0.3),
      ],
   }),

   /* ───────── Stationery ───────── */
   'printing/letterheads/standard-letterhead': () => ({
      bg: 'cool',
      view: [0.25, 1.9, 1.0],
      items: [
         sheet({ w: 2.1, h: 2.97, front: P(0.707, { brand: 'juno', bg: '#ffffff', logoScale: 0.05, logoY: 0.1, emblem: false, draw: letter('juno') }) }).at(-0.4, 0, 0).turn(0.12),
         sheet({ w: 2.2, h: 1.1, front: P(2, { brand: 'juno', bg: '#ffffff', logoScale: 0.12, logoY: 0.3, emblem: false }) }).at(1.6, 0.01, 0.5).turn(-0.25),
      ],
   }),
   'printing/letterheads/premium-textured-letterhead': () => ({
      view: [0.25, 1.9, 1.0],
      items: [
         sheet({ w: 2.1, h: 2.97, front: P(0.707, { brand: 'maison', bg: '#f4ead8', ink: '#16130f', logoScale: 0.06, logoY: 0.1, draw: letter('maison', { accent: '#d9b56a' }) }) }).at(-0.3, 0, 0).turn(0.1),
         sheet({ w: 2.1, h: 2.97, front: M.white('#efe4d0') }).at(0.1, -0.004, -0.2).turn(0.18),
      ],
   }),
   'printing/letterheads/continuation-sheets': () => ({
      bg: 'cool',
      view: [0.25, 1.9, 1.0],
      items: [
         sheet({ w: 2.1, h: 2.97, front: P(0.707, { brand: 'juno', bg: '#ffffff', logoScale: 0.05, logoY: 0.1, emblem: false, draw: letter('juno') }) }).at(-1.2, 0, 0).turn(0.08),
         sheet({ w: 2.1, h: 2.97, front: P(0.707, { brand: 'juno', bg: '#ffffff', logo: false, draw: letter('juno', { cont: true }) }) }).at(1.1, 0, 0.1).turn(-0.08),
      ],
   }),
   'printing/office-stationery/compliment-slips': () => ({
      view: [0.25, 1.9, 1.0],
      items: [
         sheet({ w: 2.1, h: 0.99, front: P(2.12, { brand: 'oak', bg: '#fbf8f2', ink: '#2f3a2c', logoScale: 0.14, logoY: 0.4, emblem: false, text: 'with compliments', textFont: 'Georgia', textSize: 0.12, textY: 0.78 }) }).at(-0.2, 0, 0.3).turn(0.1),
         sheet({ w: 2.1, h: 0.99, front: P(2.12, { brand: 'oak', bg: '#fbf8f2', ink: '#2f3a2c', logoScale: 0.14, logoY: 0.4, emblem: false, text: 'with compliments', textFont: 'Georgia', textSize: 0.12, textY: 0.78 }) }).at(0.2, 0.01, -0.5).turn(-0.12),
      ],
   }),
   'printing/office-stationery/certificates': () => ({
      bg: 'warm',
      view: [0.2, 1.9, 1.0],
      items: [sheet({ w: 2.97, h: 2.1, front: P(1.414, { bg: '#fbf6ea', logo: false, draw: (c, w, h) => {
         c.strokeStyle = '#b08d3c'; c.lineWidth = 14; c.strokeRect(w * 0.04, h * 0.05, w * 0.92, h * 0.9)
         c.lineWidth = 3; c.strokeRect(w * 0.065, h * 0.085, w * 0.87, h * 0.83)
         c.fillStyle = '#2b2b2b'; c.textAlign = 'center'
         c.font = `700 ${h * 0.09}px Georgia`; c.fillText('Certificate', w / 2, h * 0.3)
         c.font = `400 ${h * 0.035}px Arial`; c.fillText('OF ACHIEVEMENT · PRESENTED TO', w / 2, h * 0.39)
         c.font = `italic 700 ${h * 0.07}px Georgia`; c.fillText('Sam Taylor', w / 2, h * 0.53)
         c.fillStyle = 'rgba(0,0,0,0.2)'; c.fillRect(w * 0.3, h * 0.57, w * 0.4, 3)
         c.fillStyle = '#c9a227'; c.beginPath(); c.arc(w * 0.5, h * 0.75, h * 0.08, 0, 7); c.fill()
      } }) })],
   }),
   'printing/office-stationery/branded-notebooks': () => ({
      bg: 'sage',
      view: [0.6, 1.5, 1.3],
      items: [
         notebook({ cover: P(0.71, { brand: 'oak', bg: '#2f3a2c', ink: '#d9c39a', logoScale: 0.14 }) }).at(-0.9, 0, 0).turn(0.2),
         notebook({ cover: P(0.71, { brand: 'oak', kraft: true, logoScale: 0.14 }), band: '#2f3a2c' }).at(0.9, 0, -0.1).turn(-0.15),
      ],
   }),
   'printing/brochures/presentation-folder': () => ({
      bg: 'cool',
      view: [0.25, 1.9, 1.0],
      items: [
         folder({ cover: P(0.72, { brand: 'nova', logoScale: 0.12, pattern: 'grid', patternInk: '#35c3ff', patternAlpha: 0.25 }), sheetsMat: M.white() }).at(-0.9, 0, 0).turn(0.12),
         folder({ cover: P(0.72, { brand: 'nova', bg: '#f3f4f6', ink: '#11151c', logoScale: 0.12 }) }).at(1.3, 0, 0.1).turn(-0.1),
      ],
   }),
   'printing/envelopes/kraft-envelopes': () => ({
      view: [0.25, 1.9, 1.0],
      items: [
         sheet({ w: 2.2, h: 1.1, front: P(2, { brand: 'oak', kraft: true, logoScale: 0.11, logoY: 0.3, emblem: false, draw: (c, w, h) => { c.strokeStyle = 'rgba(60,35,10,0.35)'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(w / 2, h * 0.55); c.lineTo(w, 0); c.stroke() } }), edge: M.kraft() }).at(-0.3, 0, 0.2).turn(0.12),
         sheet({ w: 2.2, h: 1.1, front: P(2, { brand: 'oak', kraft: true, logoScale: 0.11, logoY: 0.7, emblem: false }), edge: M.kraft() }).at(0.4, 0.011, -0.5).turn(-0.15),
      ],
   }),

   /* ───────── Flyers ───────── */
   'printing/flyers/door-hangers': () => ({
      bg: 'warm',
      view: [0.3, 1.8, 1.0],
      items: [
         cutShape({ w: 1.0, h: 2.6, outline: 'hanger', mat: P(0.38, { brand: 'ember', logoScale: 0.2, logoY: 0.62, text: '20% OFF', textY: 0.85, textSize: 0.3 }) }).at(-0.6, 0.01, 0).turn(0, -Math.PI / 2 + 0.0, 0).turn(0.2, -Math.PI / 2),
         cutShape({ w: 1.0, h: 2.6, outline: 'hanger', mat: P(0.38, { brand: 'ember', bg: '#fff6ea', ink: '#b5432a', logoScale: 0.2, logoY: 0.62 }) }).at(0.7, 0.01, 0.1).turn(-0.15, -Math.PI / 2),
      ],
   }),
   'printing/flyers/folded-flyers': () => ({
      bg: 'cool',
      view: [0.5, 1.3, 1.4],
      items: [
         ...[-1, 0, 1].map((i) => {
            const pv = new THREE.Group()
            pv.add(sheet({ w: 0.95, h: 2.1, front: P(0.45, i === 0 ? { brand: 'nova', logoScale: 0.28 } : { brand: 'nova', bg: '#f3f4f6', logo: false, draw: (c, w, h) => { c.fillStyle = 'rgba(17,21,28,0.25)'; for (let k = 0; k < 12; k++) c.fillRect(w * 0.12, h * (0.2 + k * 0.05), w * 0.7, h * 0.012) } }) }).turn(0, Math.PI / 2))
            pv.position.set(i * 0.92, 1.05, 0)
            pv.rotation.y = i * 0.35
            return pv
         }),
      ],
   }),
   'printing/flyers/rack-cards': () => ({
      bg: 'sage',
      view: [0.3, 1.8, 1.0],
      items: [0, 1, 2].map((i) => sheet({ w: 1.0, h: 2.1, front: P(0.48, { brand: ['oak', 'ember', 'bloom'][i], logoScale: 0.22, logoY: 0.35, text: 'Discover more', textY: 0.8, textSize: 0.09 }) }).at((i - 1) * 1.15, 0.0, i * 0.05 - 0.05).turn((i - 1) * -0.1)),
   }),

   /* ───────── Labels & stickers ───────── */
   'labels-stickers/product-labels/jar-labels': () => ({
      bg: 'warm',
      view: [0.8, 0.6, 1.7],
      items: [
         vessel({ kind: 'jar', glass: '#e8a23a', label: P(2.8, { brand: 'oak', bg: '#f4ead8', ink: '#2f3a2c', logoScale: 0.3, emblem: false, fit: 0.42, text: 'WILD HONEY', textY: 0.85, textSize: 0.16 }), cap: '#c9a227' }).at(-0.6, 0, 0).turn(0.5),
         vessel({ kind: 'jar', glass: '#b8452e', label: P(2.8, { brand: 'oak', bg: '#f4ead8', ink: '#2f3a2c', logoScale: 0.3, emblem: false, fit: 0.42, text: 'BERRY JAM', textY: 0.85, textSize: 0.16 }), cap: '#2f3a2c' }).at(0.7, 0, -0.3).turn(0.5),
      ],
   }),
   'labels-stickers/product-labels/foil-labels': () => ({
      bg: 'dark',
      view: [0.7, 0.45, 1.7],
      items: [
         vessel({ kind: 'wine', label: P(1.7, { brand: 'maison', logoScale: 0.3, emblem: true, tag: true, fit: 0.5 }, { mat: { metalness: 0.35, roughness: 0.35 } }), cap: '#d9b56a' }).at(-0.4, 0, 0).turn(0.45),
         vessel({ kind: 'wine', label: P(1.7, { brand: 'maison', bg: '#f4ead8', ink: '#a8792a', logoScale: 0.3, fit: 0.5 }, { mat: { metalness: 0.3, roughness: 0.35 } }), cap: '#16130f' }).at(0.6, 0, -0.35).turn(0.45),
      ],
   }),
   'labels-stickers/product-labels/roll-labels': () => ({
      view: [0.9, 0.9, 1.6],
      items: [labelRoll({ labelTex: rollLabels }).turn(-0.75)],
   }),
   'labels-stickers/product-labels/sheet-labels': () => ({
      bg: 'blush',
      view: [0.25, 1.9, 1.0],
      items: [
         sheet({ w: 2.1, h: 2.97, front: P(0.707, { bg: '#ffffff', logo: false, draw: labelSheet('#c4558a', '#ffffff') }) }).at(-0.5, 0, 0).turn(0.1),
         sheet({ w: 2.1, h: 2.97, front: P(0.707, { bg: '#ffffff', logo: false, draw: labelSheet('#f3e6ef', '#c4558a') }) }).at(0.9, 0.01, 0.15).turn(-0.12),
      ],
   }),
   'labels-stickers/shipping-labels/thermal-shipping-labels': () => ({
      view: [0.85, 0.9, 1.6],
      items: [
         carton({ w: 2.0, h: 1.3, d: 1.5, faces: { all: M.kraft(), top: P(1.33, { kraft: true, logo: false, draw: (c, w, h) => { c.save(); c.translate(w * 0.28, h * 0.22); c.scale(0.45, 0.55); shippingLabel(c, w, h); c.restore() } }) } }).at(-0.7, 0, 0).turn(0.3),
         labelRoll({ r: 0.45, w: 0.6, labelTex: (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); for (let y = 0; y < h; y += h / 4) { c.save(); c.translate(w * 0.1, y + h * 0.02); c.scale(0.8, 0.22); shippingLabel(c, w, h); c.restore() } }, liner: '#ffffff' }).at(1.3, 0, -0.6).turn(-0.5),
      ],
   }),
   'labels-stickers/barcode-qr-labels/inventory-labels': () => ({
      bg: 'cool',
      view: [0.8, 0.9, 1.6],
      items: [
         carton({ w: 1.8, h: 1.2, d: 1.3, faces: { all: M.kraft(), front: P(1.5, { kraft: true, logo: false, draw: (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(w * 0.25, h * 0.3, w * 0.5, h * 0.35); c.save(); c.translate(w * 0.27, h * 0.32); c.scale(0.46, 0.31); barcode('SKU 004817')(c, w, h); c.restore() } }) } }).at(-0.5, 0, 0).turn(0.3),
         carton({ w: 1.4, h: 0.9, d: 1.0, faces: { all: M.kraft(), front: P(1.55, { kraft: true, logo: false, draw: (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(w * 0.25, h * 0.3, w * 0.5, h * 0.35); c.save(); c.translate(w * 0.27, h * 0.32); c.scale(0.46, 0.31); barcode('SKU 004818')(c, w, h); c.restore() } }) } }).at(1.2, 0, -0.4).turn(-0.3),
      ],
   }),
   'labels-stickers/barcode-qr-labels/asset-tags': () => ({
      bg: 'cool',
      view: [0.3, 1.8, 1.0],
      items: [0, 1, 2, 3].map((i) => block(1.1, 0.02, 0.5, { top: P(2.2, { bg: '#d5d8dc', logo: false, draw: (c, w, h) => { c.fillStyle = '#11151c'; c.font = `800 ${h * 0.16}px Arial`; c.fillText('NOVA LABS · ASSET', w * 0.06, h * 0.22); barcode(`AT-00${41 + i}`)(c, w, h * 1.05) } }, { mat: { metalness: 0.7, roughness: 0.35 } }), all: M.metal('#c9cdd2', 0.35) }, 0.03).at((i % 2) * 1.25 - 0.6, 0.01, Math.floor(i / 2) * 0.7 - 0.35).turn((i - 1.5) * 0.06)),
   }),
   'labels-stickers/stickers/vinyl-stickers': () => ({
      bg: 'sage',
      view: [0.2, 1.9, 1.0],
      items: [
         block(3.2, 0.12, 2.1, M.matte('#2b2d31'), 0.06).at(0, 0.06, 0),
         sticker({ size: 0.8, shape: 'circle', face: P(1, { brand: 'ember', logoScale: 0.16 }) }).at(-0.9, 0.12, -0.3),
         sticker({ size: 0.7, shape: 'star', face: P(1, { bg: '#f2c14e', logo: false, text: 'WOW', textY: 0.6, textSize: 0.3, ink: '#1b1b1b' }) }).at(0.1, 0.12, 0.35),
         sticker({ size: 0.85, shape: 'rounded', face: P(1, { brand: 'north', logoScale: 0.16 }) }).at(0.95, 0.12, -0.35),
         sticker({ size: 0.6, shape: 'blob', face: P(1, { brand: 'bloom', logoScale: 0.18 }) }).at(-0.2, 0.12, -0.55),
      ],
   }),
   'labels-stickers/stickers/window-decals': async () => {
      const glass = new THREE.MeshStandardMaterial({ color: '#dcebf0', roughness: 0.05, metalness: 0, transparent: true, opacity: 0.22, depthWrite: false })
      return {
         bg: 'cool',
         view: [0.15, 0.25, 1.0],
         items: [
            block(3.6, 2.6, 0.04, M.matte('#f1ebe2'), 0.01).at(0, 1.3, -0.6),
            ...[[0, 2.6, 3.6, 0.08], [0, 0.04, 3.6, 0.08], [-1.76, 1.3, 0.08, 2.6], [1.76, 1.3, 0.08, 2.6]].map(([x, y, w, h]) => block(w, h, 0.06, M.metal('#2a2a2a', 0.4), 0.01).at(x, y, 0)),
            block(3.4, 2.4, 0.02, glass, 0.001).at(0, 1.3, 0),
            new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.9), new THREE.MeshStandardMaterial({ map: (await import('../art.js')).printFace(1.78, { brand: 'ember', bg: 'rgba(0,0,0,0)', ink: '#b5432a', logoScale: 0.18 }), transparent: true, roughness: 0.6 })).at(0, 1.55, 0.015),
            new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.3), new THREE.MeshStandardMaterial({ map: (await import('../art.js')).printFace(8, { bg: 'rgba(0,0,0,0)', logo: false, text: 'OPEN DAILY · 7AM – 7PM', textY: 0.7, textSize: 0.45, ink: '#1b1b1b' }), transparent: true })).at(0, 0.75, 0.015),
         ],
      }
   },

   /* ───────── Marketing ───────── */
   'marketing/promotional-materials/table-tent-cards': () => ({
      bg: 'warm',
      view: [0.7, 0.55, 1.7],
      items: [
         block(4, 0.08, 2.4, M.wood(), 0.02).at(0, 0.04, 0),
         tentCard({ face: P(1.4, { brand: 'ember', logoScale: 0.14, text: 'Try our cold brew', textY: 0.82, textSize: 0.09 }) }).at(-0.6, 0.08, 0).turn(0.35),
         tentCard({ w: 1.1, h: 0.8, face: P(1.37, { brand: 'ember', bg: '#fff6ea', ink: '#b5432a', logoScale: 0.14, text: 'Reserved', textY: 0.82, textSize: 0.12, textFont: 'Georgia' }) }).at(1.0, 0.08, -0.3).turn(-0.4),
      ],
   }),
}
