export function BlogBody({ content }: { content: string }) {
   const blocks = content.split('\n\n').filter(Boolean)

   return (
      <div className="prose prose-neutral max-w-none dark:prose-invert">
         {blocks.map((block, index) => {
            if (block.startsWith('## ')) {
               return (
                  <h2 key={index} className="mt-6 text-xl font-semibold">
                     {block.replace(/^##\s+/, '')}
                  </h2>
               )
            }

            if (block.includes('\n- ')) {
               const [intro, ...items] = block.split('\n')
               return (
                  <div key={index} className="mt-4">
                     {intro ? <p>{intro}</p> : null}
                     <ul className="mt-2 list-disc space-y-1 pl-6">
                        {items
                           .filter((line) => line.startsWith('- '))
                           .map((line, itemIndex) => (
                              <li key={itemIndex}>{line.replace(/^- /, '')}</li>
                           ))}
                     </ul>
                  </div>
               )
            }

            return (
               <p key={index} className="mt-4 leading-relaxed">
                  {block}
               </p>
            )
         })}
      </div>
   )
}
