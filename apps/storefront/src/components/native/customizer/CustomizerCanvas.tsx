'use client'

import { DesignTransform } from '@/lib/designs'
import { cn } from '@/lib/utils'
import { MinusIcon, PlusIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

type CustomizerCanvasProps = {
   productImage: string
   designImage?: string
   color: string
   transform: DesignTransform
   onMove: (next: { x: number; y: number }) => void
   onScaleChange: (value: number) => void
}

export function CustomizerCanvas({
   productImage,
   designImage,
   color,
   transform,
   onMove,
   onScaleChange,
}: CustomizerCanvasProps) {
   const [dragging, setDragging] = useState(false)
   const [selected, setSelected] = useState(false)

   function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
      if (!designImage) return
      setDragging(true)
      const startX = event.clientX
      const startY = event.clientY
      const initialX = transform.x
      const initialY = transform.y

      const onMovePointer = (moveEvent: PointerEvent) => {
         onMove({
            x: initialX + moveEvent.clientX - startX,
            y: initialY + moveEvent.clientY - startY,
         })
      }

      const onUp = () => {
         setDragging(false)
         window.removeEventListener('pointermove', onMovePointer)
         window.removeEventListener('pointerup', onUp)
      }

      window.addEventListener('pointermove', onMovePointer)
      window.addEventListener('pointerup', onUp)
   }

   return (
      <div className="flex h-full min-h-[560px] items-center justify-center rounded-2xl border bg-muted/30 p-8 shadow-sm">
         <div className="relative h-[480px] w-full max-w-[520px] overflow-hidden rounded-2xl bg-white">
            <div
               className={cn(
                  'absolute inset-0 opacity-20 transition duration-200',
                  color === 'Black' && 'bg-neutral-950',
                  color === 'Navy' && 'bg-blue-950',
                  color === 'Red' && 'bg-red-800'
               )}
            />
            <Image
               src={productImage}
               alt="Product preview"
               fill
               className="object-contain"
            />
            {designImage ? (
               <div
                  role="button"
                  onClick={() => setSelected(true)}
                  onPointerDown={onPointerDown}
                  className={cn(
                     'absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-md border border-dashed transition-all duration-200',
                     selected ? 'border-primary ring-2 ring-primary/30' : 'border-primary/50',
                     dragging && 'cursor-grabbing'
                  )}
                  style={{
                     transform: `translate(-50%, -50%) translate(${transform.x}px, ${transform.y}px) rotate(${transform.rotate}deg) scale(${transform.scale / 100})`,
                  }}
               >
                  <img
                     src={designImage}
                     alt="Design overlay"
                     className="h-full w-full rounded-md object-contain"
                  />
                  {selected ? (
                     <>
                        <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full border bg-background" />
                        <span className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full border bg-background" />
                        <span className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-full border bg-background" />
                        <span className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-full border bg-background" />
                     </>
                  ) : null}
               </div>
            ) : null}
            <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-2xl border bg-background/95 p-2 shadow-sm">
               <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl border transition duration-200 hover:bg-accent"
                  onClick={() => onScaleChange(Math.max(30, transform.scale - 10))}
               >
                  <MinusIcon className="h-4 w-4" />
               </button>
               <span className="w-12 text-center text-xs font-medium">
                  {transform.scale}%
               </span>
               <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl border transition duration-200 hover:bg-accent"
                  onClick={() => onScaleChange(Math.min(200, transform.scale + 10))}
               >
                  <PlusIcon className="h-4 w-4" />
               </button>
            </div>
         </div>
      </div>
   )
}
