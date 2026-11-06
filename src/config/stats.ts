import { CATALOG_STATS } from '@/catalog'

/**
 * The one source for the numbers the site quotes about itself. Counts are computed from the
 * catalogue, so they stay right as products are added or removed. Kept apart from config/site
 * so the contact details don't pull the whole catalogue into every bundle.
 */

/** Rounded down to the nearest 5, shown with a "+" ("405+") */
const productCount = Math.floor(CATALOG_STATS.products / 5) * 5

export const SITE_STATS = {
   productCount,
   productCountLabel: `${productCount}+`,
   departmentCount: CATALOG_STATS.departments,
   /** Use this exact wording wherever the reply time is mentioned */
   quoteTurnaround: '1 business day',
   /** Short form for the hero stat tile ("1 day" / "quote turnaround") */
   quoteTurnaroundShort: '1 day',
} as const
