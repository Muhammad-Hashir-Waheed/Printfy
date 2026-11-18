import config from '@/config/site'

/** Absolute site URL without a trailing slash. */
export const siteUrl = config.url.replace(/\/$/, '')

const BUSINESS_ID = `${siteUrl}/#business`
const WEBSITE_ID = `${siteUrl}/#website`

/** Social and listing profiles for `sameAs`; empty links are skipped. */
function profiles() {
   return Object.values(config.links).filter((url): url is string =>
      Boolean(url)
   )
}

/**
 * The business as search engines should see it. Used on the home and contact pages,
 * with the same @id so Google treats both as one entity.
 */
export function localBusinessJsonLd(extra: Record<string, unknown> = {}) {
   const { address } = config
   const sameAs = profiles()
   return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': BUSINESS_ID,
      name: config.name,
      description: config.description,
      url: `${siteUrl}/`,
      logo: `${siteUrl}/icon-512.png`,
      image: `${siteUrl}/opengraph-image.png`,
      telephone: config.phoneIntl,
      email: config.adminEmail,
      address: {
         '@type': 'PostalAddress',
         streetAddress: `${address.line1}, ${address.line2}`,
         addressLocality: address.city,
         addressRegion: address.region,
         addressCountry: address.countryCode,
      },
      geo: {
         '@type': 'GeoCoordinates',
         latitude: address.geo.lat,
         longitude: address.geo.lng,
      },
      hasMap: address.mapsUrl,
      // TODO(owner): add Pakistan here too once nationwide delivery is confirmed
      areaServed: { '@type': 'City', name: address.city },
      // TODO(owner): add openingHoursSpecification once business hours are confirmed
      ...(sameAs.length ? { sameAs } : {}),
      ...extra,
   }
}

/** Site name for Google results; rendered once, from the store layout. */
export function websiteJsonLd() {
   return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      name: config.name,
      url: `${siteUrl}/`,
      publisher: { '@id': BUSINESS_ID },
      inLanguage: 'en-PK',
   }
}

export function JsonLd({ data }: { data: object }) {
   return (
      <script
         type="application/ld+json"
         dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
   )
}
