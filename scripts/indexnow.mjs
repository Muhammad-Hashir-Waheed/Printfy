#!/usr/bin/env node
/**
 * Tells Bing, Yandex and other IndexNow search engines about the site's pages
 * (https://www.indexnow.org). Reads the live sitemap and submits every URL in it.
 *
 * Usage: node scripts/indexnow.mjs [https://jojiarts.com]
 * The key file is public/2d7992d31b3ed7a00bef85c90ae83ce6.txt; if you change the key, rename that file to match.
 */
const SITE = (process.argv[2] || process.env.SITE_URL || 'https://jojiarts.com').replace(/\/$/, '')
const KEY = '2d7992d31b3ed7a00bef85c90ae83ce6'

async function main() {
   const host = new URL(SITE).host

   const keyRes = await fetch(`${SITE}/${KEY}.txt`)
   if (!keyRes.ok || (await keyRes.text()).trim() !== KEY) {
      throw new Error(`Key file ${SITE}/${KEY}.txt is not live yet (HTTP ${keyRes.status})`)
   }

   const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text()
   const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => m[1].trim())
      .filter((u) => new URL(u).host === host)
   if (!urlList.length) throw new Error('No URLs found in the sitemap')

   const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urlList.slice(0, 10000) }),
   })
   // 200 = submitted, 202 = accepted and key validation pending
   console.log(`IndexNow: submitted ${urlList.length} URLs for ${host} -> HTTP ${res.status}`)
   if (res.status >= 400) {
      console.error(await res.text())
      process.exit(1)
   }
}

main().catch((err) => {
   console.error(err.message)
   process.exit(1)
})
