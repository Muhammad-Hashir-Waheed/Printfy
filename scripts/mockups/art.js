// Procedural print artwork for studio mockups — every surface is drawn on a canvas,
// so renders never contain real-world brands. Fictional sample brands only.
import * as THREE from 'three'

export const BRANDS = {
   oak: { name: 'OAK & FERN', mono: 'O&F', tag: 'goods for slow living', ink: '#2f3a2c', paper: '#c49a6c', accent: '#2f3a2c' },
   maison: { name: 'MAISON VALE', mono: 'MV', tag: 'paris', ink: '#d9b56a', paper: '#16130f', accent: '#d9b56a' },
   kaya: { name: 'kaya', mono: 'k', tag: 'skin studio', ink: '#ffffff', paper: '#e7b8a8', accent: '#9a5b4c' },
   north: { name: 'NORTH/ROW', mono: 'N', tag: 'apparel co.', ink: '#ffffff', paper: '#1f3b57', accent: '#f2c14e' },
   ember: { name: 'Ember', mono: 'E', tag: 'coffee roasters', ink: '#fff6ea', paper: '#b5432a', accent: '#fff6ea' },
   bloom: { name: 'bloomfield', mono: 'b', tag: 'flowers & gifts', ink: '#3c2a4d', paper: '#f3e6ef', accent: '#c4558a' },
   nova: { name: 'NOVA LABS', mono: 'N', tag: 'technology', ink: '#ffffff', paper: '#11151c', accent: '#35c3ff' },
   bella: { name: 'Pasta Bella', mono: 'PB', tag: 'cucina italiana', ink: '#ffffff', paper: '#c8362b', accent: '#f6e7c8' },
   juno: { name: 'JUNO', mono: 'J', tag: 'studio', ink: '#1b1b1b', paper: '#f4f1ea', accent: '#d42f25' },
}

const texCache = new Map()

export function canvasTexture(w, h, draw, { srgb = true, repeat = null } = {}) {
   const c = document.createElement('canvas')
   c.width = w
   c.height = h
   const ctx = c.getContext('2d')
   draw(ctx, w, h)
   const t = new THREE.CanvasTexture(c)
   if (srgb) t.colorSpace = THREE.SRGBColorSpace
   t.anisotropy = 8
   if (repeat) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping
      t.repeat.set(repeat[0], repeat[1])
   }
   return t
}

// deterministic random so renders are reproducible
export function rng(seed = 1) {
   let s = seed >>> 0 || 1
   return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
}

/* ───────── Surfaces ───────── */

export function kraftTexture(base = '#c29a6b', seed = 3) {
   const key = `kraft${base}${seed}`
   if (texCache.has(key)) return texCache.get(key)
   const t = canvasTexture(1024, 1024, (ctx, w, h) => {
      ctx.fillStyle = base
      ctx.fillRect(0, 0, w, h)
      const r = rng(seed)
      for (let i = 0; i < 26000; i++) {
         const x = r() * w, y = r() * h, l = r() * 0.5
         ctx.fillStyle = r() > 0.5 ? `rgba(255,240,215,${0.05 + l * 0.12})` : `rgba(70,40,15,${0.04 + l * 0.1})`
         ctx.fillRect(x, y, 1 + r() * 2, 1)
      }
      for (let i = 0; i < 900; i++) {
         const x = r() * w, y = r() * h, a = r() * Math.PI, len = 6 + r() * 22
         ctx.strokeStyle = r() > 0.6 ? 'rgba(255,235,205,0.18)' : 'rgba(80,48,20,0.16)'
         ctx.lineWidth = 0.6 + r()
         ctx.beginPath()
         ctx.moveTo(x, y)
         ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len)
         ctx.stroke()
      }
   }, { repeat: [1, 1] })
   texCache.set(key, t)
   return t
}

export function paperGrain(base = '#f4f1ea', seed = 5, strength = 0.05) {
   return canvasTexture(512, 512, (ctx, w, h) => {
      ctx.fillStyle = base
      ctx.fillRect(0, 0, w, h)
      const r = rng(seed)
      for (let i = 0; i < 9000; i++) {
         ctx.fillStyle = r() > 0.5 ? `rgba(255,255,255,${strength * r()})` : `rgba(0,0,0,${strength * r() * 0.8})`
         ctx.fillRect(r() * w, r() * h, 1.5, 1.5)
      }
   })
}

/* ───────── Brand marks ───────── */

function font(px, family = 'Georgia', weight = '700', style = '') {
   return `${style} ${weight} ${Math.round(px)}px ${family}`.trim()
}

