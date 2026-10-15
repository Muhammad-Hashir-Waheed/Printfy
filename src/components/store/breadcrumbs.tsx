import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export type Crumb = { href?: string; label: string }

export function Breadcrumbs({ items, inverted }: { items: Crumb[]; inverted?: boolean }) {
   const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, i) => ({
         '@type': 'ListItem',
         position: i + 1,
         name: item.label,
         item: item.href,
      })),
   }

   return (
      <nav aria-label="Breadcrumb" className="no-scrollbar overflow-x-auto">
         <ol
            className={`flex items-center gap-1.5 whitespace-nowrap text-[13px] ${inverted ? 'text-white/60' : 'text-muted-foreground'}`}
         >
            <li>
               <Link href="/" className={inverted ? 'hover:text-white' : 'hover:text-foreground'}>
                  Home
               </Link>
            </li>
            {items.map((item, i) => (
               <li key={i} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                  {item.href && i < items.length - 1 ? (
                     <Link href={item.href} className={inverted ? 'hover:text-white' : 'hover:text-foreground'}>
                        {item.label}
                     </Link>
                  ) : (
                     <span aria-current="page" className={inverted ? 'text-white' : 'text-foreground'}>
                        {item.label}
                     </span>
                  )}
               </li>
            ))}
         </ol>
         <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </nav>
   )
}
