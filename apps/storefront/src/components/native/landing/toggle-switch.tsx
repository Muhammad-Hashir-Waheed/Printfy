'use client'

import { cn } from '@/lib/utils'

interface ToggleSwitchProps {
   active: 'selling' | 'personal'
   onChange: (value: 'selling' | 'personal') => void
}

export function ToggleSwitch({ active, onChange }: ToggleSwitchProps) {
   const options: Array<{ id: 'selling' | 'personal'; label: string }> = [
      { id: 'selling', label: 'Start selling' },
      { id: 'personal', label: 'Order for myself' },
   ]

   return (
      <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm transition-all duration-200">
         {options.map((option) => {
            const isActive = active === option.id
            return (
               <button
                  key={option.id}
                  type="button"
                  onClick={() => onChange(option.id)}
                  className={cn(
                     'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                     isActive
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                  )}
               >
                  {option.label}
               </button>
            )
         })}
      </div>
   )
}