/** Wordmark + optional emblem, centred at (cx, cy), fitting `size` (height of wordmark). */
export function drawLogo(ctx, brand, cx, cy, size, { emblem = true, tag = true, color, align = 'center', maxWidth = Infinity } = {}) {
   const ink = color || brand.ink
   // shrink until the wordmark fits the face
   {
      const serif0 = /[a-z]/.test(brand.name) && !/[A-Z]{3}/.test(brand.name)
      ctx.save()
      ctx.font = serif0 ? font(size, 'Georgia', '700', 'italic') : font(size * 0.82, 'Arial', '900')
      if (!serif0) ctx.letterSpacing = `${size * 0.12}px`
      const tw = ctx.measureText(brand.name).width
      ctx.restore()
      if (tw > maxWidth) size *= maxWidth / tw
   }
   ctx.save()
   ctx.fillStyle = ink
   ctx.strokeStyle = ink
   ctx.textAlign = align
   ctx.textBaseline = 'middle'
   let y = cy
   if (emblem) {
      const r = size * 0.95
      const ey = cy - size * 1.35
      ctx.lineWidth = Math.max(2, size * 0.06)
      ctx.beginPath()
      ctx.arc(cx, ey, r, 0, Math.PI * 2)
      ctx.stroke()
      ctx.font = font(r * 0.9, 'Georgia', '700', 'italic')
      ctx.fillText(brand.mono, cx, ey + r * 0.04)
      y = cy + size * 0.35
   }
   const serif = /[a-z]/.test(brand.name) && !/[A-Z]{3}/.test(brand.name)
   ctx.font = serif ? font(size, 'Georgia', '700', 'italic') : font(size * 0.82, 'Arial', '900')
   if (!serif) ctx.letterSpacing = `${size * 0.12}px`
   ctx.fillText(brand.name, cx, y)
   if (tag && brand.tag) {
      ctx.letterSpacing = `${size * 0.14}px`
      ctx.font = font(size * 0.26, 'Arial', '700')
      ctx.globalAlpha = 0.8
      ctx.fillText(brand.tag.toUpperCase(), cx, y + size * 0.78)
   }
   ctx.restore()
}

/* ───────── Patterns ───────── */

export function drawPattern(ctx, w, h, kind, ink, seed = 7, mono = '◆') {
   const r = rng(seed)
   ctx.save()
   ctx.fillStyle = ink
   ctx.strokeStyle = ink
   if (kind === 'dots') {
      const s = Math.min(w, h) / 14
      for (let y = s / 2; y < h; y += s) for (let x = (Math.round(y / s) % 2) * s / 2; x < w; x += s) {
         ctx.beginPath(); ctx.arc(x, y, s * 0.12, 0, Math.PI * 2); ctx.fill()
      }
   } else if (kind === 'stripes') {
      const s = Math.min(w, h) / 10
      ctx.globalAlpha = 0.9
      for (let x = -h; x < w; x += s * 2) {
         ctx.beginPath(); ctx.moveTo(x, h); ctx.lineTo(x + h, 0); ctx.lineTo(x + h + s, 0); ctx.lineTo(x + s, h); ctx.fill()
      }
   } else if (kind === 'botanical') {
      ctx.lineWidth = Math.min(w, h) / 220
      for (let i = 0; i < 38; i++) {
         const x = r() * w, y = r() * h, len = (0.06 + r() * 0.08) * Math.min(w, h), a = r() * Math.PI * 2
         ctx.save(); ctx.translate(x, y); ctx.rotate(a)
         ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(len * 0.5, -len * 0.45, len, 0); ctx.quadraticCurveTo(len * 0.5, len * 0.45, 0, 0)
         ctx.globalAlpha = 0.55; ctx.fill(); ctx.globalAlpha = 1
         ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(len, 0); ctx.stroke()
         ctx.restore()
      }
   } else if (kind === 'confetti') {
      const cols = [ink, '#f2c14e', '#d42f25', '#35a7c4', '#7a4cff']
      for (let i = 0; i < 160; i++) {
         ctx.fillStyle = cols[i % cols.length]
         ctx.save(); ctx.translate(r() * w, r() * h); ctx.rotate(r() * 3)
         const s = (0.008 + r() * 0.012) * Math.min(w, h)
         r() > 0.5 ? ctx.fillRect(-s, -s / 3, s * 2, s * 0.66) : (ctx.beginPath(), ctx.arc(0, 0, s * 0.6, 0, 7), ctx.fill())
         ctx.restore()
      }
   } else if (kind === 'waves') {
      ctx.lineWidth = Math.min(w, h) / 90
      ctx.globalAlpha = 0.85
      for (let y = 0; y < h + 40; y += Math.min(w, h) / 9) {
         ctx.beginPath()
         for (let x = 0; x <= w; x += 8) ctx.lineTo(x, y + Math.sin(x / (w / 6)) * (h / 40))
         ctx.stroke()
      }
   } else if (kind === 'grid') {
      ctx.lineWidth = 1.5
      ctx.globalAlpha = 0.35
      const s = Math.min(w, h) / 16
      for (let x = 0; x < w; x += s) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
      for (let y = 0; y < h; y += s) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }
   } else if (kind === 'monogram') {
      const s = Math.min(w, h) / 6
      ctx.globalAlpha = 0.18
      ctx.font = font(s * 0.55, 'Georgia', '700', 'italic')
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      for (let y = s / 2, row = 0; y < h + s; y += s * 0.8, row++) for (let x = (row % 2) * s / 2; x < w + s; x += s) ctx.fillText(mono, x, y)
   }
   ctx.restore()
}

