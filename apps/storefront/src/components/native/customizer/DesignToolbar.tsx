'use client'

import { Label } from '@/components/ui/label'
import { defaultTransform, DesignTransform } from '@/lib/designs'
import { Button } from '@/components/ui/button'
import { ArrowDownToLineIcon, ArrowUpToLineIcon, LocateFixedIcon, RotateCcwIcon } from 'lucide-react'

type DesignToolbarProps = {
   value: DesignTransform
   onChange: (value: DesignTransform) => void
   onCenter: () => void
}

export function DesignToolbar({ value, onChange, onCenter }: DesignToolbarProps) {
   return (
      <div className="space-y-4 rounded-2xl border bg-card p-4 shadow-sm">
         <h3 className="text-base font-semibold">Design Tools</h3>
         <div className="grid grid-cols-2 gap-2">
            <Button
               variant="secondary"
               className="justify-start"
               onClick={() => onChange(defaultTransform)}
            >
               <RotateCcwIcon className="mr-2 h-4 w-4" />
               Reset
            </Button>
            <Button variant="secondary" className="justify-start" onClick={onCenter}>
               <LocateFixedIcon className="mr-2 h-4 w-4" />
               Center
            </Button>
            <Button variant="ghost" className="justify-start">
               <ArrowUpToLineIcon className="mr-2 h-4 w-4" />
               Bring forward
            </Button>
            <Button variant="ghost" className="justify-start">
               <ArrowDownToLineIcon className="mr-2 h-4 w-4" />
               Send backward
            </Button>
         </div>
         <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
               <Label>Scale</Label>
               <span>{value.scale}%</span>
            </div>
            <input
               type="range"
               value={value.scale}
               min={30}
               max={200}
               step={1}
               className="h-2 w-full cursor-pointer rounded-lg bg-muted"
               onChange={(event) =>
                  onChange({ ...value, scale: Number(event.target.value) })
               }
            />
         </div>
         <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
               <Label>Rotate</Label>
               <span>{value.rotate}deg</span>
            </div>
            <input
               type="range"
               value={value.rotate}
               min={-180}
               max={180}
               step={1}
               className="h-2 w-full cursor-pointer rounded-lg bg-muted"
               onChange={(event) =>
                  onChange({ ...value, rotate: Number(event.target.value) })
               }
            />
         </div>
      </div>
   )
}
