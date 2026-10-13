import config from '@/config/site'
import { units } from '@/lib/money'
import { CUSTOMER_STEPS, STATUS_META, type Submission, type SubmissionStatus } from '@/studio/types'

/**
 * Email templates — table layout + inline styles so they render in Gmail,
 * Outlook, Apple Mail and mobile clients. Every email also has a text version.
 */

const C = {
   ink: '#16110F',
   paper: '#FAF7F2',
   red: '#D42F25',
   muted: '#6B625C',
   line: '#ECE5DC',
   green: '#1F9D55',
}

const esc = (s: string) =>
   s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const nl2br = (s: string) => esc(s).replace(/\n/g, '<br>')

export type Links = { base: string; review: string; admin: string }

export function linksFor(s: Submission, base: string): Links {
   const b = base.replace(/\/$/, '')
   return {
      base: b,
      review: `${b}/design-review/${s.id}?t=${encodeURIComponent(s.accessToken)}`,
      admin: `${b}/admin/submissions/${s.id}`,
   }
}

function previewUrl(s: Submission, links: Links, fileId: string) {
   return `${links.base}/api/files/${fileId}?part=preview&s=${s.id}&a=${encodeURIComponent(s.accessToken)}`
}

/* ───────────── Building blocks ───────────── */

const mark = `<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="background:${C.red};border-radius:9px;width:36px;height:36px;text-align:center;vertical-align:middle;font:800 15px/36px Arial,Helvetica,sans-serif;color:#fff;letter-spacing:-0.5px">JA</td>
<td style="padding-left:10px;font:800 19px/1 Arial,Helvetica,sans-serif;color:${C.ink};letter-spacing:-0.5px">Joji <span style="font-weight:500;color:${C.muted}">Arts</span></td>
</tr></table>`

function button(href: string, label: string, color = C.ink) {
   return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 8px"><tr>
<td style="border-radius:999px;background:${color}">
<a href="${esc(href)}" target="_blank" style="display:inline-block;padding:15px 30px;font:700 15px/1 Arial,Helvetica,sans-serif;color:#fff;text-decoration:none;border-radius:999px">${label}</a>
</td></tr></table>`
}

function stepper(status: SubmissionStatus) {
   const effective = status === 'changes_requested' ? 'in_review' : status === 'archived' ? 'completed' : status
   const current = CUSTOMER_STEPS.indexOf(effective)
   const cells = CUSTOMER_STEPS.map((step, i) => {
      const done = i < current || status === 'completed'
      const active = i === current && status !== 'completed'
      const bg = done ? C.green : active ? (status === 'changes_requested' ? C.red : C.ink) : '#E7E1D9'
      const fg = done || active ? '#fff' : C.muted
      const label = active && status === 'changes_requested' ? 'Action needed' : STATUS_META[step].customerLabel
      return `<td align="center" valign="top" style="width:20%;padding:0 2px">
<div style="width:28px;height:28px;border-radius:999px;background:${bg};color:${fg};font:700 13px/28px Arial,Helvetica,sans-serif;text-align:center;margin:0 auto">${done ? '&#10003;' : i + 1}</div>
<div style="font:600 11px/1.3 Arial,Helvetica,sans-serif;color:${done || active ? C.ink : C.muted};margin-top:6px">${label}</div>
</td>`
   }).join('')
   return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};border-radius:14px;padding:16px 8px;margin:24px 0"><tr>${cells}</tr></table>`
}

