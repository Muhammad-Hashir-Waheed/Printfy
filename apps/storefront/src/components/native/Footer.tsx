import { Separator } from '@/components/native/separator'
import config from '@/config/site'
import { GithubIcon, InstagramIcon, TwitterIcon } from 'lucide-react'
import Link from 'next/link'

const data = [
   {
      label: 'Shop',
      links: [
         { label: 'All products', url: '/products' },
         { label: 'Cosmetics', url: '/products?productType=cosmetics' },
         { label: 'Hotel & Food', url: '/products?productType=hotel%20%26%20food' },
         { label: 'Perfume', url: '/products?productType=perfume%20%26%20makeup%20boxes' },
         { label: 'Rigid Boxes', url: '/products?productType=rigid%20luxury%20boxes' },
         { label: 'Corrugated', url: '/products?productType=corrugated%20boxes' },
         { label: 'Branding', url: '/products?productType=branding%20%26%203d%20boards' },
      ],
   },
   {
      label: 'Legal',
      links: [
         { label: 'Privacy Policy', url: '/privacy' },
         { label: 'Terms & Conditions', url: '/terms' },
      ],
   },
   {
      label: 'Resources',
      links: [
         { label: 'Blog', url: '/blog' },
         { label: 'About', url: '/about' },
         { label: 'Contact', url: '/contact' },
      ],
   },
   {
      label: 'Support',
      links: [
         { label: 'Telegram', url: '/telegram' },
         { label: 'FAQ', url: '/faq' },
      ],
   },
]

export default function Footer() {
   return (
      <footer className="w-full border-t">
         <div className="page-shell grid gap-10 py-12 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)_auto] md:items-start">
            <Trademark />
            <Links />
            <Socials />
         </div>
         <Separator />
         <p className="page-shell py-6 typo-body text-muted-foreground">
            © {new Date().getFullYear()} {config.name}. All rights reserved.
         </p>
      </footer>
   )
}

function Links() {
   return (
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
         {data.map(({ label, links }) => (
            <div key={label}>
               <h2 className="typo-eyebrow mb-3 text-muted-foreground">{label}</h2>
               <ul className="space-y-1.5">
                  {links.map(({ label: linkLabel, url }) => (
                     <li key={linkLabel}>
                        <Link
                           href={url}
                           className="typo-body text-muted-foreground transition duration-300 hover:text-foreground"
                        >
                           {linkLabel}
                        </Link>
                     </li>
                  ))}
               </ul>
            </div>
         ))}
      </div>
   )
}

function Trademark() {
   return (
      <div>
         <h2 className="typo-card-title">{config.name}</h2>
         <p className="mt-2 max-w-[16rem] typo-body text-muted-foreground">
            Custom print packaging for cosmetics, hotels, perfume, luxury boxes, corrugated &amp;
            3D branding.
         </p>
      </div>
   )
}

function Socials() {
   return (
      <div className="flex gap-4 text-muted-foreground md:justify-end">
         <a href="https://instagram.com/sesto_dev" target="_blank" rel="noreferrer">
            <InstagramIcon className="h-4 w-4" />
            <span className="sr-only">Instagram page</span>
         </a>
         <a href="https://twitter.com/sesto_dev" target="_blank" rel="noreferrer">
            <TwitterIcon className="h-4 w-4" />
            <span className="sr-only">Twitter page</span>
         </a>
         <a href="https://github.com/sesto-dev" target="_blank" rel="noreferrer">
            <GithubIcon className="h-4 w-4" />
            <span className="sr-only">GitHub account</span>
         </a>
      </div>
   )
}
