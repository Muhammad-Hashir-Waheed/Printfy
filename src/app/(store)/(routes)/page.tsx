import {
   BUNDLE_KEY,
   DEPARTMENTS,
   getCategory,
   getDepartment,
   getProductByKey,
   popularProducts,
   SIGNATURE_CATEGORIES,
   type Category,
} from '@/catalog'
import config from '@/config/site'
import { SITE_STATS } from '@/config/stats'
import { CategoryCard, DepartmentTile, ProductCard, SectionHeading } from '@/components/store/cards'
import { BackgroundImage } from '@/components/store/background-image'
import { CatalogImage } from '@/components/store/catalog-image'
import { HeroVideo } from '@/components/store/hero-video'
import { CountUp, Magnetic, Marquee, Reveal, RotatingWords } from '@/components/store/motion'
import { QuoteBand } from '@/components/store/quote-band'
import { ReviewsSection } from '@/components/store/reviews-section'
import { SignatureCard, type SignatureCardData } from '@/components/store/signature'
import { SIGNATURE_CONTENT } from '@/components/store/signature-flagship'
import { ArrowRight, BadgeCheck, Box, Clock3, CreditCard, Gift, Palette, Sparkle, Truck, Upload } from 'lucide-react'
import { getReviews, type ReviewsData } from '@/lib/google-reviews'
import Link from 'next/link'
import { Fragment } from 'react'

const cat = (key: string) => {
   const [d, c] = key.split('/')
   return getCategory(d, c) as Category
}

function Hero() {
   return (
      <section className="relative isolate flex items-center overflow-hidden bg-[#141210] text-white lg:min-h-[min(820px,calc(100svh-160px))]">
         <HeroVideo />
         {/* Readability: an overall 30% darkening plus a stronger wash behind the text (left column on
             desktop, the whole frame on phones). Measured on every clip: white text keeps at least
             4.5:1 contrast against the 95th-percentile brightest background (5.3:1 desktop, 4.9:1 phone). */}
         <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/30" />
         <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden md:block"
            style={{ background: 'linear-gradient(90deg, rgba(0,0,0,.82) 0%, rgba(0,0,0,.75) 40%, rgba(0,0,0,.4) 58%, transparent 75%)' }}
         />
         <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/70 md:hidden" />

         <div className="page-shell relative w-full pb-20 pt-8 sm:pb-24 sm:pt-12 lg:pb-24 lg:pt-12">
            <div className="text-on-dark-film max-w-2xl">
               <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-ink shadow-sm animate-in fade-in-0 slide-in-from-bottom-2 duration-700">
                  <span className="relative flex h-2 w-2">
                     <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                     <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  Rigid boxes · Mailer boxes · Business cards
               </p>
               {/* The H1 is exactly "Make your brand stand out." for screen readers and search engines.
                   The rotating second line sits outside it and is visual only. */}
               <div className="hero-title mt-5 font-display font-extrabold tracking-[-0.035em]">
                  <h1>
                     <span className="word-rise block">
                        {['Make', 'your', 'brand'].map((w, i) => (
                           <Fragment key={w}>
                              {i > 0 ? ' ' : null}
                              <span style={{ animationDelay: `${120 + i * 90}ms` }}>{w}</span>
                           </Fragment>
                        ))}
                     </span>
                     <span className="sr-only"> stand out.</span>
                  </h1>
                  <span aria-hidden="true" className="word-rise block">
                     <span style={{ animationDelay: '420ms' }} className="relative text-coral">
                        <RotatingWords words={['unboxable.', 'unforgettable.', 'luxe.', 'stand out.']} interval={2600} />
                        <svg
                           viewBox="0 0 300 20"
                           className="absolute -bottom-2 left-0 h-3 w-full text-primary sm:-bottom-3 sm:h-4"
                           preserveAspectRatio="none"
                           aria-hidden
                        >
                           <path
                              d="M3 15C70 4 180 2 297 9"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="5"
                              strokeLinecap="round"
                              pathLength={1}
                              strokeDasharray="1"
                              strokeDashoffset="1"
                              style={{ animation: 'draw-line 1.2s 0.9s cubic-bezier(.6,0,.2,1) forwards' }}
                           />
                        </svg>
                     </span>
                  </span>
               </div>
               <p className="mt-5 max-w-xl text-[17px] font-medium leading-relaxed text-white/90 animate-in fade-in-0 slide-in-from-bottom-3 duration-1000 sm:text-lg" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
                  Luxury rigid boxes, mailer boxes and foil business cards — designed with you, printed with care,
                  delivered on time.
               </p>
               <div className="mt-7 flex flex-col gap-3 animate-in fade-in-0 slide-in-from-bottom-3 duration-1000 sm:flex-row" style={{ animationDelay: '650ms', animationFillMode: 'both' }}>
                  <Magnetic className="w-full sm:w-auto">
                     <Link
                        href="#signature"
                        className="btn-shine group inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-semibold text-ink transition hover:bg-white/90 sm:w-auto"
                     >
                        See our bestsellers <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                     </Link>
                  </Magnetic>
                  <Magnetic className="w-full sm:w-auto">
                     <Link
                        href="/quote"
                        className="inline-flex h-14 w-full items-center justify-center rounded-full border border-white/45 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/15 sm:w-auto"
                     >
                        Get a free quote
                     </Link>
                  </Magnetic>
               </div>
               <ul className="mt-8 grid max-w-xl grid-cols-3 gap-4 border-t border-white/20 pt-6 animate-in fade-in-0 duration-1000" style={{ animationDelay: '800ms', animationFillMode: 'both' }}>
                  <li>
                     <p className="font-display text-2xl font-extrabold tracking-tight sm:text-4xl">
                        <CountUp to={SITE_STATS.productCount} suffix="+" />
                     </p>
                     <p className="mt-1 text-xs font-medium text-white/80 sm:text-[13px]">products to customise</p>
                  </li>
                  <li>
                     <p className="font-display text-2xl font-extrabold tracking-tight sm:text-4xl">
                        <CountUp to={SITE_STATS.departmentCount} />
                     </p>
                     <p className="mt-1 text-xs font-medium text-white/80 sm:text-[13px]">departments, one studio</p>
                  </li>
                  <li>
                     <p className="font-display text-2xl font-extrabold tracking-tight sm:text-4xl">{SITE_STATS.quoteTurnaroundShort}</p>
                     <p className="mt-1 text-xs font-medium text-white/80 sm:text-[13px]">quote turnaround</p>
                  </li>
               </ul>
            </div>
         </div>
      </section>
   )
}

