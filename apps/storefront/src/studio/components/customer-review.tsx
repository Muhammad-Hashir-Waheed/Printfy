'use client'

import { getProductByKey } from '@/catalog'
import { CatalogImage } from '@/components/store/catalog-image'
import config from '@/config/site'
import { units } from '@/lib/money'
import { cn } from '@/lib/utils'
import type { UploadedDesign } from '@/studio/client/upload'
import { formatBytes } from '@/studio/client/upload'
import type { CustomerView } from '@/studio/server/submissions'
import { CUSTOMER_STEPS, STATUS_META, type SubmissionStatus } from '@/studio/types'
import { AlertTriangle, Check, Clock, Download, FileText, Loader2, MessageCircle, PenTool, Send, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import { ArtworkUploader } from './artwork-uploader'
import { DesignMockup } from './design-mockup'

const when = (iso: string) =>
   new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

function Tracker({ status }: { status: SubmissionStatus }) {
   const effective = status === 'changes_requested' ? 'in_review' : status === 'archived' ? 'completed' : status
   const current = CUSTOMER_STEPS.indexOf(effective)
   return (
      <ol className="grid grid-cols-5 gap-2">
         {CUSTOMER_STEPS.map((step, i) => {
            const done = i < current || status === 'completed'
            const active = i === current && status !== 'completed'
            return (
               <li key={step} className="flex flex-col items-center text-center">
                  <span className="relative flex w-full items-center">
                     <span className={cn('h-1 flex-1 rounded-full', i === 0 ? 'opacity-0' : done || active ? 'bg-emerald-500' : 'bg-muted')} />
                     <span
                        className={cn(
                           'relative grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold transition',
                           done && 'bg-emerald-500 text-white',
                           active && (status === 'changes_requested' ? 'bg-rose-500 text-white' : 'bg-ink text-white'),
                           !done && !active && 'bg-muted text-muted-foreground'
                        )}
                     >
                        {active ? <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-20" /> : null}
                        {done ? <Check className="h-4 w-4" /> : i + 1}
                     </span>
                     <span className={cn('h-1 flex-1 rounded-full', i === CUSTOMER_STEPS.length - 1 ? 'opacity-0' : done ? 'bg-emerald-500' : 'bg-muted')} />
                  </span>
                  <span className={cn('mt-2 text-[11px] font-semibold leading-tight sm:text-xs', active || done ? 'text-foreground' : 'text-muted-foreground')}>
                     {active && status === 'changes_requested' ? 'Action needed' : STATUS_META[step].customerLabel}
                  </span>
               </li>
            )
         })}
      </ol>
   )
}

export function CustomerReview({ initial, token }: { initial: CustomerView; token: string }) {
   const [data, setData] = useState(initial)
   const [message, setMessage] = useState('')
   const [revisions, setRevisions] = useState<UploadedDesign[]>([])
   const [uploading, setUploading] = useState(false)
   const [sending, setSending] = useState(false)
   const [uploaderKey, setUploaderKey] = useState(0)

   const fileUrl = (fileId: string, part: 'preview' | 'original', download = false) =>
      `/api/files/${fileId}?part=${part}&s=${data.id}&a=${encodeURIComponent(token)}${download ? '&download=1' : ''}`

   const lastStudioMessage = useMemo(
      () => [...data.timeline].reverse().find((t) => t.kind === 'message' && t.by === 'admin'),
      [data.timeline]
   )
   const revisionFiles = useMemo(
      () => data.timeline.filter((t) => t.kind === 'revision').flatMap((t) => t.fileIds ?? []),
      [data.timeline]
   )
   const closed = data.status === 'completed' || data.status === 'archived'

   async function send() {
      if (!message.trim() && !revisions.length) return
      setSending(true)
      try {
         const res = await fetch(`/api/design-review/${data.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, message: message.trim() || undefined, files: revisions.map((r) => ({ id: r.id, token: r.token })) }),
         })
         const json = await res.json()
         if (!res.ok) throw new Error(json.error || 'Could not send')
         setData(json)
         setMessage('')
         setRevisions([])
         setUploaderKey((k) => k + 1)
         toast.success(revisions.length ? 'Revised artwork sent — we’re on it!' : 'Message sent')
      } catch (error) {
         toast.error(error instanceof Error ? error.message : 'Could not send')
      } finally {
         setSending(false)
      }
   }

   const meta = STATUS_META[data.status]

   const FileBlock = ({ fileId, product }: { fileId: string; product?: ReturnType<typeof getProductByKey> }) => {
      const f = data.files[fileId]
      if (!f) return null
      return (
         <div className="space-y-3">
            <DesignMockup
               imageUrl={f.hasPreview ? fileUrl(f.id, 'preview') : null}
               pdfUrl={f.ext === 'pdf' ? fileUrl(f.id, 'original') : null}
               fileName={f.name}
               ext={f.ext}
               productImage={product?.image}
               productName={product?.name}
               accent={product?.accent}
               dark={product?.dark}
               compact
            />
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
               <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4 shrink-0" />
                  <span className="truncate">{f.name}</span>
                  <span className="shrink-0">· {formatBytes(f.size)}</span>
                  {revisionFiles.includes(f.id) ? (
                     <span className="shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-700">Revision</span>
                  ) : null}
               </span>
               <a href={fileUrl(f.id, 'original', true)} className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">
                  <Download className="h-4 w-4" /> Download
               </a>
            </div>
         </div>
      )
   }

   return (
      <div className="page-shell pb-16 pt-8 sm:pt-12">
         {/* Header */}
         <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-8 text-white sm:px-10 sm:py-10">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
               <div>
                  <p className="eyebrow flex items-center gap-2 text-white/60">
                     <Sparkles className="h-3.5 w-3.5 text-coral" /> Your design · {data.reference}
                  </p>
                  <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                     Hi {data.customer.name.split(' ')[0]} 👋
                  </h1>
                  <p className="mt-2 max-w-xl text-white/70">
                     This private page shows your artwork, where it is in our process and any messages from our designers.
                  </p>
               </div>
               <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs text-white/60">Current status</p>
                  <p className="mt-1 flex items-center gap-2 text-lg font-bold">
                     <span className={cn('h-2.5 w-2.5 rounded-full', meta.dot)} /> {meta.customerLabel}
                  </p>
                  <p className="mt-0.5 text-xs text-white/60">Updated {when(data.updatedAt)}</p>
               </div>
            </div>
            <div className="relative mt-8 rounded-2xl bg-white p-4 text-ink sm:p-5">
               <Tracker status={data.status} />
            </div>
         </div>

         {data.status === 'changes_requested' ? (
            <div className="mt-6 flex gap-4 rounded-3xl border border-rose-200 bg-rose-50 p-5 sm:p-6">
               <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-rose-600" />
               <div>
                  <p className="font-display text-lg font-bold text-rose-900">Our designer needs a small change</p>
                  {lastStudioMessage?.text ? <p className="mt-1 whitespace-pre-line text-rose-900/80">“{lastStudioMessage.text}”</p> : null}
                  <a href="#reply" className="mt-3 inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white">
                     Upload a revised file
                  </a>
               </div>
            </div>
         ) : null}

         <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
            {/* Items + artwork */}
            <div className="space-y-6">
               {data.items.map((item, i) => {
                  const product = getProductByKey(item.productKey)
                  const files = item.artwork.fileIds
                  return (
                     <section key={i} className="overflow-hidden rounded-3xl border bg-white">
                        <div className="flex items-center gap-4 border-b p-4 sm:p-5">
                           <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-muted">
                              <CatalogImage image={product?.image ?? null} label={item.productName} accent={product?.accent} sizes="64px" />
                           </span>
                           <div className="min-w-0 flex-1">
                              <p className="text-xs text-muted-foreground">{item.categoryName}</p>
                              <Link href={item.productHref} className="font-display text-lg font-bold hover:text-primary">
                                 {item.productName}
                              </Link>
                              <p className="text-sm text-muted-foreground">{units(item.qty, item.unitLabel)}</p>
                           </div>
                        </div>
                        <div className="p-4 sm:p-5">
                           <ul className="mb-4 flex flex-wrap gap-1.5">
                              {Object.values(item.selections).map((v) => (
                                 <li key={v} className="rounded-full bg-muted px-2.5 py-1 text-xs">
                                    {v}
                                 </li>
                              ))}
                           </ul>
                           {files.length ? (
                              <div className="space-y-6">
                                 {files.map((fid) => (
                                    <FileBlock key={fid} fileId={fid} product={product} />
                                 ))}
                              </div>
                           ) : item.artwork.mode === 'design' ? (
                              <p className="flex items-start gap-2 rounded-2xl bg-muted p-4 text-sm">
                                 <PenTool className="mt-0.5 h-4 w-4 shrink-0" />
                                 <span>
                                    <span className="font-semibold">Our designers will create your artwork.</span>
                                    {item.artwork.brief ? <span className="mt-1 block text-muted-foreground">Your brief: “{item.artwork.brief}”</span> : null}
                                 </span>
                              </p>
                           ) : (
                              <p className="flex items-center gap-2 rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
                                 <Clock className="h-4 w-4" /> Artwork to follow — you can upload it below.
                              </p>
                           )}
                        </div>
                     </section>
                  )
               })}

               {data.attachments.length || revisionFiles.some((f) => !data.items.some((i) => i.artwork.fileIds.includes(f))) ? (
                  <section className="rounded-3xl border bg-white p-4 sm:p-5">
                     <h2 className="mb-4 font-display text-lg font-bold">Your files</h2>
                     <div className="grid gap-6 md:grid-cols-2">
                        {[...data.attachments, ...revisionFiles.filter((f) => !data.attachments.includes(f))].map((fid) => (
                           <FileBlock key={fid} fileId={fid} />
                        ))}
                     </div>
                  </section>
               ) : null}

               {data.details ? (
                  <section className="rounded-3xl border bg-white p-5">
                     <h2 className="font-display text-lg font-bold">Project details</h2>
                     <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{data.details}</p>
                  </section>
               ) : null}
            </div>

            {/* Conversation */}
            <aside className="space-y-4 lg:sticky lg:top-[150px]">
               <section className="rounded-3xl border bg-white">
                  <h2 className="flex items-center gap-2 border-b px-5 py-4 font-display text-lg font-bold">
                     <MessageCircle className="h-5 w-5" /> Updates
                  </h2>
                  <ol className="max-h-[420px] space-y-4 overflow-y-auto px-5 py-4">
                     {data.timeline
                        .slice()
                        .reverse()
                        .map((t) => (
                           <li key={t.id} className={cn('flex gap-3', t.by === 'customer' && 'flex-row-reverse text-right')}>
                              <span
                                 className={cn(
                                    'mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold',
                                    t.by === 'admin' ? 'bg-primary text-white' : t.by === 'customer' ? 'bg-ink text-white' : 'bg-muted'
                                 )}
                              >
                                 {t.by === 'admin' ? 'JA' : t.by === 'customer' ? data.customer.name[0]?.toUpperCase() : <Clock className="h-3.5 w-3.5" />}
                              </span>
                              <div className={cn('min-w-0 max-w-[85%]', t.by === 'customer' && 'items-end')}>
                                 {t.kind === 'status' ? (
                                    <p className="text-sm font-semibold">
                                       {t.status ? STATUS_META[t.status].customerLabel : 'Status updated'}
                                       {t.text && t.by === 'system' ? <span className="font-normal text-muted-foreground"> · {t.text}</span> : null}
                                    </p>
                                 ) : t.kind === 'created' ? (
                                    <p className="text-sm font-semibold">{t.text}</p>
                                 ) : (
                                    <p
                                       className={cn(
                                          'inline-block whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-left text-sm',
                                          t.by === 'admin' ? 'bg-primary/10 text-foreground' : 'bg-muted'
                                       )}
                                    >
                                       {t.kind === 'revision' ? <span className="mb-1 block text-xs font-semibold">📎 Revised artwork sent</span> : null}
                                       {t.text}
                                    </p>
                                 )}
                                 <p className="mt-1 text-[11px] text-muted-foreground">{when(t.at)}</p>
                              </div>
                           </li>
                        ))}
                  </ol>
               </section>

               {!closed ? (
                  <section id="reply" className="scroll-mt-40 rounded-3xl border bg-white p-5">
                     <h2 className="font-display text-lg font-bold">
                        {data.status === 'changes_requested' ? 'Send your revised file' : 'Message the studio'}
                     </h2>
                     <p className="mt-1 text-sm text-muted-foreground">Questions, changes or a new version — we&apos;ll reply by email.</p>
                     <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        maxLength={2000}
                        placeholder="Type a message…"
                        className="mt-3 w-full rounded-2xl border border-input bg-white p-3 text-sm outline-none focus:border-ink focus:ring-4 focus:ring-ink/5"
                     />
                     <div className="mt-3">
                        <ArtworkUploader key={uploaderKey} multiple compact value={revisions} onChange={setRevisions} onBusyChange={setUploading} />
                     </div>
                     <button
                        type="button"
                        onClick={send}
                        disabled={sending || uploading || (!message.trim() && !revisions.length)}
                        className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink font-semibold text-white transition hover:bg-ink/90 disabled:opacity-40"
                     >
                        {sending || uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        {uploading ? 'Uploading…' : revisions.length ? 'Send revised artwork' : 'Send message'}
                     </button>
                  </section>
               ) : null}

               <p className="px-2 text-center text-xs text-muted-foreground">
                  Need help? Email <a href={`mailto:${config.email}`} className="font-medium underline">{config.email}</a> with reference{' '}
                  {data.reference}.
               </p>
            </aside>
         </div>
      </div>
   )
}
