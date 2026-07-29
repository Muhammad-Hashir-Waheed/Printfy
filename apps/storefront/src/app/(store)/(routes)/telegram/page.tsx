import { ContentPage } from '@/components/native/content-page'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
   title: 'Telegram',
   description: 'Join our Telegram channel for packaging order support and updates.',
}

/** Replace with your real Telegram invite when ready */
const TELEGRAM_URL = 'https://t.me/'

export default function TelegramPage() {
   return (
      <ContentPage
         title="Telegram support"
         description="Get packaging order help, production tips, and announcements in our Telegram channel."
      >
         <h2>Why Telegram?</h2>
         <p>
            Use Telegram for quick questions about artwork, lead times, and order status. For
            detailed quotes or account issues, email is still best via the Contact page.
         </p>

         <h2>Join the channel</h2>
         <p>
            Tap the button below to open Telegram. If the invite link is not configured yet, email{' '}
            <a href="mailto:support@store.com">support@store.com</a> and we will add you.
         </p>

         <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild className="rounded-2xl bg-red-600 hover:bg-red-700">
               <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">
                  Open Telegram
               </a>
            </Button>
            <Button asChild variant="outline" className="rounded-2xl">
               <Link href="/contact">Contact by email</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-2xl">
               <Link href="/faq">Read FAQ</Link>
            </Button>
         </div>

         <h2>What to include</h2>
         <ul>
            <li>Your order number (if you have one)</li>
            <li>Product name and quantity</li>
            <li>Artwork questions or file format</li>
         </ul>
      </ContentPage>
   )
}
