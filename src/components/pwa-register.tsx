'use client'

import { useEffect } from 'react'

/**
 * Registers /sw.js (public/sw.js) so phones can install the site as an app and get a branded
 * offline page. Production only: in `next dev` a service worker would get in the way of hot reload.
 */
export function PwaRegister() {
   useEffect(() => {
      if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return
      const register = () => navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => undefined)
      if (document.readyState === 'complete') register()
      else {
         window.addEventListener('load', register, { once: true })
         return () => window.removeEventListener('load', register)
      }
   }, [])
   return null
}
