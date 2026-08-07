import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SHOWCASE_TILES } from '@/lib/catalog-navigation'
import Link from 'next/link'

const PRIMARY_LINKS = [
   { label: 'All packaging', href: '/products' },
   { label: 'Shop packaging', href: '/products' },
   { label: 'Blog', href: '/blog' },
   { label: 'Contact us', href: '/contact' },
]

export function NotFoundContent({
   title = 'We could not find that page',
   description = 'The link may be outdated or the product may have moved. Here are some places to pick up where you left off.',
}: {
   title?: string
   description?: string
}) {
   return (
      <div className="mx-auto max-w-3xl py-16">
         <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
               404
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
               {description}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
               <Button asChild className="rounded-2xl">
                  <Link href="/">Go home</Link>
               </Button>
               {PRIMARY_LINKS.map((link) => (
                  <Button
                     key={link.href}
                     asChild
                     variant="outline"
                     className="rounded-2xl"
                  >
                     <Link href={link.href}>{link.label}</Link>
                  </Button>
               ))}
            </div>
         </div>

         <Card className="mt-10 rounded-2xl border shadow-sm">
            <CardContent className="p-6">
               <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Popular categories
               </h2>
               <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {SHOWCASE_TILES.map((tile) => (
                     <Link
                        key={tile.href}
                        href={tile.href}
                        className="rounded-xl border px-3 py-2 text-sm transition duration-200 hover:bg-accent hover:text-accent-foreground"
                     >
                        {tile.title}
                     </Link>
                  ))}
               </div>
            </CardContent>
         </Card>
      </div>
   )
}
