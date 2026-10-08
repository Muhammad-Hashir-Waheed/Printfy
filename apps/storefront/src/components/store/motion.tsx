'use client'

import { cn } from '@/lib/utils'
import {
   Children,
   useCallback,
   useEffect,
   useRef,
   useState,
   type CSSProperties,
   type ElementType,
   type ReactNode,
} from 'react'

function prefersReducedMotion() {
   return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Calls back once when the element scrolls into view. */
function useInView<T extends Element>(threshold = 0.15) {
   const ref = useRef<T>(null)
   const [inView, setInView] = useState(false)
   useEffect(() => {
      const node = ref.current
      if (!node) return
      if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
         setInView(true)
         return
      }
      const io = new IntersectionObserver(
         ([entry]) => {
            if (entry.isIntersecting) {
               setInView(true)
               io.disconnect()
            }
         },
         { threshold, rootMargin: '0px 0px -8% 0px' }
      )
      io.observe(node)
      return () => io.disconnect()
   }, [threshold])
   return { ref, inView }
}

/** Fades + lifts content in as it enters the viewport. Children can stagger. */
export function Reveal({
   children,
   className,
   delay = 0,
   stagger,
   as: Tag = 'div',
   y = 24,
}: {
   children: ReactNode
   className?: string
   delay?: number
   /** Animate each direct child in sequence (ms between items) */
   stagger?: number
   as?: ElementType
   y?: number
}) {
   const { ref, inView } = useInView<HTMLDivElement>()

   const style = (i: number): CSSProperties => ({
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : `translate3d(0, ${y}px, 0)`,
      transition: `opacity .8s cubic-bezier(.2,.7,.2,1) ${delay + i * (stagger ?? 0)}ms, transform .9s cubic-bezier(.2,.7,.2,1) ${delay + i * (stagger ?? 0)}ms`,
   })

   if (stagger) {
      return (
         <Tag ref={ref} className={className}>
            {Children.map(children, (child, i) => (
               <div style={style(i)} className="h-full">
                  {child}
               </div>
            ))}
         </Tag>
      )
   }

   return (
      <Tag ref={ref} className={className} style={style(0)}>
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

/** Counts up from 0 when it scrolls into view. */
export function CountUp({ to, suffix = '', duration = 1600 }: { to: number; suffix?: string; duration?: number }) {
   const { ref, inView } = useInView<HTMLSpanElement>(0.5)
   const [value, setValue] = useState(0)

   useEffect(() => {
      if (!inView) return
      if (prefersReducedMotion()) {
         setValue(to)
         return
      }
      let raf = 0
      const start = performance.now()
      const tick = (now: number) => {
         const t = Math.min(1, (now - start) / duration)
         const eased = 1 - Math.pow(1 - t, 4)
         setValue(Math.round(to * eased))
         if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(raf)
   }, [inView, to, duration])

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
               className="flex shrink-0 items-center group-hover/marquee:[animation-play-state:paused]"
               style={{ animation: `marquee-x ${speed}s linear infinite${reverse ? ' reverse' : ''}` }}
            >
               {children}
            </div>
         ))}
      </div>
   )
}
