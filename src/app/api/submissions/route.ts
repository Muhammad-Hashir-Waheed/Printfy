import { getProductByKey, isValidQuantity, sanitizeSelections } from '@/catalog'
import { claimFiles, UploadError } from '@/studio/server/files'
import { baseUrlFrom, notifyNewSubmission } from '@/studio/server/notify'
import { createSubmission, timeline } from '@/studio/server/submissions'
import { clientIp, handleError, jsonError, newId, newToken, rateLimit, reference } from '@/studio/server/util'
import type { Submission, SubmissionItem } from '@/studio/types'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const fileRef = z.object({ id: z.string().uuid(), token: z.string().min(10).max(200) })
const text = (max: number) => z.string().trim().max(max)

const schema = z.object({
   source: z.enum(['checkout', 'quote']),
   customer: z.object({
      name: text(120).min(2),
      email: z.string().trim().toLowerCase().email().max(200),
      phone: text(40).optional(),
      company: text(120).optional(),
      address: text(300).optional(),
      city: text(120).optional(),
      country: text(120).optional(),
      notes: text(2000).optional(),
   }),
   items: z
      .array(
         z.object({
            productKey: z.string().max(200),
            qty: z.number().int().positive().max(1_000_000),
            selections: z.record(z.string().max(80), z.string().max(120)).optional(),
            artwork: z.object({
               mode: z.enum(['upload', 'design', 'later']),
               files: z.array(fileRef).max(10).default([]),
               brief: text(1000).optional(),
            }),
         })
      )
      .max(50)
      .default([]),
   attachments: z.array(fileRef).max(10).default([]),
   details: text(4000).optional(),
})

export async function POST(req: Request) {
   if (!rateLimit(`submit:${clientIp(req)}`, 10, 10 * 60_000)) {
      return jsonError(429, 'Too many requests — please wait a few minutes.')
   }
   try {
      const body = schema.parse(await req.json())
      if (!body.items.length && !body.attachments.length && !body.details) {
         return jsonError(400, 'Tell us what you need or attach a file.')
      }

      // Re-derive everything product-related from our catalog; never trust the browser.
      const items: SubmissionItem[] = []
      for (const line of body.items) {
         const product = getProductByKey(line.productKey)
         if (!product) return jsonError(400, 'Your list contains a product we no longer offer.')
         items.push({
            productKey: product.key,
            productName: product.name,
            productHref: product.href,
            categoryName: product.categoryName,
            departmentName: product.departmentName,
            qty: isValidQuantity(product, line.qty) ? line.qty : product.preset.tiers[0].qty,
            unitLabel: product.preset.unit,
            selections: sanitizeSelections(product, line.selections),
            artwork: {
               mode: line.artwork.mode,
               fileIds: line.artwork.mode === 'upload' ? line.artwork.files.map((f) => f.id) : [],
               brief: line.artwork.brief || undefined,
            },
         })
      }

      const fileRefs = [
         ...body.items.flatMap((i) => (i.artwork.mode === 'upload' ? i.artwork.files : [])),
         ...body.attachments,
      ]
      const files = await claimFiles(fileRefs)

      const now = new Date().toISOString()
      const submission: Submission = {
         id: newId(),
         reference: reference(body.source === 'quote' ? 'Q' : 'JA'),
         createdAt: now,
         updatedAt: now,
         status: 'new',
         source: body.source,
         customer: body.customer as Submission['customer'],
         items,
         attachments: body.attachments.map((a) => a.id),
         details: body.details || undefined,
         files,
         timeline: [
            timeline({
               kind: 'created',
               by: 'customer',
               text: body.source === 'quote' ? 'Quote request submitted' : 'Design request submitted',
               fileIds: Object.keys(files),
            }),
         ],
         accessToken: newToken(),
         seenByAdmin: false,
      }
      await createSubmission(submission)
      const emails = await notifyNewSubmission(submission, baseUrlFrom(req))
      const customerEmail = emails.find((e) => e.audience === 'customer')

      return NextResponse.json({
         emailed: Boolean(customerEmail?.result.ok && customerEmail.result.via !== 'preview'),
         id: submission.id,
         reference: submission.reference,
         reviewUrl: `/design-review/${submission.id}?t=${encodeURIComponent(submission.accessToken)}`,
      })
   } catch (error) {
      if (error instanceof UploadError) return jsonError(error.status, error.message)
      return handleError(error, 'SUBMISSION_CREATE')
   }
}
