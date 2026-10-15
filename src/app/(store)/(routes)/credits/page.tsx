import { listImageCredits } from '@/catalog/images'
import { ContentPage } from '@/components/native/content-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Photo credits',
   description: 'Photography used across the Joji Arts catalog.',
}

export default function CreditsPage() {
   const credits = listImageCredits()

   return (
      <ContentPage
         title="Photo credits"
         description="Catalog photography is provided by the talented photographers of Pixabay. Product photos are illustrative — your order is printed with your own design."
      >
         {credits.length ? (
            <ul className="!ml-0 grid list-none gap-x-6 gap-y-1 sm:grid-cols-2 [&_li]:!ml-0 [&_li]:list-none">
               {credits.map((c) => (
                  <li key={c.name}>
                     <a href={c.url} target="_blank" rel="noopener noreferrer">
                        {c.name}
                     </a>
                  </li>
               ))}
            </ul>
         ) : (
            <p>Photo credits will appear here once the catalog photography is synced.</p>
         )}
         <p>
            Photos via{' '}
            <a href="https://pixabay.com" target="_blank" rel="noopener noreferrer">
               Pixabay
            </a>
            .
         </p>
      </ContentPage>
   )
}
