'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
   ArrowRightIcon,
} from 'lucide-react'
import Link from 'next/link'

const productTiles = [
   {
      title: 'T-shirts',
      href: '/products?productType=t-shirts',
      image:
         'https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1200&auto=format&fit=crop',
      imageClassName: 'object-top',
   },
   {
      title: 'Bags',
      href: '/products?productType=bags',
      image:
         'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop',
      imageClassName: 'object-top',
   },
   {
      title: 'Coffee mugs',
      href: '/products?productType=drinkware',
      image:
         'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=900&auto=format&fit=crop',
   },
   {
      title: 'Embroidered shirts',
      href: '/products?productType=t-shirts',
      image:
         'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?q=80&w=900&auto=format&fit=crop',
   },
   {
      title: 'Phone cases',
      href: '/products?productType=accessories',
      image:
         'https://images.unsplash.com/photo-1601593346740-925612772716?q=80&w=900&auto=format&fit=crop',
   },
   {
      title: 'Leggings',
      href: '/products?productType=pants',
      image:
         'https://images.pexels.com/photos/4210866/pexels-photo-4210866.jpeg?auto=compress&cs=tinysrgb&w=1200',
   },
   {
      title: 'Hoodies',
      href: '/products?productType=hoodies',
      image:
         'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop',
   },
   {
      title: 'Flags',
      href: '/products?productType=accessories',
      image:
         'https://images.pexels.com/photos/4386429/pexels-photo-4386429.jpeg?auto=compress&cs=tinysrgb&w=1200',
      imageClassName: 'object-center',
   },
   {
      title: 'Pants',
      href: '/products?productType=pants',
      image:
         'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=900&auto=format&fit=crop',
   },
   {
      title: 'Sweatshirts',
      href: '/products?productType=hoodies',
      image:
         'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=900&auto=format&fit=crop',
   },
]

const integrations = [
   {
      name: 'Shopify',
      description: 'Instant sync for products, variants, and orders.',
      logo: 'https://cdn.simpleicons.org/shopify/95BF47',
      className: 'md:left-[12%] md:top-[10%]',
   },
   {
      name: 'Amazon',
      description: 'Scale catalog fulfillment with marketplace automation.',
      // Self-hosted: external CDNs / URLs containing "amazon" often fail (blockers, CDN quirks)
      logo: '/icons/amazon.svg',
      className: 'md:left-[74%] md:top-[10%]',
   },
   {
      name: 'Etsy',
      description: 'Connect handmade storefronts with production workflows.',
      logo: 'https://cdn.simpleicons.org/etsy/F1641E',
      className: 'md:left-[42%] md:top-[6%]',
   },
   {
      name: 'WooCommerce',
      description: 'WordPress-native order sync and shipping updates.',
      logo: 'https://cdn.simpleicons.org/woocommerce/96588A',
      className: 'md:left-[16%] md:top-[40%]',
   },
   {
      name: 'Wix',
      description: 'Fast setup for branded stores and custom products.',
      logo: 'https://cdn.simpleicons.org/wix/000000',
      className: 'md:left-[82%] md:top-[30%]',
   },
   {
      name: 'Squarespace',
      description: 'Premium storefront themes with POD fulfillment.',
      logo: 'https://cdn.simpleicons.org/squarespace/000000',
      className: 'md:left-[86%] md:top-[50%]',
   },
   {
      name: 'Square',
      description: 'Unified online and POS inventory operations.',
      logo: 'https://cdn.simpleicons.org/square/000000',
      className: 'md:left-[24%] md:top-[74%]',
   },
   {
      name: 'BigCommerce',
      description: 'Enterprise-grade catalog and checkout integrations.',
      logo: 'https://cdn.simpleicons.org/bigcommerce/121118',
      className: 'md:left-[80%] md:top-[74%]',
   },
   {
      name: 'Webflow',
      description: 'Visual storefront publishing with robust commerce sync.',
      logo: 'https://cdn.simpleicons.org/webflow/4353FF',
      className: 'md:left-[4%] md:top-[20%]',
   },
   {
      name: 'Stripe',
      description: 'Cross-platform listing and order orchestration.',
      logo: 'https://cdn.simpleicons.org/stripe/635BFF',
      className: 'md:left-[62%] md:top-[76%]',
   },
   {
      name: 'PayPal',
      description: 'Brand identity and catalog sync automation.',
      logo: 'https://cdn.simpleicons.org/paypal/00457C',
      className: 'md:left-[50%] md:top-[84%]',
   },
   {
      name: 'Shopware',
      description: 'Conversion-focused apps and subscriptions tooling.',
      logo: 'https://cdn.simpleicons.org/shopware/189EFF',
      className: 'md:left-[6%] md:top-[62%]',
   },
]

