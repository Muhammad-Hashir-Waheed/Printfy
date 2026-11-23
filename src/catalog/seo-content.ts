/**
 * Long-form copy and FAQs for the busiest department and category pages, aimed at the searches
 * people already use to find us (Search Console). Every fact here (minimums, lead times,
 * materials, options) comes from the catalog presets, so keep them in step when a preset changes.
 *
 * Paragraphs support inline links written as [text](/path).
 */
export type SeoFaq = { q: string; a: string }

export type SeoContent = {
   heading: string
   paragraphs: string[]
   faqs: SeoFaq[]
}

const ORDERING: SeoFaq = {
   q: 'How do I order and get a price?',
   a: 'Pick the products and options you need, add them to your quote list and send it, or message us on WhatsApp at 0315-61-111-81. We reply within one business day with pricing, a free digital proof and the lead time, and you only pay once you approve the proof.',
}

const DELIVERY: SeoFaq = {
   q: 'Do you deliver outside Lahore?',
   a: 'Yes. We are based at Lakshmi Chowk in Lahore and deliver across Pakistan, including Karachi, Islamabad, Rawalpindi, Faisalabad, Multan and smaller cities. Delivery options and costs are included in your quote.',
}

/** Keyed by department slug, or `department/category` for a category page. */
export const SEO_CONTENT: Record<string, SeoContent> = {
   'food-packaging': {
      heading: 'Custom food packaging in Lahore, delivered across Pakistan',
      paragraphs: [
         'Joji Arts prints branded food packaging for restaurants, cafés, cloud kitchens, bakeries and home food businesses. Choose from [pizza, burger, fries and bakery boxes](/shop/food-packaging/food-boxes), [food containers and meal trays](/shop/food-packaging/food-containers), [cups](/shop/food-packaging/cups) and [food bags](/shop/food-packaging/food-bags), all printed with your logo and made from food-safe board with odour-free inks.',
         'Food boxes come in white or kraft food board, or with a grease-resistant coating for oily and saucy food. Print can be a simple 1-colour logo, 2 colours or full colour, and we make standard sizes or custom sizes cut to your menu. Food boxes start from 100 pieces and are produced in 6–9 business days after you approve the proof.',
         'Our studio is at Lakshmi Chowk, Lahore, and we deliver across Pakistan, so a restaurant in Lahore and a cloud kitchen in Karachi get the same quality and the same free artwork check before anything is printed.',
      ],
      faqs: [
         {
            q: 'What is the minimum order for custom food boxes?',
            a: 'Printed food boxes start from 100 pieces per design. Larger runs bring the unit price down, and we price every quantity tier in your quote.',
         },
         {
            q: 'Is your food packaging safe for hot and oily food?',
            a: 'Yes. Food boxes are made from food-grade board with a water-based barrier coating and odour-free inks. For greasy items like pizza, burgers and fries, choose the grease-resistant coated board.',
         },
         {
            q: 'How long does food packaging take?',
            a: 'Most food boxes are produced in 6–9 business days after you approve your proof, plus delivery time to your city.',
         },
         ORDERING,
         DELIVERY,
      ],
   },

   'food-packaging/food-boxes': {
      heading: 'Custom pizza, burger and bakery boxes',
      paragraphs: [
         'Our food boxes cover the whole takeaway menu: [custom pizza boxes](/shop/food-packaging/food-boxes/custom-pizza-box), [kraft pizza boxes](/shop/food-packaging/food-boxes/kraft-pizza-box) and [window pizza boxes](/shop/food-packaging/food-boxes/window-pizza-box), [branded burger boxes](/shop/food-packaging/food-boxes/branded-burger-box), fries and nugget cartons, noodle boxes, and bakery, cake and donut boxes.',
         'Pizza boxes are corrugated for strength and heat, with a full-colour or 1-colour printed lid. Every box can be made in white food board, natural kraft or grease-resistant coated board, in small, medium, large or custom sizes. The minimum order is 100 pieces, with production in 6–9 business days after proof approval.',
         'Send us your logo, or just your restaurant name and colours, and our team prepares the artwork and a free proof. We print in Lahore and deliver to restaurants and food businesses across Pakistan.',
      ],
      faqs: [
         {
            q: 'Can you print custom pizza boxes with my logo?',
            a: 'Yes. Pizza boxes are printed with your logo and design on the lid, in full colour or a single colour, on white or kraft corrugated board.',
         },
         {
            q: 'What sizes of pizza boxes do you make?',
            a: 'We make small, medium and large pizza boxes, and custom sizes made to the exact diameter of your pizzas. Tell us your sizes in the quote and we will match them.',
         },
         {
            q: 'What is the minimum order for pizza and burger boxes?',
            a: '100 pieces per design. You can mix box types in one quote, for example pizza boxes plus burger boxes and fries cartons.',
         },
         ORDERING,
         DELIVERY,
      ],
   },

   bags: {
      heading: 'Personalised bags printed in Lahore, delivered across Pakistan',
      paragraphs: [
         'From boutique shopping bags to event giveaways, Joji Arts prints personalised bags for shops, brands, restaurants and events. Choose [paper shopping bags](/shop/bags/paper-bags) with twisted paper, rope or ribbon handles, eco [kraft bags](/shop/bags/kraft-bags), reusable [canvas, cotton, jute and non-woven bags](/shop/bags/fabric-bags), or printed [stand-up pouches and mailers](/shop/bags/pouches).',
         'Paper bags use 120–250 gsm paper with reinforced handles and can be printed with a 1-colour logo, full colour or full colour with foil. Fabric bags can be screen printed, printed in full colour (DTF) or embroidered. Paper and kraft bags start from 100 bags and fabric bags from 50, with production in 10–14 business days after proof approval.',
         'Customers order from all over Pakistan, from Lahore to Dera Ghazi Khan, Mandi Bahauddin and Karachi. Every order gets a free artwork check and proof, and delivery to your city is included in the quote.',
      ],
      faqs: [
         {
            q: 'What is the minimum order for personalised bags?',
            a: 'Paper and kraft bags start from 100 bags, fabric bags (canvas, cotton, jute, non-woven) from 50 bags, and printed pouches from 100.',
         },
         {
            q: 'Which bag is best for a clothing or gift shop?',
            a: 'Laminated paper bags with rope or ribbon handles give a premium boutique feel. For everyday retail, twisted-handle kraft or white paper bags are economical, and reusable non-woven or canvas totes work well for loyal customers and events.',
         },
         {
            q: 'How long do printed bags take?',
            a: 'Paper, kraft and fabric bags take 10–14 business days after you approve your proof, and pouches 10–12 business days, plus delivery time to your city.',
         },
         ORDERING,
         DELIVERY,
      ],
   },

   'acrylic-plastic-packaging/plastic-packaging': {
      heading: 'Clear plastic box packaging and containers',
      paragraphs: [
         'Clear plastic packaging lets customers see your product before they buy. Joji Arts makes [clear plastic boxes](/shop/acrylic-plastic-packaging/plastic-packaging/clear-plastic-boxes), [PET boxes](/shop/acrylic-plastic-packaging/plastic-packaging/pet-boxes), PVC and frosted PP boxes, display boxes with hang tabs, gift boxes, and [plastic product containers](/shop/acrylic-plastic-packaging/plastic-packaging/plastic-product-containers) such as tubs and jars with lids.',
         'Boxes are made from 0.25–0.5 mm PET, PVC or PP with crisp creases and a scratch-resistant finish, and food-grade options are available for sweets, bakery and deli items. You can order them unprinted, with a 1-colour logo or in full colour, in small, medium, large or custom sizes. The minimum order is 100 boxes, produced in 8–12 business days after proof approval.',
         'For heavier, reusable and more premium packaging, see our laser-cut [acrylic boxes](/shop/acrylic-plastic-packaging/acrylic-boxes). Both are made in Lahore and delivered across Pakistan.',
      ],
      faqs: [
         {
            q: 'What is the difference between PET, PVC and PP boxes?',
            a: 'PET is recyclable and the clearest option. PVC is rigid and economical for retail display. PP has a soft frosted look and is more flexible. We can help you choose based on your product.',
         },
         {
            q: 'Can you make custom plastic tubs and containers?',
            a: 'Yes. We supply plastic tubs, jars and containers with lids, including food-grade containers, and can brand them with printed labels or sleeves.',
         },
         {
            q: 'What is the minimum order for plastic boxes?',
            a: '100 boxes per design. Unprinted boxes are the most economical, and full-colour print is available for retail packaging.',
         },
         ORDERING,
         DELIVERY,
      ],
   },

   'acrylic-plastic-packaging/acrylic-boxes': {
      heading: 'Custom acrylic boxes, laser-cut in Lahore',
      paragraphs: [
         'Acrylic boxes turn packaging into a keepsake. We laser-cut [clear acrylic boxes](/shop/acrylic-plastic-packaging/acrylic-boxes/clear-acrylic-boxes) and [custom acrylic boxes](/shop/acrylic-plastic-packaging/acrylic-boxes/custom-acrylic-boxes) for gifts, jewellery, cosmetics, sweets and dates, cakes, hampers and product displays, including magnetic-lid and custom-shape boxes.',
         'Boxes are made from cast acrylic in 2, 3 or 5 mm thickness, in crystal clear, frosted, coloured or mirror gold and silver, with flame-polished edges. Add your logo with UV printing or laser engraving. Because acrylic is cut to order, you can start from just 10 boxes, with production in 7–10 business days after proof approval.',
         'Acrylic boxes are popular for weddings, Eid and corporate gifting. Order from anywhere in Pakistan and we deliver with protective film still on every panel.',
      ],
      faqs: [
         {
            q: 'What is the minimum order for acrylic boxes?',
            a: 'Just 10 boxes, because every box is laser-cut to order. Larger quantities bring the unit price down.',
         },
         {
            q: 'Which acrylic thickness should I choose?',
            a: '2 mm suits small, light gift and favour boxes; 3 mm is the all-round choice for most products; 5 mm gives a heavy, premium feel for display cases, hampers and cake boxes.',
         },
         {
            q: 'Can you put my logo or a name on acrylic boxes?',
            a: 'Yes. Logos, names and patterns can be UV-printed in colour or laser-engraved for a frosted, permanent finish.',
         },
         ORDERING,
         DELIVERY,
      ],
   },

   'packaging/rigid-boxes': {
      heading: 'Luxury rigid boxes: drawer, magnetic and lift-off lid',
      paragraphs: [
         'Rigid boxes are the premium end of packaging, used for perfume, jewellery, watches, clothing, wedding favours and product launches. Choose a [drawer rigid box](/shop/packaging/rigid-boxes/drawer-rigid-box) with a ribbon pull, a [magnetic closure box](/shop/packaging/rigid-boxes/magnetic-closure-box), a book-style box, a lift-off lid box, a sleeve box or a collapsible rigid box that ships flat.',
         'Each box is built from 1.5–2.5 mm greyboard wrapped in printed art paper, textured paper, soft-touch black or leatherette, with hand-finished corners. Add foil stamping, embossing or debossing, and a card, foam or velvet insert to hold your product. Rigid boxes start from 50 boxes, with production in 12–15 business days after proof approval.',
         'Not sure which style fits your product? Send us its size and photos, and our Lahore studio will suggest a box, prepare a free proof and deliver anywhere in Pakistan.',
      ],
      faqs: [
         {
            q: 'What is a drawer rigid box?',
            a: 'A two-part rigid box where the tray slides out of a sleeve like a drawer, usually with a ribbon pull. It gives a slow, premium unboxing and is popular for jewellery, perfume and gift sets.',
         },
         {
            q: 'What is the minimum order for rigid boxes?',
            a: '50 boxes per design. Rigid boxes are partly hand-finished, so they suit premium products and gift runs rather than very large volumes.',
         },
         {
            q: 'Can I add foil, embossing and an insert?',
            a: 'Yes. Choose foil stamping, emboss or deboss, or foil plus emboss, and a card, foam or velvet and satin insert shaped to your product.',
         },
         ORDERING,
         DELIVERY,
      ],
   },
}

export function seoContentFor(departmentSlug: string, categorySlug?: string): SeoContent | undefined {
   return SEO_CONTENT[categorySlug ? `${departmentSlug}/${categorySlug}` : departmentSlug]
}
