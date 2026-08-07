import { Separator } from '@/components/native/separator'
import config from '@/config/site'
import { GithubIcon, InstagramIcon, TwitterIcon } from 'lucide-react'
import Link from 'next/link'

const data = [
   {
      label: 'SHOP',
      links: [
         {
            label: 'All Packaging',
            url: '/products',
         },
         {
            label: 'Food Packaging',
            url: '/products?productType=food%20packaging',
         },
         {
            label: 'LED & Neon Signs',
            url: '/products?productType=led%20%26%20neon%20signs',
         },
         {
            label: 'Shipping Packaging',
            url: '/products?productType=shipping%20packaging',
         },
      ],
   },
   {
      label: 'LEGAL',
      links: [
         {
            label: 'Privacy Policy',
            url: '/privacy',
         },
         {
            label: 'Terms & Conditions',
            url: '/terms',
         },
      ],
   },
   {
      label: 'RESOURCES',
      links: [
         {
            label: 'Blog',
            url: '/blog',
         },
         {
            label: 'About',
            url: '/about',
         },
         {
            label: 'Contact',
            url: '/contact',
         },
      ],
   },
   {
      label: 'SUPPORT',
      links: [
         {
            label: 'Telegram',
            url: '/telegram',
         },
         {
            label: 'FAQ',
            url: '/faq',
         },
      ],
   },
]

export default function Footer() {
   return (
      <footer className="w-full">
         <Separator className="my-12" />
         <div className="flex flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:justify-between lg:px-12">
            <Trademark />
            <Links />
         </div>
         <Separator className="mt-8 mb-6" />
         <Socials />
      </footer>
   )
}

function Links() {
   return (
      <div className="grid grid-cols-2 justify-evenly gap-8 text-left sm:grid-cols-4 sm:gap-6 lg:text-end">
         {data.map(({ label, links }) => (
            <div key={label}>
               <h2 className="mb-3 text-sm uppercase">{label}</h2>
               <ul className="block space-y-1">
                  {links.map(({ label, url }) => (
                     <li key={label}>
                        <Link
                           href={url}
                           className="text-sm transition duration-300 text-muted-foreground hover:text-foreground"
                        >
                           {label}
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
      <div className="mb-6 hidden md:mb-0 md:block">
         <span className="flex flex-col">
            <h2 className="whitespace-nowrap text-sm font-semibold uppercase">
               {config.name}
            </h2>
            <span className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
               © {new Date().getFullYear()} {config.name}™ . All Rights
               Reserved.
            </span>
         </span>
      </div>
   )
}

function Socials() {
   return (
      <div className="mb-6 flex justify-center space-x-6 text-muted-foreground">
         <a
            href="https://instagram.com/sesto_dev"
            target="_blank"
            rel="noreferrer"
         >
            <InstagramIcon className="h-4" />
            <span className="sr-only">Instagram page</span>
         </a>
         <a
            href="https://twitter.com/sesto_dev"
            target="_blank"
            rel="noreferrer"
         >
            <TwitterIcon className="h-4" />
            <span className="sr-only">Twitter page</span>
         </a>
         <a
            href="https://github.com/sesto-dev"
            target="_blank"
            rel="noreferrer"
         >
            <GithubIcon className="h-4" />
            <span className="sr-only">GitHub account</span>
         </a>
      </div>
   )
}
