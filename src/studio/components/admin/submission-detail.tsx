'use client'

import { getProductByKey } from '@/catalog'
import { CatalogImage } from '@/components/store/catalog-image'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { units } from '@/lib/money'
import { cn } from '@/lib/utils'
import { formatBytes } from '@/studio/client/upload'
import { STATUS_META, SUBMISSION_STATUSES, type Submission, type SubmissionStatus } from '@/studio/types'
import {
   ArrowLeft,
   Building2,
   Check,
   ChevronDown,
   Clock,
   Copy,
   Download,
   ExternalLink,
   Factory,
   FileText,
   Lock,
   Loader2,
   Mail,
   MapPin,
   MessageSquare,
   PackageCheck,
   PenTool,
   Phone,
   Send,
   ThumbsUp,
   Undo2,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import { DesignMockup, PrintChecks } from '../design-mockup'
import { Avatar, StatusBadge, timeAgo } from './bits'

const when = (iso: string) =>
   new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })

/** The obvious next step for each status. */
const NEXT: Partial<Record<SubmissionStatus, { status: SubmissionStatus; label: string; icon: typeof Check }>> = {
   new: { status: 'in_review', label: 'Start review', icon: PenTool },
   in_review: { status: 'approved', label: 'Approve artwork', icon: ThumbsUp },
   approved: { status: 'in_production', label: 'Send to production', icon: Factory },
   in_production: { status: 'completed', label: 'Mark completed', icon: PackageCheck },
}

