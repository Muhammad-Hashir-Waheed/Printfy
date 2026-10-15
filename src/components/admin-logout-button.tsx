'use client'

import { Button } from '@/components/ui/button'
import { LogOutIcon } from 'lucide-react'

export function LogoutButton({
   className,
   showLabel,
}: {
   className?: string
   showLabel?: boolean
}) {
   async function onLogout() {
      try {
         const response = await fetch('/api/admin/auth/logout', {
            cache: 'no-store',
         })

         if (typeof window !== 'undefined' && window.localStorage) {
            document.cookie =
               'admin-logged-in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
         }

         if (response.status === 200) window.location.reload()
      } catch (error) {
         console.error({ error })
      }
   }

   return (
      <Button
         variant="outline"
         size={showLabel ? 'default' : 'icon'}
         className={className}
         onClick={onLogout}
      >
         <LogOutIcon className="h-4 w-4" />
         {showLabel ? <span>Log out</span> : null}
      </Button>
   )
}
