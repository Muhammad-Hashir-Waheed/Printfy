'use client'

import { cn } from '@/lib/utils'

type VariantSelectorProps = {
   variants: Array<{
      name: string
      options: Array<{ value: string; priceModifier: number }>
   }>
   selected: Record<string, { value: string; priceModifier: number }>
   onVariantChange: (
      name: string,
      option: { value: string; priceModifier: number }
   ) => void
}

export function VariantSelector({
   variants,
   selected,
   onVariantChange,
}: VariantSelectorProps) {
   return (
      <div className="space-y-4 rounded-2xl border bg-card p-4 shadow-sm">
         <h3 className="font-semibold">Variants</h3>
         {variants.map((variant) => (
            <div key={variant.name}>
               <p className="mb-2 text-sm text-muted-foreground">{variant.name}</p>
               <div className="flex flex-wrap gap-2">
                  {variant.options.map((item) => (
                     <button
                        type="button"
                        key={`${variant.name}-${item.value}`}
                        onClick={() => onVariantChange(variant.name, item)}
                        className={cn(
                           'rounded-2xl border px-3 py-1 text-sm transition',
                           selected[variant.name]?.value === item.value
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'hover:bg-accent'
                        )}
                     >
                        {item.value}
                        {item.priceModifier !== 0
                           ? ` (${item.priceModifier > 0 ? '+' : ''}$${item.priceModifier.toFixed(2)})`
                           : ''}
                     </button>
                  ))}
               </div>
            </div>
         ))}
      </div>
   )
}
