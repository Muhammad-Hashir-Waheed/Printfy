'use client'

import { cn } from '@/lib/utils'
import { Pause, Play } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type Props = {
   /** Path without extension: `/videos/hero` → hero.mp4, hero-sm.mp4 (phones) and hero.jpg (poster) */
   src: string
   /** Above the fold: load straight away and give the poster image priority */
   eager?: boolean
   /** Where the pause button sits; it inherits the section's text colour */
   controlClassName?: string
   className?: string
}

/**
 * Muted, looping background video for a section (place it first inside a `relative` section).
 *  - Loads only when the section comes near the screen and pauses when it scrolls away.
 *  - Phones get the lighter encode; reduced-motion and data-saver visitors keep the still poster.
 *  - The clip is fetched whole and played from memory, so it works in Safari even where the host
 *    doesn't answer byte-range requests (Cloudflare static assets).
 *  - Fades back to the poster (the clip's first frame) just before each loop — no hard cut.
 */
export function BackgroundVideo({ src, eager, controlClassName, className }: Props) {
   const ref = useRef<HTMLVideoElement>(null)
   const [playing, setPlaying] = useState(false)
   const [fading, setFading] = useState(false)
   const [paused, setPaused] = useState(false)
   const [enabled, setEnabled] = useState(false)
   const pausedRef = useRef(false)

   useEffect(() => {
      const video = ref.current
      if (!video) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
      if (reduced || saveData) return
      setEnabled(true)

      let objectUrl: string | null = null
      let request: AbortController | null = null
      let near = false
      const play = () => {
         if (near && objectUrl && !pausedRef.current) video.play().catch(() => undefined)
      }

      const load = async () => {
         if (objectUrl || request) return
         request = new AbortController()
         const file = `${src}${window.matchMedia('(max-width: 767px)').matches ? '-sm' : ''}.mp4`
         try {
            const res = await fetch(file, { signal: request.signal })
            if (!res.ok) return
            objectUrl = URL.createObjectURL(await res.blob())
            video.muted = true
            video.src = objectUrl
            play()
         } catch {
            // Offline or aborted: the poster stays
         } finally {
            request = null
         }
      }

      const observer = new IntersectionObserver(
         ([entry]) => {
            near = entry.isIntersecting
            if (near) {
               load()
               play()
            } else video.pause()
         },
         { rootMargin: '200px 0px' }
      )
      observer.observe(video)
      if (eager) load()

      return () => {
         observer.disconnect()
         request?.abort()
         video.pause()
         video.removeAttribute('src')
         if (objectUrl) URL.revokeObjectURL(objectUrl)
      }
   }, [src, eager])

   const toggle = () => {
      const video = ref.current
      if (!video) return
      pausedRef.current = !pausedRef.current
      setPaused(pausedRef.current)
      if (pausedRef.current) video.pause()
      else video.play().catch(() => undefined)
   }

   return (
      <>
         <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
            <Image src={`${src}.jpg`} alt="" fill priority={eager} sizes="100vw" className="object-cover" />
            <video
               ref={ref}
               muted
               loop
               playsInline
               disablePictureInPicture
               disableRemotePlayback
               preload="none"
               onPlaying={() => setPlaying(true)}
               onTimeUpdate={(e) => {
                  const v = e.currentTarget
                  setFading(v.duration - v.currentTime < 0.7)
               }}
               className={cn(
                  'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
                  playing && !fading ? 'opacity-100' : 'opacity-0'
               )}
            />
         </div>
         {enabled ? (
            <button
               type="button"
               onClick={toggle}
               aria-label={paused ? 'Play background video' : 'Pause background video'}
               className={cn(
                  'absolute bottom-4 right-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-black/25 text-white opacity-60 backdrop-blur transition hover:opacity-100 focus-visible:opacity-100',
                  controlClassName
               )}
            >
               {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
         ) : null}
      </>
   )
}
