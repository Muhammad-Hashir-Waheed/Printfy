'use client'

import { Button } from '@/components/ui/button'
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Trash2Icon, UploadCloudIcon } from 'lucide-react'
import { useRef, useState } from 'react'

type UploadModalProps = {
   onApply: (imageUrl: string) => void
}

export function UploadModal({ onApply }: UploadModalProps) {
   const [open, setOpen] = useState(false)
   const [preview, setPreview] = useState<string>('')
   const fileRef = useRef<HTMLInputElement>(null)

   function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
      const file = event.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button variant="secondary" className="w-full rounded-2xl">
               <UploadCloudIcon className="mr-2 h-4 w-4" />
               Upload Design
            </Button>
         </DialogTrigger>
         <DialogContent className="rounded-2xl">
            <DialogHeader>
               <DialogTitle>Upload Your Design</DialogTitle>
               <DialogDescription>
                  Add an image, preview it, and apply it to your product.
               </DialogDescription>
            </DialogHeader>

            <div
               onClick={() => fileRef.current?.click()}
               className="flex min-h-[180px] cursor-pointer items-center justify-center rounded-2xl border border-dashed p-6 text-sm text-muted-foreground transition hover:bg-accent/50"
            >
               {preview ? 'Change image' : 'Drag and drop or click to upload'}
            </div>

            <Input
               ref={fileRef}
               type="file"
               accept="image/*"
               className="hidden"
               onChange={onFileChange}
            />

            {preview ? (
               <div className="overflow-hidden rounded-2xl border bg-muted/30 p-3">
                  <img
                     src={preview}
                     alt="Uploaded preview"
                     className="max-h-56 w-full rounded-xl object-contain"
                  />
               </div>
            ) : null}

            <div className="flex items-center gap-2">
               <Button
                  className="flex-1 rounded-2xl"
                  disabled={!preview}
                  onClick={() => {
                     if (!preview) return
                     onApply(preview)
                     setOpen(false)
                  }}
               >
                  Apply Design
               </Button>
               <Button
                  variant="ghost"
                  className="rounded-2xl"
                  disabled={!preview}
                  onClick={() => setPreview('')}
               >
                  <Trash2Icon className="mr-2 h-4 w-4" />
                  Remove
               </Button>
            </div>
         </DialogContent>
      </Dialog>
   )
}
