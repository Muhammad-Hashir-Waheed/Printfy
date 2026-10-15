# Joji Arts

Storefront for **Joji Arts**: custom packaging, printing and signage. Customers browse 12 departments,
build a quote list, and upload their artwork through the **Design Studio**; the team reviews uploads
at `/admin` and customers follow progress from an emailed tracking link.

Built with Next.js 14 (App Router), React 18, Tailwind CSS and shadcn/ui.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev                  # http://localhost:7777
```

Production build: `npm run build && npm start`.

## Project layout

| Path | What it is |
| --- | --- |
| `src/app/(store)` | Public storefront pages |
| `src/app/admin` | Design Studio admin (uploads, customers, status updates) |
| `src/app/api` | API routes (uploads, submissions, design review, admin) |
| `src/catalog` | Static product catalog: departments, categories, products, images |
| `src/studio` | Design Studio: storage, submissions, emails |
| `src/components/store` | Storefront UI (header, footer, cards, configurator…) |
| `src/domain` | Checkout, orders, pricing and fulfillment logic (used once online orders are enabled) |
| `src/config` | Site settings (`site.ts`) and feature flags (`features.ts`) |
| `public/catalog` | Product photography |
| `scripts` | Catalog image tools and Supabase helpers |
| `prisma`, `supabase` | Database schema and local Supabase setup (database features are currently off) |

## Environment variables

See `.env.example` for the full list. Production needs:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_URL` | Public site URL, used in emailed tracking links |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` | Login for `/admin` |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Storage for uploaded designs (required on Vercel) |
| `RESEND_API_KEY` (or `SMTP_*`), `EMAIL_FROM`, `STUDIO_NOTIFY_EMAIL` | Customer and team emails |

Without Supabase or an email provider, development stores uploads in `.data/` and writes email
previews to `.data/outbox/`.

## Deploying (Vercel)

Import the repository with the default settings (Root Directory = repository root). The build runs
`npm ci` and `npm run vercel-build` (see `vercel.json`). Add the environment variables above in
**Settings → Environment Variables**, then redeploy.

## Catalog images

Product photos come from Pixabay and live in `public/catalog`. To refresh them, put
`PIXABAY_API_KEY` in `.env.local` and run `npm run images:fetch`. Hand-picked photo IDs are in
`scripts/image-picks.mjs`.

## Credits

Started from [next-prisma-tailwind-ecommerce](https://github.com/sesto-dev/next-prisma-tailwind-ecommerce)
by Sesto (MIT). See `LICENSE.md`.
