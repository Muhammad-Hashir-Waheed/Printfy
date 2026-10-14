import type { Category } from '@/catalog'
import { cn } from '@/lib/utils'
import { Check, ChevronDown } from 'lucide-react'

type Finish = { name: string; note: string; swatch: string; ink?: 'light' | 'dark' }

export type SignatureContent = {
   promise: string
   styles: string[]
   /** Product slugs (within the category) shown in the bestseller slideshow */
   photos: string[]
   why: Array<{ title: string; text: string }>
   finishes: Finish[]
   faq: Array<{ q: string; a: string }>
}

/* CSS-drawn finish swatches — no photos needed, always on-brand */
const F: Record<string, Finish> = {
   softTouch: {
      name: 'Soft-touch matte',
      note: 'Velvety and fingerprint-resistant',
      swatch: 'radial-gradient(120% 90% at 30% 20%, #3a3a3a, #161616)',
      ink: 'light',
   },
   gold: {
      name: 'Gold foil',
      note: 'Mirror-bright metallic stamp',
      swatch: 'linear-gradient(115deg, #A8792A, #F7E3A1 30%, #D9AE4F 50%, #FFF1C4 62%, #B8892B)',
   },
   spotUv: {
      name: 'Spot UV',
      note: 'Raised gloss on a matte base',
      swatch:
         'radial-gradient(circle at 30% 35%, rgba(255,255,255,.35) 0 14%, transparent 15%), radial-gradient(circle at 70% 65%, rgba(255,255,255,.28) 0 18%, transparent 19%), #1b2350',
      ink: 'light',
   },
   emboss: {
      name: 'Embossing',
      note: 'A logo you can feel',
      swatch: 'radial-gradient(circle at 50% 50%, #fffaf0 0 22%, #e9dfcc 23% 26%, #f6efe2 27%)',
   },
   metal: {
      name: 'Metalized',
      note: 'Full silver, gold or rose-gold board',
      swatch: 'linear-gradient(115deg, #9a9a9a, #f4f4f4 32%, #bdbdbd 52%, #ffffff 64%, #8e8e8e)',
   },
   holo: {
      name: 'Holographic',
      note: 'Shifts colour as it moves',
      swatch: 'linear-gradient(120deg, #ffb3e6, #b7c8ff 30%, #a8fff0 60%, #fff2a8)',
   },
   kraft: {
      name: 'Natural kraft',
      note: 'Earthy, honest, recyclable',
      swatch: 'repeating-linear-gradient(35deg, rgba(90,55,20,.08) 0 2px, transparent 2px 7px), #C9965F',
   },
   insidePrint: {
      name: 'Inside print',
      note: 'A hidden reveal on opening',
      swatch: 'radial-gradient(circle, #FFD84D 0 2.5px, transparent 3px) 0 0 / 14px 14px, #1E1A17',
      ink: 'light',
   },
   gloss: {
      name: 'High gloss',
      note: 'Rich, punchy colour',
      swatch: 'linear-gradient(160deg, #ff6a5c, #D42F25 55%, #8f1810)',
      ink: 'light',
   },
}

