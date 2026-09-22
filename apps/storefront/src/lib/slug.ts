/** Local slug helper (no external deps — safe on Vercel serverless) */
export function slugifyText(value: string) {
   return value
      .trim()
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
}
