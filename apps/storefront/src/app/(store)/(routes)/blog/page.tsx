import { BlogPostCard } from '@/components/native/BlogCard'
import { getStaticBlogs } from '@/lib/static-blogs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Blog',
   description: 'Packaging tips for restaurants, e-commerce brands, and retailers.',
}

export default function BlogIndexPage() {
   const blogs = getStaticBlogs()

   return (
      <div className="mx-auto max-w-6xl px-1 py-6 sm:px-2 lg:px-0">
         <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Blog</h1>
            <p className="mt-2 text-muted-foreground">
               Tips on food packaging, mailers, artwork, and unboxing experiences.
            </p>
         </header>
         <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {blogs.map((post) => (
               <BlogPostCard key={post.slug} post={post} />
            ))}
         </div>
      </div>
   )
}
