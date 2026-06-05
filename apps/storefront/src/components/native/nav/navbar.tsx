'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { MenuIcon, MoonIcon, SearchIcon, SunIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { FormEvent, useState } from 'react'

export function Navbar() {
   const router = useRouter()
   const { resolvedTheme, setTheme } = useTheme()
   const [query, setQuery] = useState('')

   function onSearch(event: FormEvent) {
      event.preventDefault()
      router.push(`/products?q=${encodeURIComponent(query)}`)
   }

   return (
      <header className="sticky top-0 z-50 mb-4 w-full border-b bg-background/95 px-6 backdrop-blur supports-backdrop-blur:bg-background/90 lg:px-12">
         <div className="mx-auto flex h-16 max-w-7xl items-center gap-4">
            <Link href="/" className="flex min-w-fit items-center gap-2">
               <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-500 text-white shadow-sm">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 24 24"
                     fill="none"
                     className="h-5 w-5"
                  >
                     <circle cx="12" cy="12" r="10" fill="currentColor" />
                     <path d="M8 7h8v2h-6v2h5v2h-5v4H8V7Z" fill="white" />
                     <circle cx="16.5" cy="16.5" r="1.5" fill="white" />
                  </svg>
               </span>
               <span className="text-lg font-semibold tracking-tight text-foreground">
                  Fannify
               </span>
            </Link>

            <form onSubmit={onSearch} className="hidden flex-1 md:block">
               <div className="relative">
                  <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                     value={query}
                     onChange={(event) => setQuery(event.target.value)}
                     className="h-11 rounded-full border-border bg-background pl-11 text-sm shadow-sm transition duration-200 focus-visible:ring-2 focus-visible:ring-red-200"
                     placeholder="Search products"
                  />
               </div>
            </form>

            <div className="ml-auto flex items-center gap-4">
               <Link
                  href="/products/gallery"
                  className="hidden text-sm text-foreground/80 md:inline-block"
               >
                  Products
               </Link>
               <Link href="/cart" className="hidden text-sm text-foreground/80 md:inline-block">
                  My cart
               </Link>
               <Link
                  href="/profile/edit"
                  className="hidden text-sm text-foreground/80 md:inline-block"
               >
                  Preferences
               </Link>
               <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-lg"
                  onClick={() =>
                     setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
                  }
               >
                  {resolvedTheme === 'dark' ? (
                     <SunIcon className="h-4 w-4" />
                  ) : (
                     <MoonIcon className="h-4 w-4" />
                  )}
               </Button>
               <Link href="/login" className="hidden text-sm text-foreground/80 sm:inline-block">
                  Sign in
               </Link>
               <Link href="/login" className="hidden sm:inline-block">
                  <Button className="rounded-lg bg-red-500 px-4 text-white shadow-md transition duration-200 hover:scale-105 hover:bg-red-600">
                     Sign up
                  </Button>
               </Link>

               <div className="sm:hidden">
                  <Sheet>
                     <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg">
                           <MenuIcon className="h-4 w-4" />
                        </Button>
                     </SheetTrigger>
                     <SheetContent side="right" className="w-[300px] p-4">
                        <div className="mt-6 space-y-4">
                           <form onSubmit={onSearch}>
                              <div className="relative">
                                 <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                 <Input
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    className="h-10 rounded-full pl-10"
                                    placeholder="Search products"
                                 />
                              </div>
                           </form>
                           <div className="space-y-2">
                              <Link
                                 href="/products/gallery"
                                 className="block text-sm text-foreground/80"
                              >
                                 Products
                              </Link>
                              <Link href="/cart" className="block text-sm text-foreground/80">
                                 My cart
                              </Link>
                              <Link href="/profile/edit" className="block text-sm text-foreground/80">
                                 Preferences
                              </Link>
                              <Link href="/login" className="block text-sm text-foreground/80">
                                 Sign in
                              </Link>
                           </div>
                           <Link href="/login">
                              <Button className="w-full rounded-lg bg-red-500 text-white shadow-md">
                                 Sign up
                              </Button>
                           </Link>
                        </div>
                     </SheetContent>
                  </Sheet>
               </div>
            </div>
         </div>
      </header>
   )
}
