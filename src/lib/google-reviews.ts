import config from '@/config/site'
import { MANUAL_REVIEWS, MANUAL_SUMMARY } from '@/data/reviews'

/**
 * Real Google reviews for the home page.
 *  1. Live: Google Places API (New) Place Details, fetched on the server and cached for 24h.
 *     Needs GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID.
 *  2. Fallback: reviews copied by hand into src/data/reviews.ts.
 * Returns null when neither has data, and the section is then hidden. Nothing is ever made up.
 */

export type Review = {
   author: string
   authorUrl?: string
   photo?: string
   rating: number
   text: string
   /** Relative time as Google returns it ("2 months ago") */
   date: string
}

export type ReviewsData = {
   source: 'google-api' | 'manual'
   rating: number | null
   count: number | null
   reviews: Review[]
   /** "Read all reviews on Google" */
   mapsUrl: string
   /** "Leave us a review" */
   writeReviewUrl: string
}

type PlaceDetails = {
   rating?: number
   userRatingCount?: number
   googleMapsUri?: string
   reviews?: Array<{
      rating?: number
      relativePublishTimeDescription?: string
      text?: { text?: string }
      originalText?: { text?: string }
      authorAttribution?: { displayName?: string; uri?: string; photoUri?: string }
   }>
}

const DAY = 60 * 60 * 24

async function fromPlacesApi(): Promise<ReviewsData | null> {
   const key = process.env.GOOGLE_PLACES_API_KEY
   const placeId = process.env.GOOGLE_PLACE_ID
   if (!key || !placeId) return null
   try {
      const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
         headers: {
            'X-Goog-Api-Key': key,
            'X-Goog-FieldMask': 'rating,userRatingCount,reviews,googleMapsUri',
         },
         next: { revalidate: DAY },
      })
      if (!res.ok) {
         console.error(`[reviews] Places API ${res.status}`)
         return null
      }
      const place = (await res.json()) as PlaceDetails
      const reviews: Review[] = (place.reviews ?? [])
         .map((r) => ({
            author: r.authorAttribution?.displayName ?? '',
            authorUrl: r.authorAttribution?.uri,
            photo: r.authorAttribution?.photoUri,
            rating: r.rating ?? 0,
            text: r.text?.text ?? r.originalText?.text ?? '',
            date: r.relativePublishTimeDescription ?? '',
         }))
         .filter((r) => r.author && r.text && r.rating > 0)
      if (!reviews.length) return null
      return {
         source: 'google-api',
         rating: place.rating ?? null,
         count: place.userRatingCount ?? null,
         reviews: reviews.slice(0, 6),
         mapsUrl: process.env.GOOGLE_MAPS_URL || place.googleMapsUri || config.links.googleMaps,
         writeReviewUrl: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`,
      }
   } catch (err) {
      console.error('[reviews] Places API request failed', err)
      return null
   }
}

function fromManualFile(): ReviewsData | null {
   if (!MANUAL_REVIEWS.length) return null
   const mapsUrl = process.env.GOOGLE_MAPS_URL || config.links.googleMaps
   const placeId = process.env.GOOGLE_PLACE_ID
   return {
      source: 'manual',
      rating: MANUAL_SUMMARY?.rating ?? null,
      count: MANUAL_SUMMARY?.count ?? null,
      reviews: MANUAL_REVIEWS.slice(0, 6).map((r) => ({ author: r.author, photo: r.photo, rating: r.rating, text: r.text, date: r.date })),
      mapsUrl,
      writeReviewUrl: placeId ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}` : mapsUrl,
   }
}

export async function getReviews(): Promise<ReviewsData | null> {
   return (await fromPlacesApi()) ?? fromManualFile()
}
