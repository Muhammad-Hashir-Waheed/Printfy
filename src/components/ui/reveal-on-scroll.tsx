'use client'

import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

export function RevealOnScroll({
   children,
   className,
}: {
   children: React.ReactNode
   className?: string
}) {
   const ref = useRef<HTMLDivElement>(null)
   const [visible, setVisible] = useState(false)

   useEffect(() => {
      const node = ref.current
      if (!node) return

      const observer = new IntersectionObserver(
         ([entry]) => {
            if (entry.isIntersecting) {
               setVisible(true)
               observer.disconnect()
            }
         },
         { threshold: 0.12 }
      )

      observer.observe(node)
      return () => observer.disconnect()
   }, [])

   return (
      <div
         ref={ref}
         className={cn(
            'transition-all duration-700 ease-out will-change-transform',
            visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
            className
         )}
      >
         {children}
      </div>
   )
}
