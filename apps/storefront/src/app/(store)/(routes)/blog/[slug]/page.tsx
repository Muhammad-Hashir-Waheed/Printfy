import { Separator } from '@/components/native/separator'
import { getStaticBlog, getStaticBlogs, type StaticBlogPost } from '@/lib/static-blogs'
import { BlogBody } from './components/blog-body'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function BlogPostPage({
   params,
}: {
   params: { slug: string }
}) {
   const blog = getStaticBlog(params.slug)
   if (!blog) {
      notFound()
   }

   const recommendations = getStaticBlogs()
      .filter((post) => post.slug !== blog.slug)
      .slice(0, 3)

   return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
         <Content blog={blog} />
         <Recommendations recommendations={recommendations} />
      </div>
   )
}

function Content({ blog }: { blog: StaticBlogPost }) {
   return (
      <div className="rounded-lg bg-white p-6 text-justify text-neutral-900 dark:bg-neutral-800 dark:text-neutral-200 md:col-span-3">
         <h1 className="mb-1 text-3xl font-medium">{blog.title}</h1>
         <p className="mt-2 text-sm font-medium text-neutral-400">
            {blog.author.name} · {new Date(blog.updatedAt).toLocaleDateString()}
         </p>
         <Separator />
         <BlogBody content={blog.content} />
      </div>
   )
}

function Recommendations({
   recommendations,
}: {
   recommendations: ReturnType<typeof getStaticBlogs>
}) {
   return (
      <div className="col-span-1">
         {recommendations.map((rec) => (
            <div key={rec.slug} className="mb-4 w-full">
               <Link href={`/blog/${rec.slug}`}>
                  <div className="w-full rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                     <div className="relative h-40 w-full">
                        <Image
                           className="rounded-t-lg"
                           src={rec.image}
                           alt={rec.title}
                           fill
                           sizes="(min-width: 1000px) 30vw, 50vw"
                           style={{ objectFit: 'cover' }}
                        />
                     </div>
                     <div className="p-5">
                        <h5 className="mb-3 text-justify font-medium tracking-tight text-neutral-900 dark:text-white">
                           {rec.title}
                        </h5>
                        <p className="block text-sm text-neutral-700 dark:text-neutral-400">
                           {rec.author.name}
                        </p>
                     </div>
                  </div>
               </Link>
            </div>
         ))}
      </div>
   )
}