export function ProductShowcaseSection() {
   return (
      <section className="my-8">
         <div className="mx-auto w-full max-w-6xl px-1 sm:px-2 lg:px-0">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="col-span-1 overflow-hidden rounded-lg border-0 bg-[#072b4a] text-white shadow-sm sm:col-span-2 lg:col-span-2">
               <CardContent className="flex h-full min-h-[178px] flex-col justify-between p-6">
                  <h2 className="max-w-[320px] text-[38px] font-bold leading-[1.05] tracking-[-0.02em] md:text-[42px]">
                     Choose from 496 beautiful custom products
                  </h2>
                  <Link href="/products">
                     <Button className="mt-3 h-11 rounded-md bg-red-500 px-5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-red-600">
                        See all products
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                     </Button>
                  </Link>
               </CardContent>
            </Card>

            {productTiles.map((tile) => (
               <Link key={tile.title} href={(tile as { href?: string }).href ?? '/products'}>
                  <Card className="group overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md">
                     <CardContent className="relative h-[178px] p-0">
                        <img
                           src={tile.image}
                           alt={tile.title}
                           loading="lazy"
                           className={`h-full w-full object-cover transition duration-300 group-hover:scale-[1.02] ${tile.imageClassName ?? ''}`}
                        />
                        <span className="absolute bottom-2 left-2 rounded-sm bg-white/95 px-2 py-1 text-[11px] font-medium text-slate-900">
                           {tile.title}
                        </span>
                     </CardContent>
                  </Card>
               </Link>
            ))}
            </div>
         </div>
      </section>
   )
}

export function ProfitEstimatorSection() {
   return (
      <section className="my-10 rounded-xl bg-[#072b4a] px-4 py-10 text-white sm:px-8">
         <div className="mx-auto max-w-5xl space-y-6">
            <div className="text-center">
               <h2 className="text-3xl font-bold">Your passion really can pay</h2>
               <p className="text-white/85">See how much you could make</p>
            </div>
            <div className="grid gap-5 rounded-xl bg-white p-4 text-slate-900 md:grid-cols-2 md:p-6">
               <div className="space-y-3">
                  <p className="text-lg font-semibold">T-Shirts</p>
                  <img
                     src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=900&auto=format&fit=crop"
                     alt="Profit preview"
                     className="h-48 w-full rounded-lg object-cover"
                  />
               </div>
               <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                     <p className="text-muted-foreground">You buy for</p>
                     <p className="text-right font-medium">$9.25</p>
                     <p className="text-muted-foreground">You sell for</p>
                     <p className="text-right font-medium text-green-600">$23.55</p>
                     <p className="text-muted-foreground">Sales per day</p>
                     <p className="text-right font-medium">5</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 text-center">
                     <p className="text-sm text-muted-foreground">Your approximate annual profit</p>
                     <p className="text-3xl font-bold">$26,097.50</p>
                  </div>
                  <Button className="w-full rounded-md bg-red-500 text-white hover:bg-red-600">
                     Start selling
                  </Button>
               </div>
            </div>
         </div>
      </section>
   )
}

