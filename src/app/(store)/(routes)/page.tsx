import {
   BUNDLE_KEY,
   CATALOG_STATS,
   DEPARTMENTS,
   getCategory,
   getDepartment,
   getProductByKey,
   popularProducts,
   SIGNATURE_CATEGORIES,
   type Category,
} from '@/catalog'
import { CategoryCard, DepartmentTile, ProductCard, SectionHeading } from '@/components/store/cards'
import { CatalogImage } from '@/components/store/catalog-image'
import { CountUp, Magnetic, Marquee, Reveal, RotatingWords } from '@/components/store/motion'
import { QuoteBand } from '@/components/store/quote-band'
import { SignatureCard, type SignatureCardData } from '@/components/store/signature'
import { SIGNATURE_CONTENT } from '@/components/store/signature-flagship'
import { ArrowRight, BadgeCheck, Box, Clock3, CreditCard, Gift, Palette, Sparkle, Truck, Upload } from 'lucide-react'
import Link from 'next/link'

const cat = (key: string) => {
   const [d, c] = key.split('/')
   return getCategory(d, c) as Category
}

function Hero() {
   const signage = getDepartment('signage-displays')!
   const rigid = getProductByKey('packaging/rigid-boxes/magnetic-closure-box')!
   const mailer = getProductByKey('packaging/mailer-boxes/subscription-mailer-box')!
   const cards = getProductByKey('printing/business-cards/foil-business-cards')!

   return (
      <section className="grain relative overflow-hidden">
         <div className="page-shell grid items-center gap-10 pb-14 pt-8 sm:pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-20 lg:pt-16">
            <div>
               <p className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[13px] font-medium shadow-sm animate-in fade-in-0 slide-in-from-bottom-2 duration-700">
                  <span className="relative flex h-2 w-2">
                     <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                     <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  Rigid boxes · Mailer boxes · Business cards
               </p>
               <h1 className="display-xl mt-6">
                  <span className="word-rise block">
                     {['Make', 'your', 'brand'].map((w, i) => (
                        <span key={w} style={{ animationDelay: `${120 + i * 90}ms` }} className="mr-[0.22em]">
                           {w}
                        </span>
                     ))}
                  </span>
                  <span className="word-rise block">
                     <span style={{ animationDelay: '420ms' }} className="relative text-primary">
                        <RotatingWords words={['unboxable.', 'unforgettable.', 'luxe.', 'stand out.']} interval={2600} />
                        <svg
                           viewBox="0 0 300 20"
                           className="absolute -bottom-2 left-0 h-3 w-full text-coral sm:-bottom-3 sm:h-4"
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
               </h1>
               <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-3 duration-1000 sm:text-lg" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
                  Luxury rigid boxes, mailer boxes made for unboxing and business cards finished in foil — plus
                  everything else your brand touches. Designed with you, printed with care, delivered on time.
               </p>
               <div className="mt-8 flex flex-col gap-3 animate-in fade-in-0 slide-in-from-bottom-3 duration-1000 sm:flex-row" style={{ animationDelay: '650ms', animationFillMode: 'both' }}>
                  <Magnetic className="w-full sm:w-auto">
                     <Link
                        href="#signature"
                        className="btn-shine group inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-ink px-8 text-base font-semibold text-white transition hover:bg-ink/90 sm:w-auto"
                     >
                        See our bestsellers <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                     </Link>
                  </Magnetic>
                  <Magnetic className="w-full sm:w-auto">
                     <Link
                        href="/quote"
                        className="ring-glow inline-flex h-14 w-full items-center justify-center rounded-full bg-white px-8 text-base font-semibold transition hover:bg-white/80 sm:w-auto"
                     >
                        Get a free quote
                     </Link>
                  </Magnetic>
               </div>
               <ul className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-ink/10 pt-6 animate-in fade-in-0 duration-1000" style={{ animationDelay: '800ms', animationFillMode: 'both' }}>
                  <li>
                     <p className="font-display text-2xl font-extrabold tracking-tight sm:text-4xl">
                        <CountUp to={CATALOG_STATS.products} suffix="+" />
                     </p>
                     <p className="mt-1 text-xs text-muted-foreground sm:text-[13px]">products to customise</p>
                  </li>
                  <li>
                     <p className="font-display text-2xl font-extrabold tracking-tight sm:text-4xl">
                        <CountUp to={CATALOG_STATS.departments} />
                     </p>
                     <p className="mt-1 text-xs text-muted-foreground sm:text-[13px]">departments, one studio</p>
                  </li>
                  <li>
                     <p className="font-display text-2xl font-extrabold tracking-tight sm:text-4xl">
                        <CountUp to={24} suffix="h" />
                     </p>
                     <p className="mt-1 text-xs text-muted-foreground sm:text-[13px]">quote turnaround</p>
                  </li>
               </ul>
            </div>

            {/* Bento collage */}
            <div className="relative grid h-[440px] grid-cols-6 grid-rows-6 gap-3 animate-in fade-in-0 zoom-in-95 duration-1000 sm:h-[540px] lg:h-[600px]" style={{ animationDelay: '250ms', animationFillMode: 'both' }}>
               <span aria-hidden className="float-y absolute -left-4 top-[16%] z-10 hidden rotate-[-8deg] rounded-full bg-[#FFD84D] px-4 py-2 font-display text-sm font-extrabold text-ink shadow-lg sm:block">
                  ✦ Foil &amp; spot UV
               </span>
               <span aria-hidden className="float-y absolute -right-3 top-[52%] z-10 hidden rotate-[6deg] rounded-full bg-[linear-gradient(110deg,#d8d8d8,#ffffff_40%,#b9b9b9_60%,#f2f2f2)] px-4 py-2 font-display text-sm font-extrabold text-ink shadow-lg ring-1 ring-black/10 sm:block" style={{ animationDelay: '1.4s' }}>
                  Metalized finishes
               </span>
               <Link href={rigid.href} className="group relative col-span-4 row-span-4 overflow-hidden rounded-[1.75rem] bg-[#0d2b24]">
                  <CatalogImage image={rigid.image} label={rigid.name} accent={rigid.accent} priority sizes="(min-width:1024px) 34vw, 66vw" className="transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0d2b24]/60 via-transparent to-black/75" />
                  <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#F3D88C] ring-1 ring-[#F3D88C]/40 backdrop-blur">
                     ★ Bestseller
                  </span>
                  <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3 text-white">
                     <div>
                        <p className="bg-[linear-gradient(100deg,#F7E3A1,#D9AE4F_45%,#FFF1C4_60%,#C99A3E)] bg-clip-text pb-1 font-display text-3xl font-extrabold italic leading-none tracking-tight text-transparent sm:text-5xl">
                           Luxury, unboxed.
                        </p>
                        <p className="mt-1 text-sm font-medium text-white/85 sm:text-base">Rigid boxes · magnetic, drawer &amp; book-style</p>
                     </div>
                     <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-ink transition group-hover:-rotate-45">
                        <ArrowRight className="h-4 w-4" />
                     </span>
                  </div>
               </Link>

               <Link href={mailer.href} className="group relative col-span-2 row-span-3 overflow-hidden rounded-[1.75rem] bg-muted">
                  <CatalogImage image={mailer.image} label={mailer.name} accent={mailer.accent} priority sizes="(min-width:1024px) 17vw, 33vw" className="transition duration-700 group-hover:scale-105" />
                  <span className="absolute bottom-2 left-2 whitespace-nowrap rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold shadow sm:bottom-3 sm:left-3 sm:px-3 sm:text-xs">★ Mailers</span>
               </Link>

               <Link href={cards.href} className="group relative col-span-2 row-span-3 overflow-hidden rounded-[1.75rem] bg-muted">
                  <CatalogImage image={cards.image} label={cards.name} accent={cards.accent} sizes="(min-width:1024px) 17vw, 33vw" className="transition duration-700 group-hover:scale-105" />
                  <span className="absolute bottom-2 left-2 whitespace-nowrap rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold shadow sm:bottom-3 sm:left-3 sm:px-3 sm:text-xs">★ Cards</span>
               </Link>

               <Link
                  href={signage.href}
                  className="group relative col-span-4 row-span-2 overflow-hidden rounded-[1.75rem] bg-[#140d18]"
                  style={{ ['--accent-hex' as string]: signage.accent }}
               >
                  <CatalogImage image={signage.image} label={signage.name} accent={signage.accent} dark sizes="(min-width:1024px) 34vw, 66vw" className="opacity-70 transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/75 to-transparent" />
                  <div className="absolute inset-y-0 left-5 flex flex-col justify-center text-white">
                     <p className="neon-text animate-flicker font-display text-2xl font-extrabold italic tracking-tight sm:text-3xl">open late</p>
                     <p className="text-sm text-white/80">Neon, 3D letters &amp; LED signage</p>
                  </div>
               </Link>

               <div className="float-y absolute -bottom-5 right-4 z-10 hidden items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-[0_20px_40px_-15px_rgba(30,20,10,0.4)] lg:flex" style={{ animationDelay: '0.7s' }}>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                     <BadgeCheck className="h-5 w-5" />
                  </span>
                  <span>
                     <span className="block text-sm font-semibold">Proof approved</span>
                     <span className="block text-xs text-muted-foreground">Printing starts today</span>
                  </span>
               </div>
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
         <div className="pointer-events-none absolute -left-32 top-10 h-[460px] w-[460px] rounded-full bg-[#D9AE4F]/15 blur-[120px]" />
         <div className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-[#D42F25]/20 blur-[120px]" />
         <div className="page-shell relative">
            <div className="mx-auto max-w-3xl text-center">
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
         <div className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-[#ff2e88]/25 blur-[120px]" />
         <div className="pointer-events-none absolute -right-40 bottom-0 h-[460px] w-[460px] rounded-full bg-[#2ee6ff]/15 blur-[120px]" />
         <div className="page-shell relative grid gap-12 lg:grid-cols-[0.9fr_1.4fr] lg:items-center">
            <div>
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
      { icon: Palette, title: 'Choose your product', text: 'Pick from 375+ products and set size, material, finish and quantity.' },
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

function KineticBand() {
   const words = ['Packaging', 'Printing', 'Neon', 'Labels', 'Acrylic', 'Signage', 'Bags', 'Displays']
   const strip = DEPARTMENTS.flatMap((d) => d.categories.slice(0, 2)).filter((c) => c.image)
   return (
      <section aria-hidden className="relative overflow-hidden py-10 sm:py-14">
         <div className="-rotate-2 scale-105 bg-primary py-4 text-white shadow-[0_20px_50px_-20px_rgba(212,47,37,.6)]">
            <Marquee speed={35}>
               {words.map((w) => (
                  <span key={w} className="flex items-center gap-6 px-6 font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
                     {w}
                     <Sparkle className="h-7 w-7 fill-white sm:h-9 sm:w-9" />
                  </span>
               ))}
            </Marquee>
         </div>
         <div className="mt-6 rotate-1">
            <Marquee speed={60} reverse>
               {strip.map((c) => (
                  <Link key={c.key} href={c.href} tabIndex={-1} className="group mx-2 flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1">
                     <span className="relative h-12 w-12 overflow-hidden rounded-full">
                        <CatalogImage image={c.image} label={c.name} accent={c.accent} dark={c.dark} sizes="48px" />
                     </span>
                     <span className="whitespace-nowrap text-sm font-semibold">{c.name}</span>
                  </Link>
               ))}
            </Marquee>
         </div>
      </section>
   )
}

export default function HomePage() {
   return (
      <>
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
         <QuoteBand />
      </>
   )
}