/**
 * A printed face. opts: { brand, bg, pattern, patternInk, logo: true|false, logoScale, kraft, foil, text, align }
 * aspect = width / height of the face, so artwork is never stretched.
 */
export function printFace(aspect, opts = {}) {
   const brand = typeof opts.brand === 'string' ? BRANDS[opts.brand] : opts.brand || BRANDS.juno
   const W = 1024
   const H = Math.max(64, Math.round(W / Math.max(0.08, aspect)))
   const cw = H > 2048 ? Math.round(W * 2048 / H) : W
   const ch = Math.min(H, 2048)
   const tex = canvasTexture(cw, ch, (ctx, w, h) => {
      if (opts.kraft) {
         const k = kraftTexture(opts.kraft === true ? '#8f6840' : opts.kraft).image
         ctx.drawImage(k, 0, 0, w, h)
      } else {
         ctx.fillStyle = opts.bg || brand.paper
         ctx.fillRect(0, 0, w, h)
      }
      if (opts.gradient) {
         const g = ctx.createLinearGradient(0, 0, w, h)
         g.addColorStop(0, opts.gradient[0]); g.addColorStop(1, opts.gradient[1])
         ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)
      }
      if (opts.pattern) {
         ctx.globalAlpha = opts.patternAlpha ?? 0.22
         drawPattern(ctx, w, h, opts.pattern, opts.patternInk || brand.accent, opts.seed || 7, brand.mono)
         ctx.globalAlpha = 1
      }
      if (opts.band) {
         ctx.fillStyle = opts.band
         ctx.fillRect(0, h * 0.82, w, h * 0.18)
      }
      if (opts.draw) opts.draw(ctx, w, h, brand)
      if (opts.logo !== false) {
         const s = Math.min(w, h) * (opts.logoScale ?? 0.13)
         drawLogo(ctx, brand, w / 2, h * (opts.logoY ?? 0.5), s, { emblem: opts.emblem ?? Math.min(w, h) > 300, tag: opts.tag ?? true, color: opts.ink, maxWidth: w * (opts.fit ?? 0.84) })
      }
      if (opts.text) {
         ctx.fillStyle = opts.ink || brand.ink
         ctx.textAlign = 'center'
         let ts = Math.min(w, h) * (opts.textSize ?? 0.08)
         ctx.font = font(ts, opts.textFont || 'Arial', '800')
         const tw = ctx.measureText(opts.text).width
         if (tw > w * (opts.fit ?? 0.9)) { ts *= (w * (opts.fit ?? 0.9)) / tw; ctx.font = font(ts, opts.textFont || 'Arial', '800') }
         ctx.fillText(opts.text, w / 2, h * (opts.textY ?? 0.82))
      }
   })
   if (opts.rot) {
      tex.center.set(0.5, 0.5)
      tex.rotation = (opts.rot * Math.PI) / 180
   }
   return tex
}

export function radialTexture(inner = 'rgba(0,0,0,0.55)', outer = 'rgba(0,0,0,0)') {
   return canvasTexture(256, 256, (ctx, w, h) => {
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2)
      g.addColorStop(0, inner)
      g.addColorStop(1, outer)
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
   }, { srgb: false })
}

export function backdropTexture(top, bottom, vignette = 0.16) {
   return canvasTexture(1024, 768, (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, 0, h)
      g.addColorStop(0, top)
      g.addColorStop(1, bottom)
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
      const v = ctx.createRadialGradient(w / 2, h * 0.55, h * 0.2, w / 2, h * 0.55, w * 0.75)
      v.addColorStop(0, 'rgba(0,0,0,0)')
      v.addColorStop(1, `rgba(0,0,0,${vignette})`)
      ctx.fillStyle = v
      ctx.fillRect(0, 0, w, h)
   })
}
