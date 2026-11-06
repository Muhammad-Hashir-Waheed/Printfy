/**
 * Hand-copied Google Maps reviews, used only when the Google Places API isn't configured
 * (GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID). The reviews section stays hidden while this is empty.
 *
 * RULE: copy real reviews exactly as they appear on the Joji Arts Google Maps listing.
 * Never invent, edit or "sample" a review, name, date or rating.
 *
 * Example entry (shape only — not a real review):
 *   { author: 'Name as shown on Google', rating: 5, text: 'Review text, copied word for word', date: '2 months ago' }
 */

export type ManualReview = {
   author: string
   /** 1–5 */
   rating: number
   text: string
   /** As Google shows it, e.g. "3 weeks ago" or "March 2026" */
   date: string
   /** Optional: the reviewer's profile photo URL from Google */
   photo?: string
}

export const MANUAL_REVIEWS: ManualReview[] = []

/** The overall rating and total count shown on the listing, copied by hand. Leave null to hide the summary line. */
export const MANUAL_SUMMARY: { rating: number; count: number } | null = null