const FINISHES = ['Soft-touch', 'Gold foil', 'Spot UV', 'Embossing', 'Metalized', 'Magnetic closure', 'Inside print', 'Ribbon pull']

function SignatureThree() {
   const cards: SignatureCardData[] = SIGNATURE_CATEGORIES.map((key, i) => {
      const c = cat(key)
      const { promise, styles, photos } = SIGNATURE_CONTENT[key]
      return {
         index: i + 1,
         href: c.href,
         name: c.name,
         promise,
         styles: styles.slice(0, 3),
         count: c.products.length,
         accent: c.accent,
         photos: photos
            .map((slug) => c.products.find((p) => p.slug === slug))
            .filter(Boolean)
            .map((p) => ({ image: p!.image, label: p!.name })),
      }
   })
   const kit = getProductByKey(BUNDLE_KEY)

   return (
      <section id="signature" className="grain relative scroll-mt-28 overflow-hidden bg-[#120d0a] py-16 text-white sm:py-20">
         <BackgroundImage src="/catalog/c/custom-packaging/custom-printing.jpg" />
         <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(18_13_10/0.72)_0%,rgb(18_13_10/0.38)_30%,rgb(18_13_10/0.38)_70%,rgb(18_13_10/0.6)_100%)]" />
         <div className="pointer-events-none absolute -left-32 top-10 h-[460px] w-[460px] rounded-full bg-[#D9AE4F]/15 blur-[120px]" />
         <div className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-[#D42F25]/20 blur-[120px]" />
         <div className="page-shell relative">
            <div className="text-on-dark-film mx-auto max-w-3xl text-center">
               <p className="eyebrow text-[#F3D88C]">The Signature Three</p>
               <h2 className="mt-3 font-display text-[2.4rem] font-extrabold leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                  What we&apos;re{' '}
                  <span className="bg-[linear-gradient(100deg,#F7E3A1,#D9AE4F_45%,#FFF1C4_60%,#C99A3E)] bg-clip-text pr-1 italic text-transparent">known</span>{' '}
                  for.
               </h2>
               <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/65 sm:text-base">
                  Our most-ordered work, perfected run after run. Made to order, proofed by a human and finished by
                  hand.
               </p>
            </div>

            <Reveal
               stagger={120}
               y={32}
               itemClassName="w-[78%] max-w-[300px] shrink-0 snap-center sm:w-[44%] sm:max-w-[360px] lg:w-auto lg:max-w-none"
               className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 lg:mx-auto lg:grid lg:max-w-5xl lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0"
            >
               {cards.map((c, i) => (
                  <SignatureCard key={c.href} card={c} priority={i === 0} />
               ))}
            </Reveal>
            <p className="mt-3 text-center text-xs text-white/40 lg:hidden">Swipe to see all three →</p>

            <div aria-hidden className="mask-fade-x mt-10">
               <Marquee speed={45}>
                  {FINISHES.map((f) => (
                     <span key={f} className="flex items-center gap-5 px-5 font-display text-lg font-semibold italic text-white/50 sm:text-xl">
                        {f}
                        <Sparkle className="h-4 w-4 fill-[#D9AE4F] text-[#D9AE4F]" />
                     </span>
                  ))}
               </Marquee>
            </div>

            {kit ? (
               <Reveal y={40} className="mt-14">
                  <Link
                     href={kit.href}
                     className="group grid overflow-hidden rounded-[2rem] bg-[#F6EFE6] text-ink ring-1 ring-white/10 md:grid-cols-[1.15fr_1fr]"
                  >
                     <div className="relative aspect-[16/11] overflow-hidden md:aspect-auto md:min-h-[380px]">
                        <CatalogImage image={kit.image} label={kit.name} accent={kit.accent} sizes="(min-width:768px) 55vw, 100vw" className="transition duration-700 group-hover:scale-[1.04]" />
                     </div>
                     <div className="flex flex-col justify-center p-7 sm:p-10">
                        <p className="eyebrow text-primary">All three, one look</p>
                        <h3 className="display-lg mt-3">The Brand Launch Kit</h3>
                        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                           Rigid boxes, mailers and business cards designed together as one matching set — so your brand
                           looks the same from the first handshake to the final unboxing.
                        </p>
                        <ul className="mt-6 grid grid-cols-3 gap-3">
                           {[
                              { icon: Gift, n: '100', l: 'rigid boxes' },
                              { icon: Box, n: '250', l: 'mailer boxes' },
                              { icon: CreditCard, n: '500', l: 'business cards' },
                           ].map(({ icon: Icon, n, l }) => (
                              <li key={l} className="rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-black/5">
                                 <Icon className="mx-auto h-5 w-5 text-primary" />
                                 <p className="mt-1.5 font-display text-2xl font-extrabold leading-none">{n}</p>
                                 <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">{l}</p>
                              </li>
                           ))}
                        </ul>
                        <span className="mt-7 inline-flex h-12 items-center gap-2 self-start rounded-full bg-ink px-6 font-semibold text-white transition-all group-hover:gap-3 group-hover:bg-primary">
                           Build my launch kit <ArrowRight className="h-4 w-4" />
                        </span>
                     </div>
                  </Link>
               </Reveal>
            ) : null}
         </div>
      </section>
   )
}

