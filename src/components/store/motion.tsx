'use client'

import { cn } from '@/lib/utils'
import {
   Children,
   useCallback,
   useEffect,
   useLayoutEffect,
   useRef,
   useState,
   type CSSProperties,
   type ElementType,
   type ReactNode,
} from 'react'

function prefersReducedMotion() {
   return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/** Reveals start this far below the screen edge, so content is in place before it scrolls in. */
const REVEAL_MARGIN = '0px 0px 15% 0px'
const REVEAL_MS = 420
const MAX_Y = 16
const MAX_STAGGER = 60
const MAX_GROUP_DELAY = 300

type RevealState = 'shown' | 'hidden' | 'revealed'

/**
 * Progressive reveal. Content is visible in the server HTML and stays visible if JS never runs.
 * After hydration, only elements still well below the screen are hidden; each one fades back in
 * just before it scrolls into view. Elements already on (or near) the screen are never hidden,
 * and reduced-motion visitors get no reveal at all.
 */
function useReveal<T extends Element>() {
   const ref = useRef<T>(null)
   const [state, setState] = useState<RevealState>('shown')

   useIsoLayoutEffect(() => {
      const node = ref.current
      if (!node || prefersReducedMotion() || !('IntersectionObserver' in window)) return
      // Before paint, so nothing on screen ever blinks out
      if (node.getBoundingClientRect().top < window.innerHeight * 1.15) return
      setState('hidden')
      const io = new IntersectionObserver(
         ([entry]) => {
            if (entry.isIntersecting) {
               setState('revealed')
               io.disconnect()
            }
         },
         { rootMargin: REVEAL_MARGIN, threshold: 0 }
      )
      io.observe(node)
      return () => io.disconnect()
   }, [])

   return { ref, state }
}

function revealStyle(state: RevealState, y: number, delay: number): CSSProperties | undefined {
   if (state === 'shown') return undefined
   if (state === 'hidden') return { opacity: 0, transform: `translate3d(0, ${y}px, 0)` }
   const ease = 'cubic-bezier(.2,.7,.2,1)'
   return {
      opacity: 1,
      transform: 'none',
      transition: `opacity ${REVEAL_MS}ms ${ease} ${delay}ms, transform ${REVEAL_MS}ms ${ease} ${delay}ms`,
   }
}

/** Fades + lifts content in just before it enters the viewport. Children can stagger. */
export function Reveal({
   children,
   className,
   delay = 0,
   stagger,
   itemClassName,
   as: Tag = 'div',
   y = MAX_Y,
}: {
   children: ReactNode
   className?: string
   delay?: number
   /** Animate each direct child in sequence (ms between items, capped at 60) */
   stagger?: number
   /** Classes for the wrapper around each staggered child (it is the actual grid/flex item) */
   itemClassName?: string
   as?: ElementType
   /** Lift distance in px (capped at 16) */
   y?: number
}) {
   const { ref, state } = useReveal<HTMLDivElement>()
   const lift = Math.min(y, MAX_Y)
   const step = Math.min(stagger ?? 0, MAX_STAGGER)
   const delayFor = (i: number) => Math.min(delay + i * step, MAX_GROUP_DELAY)

   if (stagger) {
      return (
         <Tag ref={ref} className={className}>
            {Children.map(children, (child, i) => (
               <div style={revealStyle(state, lift, delayFor(i))} className={cn('h-full', itemClassName)}>
                  {child}
               </div>
            ))}
         </Tag>
      )
   }

   return (
      <Tag ref={ref} className={className} style={revealStyle(state, lift, delayFor(0))}>
         {children}
      </Tag>
   )
}

/** Pulls its child slightly toward the cursor. */
export function Magnetic({
   children,
   strength = 0.3,
   className,
}: {
   children: ReactNode
   strength?: number
   className?: string
}) {
   const ref = useRef<HTMLSpanElement>(null)

   const onMove = useCallback(
      (e: React.MouseEvent) => {
         const el = ref.current
         if (!el || prefersReducedMotion()) return
         const r = el.getBoundingClientRect()
         const x = (e.clientX - r.left - r.width / 2) * strength
         const y = (e.clientY - r.top - r.height / 2) * strength
         el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      },
      [strength]
   )

   const reset = () => {
      if (ref.current) ref.current.style.transform = ''
   }

   return (
      <span
         ref={ref}
         onMouseMove={onMove}
         onMouseLeave={reset}
         className={cn('inline-block transition-transform duration-300 ease-out will-change-transform', className)}
      >
         {children}
      </span>
   )
}

/**
 * Tracks the cursor inside the element and exposes it as --mx / --my CSS vars,
 * so children can draw a glow that follows the pointer.
 */
export function Spotlight({
   children,
   className,
   as: Tag = 'div',
   style,
}: {
   children: ReactNode
   className?: string
   as?: ElementType
   style?: CSSProperties
}) {
   const ref = useRef<HTMLElement>(null)
   const onMove = (e: React.MouseEvent) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
   }
   return (
      <Tag ref={ref} onMouseMove={onMove} className={cn('group/spot relative', className)} style={style}>
         {children}
      </Tag>
   )
}

