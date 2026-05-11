'use client'

import { useEffect, useState } from 'react'

export function ScrollProgress() {
   const [progress, setProgress] = useState(0)

   useEffect(() => {
      const onScroll = () => {
         const total = document.documentElement.scrollHeight - window.innerHeight
         if (total <= 0) {
            setProgress(0)
            return
         }
         setProgress((window.scrollY / total) * 100)
      }

      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
   }, [])

   return (
      <div className="pointer-events-none fixed left-0 top-0 z-[70] h-1 w-full bg-transparent">
         <div
            className="h-full bg-gradient-to-r from-primary/80 via-primary to-primary/80 transition-[width] duration-150"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
         />
      </div>
   )
}
