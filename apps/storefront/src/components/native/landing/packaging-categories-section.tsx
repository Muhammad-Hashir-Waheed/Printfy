import { PACKAGING_CATEGORIES } from '@/lib/packaging-categories'
import Link from 'next/link'

/** Every packaging category as a clickable card with 3 related images */
export function PackagingCategoriesSection() {
   return (
      <section className="my-10">
         <div className="mx-auto max-w-6xl px-1 sm:px-2 lg:px-0">
            <div className="mb-6">
               <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                  Shop packaging by category
               </h2>
               <p className="mt-1 text-sm text-muted-foreground">
                  Click any category to open its gallery — each includes multiple related products
                  and images.
               </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
               {PACKAGING_CATEGORIES.map((category) => (
                  <Link
                     key={category.id}
                     href={category.href}
                     className="group overflow-hidden rounded-xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                     <div className="grid grid-cols-3 gap-0.5 bg-muted p-0.5">
                        {category.images.map((image, index) => (
                           <div
                              key={`${category.id}-${index}`}
                              className="relative aspect-square overflow-hidden"
                           >
                              <img
                                 src={image}
                                 alt={`${category.title} example ${index + 1}`}
                                 className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                                 loading="lazy"
                              />
                           </div>
                        ))}
                     </div>
                     <div className="space-y-1 p-3">
                        <p className="text-sm font-semibold text-foreground group-hover:text-red-600">
                           {category.title}
                        </p>
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                           {category.description}
                        </p>
                     </div>
                  </Link>
               ))}
            </div>
         </div>
      </section>
   )
}
