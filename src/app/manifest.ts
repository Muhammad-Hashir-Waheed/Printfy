import config from '@/config/site'
import type { MetadataRoute } from 'next'

/**
 * Web app manifest: lets phones and laptops install the site as an app.
 * Installability on phones also needs the service worker in public/sw.js (registered by
 * src/components/pwa-register.tsx). Screenshots power Android's richer install dialog.
 */
export default function manifest(): MetadataRoute.Manifest {
   return {
      id: '/',
      name: `${config.name} — Packaging, Print & Signage`,
      short_name: config.name,
      description: config.description,
      start_url: '/',
      scope: '/',
      display: 'standalone',
      orientation: 'any',
      lang: 'en',
      dir: 'ltr',
      categories: ['shopping', 'business', 'design'],
      background_color: '#FAF7F2',
      theme_color: '#D42F25',
      icons: [
         { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
         { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
         // Full-bleed versions for Android's adaptive (round / squircle) icons
         { src: '/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
         { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
         { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      ],
      screenshots: [
         { src: '/screenshots/mobile-home.webp', sizes: '1080x1920', type: 'image/webp', form_factor: 'narrow', label: 'Joji Arts home on a phone' },
         { src: '/screenshots/desktop-home.webp', sizes: '1920x1080', type: 'image/webp', form_factor: 'wide', label: 'Joji Arts home on a laptop' },
      ],
   }
}
