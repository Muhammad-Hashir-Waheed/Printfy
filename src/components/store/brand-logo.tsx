import { cn } from '@/lib/utils'

import { LOCKUP, MARK_PATH, WORDMARK_ARTS, WORDMARK_JOJI } from './brand-paths'

const RED = '#D42F25'
/** A touch brighter so the mark holds its colour on near-black */
const RED_ON_DARK = '#F0453A'

/**
 * Joji Arts app-icon mark: the JA monogram in white on the red tile.
 * Used where a square badge is needed (admin, compact spots). Legible down to 16px.
 */
export function BrandMark({ className }: { className?: string }) {
   return (
      <svg
         viewBox="-14 -12 128 128"
         aria-hidden
         className={cn(
            'h-9 w-9 transition-transform duration-500 [transition-timing-function:cubic-bezier(.3,1.6,.5,1)] group-hover:-rotate-6 group-hover:scale-105',
            className
         )}
      >
         <rect x="-14" y="-12" width="128" height="128" rx="28" fill={RED} />
         <path d={MARK_PATH} fill="none" stroke="#fff" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
   )
}

/**
 * Primary lockup: the JA monogram (one roof over J and A) beside the "Joji Arts" wordmark,
 * set in outlined Fraunces so it renders the same everywhere with no font download.
 * Height drives the size (default 36px); the width follows the lockup's proportions.
 */
export function BrandLogo({ className, inverted }: { className?: string; inverted?: boolean }) {
   return (
      <svg
         viewBox={LOCKUP.viewBox}
         width={LOCKUP.width}
         height={LOCKUP.height}
         role="img"
         aria-label="Joji Arts"
         className={cn('group/logo h-9 w-auto shrink-0 overflow-visible', inverted ? 'text-white' : 'text-ink', className)}
      >
         <path
            d={MARK_PATH}
            transform={LOCKUP.mark}
            fill="none"
            stroke={inverted ? RED_ON_DARK : RED}
            strokeWidth={LOCKUP.markStroke}
            strokeLinecap="round"
            strokeLinejoin="round"
         />
         <g transform={LOCKUP.wordmark} fill="currentColor">
            <path d={WORDMARK_JOJI} />
            <path d={WORDMARK_ARTS} fillOpacity={0.68} />
         </g>
      </svg>
   )
}
