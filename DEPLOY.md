# Deploying to Cloudflare (jojiarts.com)

The storefront runs on **Cloudflare Workers (free plan)** using the
[OpenNext adapter](https://opennext.js.org/cloudflare). Cloudflare builds it from GitHub on
every push to `master`. Product photos and pages are static files served from Cloudflare's
edge. Orders and artwork are stored in **Supabase**, and emails go out through **Resend**.

You only need to do this setup once.

---

## 1. Put jojiarts.com on Cloudflare

1. Sign up or log in at https://dash.cloudflare.com. Click **Add a domain**, enter `jojiarts.com`,
   and choose the **Free** plan.
2. Cloudflare shows two nameservers. At your domain registrar (where you bought jojiarts.com),
   replace the existing nameservers with those two.
3. Wait until the domain shows **Active** in Cloudflare. This usually takes minutes, but can
   take up to 24 hours.

## 2. Create the Worker from GitHub

1. Push this repo to GitHub.
2. In Cloudflare, go to **Workers & Pages → Create → Import a repository**. Connect GitHub and
   pick the repo.
3. Use these settings:
   - **Project name:** `joji-arts`. This must match `name` in `wrangler.jsonc`.
   - **Production branch:** `master`
   - **Build command:** `npx opennextjs-cloudflare build`
   - **Deploy command:** `npx opennextjs-cloudflare deploy`
   - **Root directory:** `/`
4. Click **Deploy**. The first build takes about 10 minutes because it pre-sizes every product
   photo. The site won't work properly until you add the secrets in step 3.

`wrangler.jsonc` attaches the Worker to **jojiarts.com**. Cloudflare creates the DNS record and
the SSL certificate automatically on deploy.

## 3. Add the secrets

In Cloudflare, open **Workers & Pages → joji-arts → Settings → Variables and Secrets**. Add each
of these as a **Secret** (encrypted):

| Name | Value |
|---|---|
| `SUPABASE_URL` | `https://<your-project>.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` key |
| `ADMIN_EMAIL` | The email you sign in to `/admin` with |
| `ADMIN_PASSWORD` | A strong password for `/admin` |
| `ADMIN_SESSION_SECRET` | A long random string, e.g. the output of `openssl rand -base64 48` |
| `RESEND_API_KEY` | Resend → API Keys (a "Sending access" key is enough) |
| `EMAIL_FROM` | `Joji Arts <studio@jojiarts.com>` (only after step 5) |
| `EMAIL_REPLY_TO` | `support@jojiarts.com` (optional) |
| `STUDIO_NOTIFY_EMAIL` | Where new-order alerts go (optional; defaults to `orders@jojiarts.com`) |

After adding them, redeploy: open **Deployments**, click **⋯** on the latest one, and choose
**Retry deployment**. Or push any commit.

`NEXT_PUBLIC_URL=https://jojiarts.com` is already set in `.env.production` (it isn't secret).

## 4. Redirect www to the bare domain

1. **DNS → Records → Add record**:
   - Type: `AAAA`
   - Name: `www`
   - IPv6 address: `100::`
   - Proxy status: **Proxied** (orange cloud)
2. **Rules → Redirect Rules → Create rule → From template "Redirect from WWW to root"**, then
   **Deploy**.

## 5. Email on jojiarts.com

The site shows `support@jojiarts.com` and `orders@jojiarts.com`, and sends order alerts to
`orders@jojiarts.com`. Set up both directions:

- **Receiving (free):** go to **Email → Email Routing**. Turn it on and add routes:
  - `support@jojiarts.com` → your Gmail
  - `orders@jojiarts.com` → your Gmail
  - Or use a catch-all.
- **Sending to customers:** in Resend, open **Domains → Add domain → jojiarts.com**. Resend can
  add its DNS records to Cloudflare automatically. Once the domain shows *Verified*, set the
  `EMAIL_FROM` secret (step 3). Until then, Resend only delivers to your own address, so
  customers won't get their confirmation and tracking emails.

## 6. Check it's live

- https://jojiarts.com loads, and so do a category and a product page.
- https://www.jojiarts.com redirects to https://jojiarts.com.
- https://jojiarts.com/admin: sign in and check the inbox loads.
- Send one test quote with your own email, check it appears in the admin and that both emails
  arrive, then archive it.

---

## Everyday use

- **Deploying:** push to `master` and Cloudflare builds and deploys automatically.
- **Testing the Cloudflare build locally:** run `npm run preview`. This builds and runs the site
  in the real Workers runtime at http://localhost:8787.
- **Development:** `npm run dev` works as before.
- **Deploying from your own computer** (`npm run deploy`, after `npx wrangler login`): avoid it if
  you can. A local build copies everything in `.env.local` into the Worker bundle. It still works,
  but the secrets then live in the code rather than in Cloudflare's encrypted store. Deploying via
  GitHub never has this problem, because `.env.local` isn't in the repo.
- **Windows:** the adapter isn't fully supported on Windows. Local builds work here, but
  Cloudflare's own Linux build servers are the reference.

## Free plan limits

| Limit | Free plan | What it means here |
|---|---|---|
| Requests | 100,000 / day | Page views and API calls. Images and build files are static and don't count. |
| CPU time | 10 ms / request | Pre-built pages are served from cache before Next.js starts, to keep them under. Check **joji-arts → Metrics → CPU time** after launch; occasional "Exceeded CPU" errors there mean it's time for the paid plan. |
| Worker size | 64 MB | About 18 MB today. |
| Static files | 20,000 per version | About 8,600 today, mostly product-photo copies. |

If traffic outgrows this, the Workers Paid plan ($5/month) raises every limit. No code changes
are needed.

## How it's wired

- `wrangler.jsonc`: the Worker's name, domain, runtime flags and plain variables.
- `open-next.config.ts`: serves pre-built pages from the build's static files (no R2 bucket).
- `scripts/image-variants.mjs`: runs before every build and writes 256/640/1080 px WebP copies of
  every catalog image to `public/_v/` (git-ignored). `src/lib/image-loader.ts` points images at
  the right copy, so no image server is needed.
- `public/_headers`: cache and security headers for static files.
- The home page hero plays six 6-second real-footage clips from `public/videos/hero/`
  (`src/components/store/hero-video.tsx`; sources and licences in `media-source/CREDITS.md`).
  The poster image paints first; only clip 1 loads at first, each next clip is fetched just before
  it is needed, and phones get 960 px encodes (about 0.45 MB for the first clip). Each clip is
  downloaded whole and played from memory, because Cloudflare's static files don't answer
  byte-range requests and Safari won't play video without them. Reduced-motion visitors and slow
  or data-saver connections get the poster only.
- Signature, Signage and the quote band use still catalog photos as backgrounds
  (`src/components/store/background-image.tsx`), served as resized WebP copies like every other
  catalog image.
- Orders and artwork must go to Supabase in production. On Cloudflare there is no disk to fall
  back to (`src/studio/server/runtime.ts`), so if the Supabase secrets are missing, checkout
  shows an error instead of silently losing the order.