function itemsTable(s: Submission, links: Links) {
   if (!s.items.length && !s.attachments.length) return ''
   const rows = s.items
      .map((item) => {
         const thumbId = item.artwork.fileIds.find((id) => s.files[id]?.hasPreview)
         const thumb = thumbId
            ? `<img src="${esc(previewUrl(s, links, thumbId))}" width="64" height="64" alt="" style="display:block;width:64px;height:64px;object-fit:contain;border-radius:10px;background:#f2eee8;border:1px solid ${C.line}">`
            : `<div style="width:64px;height:64px;border-radius:10px;background:#f2eee8;border:1px solid ${C.line};text-align:center;font:700 11px/64px Arial,Helvetica,sans-serif;color:${C.muted}">${item.artwork.mode === 'design' ? 'DESIGN' : item.artwork.fileIds.length ? 'FILE' : 'LATER'}</div>`
         const art =
            item.artwork.mode === 'upload'
               ? `${item.artwork.fileIds.length} file${item.artwork.fileIds.length === 1 ? '' : 's'} uploaded`
               : item.artwork.mode === 'design'
                 ? 'Our designers will create your artwork'
                 : 'Artwork to follow'
         return `<tr>
<td style="padding:12px 0;border-top:1px solid ${C.line};width:76px" valign="top">${thumb}</td>
<td style="padding:12px 0;border-top:1px solid ${C.line}" valign="top">
<div style="font:700 15px/1.3 Arial,Helvetica,sans-serif;color:${C.ink}">${esc(item.productName)}</div>
<div style="font:13px/1.5 Arial,Helvetica,sans-serif;color:${C.muted}">${esc(units(item.qty, item.unitLabel))} · ${esc(Object.values(item.selections).join(' · '))}</div>
<div style="font:600 12px/1.5 Arial,Helvetica,sans-serif;color:${C.ink};margin-top:2px">${art}</div>
</td></tr>`
      })
      .join('')
   const attachments = s.attachments.length
      ? `<tr><td colspan="2" style="padding:12px 0;border-top:1px solid ${C.line};font:13px/1.5 Arial,Helvetica,sans-serif;color:${C.muted}">📎 ${s.attachments.length} file${s.attachments.length === 1 ? '' : 's'} attached to your request</td></tr>`
      : ''
   return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px">${rows}${attachments}</table>`
}

function quote(text: string, accent = C.red) {
   return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0"><tr>
<td style="border-left:4px solid ${accent};background:${C.paper};border-radius:0 12px 12px 0;padding:14px 18px;font:15px/1.6 Arial,Helvetica,sans-serif;color:${C.ink}">${nl2br(text)}</td>
</tr></table>`
}

function layout({ preheader, body, footerNote }: { preheader: string; body: string; footerNote?: string }) {
   return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(config.name)}</title></head>
<body style="margin:0;padding:0;background:#EFEAE3">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EFEAE3"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
<tr><td style="padding:0 8px 18px">${mark}</td></tr>
<tr><td style="background:#ffffff;border-radius:22px;padding:36px 32px;box-shadow:0 1px 2px rgba(0,0,0,.04)">${body}</td></tr>
<tr><td style="padding:22px 12px;font:12px/1.6 Arial,Helvetica,sans-serif;color:${C.muted};text-align:center">
${footerNote ? `${footerNote}<br>` : ''}Questions? Just reply to this email or write to <a href="mailto:${config.email}" style="color:${C.ink}">${config.email}</a>.<br>
© ${new Date().getFullYear()} ${esc(config.name)} · Packaging, print &amp; signage
</td></tr>
</table></td></tr></table></body></html>`
}

const h1 = (t: string) => `<h1 style="margin:0 0 10px;font:800 28px/1.15 Arial,Helvetica,sans-serif;color:${C.ink};letter-spacing:-0.5px">${t}</h1>`
const p = (t: string) => `<p style="margin:0 0 12px;font:15px/1.65 Arial,Helvetica,sans-serif;color:${C.muted}">${t}</p>`
const pill = (t: string) =>
   `<div style="display:inline-block;margin:0 0 18px;padding:6px 12px;border-radius:999px;background:${C.paper};font:700 11px/1 Arial,Helvetica,sans-serif;letter-spacing:1.5px;color:${C.muted};text-transform:uppercase">${t}</div>`

const first = (name: string) => esc(name.trim().split(/\s+/)[0] || 'there')

/* ───────────── Customer emails ───────────── */

