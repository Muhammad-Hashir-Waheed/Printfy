import { getStorage } from '@/studio/server/storage'
import { listSubmissions } from '@/studio/server/submissions'
import { DesignThumb, StatusBadge, timeAgo } from '@/studio/components/admin/bits'
import { STATUS_META, SUBMISSION_STATUSES, type SubmissionSummary } from '@/studio/types'
import { ArrowRight, BellRing, CheckCircle2, Clock, FileStack, Inbox, Sparkles } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Overview' }

function dayKey(d: Date) {
   return d.toISOString().slice(0, 10)
}

export default async function OverviewPage() {
   const rows: SubmissionSummary[] = getStorage() ? await listSubmissions() : []
   const now = Date.now()
   const week = rows.filter((r) => now - new Date(r.createdAt).getTime() < 7 * 864e5)

   const count = (s: string) => rows.filter((r) => r.status === s).length
   const stats = [
      { label: 'New designs', value: count('new'), icon: Inbox, tone: 'from-sky-500 to-sky-600', href: '/admin/submissions?status=new' },
      { label: 'Needs attention', value: rows.filter((r) => !r.seenByAdmin).length, icon: BellRing, tone: 'from-rose-500 to-primary', href: '/admin/submissions?status=attention' },
      { label: 'In review', value: count('in_review'), icon: Clock, tone: 'from-amber-500 to-orange-500', href: '/admin/submissions?status=in_review' },
      { label: 'Approved', value: count('approved') + count('in_production'), icon: CheckCircle2, tone: 'from-emerald-500 to-teal-600', href: '/admin/submissions?status=approved' },
   ]

   // Last 14 days
   const days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(now - (13 - i) * 864e5)
      return { key: dayKey(d), label: d.toLocaleDateString('en-US', { weekday: 'narrow' }), date: d }
   })
   const perDay = days.map((d) => rows.filter((r) => r.createdAt.slice(0, 10) === d.key).length)
   const maxDay = Math.max(1, ...perDay)

   const byStatus = SUBMISSION_STATUSES.map((s) => ({ s, n: count(s) })).filter((x) => x.n > 0)
   const total = rows.length

   const productCounts = new Map<string, number>()
   rows.forEach((r) => r.productNames.forEach((p) => productCounts.set(p, (productCounts.get(p) ?? 0) + 1)))
   const topProducts = [...productCounts].sort((a, b) => b[1] - a[1]).slice(0, 5)

   const recent = rows.slice(0, 6)
   const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'

   return (
      <div className="space-y-8">
         <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
               <p className="eyebrow text-primary">Design Studio</p>
               <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">{greeting} ✨</h1>
               <p className="mt-1 text-muted-foreground">
                  {week.length} design {week.length === 1 ? 'request' : 'requests'} this week · {total} in total
               </p>
            </div>
            <Link href="/admin/submissions" className="btn-shine inline-flex h-11 items-center gap-2 self-start rounded-full bg-ink px-5 text-sm font-semibold text-white sm:self-auto">
               Open inbox <ArrowRight className="h-4 w-4" />
            </Link>
         </div>

         <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ label, value, icon: Icon, tone, href }) => (
               <Link key={label} href={href} className="group relative overflow-hidden rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md">
                  <span className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-15 transition group-hover:scale-125 ${tone}`} />
                  <span className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-sm ${tone}`}>
                     <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-5 font-display text-4xl font-extrabold tabular-nums tracking-tight">{value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{label}</p>
               </Link>
            ))}
         </div>

         <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
               <div className="flex items-baseline justify-between">
                  <h2 className="font-display text-xl font-bold">Requests · last 14 days</h2>
                  <p className="text-sm text-muted-foreground">{perDay.reduce((a, b) => a + b, 0)} total</p>
               </div>
               <div className="mt-6 flex h-48 gap-2">
                  {days.map((d, i) => (
                     <div key={d.key} className="group flex flex-1 flex-col items-center gap-2">
                        <div className="relative flex w-full flex-1 items-end">
                           <div
                              className="w-full rounded-t-xl bg-gradient-to-t from-primary to-coral transition-all duration-700 group-hover:from-ink group-hover:to-ink/70"
                              style={{ height: `${Math.max(perDay[i] ? 8 : 3, (perDay[i] / maxDay) * 100)}%`, opacity: perDay[i] ? 1 : 0.25 }}
                           />
                           <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-ink px-1.5 py-0.5 text-[11px] font-bold text-white opacity-0 transition group-hover:opacity-100">
                              {perDay[i]}
                           </span>
                        </div>
                        <span className="text-[11px] font-medium text-muted-foreground">{d.label}</span>
                     </div>
                  ))}
               </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
               <h2 className="font-display text-xl font-bold">Pipeline</h2>
               {total ? (
                  <>
                     <div className="mt-5 flex h-3 overflow-hidden rounded-full">
                        {byStatus.map(({ s, n }) => (
                           <span key={s} className={STATUS_META[s].dot} style={{ width: `${(n / total) * 100}%` }} title={`${STATUS_META[s].label}: ${n}`} />
                        ))}
                     </div>
                     <ul className="mt-5 space-y-2.5">
                        {byStatus.map(({ s, n }) => (
                           <li key={s}>
                              <Link href={`/admin/submissions?status=${s}`} className="flex items-center justify-between rounded-xl px-2 py-1.5 text-sm hover:bg-muted">
                                 <span className="flex items-center gap-2">
                                    <span className={`h-2.5 w-2.5 rounded-full ${STATUS_META[s].dot}`} /> {STATUS_META[s].label}
                                 </span>
                                 <span className="font-semibold tabular-nums">{n}</span>
                              </Link>
                           </li>
                        ))}
                     </ul>
                  </>
               ) : (
                  <p className="mt-4 text-sm text-muted-foreground">No requests yet.</p>
               )}
               {topProducts.length ? (
                  <>
                     <h3 className="mt-6 text-sm font-semibold text-muted-foreground">Most requested</h3>
                     <ul className="mt-2 space-y-1.5 text-sm">
                        {topProducts.map(([name, n]) => (
                           <li key={name} className="flex justify-between">
                              <span className="truncate">{name}</span>
                              <span className="font-semibold tabular-nums">{n}</span>
                           </li>
                        ))}
                     </ul>
                  </>
               ) : null}
            </section>
         </div>

         <section className="rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
            <div className="flex items-center justify-between border-b px-6 py-4">
               <h2 className="font-display text-xl font-bold">Latest designs</h2>
               <Link href="/admin/submissions" className="text-sm font-semibold text-primary hover:underline">
                  View all
               </Link>
            </div>
            {recent.length ? (
               <ul className="divide-y">
                  {recent.map((r) => (
                     <li key={r.id}>
                        <Link href={`/admin/submissions/${r.id}`} className="flex items-center gap-4 px-6 py-4 transition hover:bg-muted/50">
                           <DesignThumb fileId={r.coverFileId} className="h-14 w-14" label={r.reference} />
                           <div className="min-w-0 flex-1">
                              <p className="flex items-center gap-2 font-semibold">
                                 {!r.seenByAdmin ? <span className="h-2 w-2 shrink-0 rounded-full bg-primary" /> : null}
                                 <span className="truncate">{r.customerName}</span>
                                 <span className="hidden text-sm font-normal text-muted-foreground sm:inline">· {r.reference}</span>
                              </p>
                              <p className="truncate text-sm text-muted-foreground">
                                 {r.productNames.join(', ') || 'Custom quote'} · {r.fileCount} {r.fileCount === 1 ? 'file' : 'files'}
                              </p>
                           </div>
                           <div className="hidden items-center gap-3 sm:flex">
                              <StatusBadge status={r.status} />
                              <span className="w-16 text-right text-xs text-muted-foreground">{timeAgo(r.createdAt)}</span>
                           </div>
                        </Link>
                     </li>
                  ))}
               </ul>
            ) : (
               <div className="flex flex-col items-center px-6 py-16 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-3xl bg-muted">
                     <Sparkles className="h-7 w-7 text-primary" />
                  </span>
                  <p className="mt-4 font-display text-xl font-bold">Your studio is ready</p>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                     When customers upload artwork on a product page and send their request, it appears here instantly.
                  </p>
                  <Link href="/shop" target="_blank" className="mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold hover:border-ink">
                     <FileStack className="h-4 w-4" /> Try it on the website
                  </Link>
               </div>
            )}
         </section>
      </div>
   )
}
