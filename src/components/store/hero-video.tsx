'use client'

import { cn } from '@/lib/utils'
import { Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

/**
 * Full-bleed real-footage loop behind the home hero (place it first inside a `relative` section).
 *
 *  - The poster (first frame of clip 1) is a plain <picture>, so it is the LCP image and it is
 *    all that reduced-motion visitors, data-saver users and slow (2g/3g) connections ever get.
 *  - Only clip 1 loads at first. Each next clip starts loading ~2.5 s before it is needed, and two
 *    stacked <video> elements crossfade (600 ms) between clips. Never all clips at once.
 *  - Phones get the 960×540 encodes; desktops get VP9 WebM where supported, else H.264 MP4.
 *  - Pauses when the hero leaves the screen or the tab is hidden; a button pauses it for good.
 *  - Each clip is fetched whole and played from memory: Cloudflare's static files don't answer
 *    byte-range requests and Safari won't play a plain src without them (see DEPLOY.md).
 *
 * Clips live in public/videos/hero (sources and licences: media-source/CREDITS.md).
 */

const DIR = '/videos/hero'
const CLIPS = ['01-press', '02-stamp', '03-cut', '04-assemble', '05-pack', '06-neon']
const FADE_MS = 600
/** Start loading the next clip this many seconds before the current one ends */
const PRELOAD_LEAD = 2.5

type Variant = 'webm' | 'mp4' | 'sm'

function pickVariant(): Variant | null {
   const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
   const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
   const slow = conn?.saveData || ['slow-2g', '2g', '3g'].includes(conn?.effectiveType ?? '')
   if (reduced || slow) return null
   if (window.matchMedia('(max-width: 768px)').matches) return 'sm'
   const probe = document.createElement('video')
   return probe.canPlayType('video/webm; codecs="vp9"') ? 'webm' : 'mp4'
}

const srcFor = (i: number, v: Variant) => `${DIR}/hero-${CLIPS[i]}${v === 'sm' ? '-sm.mp4' : v === 'webm' ? '.webm' : '.mp4'}`
const pad = (n: number) => String(n).padStart(2, '0')

/** Fetches a clip once and hands back an object URL (cached for the life of the component). */
function clipLoader(variant: Variant) {
   const cache = new Map<number, Promise<string>>()
   const urls: string[] = []
   return {
      get(i: number) {
         let p = cache.get(i)
         if (!p) {
            p = fetch(srcFor(i, variant))
               .then((r) => {
                  if (!r.ok) throw new Error(`clip ${i}: ${r.status}`)
                  return r.blob()
               })
               .then((b) => {
                  const url = URL.createObjectURL(b)
                  urls.push(url)
                  return url
               })
            p.catch(() => cache.delete(i))
            cache.set(i, p)
         }
         return p
      },
      dispose: () => urls.forEach((u) => URL.revokeObjectURL(u)),
   }
}

export function HeroVideo({ className }: { className?: string }) {
   const rootRef = useRef<HTMLDivElement>(null)
   const videos = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)]
   const barRef = useRef<HTMLSpanElement>(null)

   const [enabled, setEnabled] = useState(false)
   const [index, setIndex] = useState(0)
   const [front, setFront] = useState<0 | 1 | null>(null) // which layer is visible; null = poster only
   const [paused, setPaused] = useState(false)

   const state = useRef({ variant: 'mp4' as Variant, index: 0, layer: 0 as 0 | 1, preloaded: -1, switching: false, userPaused: false, inView: true, tabVisible: true })

   useEffect(() => {
      const variant = pickVariant()
      if (!variant) return
      const s = state.current
      s.variant = variant
      setEnabled(true)

      const [a] = videos.map((r) => r.current!)
      const clips = clipLoader(variant)
      let alive = true
      clips
         .get(0)
         .then((url) => {
            if (!alive) return
            a.src = url
            playActive()
         })
         .catch(() => undefined) // offline or blocked: the poster stays

      let raf = 0
      const shouldPlay = () => !s.userPaused && s.inView && s.tabVisible

      const playActive = () => {
         const v = videos[s.layer].current!
         if (shouldPlay()) v.play().catch(() => undefined)
         else v.pause()
      }

      const advance = () => {
         if (s.switching) return
         s.switching = true
         const nextIndex = (s.index + 1) % CLIPS.length
         const nextLayer = (s.layer === 0 ? 1 : 0) as 0 | 1
         const incoming = videos[nextLayer].current!
         const outgoing = videos[s.layer].current!
         const start = () => {
            incoming.play().catch(() => undefined)
            s.index = nextIndex
            s.layer = nextLayer
            s.preloaded = -1
            setIndex(nextIndex)
            setFront(nextLayer)
            window.setTimeout(() => {
               outgoing.pause()
               s.switching = false
            }, FADE_MS)
         }
         clips
            .get(nextIndex)
            .then((url) => {
               if (!alive) return
               if (incoming.src !== url) incoming.src = url
               incoming.currentTime = 0
               if (incoming.readyState >= 3) start()
               else incoming.addEventListener('canplay', start, { once: true })
            })
            .catch(() => {
               s.switching = false // try again on the next tick
            })
      }

      // Progress line + preload/advance timing, driven by the active clip's clock
      const tick = () => {
         const v = videos[s.layer].current!
         if (v.duration > 0) {
            const t = v.currentTime
            const end = v.duration - FADE_MS / 1000
            if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(1, t / end)})`
            const nextIndex = (s.index + 1) % CLIPS.length
            if (t > end - PRELOAD_LEAD && s.preloaded !== nextIndex && !s.switching) {
               const other = videos[s.layer === 0 ? 1 : 0].current!
               s.preloaded = nextIndex
               clips
                  .get(nextIndex)
                  .then((url) => {
                     if (alive && s.preloaded === nextIndex) other.src = url
                  })
                  .catch(() => {
                     s.preloaded = -1
                  })
            }
            if (t >= end && !s.switching && !v.paused) advance()
         }
         raf = requestAnimationFrame(tick)
      }

      const onFirstPlay = () => setFront(0)
      a.addEventListener('playing', onFirstPlay, { once: true })
      // Safety net: if a clip ends without the crossfade having started (e.g. a slow tab), move on
      const onEnded = (e: Event) => {
         // Only the clip on screen can move the loop on (the outgoing one may end mid-crossfade)
         if (e.target === videos[s.layer].current) advance()
      }
      videos.forEach((r) => r.current!.addEventListener('ended', onEnded))

      const io = new IntersectionObserver(([entry]) => {
         s.inView = entry.isIntersecting
         playActive()
      })
      io.observe(rootRef.current!)
      const onVisibility = () => {
         s.tabVisible = document.visibilityState === 'visible'
         playActive()
      }
      document.addEventListener('visibilitychange', onVisibility)

      raf = requestAnimationFrame(tick)

      return () => {
         alive = false
         cancelAnimationFrame(raf)
         io.disconnect()
         document.removeEventListener('visibilitychange', onVisibility)
         videos.forEach((r) => {
            const v = r.current
            if (!v) return
            v.removeEventListener('ended', onEnded)
            v.pause()
            v.removeAttribute('src')
            v.load()
         })
         clips.dispose()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   const toggle = () => {
      const s = state.current
      s.userPaused = !s.userPaused
      setPaused(s.userPaused)
      const v = videos[s.layer].current
      if (!v) return
      if (s.userPaused) v.pause()
      else v.play().catch(() => undefined)
   }

   return (
      <>
         <div ref={rootRef} aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden bg-[#141210]', className)}>
            <picture>
               <source media="(max-width: 768px)" srcSet={`${DIR}/poster-sm.avif`} type="image/avif" />
               <source media="(max-width: 768px)" srcSet={`${DIR}/poster-sm.webp`} type="image/webp" />
               <source media="(max-width: 768px)" srcSet={`${DIR}/poster-sm.jpg`} />
               <source srcSet={`${DIR}/poster.avif`} type="image/avif" />
               <source srcSet={`${DIR}/poster.webp`} type="image/webp" />
               {/* eslint-disable-next-line @next/next/no-img-element -- static poster with art-directed sources; it is the LCP image */}
               <img src={`${DIR}/poster.jpg`} alt="" width={1920} height={1080} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            </picture>
            {[0, 1].map((layer) => (
               <video
                  key={layer}
                  ref={videos[layer]}
                  muted
                  playsInline
                  disablePictureInPicture
                  disableRemotePlayback
                  preload="auto"
                  className={cn(
                     'absolute inset-0 h-full w-full object-cover transition-opacity ease-out',
                     front === layer ? 'opacity-100' : 'opacity-0'
                  )}
                  style={{ transitionDuration: `${FADE_MS}ms` }}
               />
            ))}
         </div>

         {/* Clip counter + progress line, bottom-left (Post Oak style), with the pause button beside it.
             Bottom-left keeps it clear of the floating WhatsApp / back-to-top stack on the right. */}
         <div className="absolute bottom-4 left-0 right-0 z-10 sm:bottom-6">
            <div className="page-shell flex items-center gap-3 text-[11px] font-semibold tabular-nums tracking-[0.18em] text-white/80">
               <span aria-hidden className="flex items-center gap-3">
                  <span>{pad(index + 1)}</span>
                  <span className="relative h-px w-16 overflow-hidden bg-white/25 sm:w-24">
                     <span
                        ref={barRef}
                        className="absolute inset-0 origin-left bg-primary"
                        style={{ transform: enabled ? 'scaleX(0)' : 'scaleX(1)' }}
                     />
                  </span>
                  <span className="text-white/50">{pad(CLIPS.length)}</span>
               </span>
               {enabled ? (
                  <button
                     type="button"
                     onClick={toggle}
                     aria-label={paused ? 'Play background video' : 'Pause background video'}
                     className="ml-1 grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/20"
                  >
                     {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                  </button>
               ) : null}
            </div>
         </div>
      </>
   )
}
