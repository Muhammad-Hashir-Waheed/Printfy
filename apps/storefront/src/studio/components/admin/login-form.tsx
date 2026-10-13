'use client'

import { Eye, EyeOff, Loader2, Lock } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export function LoginForm() {
   const router = useRouter()
   const params = useSearchParams()
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [show, setShow] = useState(false)
   const [error, setError] = useState('')
   const [loading, setLoading] = useState(false)

   async function submit(e: React.FormEvent) {
      e.preventDefault()
      setLoading(true)
      setError('')
      try {
         const res = await fetch('/api/admin/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
         })
         const data = await res.json().catch(() => ({}))
         if (!res.ok) throw new Error(data.error || 'Sign in failed')
         const next = params.get('next')
         router.replace(next && next.startsWith('/admin') ? next : '/admin')
         router.refresh()
      } catch (err) {
         setError(err instanceof Error ? err.message : 'Sign in failed')
         setLoading(false)
      }
   }

   const input =
      'h-12 w-full rounded-2xl border border-input bg-white px-4 text-[15px] outline-none transition focus:border-ink focus:ring-4 focus:ring-ink/5'

   return (
      <form onSubmit={submit} className="mt-8 space-y-4">
         <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
               Email
            </label>
            <input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
         </div>
         <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
               Password
            </label>
            <div className="relative">
               <input
                  id="password"
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${input} pr-12`}
               />
               <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted"
                  aria-label={show ? 'Hide password' : 'Show password'}
               >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
               </button>
            </div>
         </div>
         {error ? <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
         <button
            type="submit"
            disabled={loading}
            className="btn-shine inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink font-semibold text-white transition hover:bg-ink/90 disabled:opacity-60"
         >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} Sign in
         </button>
      </form>
   )
}
