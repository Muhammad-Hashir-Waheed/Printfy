'use client'

import { ALL_PRODUCTS, DEPARTMENTS, getProductByKey } from '@/catalog'
import config from '@/config/site'
import { copyText, mailto, makeReference } from '@/lib/mailto'
import { cn } from '@/lib/utils'
import { Check, ClipboardCopy, Mail } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'

type Form = {
   name: string
   email: string
   phone: string
   company: string
   department: string
   product: string
   quantity: string
   size: string
   deadline: string
   budget: string
   details: string
}

const input =
   'h-12 w-full rounded-2xl border border-input bg-white px-4 text-[15px] outline-none transition focus:border-ink focus:ring-4 focus:ring-ink/5'

export function QuoteForm() {
   const params = useSearchParams()
   const preset = getProductByKey(params.get('product') ?? '')

   const [form, setForm] = useState<Form>({
      name: '',
      email: '',
      phone: '',
      company: '',
      department: preset?.departmentSlug ?? '',
      product: preset?.name ?? '',
      quantity: '',
      size: '',
      deadline: '',
      budget: '',
      details: '',
   })
   const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({})
   const [sent, setSent] = useState<{ ref: string; text: string; href: string } | null>(null)
   const [copied, setCopied] = useState(false)

   const productOptions = useMemo(
      () => ALL_PRODUCTS.filter((p) => !form.department || p.departmentSlug === form.department).map((p) => p.name),
      [form.department]
   )

   const set = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((s) => ({ ...s, [key]: e.target.value }))

   function submit(e: React.FormEvent) {
      e.preventDefault()
      const next: Partial<Record<keyof Form, string>> = {}
      if (!form.name.trim()) next.name = 'Required'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email'
      if (!form.details.trim() && !form.product.trim()) next.details = 'Tell us what you need'
      setErrors(next)
      if (Object.keys(next).length) return

      const ref = makeReference('Q')
      const dept = DEPARTMENTS.find((d) => d.slug === form.department)?.name
      const text = [
         `Quote request ${ref}`,
         '',
         `Name: ${form.name}${form.company ? ` — ${form.company}` : ''}`,
         `Email: ${form.email}`,
         form.phone ? `Phone: ${form.phone}` : '',
         '',
         dept ? `Department: ${dept}` : '',
         form.product ? `Product: ${form.product}` : '',
         form.quantity ? `Quantity: ${form.quantity}` : '',
         form.size ? `Size / dimensions: ${form.size}` : '',
         form.deadline ? `Needed by: ${form.deadline}` : '',
         form.budget ? `Budget: ${form.budget}` : '',
         '',
         form.details,
      ]
         .filter((l, i, all) => l !== '' || all[i - 1] !== '')
         .join('\n')

      const href = mailto(config.email, `Quote request ${ref} — ${form.product || dept || 'Custom project'}`, text)
      setSent({ ref, text, href })
      window.location.href = href
   }

   if (sent) {
      return (
         <div className="rounded-[2rem] border bg-white p-8 text-center sm:p-12">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
               <Check className="h-8 w-8" />
            </span>
            <p className="eyebrow mt-6 text-muted-foreground">Reference {sent.ref}</p>
            <h2 className="display-md mt-2">Your quote request is ready</h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
               We opened your email app with everything filled in — just hit send (and attach photos or artwork if you have
               them). We reply within one business day.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
               <a href={sent.href} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-white">
                  <Mail className="h-4 w-4" /> Open email again
               </a>
               <button
                  type="button"
                  onClick={async () => setCopied(await copyText(sent.text))}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border px-6 font-semibold hover:border-ink"
               >
                  <ClipboardCopy className="h-4 w-4" /> {copied ? 'Copied!' : `Copy & send to ${config.email}`}
               </button>
            </div>
         </div>
      )
   }

   const field = (key: keyof Form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
      <div>
         <label htmlFor={key} className="mb-1.5 block text-sm font-medium">
            {label}
         </label>
         <input id={key} value={form[key]} onChange={set(key)} className={cn(input, errors[key] && 'border-red-500')} {...props} />
         {errors[key] ? <p className="mt-1 text-xs text-red-600">{errors[key]}</p> : null}
      </div>
   )

   return (
      <form onSubmit={submit} noValidate className="rounded-[2rem] border bg-white p-5 sm:p-8">
         <div className="grid gap-4 sm:grid-cols-2">
            {field('name', 'Your name *', { autoComplete: 'name' })}
            {field('company', 'Company', { autoComplete: 'organization' })}
            {field('email', 'Email *', { type: 'email', autoComplete: 'email' })}
            {field('phone', 'Phone', { type: 'tel', autoComplete: 'tel' })}

            <div>
               <label htmlFor="department" className="mb-1.5 block text-sm font-medium">
                  Department
               </label>
               <select id="department" value={form.department} onChange={set('department')} className={input}>
                  <option value="">Not sure / multiple</option>
                  {DEPARTMENTS.map((d) => (
                     <option key={d.slug} value={d.slug}>
                        {d.name}
                     </option>
                  ))}
               </select>
            </div>
            <div>
               <label htmlFor="product" className="mb-1.5 block text-sm font-medium">
                  Product
               </label>
               <input id="product" list="quote-products" value={form.product} onChange={set('product')} placeholder="e.g. Channel letters" className={input} />
               <datalist id="quote-products">
                  {productOptions.map((name) => (
                     <option key={name} value={name} />
                  ))}
               </datalist>
            </div>
            {field('quantity', 'Quantity', { placeholder: 'e.g. 500 pcs', inputMode: 'numeric' })}
            {field('size', 'Size / dimensions', { placeholder: 'e.g. 3 m × 1 m' })}
            {field('deadline', 'Needed by', { type: 'date' })}
            <div>
               <label htmlFor="budget" className="mb-1.5 block text-sm font-medium">
                  Budget (optional)
               </label>
               <select id="budget" value={form.budget} onChange={set('budget')} className={input}>
                  <option value="">Prefer not to say</option>
                  {['Under $500', '$500 – $2,000', '$2,000 – $10,000', '$10,000+'].map((b) => (
                     <option key={b}>{b}</option>
                  ))}
               </select>
            </div>
            <div className="sm:col-span-2">
               <label htmlFor="details" className="mb-1.5 block text-sm font-medium">
                  Project details *
               </label>
               <textarea
                  id="details"
                  rows={5}
                  value={form.details}
                  onChange={set('details')}
                  placeholder="Materials, colours, finishes, where it will be installed, links to inspiration…"
                  className={cn(
                     'w-full rounded-2xl border border-input bg-white p-4 text-[15px] outline-none focus:border-ink focus:ring-4 focus:ring-ink/5',
                     errors.details && 'border-red-500'
                  )}
               />
               {errors.details ? <p className="mt-1 text-xs text-red-600">{errors.details}</p> : null}
            </div>
         </div>
         <button
            type="submit"
            className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold text-white transition hover:bg-primary/90 sm:w-auto sm:px-10"
         >
            <Mail className="h-5 w-5" /> Send quote request
         </button>
         <p className="mt-3 text-xs text-muted-foreground">
            This opens your email app with your request filled in, addressed to {config.email}.
         </p>
      </form>
   )
}
