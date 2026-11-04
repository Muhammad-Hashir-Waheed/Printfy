import Image from 'next/image'
import type { CSSProperties } from 'react'

/**
 * Animated 3D backdrop for the home page hero: a tilted "production line" of product photos
 * (belts running in alternating directions).
 * Pure CSS transforms (GPU only), no video or WebGL. Styles live in globals.css under "Hero scene".
 * Visitors with reduced motion get the same scene standing still.
 */

const PHOTOS = [
   'c/packaging/rigid-boxes',
   'c/printing/business-cards',
   'c/bags/paper-bags',
   'c/food-packaging/cups',
   'c/signage-displays/neon-signs',
   'c/labels-stickers/product-labels',
   'c/packaging/mailer-boxes',
   'c/custom-packaging/custom-printing',
   'c/packaging/kraft-boxes',
   'c/bags/fabric-bags',
   'c/food-packaging/food-accessories',
   'c/marketing/brochures',
   'c/retail-packaging/display-boxes',
   'c/custom-packaging/custom-bags',
   'c/labels-stickers/stickers',
   'd/acrylic-plastic-packaging',
   'c/packaging/corrugated-boxes',
   'd/bags',
   'c/signage-displays/3d-raised-letter-signs',
   'c/food-packaging/food-boxes',
   'd/corporate',
   'c/retail-packaging/inserts',
   'c/signage-displays/led-displays',
   'c/labels-stickers/shipping-labels',
].map((p) => `/catalog/${p}.jpg`)

const ROWS = 5
const PER_ROW = 8
const SPEEDS = [70, 95, 60, 85, 75] // seconds per loop, varied so the belts never line up

function Belt({ row }: { row: number }) {
   const photos = Array.from({ length: PER_ROW }, (_, i) => PHOTOS[(row * 5 + i * 3) % PHOTOS.length])
   return (
      <div className="hero-belt" style={{ animationDuration: `${SPEEDS[row]}s`, animationDirection: row % 2 ? 'reverse' : 'normal' } as CSSProperties}>
         {/* Two identical halves: the track slides by exactly one half, so the loop is seamless */}
         {[0, 1].map((half) =>
            photos.map((src, i) => (
               <div key={`${half}-${i}`} className="hero-tile">
                  <Image src={src} alt="" width={640} height={640} sizes="(max-width: 767px) 200px, 320px" loading={row < 3 ? 'eager' : 'lazy'} className="hero-photo h-full w-full object-cover" />
               </div>
            ))
         )}
      </div>
   )
}


export function HeroScene() {
   return (
      <div aria-hidden className="hero-scene pointer-events-none absolute inset-0 overflow-hidden">
         <div className="hero-plane">
            {Array.from({ length: ROWS }, (_, r) => (
               <Belt key={r} row={r} />
            ))}
         </div>
         {/* Soft light from the top so the far end of the belts fades into the page */}
         <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_0%,transparent_55%,hsl(var(--background)/0.3)_100%)]" />
      </div>
   )
}
