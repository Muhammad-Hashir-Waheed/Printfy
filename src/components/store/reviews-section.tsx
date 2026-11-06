import type { ReviewsData } from '@/lib/google-reviews'
import { cn } from '@/lib/utils'
import { ArrowUpRight, PenLine, Star } from 'lucide-react'

function Stars({ rating, className }: { rating: number; className?: string }) {
   return (
      <span className={cn('inline-flex gap-0.5', className)} role="img" aria-label={`${rating} out of 5 stars`}>
         {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} aria-hidden className={cn('h-4 w-4', n <= Math.floor(rating + 0.25) ? 'fill-[#FBBC04] text-[#FBBC04]' : 'fill-ink/10 text-ink/10')} />
         ))}
      </span>
   )
}

/** "What our customers say": real Google reviews only. Renders nothing without data. */
export function ReviewsSection({ data }: { data: ReviewsData | null }) {
   if (!data?.reviews.length) return null
   const { rating, count, reviews } = data

   return (
      <section className="page-shell py-16 sm:py-20" aria-labelledby="reviews-title">
         <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
               <p className="eyebrow text-primary">Reviews from Google</p>
               <h2 id="reviews-title" className="display-lg mt-3">
                  What our customers say
               </h2>
               {rating ? (
                  <p className="mt-3 flex flex-wrap items-center gap-2 text-[15px] font-medium text-foreground/80">
                     <span className="font-display text-2xl font-extrabold text-ink">{rating.toFixed(1)}</span>
                     <Stars rating={rating} />
                     <span>on Google{count ? ` · ${count.toLocaleString('en-US')} reviews` : ''}</span>
                  </p>
               ) : null}
            </div>
            <div className="flex flex-wrap gap-3">
               <a
                  href={data.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-ink/90"
               >
                  Read all reviews on Google <ArrowUpRight className="h-4 w-4" />
               </a>
               <a
                  href={data.writeReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-ink/15 bg-white px-5 text-sm font-semibold transition hover:border-ink"
               >
                  <PenLine className="h-4 w-4" /> Leave us a review
               </a>
            </div>
         </div>

         <ul className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
            {reviews.map((r, i) => (
               <li key={`${r.author}-${i}`} className="w-[85%] max-w-[360px] shrink-0 snap-start md:w-auto md:max-w-none">
                  <article className="flex h-full flex-col rounded-3xl border bg-white p-6 shadow-sm">
                     <Stars rating={r.rating} />
                     <p className="mt-4 line-clamp-5 flex-1 text-[15px] leading-relaxed text-foreground/85">{r.text}</p>
                     <footer className="mt-5 flex items-center gap-3 border-t pt-4">
                        {r.photo ? (
                           // eslint-disable-next-line @next/next/no-img-element -- Google's photo URL, shown as returned
                           <img src={r.photo} alt="" width={36} height={36} loading="lazy" referrerPolicy="no-referrer" className="h-9 w-9 rounded-full object-cover" />
                        ) : (
                           <span aria-hidden className="grid h-9 w-9 place-items-center rounded-full bg-muted text-sm font-bold text-foreground/60">
                              {r.author.charAt(0)}
                           </span>
                        )}
                        <span className="min-w-0">
                           {r.authorUrl ? (
                              <a href={r.authorUrl} target="_blank" rel="noopener noreferrer" className="block truncate text-sm font-semibold hover:underline">
                                 {r.author}
                              </a>
                           ) : (
                              <span className="block truncate text-sm font-semibold">{r.author}</span>
                           )}
                           <span className="block text-xs text-muted-foreground">{r.date}</span>
                        </span>
                     </footer>
                  </article>
               </li>
            ))}
         </ul>
      </section>
   )
}
