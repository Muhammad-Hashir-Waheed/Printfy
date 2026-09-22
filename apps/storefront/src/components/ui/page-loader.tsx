'use client'

import { Loader } from '@/components/ui/loader'

export function PageLoader() {
   return (
      <div className="relative h-[70vh] w-full overflow-hidden">
         <div className="absolute -left-10 top-1/3 h-40 w-40 animate-pulse rounded-full bg-primary/10 blur-3xl" />
         <div className="absolute -right-10 bottom-1/4 h-44 w-44 animate-pulse rounded-full bg-red-400/10 blur-3xl" />
         <div className="absolute left-0 top-0 h-0.5 w-full bg-muted">
            <div className="h-full w-1/3 animate-[loader-slide_1.1s_ease-in-out_infinite] bg-primary/70" />
         </div>
         <div className="flex h-full items-center justify-center">
            <div className="rounded-2xl border bg-card/80 p-4 shadow-sm backdrop-blur transition-all duration-300 hover:scale-[1.02]">
               <Loader />
            </div>
         </div>
      </div>
   )
}
