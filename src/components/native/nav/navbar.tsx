'use client'

import {
   PackagingMegaMenu,
   PackagingMobileLinks,
} from '@/components/native/nav/packaging-mega-menu'
import { PrintfyLogo } from '@/components/native/printfy-logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { UserNav } from '@/components/native/nav/user'
import { useAuthenticated } from '@/hooks/useAuthentication'
import {
   ArrowRightIcon,
   HeartIcon,
   MenuIcon,
   MoonIcon,
   SearchIcon,
   ShoppingBagIcon,
   SunIcon,
   UserIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { FormEvent, useEffect, useState } from 'react'

const MOBILE_ACCOUNT_LINKS = [
   { label: 'My cart', href: '/cart' },
   { label: 'Wishlist', href: '/wishlist' },
   { label: 'Blog', href: '/blog' },
   { label: 'FAQ', href: '/faq' },
   { label: 'Contact', href: '/contact' },
]

const SIGNED_IN_MOBILE_LINKS = [
   { label: 'Orders', href: '/profile/orders' },
   { label: 'Payments', href: '/profile/payments' },
   { label: 'Addresses', href: '/profile/addresses' },
   { label: 'Saved designs', href: '/profile/designs' },
   { label: 'Edit profile', href: '/profile/edit' },
]

export function Navbar() {
   const router = useRouter()
   const { setTheme, resolvedTheme } = useTheme()
   const { authenticated } = useAuthenticated()
   const [query, setQuery] = useState('')
   const [mobileOpen, setMobileOpen] = useState(false)
   const [mounted, setMounted] = useState(false)

   useEffect(() => {
      setMounted(true)
   }, [])

   const signedIn = mounted && authenticated

   function onSearch(event: FormEvent) {
      event.preventDefault()
      router.push(`/products?q=${encodeURIComponent(query)}`)
   }

   function toggleTheme() {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
   }

   return (
      <header className="sticky top-0 z-50 w-full border-b bg-background shadow-[0_1px_0_rgba(15,23,42,0.06)]">
         <div className="bg-[#FF5A52] text-white">
            <div className="page-shell flex h-9 items-center justify-between gap-4">
               <p className="truncate text-[13px] font-medium tracking-wide">
                  Free digital proof on every order
                  <span className="mx-2 hidden opacity-70 sm:inline">·</span>
                  <span className="hidden sm:inline">No setup fees · From 50 pieces</span>
               </p>
               <Link
                  href="/products"
                  className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold underline-offset-4 hover:underline"
               >
                  Shop packaging
                  <ArrowRightIcon className="h-3.5 w-3.5" />
               </Link>
            </div>
         </div>

         <div className="page-shell flex h-[72px] items-center gap-5">
            <Link href="/" className="flex min-w-fit items-center gap-3">
               <PrintfyLogo className="h-11 w-11 shrink-0 rounded-xl shadow-sm ring-1 ring-black/10 dark:ring-white/10" />
               <span className="leading-tight">
                  <span className="block text-[17px] font-semibold tracking-tight text-foreground">
                     Joji Arts
                  </span>
                  <span className="hidden text-xs text-muted-foreground sm:block">
                     Custom packaging
                  </span>
               </span>
            </Link>

            <div className="hidden min-w-0 flex-1 md:block">
               <form onSubmit={onSearch}>
                  <div className="relative">
                     <SearchIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                     <Input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        className="h-11 rounded-xl border-transparent bg-muted/80 pl-10 shadow-none placeholder:text-muted-foreground/80 focus-visible:border-border focus-visible:bg-background"
                        placeholder="Search boxes, bags, signs, or a product"
                     />
                  </div>
               </form>
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
               <Link
                  href="/cart"
                  aria-label="Cart"
                  className="hidden h-11 items-center gap-2 rounded-xl px-2.5 text-foreground/80 transition hover:bg-muted hover:text-foreground md:inline-flex"
               >
                  <ShoppingBagIcon className="h-5 w-5" />
                  <span className="typo-body hidden font-medium lg:inline">Cart</span>
               </Link>
               <Link
                  href="/wishlist"
                  aria-label="Wishlist"
                  className="hidden h-11 items-center gap-2 rounded-xl px-2.5 text-foreground/80 transition hover:bg-muted hover:text-foreground md:inline-flex"
               >
                  <HeartIcon className="h-5 w-5" />
                  <span className="typo-body hidden font-medium lg:inline">Wishlist</span>
               </Link>

               <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="text-foreground/70"
               >
                  <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
               </Button>

               {signedIn ? (
                  <UserNav />
               ) : (
                  <>
                     <Link
                        href="/login"
                        aria-label="Sign in"
                        className="hidden h-11 items-center gap-2 rounded-xl px-2.5 text-foreground/80 transition hover:bg-muted hover:text-foreground sm:inline-flex"
                     >
                        <UserIcon className="h-5 w-5" />
                        <span className="typo-body hidden font-medium lg:inline">Sign in</span>
                     </Link>
                     <Link href="/login" className="hidden sm:inline-flex">
                        <Button className="h-11 bg-[#FF5A52] px-3.5 font-semibold text-white hover:bg-[#ff6d66] lg:px-4">
                           Start a project
                        </Button>
                     </Link>
                  </>
               )}

               <div className="sm:hidden">
                  <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                     <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                           <MenuIcon className="h-4 w-4" />
                        </Button>
                     </SheetTrigger>
                     <SheetContent side="right" className="w-[320px] overflow-y-auto p-4">
                        <div className="mt-6 space-y-4">
                           <form onSubmit={onSearch}>
                              <div className="relative">
                                 <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                 <Input
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    className="pl-10"
                                    placeholder="Search boxes, bags, signs"
                                 />
                              </div>
                           </form>

                           <PackagingMobileLinks onNavigate={() => setMobileOpen(false)} />

                           <div className="space-y-2 border-t pt-4">
                              {MOBILE_ACCOUNT_LINKS.map((link) => (
                                 <Link
                                    key={link.href}
                                    href={link.href}
                                    className="typo-body block text-foreground/80"
                                    onClick={() => setMobileOpen(false)}
                                 >
                                    {link.label}
                                 </Link>
                              ))}
                              {signedIn
                                 ? SIGNED_IN_MOBILE_LINKS.map((link) => (
                                      <Link
                                         key={link.href}
                                         href={link.href}
                                         className="typo-body block text-foreground/80"
                                         onClick={() => setMobileOpen(false)}
                                      >
                                         {link.label}
                                      </Link>
                                   ))
                                 : null}
                           </div>
                           {signedIn ? null : (
                              <Link href="/login" onClick={() => setMobileOpen(false)}>
                                 <Button className="w-full bg-[#FF5A52] text-white hover:bg-[#ff6d66]">
                                    Sign in or start a project
                                 </Button>
                              </Link>
                           )}
                        </div>
                     </SheetContent>
                  </Sheet>
               </div>
            </div>
         </div>

         <PackagingMegaMenu />
      </header>
   )
}
