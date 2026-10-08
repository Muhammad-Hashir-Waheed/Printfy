const config = {
   name: 'Joji Arts',
   handle: '@jojiarts',
   url: process.env.NEXT_PUBLIC_URL || 'https://jojiarts.com',
   description:
      'Custom packaging, printing, labels, acrylic boxes and signage — designed, printed and delivered by Joji Arts.',
   email: 'support@jojiarts.com',
   /** Order requests and quotes are emailed here until online payments go live. */
   ordersEmail: 'orders@jojiarts.com',
   /** Leave empty to hide. Fill in to show across the site (e.g. "+971 50 000 0000"). */
   phone: '',
   whatsapp: '',
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
