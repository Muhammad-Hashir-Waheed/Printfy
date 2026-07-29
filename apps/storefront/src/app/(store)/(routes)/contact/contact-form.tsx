'use client'

import { ContentPage } from '@/components/native/content-page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

export function ContactForm() {
   const [sent, setSent] = useState(false)

   return (
      <ContentPage
         title="Contact"
         description="Questions about packaging orders, artwork, lead times, or bulk quotes? Send us a message."
      >
         <h2>Email & response time</h2>
         <p>
            Email{' '}
            <a href="mailto:support@store.com">support@store.com</a>. We typically reply within 1
            business day. For faster updates on an existing order, include your order number.
         </p>

         <h2>Send a message</h2>
         {sent ? (
            <p className="rounded-lg border border-green-600/40 bg-green-500/10 p-4 text-foreground">
               Thanks — your message was recorded. Our team will follow up by email shortly.
            </p>
         ) : (
            <form
               className="space-y-4"
               onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
               }}
            >
               <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                     <label htmlFor="name" className="text-sm font-medium text-foreground">
                        Name
                     </label>
                     <Input id="name" name="name" required placeholder="Your name" />
                  </div>
                  <div className="space-y-1.5">
                     <label htmlFor="email" className="text-sm font-medium text-foreground">
                        Email
                     </label>
                     <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@company.com"
                     />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-sm font-medium text-foreground">
                     Subject
                  </label>
                  <Input
                     id="subject"
                     name="subject"
                     required
                     placeholder="Order question, artwork, bulk quote…"
                  />
               </div>
               <div className="space-y-1.5">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                     Message
                  </label>
                  <Textarea
                     id="message"
                     name="message"
                     required
                     rows={6}
                     placeholder="Tell us what you need…"
                  />
               </div>
               <Button type="submit" className="rounded-2xl bg-red-600 hover:bg-red-700">
                  Send message
               </Button>
            </form>
         )}

         <h2>Other ways to reach us</h2>
         <ul>
            <li>
               <a href="/telegram">Telegram support channel</a>
            </li>
            <li>
               <a href="/faq">Frequently asked questions</a>
            </li>
         </ul>
      </ContentPage>
   )
}