export function customerReceived(s: Submission, links: Links) {
   const subject = `We've got your design — ${s.reference}`
   const html = layout({
      preheader: `Track your ${s.source === 'quote' ? 'quote request' : 'design'} any time with your private link.`,
      body: `${pill(`Reference ${s.reference}`)}
${h1(`Thanks, ${first(s.customer.name)}! 🎨`)}
${p(`Your ${s.source === 'quote' ? 'quote request' : 'design request'} is safely with our studio. A designer will check every file and come back to you within <b style="color:${C.ink}">one business day</b> with ${config.showPrices ? 'a proof and payment link' : 'pricing and a proof'}.`)}
${stepper(s.status)}
${itemsTable(s, links)}
${button(links.review, 'Track my design &nbsp;→', C.red)}
${p(`<span style="font-size:13px">This link is private to you — bookmark it to see your artwork, status updates and messages from our team, or to send us a revised file.</span>`)}`,
      footerNote: `You're receiving this because you sent a request on ${esc(config.name)}.`,
   })
   const text = [
      `Thanks, ${s.customer.name.split(' ')[0]}!`,
      '',
      `We've received your ${s.source === 'quote' ? 'quote request' : 'design request'} (${s.reference}).`,
      'A designer will reply within one business day.',
      '',
      ...s.items.map((i) => `- ${i.productName} — ${units(i.qty, i.unitLabel)}`),
      '',
      `Track your design: ${links.review}`,
      '',
      `— ${config.name}`,
   ].join('\n')
   return { subject, html, text }
}

const UPDATE_COPY: Partial<Record<SubmissionStatus, { subject: string; title: string; intro: string; cta: string; color?: string }>> = {
   in_review: {
      subject: 'A designer is reviewing your artwork',
      title: 'Your artwork is in review 👀',
      intro: 'One of our designers is checking your files for print quality, size and colour right now.',
      cta: 'View my design',
   },
   changes_requested: {
      subject: 'Action needed: a small change to your artwork',
      title: 'A quick tweak is needed ✏️',
      intro: 'Our designer spotted something that needs adjusting before we can print. You can upload a revised file straight from your design page.',
      cta: 'Upload a revised file',
      color: C.red,
   },
   approved: {
      subject: 'Your artwork is approved 🎉',
      title: 'Approved — looking great! 🎉',
      intro: 'Your artwork passed our checks and is ready for production. We’ll be in touch about the next steps.',
      cta: 'View my design',
      color: C.green,
   },
   in_production: {
      subject: 'Your order is in production',
      title: 'Now in production 🏭',
      intro: 'Your design is being printed / fabricated. We’ll let you know as soon as it’s ready.',
      cta: 'Track progress',
   },
   completed: {
      subject: 'Your order is complete ✅',
      title: 'All done — thank you! ✅',
      intro: 'Your order is complete. We hope you love it — we’d be glad to help with your next project.',
      cta: 'View my design',
      color: C.green,
   },
}

export function customerStatusUpdate(s: Submission, links: Links, status: SubmissionStatus, message?: string) {
   const copy = UPDATE_COPY[status]
   if (!copy) return null
   const subject = `${copy.subject} — ${s.reference}`
   const html = layout({
      preheader: copy.intro,
      body: `${pill(`Reference ${s.reference}`)}
${h1(copy.title)}
${p(`Hi ${first(s.customer.name)}, ${copy.intro.charAt(0).toLowerCase()}${copy.intro.slice(1)}`)}
${message ? quote(message, copy.color ?? C.red) : ''}
${stepper(status)}
${button(links.review, `${copy.cta} &nbsp;→`, copy.color ?? C.ink)}`,
   })
   const text = [`Hi ${s.customer.name.split(' ')[0]},`, '', copy.intro, ...(message ? ['', `"${message}"`] : []), '', `${copy.cta}: ${links.review}`, '', `— ${config.name}`].join('\n')
   return { subject, html, text }
}

