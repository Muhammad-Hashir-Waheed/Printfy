import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache'

/**
 * Every catalog page is pre-rendered at build time and nothing revalidates, so the build's own
 * static files serve as the page cache (no R2 bucket needed). Cache interception answers those
 * pages before Next.js boots — far less CPU per request, which matters on the free plan's 10 ms limit.
 */
export default defineCloudflareConfig({
   incrementalCache: staticAssetsIncrementalCache,
   enableCacheInterception: true,
})