export const SIGNATURE_CONTENT: Record<string, SignatureContent> = {
   'packaging/rigid-boxes': {
      promise: 'Luxury you can feel.',
      styles: ['Magnetic', 'Drawer', 'Book-style', 'Foil & emboss'],
      photos: ['magnetic-closure-box', 'sleeve-rigid-box', 'premium-rigid-box'],
      why: [
         { title: 'Heavyweight greyboard', text: 'Thick chipboard wrapped by hand, so every corner stays crisp and every lid closes with a satisfying weight.' },
         { title: 'Every closure style', text: 'Magnetic flap, drawer with ribbon pull, book-style, sleeve or classic lift-off lid — built to your exact size.' },
         { title: 'Finishes that whisper luxury', text: 'Soft-touch wraps, foil, emboss, spot UV and full metalized board — mix them for a box people keep.' },
         { title: 'Inserts made to fit', text: 'Card, foam or velvet-lined inserts cut to hold your product perfectly in place.' },
      ],
      finishes: [F.softTouch, F.gold, F.emboss, F.spotUv, F.metal, F.holo],
      faq: [
         { q: 'Can you make a rigid box in my exact size?', a: 'Yes — every rigid box is built to order around your product’s dimensions. Share the size (or the product itself) and we’ll engineer the box and insert.' },
         { q: 'Is there a minimum order?', a: 'Rigid boxes are made to order, so we quote for the quantity you need. Small launch runs are welcome — the price per box drops as quantities rise.' },
         { q: 'Can I see a sample before full production?', a: 'Every order gets a digital proof before printing. A physical pre-production sample can be arranged on request.' },
         { q: 'Can I get the metalized look?', a: 'Yes — pick Metalized silver, gold, rose gold or holographic on any rigid box and the product photo previews the finish.' },
      ],
   },
   'packaging/mailer-boxes': {
      promise: 'Unboxing they’ll post about.',
      styles: ['Branded', 'Kraft', 'Inside print', 'Subscription'],
      photos: ['subscription-mailer-box', 'branded-mailer-box', 'rigid-mailer-box'],
      why: [
         { title: 'Built for the courier', text: 'Sturdy corrugated board with self-locking tabs that survives the trip and arrives looking new.' },
         { title: 'Print outside, inside, or both', text: 'Your brand on the outside, a hidden message or pattern on the inside — the moment they open it.' },
         { title: 'Ships flat, folds in seconds', text: 'No tape, no glue. Mailers store flat and fold into a strong box in moments.' },
         { title: 'Kraft or white, your way', text: 'Natural kraft for an earthy feel or bright white for full-colour artwork.' },
      ],
      finishes: [F.kraft, F.insidePrint, F.gloss, F.softTouch, F.gold, F.metal],
      faq: [
         { q: 'Can you print on the inside of the box?', a: 'Yes — inside print is one of our most-loved options. Add a pattern, a thank-you message or a QR code for the reveal.' },
         { q: 'Will a mailer fit my product?', a: 'We make mailers to your dimensions. Tell us what goes inside and we’ll recommend the size and board strength.' },
         { q: 'Are your mailers eco-friendly?', a: 'Kraft mailers are made from recyclable corrugated board, and we can print with minimal ink coverage for a natural look.' },
         { q: 'Do you make subscription boxes?', a: 'Yes — subscription mailers are sized and styled for monthly kits, with consistent colour from one run to the next.' },
      ],
   },
   'printing/business-cards': {
      promise: 'First impressions, foiled.',
      styles: ['Gold foil', 'Spot UV', 'Soft matte', 'Kraft'],
      photos: ['foil-business-cards', 'spot-uv-business-cards', 'rounded-corner-business-cards'],
      why: [
         { title: 'Stocks with real weight', text: 'Thick, premium card that feels substantial in the hand — from classic matte to natural kraft.' },
         { title: 'Foil that catches the light', text: 'Gold, silver and rose-gold foil on logos, names and borders.' },
         { title: 'Raised spot UV', text: 'Glossy highlights on a soft matte base — a card people run their thumb across.' },
         { title: 'Any shape you like', text: 'Standard, square or rounded corners, printed on one or both sides.' },
      ],
      finishes: [F.softTouch, F.gold, F.spotUv, F.emboss, F.kraft, F.holo],
      faq: [
         { q: 'Can you design my business card?', a: 'Yes — upload your logo and details and our designers will create a layout for you to approve, or upload a finished design.' },
         { q: 'What file should I upload?', a: 'A print-ready PDF is best, with 3 mm bleed and text kept 3 mm inside the edge. AI, PSD and high-resolution PNG or JPG also work — we check every file.' },
         { q: 'Can I print on both sides?', a: 'Yes — every business card can be printed front and back, and foil or spot UV can be added to either side.' },
         { q: 'Can I match cards with my packaging?', a: 'Absolutely — that’s the Brand Launch Kit: rigid boxes, mailers and cards designed as one matching set.' },
      ],
   },
}

