/**
 * Design Studio — shared types for customer design submissions.
 * Used by the API routes, the admin dashboard and the customer review page.
 */

export const SUBMISSION_STATUSES = [
   'new',
   'in_review',
   'changes_requested',
   'approved',
   'in_production',
   'completed',
   'archived',
] as const

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number]

export const STATUS_META: Record<
   SubmissionStatus,
   { label: string; customerLabel: string; tone: string; dot: string; description: string }
> = {
   new: {
      label: 'New',
      customerLabel: 'Received',
      tone: 'bg-sky-50 text-sky-700 ring-sky-200',
      dot: 'bg-sky-500',
      description: 'Just submitted — not reviewed yet.',
   },
   in_review: {
      label: 'In review',
      customerLabel: 'In review',
      tone: 'bg-amber-50 text-amber-800 ring-amber-200',
      dot: 'bg-amber-500',
      description: 'A designer is checking the artwork.',
   },
   changes_requested: {
      label: 'Changes requested',
      customerLabel: 'Action needed',
      tone: 'bg-rose-50 text-rose-700 ring-rose-200',
      dot: 'bg-rose-500',
      description: 'Waiting for the customer to send a revised file.',
   },
   approved: {
      label: 'Approved',
      customerLabel: 'Approved',
      tone: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
      dot: 'bg-emerald-500',
      description: 'Artwork approved and ready for production.',
   },
   in_production: {
      label: 'In production',
      customerLabel: 'In production',
      tone: 'bg-violet-50 text-violet-700 ring-violet-200',
      dot: 'bg-violet-500',
      description: 'Being printed / fabricated.',
   },
   completed: {
      label: 'Completed',
      customerLabel: 'Completed',
      tone: 'bg-zinc-100 text-zinc-700 ring-zinc-200',
      dot: 'bg-zinc-500',
      description: 'Delivered or installed.',
   },
   archived: {
      label: 'Archived',
      customerLabel: 'Closed',
      tone: 'bg-zinc-50 text-zinc-500 ring-zinc-200',
      dot: 'bg-zinc-400',
      description: 'Hidden from the active inbox.',
   },
}

/** Steps shown to the customer on their review page. */
export const CUSTOMER_STEPS: SubmissionStatus[] = ['new', 'in_review', 'approved', 'in_production', 'completed']

export type ArtworkMode = 'upload' | 'design' | 'later'

export type StoredFile = {
   id: string
   name: string
   size: number
   type: string
   ext: string
   /** Client-generated web preview exists (images, SVG) */
   hasPreview: boolean
   width?: number
   height?: number
   uploadedAt: string
   /** Secret that lets the uploader (customer) view the file */
   token: string
}

export type SubmissionItem = {
   productKey: string
   productName: string
   productHref: string
   categoryName: string
   departmentName: string
   qty: number
   unitLabel: string
   selections: Record<string, string>
   artwork: {
      mode: ArtworkMode
      fileIds: string[]
      brief?: string
   }
}

export type Customer = {
   name: string
   email: string
   phone?: string
   company?: string
   address?: string
   city?: string
   country?: string
   notes?: string
}

export type TimelineEntry = {
   id: string
   at: string
   kind: 'status' | 'note' | 'message' | 'customer_message' | 'revision' | 'created' | 'email'
   /** 'admin' | 'customer' | 'system' */
   by: 'admin' | 'customer' | 'system'
   text?: string
   status?: SubmissionStatus
   fileIds?: string[]
   /** kind === 'email': delivery result */
   email?: { to: string; subject: string; ok: boolean; via: 'resend' | 'smtp' | 'preview'; error?: string }
}

export type Submission = {
   id: string
   reference: string
   createdAt: string
   updatedAt: string
   status: SubmissionStatus
   source: 'checkout' | 'quote'
   customer: Customer
   items: SubmissionItem[]
   /** Files attached to the whole request (quote form) */
   attachments: string[]
   /** Free-text project details (quote form) */
   details?: string
   files: Record<string, StoredFile>
   timeline: TimelineEntry[]
   /** Secret for the customer's private review link */
   accessToken: string
   /** Admin has opened it since the last customer activity */
   seenByAdmin: boolean
}

/** Lightweight row kept in the index for fast listing. */
export type SubmissionSummary = Pick<
   Submission,
   'id' | 'reference' | 'createdAt' | 'updatedAt' | 'status' | 'source' | 'seenByAdmin'
> & {
   /** Customer replied / sent a revision since the admin last looked */
   needsAttention: boolean
   customerName: string
   customerEmail: string
   company?: string
   productNames: string[]
   itemCount: number
   fileCount: number
   /** First previewable file, for thumbnails */
   coverFileId?: string
}

export const ALLOWED_EXTENSIONS = ['pdf', 'ai', 'eps', 'svg', 'psd', 'png', 'jpg', 'jpeg', 'webp', 'tif', 'tiff', 'zip'] as const
export const PREVIEWABLE_IMAGE = ['png', 'jpg', 'jpeg', 'webp', 'svg'] as const
export const MAX_UPLOAD_MB = 50
