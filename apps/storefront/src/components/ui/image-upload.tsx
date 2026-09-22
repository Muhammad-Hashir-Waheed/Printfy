'use client'

import { Button } from '@/components/ui/button'
import { ImagePlus, Loader2, Trash } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'react-hot-toast'

interface ImageUploadProps {
   disabled?: boolean
   onChange: (value: string) => void
   onRemove: (value: string) => void
   value: string[]
   multiple?: boolean
}

const ImageUpload: React.FC<ImageUploadProps> = ({
   disabled,
   onChange,
   onRemove,
   value,
   multiple = true,
}) => {
   const inputRef = useRef<HTMLInputElement>(null)
   const [uploading, setUploading] = useState(false)

   const handleFiles = async (files: FileList | null) => {
      if (!files?.length || disabled || uploading) return

      setUploading(true)
      try {
         const list = Array.from(files)
         for (const file of list) {
            const form = new FormData()
            form.append('file', file)
            const response = await fetch('/api/admin/uploads', {
               method: 'POST',
               body: form,
               cache: 'no-store',
            })
            if (!response.ok) {
               throw new Error(await response.text())
            }
            const payload = (await response.json()) as { url?: string }
            if (!payload.url) {
               throw new Error('Missing image URL')
            }
            onChange(payload.url)
         }
         toast.success(
            list.length > 1 ? 'Images uploaded.' : 'Image uploaded.'
         )
      } catch {
         toast.error('Image upload failed.')
      } finally {
         setUploading(false)
         if (inputRef.current) inputRef.current.value = ''
      }
   }

   return (
      <div>
         <div className="mb-4 flex flex-wrap items-center gap-4">
            {value.map((url) => (
               <div
                  key={url}
                  className="relative h-[160px] w-[160px] overflow-hidden rounded-md border"
               >
                  <div className="absolute right-2 top-2 z-10">
                     <Button
                        type="button"
                        onClick={() => onRemove(url)}
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        disabled={disabled || uploading}
                     >
                        <Trash className="h-4 w-4" />
                     </Button>
                  </div>
                  <img
                     src={url}
                     alt=""
                     className="h-full w-full object-cover"
                  />
               </div>
            ))}
         </div>
         <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple={multiple}
            className="hidden"
            onChange={(event) => handleFiles(event.target.files)}
         />
         <div
            className="flex max-w-xl flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
               event.preventDefault()
               handleFiles(event.dataTransfer.files)
            }}
         >
            <p className="mb-3 text-sm text-muted-foreground">
               Drop images here or upload from your computer
            </p>
            <Button
               type="button"
               disabled={disabled || uploading}
               variant="secondary"
               onClick={() => inputRef.current?.click()}
               className="flex gap-2"
            >
               {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
               ) : (
                  <ImagePlus className="h-4 w-4" />
               )}
               {uploading ? 'Uploading…' : 'Upload images'}
            </Button>
         </div>
      </div>
   )
}

export default ImageUpload
