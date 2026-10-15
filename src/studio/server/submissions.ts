import type { Submission, SubmissionStatus, SubmissionSummary, TimelineEntry } from '@/studio/types'

import { requireStorage } from './storage'
import { newId, safeEqual } from './util'

/**
 *   submissions/{id}.json     → Submission
 *   submissions/_index.json   → SubmissionSummary[] (newest first) for fast listing
 */

const INDEX_KEY = 'submissions/_index.json'
const key = (id: string) => `submissions/${id}.json`
const ID_RE = /^[0-9a-f-]{36}$/

/* Writes are serialised per server instance so the index never loses an update. */
let queue: Promise<unknown> = Promise.resolve()
function serial<T>(fn: () => Promise<T>): Promise<T> {
   const run = queue.then(fn, fn)
   queue = run.catch(() => undefined)
   return run
}

export function summarize(s: Submission): SubmissionSummary {
   const cover = Object.values(s.files).find((f) => f.hasPreview)
   return {
      id: s.id,
      reference: s.reference,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      status: s.status,
      source: s.source,
      seenByAdmin: s.seenByAdmin,
      needsAttention: !s.seenByAdmin,
      customerName: s.customer.name,
      customerEmail: s.customer.email,
      company: s.customer.company,
      productNames: s.items.map((i) => i.productName),
      itemCount: s.items.length,
      fileCount: Object.keys(s.files).length,
      coverFileId: cover?.id,
   }
}

async function readJSON<T>(k: string): Promise<T | null> {
   const obj = await requireStorage().get(k)
   if (!obj) return null
   try {
      return JSON.parse(obj.data.toString('utf8')) as T
   } catch {
      return null
   }
}

async function rebuildIndex(): Promise<SubmissionSummary[]> {
   const storage = requireStorage()
   const keys = (await storage.list('submissions')).filter((k) => k.endsWith('.json') && !k.endsWith('_index.json'))
   const rows: SubmissionSummary[] = []
   for (const k of keys) {
      const s = await readJSON<Submission>(k)
      if (s) rows.push(summarize(s))
   }
   rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
   await storage.put(INDEX_KEY, JSON.stringify(rows), 'application/json')
   return rows
}

export async function listSubmissions(): Promise<SubmissionSummary[]> {
   return (await readJSON<SubmissionSummary[]>(INDEX_KEY)) ?? (await serial(rebuildIndex))
}

export async function getSubmission(id: string): Promise<Submission | null> {
   if (!ID_RE.test(id)) return null
   return readJSON<Submission>(key(id))
}

async function save(s: Submission) {
   const storage = requireStorage()
   await storage.put(key(s.id), JSON.stringify(s, null, 1), 'application/json')
   const index = (await readJSON<SubmissionSummary[]>(INDEX_KEY)) ?? []
   const row = summarize(s)
   const at = index.findIndex((r) => r.id === s.id)
   if (at >= 0) index[at] = row
   else index.unshift(row)
   index.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
   await storage.put(INDEX_KEY, JSON.stringify(index), 'application/json')
}

export function createSubmission(s: Submission) {
   return serial(async () => {
      await save(s)
      return s
   })
}

/** Load → mutate → save, atomically per instance. Returns null if not found. */
export function updateSubmission(id: string, mutate: (s: Submission) => void | Submission) {
   return serial(async () => {
      const current = await getSubmission(id)
      if (!current) return null
      const next: Submission = (mutate(current) as Submission | undefined) || current
      next.updatedAt = new Date().toISOString()
      await save(next)
      return next
   })
}

export function timeline(entry: Omit<TimelineEntry, 'id' | 'at'>): TimelineEntry {
   return { id: newId(), at: new Date().toISOString(), ...entry }
}

/** Customer access: correct id + secret token. */
export async function getForCustomer(id: string, token: string | null) {
   const s = await getSubmission(id)
   if (!s || !safeEqual(s.accessToken, token)) return null
   return s
}

/** What the customer is allowed to see (no internal notes, no admin-only fields). */
export function customerView(s: Submission) {
   return {
      id: s.id,
      reference: s.reference,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      status: s.status as SubmissionStatus,
      source: s.source,
      customer: { name: s.customer.name, email: s.customer.email, company: s.customer.company },
      items: s.items,
      attachments: s.attachments,
      details: s.details,
      files: Object.fromEntries(
         Object.entries(s.files).map(([id, f]) => [id, { ...f, token: undefined }])
      ),
      timeline: s.timeline.filter((t) => t.kind !== 'note' && t.kind !== 'email'),
   }
}

export type CustomerView = ReturnType<typeof customerView>
