import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const BUCKET = 'product-images'
const MAX_BYTES = 4 * 1024 * 1024
const ALLOWED_TYPES: Record<string, string> = {
   'image/jpeg': 'jpg',
   'image/jpg': 'jpg',
   'image/png': 'png',
   'image/webp': 'webp',
   'image/gif': 'gif',
}

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (!supabaseUrl || !supabaseKey) {
         return new NextResponse('Storage is not configured', { status: 500 })
      }

      const form = await req.formData()
      const file = form.get('file')
      if (!(file instanceof File)) {
         return new NextResponse('No file uploaded', { status: 400 })
      }

      const ext = ALLOWED_TYPES[file.type]
      if (!ext) {
         return new NextResponse('Only JPG, PNG, WEBP, or GIF images are allowed', {
            status: 400,
         })
      }

      if (file.size > MAX_BYTES) {
         return new NextResponse('Image must be 4MB or smaller', { status: 400 })
      }

      const path = `products/${userId}/${Date.now()}-${crypto.randomUUID()}.${ext}`
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
         contentType: file.type,
         upsert: false,
      })

      if (error) {
         console.error('[ADMIN_UPLOAD]', error)
         return new NextResponse('Image upload failed', { status: 500 })
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      return NextResponse.json({ url: data.publicUrl })
   } catch (error) {
      console.error('[ADMIN_UPLOAD]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
