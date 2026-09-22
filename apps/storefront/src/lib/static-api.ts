import { USE_STATIC_STORE } from '@/lib/static-mode'
import { NextResponse } from 'next/server'

export function staticApiDisabled() {
   if (!USE_STATIC_STORE) {
      return null
   }
   return NextResponse.json(
      {
         message:
            'Database is not configured. Browse products and use guest checkout with local cart.',
      },
      { status: 503 }
   )
}
