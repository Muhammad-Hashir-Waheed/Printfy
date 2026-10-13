'use client'

import { BrandMark } from '@/components/store/brand-logo'
import { cn } from '@/lib/utils'
import { ExternalLink, Inbox, LayoutDashboard, LogOut, Menu, Users, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV = [
   { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
   { href: '/admin/submissions', label: 'Design inbox', icon: Inbox },
   { href: '/admin/customers', label: 'Customers', icon: Users },
]

export function AdminShell({
   children,
   email,
   inboxCount,
   storage,
}: {
   children: React.ReactNode
   email: string
   inboxCount: number
   storage: 'local' | 'supabase' | null
}) {
   const pathname = usePathname()
   const router = useRouter()
   const [open, setOpen] = useState(false)

   useEffect(() => setOpen(false), [pathname])
   useEffect(() => {
      document.title = inboxCount ? `(${inboxCount}) Design Studio` : 'Design Studio'
   }, [inboxCount, pathname])

   async function logout() {
      await fetch('/api/admin/session', { method: 'DELETE' })
      router.replace('/admin/login')
      router.refresh()
   }

   const sidebar = (
      <div className="flex h-full flex-col">
         <Link href="/admin" className="flex items-center gap-3 px-5 py-6">
            <BrandMark className="h-10 w-10" />
            <span>
               <span className="block font-display text-lg font-extrabold leading-none text-white">Joji Arts</span>
               <span className="text-xs font-medium text-white/50">Design Studio</span>
            </span>
         </Link>
         <nav className="flex-1 space-y-1 px-3">
            {NAV.map(({ href, label, icon: Icon, exact }) => {
               const active = exact ? pathname === href : pathname?.startsWith(href)
               return (
                  <Link
                     key={href}
                     href={href}
                     className={cn(
                        'group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition',
                        active ? 'bg-white text-ink shadow-sm' : 'text-white/65 hover:bg-white/10 hover:text-white'
                     )}
                  >
                     <Icon className="h-[18px] w-[18px]" />
                     <span className="flex-1">{label}</span>
                     {href === '/admin/submissions' && inboxCount ? (
                        <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-bold', active ? 'bg-primary text-white' : 'bg-primary text-white')}>
                           {inboxCount}
                        </span>
                     ) : null}
                  </Link>
               )
            })}
            <Link
               href="/"
               target="_blank"
               className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
            >
               <ExternalLink className="h-[18px] w-[18px]" /> View website
            </Link>
         </nav>
         <div className="m-3 rounded-2xl bg-white/5 p-3">
            <p className="truncate text-sm font-semibold text-white">{email}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/50">
               <span className={cn('h-1.5 w-1.5 rounded-full', storage ? 'bg-emerald-400' : 'bg-amber-400')} />
               {storage === 'supabase' ? 'Cloud storage' : storage === 'local' ? 'Local storage (dev)' : 'Storage not configured'}
            </p>
            <button
               type="button"
               onClick={logout}
               className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
               <LogOut className="h-4 w-4" /> Sign out
            </button>
         </div>
      </div>
   )

   return (
      <div className="min-h-screen lg:pl-64">
         <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-ink lg:block">{sidebar}</aside>

         {/* Mobile top bar + drawer */}
         <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-ink px-4 text-white lg:hidden">
            <button type="button" onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10" aria-label="Open menu">
               <Menu className="h-5 w-5" />
            </button>
            <span className="font-display font-extrabold">Design Studio</span>
            <Link href="/admin/submissions" className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-white/10" aria-label="Inbox">
               <Inbox className="h-5 w-5" />
               {inboxCount ? <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" /> : null}
            </Link>
         </div>
         {open ? (
            <div className="fixed inset-0 z-50 lg:hidden">
               <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
               <aside className="absolute inset-y-0 left-0 w-72 bg-ink animate-in slide-in-from-left duration-300">
                  <button type="button" onClick={() => setOpen(false)} className="absolute right-3 top-5 grid h-9 w-9 place-items-center rounded-full text-white/70 hover:bg-white/10" aria-label="Close">
                     <X className="h-5 w-5" />
                  </button>
                  {sidebar}
               </aside>
            </div>
         ) : null}

         <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
            {storage === null ? (
               <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <strong>Design storage isn&apos;t configured.</strong> Add <code>SUPABASE_URL</code> and{' '}
                  <code>SUPABASE_SERVICE_ROLE_KEY</code> on Vercel so customer uploads can be saved.
               </div>
            ) : null}
            {children}
         </main>
      </div>
   )
}
