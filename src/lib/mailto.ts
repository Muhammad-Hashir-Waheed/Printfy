/** Builds a mailto: link. Bodies are kept short enough for common mail clients. */
export function mailto(to: string, subject: string, body: string) {
   const max = 1800
   const trimmed = body.length > max ? `${body.slice(0, max)}\n…(full details copied to clipboard)` : body
   return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(trimmed)}`
}

export async function copyText(text: string) {
   try {
      await navigator.clipboard.writeText(text)
      return true
   } catch {
      return false
   }
}

export function makeReference(prefix: string) {
   const d = new Date()
   const date = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
   const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
   return `${prefix}-${date}-${rand}`
}
