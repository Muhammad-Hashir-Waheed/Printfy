import { cn } from '@/lib/utils'
import { STATUS_META, type SubmissionStatus } from '@/studio/types'
import { FileText } from 'lucide-react'

export function StatusBadge({ status, className }: { status: SubmissionStatus; className?: string }) {
   const meta = STATUS_META[status]
   return (
      <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset', meta.tone, className)}>
         <span className={cn('h-1.5 w-1.5 rounded-full', meta.dot)} />
         {meta.label}
      </span>
   )
}

/** Admin thumbnail of a design preview (admin cookie authorises /api/files). */
export function DesignThumb({ fileId, className, label }: { fileId?: string; className?: string; label?: string }) {
   return (
      <span
         className={cn(
            'relative grid shrink-0 place-items-center overflow-hidden rounded-xl bg-[repeating-conic-gradient(#efefef_0_25%,#fff_0_50%)] bg-[length:12px_12px] ring-1 ring-black/5',
            className
         )}
      >
         {fileId ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/api/files/${fileId}?part=preview`} alt={label ?? ''} loading="lazy" className="h-full w-full object-contain" />
         ) : (
            <FileText className="h-5 w-5 text-muted-foreground" />
         )}
      </span>
   )
}

export function timeAgo(iso: string) {
   const s = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000))
   if (s < 60) return 'just now'
   const m = Math.round(s / 60)
   if (m < 60) return `${m}m ago`
   const h = Math.round(m / 60)
   if (h < 24) return `${h}h ago`
   const d = Math.round(h / 24)
   if (d < 30) return `${d}d ago`
   return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function initials(name: string) {
   return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('')
}

const AVATAR_COLORS = ['#D42F25', '#2D5BFF', '#2F8F5B', '#7A4CFF', '#E89A0C', '#0E9FC4', '#C2417B', '#1E4D8C']
export function avatarColor(seed: string) {
   let h = 0
   for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0
   return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

export function Avatar({ name, email, className }: { name: string; email: string; className?: string }) {
   return (
      <span
         className={cn('grid shrink-0 place-items-center rounded-full font-bold text-white', className ?? 'h-9 w-9 text-xs')}
         style={{ backgroundColor: avatarColor(email) }}
      >
         {initials(name) || '?'}
      </span>
   )
}