export function GlobalReachSection() {
   return (
      <section className="my-10 rounded-xl bg-[#01303a] px-4 py-10 text-white sm:px-8">
         <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-bold">No inventory, no upfront investment, no hassles</h2>
            <p className="mb-6 text-white/80">...just worldwide sales</p>
            <div className="relative mx-auto mb-6 max-w-4xl">
               <img
                  src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
                  alt="Worldwide map"
                  className="mx-auto max-h-[340px] w-full object-contain opacity-85"
               />
               <svg
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox="0 0 1000 420"
                  preserveAspectRatio="none"
               >
                  <defs>
                     <linearGradient id="routeGlow" x1="0%" x2="100%" y1="0%" y2="0%">
                        <stop offset="0%" stopColor="rgba(34,211,238,0.06)" />
                        <stop offset="50%" stopColor="rgba(34,211,238,0.65)" />
                        <stop offset="100%" stopColor="rgba(34,211,238,0.06)" />
                     </linearGradient>
                  </defs>
                  <path
                     d="M190 195 C 300 130, 420 120, 490 145"
                     stroke="url(#routeGlow)"
                     strokeWidth="2"
                     fill="none"
                     strokeDasharray="7 8"
                     className="animate-[route-dash_2.6s_linear_infinite]"
                  />
                  <path
                     d="M490 145 C 610 150, 700 175, 780 205"
                     stroke="url(#routeGlow)"
                     strokeWidth="2"
                     fill="none"
                     strokeDasharray="7 8"
                     className="animate-[route-dash_2.8s_linear_infinite]"
                  />
                  <path
                     d="M780 205 C 700 250, 560 290, 245 330"
                     stroke="url(#routeGlow)"
                     strokeWidth="2"
                     fill="none"
                     strokeDasharray="7 8"
                     className="animate-[route-dash_3s_linear_infinite]"
                  />
               </svg>

               <span className="absolute left-[20%] top-[43%] inline-flex h-3.5 w-3.5 animate-[glow-pulse_2.1s_ease-in-out_infinite] rounded-full bg-cyan-300 shadow-[0_0_0_10px_rgba(34,211,238,0.2)]" />
               <span className="absolute left-[48%] top-[31%] inline-flex h-3.5 w-3.5 animate-[glow-pulse_1.9s_ease-in-out_infinite] rounded-full bg-cyan-300 shadow-[0_0_0_10px_rgba(34,211,238,0.2)]" />
               <span className="absolute left-[74%] top-[47%] inline-flex h-3.5 w-3.5 animate-[glow-pulse_2.3s_ease-in-out_infinite] rounded-full bg-cyan-300 shadow-[0_0_0_10px_rgba(34,211,238,0.2)]" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
               {[
                  ['496', 'products to customize'],
                  ['1000000', 'items fulfilled each month'],
                  ['22', 'integration partners'],
                  ['132M', 'items trusted to deliver'],
               ].map(([value, label]) => (
                  <div key={label}>
                     <p className="text-3xl font-bold">{value}</p>
                     <p className="text-sm text-white/80">{label}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>
   )
}

export function IntegrationsSection() {
   return (
      <section className="my-10 rounded-xl border bg-[#f4f4f5] px-4 py-14 sm:px-8">
         <div className="mx-auto max-w-6xl">
            <div className="mt-10 grid grid-cols-4 gap-3 md:hidden">
               {integrations.slice(0, 8).map((integration) => {
                  return (
                     <div key={integration.name} className="rounded-2xl border bg-white p-3 shadow-sm">
                        <img
                           src={integration.logo}
                           alt={integration.name}
                           className="mx-auto h-5 w-5 object-contain"
                        />
                     </div>
                  )
               })}
            </div>
            <div className="relative hidden h-[430px] md:block">
               <div className="absolute left-1/2 top-1/2 z-20 flex w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-2xl bg-[#f4f4f5]/95 px-6 py-5 text-center backdrop-blur-sm">
                  <h2 className="text-4xl font-bold leading-tight text-slate-900">
                     Seamlessly connect to
                     <br />
                     any eCommerce site
                  </h2>
                  <Button className="mt-6 rounded-md bg-red-500 text-white hover:bg-red-600">
                     See all integrations
                     <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
               </div>
               {integrations.map((integration, index) => {
                  return (
                     <div
                        key={integration.name}
                        className={`group absolute z-10 ${integration.className} animate-[float_5s_ease-in-out_infinite]`}
                        style={{ animationDelay: `${index * 120}ms` }}
                     >
                        <button
                           type="button"
                           className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:scale-110 hover:shadow-md"
                           aria-label={integration.name}
                        >
                           <img
                              src={integration.logo}
                              alt={integration.name}
                              className="h-7 w-7 object-contain"
                           />
                        </button>
                        <div className="pointer-events-none absolute -top-20 left-1/2 w-56 -translate-x-1/2 rounded-lg border bg-slate-900/95 p-3 text-left text-white opacity-0 shadow-lg transition duration-200 group-hover:opacity-100">
                           <p className="text-sm font-semibold">{integration.name}</p>
                           <p className="mt-1 text-xs text-white/80">
                              {integration.description}
                           </p>
                           <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900/95" />
                        </div>
                     </div>
                  )
               })}
            </div>
         </div>
      </section>
   )
}