/** The glow layer to place inside a <Spotlight>. */
export function SpotlightGlow({ color = 'rgba(255,90,82,.18)', size = 380 }: { color?: string; size?: number }) {
   return (
      <span
         aria-hidden
         className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
         style={{
            background: `radial-gradient(${size}px circle at var(--mx, 50%) var(--my, 50%), ${color}, transparent 65%)`,
         }}
      />
   )
}

/**
 * Shows a number that counts up when it scrolls into view. The server HTML (and no-JS / reduced
 * motion visitors) always gets the final number; the count-up is a client-only flourish.
 */
export function CountUp({ to, suffix = '', duration = 1400 }: { to: number; suffix?: string; duration?: number }) {
   const ref = useRef<HTMLSpanElement>(null)
   const [value, setValue] = useState(to)

   useIsoLayoutEffect(() => {
      const node = ref.current
      if (!node || prefersReducedMotion() || !('IntersectionObserver' in window)) return
      let raf = 0
      const run = () => {
         const start = performance.now()
         const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration)
            setValue(Math.round(to * (1 - Math.pow(1 - t, 4))))
            if (t < 1) raf = requestAnimationFrame(tick)
         }
         raf = requestAnimationFrame(tick)
      }
      setValue(0)
      const io = new IntersectionObserver(
         ([entry]) => {
            if (entry.isIntersecting) {
               io.disconnect()
               run()
            }
         },
         { threshold: 0.3 }
      )
      io.observe(node)
      return () => {
         io.disconnect()
         cancelAnimationFrame(raf)
         setValue(to)
      }
   }, [to, duration])

   return (
      <span ref={ref} className="tabular-nums">
         {value.toLocaleString('en-US')}
         {suffix}
      </span>
   )
}

/** Cycles through words with a vertical slot-machine roll. */
export function RotatingWords({
   words,
   interval = 2400,
   className,
}: {
   words: string[]
   interval?: number
   className?: string
}) {
   const [index, setIndex] = useState(0)

   useEffect(() => {
      if (prefersReducedMotion()) return
      const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval)
      return () => clearInterval(id)
   }, [words.length, interval])

   const longest = words.reduce((a, b) => (b.length > a.length ? b : a), '')

   return (
      <span className={cn('relative inline-grid overflow-hidden align-bottom', className)}>
         {/* reserves the width of the longest word */}
         <span className="invisible col-start-1 row-start-1">{longest}</span>
         {words.map((word, i) => (
            <span
               key={word}
               aria-hidden={i !== index}
               className="col-start-1 row-start-1 transition-all duration-700 [transition-timing-function:cubic-bezier(.7,0,.2,1)]"
               style={{
                  transform: `translateY(${i === index ? 0 : i < index || (index === 0 && i === words.length - 1) ? -110 : 110}%)`,
                  opacity: i === index ? 1 : 0,
               }}
            >
               {word}
            </span>
         ))}
      </span>
   )
}

/** Splits text into letters that ripple upward on hover. */
export function WaveText({
   text,
   className,
   letterClassName,
}: {
   text: string
   className?: string
   letterClassName?: string
}) {
   return (
      <span className={cn('group/wave inline-flex', className)} aria-label={text}>
         {text.split('').map((ch, i) => (
            <span
               key={i}
               aria-hidden
               className={cn(
                  'inline-block transition-[transform,color] duration-500 [transition-timing-function:cubic-bezier(.3,1.6,.5,1)] group-hover/wave:-translate-y-[0.12em]',
                  letterClassName
               )}
               style={{ transitionDelay: `${i * 28}ms` }}
            >
               {ch === ' ' ? ' ' : ch}
            </span>
         ))}
      </span>
   )
}

/** Infinite horizontal marquee. */
export function Marquee({
   children,
   className,
   speed = 40,
   reverse,
}: {
   children: ReactNode
   className?: string
   speed?: number
   reverse?: boolean
}) {
   return (
      <div className={cn('group/marquee flex overflow-hidden', className)}>
         {[0, 1].map((copy) => (
            <div
               key={copy}
               aria-hidden={copy === 1}
               className="marquee-track flex shrink-0 items-center group-hover/marquee:[animation-play-state:paused]"
               style={{ animation: `marquee-x ${speed}s linear infinite${reverse ? ' reverse' : ''}` }}
            >
               {children}
            </div>
         ))}
      </div>
   )
}