export function SubmissionDetail({ initial }: { initial: Submission }) {
   const router = useRouter()
   const [s, setS] = useState(initial)
   const [busy, setBusy] = useState<string | null>(null)
   const [composer, setComposer] = useState<'note' | 'message'>('note')
   const [text, setText] = useState('')
   const [changesOpen, setChangesOpen] = useState(false)
   const [changesText, setChangesText] = useState('')
   const [statusMenu, setStatusMenu] = useState(false)
   const [notify, setNotify] = useState(true)

   // Every file with the item it belongs to (for product mockups)
   const files = useMemo(() => {
      const list: Array<{ id: string; itemIndex: number | null; revision: boolean }> = []
      const revisionIds = new Set(s.timeline.filter((t) => t.kind === 'revision').flatMap((t) => t.fileIds ?? []))
      s.items.forEach((item, i) => item.artwork.fileIds.forEach((id) => list.push({ id, itemIndex: i, revision: false })))
      s.attachments.forEach((id) => list.push({ id, itemIndex: null, revision: false }))
      revisionIds.forEach((id) => {
         if (!list.some((f) => f.id === id)) list.push({ id, itemIndex: s.items.length === 1 ? 0 : null, revision: true })
      })
      return list.filter((f) => s.files[f.id])
   }, [s])
   const [selected, setSelected] = useState(files[files.length - 1]?.id ?? null)
   const file = selected ? s.files[selected] : null
   const fileCtx = files.find((f) => f.id === selected)
   const product = fileCtx?.itemIndex != null ? getProductByKey(s.items[fileCtx.itemIndex].productKey) : undefined

   async function patch(body: object, label: string) {
      setBusy(label)
      try {
         const res = await fetch(`/api/admin/submissions/${s.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
         })
         const json = await res.json()
         if (res.status === 401) return router.replace('/admin/login')
         if (!res.ok) throw new Error(json.error || 'Could not save')
         setS(json)
         router.refresh()
         return true
      } catch (error) {
         toast.error(error instanceof Error ? error.message : 'Could not save')
         return false
      } finally {
         setBusy(null)
      }
   }

   async function setStatus(status: SubmissionStatus, message?: string) {
      setStatusMenu(false)
      if (await patch({ action: 'status', status, message, notify }, status)) {
         toast.success(`Marked as ${STATUS_META[status].label.toLowerCase()}${notify ? ' · customer emailed' : ''}`)
      }
   }

   async function sendComposer() {
      if (!text.trim()) return
      if (await patch(composer === 'message' ? { action: 'message', text: text.trim(), notify } : { action: 'note', text: text.trim() }, 'composer')) {
         setText('')
         toast.success(composer === 'note' ? 'Note saved' : notify ? 'Message sent · customer emailed' : 'Message added to the customer’s page')
      }
   }

   const [customerLink, setCustomerLink] = useState('')
   useEffect(() => setCustomerLink(`${window.location.origin}/design-review/${s.id}?t=${encodeURIComponent(s.accessToken)}`), [s.id, s.accessToken])
   const fileUrl = (id: string, part: 'preview' | 'original', download = false) =>
      `/api/files/${id}?part=${part}${download ? '&download=1' : ''}`

   const next = NEXT[s.status]
   const c = s.customer

   return (
      <div>
         <Link href="/admin/submissions" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> Design inbox
         </Link>

         {/* Header */}
         <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
               <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-mono text-3xl font-bold tracking-tight">{s.reference}</h1>
                  <StatusBadge status={s.status} />
               </div>
               <p className="mt-1 text-sm text-muted-foreground">
                  {s.source === 'quote' ? 'Quote request' : 'Design request'} · received {when(s.createdAt)} · updated {timeAgo(s.updatedAt)}
               </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
               {s.status !== 'changes_requested' && s.status !== 'completed' && s.status !== 'archived' ? (
                  <button
                     type="button"
                     onClick={() => setChangesOpen(true)}
                     className="inline-flex h-11 items-center gap-2 rounded-full border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                  >
                     <Undo2 className="h-4 w-4" /> Request changes
                  </button>
               ) : null}
               {next ? (
                  <button
                     type="button"
                     onClick={() => setStatus(next.status)}
                     disabled={Boolean(busy)}
                     className="btn-shine inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white disabled:opacity-60"
                  >
                     {busy === next.status ? <Loader2 className="h-4 w-4 animate-spin" /> : <next.icon className="h-4 w-4" />} {next.label}
                  </button>
               ) : null}
               <div className="relative">
                  <button
                     type="button"
                     onClick={() => setStatusMenu((o) => !o)}
                     className="inline-flex h-11 items-center gap-1.5 rounded-full border bg-white px-4 text-sm font-semibold hover:border-ink"
                  >
                     Status <ChevronDown className="h-4 w-4" />
                  </button>
                  {statusMenu ? (
                     <>
                        <button type="button" className="fixed inset-0 z-10 cursor-default" onClick={() => setStatusMenu(false)} aria-label="Close" />
                        <ul className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-2xl border bg-white p-1.5 shadow-xl animate-in fade-in-0 zoom-in-95">
                           {SUBMISSION_STATUSES.map((st) => (
                              <li key={st}>
                                 <button
                                    type="button"
                                    onClick={() => (st === 'changes_requested' ? (setStatusMenu(false), setChangesOpen(true)) : setStatus(st))}
                                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm hover:bg-muted"
                                 >
                                    <span className={cn('h-2.5 w-2.5 rounded-full', STATUS_META[st].dot)} />
                                    <span className="flex-1">{STATUS_META[st].label}</span>
                                    {s.status === st ? <Check className="h-4 w-4" /> : null}
                                 </button>
                              </li>
                           ))}
                        </ul>
                     </>
                  ) : null}
               </div>
            </div>
         </div>

         <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px] xl:items-start">
            <div className="space-y-6">
               {/* Artwork viewer */}
               <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-6">
                  <div className="flex items-baseline justify-between">
                     <h2 className="font-display text-xl font-bold">Artwork</h2>
                     <span className="text-sm text-muted-foreground">
                        {files.length} {files.length === 1 ? 'file' : 'files'}
                     </span>
                  </div>
                  {file ? (
                     <>
                        {files.length > 1 ? (
                           <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
                              {files.map((f) => {
                                 const meta = s.files[f.id]
                                 return (
                                    <button
                                       key={f.id}
                                       type="button"
                                       onClick={() => setSelected(f.id)}
                                       className={cn(
                                          'relative flex shrink-0 items-center gap-2 rounded-2xl border p-1.5 pr-3 text-left text-xs transition',
                                          selected === f.id ? 'border-ink bg-ink text-white' : 'bg-white hover:border-ink'
                                       )}
                                    >
                                       <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-[repeating-conic-gradient(#efefef_0_25%,#fff_0_50%)] bg-[length:10px_10px]">
                                          {meta.hasPreview ? (
                                             // eslint-disable-next-line @next/next/no-img-element
                                             <img src={fileUrl(f.id, 'preview')} alt="" className="h-full w-full object-contain" />
                                          ) : (
                                             <FileText className="h-4 w-4 text-muted-foreground" />
                                          )}
                                       </span>
                                       <span className="max-w-[140px]">
                                          <span className="block truncate font-semibold">{meta.name}</span>
                                          <span className={cn('block', selected === f.id ? 'text-white/60' : 'text-muted-foreground')}>
                                             {f.revision ? 'Revision' : f.itemIndex != null ? s.items[f.itemIndex].productName : 'Attachment'}
                                          </span>
                                       </span>
                                    </button>
                                 )
                              })}
                           </div>
                        ) : null}
                        <div className="mt-4 grid gap-5 lg:grid-cols-[1.5fr_1fr] lg:items-start">
                           <DesignMockup
                              key={file.id}
                              imageUrl={file.hasPreview ? fileUrl(file.id, 'preview') : null}
                              pdfUrl={file.ext === 'pdf' ? fileUrl(file.id, 'original') : null}
                              fileName={file.name}
                              ext={file.ext}
                              productImage={product?.image}
                              productName={product?.name}
                              accent={product?.accent}
                              dark={product?.dark}
                           />
                           <div className="space-y-4">
                              <div className="rounded-2xl bg-muted/60 p-4">
                                 <p className="break-all font-semibold">{file.name}</p>
                                 <dl className="mt-2 grid grid-cols-2 gap-y-1 text-sm">
                                    <dt className="text-muted-foreground">Format</dt>
                                    <dd>.{file.ext.toUpperCase()}</dd>
                                    <dt className="text-muted-foreground">Size</dt>
                                    <dd>{formatBytes(file.size)}</dd>
                                    {file.width ? (
                                       <>
                                          <dt className="text-muted-foreground">Pixels</dt>
                                          <dd>
                                             {file.width} × {file.height}
                                          </dd>
                                       </>
                                    ) : null}
                                    <dt className="text-muted-foreground">Uploaded</dt>
                                    <dd>{timeAgo(file.uploadedAt)}</dd>
                                 </dl>
                                 <div className="mt-4 flex flex-wrap gap-2">
                                    <a
                                       href={fileUrl(file.id, 'original', true)}
                                       className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white"
                                    >
                                       <Download className="h-4 w-4" /> Download original
                                    </a>
                                    {file.ext === 'pdf' || file.hasPreview ? (
                                       <a
                                          href={file.ext === 'pdf' ? fileUrl(file.id, 'original') : fileUrl(file.id, 'preview')}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex h-10 items-center gap-2 rounded-full border bg-white px-4 text-sm font-semibold hover:border-ink"
                                       >
                                          <ExternalLink className="h-4 w-4" /> Open
                                       </a>
                                    ) : null}
                                 </div>
                              </div>
                              <div className="rounded-2xl border p-4">
                                 <p className="mb-3 text-sm font-semibold">Automatic print check</p>
                                 <PrintChecks ext={file.ext} width={file.width} height={file.height} size={file.size} />
                              </div>
                           </div>
                        </div>
                     </>
                  ) : (
                     <p className="mt-4 rounded-2xl bg-muted p-6 text-center text-sm text-muted-foreground">
                        No files uploaded — the customer chose design service or will send artwork later.
                     </p>
                  )}
               </section>

               {/* Items */}
               <section className="rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
                  <h2 className="border-b px-6 py-4 font-display text-xl font-bold">Requested products</h2>
                  {s.items.length ? (
                     <ul className="divide-y">
                        {s.items.map((item, i) => {
                           const p = getProductByKey(item.productKey)
                           return (
                              <li key={i} className="flex gap-4 px-6 py-4">
                                 <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-muted">
                                    <CatalogImage image={p?.image ?? null} label={item.productName} accent={p?.accent} sizes="64px" />
                                 </span>
                                 <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                                       <a href={item.productHref} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-primary">
                                          {item.productName}
                                       </a>
                                       <span className="text-sm font-semibold">{units(item.qty, item.unitLabel)}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                       {item.departmentName} · {item.categoryName}
                                    </p>
                                    <ul className="mt-2 flex flex-wrap gap-1.5">
                                       {Object.entries(item.selections).map(([k, v]) => (
                                          <li key={k} className="rounded-full bg-muted px-2.5 py-0.5 text-xs">
                                             <span className="capitalize text-muted-foreground">{k}:</span> {v}
                                          </li>
                                       ))}
                                    </ul>
                                    <p className="mt-2 text-xs">
                                       {item.artwork.mode === 'upload' ? (
                                          <span className="font-semibold text-emerald-700">✓ Artwork uploaded ({item.artwork.fileIds.length})</span>
                                       ) : item.artwork.mode === 'design' ? (
                                          <span className="font-semibold text-violet-700">
                                             ✎ Design service requested{item.artwork.brief ? ` — “${item.artwork.brief}”` : ''}
                                          </span>
                                       ) : (
                                          <span className="font-semibold text-amber-700">⏳ Artwork to follow</span>
                                       )}
                                    </p>
                                 </div>
                              </li>
                           )
                        })}
                     </ul>
                  ) : (
                     <p className="px-6 py-5 text-sm text-muted-foreground">Custom quote — see project details.</p>
                  )}
                  {s.details ? (
                     <div className="border-t px-6 py-4">
                        <p className="text-sm font-semibold">Project details</p>
                        <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{s.details}</p>
                     </div>
                  ) : null}
               </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6 xl:sticky xl:top-6">
               <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                  <div className="flex items-center gap-3">
                     <Avatar name={c.name} email={c.email} className="h-12 w-12 text-sm" />
                     <div className="min-w-0">
                        <p className="truncate font-display text-lg font-bold">{c.name}</p>
                        {c.company ? (
                           <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                              <Building2 className="h-3.5 w-3.5" /> {c.company}
                           </p>
                        ) : null}
                     </div>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm">
                     <li className="flex items-center gap-2">
                        <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <a href={`mailto:${c.email}?subject=${encodeURIComponent(`Your design ${s.reference}`)}`} className="truncate font-medium hover:text-primary">
                           {c.email}
                        </a>
                        <button
                           type="button"
                           onClick={() => navigator.clipboard.writeText(c.email).then(() => toast.success('Email copied'))}
                           className="ml-auto grid h-7 w-7 place-items-center rounded-full hover:bg-muted"
                           aria-label="Copy email"
                        >
                           <Copy className="h-3.5 w-3.5" />
                        </button>
                     </li>
                     {c.phone ? (
                        <li className="flex items-center gap-2">
                           <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                           <a href={`tel:${c.phone}`} className="font-medium hover:text-primary">
                              {c.phone}
                           </a>
                        </li>
                     ) : null}
                     {c.address || c.city || c.country ? (
                        <li className="flex items-start gap-2">
                           <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                           <span>{[c.address, c.city, c.country].filter(Boolean).join(', ')}</span>
                        </li>
                     ) : null}
                  </ul>
                  {c.notes ? <p className="mt-3 rounded-2xl bg-muted p-3 text-sm">“{c.notes}”</p> : null}
                  <button
                     type="button"
                     onClick={async () => {
                        if (await patch({ action: 'resend_link' }, 'resend')) toast.success(`Tracking link emailed to ${c.email}`)
                     }}
                     disabled={busy === 'resend'}
                     className="btn-shine mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white disabled:opacity-60"
                  >
                     {busy === 'resend' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Email tracking link
                  </button>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                     <a
                        href={`mailto:${c.email}?subject=${encodeURIComponent(`Your design ${s.reference}`)}`}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-full border text-sm font-semibold hover:border-ink"
                     >
                        <Mail className="h-4 w-4" /> Write email
                     </a>
                     <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(customerLink).then(() => toast.success('Customer link copied'))}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-full border text-sm font-semibold hover:border-ink"
                     >
                        <Copy className="h-4 w-4" /> Copy link
                     </button>
                  </div>
               </section>

               {/* Composer + timeline */}
               <section className="rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
                  <div className="p-5">
                     <div className="flex rounded-full bg-muted p-1 text-sm font-semibold">
                        <button
                           type="button"
                           onClick={() => setComposer('note')}
                           className={cn('flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5', composer === 'note' ? 'bg-white shadow-sm' : 'text-muted-foreground')}
                        >
                           <Lock className="h-3.5 w-3.5" /> Internal note
                        </button>
                        <button
                           type="button"
                           onClick={() => setComposer('message')}
                           className={cn('flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5', composer === 'message' ? 'bg-white shadow-sm' : 'text-muted-foreground')}
                        >
                           <MessageSquare className="h-3.5 w-3.5" /> To customer
                        </button>
                     </div>
                     <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={3}
                        placeholder={composer === 'note' ? 'Only your team sees this…' : 'Shown on the customer’s design page…'}
                        className={cn(
                           'mt-3 w-full rounded-2xl border p-3 text-sm outline-none focus:ring-4',
                           composer === 'note' ? 'border-amber-200 bg-amber-50/50 focus:ring-amber-100' : 'border-input focus:border-ink focus:ring-ink/5'
                        )}
                     />
                     <button
                        type="button"
                        onClick={sendComposer}
                        disabled={!text.trim() || busy === 'composer'}
                        className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white disabled:opacity-40"
                     >
                        {busy === 'composer' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        {composer === 'note' ? 'Save note' : notify ? 'Send & email customer' : 'Send to customer page'}
                     </button>
                     <label className="mt-3 flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-muted/60 px-3 py-2.5 text-sm">
                        <span>
                           <span className="flex items-center gap-1.5 font-semibold">
                              <Mail className="h-4 w-4" /> Email the customer
                           </span>
                           <span className="block text-xs text-muted-foreground">On status changes and messages</span>
                        </span>
                        <button
                           type="button"
                           role="switch"
                           aria-checked={notify}
                           onClick={() => setNotify((n) => !n)}
                           className={cn('relative h-6 w-11 shrink-0 rounded-full transition', notify ? 'bg-emerald-500' : 'bg-zinc-300')}
                        >
                           <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', notify ? 'left-[22px]' : 'left-0.5')} />
                        </button>
                     </label>
                  </div>
                  <ol className="max-h-[520px] space-y-4 overflow-y-auto border-t px-5 py-5">
                     {s.timeline
                        .slice()
                        .reverse()
                        .map((t) => (
                           <li key={t.id} className="flex gap-3">
                              <span
                                 className={cn(
                                    'mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full',
                                    t.kind === 'email' ? (t.email?.ok ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700') : t.kind === 'note' ? 'bg-amber-100 text-amber-700' : t.by === 'customer' ? 'bg-ink text-white' : t.by === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted'
                                 )}
                              >
                                 {t.kind === 'email' ? <Mail className="h-3.5 w-3.5" /> : t.kind === 'note' ? <Lock className="h-3.5 w-3.5" /> : t.by === 'customer' ? <span className="text-[10px] font-bold">{c.name[0]}</span> : <Clock className="h-3.5 w-3.5" />}
                              </span>
                              <div className="min-w-0 flex-1 text-sm">
                                 <p className="font-semibold">
                                    {t.kind === 'note'
                                       ? 'Internal note'
                                       : t.kind === 'message'
                                         ? 'Message to customer'
                                         : t.kind === 'customer_message'
                                           ? 'Customer replied'
                                           : t.kind === 'revision'
                                             ? 'Customer sent revised artwork'
                                             : t.kind === 'status' && t.status
                                               ? STATUS_META[t.status].label
                                               : t.text}
                                 </p>
                                 {t.kind === 'email' && t.email ? (
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                       <span className="block truncate">“{t.email.subject}”</span>
                                       <span className="block truncate">to {t.email.to}</span>
                                       <span
                                          className={cn(
                                             'mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold',
                                             !t.email.ok ? 'bg-red-50 text-red-700' : t.email.via === 'preview' ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-700'
                                          )}
                                          title={t.email.error}
                                       >
                                          {!t.email.ok ? `Failed${t.email.error ? ` · ${t.email.error.slice(0, 60)}` : ''}` : t.email.via === 'preview' ? 'Preview only (no email provider)' : `Sent via ${t.email.via === 'resend' ? 'Resend' : 'SMTP'}`}
                                       </span>
                                    </p>
                                 ) : null}
                                 {t.text && t.kind !== 'created' && t.kind !== 'status' && t.kind !== 'email' ? (
                                    <p className={cn('mt-1 whitespace-pre-line rounded-xl px-3 py-2', t.kind === 'note' ? 'bg-amber-50' : 'bg-muted')}>{t.text}</p>
                                 ) : null}
                                 {t.fileIds?.length && t.kind === 'revision' ? (
                                    <button type="button" onClick={() => setSelected(t.fileIds![0])} className="mt-1 text-xs font-semibold text-primary hover:underline">
                                       View revised file →
                                    </button>
                                 ) : null}
                                 <p className="mt-1 text-xs text-muted-foreground">{when(t.at)}</p>
                              </div>
                           </li>
                        ))}
                  </ol>
               </section>
            </aside>
         </div>

         <Dialog open={changesOpen} onOpenChange={setChangesOpen}>
            <DialogContent className="max-w-lg rounded-3xl">
               <DialogTitle className="font-display text-2xl font-bold">Request changes</DialogTitle>
               <p className="text-sm text-muted-foreground">
                  The customer sees this on their design page and can upload a revised file straight back to you.
               </p>
               <div className="flex flex-wrap gap-2">
                  {['Please send a higher-resolution file (300 dpi).', 'Please add 3 mm bleed on all sides.', 'Please convert all fonts to outlines.', 'Please send a vector file (PDF, AI or SVG).'].map((t) => (
                     <button key={t} type="button" onClick={() => setChangesText((v) => (v ? `${v}\n${t}` : t))} className="rounded-full border px-3 py-1 text-xs hover:border-ink">
                        + {t.replace('Please ', '').replace(/\.$/, '')}
                     </button>
                  ))}
               </div>
               <textarea
                  value={changesText}
                  onChange={(e) => setChangesText(e.target.value)}
                  rows={5}
                  autoFocus
                  placeholder="What should the customer change?"
                  className="w-full rounded-2xl border border-input p-3 text-sm outline-none focus:border-ink focus:ring-4 focus:ring-ink/5"
               />
               <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setChangesOpen(false)} className="h-11 rounded-full border px-5 text-sm font-semibold">
                     Cancel
                  </button>
                  <button
                     type="button"
                     disabled={!changesText.trim() || Boolean(busy)}
                     onClick={async () => {
                        await setStatus('changes_requested', changesText.trim())
                        setChangesOpen(false)
                        setChangesText('')
                     }}
                     className="inline-flex h-11 items-center gap-2 rounded-full bg-rose-600 px-5 text-sm font-semibold text-white disabled:opacity-50"
                  >
                     {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Undo2 className="h-4 w-4" />} Send request
                  </button>
               </div>
            </DialogContent>
         </Dialog>
      </div>
   )
}
