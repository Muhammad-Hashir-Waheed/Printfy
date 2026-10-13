import { promises as fs } from 'node:fs'
import path from 'node:path'

/**
 * Transactional email.
 *
 *   RESEND_API_KEY=re_...                  → Resend (https://resend.com) — recommended
 *   SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS → any SMTP server (Gmail, Zoho, Outlook…)
 *   neither                                → "preview": the email is saved to .data/outbox
 *                                            so you can open it in a browser (dev only)
 *
 *   EMAIL_FROM="Joji Arts <studio@jojiarts.com>"   sender (must be a verified domain/address)
 *   EMAIL_REPLY_TO=support@jojiarts.com            optional
 */

export type Mail = { to: string; subject: string; html: string; text: string; replyTo?: string }
export type SendResult = { ok: boolean; via: 'resend' | 'smtp' | 'preview'; error?: string; previewPath?: string }

const FROM = () => process.env.EMAIL_FROM || 'Joji Arts <onboarding@resend.dev>'

export function mailMode(): SendResult['via'] {
   if (process.env.RESEND_API_KEY) return 'resend'
   if (process.env.SMTP_HOST) return 'smtp'
   return 'preview'
}

async function viaResend(mail: Mail): Promise<SendResult> {
   const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
         from: FROM(),
         to: [mail.to],
         subject: mail.subject,
         html: mail.html,
         text: mail.text,
         reply_to: mail.replyTo || process.env.EMAIL_REPLY_TO || undefined,
      }),
   })
   if (res.ok) return { ok: true, via: 'resend' }
   const body = await res.text().catch(() => '')
   return { ok: false, via: 'resend', error: `Resend ${res.status}: ${body.slice(0, 200)}` }
}

let transporter: { sendMail: (o: object) => Promise<unknown> } | null = null

async function viaSmtp(mail: Mail): Promise<SendResult> {
   if (!transporter) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const nodemailer = require('nodemailer')
      const port = Number(process.env.SMTP_PORT || 587)
      transporter = nodemailer.createTransport({
         host: process.env.SMTP_HOST,
         port,
         secure: port === 465,
         auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
      })
   }
   await transporter!.sendMail({
      from: FROM(),
      to: mail.to,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      replyTo: mail.replyTo || process.env.EMAIL_REPLY_TO || undefined,
   })
   return { ok: true, via: 'smtp' }
}

async function viaPreview(mail: Mail): Promise<SendResult> {
   if (process.env.VERCEL) {
      return { ok: false, via: 'preview', error: 'No email provider configured (set RESEND_API_KEY or SMTP_*)' }
   }
   const dir = path.join(process.cwd(), '.data', 'outbox')
   await fs.mkdir(dir, { recursive: true })
   const stamp = new Date().toISOString().replace(/[:.]/g, '-')
   const safe = mail.to.replace(/[^a-z0-9@._-]/gi, '_')
   const file = path.join(dir, `${stamp}__${safe}.html`)
   const banner = `<div style="font:13px/1.5 system-ui;background:#111;color:#fff;padding:10px 16px">
      <b>Email preview</b> (no provider configured) — To: ${mail.to} · Subject: ${mail.subject.replace(/</g, '&lt;')}</div>`
   await fs.writeFile(file, banner + mail.html)
   console.log(`[mail:preview] ${mail.to} — ${mail.subject}\n  → ${file}`)
   return { ok: true, via: 'preview', previewPath: file }
}

/** Never throws: email problems must not break the customer's request. */
export async function sendMail(mail: Mail): Promise<SendResult> {
   const mode = mailMode()
   try {
      const run = mode === 'resend' ? viaResend(mail) : mode === 'smtp' ? viaSmtp(mail) : viaPreview(mail)
      const timeout = new Promise<SendResult>((resolve) =>
         setTimeout(() => resolve({ ok: false, via: mode, error: 'Timed out after 10s' }), 10_000)
      )
      const result = await Promise.race([run, timeout])
      if (!result.ok) console.error('[mail]', result.error)
      return result
   } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('[mail]', message)
      return { ok: false, via: mode, error: message.slice(0, 200) }
   }
}
