import { BlogPostCard } from '@/components/native/BlogCard'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const fallbackBlogs = [
   {
      slug: 'how-to-build-merch-brand',
      title: 'How to build your merch brand in 7 days',
      description: 'A practical launch checklist for creators.',
      image:
         'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1200&auto=format&fit=crop',
      author: { name: 'Fannify Team' },
      createdAt: new Date().toISOString(),
   },
]

export default async function Index() {
   let blogs: typeof fallbackBlogs = []

   try {
      const rows = await prisma.blog.findMany({
         include: { author: true },
      })
      blogs = rows.map((post) => ({
         ...post,
         createdAt:
            post.createdAt instanceof Date
               ? post.createdAt.toISOString()
               : post.createdAt,
      }))
   } catch (error) {
      console.error('[BLOG_PAGE]', error)
   }

   const safeBlogs = blogs.length > 0 ? blogs : fallbackBlogs

   return (
      <div className="flex flex-col border-neutral-200 dark:border-neutral-700">
         <h3 className="mb-6 text-2xl font-bold tracking-tight md:text-4xl">
            Blog Posts
         </h3>
         <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {safeBlogs.map((post) => (
               <BlogPostCard key={post.slug} post={post} />
            ))}
         </div>
      </div>
   )
}
