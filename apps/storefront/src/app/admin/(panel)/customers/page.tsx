import { getStorage } from '@/studio/server/storage'
import { listSubmissions } from '@/studio/server/submissions'
import { Avatar, StatusBadge, timeAgo } from '@/studio/components/admin/bits'
import type { SubmissionSummary } from '@/studio/types'
import { Mail, Users } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Customers' }

export default async function CustomersPage() {
   const rows: SubmissionSummary[] = getStorage() ? await listSubmissions() : []
   const map = new Map<string, { name: string; email: string; company?: string; rows: SubmissionSummary[] }>()
   for (const r of rows) {
      const key = r.customerEmail.toLowerCase()
      const entry = map.get(key) ?? { name: r.customerName, email: r.customerEmail, company: r.company, rows: [] }
      entry.rows.push(r)
      map.set(key, entry)
   }
   const customers = [...map.values()].sort((a, b) => b.rows[0].createdAt.localeCompare(a.rows[0].createdAt))

   return (
      <div>
         <p className="eyebrow text-primary">Customers</p>
         <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">Your clients</h1>
         <p className="mt-1 text-muted-foreground">
            {customers.length} {customers.length === 1 ? 'client' : 'clients'} · {rows.length} design requests
         </p>

         {customers.length ? (
            <ul className="mt-6 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
               {customers.map((c) => {
                  const latest = c.rows[0]
                  const files = c.rows.reduce((n, r) => n + r.fileCount, 0)
                  return (
                     <li key={c.email} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                        <div className="flex items-center gap-3">
                           <Avatar name={c.name} email={c.email} className="h-12 w-12 text-sm" />
                           <div className="min-w-0 flex-1">
                              <p className="truncate font-display text-lg font-bold">{c.name}</p>
                              <p className="truncate text-sm text-muted-foreground">{c.company || c.email}</p>
                           </div>
                           <a href={`mailto:${c.email}`} className="grid h-10 w-10 place-items-center rounded-full border hover:border-ink" aria-label={`Email ${c.name}`}>
                              <Mail className="h-4 w-4" />
                           </a>
                        </div>
                        <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                           {[
                              ['Requests', c.rows.length],
                              ['Files', files],
                              ['Last seen', timeAgo(latest.createdAt)],
                           ].map(([k, v]) => (
                              <div key={k as string} className="rounded-2xl bg-muted/60 py-2">
                                 <dt className="text-[11px] text-muted-foreground">{k}</dt>
                                 <dd className="font-semibold">{v}</dd>
                              </div>
                           ))}
                        </dl>
                        <ul className="mt-4 space-y-1">
                           {c.rows.slice(0, 3).map((r) => (
                              <li key={r.id}>
                                 <Link href={`/admin/submissions/${r.id}`} className="flex items-center justify-between gap-2 rounded-xl px-2 py-1.5 text-sm hover:bg-muted">
                                    <span className="truncate">
                                       <span className="font-mono text-xs">{r.reference}</span>
                                       <span className="text-muted-foreground"> · {r.productNames[0] ?? 'Quote'}</span>
                                    </span>
                                    <StatusBadge status={r.status} />
                                 </Link>
                              </li>
                           ))}
                        </ul>
                     </li>
                  )
               })}
            </ul>
         ) : (
            <div className="mt-8 flex flex-col items-center rounded-3xl bg-white px-6 py-20 text-center ring-1 ring-black/5">
               <span className="grid h-16 w-16 place-items-center rounded-3xl bg-muted">
                  <Users className="h-7 w-7 text-primary" />
               </span>
               <p className="mt-4 font-display text-xl font-bold">No clients yet</p>
               <p className="mt-1 text-sm text-muted-foreground">Clients appear here after their first design request.</p>
            </div>
         )}
      </div>
   )
}
