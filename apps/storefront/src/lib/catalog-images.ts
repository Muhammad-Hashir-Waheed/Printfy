/** Verified Unsplash URLs (HEAD 200) — avoid broken photo IDs in catalog */

const q = 'q=80&w=1200&auto=format&fit=crop'

export const CATALOG_IMAGES = {
   teeWhite: `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?${q}`,
   teeFolded: `https://images.unsplash.com/photo-1503341504253-dff4815485f1?${q}`,
   teeStack: `https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?${q}`,
   teeHanger: `https://images.unsplash.com/photo-1576566588028-4147f3842f27?${q}`,
   polo: `https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?${q}`,
   tank: `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?${q}`,
   hoodie: `https://images.unsplash.com/photo-1556821840-3a63f95609a7?${q}`,
   sweatshirt: `https://images.unsplash.com/photo-1516826957135-700dedea698c?${q}`,
   pants: `https://images.unsplash.com/photo-1473966968600-fa801b869a1a?${q}`,
   leggings: `https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?${q}`,
   tote: `https://images.unsplash.com/photo-1590874103328-eac38a683ce7?${q}`,
   bag: `https://images.unsplash.com/photo-1584917865442-de89df76afd3?${q}`,
   backpack: `https://images.unsplash.com/photo-1553062407-98eeb64c6a62?${q}`,
   mailer: `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?${q}`,
   product: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?${q}`,
   mug: `https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?${q}`,
   coffee: `https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?${q}`,
   cap: `https://images.unsplash.com/photo-1560250097-0b93528c311a?${q}`,
   phone: `https://images.unsplash.com/photo-1601593346740-925612772716?${q}`,
   sticker: `https://images.unsplash.com/photo-1611162617474-5b21e879e113?${q}`,
} as const

export const DEFAULT_PRODUCT_IMAGE = CATALOG_IMAGES.teeWhite

export function sanitizeProductImages(images?: string[] | null): string[] {
   if (!images?.length) return [DEFAULT_PRODUCT_IMAGE]
   return images.map((url) => (isLikelyBrokenUnsplash(url) ? DEFAULT_PRODUCT_IMAGE : url))
}

/** Known 404 IDs from earlier catalog seed */
function isLikelyBrokenUnsplash(url: string) {
   const broken = [
      'photo-1618354691373-d851fcf5c3b0',
      'photo-1620799140408-f9f8e7b7ecb1',
      'photo-1622445265470-35b2494dd58e',
      'photo-1544966503-7cc5ac882d5f',
      'photo-1506629082955-511b05f03b55',
      'photo-1586075010923-aa2a337b7c52',
      'photo-1514228742587-6b1558fcca3e',
      'photo-1513475382585-d06e58bcb0e6',
      'photo-1588850561407-ed78c282e68b',
   ]
   return broken.some((id) => url.includes(id))
}
