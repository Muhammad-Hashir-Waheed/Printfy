// Signage & displays + marketing banners.
import * as THREE from 'three'
import { M, block } from '../studio.js'
import { bannerStand, featherFlag, letters3d, lightBox, panel, screen, screenContent, tableCover, wallMaterial } from '../kit.js'
import { P } from './common.js'
import { canvasTexture } from '../art.js'

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

const wallFront = [0.22, 0.07, 1]
const graphic = (aspect, brand, extra = {}) => P(aspect, { brand, logoScale: 0.12, ...extra })

/** Tall banner artwork: logo top, headline, image block, call to action. */
const bannerArt = (brand, headline, colors) => (c, w, h) => {
   const gr = c.createLinearGradient(0, 0, 0, h)
   gr.addColorStop(0, colors[0]); gr.addColorStop(1, colors[1])
   c.fillStyle = gr; c.fillRect(0, 0, w, h)
   c.fillStyle = 'rgba(255,255,255,0.14)'
   c.beginPath(); c.arc(w * 0.8, h * 0.55, w * 0.55, 0, 7); c.fill()
   c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'
   const lines = headline.split('\n')
   let fs = Math.min(w * 0.13, h * 0.11)
   c.font = `900 ${fs}px Arial`
   const widest = Math.max(...lines.map((l) => c.measureText(l).width), 1)
   if (widest > w * 0.86) {
      fs *= (w * 0.86) / widest
      c.font = `900 ${fs}px Arial`
   }
   const top = h * 0.42 - ((lines.length - 1) * fs * 1.15) / 2
   lines.forEach((l, i) => c.fillText(l, w / 2, top + i * fs * 1.15))
   c.font = `400 ${Math.min(w * 0.05, h * 0.045)}px Arial`
   c.fillText('www.example.com', w / 2, h * 0.92)
}

const logoWall = (brands) => (c, w, h) => {
   c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h)
   const cols = 4, rows = 6
   const cw = w / cols, rh = h / rows
   c.textAlign = 'center'; c.textBaseline = 'middle'
   for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
      const b = brands[(k + r) % brands.length]
      const serif = /[a-z]/.test(b[0]) && !/[A-Z]{3}/.test(b[0])
      let fs = rh * 0.42
      c.font = serif ? `italic 700 ${fs}px Georgia` : `900 ${fs * 0.8}px Arial`
      const tw = c.measureText(b[0]).width
      if (tw > cw * 0.8) { fs *= (cw * 0.8) / tw; c.font = serif ? `italic 700 ${fs}px Georgia` : `900 ${fs * 0.8}px Arial` }
      c.fillStyle = b[1]
      c.fillText(b[0], (k + 0.5 + (r % 2 ? 0.5 : 0)) * cw - (r % 2 && k === cols - 1 ? w : 0), (r + 0.5) * rh)
   }
}
const SPONSORS = [['NOVA LABS', '#11151c'], ['Ember', '#b5432a', `italic 700 ${40}px Georgia`], ['NORTH/ROW', '#1f3b57'], ['bloomfield', '#c4558a', `italic 700 ${40}px Georgia`]]

const signFace = (brand, text, { bg, ink, icon } = {}) => (c, w, h) => {
   c.fillStyle = bg || '#ffffff'; c.fillRect(0, 0, w, h)
   c.fillStyle = ink || '#11151c'; c.textAlign = 'left'; c.textBaseline = 'middle'
   if (icon) { c.font = `900 ${h * 0.5}px Arial`; c.fillText(icon, w * 0.07, h * 0.52) }
   c.font = `800 ${h * 0.3}px Arial`
   c.fillText(text, icon ? w * 0.3 : w * 0.08, h * 0.52)
}

const metalWall = () => wallMaterial('plaster', '#ece7df')

