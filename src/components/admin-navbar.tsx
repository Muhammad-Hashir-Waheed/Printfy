'use client'

import { MainNav } from '@/components/admin-main-nav'
import { LogoutButton } from '@/components/admin-logout-button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import {
   Sheet,
   SheetContent,
   SheetTitle,
   SheetTrigger,
} from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
   return (
      <div className="flex h-full flex-col bg-background">
         <Link
            href="/admin"
            onClick={onNavigate}
            className="flex h-14 items-center border-b px-5 font-bold tracking-wider"
         >
            JOJI ARTS
            <span className="ml-2 text-xs font-medium text-muted-foreground">
               Admin
            </span>
         </Link>
         <MainNav className="flex-1 overflow-y-auto p-3" onNavigate={onNavigate} />
         <div className="mt-auto flex items-center gap-2 border-t p-3">
            <ThemeToggle />
            <LogoutButton showLabel className="flex-1 justify-start gap-2" />
         </div>
      </div>
   )
}

export default function Navbar({ children }: { children: React.ReactNode }) {
   const [open, setOpen] = useState(false)

   return (
      <div className="flex min-h-screen bg-muted/30">
         <aside className="hidden w-64 shrink-0 border-r bg-background md:block">
            <div className="sticky top-0 h-screen">
               <Sidebar />
            </div>
         </aside>
         <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background px-4 md:hidden">
               <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                     <Button variant="outline" size="icon" aria-label="Open menu">
                        <Menu className="h-4 w-4" />
                     </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="flex h-full w-64 flex-col p-0">
                     <SheetTitle className="sr-only">Admin navigation</SheetTitle>
                     <Sidebar onNavigate={() => setOpen(false)} />
                  </SheetContent>
               </Sheet>
               <Link href="/admin" className="font-bold tracking-wider">
                  ADMIN
               </Link>
            </header>
            <div className="flex-1 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
               {children}
            </div>
         </div>
      </div>
   )
}