function DepartmentRail() {
   return (
      <section className="page-shell py-12 sm:py-16">
         <SectionHeading
            eyebrow="Shop by department"
            title="Everything your brand touches."
            action={{ href: '/shop', label: 'All departments' }}
         />
         <Reveal stagger={50} className="grid grid-cols-3 gap-x-4 gap-y-7 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-12 xl:gap-x-4">
            {DEPARTMENTS.map((d) => (
               <DepartmentTile key={d.slug} department={d} />
            ))}
         </Reveal>
      </section>
   )
}

function Popular() {
   const products = popularProducts()
   return (
      <section className="page-shell py-12 sm:py-16">
         <SectionHeading
            eyebrow="Bestsellers"
            title="Customer favourites"
            description="The products our customers reorder again and again — ready to personalise in minutes."
            action={{ href: '/shop', label: 'Browse everything' }}
         />
         <Reveal y={40} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {products.map((p, i) => (
               <div key={p.key} className="w-[72%] shrink-0 snap-start min-[480px]:w-[45%] sm:w-auto">
                  <ProductCard product={p} showCategory priority={i < 4} />
               </div>
            ))}
         </Reveal>
      </section>
   )
}

function SignageFeature() {
   const dept = getDepartment('signage-displays')!
   const featured = ['neon-signs', '3d-raised-letter-signs', 'sign-boards', 'led-displays']
      .map((slug) => dept.categories.find((c) => c.slug === slug)!)
      .filter(Boolean)

   return (
      <section
         className="relative mt-8 overflow-hidden bg-[#0f0a14] py-20 text-white sm:py-28"
         style={{ ['--accent-hex' as string]: dept.accent }}
      >
         <BackgroundImage src="/catalog/c/signage-displays/neon-signs.jpg" />
         <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0f0a14]/80 via-[#0f0a14]/40 to-[#0f0a14]/10" />
         <div className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-[#ff2e88]/25 blur-[120px]" />
         <div className="pointer-events-none absolute -right-40 bottom-0 h-[460px] w-[460px] rounded-full bg-[#2ee6ff]/15 blur-[120px]" />
         <div className="page-shell relative grid gap-12 lg:grid-cols-[0.9fr_1.4fr] lg:items-center">
            <div className="text-on-dark-film">
               <p className="eyebrow text-[#ff7ab8]">Signage & Displays</p>
               <h2 className="mt-4 font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                  Light up <br />
                  <span className="neon-text animate-flicker text-white">your brand.</span>
               </h2>
               <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/70 sm:text-base">
                  From a single neon sign to a full storefront, exhibition booth or LED video wall — we design,
                  fabricate and install it.
               </p>
               <div className="mt-8 flex flex-wrap gap-2">
                  {dept.categories.map((c) => (
                     <Link
                        key={c.slug}
                        href={c.href}
                        className="rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-white/85 transition hover:border-[#ff2e88] hover:bg-[#ff2e88]/10 hover:text-white"
                     >
                        {c.name}
                     </Link>
                  ))}
               </div>
               <Link
                  href={dept.href}
                  className="mt-10 inline-flex h-14 items-center gap-2 rounded-full bg-white px-8 font-semibold text-ink transition hover:bg-white/90"
               >
                  Explore signage <ArrowRight className="h-5 w-5" />
               </Link>
            </div>
            <Reveal stagger={110} className="grid grid-cols-2 gap-3 sm:gap-4">
               {featured.map((c, i) => (
                  <Link
                     key={c.slug}
                     href={c.href}
                     className={`group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 sm:aspect-[5/4] ${i % 2 === 1 ? 'lg:translate-y-8' : ''}`}
                  >
                     <CatalogImage image={c.image} label={c.name} accent={dept.accent} dark sizes="(min-width:1024px) 28vw, 50vw" className="transition duration-700 group-hover:scale-105" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                     <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                        <p className="font-display text-lg font-bold leading-tight sm:text-2xl">{c.name}</p>
                        <p className="mt-1 text-xs text-white/70 sm:text-sm">{c.products.length} options</p>
                     </div>
                  </Link>
               ))}
            </Reveal>
         </div>
      </section>
   )
}

function AcrylicSpotlight() {
   const dept = getDepartment('acrylic-plastic-packaging')!
   const products = dept.categories[0].products.slice(0, 4)
   return (
      <section className="page-shell py-20 sm:py-28">
         <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#e6f7fb] via-white to-[#eef0ff] p-6 ring-1 ring-[#0E9FC4]/15 sm:p-10 lg:p-14">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rotate-12 rounded-[3rem] border border-white bg-white/40 shadow-[inset_0_0_40px_rgba(14,159,196,0.15)] backdrop-blur" />
            <div className="relative grid gap-10 lg:grid-cols-[0.8fr_1.6fr] lg:items-end">
               <div>
                  <p className="eyebrow text-[#0b7f9c]">New · Acrylic & Plastic</p>
                  <h2 className="display-lg mt-3">Crystal clear. Seriously premium.</h2>
                  <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                     Laser-cut acrylic boxes for gifts, jewellery, cakes and displays — plus clear PET, PVC and PP
                     packaging that lets your product do the talking.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                     {dept.categories.map((c) => (
                        <Link key={c.slug} href={c.href} className="inline-flex items-center gap-2 rounded-full bg-[#0E9FC4] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b86a5]">
                           {c.name} <ArrowRight className="h-4 w-4" />
                        </Link>
                     ))}
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {products.map((p) => (
                     <ProductCard key={p.key} product={p} />
                  ))}
               </div>
            </div>
         </div>
      </section>
   )
}

function HowItWorks() {
   const steps = [
      { icon: Palette, title: 'Choose your product', text: `Pick from ${SITE_STATS.productCountLabel} products and set size, material, finish and quantity.` },
      { icon: Upload, title: 'Add your artwork', text: 'Upload your design, or let our designers create it for you.' },
      { icon: BadgeCheck, title: 'Approve your proof', text: 'We check every file and send a digital proof before printing.' },
      { icon: Truck, title: 'Delivered — or installed', text: 'Fast production and delivery. Signage installed by our team.' },
   ]
   return (
      <section className="bg-white py-20 sm:py-24">
         <div className="page-shell">
            <SectionHeading eyebrow="How it works" title="From idea to doorstep in four steps." />
            <Reveal stagger={120} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
               {steps.map(({ icon: Icon, title, text }, i) => (
                  <div key={title} className="group relative h-full overflow-hidden rounded-3xl border bg-background p-6 transition duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-30px_rgba(30,20,10,0.5)]">
                     <span className="absolute -right-2 -top-6 font-display text-[7rem] font-extrabold leading-none text-ink/[0.04] transition group-hover:text-primary/10">
                        {i + 1}
                     </span>
                     <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-white transition duration-500 group-hover:-rotate-12 group-hover:scale-110 group-hover:bg-primary">
                        <Icon className="h-5 w-5" />
                     </span>
                     <h3 className="mt-6 text-lg font-bold">{title}</h3>
                     <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                  </div>
               ))}
            </Reveal>
         </div>
      </section>
   )
}

function Industries() {
   const items = [
      { title: 'Restaurants & cafés', href: '/shop/food-packaging', image: cat('food-packaging/food-boxes'), text: 'Pizza boxes, cups, bags & menus' },
      { title: 'Beauty & cosmetics', href: '/shop/retail-packaging', image: cat('retail-packaging/product-boxes'), text: 'Cartons, labels & luxury boxes' },
      { title: 'Retail & boutiques', href: '/shop/bags', image: cat('bags/paper-bags'), text: 'Shoppers, tags & window graphics' },
      { title: 'Offices & corporate', href: '/shop/corporate', image: cat('signage-displays/office-corporate-signage'), text: 'Stationery, gifts & reception signs' },
      { title: 'Events & weddings', href: '/shop/signage-displays/event-exhibition-signage', image: cat('signage-displays/event-exhibition-signage'), text: 'Backdrops, neon & welcome signs' },
   ]
   return (
      <section className="page-shell py-20 sm:py-24">
         <SectionHeading eyebrow="Shop by industry" title="Built for how you do business." />
         <Reveal stagger={90} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {items.map((item) => (
               <Link
                  key={item.title}
                  href={item.href}
                  className="group relative block h-full overflow-hidden rounded-3xl bg-muted"
               >
                  <div className="relative aspect-[3/4] max-h-[420px] w-full sm:aspect-[4/5]">
                     <CatalogImage image={item.image?.image ?? null} label={item.title} accent={item.image?.accent} dark={item.image?.dark} sizes="(min-width:1024px) 20vw, 50vw" className="transition duration-700 group-hover:scale-105" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                     <p className="font-display text-xl font-bold leading-tight">{item.title}</p>
                     <p className="mt-1 text-sm text-white/75">{item.text}</p>
                  </div>
               </Link>
            ))}
         </Reveal>
      </section>
   )
}

function PackagingBento() {
   const keys = [
      'retail-packaging/product-boxes',
      'packaging/folding-cartons',
      'food-packaging/cups',
      'labels-stickers/stickers',
      'bags/paper-bags',
      'bags/fabric-bags',
   ]
   return (
      <section className="page-shell py-12 sm:py-16">
         <SectionHeading
            eyebrow="Popular categories"
            title="Start with a classic."
            description="Our most-loved categories, each with dozens of sizes, materials and finishes."
         />
         <Reveal stagger={90} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {keys.map((key) => (
               <CategoryCard key={key} category={cat(key)} />
            ))}
         </Reveal>
      </section>
   )
}

function Guarantees() {
   const items = [
      { icon: BadgeCheck, title: 'Print-perfect guarantee', text: 'If it is not right, we reprint it.' },
      { icon: Palette, title: 'Free artwork check', text: 'Every file reviewed by a human.' },
      { icon: Clock3, title: 'Fast turnaround', text: 'Most print in 3–7 business days.' },
      { icon: Truck, title: 'Delivered or installed', text: 'Tracked delivery & pro installation.' },
   ]
   return (
      <section className="border-y bg-white">
         <ul className="page-shell grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
            {items.map(({ icon: Icon, title, text }) => (
               <li key={title} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
                  <span>
                     <span className="block text-sm font-semibold sm:text-[15px]">{title}</span>
                     <span className="block text-xs text-muted-foreground sm:text-sm">{text}</span>
                  </span>
               </li>
            ))}
         </ul>
      </section>
   )
}

/** Printer's registration mark — the separator on the press-sheet ribbon */
function RegMark({ className }: { className?: string }) {
   return (
      <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.4">
         <circle cx="12" cy="12" r="6.5" />
         <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
         <path d="M12 1.5V22.5M1.5 12H22.5" />
      </svg>
   )
}

/** The colour-control strip printed along the edge of every press sheet (C, M, Y, K and their tints) */
const CONTROL_STRIP = ['#00a3e0', '#e6007e', '#ffe600', '#1d1d1b', '#7fd1ef', '#f27fbe', '#fff27f', '#8e8e8d', '#d42f25', '#d9ae4f']

function ControlStrip() {
   return (
      <div
         aria-hidden
         className="h-2 w-full"
         style={{
            backgroundImage: `repeating-linear-gradient(90deg, ${CONTROL_STRIP.map((c, i) => `${c} ${i * 14}px ${(i + 1) * 14 - 2}px, transparent ${(i + 1) * 14 - 2}px ${(i + 1) * 14}px`).join(', ')})`,
            backgroundSize: `${CONTROL_STRIP.length * 14}px 100%`,
         }}
      />
   )
}

/**
 * "Press sheet" band + "swatch book" strip.
 * Row 1: an ink-black press-sheet ribbon edged with a CMYK colour-control strip; the words alternate
 * between solid ink, outline and gold foil, separated by registration marks.
 * Row 2: categories as Pantone-style swatch cards (photo, department colour bar, swatch code, name).
 */
function KineticBand() {
   const words = ['Packaging', 'Printing', 'Neon', 'Labels', 'Acrylic', 'Signage', 'Bags', 'Displays']
   const styles = [
      'text-white',
      'text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,.75)]',
      'bg-[linear-gradient(100deg,#F7E3A1,#D9AE4F_45%,#FFF1C4_60%,#C99A3E)] bg-clip-text text-transparent',
   ]
   const swatches = DEPARTMENTS.flatMap((d) => d.categories.slice(0, 2).map((c) => ({ c, accent: d.accent }))).filter(({ c }) => c.image)

   return (
      <section aria-hidden className="relative overflow-hidden pb-4 pt-12 sm:pb-6 sm:pt-16">
         {/* Press sheet */}
         <div className="relative mx-[-3%] -rotate-[1.5deg] bg-[#16110f] shadow-[0_30px_60px_-30px_rgba(22,17,15,.7)]">
            <ControlStrip />
            <div className="flex items-center gap-3 px-6 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
               <span>Joji Arts · Press sheet 01</span>
               <span className="ml-auto hidden sm:inline">CMYK + Foil · 350gsm</span>
            </div>
            <div className="py-3 sm:py-4">
               <Marquee speed={42}>
                  {words.map((w, i) => (
                     <span key={w} className="flex items-center gap-7 px-7">
                        <span className={`font-display text-[2.6rem] font-extrabold leading-none tracking-[-0.03em] sm:text-7xl ${styles[i % styles.length]}`}>{w}</span>
                        <RegMark className="h-6 w-6 shrink-0 text-white/40 sm:h-8 sm:w-8" />
                     </span>
                  ))}
               </Marquee>
            </div>
            <ControlStrip />
         </div>

         {/* Swatch book */}
         <div className="mt-10 sm:mt-12">
            <Marquee speed={70} reverse className="py-3">
               {swatches.map(({ c, accent }, i) => (
                  <Link
                     key={c.key}
                     href={c.href}
                     tabIndex={-1}
                     className="group mx-2.5 block w-36 shrink-0 overflow-hidden rounded-md bg-white shadow-[0_10px_24px_-14px_rgba(30,20,10,.45)] ring-1 ring-black/5 transition duration-300 hover:-translate-y-2 hover:rotate-[-1.5deg] sm:w-44"
                  >
                     <span className="relative block aspect-square">
                        <CatalogImage image={c.image} label={c.name} accent={c.accent} dark={c.dark} sizes="176px" />
                     </span>
                     <span className="block h-2.5" style={{ backgroundColor: accent }} />
                     <span className="block px-3 pb-3 pt-2">
                        <span className="block font-mono text-[10px] font-semibold tracking-[0.12em] text-ink/50">JA {101 + i} C</span>
                        <span className="mt-0.5 block truncate text-[13px] font-bold text-ink sm:text-sm">{c.name}</span>
                     </span>
                  </Link>
               ))}
            </Marquee>
         </div>
      </section>
   )
}

/** Business details for search engines; everything comes from the site config. */
function LocalBusinessJsonLd({ reviews }: { reviews: ReviewsData | null }) {
   const { address } = config
   const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: config.name,
      description: config.description,
      url: config.url,
      telephone: config.phoneIntl,
      email: config.adminEmail,
      address: {
         '@type': 'PostalAddress',
         streetAddress: `${address.line1}, ${address.line2}`,
         addressLocality: address.city,
         addressRegion: address.region,
         addressCountry: address.countryCode,
      },
      geo: { '@type': 'GeoCoordinates', latitude: address.geo.lat, longitude: address.geo.lng },
      hasMap: address.mapsUrl,
      // Only from Google's live data, never from hand-copied reviews
      ...(reviews?.source === 'google-api' && reviews.rating && reviews.count
         ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: reviews.rating, reviewCount: reviews.count, bestRating: 5 } }
         : {}),
   }
   return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

export default async function HomePage() {
   const reviews = await getReviews()
   return (
      <>
         <LocalBusinessJsonLd reviews={reviews} />
         <Hero />
         <Guarantees />
         <SignatureThree />
         <DepartmentRail />
         <Popular />
         <KineticBand />
         <SignageFeature />
         <PackagingBento />
         <AcrylicSpotlight />
         <HowItWorks />
         <Industries />
         <ReviewsSection data={reviews} />
         <QuoteBand image="/catalog/c/packaging/mailer-boxes.jpg" />
      </>
   )
}