export default {
   /* ───────── 3D / raised letters ───────── */
   'signage-displays/3d-raised-letter-signs/3d-acrylic-letters': async () => ({
      wall: metalWall(), view: wallFront, bg: 'warm',
      items: [(await letters3d({ text: 'JUNO', size: 0.9, depth: 0.2, face: M.gloss('#d42f25'), side: M.gloss('#d42f25') })).at(0, 0.9, 0)],
   }),
   'signage-displays/3d-raised-letter-signs/acrylic-letters': async () => ({
      wall: wallMaterial('plaster', '#2f3a2c'), view: wallFront, bg: 'sage',
      items: [(await letters3d({ text: 'oak & fern', font: 'optimer_bold', size: 0.7, depth: 0.12, face: M.gloss('#f4f1ea'), side: M.acrylic('#ffffff') })).at(0, 1.0, 0)],
   }),
   'signage-displays/3d-raised-letter-signs/aluminum-letters': async () => ({
      wall: wallMaterial('concrete', '#c9c6c1'), view: wallFront, bg: 'cool',
      items: [(await letters3d({ text: 'NORTH/ROW', size: 0.6, depth: 0.14, face: M.metal('#d4d7db', 0.28), side: M.metal('#b9bdc2', 0.35) })).at(0, 1.0, 0)],
   }),
   'signage-displays/3d-raised-letter-signs/gold-and-silver-letters': async () => ({
      wall: wallMaterial('plaster', '#1b1a1c'), view: wallFront, bg: 'dark', env: 1,
      items: [
         (await letters3d({ text: 'MAISON', size: 0.7, depth: 0.12, face: M.foil('#d9b56a', 0.2) })).at(0, 1.3, 0),
         (await letters3d({ text: 'VALE', size: 0.45, depth: 0.1, face: M.metal('#e4e6e9', 0.15) })).at(0, 0.6, 0),
      ],
   }),
   'signage-displays/3d-raised-letter-signs/building-logos': async () => ({
      wall: wallMaterial('concrete', '#b9b5ae'), view: [0.4, 0.05, 1], bg: 'cool',
      items: [
         block(5.2, 0.05, 0.05, M.metal('#2a2a2a'), 0.01).at(0, 0.55, 0.02),
         (await letters3d({ text: 'NOVA LABS', size: 0.65, depth: 0.25, face: M.matte('#11151c'), side: M.matte('#11151c') })).at(0, 0.8, 0),
         block(5.2, 0.05, 0.05, M.metal('#2a2a2a'), 0.01).at(0, 1.6, 0.02),
      ],
   }),
   'signage-displays/3d-raised-letter-signs/corporate-logos': async () => ({
      wall: wallMaterial('wood'), view: wallFront, bg: 'warm',
      items: [
         mesh(new THREE.TorusGeometry(0.45, 0.06, 16, 64), M.metal('#d4d7db', 0.25)).at(-2.45, 1.17, 0.06),
         (await letters3d({ text: 'N', size: 0.5, depth: 0.12, face: M.metal('#d4d7db', 0.25) })).at(-2.45, 0.92, 0),
         (await letters3d({ text: 'NOVA LABS', size: 0.5, depth: 0.12, face: M.metal('#d4d7db', 0.25) })).at(0.6, 0.92, 0),
      ],
   }),
   'signage-displays/3d-raised-letter-signs/raised-logo-signs': async () => ({
      wall: metalWall(), view: wallFront, bg: 'warm',
      items: [
         panel({ w: 3.4, h: 1.5, t: 0.06, face: M.matte('#1f3b57'), standoffs: true }).at(0, 0.5, 0),
         (await letters3d({ text: 'NORTH/ROW', size: 0.3, depth: 0.06, face: M.matte('#ffffff') })).at(0, 1.1, 0.08),
      ],
   }),
   'signage-displays/3d-raised-letter-signs/reception-logos': async () => ({
      wall: wallMaterial('wood'), view: [0.35, 0.3, 1], bg: 'warm',
      items: [
         (await letters3d({ text: 'Ember', font: 'gentilis_bold', size: 0.8, depth: 0.12, face: M.foil('#d9b56a', 0.22) })).at(0, 2.0, 0),
         block(3.6, 1.1, 0.9, { all: M.matte('#f4f1ea'), top: M.matte('#e9e2d6') }, 0.04).at(0, 0.55, 1.8),
      ],
   }),
   'signage-displays/3d-raised-letter-signs/wall-mounted-logos': async () => ({
      wall: wallMaterial('plaster', '#f0ebe3'), view: wallFront, bg: 'warm',
      items: [
         mesh(new THREE.CircleGeometry(0.55, 64), M.matte('#c4558a')).at(-2.35, 1.1, 0.02),
         (await letters3d({ text: 'b', font: 'gentilis_bold', size: 0.6, depth: 0.08, face: M.matte('#ffffff') })).at(-2.35, 0.85, 0.03),
         (await letters3d({ text: 'bloomfield', font: 'gentilis_bold', size: 0.55, depth: 0.1, face: M.matte('#3c2a4d') })).at(0.55, 0.85, 0),
      ],
   }),
   'signage-displays/3d-raised-letter-signs/channel-letters': async () => ({
      wall: wallMaterial('concrete', '#3a3633'), view: [0.35, 0.2, 1], bg: 'night', bloom: { strength: 0.55, radius: 0.45, threshold: 0.88 },
      items: [(await letters3d({ text: 'EMBER', size: 0.85, depth: 0.25, face: M.glow('#ffb36b', 2.4), side: M.metal('#2a2a2a', 0.5) })).at(0, 0.8, 0)],
   }),

   /* ───────── Sign boards ───────── */
   'signage-displays/sign-boards/aluminum-sign-boards': () => ({
      wall: wallMaterial('concrete', '#bdb9b2'), view: wallFront, bg: 'cool',
      items: [panel({ w: 3.4, h: 1.6, t: 0.03, face: P(2.12, { brand: 'nova', bg: '#d9dcdf', ink: '#11151c', logoScale: 0.14 }, { mat: { metalness: 0.6, roughness: 0.35 } }), edge: M.metal('#cfd2d6'), standoffs: true }).at(0, 0.6, 0)],
   }),
   'signage-displays/sign-boards/stainless-steel-sign-boards': () => ({
      wall: wallMaterial('plaster', '#2b2a2c'), view: wallFront, bg: 'dark', env: 1,
      items: [panel({ w: 3.0, h: 1.4, t: 0.03, face: P(2.14, { brand: 'maison', bg: '#c9cdd2', ink: '#16130f', logoScale: 0.14 }, { mat: { metalness: 0.9, roughness: 0.22 } }), edge: M.metal('#d4d7db', 0.2), standoffs: true }).at(0, 0.7, 0)],
   }),
   'signage-displays/sign-boards/back-lit-sign-boards': () => ({
      wall: wallMaterial('concrete', '#3a3633'), view: wallFront, bg: 'night', bloom: { strength: 0.7, radius: 0.5, threshold: 0.8 },
      items: [lightBox({ w: 3.6, h: 1.2, face: P(3, { brand: 'ember', logoScale: 0.16 }).map, glow: 1.5 }).at(0, 0.8, 0)],
   }),
   'signage-displays/sign-boards/front-lit-sign-boards': () => ({
      wall: wallMaterial('concrete', '#56514c'), view: wallFront, bg: 'night', key: 0.4,
      items: [
         panel({ w: 4, h: 1.3, t: 0.12, face: P(3.08, { brand: 'bella', logoScale: 0.16 }), edge: M.metal('#2a2a2a') }).at(0, 0.6, 0),
         ...[-1.3, 0, 1.3].map((x) => grp(block(0.04, 0.04, 0.6, M.metal('#2a2a2a'), 0.01).at(0, 0, 0.3), block(0.35, 0.08, 0.14, M.metal('#2a2a2a'), 0.02).at(0, -0.02, 0.62), (() => { const l = new THREE.SpotLight('#fff4e0', 18, 4, 0.9, 0.6); l.position.set(0, -0.05, 0.62); l.target.position.set(0, -1, 0.05); const g2 = grp(l); g2.add(l.target); return g2 })()).at(x, 2.05, 0)),
      ],
   }),
   'signage-displays/sign-boards/flex-sign-boards': () => ({
      wall: wallMaterial('concrete', '#c7c2bb'), view: wallFront, bg: 'cool',
      items: [panel({ w: 4.6, h: 1.4, t: 0.1, face: P(3.3, { brand: 'bella', logoScale: 0.17, text: 'FRESH PASTA · DAILY', textY: 0.86, textSize: 0.11 }), edge: M.metal('#e0e0e0'), frame: '#e0e0e0' }).at(0, 0.5, 0)],
   }),
   'signage-displays/sign-boards/office-sign-boards': () => ({
      wall: wallMaterial('plaster', '#ece7df'), view: wallFront, bg: 'warm',
      items: [panel({ w: 2.4, h: 1.2, t: 0.04, face: P(2, { brand: 'nova', logoScale: 0.14, text: 'Floor 3 · Studio', textY: 0.86, textSize: 0.08 }), standoffs: true, edge: M.matte('#11151c') }).at(0, 0.8, 0)],
   }),
   'signage-displays/sign-boards/raised-letter-sign-boards': async () => ({
      wall: wallMaterial('wood'), view: wallFront, bg: 'warm',
      items: [
         panel({ w: 3.6, h: 1.2, t: 0.06, face: M.matte('#16130f'), edge: M.matte('#16130f') }).at(0, 0.7, 0),
         (await letters3d({ text: 'MAISON VALE', size: 0.32, depth: 0.06, face: M.foil('#d9b56a', 0.2) })).at(0, 1.15, 0.06),
      ],
   }),
   'signage-displays/sign-boards/safety-sign-boards': () => ({
      wall: wallMaterial('concrete', '#c9c6c1'), view: wallFront, bg: 'cool',
      items: [
         panel({ w: 1.6, h: 1.1, t: 0.03, face: P(1.45, { logo: false, draw: (c, w, h) => { c.fillStyle = '#1a5fb4'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.beginPath(); c.arc(w / 2, h * 0.42, h * 0.28, 0, 7); c.fill(); c.fillStyle = '#1a5fb4'; c.font = `900 ${h * 0.28}px Arial`; c.textAlign = 'center'; c.fillText('⛑', w / 2, h * 0.52); c.fillStyle = '#fff'; c.font = `800 ${h * 0.1}px Arial`; c.fillText('HARD HATS REQUIRED', w / 2, h * 0.88) } }) }).at(-1.0, 0.8, 0),
         panel({ w: 1.6, h: 1.1, t: 0.03, face: P(1.45, { logo: false, draw: (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#f2c14e'; c.beginPath(); c.moveTo(w / 2, h * 0.12); c.lineTo(w * 0.72, h * 0.66); c.lineTo(w * 0.28, h * 0.66); c.fill(); c.fillStyle = '#111'; c.font = `900 ${h * 0.3}px Arial`; c.textAlign = 'center'; c.fillText('!', w / 2, h * 0.6); c.font = `800 ${h * 0.1}px Arial`; c.fillText('CAUTION', w / 2, h * 0.86) } }) }).at(1.0, 0.8, 0),
      ],
   }),

   /* ───────── Office / corporate ───────── */
   'signage-displays/office-corporate-signage/corporate-branding': async () => ({
      wall: wallMaterial('plaster', '#1f3b57'), view: [0.3, 0.25, 1], bg: 'cool',
      items: [
         (await letters3d({ text: 'NORTH/ROW', size: 0.55, depth: 0.08, face: M.matte('#ffffff') })).at(0, 1.6, 0),
         panel({ w: 4.4, h: 0.12, t: 0.02, face: M.matte('#f2c14e') }).at(0, 1.35, 0),
      ],
   }),
   'signage-displays/office-corporate-signage/department-signs': () => ({
      wall: wallMaterial('plaster', '#ece7df'), view: wallFront, bg: 'warm',
      items: [panel({ w: 2.4, h: 1.5, t: 0.03, face: P(1.6, { logo: false, draw: (c, w, h) => { c.fillStyle = '#11151c'; c.fillRect(0, 0, w, h); c.textBaseline = 'middle'; [['→', 'Marketing'], ['←', 'Finance'], ['↑', 'Design Studio'], ['↓', 'Reception']].forEach(([a, t], i) => { const y = h * (0.17 + i * 0.22); c.fillStyle = '#35c3ff'; c.font = `900 ${h * 0.13}px Arial`; c.fillText(a, w * 0.08, y); c.fillStyle = '#fff'; c.font = `700 ${h * 0.1}px Arial`; c.fillText(t, w * 0.25, y); c.fillStyle = 'rgba(255,255,255,0.12)'; c.fillRect(w * 0.08, y + h * 0.1, w * 0.84, 2) }) } }), standoffs: true, edge: M.matte('#11151c') }).at(0, 0.6, 0)],
   }),
   'signage-displays/office-corporate-signage/desk-signs': () => ({
      bg: 'warm', view: [0.5, 0.45, 1.6],
      items: [
         block(4, 0.08, 2.0, M.wood(), 0.02).at(0, 0.04, 0),
         grp(block(1.6, 0.5, 0.05, { front: P(3.2, { logo: false, draw: (c, w, h) => { c.fillStyle = '#16130f'; c.fillRect(0, 0, w, h); c.fillStyle = '#d9b56a'; c.textAlign = 'center'; c.font = `700 ${h * 0.34}px Georgia`; c.fillText('Alex Morgan', w / 2, h * 0.5); c.font = `400 ${h * 0.15}px Arial`; c.fillText('CREATIVE DIRECTOR', w / 2, h * 0.78) } }), all: M.matte('#16130f') }, 0.01).at(0, 0.3, 0).turn(0, -0.25), block(1.7, 0.05, 0.4, M.metal('#d9b56a', 0.25), 0.01).at(0, 0.03, 0.05)).at(-0.2, 0.08, 0.2).turn(0.25),
      ],
   }),
   'signage-displays/office-corporate-signage/door-signs': () => ({
      wall: wallMaterial('plaster', '#ece7df'), view: [0.25, 0.05, 1], bg: 'warm',
      items: [
         block(1.7, 3.0, 0.1, M.wood(), 0.02).at(0, 1.5, 0.05),
         block(0.08, 0.08, 0.35, M.metal('#cfd2d6', 0.25), 0.02).at(0.6, 1.4, 0.25),
         panel({ w: 1.1, h: 0.42, t: 0.02, face: P(2.6, { logo: false, draw: signFace('nova', 'Room 204', { bg: '#11151c', ink: '#ffffff' }) }) }).at(0, 2.05, 0.1),
      ],
   }),
   'signage-displays/office-corporate-signage/room-signs': () => ({
      wall: wallMaterial('plaster', '#e3ded6'), view: wallFront, bg: 'warm',
      items: [
         panel({ w: 1.6, h: 0.55, t: 0.03, face: P(2.9, { logo: false, draw: (c, w, h) => { c.fillStyle = '#f4f1ea'; c.fillRect(0, 0, w, h); c.fillStyle = '#d42f25'; c.fillRect(0, 0, w * 0.05, h); c.fillStyle = '#1b1b1b'; c.font = `800 ${h * 0.24}px Arial`; c.fillText('Meeting Room', w * 0.12, h * 0.45, w * 0.8); c.font = `400 ${h * 0.16}px Arial`; c.fillText('Level 2 · Seats 8', w * 0.12, h * 0.75) } }), standoffs: false }).at(-0.9, 1.2, 0),
         panel({ w: 1.6, h: 0.55, t: 0.03, face: P(2.9, { logo: false, draw: (c, w, h) => { c.fillStyle = '#f4f1ea'; c.fillRect(0, 0, w, h); c.fillStyle = '#d42f25'; c.fillRect(0, 0, w * 0.05, h); c.fillStyle = '#1b1b1b'; c.font = `800 ${h * 0.24}px Arial`; c.fillText('Studio B', w * 0.12, h * 0.45, w * 0.8); c.font = `400 ${h * 0.16}px Arial`; c.fillText('Level 2 · Creative', w * 0.12, h * 0.75) } }), standoffs: false }).at(0.9, 1.2, 0),
      ],
   }),

   /* ───────── Retail / shop branding ───────── */
   'signage-displays/retail-shop-branding/reception-signs': async () => ({
      wall: wallMaterial('plaster', '#e9e2d6'), view: [0.4, 0.3, 1], bg: 'warm',
      items: [
         (await letters3d({ text: 'kaya', font: 'gentilis_bold', size: 0.8, depth: 0.1, face: M.foil('#c98a7a', 0.25) })).at(0, 2.0, 0),
         (await letters3d({ text: 'SKIN STUDIO', size: 0.18, depth: 0.04, face: M.matte('#9a5b4c') })).at(0, 1.75, 0),
         block(3.4, 1.1, 0.9, { all: M.matte('#f6e3dc'), front: P(3.1, { brand: 'kaya', bg: '#f6e3dc', ink: '#9a5b4c', logoScale: 0.2, emblem: false }) }, 0.05).at(0, 0.55, 1.2),
      ],
   }),
   'signage-displays/retail-shop-branding/shelf-signs': () => ({
      bg: 'warm', view: [0.45, 0.35, 1.5],
      items: [
         block(4.4, 0.08, 1.0, M.white(), 0.01).at(0, 1.0, 0),
         block(4.4, 0.08, 1.0, M.white(), 0.01).at(0, 0.0 + 0.04, 0),
         ...[-1.6, -0.8, 0, 0.8, 1.6].map((x, i) => block(0.5, 0.75, 0.4, { all: P(0.67, { brand: ['ember', 'oak', 'bella', 'kaya', 'north'][i], logoScale: 0.26, emblem: false, tag: false }) }, 0.01).at(x, 1.42, -0.1)),
         block(1.6, 0.5, 0.03, { front: P(3.2, { logo: false, draw: (c, w, h) => { c.fillStyle = '#d42f25'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.textAlign = 'center'; c.font = `900 ${h * 0.42}px Arial`; c.fillText('2 FOR 1', w / 2, h * 0.5); c.font = `700 ${h * 0.16}px Arial`; c.fillText('THIS WEEK ONLY', w / 2, h * 0.8) } }), all: M.white() }, 0.004).at(-0.6, 0.78, 0.52).turn(0, -0.15),
      ],
   }),
   'signage-displays/retail-shop-branding/wayfinding-signs': () => ({
      bg: 'cool', view: [0.6, 0.3, 1.5], pad: 1.05, aimY: 1,
      items: [
         grp(
            block(1.2, 3.6, 0.3, { front: P(0.33, { logo: false, draw: (c, w, h) => { c.fillStyle = '#11151c'; c.fillRect(0, 0, w, h); c.fillStyle = '#35c3ff'; c.fillRect(0, 0, w, h * 0.06); const rows = [['→', 'Reception'], ['↑', 'Lifts'], ['←', 'Café'], ['↗', 'Parking'], ['↓', 'Exit']]; c.textBaseline = 'middle'; rows.forEach(([a, t], i) => { const y = h * (0.18 + i * 0.15); c.fillStyle = '#fff'; c.font = `900 ${w * 0.18}px Arial`; c.fillText(a, w * 0.08, y); c.font = `700 ${w * 0.11}px Arial`; c.fillText(t, w * 0.32, y); c.fillStyle = 'rgba(255,255,255,0.15)'; c.fillRect(w * 0.08, y + h * 0.06, w * 0.84, 2) }) } }), all: M.matte('#11151c') }, 0.03).at(0, 1.8, 0),
            block(1.4, 0.1, 0.5, M.matte('#11151c'), 0.02).at(0, 0.05, 0)
         ).turn(0.3),
      ],
   }),
   'signage-displays/retail-shop-branding/window-graphics': async () => {
      const { printFace } = await import('../art.js')
      const glass = new THREE.MeshStandardMaterial({ color: '#dcebf0', roughness: 0.05, transparent: true, opacity: 0.22, depthWrite: false })
      return {
         bg: 'cool', view: [0.2, 0.15, 1],
         items: [
            block(5.2, 3.2, 0.06, M.matte('#f1ebe2'), 0.01).at(0, 1.6, -0.6),
            ...[[0, 3.15, 5.2, 0.1], [0, 0.05, 5.2, 0.1], [-2.55, 1.6, 0.1, 3.2], [2.55, 1.6, 0.1, 3.2]].map(([x, y, w, h]) => block(w, h, 0.08, M.matte('#1b1b1b'), 0.01).at(x, y, 0)),
            block(4.9, 2.9, 0.02, glass, 0.001).at(0, 1.6, 0),
            new THREE.Mesh(new THREE.PlaneGeometry(4.6, 1.3), new THREE.MeshStandardMaterial({ map: printFace(3.5, { bg: 'rgba(0,0,0,0)', logo: false, draw: (c, w, h) => { c.fillStyle = '#d42f25'; c.font = `900 ${h * 0.5}px Arial`; c.textAlign = 'center'; c.fillText('SALE', w * 0.27, h * 0.66, w * 0.4); c.fillStyle = '#1b1b1b'; c.font = `800 ${h * 0.17}px Arial`; c.fillText('UP TO 50% OFF', w * 0.72, h * 0.48, w * 0.48); c.font = `400 ${h * 0.11}px Arial`; c.fillText('in store now', w * 0.72, h * 0.68) } }), transparent: true })).at(0, 2.1, 0.015),
            new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.4), new THREE.MeshStandardMaterial({ map: printFace(1, { brand: 'north', bg: 'rgba(0,0,0,0)', ink: '#1f3b57', logoScale: 0.14 }), transparent: true })).at(0, 0.85, 0.015),
         ],
      }
   },

   /* ───────── Advertising displays ───────── */
   'signage-displays/advertising-displays/roll-up-banners': () => ({
      bg: 'cool', view: [0.5, 0.25, 1.6],
      items: [
         bannerStand({ kind: 'rollup', graphic: P(0.42, { logo: false, draw: bannerArt('nova', 'BUILT FOR\nWHAT\'S NEXT', ['#1d4ed8', '#11151c']) }) }).at(-1.1, 0, 0).turn(0.2),
         bannerStand({ kind: 'rollup', graphic: P(0.42, { logo: false, draw: bannerArt('ember', 'FRESHLY\nROASTED', ['#b5432a', '#4a120a']) }) }).at(1.1, 0, -0.3).turn(-0.2),
      ],
   }),
   'signage-displays/advertising-displays/pull-up-banners': () => ({
      bg: 'warm', view: [0.5, 0.25, 1.6],
      items: [bannerStand({ kind: 'rollup', graphic: P(0.42, { logo: false, draw: bannerArt('kaya', 'kaya\nGLOW\nNATURALLY', ['#e7b8a8', '#9a5b4c']) }) }).turn(0.25)],
   }),
   'signage-displays/advertising-displays/x-banners': () => ({
      bg: 'cool', view: [0.5, 0.25, 1.6],
      items: [bannerStand({ kind: 'x', w: 0.8, h: 1.8, graphic: P(0.44, { logo: false, draw: bannerArt('north', 'NEW\nCOLLECTION', ['#1f3b57', '#0c1724']) }) }).turn(0.25)],
   }),
   'signage-displays/advertising-displays/l-banners': () => ({
      bg: 'warm', view: [0.5, 0.25, 1.6],
      items: [bannerStand({ kind: 'l', w: 0.8, h: 1.8, graphic: P(0.44, { logo: false, draw: bannerArt('bella', 'TASTE\nOF ITALY', ['#c8362b', '#5a120c']) }) }).turn(0.25)],
   }),
   'signage-displays/advertising-displays/backdrops': () => ({
      bg: 'cool', view: [0.4, 0.25, 1.4],
      items: [panel({ w: 5, h: 2.6, t: 0.06, face: P(1.92, { logo: false, draw: bannerArt('nova', 'NOVA LABS\nSUMMIT 2026', ['#11151c', '#1d4ed8']) }), frame: '#c9cdd2' }).at(0, 0.1, 0), block(5.4, 0.1, 1.4, M.matte('#2b2d31'), 0.02).at(0, 0.05, 0.6)],
   }),
   'signage-displays/advertising-displays/step-and-repeat-walls': () => ({
      bg: 'cool', view: [0.35, 0.2, 1.3],
      items: [panel({ w: 5.2, h: 2.8, t: 0.06, face: P(1.86, { logo: false, draw: logoWall(SPONSORS) }), frame: '#c9cdd2' }).at(0, 0.05, 0), block(3.0, 0.02, 1.4, M.matte('#b8233a'), 0.005).at(0, 0.01, 1.0)],
   }),
   'signage-displays/advertising-displays/media-walls': () => ({
      bg: 'dark', view: [0.35, 0.2, 1.3], key: 2,
      items: [panel({ w: 5.2, h: 2.8, t: 0.06, face: P(1.86, { logo: false, draw: logoWall([['NOVA LABS', '#11151c'], ['SUMMIT 2026', '#1d4ed8']]) }), frame: '#2a2a2a' }).at(0, 0.05, 0)],
   }),
   'signage-displays/advertising-displays/promotional-stands': () => ({
      bg: 'warm', view: [0.5, 0.45, 1.6],
      items: [
         block(1.8, 1.9, 0.9, { front: P(0.95, { logo: false, draw: bannerArt('ember', 'FREE\nTASTING', ['#b5432a', '#4a120a']) }), all: M.matte('#b5432a') }, 0.05).at(0, 0.95, 0),
         block(1.9, 0.06, 1.0, M.wood(), 0.01).at(0, 1.93, 0),
         block(1.8, 0.7, 0.04, { front: P(2.57, { brand: 'ember', logoScale: 0.2 }), all: M.matte('#b5432a') }, 0.01).at(0, 2.6, -0.3),
         block(0.06, 0.7, 0.06, M.metal('#2a2a2a'), 0.01).at(0, 2.1, -0.3),
      ],
   }),
   'signage-displays/advertising-displays/counter-displays': () => ({
      bg: 'cool', view: [0.6, 0.45, 1.6],
      items: [
         tableCover({ w: 2.8, d: 0.8, h: 1.2, front: P(3.5, { brand: 'nova', logoScale: 0.18 }), sides: M.matte('#11151c') }),
         block(2.0, 0.6, 0.04, { front: P(3.33, { brand: 'nova', bg: '#1d4ed8', logoScale: 0.2 }), all: M.matte('#11151c') }, 0.01).at(0, 1.6, -0.2),
         block(0.06, 0.3, 0.06, M.metal('#2a2a2a'), 0.01).at(0, 1.3, -0.2),
      ],
   }),

   /* ───────── Event & exhibition ───────── */
   'signage-displays/event-exhibition-signage/exhibition-booths': () => ({
      bg: 'cool', view: [0.6, 0.45, 1.4],
      items: [
         block(5.6, 0.08, 3.4, M.matte('#e9e4da'), 0.01).at(0, 0.04, 0.4),
         panel({ w: 5.2, h: 2.8, t: 0.1, face: P(1.86, { logo: false, draw: bannerArt('nova', 'NOVA LABS', ['#1d4ed8', '#11151c']) }) }).at(0, 0.08, -1.2),
         panel({ w: 2.6, h: 2.8, t: 0.1, face: P(0.93, { logo: false, draw: bannerArt('nova', 'MEET\nUS', ['#11151c', '#1d4ed8']) }) }).at(-2.6, 0.08, -0.1).turn(Math.PI / 2),
         tableCover({ w: 2.0, d: 0.7, h: 1.1, front: P(2.86, { brand: 'nova', logoScale: 0.18 }), sides: M.matte('#11151c') }).at(0.6, 0.08, 0.6),
         bannerStand({ kind: 'rollup', w: 0.6, h: 1.6, graphic: P(0.38, { logo: false, draw: bannerArt('nova', 'DEMO\nTODAY', ['#35c3ff', '#1d4ed8']) }) }).at(2.2, 0.08, 0.2).turn(-0.4),
      ],
   }),
   'signage-displays/event-exhibition-signage/exhibition-displays': () => ({
      bg: 'warm', view: [0.5, 0.35, 1.5],
      items: [
         new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 2.6, 64, 1, true, Math.PI * 0.7, Math.PI * 0.6), new THREE.MeshStandardMaterial({ map: (() => { const t = P(2.4, { logo: false, draw: bannerArt('oak', 'OAK & FERN', ['#2f3a2c', '#5a6b4f']) }).map; t.wrapS = THREE.RepeatWrapping; t.repeat.x = -1; return t })(), side: THREE.DoubleSide, roughness: 0.8 })).at(0, 1.3, 2.0),
         tableCover({ w: 1.8, d: 0.7, h: 1.1, front: P(2.6, { brand: 'oak', bg: '#2f3a2c', ink: '#d9c39a', logoScale: 0.18 }), sides: M.matte('#2f3a2c') }).at(0, 0, 0.1),
      ],
   }),
   'signage-displays/event-exhibition-signage/event-backdrops': () => ({
      bg: 'dark', view: [0.35, 0.25, 1.3], key: 2,
      items: [panel({ w: 5.2, h: 2.8, t: 0.06, face: P(1.86, { logo: false, draw: bannerArt('north', 'ANNUAL\nGALA NIGHT', ['#1f3b57', '#0c1724']) }), frame: '#d9b56a' }).at(0, 0.05, 0), block(3, 0.02, 1.6, M.matte('#b8233a'), 0.005).at(0, 0.01, 1)],
   }),
   'signage-displays/event-exhibition-signage/photo-booth-backdrops': () => ({
      bg: 'blush', view: [0.35, 0.25, 1.3],
      items: [panel({ w: 4.6, h: 2.8, t: 0.06, face: P(1.64, { brand: 'bloom', logoScale: 0.1, logoY: 0.2, pattern: 'confetti', patternAlpha: 0.7, text: 'Sam & Jo · 2026', textFont: 'Georgia', textSize: 0.1, textY: 0.6 }), frame: '#d9b56a' }).at(0, 0.05, 0), block(0.8, 0.02, 0.8, M.matte('#c4558a'), 0.01).at(-1.2, 0.01, 1.0)],
   }),
   'signage-displays/event-exhibition-signage/sponsor-boards': () => ({
      bg: 'cool', view: [0.4, 0.25, 1.3],
      items: [
         panel({ w: 4.4, h: 2.2, t: 0.06, face: P(2, { logo: false, draw: (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = '#11151c'; c.textAlign = 'center'; c.font = `800 ${h * 0.08}px Arial`; c.fillText('THANK YOU TO OUR SPONSORS', w / 2, h * 0.16); const L = [['NOVA LABS', '#11151c', `900 ${h * 0.09}px Arial`], ['Ember', '#b5432a', `italic 700 ${h * 0.11}px Georgia`], ['NORTH/ROW', '#1f3b57', `900 ${h * 0.09}px Arial`], ['bloomfield', '#c4558a', `italic 700 ${h * 0.11}px Georgia`], ['OAK & FERN', '#2f3a2c', `900 ${h * 0.08}px Arial`], ['JUNO', '#d42f25', `900 ${h * 0.1}px Arial`]]; L.forEach(([t, col, f], i) => { c.fillStyle = col; c.font = f; c.fillText(t, w * (0.2 + (i % 3) * 0.3), h * (0.45 + Math.floor(i / 3) * 0.3), w * 0.25) }) } }), frame: '#c9cdd2' }).at(0, 0.6, 0),
         ...[-1.9, 1.9].map((x) => block(0.06, 0.65, 0.06, M.metal('#c9cdd2'), 0.01).at(x, 0.32, 0.03)),
      ],
   }),
   'signage-displays/event-exhibition-signage/event-promotional-displays': () => ({
      bg: 'warm', view: [0.5, 0.3, 1.6],
      items: [
         featherFlag({ graphic: P(0.24, { logo: false, draw: bannerArt('ember', 'OPEN', ['#b5432a', '#4a120a']) }) }).at(-1.6, 0, 0),
         bannerStand({ kind: 'rollup', graphic: P(0.42, { logo: false, draw: bannerArt('ember', 'COFFEE\nFESTIVAL', ['#b5432a', '#4a120a']) }) }).at(0, 0, -0.2),
         tableCover({ w: 2, d: 0.8, h: 1.1, front: P(2.5, { brand: 'ember', logoScale: 0.18 }), sides: M.matte('#b5432a') }).at(1.8, 0, 0.3).turn(-0.3),
      ],
   }),

   /* ───────── Digital / LED ───────── */
   'signage-displays/digital-sign-boards/digital-advertising-boards': () => ({
      bg: 'dark', view: [0.5, 0.25, 1.6], bloom: { strength: 0.5, radius: 0.5, threshold: 0.85 },
      items: [screen({ w: 1.3, h: 2.3, tex: screenContent(0.57, { brand: 'kaya', headline: 'GLOW', sub: 'new serum · in store', colors: ['#e7b8a8', '#9a5b4c'] }), stand: 'totem' }).at(0, 0.3, 0).turn(0.25)],
   }),
   'signage-displays/digital-sign-boards/retail-digital-displays': () => ({
      bg: 'warm', view: [0.5, 0.35, 1.6],
      items: [
         screen({ w: 1.2, h: 2.1, tex: screenContent(0.57, { brand: 'north', headline: 'NEW', sub: 'autumn collection', colors: ['#1f3b57', '#f2c14e'] }), stand: 'totem' }).at(-0.9, 0.3, 0).turn(0.2),
         screen({ w: 1.2, h: 2.1, tex: screenContent(0.57, { brand: 'north', headline: '-30%', sub: 'this weekend only', colors: ['#d42f25', '#1f3b57'] }), stand: 'totem' }).at(0.9, 0.3, -0.3).turn(-0.2),
      ],
   }),
   'signage-displays/digital-sign-boards/video-display-boards': () => ({
      wall: wallMaterial('plaster', '#2b2a2c'), bg: 'dark', view: wallFront, bloom: { strength: 0.45, radius: 0.5, threshold: 0.85 },
      items: [screen({ w: 3.6, h: 2.0, tex: screenContent(1.8, { brand: 'nova', headline: 'NOVA LABS', sub: 'technology that moves', colors: ['#1d4ed8', '#9333ea'] }) }).at(0, 0.6, 0)],
   }),
   'signage-displays/digital-sign-boards/scrolling-led-displays': () => ({
      wall: wallMaterial('concrete', '#3a3633'), bg: 'night', view: wallFront, bloom: { strength: 0.6, radius: 0.35, threshold: 0.85 },
      items: [screen({ w: 4.4, h: 0.7, glow: 1.3, tex: (() => {
         // dot-matrix ticker: render text small, then redraw each lit pixel as an amber LED dot
         const cols = 252, rows = 40
         const src = document.createElement('canvas')
         src.width = cols; src.height = rows
         const sc = src.getContext('2d')
         sc.fillStyle = '#000'; sc.fillRect(0, 0, cols, rows)
         sc.fillStyle = '#fff'; sc.font = '900 26px Arial'; sc.textBaseline = 'middle'
         sc.fillText('OPEN NOW · FRESH COFFEE · ', 4, rows / 2 + 1)
         const px = sc.getImageData(0, 0, cols, rows).data
         return canvasTexture(cols * 8, rows * 8, (c, w, h) => {
            c.fillStyle = '#050505'; c.fillRect(0, 0, w, h)
            for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
               const on = px[(y * cols + x) * 4] > 110
               c.fillStyle = on ? '#ffb02e' : '#1a1206'
               c.beginPath(); c.arc(x * 8 + 4, y * 8 + 4, on ? 3.4 : 2.6, 0, 7); c.fill()
            }
         })
      })() }).at(0, 1.2, 0)],
   }),
   'signage-displays/digital-sign-boards/digital-billboard-displays': () => ({
      bg: 'night', view: [0.35, 0.2, 1.4], bloom: { strength: 0.5, radius: 0.5, threshold: 0.85 },
      items: [
         screen({ w: 4.8, h: 2.4, tex: screenContent(2, { brand: 'bella', headline: 'PASTA BELLA', sub: 'open late · 2 km ahead', colors: ['#c8362b', '#5a120c'] }) }).at(0, 2.6, 0),
         block(0.35, 2.6, 0.35, M.metal('#3a3a3a', 0.5), 0.02).at(0, 1.3, -0.1),
      ],
   }),
   'signage-displays/led-displays/indoor-led-walls': () => ({
      wall: wallMaterial('plaster', '#2b2a2c'), bg: 'dark', view: wallFront, bloom: { strength: 0.45, radius: 0.5, threshold: 0.85 },
      items: [screen({ w: 4.8, h: 2.7, tex: screenContent(1.78, { brand: 'nova', headline: 'WELCOME', sub: 'Nova Labs HQ', colors: ['#0ea5e9', '#1d4ed8'], pixel: true }) }).at(0, 0.3, 0)],
   }),
   'signage-displays/led-displays/outdoor-led-walls': () => ({
      bg: 'night', view: [0.4, 0.2, 1.4], bloom: { strength: 0.5, radius: 0.5, threshold: 0.85 },
      items: [screen({ w: 5.2, h: 2.9, tex: screenContent(1.79, { brand: 'north', headline: 'NORTH/ROW', sub: 'flagship store · now open', colors: ['#1f3b57', '#f2c14e'], pixel: true }) }).at(0, 1.2, 0), block(0.4, 1.2, 0.4, M.metal('#3a3a3a', 0.5), 0.02).at(-1.6, 0.6, -0.1), block(0.4, 1.2, 0.4, M.metal('#3a3a3a', 0.5), 0.02).at(1.6, 0.6, -0.1)],
   }),
   'signage-displays/led-displays/stage-led-screens': () => ({
      bg: 'night', view: [0.3, 0.25, 1.3], bloom: { strength: 0.6, radius: 0.6, threshold: 0.8 },
      items: [
         screen({ w: 5.6, h: 3.0, tex: screenContent(1.87, { brand: 'nova', headline: 'SUMMIT 2026', sub: 'keynote · 9:00', colors: ['#9333ea', '#1d4ed8'], pixel: true }) }).at(0, 1.0, -0.6),
         block(7, 0.6, 3, M.matte('#141416'), 0.02).at(0, 0.3, 0.4),
      ],
   }),
   'signage-displays/led-displays/event-led-screens': () => ({
      bg: 'night', view: [0.45, 0.25, 1.4], bloom: { strength: 0.6, radius: 0.6, threshold: 0.8 },
      items: [
         screen({ w: 2.0, h: 3.4, tex: screenContent(0.59, { brand: 'bloom', headline: 'GALA', sub: 'tonight', colors: ['#c4558a', '#3c2a4d'], pixel: true }) }).at(-1.4, 0.2, 0).turn(0.25),
         screen({ w: 2.0, h: 3.4, tex: screenContent(0.59, { brand: 'bloom', headline: '2026', sub: 'annual gala', colors: ['#3c2a4d', '#c4558a'], pixel: true }) }).at(1.4, 0.2, 0).turn(-0.25),
      ],
   }),

   /* ───────── Marketing banners ───────── */
   'marketing/banners/vinyl-banners': () => ({
      wall: wallMaterial('concrete', '#c7c2bb'), bg: 'cool', view: wallFront,
      items: [panel({ w: 4.8, h: 1.4, t: 0.01, face: P(3.43, { logo: false, draw: (c, w, h) => { bannerArt('bella', '', ['#c8362b', '#8e1f17'])(c, w, h); c.fillStyle = '#fff'; c.textAlign = 'left'; c.font = `900 ${h * 0.34}px Arial`; c.fillText('GRAND OPENING', w * 0.06, h * 0.55, w * 0.86); c.font = `400 ${h * 0.12}px Arial`; c.fillText('Saturday · free tasting all day', w * 0.06, h * 0.78); for (const [x, y] of [[0.02, 0.06], [0.98, 0.06], [0.02, 0.94], [0.98, 0.94]]) { c.fillStyle = '#ddd'; c.beginPath(); c.arc(w * x, h * y, h * 0.025, 0, 7); c.fill() } } }) }).at(0, 0.6, 0)],
   }),
   'marketing/banners/mesh-banners': () => ({
      bg: 'cool', view: [0.45, 0.25, 1.4],
      items: (() => {
         const g = new THREE.Group()
         const post = M.metal('#8a8f96', 0.4)
         for (const x of [-2.6, 0, 2.6]) g.add(block(0.08, 2.4, 0.08, post, 0.01).at(x, 1.2, 0))
         const meshTex = P(3.4, { logo: false, draw: (c, w, h) => { bannerArt('north', '', ['#1f3b57', '#0c1724'])(c, w, h); c.fillStyle = '#fff'; c.textAlign = 'center'; c.font = `900 ${h * 0.28}px Arial`; c.fillText('NORTH/ROW · CITY RUN', w / 2, h * 0.56, w * 0.86); c.fillStyle = 'rgba(0,0,0,0.25)'; for (let x = 0; x < w; x += 6) c.fillRect(x, 0, 2, h); for (let y = 0; y < h; y += 6) c.fillRect(0, y, w, 2) } })
         meshTex.transparent = true
         meshTex.opacity = 0.95
         g.add(block(5.2, 1.5, 0.01, { front: meshTex, back: meshTex, all: M.matte('#1f3b57') }, 0.002).at(0, 1.3, 0.05))
         return [g]
      })(),
   }),
   'marketing/banners/fabric-banners': () => ({
      wall: wallMaterial('plaster', '#ece7df'), bg: 'warm', view: wallFront,
      items: [
         block(2.2, 0.05, 0.05, M.wood(), 0.02).at(0, 3.05, 0.06),
         panel({ w: 2.0, h: 3.0, t: 0.01, face: P(0.67, { brand: 'oak', bg: '#eee6d6', ink: '#2f3a2c', logoScale: 0.2, logoY: 0.35, pattern: 'botanical', patternAlpha: 0.2, text: 'MARKET DAY', textY: 0.75, textSize: 0.12 }, { rough: 1 }) }).at(0, 0.05, 0.03),
      ],
   }),
   'marketing/banners/feather-flags': () => ({
      bg: 'cool', view: [0.45, 0.25, 1.5],
      items: [
         featherFlag({ graphic: P(0.24, { logo: false, draw: bannerArt('north', 'SALE', ['#d42f25', '#1f3b57']) }) }).at(-1.2, 0, 0),
         featherFlag({ h: 4.0, graphic: P(0.27, { logo: false, draw: bannerArt('north', 'NEW', ['#1f3b57', '#0c1724']) }) }).at(0.4, 0, -0.4),
         featherFlag({ h: 3.4, graphic: P(0.3, { logo: false, draw: bannerArt('north', 'OPEN', ['#f2c14e', '#d42f25']) }) }).at(1.8, 0, 0.2),
      ],
   }),
   'marketing/banners/printed-table-covers': () => ({
      bg: 'warm', view: [0.6, 0.45, 1.6],
      items: [tableCover({ w: 3.2, d: 1.4, h: 1.5, front: P(2.13, { brand: 'ember', logoScale: 0.18 }), top: M.matte('#b5432a'), sides: M.matte('#b5432a') })],
   }),
}
