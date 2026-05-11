import { MainNav } from '@/components/main-nav'
import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'

import { LogoutButton } from './logout-button'

export default async function Navbar() {
   return (
      <div className="border-b px-4 sm:px-6 lg:px-12">
         <div className="flex h-auto min-h-16 flex-col gap-3 py-2 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0">
            <div className="flex items-center gap-4">
            <Link href="/" className="font-bold tracking-wider">
               ADMIN
            </Link>
               <div className="min-w-0 flex-1">
                  <MainNav />
               </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
               <ThemeToggle />
               <LogoutButton />
            </div>
         </div>
      </div>
   )
}
