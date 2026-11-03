const config = {
   name: 'Joji Arts',
   handle: '@jojiarts',
   /** Set NEXT_PUBLIC_URL once the custom domain is live; until then Vercel's production URL is used. */
   url:
      process.env.NEXT_PUBLIC_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
      'https://jojiarts.com',
   description:
      'Custom packaging, printing, labels, acrylic boxes and signage — designed, printed and delivered by Joji Arts.',
   email: 'support@jojiarts.com',
   /** Order requests and quotes are emailed here until online payments go live. */
   ordersEmail: 'orders@jojiarts.com',
   /** Leave empty to hide. Fill in to show across the site (e.g. "+971 50 000 0000"). */
   phone: '',
   whatsapp: '',
   /** Office address — shown on the contact page, footer, legal pages and in structured data. */
   address: {
      line1: 'Office #5, Second Floor, ESA Musa Center',
      line2: 'Royal Park, Lakshmi Chowk',
      city: 'Lahore',
      region: 'Punjab',
      country: 'Pakistan',
      countryCode: 'PK',
      /** Single-line form for compact spots and the map search. */
      full: 'Office #5, Second Floor, ESA Musa Center, Royal Park, Lakshmi Chowk, Lahore, Pakistan',
      /** Share link from the owner — used for "Get directions". */
      mapsUrl: 'https://maps.app.goo.gl/4i7TMakh6HCcpPaeA',
      /** Pin coordinates, taken from where the share link above resolves. */
      geo: { lat: 31.5660052, lng: 74.3246282 },
   },
   /**
    * Prices are hidden while the client finalises pricing — customers build a
    * quote list and contact us instead. Set to true to show prices and totals.
    */
   showPrices: false,
   currency: 'USD',
   locale: 'en-US',
   shippingFlat: 15,
   freeShippingOver: 250,
   links: {
      instagram: '',
      facebook: '',
      linkedin: '',
   },
}

export default config
