export type StaticBlogPost = {
   slug: string
   title: string
   description: string
   image: string
   content: string
   author: { name: string }
   createdAt: string
   updatedAt: string
}

export const STATIC_BLOGS: StaticBlogPost[] = [
   {
      slug: 'how-to-build-merch-brand',
      title: 'How to build your merch brand in 7 days',
      description: 'A practical launch checklist for creators.',
      image:
         'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1200&auto=format&fit=crop',
      author: { name: 'Fannify Team' },
      createdAt: '2025-01-10T00:00:00.000Z',
      updatedAt: '2025-01-10T00:00:00.000Z',
      content: `## Launch fast

Pick **3 hero products** (tee, mug, tote), upload clean artwork, and publish your store the same week.

## Checklist

- Define your niche and price floor
- Use high-resolution PNG/SVG art (300 DPI for print)
- Order a sample before scaling ads`,
   },
   {
      slug: 'best-products-for-first-store',
      title: 'Best print products for your first store',
      description: 'Simple, high-conversion catalog picks.',
      image:
         'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop',
      author: { name: 'Fannify Team' },
      createdAt: '2025-01-15T00:00:00.000Z',
      updatedAt: '2025-01-15T00:00:00.000Z',
      content: `## Starter catalog

1. **Classic crew tee** — highest margin, easy designs  
2. **Ceramic mug** — great for gifts and corporate  
3. **Canvas tote** — strong brand visibility  

Keep variants simple: 2–3 colors max until you have sales data.`,
   },
   {
      slug: 'how-to-design-for-print',
      title: 'Design rules for crisp print quality',
      description: 'Avoid blurry prints and improve outcomes.',
      image:
         'https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=1200&auto=format&fit=crop',
      author: { name: 'Fannify Team' },
      createdAt: '2025-02-01T00:00:00.000Z',
      updatedAt: '2025-02-01T00:00:00.000Z',
      content: `## Resolution

Export at **300 DPI** at print size. Avoid upscaling small logos.

## Color

Use sRGB files. Very dark blacks on cotton can look washed out — boost contrast slightly.

## Safe area

Keep text and logos **0.25 in** inside the print boundary on apparel.`,
   },
]

export function getStaticBlogs(): StaticBlogPost[] {
   return STATIC_BLOGS
}

export function getStaticBlog(slug: string): StaticBlogPost | null {
   return STATIC_BLOGS.find((post) => post.slug === slug) ?? null
}
