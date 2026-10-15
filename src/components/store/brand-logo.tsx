import { cn } from '@/lib/utils'

/**
 * Joji Arts mark — an artist's seal: a hand-lettered "JA" monogram on a red stamp.
 * Calligraphic contrast (heavy downstrokes, hairline top bar and crossbar flick).
 * Designed on a 40×40 grid; legible down to 16px.
 */
export function BrandMark({ className }: { className?: string }) {
   return (
      <svg
         viewBox="0 0 40 40"
         aria-hidden
         className={cn(
            'h-9 w-9 transition-transform duration-500 [transition-timing-function:cubic-bezier(.3,1.6,.5,1)] group-hover:-rotate-6 group-hover:scale-105',
            className
         )}
      >
         <rect width="40" height="40" rx="9" fill="#D42F25" />
         <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.5 10.8C12 10 18.5 10 24.6 10.2" strokeWidth="2.2" />
            <path d="M14.2 10.6V24.6C14.2 28.8 11.9 31 7.9 30.4" strokeWidth="4.2" />
            <path d="M24.6 10.2L18.4 30.6" strokeWidth="2.3" />
            <path d="M24.6 10.2L31.4 30.6" strokeWidth="4.2" />
            <path d="M19.4 24.6C23 23.6 27.6 23 33 22.4" strokeWidth="2.2" />
         </g>
      </svg>
   )
}

export function BrandLogo({ className, inverted }: { className?: string; inverted?: boolean }) {
   return (
      <span className={cn('group inline-flex items-center gap-2.5', className)} aria-label="Joji Arts">
         <BrandMark />
         <span
            className={cn(
               'whitespace-nowrap font-display text-[1.4rem] leading-none tracking-[-0.035em]',
               inverted ? 'text-white' : 'text-ink'
            )}
         >
            <span className="font-extrabold">Joji</span>{' '}
            <span className={cn('font-medium', inverted ? 'text-white/60' : 'text-ink/55')}>Arts</span>
         </span>
      </span>
   )
}
