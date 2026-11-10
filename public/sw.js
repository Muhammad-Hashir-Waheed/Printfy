/**
 * Joji Arts service worker: makes the site installable as an app on phones and shows a
 * branded "You're offline" page when there is no connection.
 *
 * Deliberately minimal: it caches ONLY the offline page and its icon. Every page, image, video and
 * API call goes to the network exactly as without a service worker, so a new deploy is never
 * hidden behind stale cached files. Bump VERSION to replace the cached offline page.
 */
const VERSION = 'v1'
const CACHE = `joji-offline-${VERSION}`
const OFFLINE_URL = '/offline.html'
const PRECACHE = [OFFLINE_URL, '/icon-192.png']

self.addEventListener('install', (event) => {
   event.waitUntil(
      caches
         .open(CACHE)
         .then((cache) => cache.addAll(PRECACHE))
         .then(() => self.skipWaiting())
   )
})

self.addEventListener('activate', (event) => {
   event.waitUntil(
      caches
         .keys()
         .then((keys) => Promise.all(keys.filter((k) => k.startsWith('joji-offline-') && k !== CACHE).map((k) => caches.delete(k))))
         .then(() => self.clients.claim())
   )
})

self.addEventListener('fetch', (event) => {
   const { request } = event
   // Only page loads are handled; everything else (images, video, API, admin uploads) is untouched
   if (request.mode !== 'navigate' || request.method !== 'GET') return
   event.respondWith(
      fetch(request).catch(async () => (await caches.match(OFFLINE_URL)) || Response.error())
   )
})
