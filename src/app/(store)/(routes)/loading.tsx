'use client'

/** Page loader for the storefront. The design-review page sits outside this group on purpose:
    without a loading boundary above it, a wrong link returns a real 404 status. */
import { PageLoader } from '@/components/ui/page-loader'

export default function Loading() {
   return <PageLoader />
}