export const signatureContentFor = (c: Category) =>
   SIGNATURE_CONTENT[c.canonical ? `${c.canonical.departmentSlug}/${c.canonical.categorySlug}` : `${c.departmentSlug}/${c.slug}`]

export function SignatureFlagship({ category, content }: { category: Category; content: SignatureContent }) {
   const leadTime = category.products[0]?.preset.leadTime
   return (
      <section className="grain relative mt-20 overflow-hidden bg-[#120d0a] py-20 text-white sm:py-24">
         <div className="pointer-events-none absolute -right-32 -top-20 h-[420px] w-[420px] rounded-full bg-[#D9AE4F]/15 blur-[120px]" />
         <div className="page-shell relative">
            <p className="eyebrow text-[#F3D88C]">★ One of our Signature Three</p>
            <h2 className="mt-3 max-w-3xl font-display text-4xl font-extrabold leading-[0.98] tracking-[-0.04em] sm:text-6xl">
               Why our {category.name.toLowerCase()}{' '}
               <span className="bg-[linear-gradient(100deg,#F7E3A1,#D9AE4F_45%,#FFF1C4_60%,#C99A3E)] bg-clip-text pr-1 italic text-transparent">
                  stand apart.
               </span>
            </h2>

            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
               {content.why.map((w, i) => (
                  <li key={w.title} className="rounded-3xl bg-white/[0.04] p-6 ring-1 ring-white/10 transition duration-500 hover:-translate-y-1 hover:bg-white/[0.07]">
                     <span className="font-display text-sm font-bold tracking-[0.2em] text-[#D9AE4F]">0{i + 1}</span>
                     <h3 className="mt-4 text-lg font-bold">{w.title}</h3>
                     <p className="mt-2 text-sm leading-relaxed text-white/65">{w.text}</p>
                  </li>
               ))}
            </ul>

            <div className="mt-20 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
               <div>
                  <p className="eyebrow text-white/50">The finishing room</p>
                  <h3 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Pick a finish. Feel the difference.</h3>
                  <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                     {content.finishes.map((f) => (
                        <li key={f.name} className="group">
                           <span
                              className="btn-shine relative block aspect-[4/3] overflow-hidden rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,255,255,.08),0_20px_40px_-25px_rgba(0,0,0,.8)] transition duration-500 group-hover:-translate-y-1 group-hover:rotate-[-1.5deg]"
                              style={{ background: f.swatch }}
                           >
                              <span
                                 className={cn(
                                    'absolute bottom-2 left-3 font-display text-lg font-extrabold italic',
                                    f.ink === 'light' ? 'text-white/25' : 'text-black/15'
                                 )}
                              >
                                 JA
                              </span>
                           </span>
                           <span className="mt-2 block text-sm font-semibold">{f.name}</span>
                           <span className="block text-xs text-white/55">{f.note}</span>
                        </li>
                     ))}
                  </ul>
                  <ul className="mt-10 grid gap-3 text-sm text-white/75 sm:grid-cols-2">
                     {['Free artwork check by a human', 'Digital proof before printing', leadTime ? `Typical lead time ${leadTime}` : 'Fast turnaround', 'Tracked delivery to your door'].map((t) => (
                        <li key={t} className="flex items-center gap-2">
                           <Check className="h-4 w-4 shrink-0 text-[#D9AE4F]" /> {t}
                        </li>
                     ))}
                  </ul>
               </div>

               <div>
                  <p className="eyebrow text-white/50">Good to know</p>
                  <h3 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Questions, answered.</h3>
                  <div className="mt-8 divide-y divide-white/10 rounded-3xl bg-white/[0.04] ring-1 ring-white/10">
                     {content.faq.map((item, i) => (
                        <details key={item.q} className="group px-6 py-5" open={i === 0}>
                           <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                              {item.q}
                              <ChevronDown className="h-5 w-5 shrink-0 text-[#D9AE4F] transition-transform duration-300 group-open:rotate-180" />
                           </summary>
                           <p className="mt-3 text-sm leading-relaxed text-white/65">{item.a}</p>
                        </details>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}