export function customerMessage(s: Submission, links: Links, message: string) {
   const subject = `New message from our studio — ${s.reference}`
   const html = layout({
      preheader: message.slice(0, 120),
      body: `${pill(`Reference ${s.reference}`)}
${h1('You have a new message 💬')}
${p(`Hi ${first(s.customer.name)}, our team sent you an update about your design:`)}
${quote(message)}
${button(links.review, 'Reply on my design page &nbsp;→')}`,
   })
   const text = [`Hi ${s.customer.name.split(' ')[0]},`, '', 'Our team sent you a message:', '', message, '', `Reply here: ${links.review}`, '', `— ${config.name}`].join('\n')
   return { subject, html, text }
}

/* ───────────── Team emails ───────────── */

export function teamNewSubmission(s: Submission, links: Links) {
   const c = s.customer
   const fileCount = Object.keys(s.files).length
   const subject = `🎨 New ${s.source === 'quote' ? 'quote request' : 'design'} from ${c.name} — ${s.reference}`
   const details = [
      ['Customer', `${esc(c.name)}${c.company ? ` · ${esc(c.company)}` : ''}`],
      ['Email', `<a href="mailto:${esc(c.email)}" style="color:${C.ink}">${esc(c.email)}</a>`],
      ...(c.phone ? [['Phone', esc(c.phone)]] : []),
      ...(c.city || c.country ? [['Location', esc([c.city, c.country].filter(Boolean).join(', '))]] : []),
      ['Files', `${fileCount}`],
   ]
      .map(
         ([k, v]) =>
            `<tr><td style="padding:6px 0;font:13px Arial,Helvetica,sans-serif;color:${C.muted};width:90px">${k}</td><td style="padding:6px 0;font:600 14px Arial,Helvetica,sans-serif;color:${C.ink}">${v}</td></tr>`
      )
      .join('')
   const html = layout({
      preheader: `${c.name} sent ${s.items.length || 'a'} item(s) with ${fileCount} file(s).`,
      body: `${pill('Design Studio · new request')}
${h1(`New ${s.source === 'quote' ? 'quote request' : 'design'} 🎨`)}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 16px">${details}</table>
${c.notes ? quote(c.notes, C.ink) : ''}
${s.details ? quote(s.details, C.ink) : ''}
${itemsTable(s, links)}
${button(links.admin, 'Review in Design Studio &nbsp;→')}`,
      footerNote: 'Internal notification for the Joji Arts team.',
   })
   const text = [`New ${s.source} from ${c.name} (${c.email}) — ${s.reference}`, '', ...s.items.map((i) => `- ${i.productName} — ${units(i.qty, i.unitLabel)}`), '', `Review: ${links.admin}`].join('\n')
   return { subject, html, text, replyTo: c.email }
}

export function teamCustomerReply(s: Submission, links: Links, message: string | undefined, revisedFiles: number) {
   const subject = `${revisedFiles ? '📎 Revised artwork' : '💬 New reply'} from ${s.customer.name} — ${s.reference}`
   const html = layout({
      preheader: message?.slice(0, 120) ?? 'The customer uploaded a revised file.',
      body: `${pill('Design Studio · customer reply')}
${h1(revisedFiles ? 'Revised artwork received 📎' : 'The customer replied 💬')}
${p(`<b style="color:${C.ink}">${esc(s.customer.name)}</b> ${revisedFiles ? `sent ${revisedFiles} revised file${revisedFiles === 1 ? '' : 's'}` : 'sent a message'} on ${esc(s.reference)}.`)}
${message ? quote(message, C.ink) : ''}
${button(links.admin, 'Open in Design Studio &nbsp;→')}`,
      footerNote: 'Internal notification for the Joji Arts team.',
   })
   const text = [`${s.customer.name} replied on ${s.reference}`, ...(message ? ['', message] : []), '', links.admin].join('\n')
   return { subject, html, text, replyTo: s.customer.email }
}
