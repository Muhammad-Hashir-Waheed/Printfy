'use client'

import { cn } from '@/lib/utils'
import { STATUS_META, type SubmissionStatus, type SubmissionSummary } from '@/studio/types'
import { LayoutGrid, Paperclip, RefreshCw, Rows3, Search, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import { Avatar, DesignThumb, StatusBadge, timeAgo } from './bits'

type Tab = 'active' | 'attention' | SubmissionStatus | 'all'

const TABS: Array<{ id: Tab; label: string }> = [
   { id: 'active', label: 'Active' },
   { id: 'attention', label: 'Needs attention' },
   { id: 'new', label: 'New' },
   { id: 'in_review', label: 'In review' },
   { id: 'changes_requested', label: 'Changes requested' },
   { id: 'approved', label: 'Approved' },
   { id: 'in_production', label: 'In production' },
   { id: 'completed', label: 'Completed' },
   { id: 'archived', label: 'Archived' },
   { id: 'all', label: 'All' },
]

function matchesTab(r: SubmissionSummary, tab: Tab) {
   if (tab === 'all') return true
   if (tab === 'active') return r.status !== 'archived' && r.status !== 'completed'
   if (tab === 'attention') return !r.seenByAdmin
   return r.status === tab
}

export function SubmissionInbox({ initial }: { initial: SubmissionSummary[] }) {
   const router = useRouter()
   const params = useSearchParams()
   const [rows, setRows] = useState(initial)
   const [tab, setTab] = useState<Tab>((params.get('status') as Tab) || 'active')
   const [q, setQ] = useState('')
   const [view, setView] = useState<'grid' | 'table'>('grid')
   const [refreshing, setRefreshing] = useState(false)
   const known = useRef(new Set(initial.map((r) => r.id)))

   useEffect(() => {
      try {
         const saved = localStorage.getItem('studio-view')
         if (saved === 'grid' || saved === 'table') setView(saved)
      } catch {}
   }, [])

   async function refresh(silent = true) {
      if (!silent) setRefreshing(true)
      try {
         const res = await fetch('/api/admin/submissions', { cache: 'no-store' })
         if (res.status === 401) return router.replace('/admin/login')
         if (!res.ok) return
         const next: SubmissionSummary[] = await res.json()
         const fresh = next.filter((r) => !known.current.has(r.id))
         fresh.forEach((r) => known.current.add(r.id))
         if (fresh.length && silent) {
            toast.success(`${fresh.length} new design ${fresh.length === 1 ? 'request' : 'requests'} 🎨`)
            router.refresh()
         }
         setRows(next)
      } finally {
         setRefreshing(false)
      }
   }

   // Live inbox: poll every 20 seconds while the tab is visible
   useEffect(() => {
      const id = setInterval(() => document.visibilityState === 'visible' && refresh(true), 20_000)
      return () => clearInterval(id)
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   const counts = useMemo(() => {
      const c = {} as Record<Tab, number>
      TABS.forEach((t) => (c[t.id] = rows.filter((r) => matchesTab(r, t.id)).length))
      return c
   }, [rows])

   const visible = useMemo(() => {
      const needle = q.trim().toLowerCase()
      return rows.filter((r) => {
         if (!matchesTab(r, tab)) return false
         if (!needle) return true
         return [r.reference, r.customerName, r.customerEmail, r.company ?? '', ...r.productNames].join(' ').toLowerCase().includes(needle)
      })
   }, [rows, tab, q])

   function chooseTab(t: Tab) {
      setTab(t)
      const url = new URL(window.location.href)
      if (t === 'active') url.searchParams.delete('status')
      else url.searchParams.set('status', t)
      window.history.replaceState(null, '', url)
   }

   return (
      <div>
         <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
               <p className="eyebrow text-primary">Design inbox</p>
               <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">Customer designs</h1>
            </div>
            <div className="flex items-center gap-2">
               <div className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                     value={q}
                     onChange={(e) => setQ(e.target.value)}
                     placeholder="Search name, email, ref, product…"
                     className="h-11 w-full rounded-full border border-input bg-white pl-10 pr-4 text-sm outline-none focus:border-ink sm:w-72"
                  />
               </div>
               <button
                  type="button"
                  onClick={() => refresh(false)}
                  className="grid h-11 w-11 place-items-center rounded-full border bg-white hover:border-ink"
                  aria-label="Refresh"
               >
                  <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
               </button>
               <div className="hidden rounded-full border bg-white p-1 sm:flex">
                  {(['grid', 'table'] as const).map((v) => (
                     <button
                        key={v}
                        type="button"
                        onClick={() => {
                           setView(v)
                           try {
                              localStorage.setItem('studio-view', v)
                           } catch {}
                        }}
                        className={cn('grid h-9 w-9 place-items-center rounded-full', view === v ? 'bg-ink text-white' : 'text-muted-foreground')}
                        aria-label={v === 'grid' ? 'Card view' : 'Table view'}
                     >
                        {v === 'grid' ? <LayoutGrid className="h-4 w-4" /> : <Rows3 className="h-4 w-4" />}
                     </button>
                  ))}
               </div>
            </div>
         </div>

         <div className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {TABS.map((t) => (
               <button
                  key={t.id}
                  type="button"
                  onClick={() => chooseTab(t.id)}
                  className={cn(
                     'inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition',
                     tab === t.id ? 'bg-ink text-white' : 'bg-white text-foreground/70 ring-1 ring-black/5 hover:text-ink'
                  )}
               >
                  {t.id !== 'active' && t.id !== 'all' && t.id !== 'attention' ? (
                     <span className={cn('h-2 w-2 rounded-full', STATUS_META[t.id].dot)} />
                  ) : null}
                  {t.label}
                  <span className={cn('rounded-full px-1.5 text-xs tabular-nums', tab === t.id ? 'bg-white/20' : 'bg-muted')}>{counts[t.id]}</span>
               </button>
            ))}
         </div>

         {visible.length === 0 ? (
            <div className="mt-8 flex flex-col items-center rounded-3xl bg-white px-6 py-20 text-center ring-1 ring-black/5">
               <span className="grid h-16 w-16 place-items-center rounded-3xl bg-muted">
                  <Sparkles className="h-7 w-7 text-primary" />
               </span>
               <p className="mt-4 font-display text-xl font-bold">{q ? 'No matches' : 'Nothing here yet'}</p>
               <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  {q ? 'Try another name, email or reference.' : 'New customer designs appear here automatically.'}
               </p>
            </div>
         ) : view === 'grid' ? (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
               {visible.map((r) => (
                  <li key={r.id}>
                     <Link
                        href={`/admin/submissions/${r.id}`}
                        className={cn(
                           'group block overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg',
                           !r.seenByAdmin && 'ring-2 ring-primary/60'
                        )}
                     >
                        <div className="relative">
                           <DesignThumb fileId={r.coverFileId} className="aspect-[4/3] w-full rounded-none ring-0" label={r.reference} />
                           <span className="absolute left-3 top-3">
                              <StatusBadge status={r.status} className="bg-white/95 shadow-sm" />
                           </span>
                           {!r.seenByAdmin ? (
                              <span className="absolute right-3 top-3 rounded-full bg-primary px-2 py-1 text-[11px] font-bold text-white shadow">NEW</span>
                           ) : null}
                           {r.fileCount > 1 ? (
                              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur">
                                 <Paperclip className="h-3 w-3" /> {r.fileCount}
                              </span>
                           ) : null}
                        </div>
                        <div className="p-4">
                           <div className="flex items-center gap-3">
                              <Avatar name={r.customerName} email={r.customerEmail} />
                              <div className="min-w-0 flex-1">
                                 <p className="truncate font-semibold">{r.customerName}</p>
                                 <p className="truncate text-xs text-muted-foreground">{r.company || r.customerEmail}</p>
                              </div>
                           </div>
                           <p className="mt-3 line-clamp-1 text-sm">{r.productNames.join(', ') || 'Custom quote request'}</p>
                           <p className="mt-2 flex justify-between text-xs text-muted-foreground">
                              <span className="font-mono">{r.reference}</span>
                              <span>{timeAgo(r.createdAt)}</span>
                           </p>
                        </div>
                     </Link>
                  </li>
               ))}
            </ul>
         ) : (
            <div className="mt-6 overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
               <table className="w-full min-w-[760px] text-sm">
                  <thead>
                     <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="px-5 py-3 font-semibold">Design</th>
                        <th className="px-3 py-3 font-semibold">Customer</th>
                        <th className="px-3 py-3 font-semibold">Products</th>
                        <th className="px-3 py-3 font-semibold">Status</th>
                        <th className="px-5 py-3 text-right font-semibold">Received</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y">
                     {visible.map((r) => (
                        <tr key={r.id} className="cursor-pointer transition hover:bg-muted/50" onClick={() => router.push(`/admin/submissions/${r.id}`)}>
                           <td className="px-5 py-3">
                              <span className="flex items-center gap-3">
                                 <DesignThumb fileId={r.coverFileId} className="h-12 w-12" />
                                 <span>
                                    <Link href={`/admin/submissions/${r.id}`} className="font-mono text-xs font-semibold" onClick={(e) => e.stopPropagation()}>
                                       {r.reference}
                                    </Link>
                                    {!r.seenByAdmin ? <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">NEW</span> : null}
                                    <span className="block text-xs text-muted-foreground">
                                       {r.fileCount} {r.fileCount === 1 ? 'file' : 'files'} · {r.source}
                                    </span>
                                 </span>
                              </span>
                           </td>
                           <td className="px-3 py-3">
                              <span className="block font-semibold">{r.customerName}</span>
                              <span className="block text-xs text-muted-foreground">{r.customerEmail}</span>
                           </td>
                           <td className="max-w-[260px] truncate px-3 py-3">{r.productNames.join(', ') || '—'}</td>
                           <td className="px-3 py-3">
                              <StatusBadge status={r.status} />
                           </td>
                           <td className="px-5 py-3 text-right text-muted-foreground">{timeAgo(r.createdAt)}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </div>
   )
}
