import { BlogPostCard } from '@/components/native/BlogCard'
import { getStaticBlogs } from '@/lib/static-blogs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Ideas & guides',
   description: 'Packaging tips for restaurants, e-commerce brands, and retailers.',
}

export default function BlogIndexPage() {
   const blogs = getStaticBlogs()

   return (
      <div className="page-shell pb-10 pt-10">
         <header className="mb-10 max-w-2xl">
            <p className="eyebrow text-primary">Ideas & guides</p>
            <h1 className="display-lg mt-3">The Joji Arts journal</h1>
            <p className="mt-4 text-[17px] text-muted-foreground">
               Tips on packaging, print, artwork and making your brand stand out.
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
