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
      slug: 'choose-food-packaging',
      title: 'How to choose food packaging for your restaurant',
      description: 'Pizza boxes, burger boxes, fries cartons, and bags that protect food and show your brand.',
      image:
         'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1200&auto=format&fit=crop',
      author: { name: 'Printfy Team' },
      createdAt: '2025-01-10T00:00:00.000Z',
      updatedAt: '2025-01-10T00:00:00.000Z',
      content: `## Start with the menu

Match packaging to how food is served:

- **Pizza** → corrugated pizza boxes with grease resistance
- **Burgers & sandwiches** → clamshell or hinged burger boxes
- **Sides** → fries cartons and scoop trays
- **Drinks** → paper cups + carriers

## Branding basics

Print your logo on the lid or front panel. Keep artwork high-contrast and leave a safe margin so nothing gets trimmed.

## Order the right sizes

List your top SKUs and order 2–3 sizes max at first. Reorder based on what sells.`,
   },
   {
      slug: 'mailer-boxes-unboxing',
      title: 'Mailer boxes that improve unboxing',
      description: 'Turn shipping into a brand moment with mailers, tissue, and inserts.',
      image:
         'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop',
      author: { name: 'Printfy Team' },
      createdAt: '2025-01-15T00:00:00.000Z',
      updatedAt: '2025-01-15T00:00:00.000Z',
      content: `## Build an unboxing kit

1. **Mailer box** — outer branded shell  
2. **Tissue paper** — soft wrap with logo repeat  
3. **Insert card** — thank-you or care instructions  
4. **Sticker seal** — closure stamp for a finished look  

## Tips

Use rigid or magnetic boxes for premium products. Keep shipping boxes sturdy for multi-item orders.`,
   },
   {
      slug: 'artwork-for-packaging-print',
      title: 'Artwork rules for crisp packaging print',
      description: 'File specs, color tips, and safe areas for boxes, bags, and labels.',
      image:
         'https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=1200&auto=format&fit=crop',
      author: { name: 'Printfy Team' },
      createdAt: '2025-02-01T00:00:00.000Z',
      updatedAt: '2025-02-01T00:00:00.000Z',
      content: `## Resolution

Export artwork at **300 DPI** at final print size. Avoid enlarging small logos.

## Color

Use sRGB for web uploads. Very thin lines may fill in on kraft stock — thicken strokes slightly.

## Safe area

Keep logos and text away from folds, windows, and die-cut edges. Leave at least **0.25 in** clearance when possible.`,
   },
]

export function getStaticBlogs(): StaticBlogPost[] {
   return STATIC_BLOGS
}

export function getStaticBlog(slug: string): StaticBlogPost | null {
   return STATIC_BLOGS.find((post) => post.slug === slug) ?? null
}
