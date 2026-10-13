import { BrandMark } from '@/components/store/brand-logo'
import { adminConfigured } from '@/studio/admin-session'
import { LoginForm } from '@/studio/components/admin/login-form'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Sign in' }

export default function AdminLoginPage() {
   const configured = adminConfigured()
   return (
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
         <div className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-primary/40 blur-[110px]" />
            <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#ff2e88]/25 blur-[110px]" />
            <div className="relative flex items-center gap-3">
               <BrandMark className="h-11 w-11" />
               <span className="font-display text-xl font-extrabold">Joji Arts Studio</span>
            </div>
            <div className="relative">
               <h1 className="font-display text-6xl font-extrabold leading-[0.95] tracking-[-0.04em]">
                  Every design,
                  <br />
                  <span className="text-coral">beautifully</span> in order.
               </h1>
               <p className="mt-6 max-w-md text-lg text-white/65">
                  Review customer artwork, approve proofs and keep every project moving — all in one place.
               </p>
            </div>
            <p className="relative text-sm text-white/40">Authorised team members only.</p>
         </div>
         <div className="flex items-center justify-center p-6">
            <div className="w-full max-w-sm">
               <div className="mb-8 flex items-center gap-3 lg:hidden">
                  <BrandMark className="h-10 w-10" />
                  <span className="font-display text-xl font-extrabold">Joji Arts Studio</span>
               </div>
               <h2 className="font-display text-3xl font-extrabold tracking-tight">Welcome back</h2>
               <p className="mt-2 text-muted-foreground">Sign in to the Design Studio.</p>
               {configured ? (
                  <Suspense>
                     <LoginForm />
                  </Suspense>
               ) : (
                  <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                     <p className="font-semibold">Admin login isn&apos;t configured yet.</p>
                     <p className="mt-1">
                        Add <code>ADMIN_EMAIL</code>, <code>ADMIN_PASSWORD</code> and <code>ADMIN_SESSION_SECRET</code> (32+
                        characters) to your environment variables, then restart.
                     </p>
                  </div>
               )}
            </div>
         </div>
      </div>
   )
}
