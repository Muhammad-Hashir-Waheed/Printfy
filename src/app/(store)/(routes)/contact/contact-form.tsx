'use client'

import { ContentPage } from '@/components/native/content-page'
import config from '@/config/site'
import { mailto } from '@/lib/mailto'
import Link from 'next/link'
import { useState } from 'react'

const input =
   'h-12 w-full rounded-2xl border border-input bg-white px-4 text-[15px] outline-none transition focus:border-ink focus:ring-4 focus:ring-ink/5'

export function ContactForm() {
   const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
   const [opened, setOpened] = useState(false)

   const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((s) => ({ ...s, [key]: e.target.value }))

   return (
      <ContentPage
         title="Contact us"
         description="Questions about an order, artwork, lead times or a custom project? We're here to help."
      >
         <div className="grid gap-4 sm:grid-cols-2">
            <a
               href={`mailto:${config.email}`}
               className="!no-underline rounded-3xl bg-white p-5 ring-1 ring-black/5 transition hover:ring-ink"
            >
               <span className="block text-sm text-muted-foreground">Email</span>
               <span className="mt-1 block font-display text-lg font-bold text-foreground">{config.email}</span>
               <span className="mt-1 block text-sm text-muted-foreground">Replies within 1 business day</span>
            </a>
            <Link href="/quote" className="!no-underline rounded-3xl bg-ink p-5 text-white transition hover:bg-ink/90">
               <span className="block text-sm text-white/60">Custom project?</span>
               <span className="mt-1 block font-display text-lg font-bold text-white">Request a quote →</span>
               <span className="mt-1 block text-sm text-white/60">Sizes, finishes, signage & bulk</span>
            </Link>
         </div>

         <h2>Send a message</h2>
         <form
            className="space-y-4"
            onSubmit={(e) => {
               e.preventDefault()
               const body = `${form.message}\n\n— ${form.name} (${form.email})`
               window.location.href = mailto(config.email, form.subject || 'Website enquiry', body)
               setOpened(true)
            }}
         >
            <div className="grid gap-4 sm:grid-cols-2">
               <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                     Name
                  </label>
                  <input id="name" required value={form.name} onChange={set('name')} autoComplete="name" className={input} />
               </div>
               <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                     Email
                  </label>
                  <input id="email" type="email" required value={form.email} onChange={set('email')} autoComplete="email" className={input} />
               </div>
            </div>
            <div>
               <label htmlFor="subject" className="mb-1.5 block text-sm font-medium">
                  Subject
               </label>
               <input id="subject" required value={form.subject} onChange={set('subject')} placeholder="Order question, artwork, bulk quote…" className={input} />
            </div>
            <div>
               <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
                  Message
               </label>
               <textarea
                  id="message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={set('message')}
                  placeholder="Tell us what you need…"
                  className="w-full rounded-2xl border border-input bg-white p-4 text-[15px] outline-none focus:border-ink focus:ring-4 focus:ring-ink/5"
               />
            </div>
            <button type="submit" className="inline-flex h-12 items-center rounded-full bg-primary px-8 font-semibold text-white hover:bg-primary/90">
               Send message
            </button>
            {opened ? (
               <p className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
                  Your email app should have opened with the message ready to send. If it didn&apos;t, email us directly at{' '}
                  <a href={`mailto:${config.email}`}>{config.email}</a>.
               </p>
            ) : null}
         </form>

         <h2>Before you write</h2>
         <ul>
            <li>
               Check the <Link href="/faq">FAQ & artwork guide</Link> — most questions are answered there.
            </li>
            <li>For an existing order, include your order reference (it starts with “JA-”).</li>
         </ul>
      </ContentPage>
   )
}
