import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Fragment } from 'react'

const TOKEN = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g

/** Inline markup for catalog and blog copy: [text](/path) links and **bold**. Everything else is plain text. */
export function RichText({ text, linkClassName }: { text: string; linkClassName?: string }) {
   return (
      <>
         {text.split(TOKEN).map((part, i) => {
            const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
            if (link) {
               const external = /^https?:\/\//.test(link[2])
               return external ? (
                  <a key={i} href={link[2]} target="_blank" rel="noopener" className={cn('font-medium underline underline-offset-2', linkClassName)}>
                     {link[1]}
                  </a>
               ) : (
                  <Link key={i} href={link[2]} className={cn('font-medium underline underline-offset-2', linkClassName)}>
                     {link[1]}
                  </Link>
               )
            }
            const bold = part.match(/^\*\*([^*]+)\*\*$/)
            if (bold) return <strong key={i}>{bold[1]}</strong>
            return <Fragment key={i}>{part}</Fragment>
         })}
      </>
   )
}
