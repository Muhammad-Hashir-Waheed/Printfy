import { RichText } from '@/components/store/rich-text'

/**
 * Renders the small Markdown subset used in static blog posts: ## and ### headings,
 * "- " bullet lists, "1. " numbered lists, and inline [links](/path) and **bold**.
 */
export function BlogBody({ content }: { content: string }) {
   const blocks = content.split('\n\n').filter(Boolean)

   return (
      <div className="prose prose-neutral max-w-none dark:prose-invert">
         {blocks.map((block, index) => {
            if (block.startsWith('### ')) {
               return (
                  <h3 key={index} className="mt-6 text-lg font-semibold">
                     {block.replace(/^###\s+/, '')}
                  </h3>
               )
            }

            if (block.startsWith('## ')) {
               return (
                  <h2 key={index} className="mt-8 text-xl font-semibold">
                     {block.replace(/^##\s+/, '')}
                  </h2>
               )
            }

            const lines = block.split('\n')
            const bullet = (l: string) => l.startsWith('- ')
            const numbered = (l: string) => /^\d+\.\s/.test(l)
            const listLines = lines.filter((l) => bullet(l) || numbered(l))
            if (listLines.length) {
               const intro = bullet(lines[0]) || numbered(lines[0]) ? null : lines[0]
               const ordered = numbered(listLines[0])
               const items = listLines.map((l) => l.replace(/^(- |\d+\.\s)/, '').replace(/\s+$/, ''))
               const List = ordered ? 'ol' : 'ul'
               return (
                  <div key={index} className="mt-4">
                     {intro ? (
                        <p>
                           <RichText text={intro} />
                        </p>
                     ) : null}
                     <List className={`mt-2 space-y-1 pl-6 ${ordered ? 'list-decimal' : 'list-disc'}`}>
                        {items.map((item, itemIndex) => (
                           <li key={itemIndex}>
                              <RichText text={item} />
                           </li>
                        ))}
                     </List>
                  </div>
               )
            }

            return (
               <p key={index} className="mt-4 leading-relaxed">
                  <RichText text={block} />
               </p>
            )
         })}
      </div>
   )
}
