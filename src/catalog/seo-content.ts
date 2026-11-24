/**
 * Long-form copy and FAQs for the busiest department and category pages, aimed at the searches
 * people already use to find us (Search Console). Every fact here (minimums, lead times,
 * materials, options) comes from the catalog presets, so keep them in step when a preset changes.
 *
 * Paragraphs support inline links written as [text](/path).
 */
export type SeoFaq = { q: string; a: string }

export type SeoContent = {
   /** Overrides the page's <title> (the " | Joji Arts" suffix is added automatically) */
   title?: string
   /** Overrides the meta description; keep it under ~160 characters */
   description?: string
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
   'packaging/corrugated-boxes': {
      title: 'Custom Corrugated Boxes in Pakistan',
      description:
         'Printed corrugated shipping boxes in Pakistan: single and double-wall cartons in white or kraft, made to your size. From 100 boxes, printed in Lahore.',
      heading: 'Custom corrugated boxes for shipping and storage',
      paragraphs: [
         'Corrugated boxes are the workhorse of packaging: strong, light and recyclable. Joji Arts makes [corrugated shipping boxes](/shop/packaging/corrugated-boxes/corrugated-shipping-box), [heavy-duty double-wall boxes](/shop/packaging/corrugated-boxes/heavy-duty-double-wall-box), cube shipping boxes, [printed corrugated boxes](/shop/packaging/corrugated-boxes/printed-corrugated-box), tray-and-lid boxes, moving and storage boxes, and slim [E-flute retail boxes](/shop/packaging/corrugated-boxes/e-flute-retail-box).',
         'Boxes are made from white or kraft corrugated board in E or B flute, or double-wall BC flute for heavy, fragile and high-value goods. Print the outside in full colour with Pantone matching, the outside and inside, or a simple 1-colour logo, or order them unprinted. Every size can be made to your product. The minimum order is 100 boxes, produced in 7–10 business days after proof approval.',
         'We supply corrugated boxes to online stores, manufacturers, distributors and exporters across Pakistan from our studio in Lahore. For e-commerce orders, see our self-locking [mailer boxes](/shop/packaging/mailer-boxes), or compare styles in our guide to [mailer, corrugated and rigid boxes](/blog/mailer-vs-corrugated-vs-rigid-box).',
      ],
      faqs: [
         {
            q: 'What is the difference between single-wall and double-wall boxes?',
            a: 'Single-wall boxes (E or B flute) have one layer of fluting and suit most products. Double-wall boxes (BC flute) have two layers and are much stronger, for heavy, fragile or stacked goods and long-distance shipping.',
         },
         {
            q: 'Can I order plain corrugated boxes without printing?',
            a: 'Yes. Unprinted boxes are the most economical, and you can add a printed logo later or brand them with stickers.',
         },
         {
            q: 'What is the minimum order for printed corrugated boxes?',
            a: '100 boxes per design and size, produced in 7–10 business days after you approve the proof.',
         },
         ORDERING,
         DELIVERY,
      ],
   },

   'packaging/folding-cartons': {
      title: 'Custom Folding Cartons & Retail Boxes',
      description:
         'Custom folding cartons for cosmetics, perfume, pharma and retail in Pakistan: 350–400 gsm board, offset print, foil, spot UV and windows. From 100.',
      heading: 'Printed folding cartons for retail, cosmetics and pharma',
      paragraphs: [
         'Folding cartons are the boxes you see on shop shelves: light, sharp and printed in rich detail. Joji Arts prints [tuck-end cartons](/shop/packaging/folding-cartons/tuck-end-carton), [cosmetic set cartons](/shop/packaging/folding-cartons/cosmetic-set-carton), [perfume sleeve cartons](/shop/packaging/folding-cartons/perfume-sleeve-carton), makeup cartons, [pharmaceutical cartons](/shop/packaging/folding-cartons/pharmaceutical-carton), auto-lock bottom cartons and gable boxes.',
         'Cartons are made from 350 gsm SBS white or kraft board, premium 400 gsm board or metallic board, and printed in offset CMYK with food- and cosmetic-safe inks. Finish them with matte, gloss or soft-touch lamination, foil accents or spot UV, and add a clear PET window to show the product. They ship flat to save space and are made in standard or custom sizes. The minimum order is 100 cartons, produced in 7–10 business days after proof approval.',
         'Cosmetics, skincare, perfume, pharmaceutical and small food brands across Pakistan use our cartons. For a heavier, luxury feel, see our [rigid boxes](/shop/packaging/rigid-boxes), and pair cartons with [product labels](/shop/labels-stickers/product-labels).',
      ],
      faqs: [
         {
            q: 'What board is used for folding cartons?',
            a: '350 gsm SBS white board is the standard for crisp colour; kraft gives a natural look; premium 400 gsm feels sturdier; metallic board adds shine for perfume and gifts.',
         },
         {
            q: 'Can you add a window, foil or spot UV?',
            a: 'Yes. Add a clear PET window, foil accents, spot UV, and matte, gloss or soft-touch lamination.',
         },
         {
            q: 'What is the minimum order for folding cartons?',
            a: '100 cartons per design, produced in 7–10 business days after proof approval.',
         },
         ORDERING,
         DELIVERY,
      ],
   },

   'packaging/kraft-boxes': {
      title: 'Custom Kraft Boxes in Pakistan',
      description:
         'Eco-friendly custom kraft boxes in Pakistan: gift, pillow, tuck, window, soap and shipping boxes printed with your logo. From 100 boxes, made in Lahore.',
      heading: 'Eco-friendly kraft boxes with your logo',
      paragraphs: [
         'Kraft boxes have a warm, natural look that suits handmade, organic and eco-conscious brands. Joji Arts makes [kraft gift boxes](/shop/packaging/kraft-boxes/kraft-gift-box), [kraft pillow boxes](/shop/packaging/kraft-boxes/kraft-pillow-box), [kraft tuck boxes](/shop/packaging/kraft-boxes/kraft-tuck-box), [kraft window boxes](/shop/packaging/kraft-boxes/kraft-window-box), [kraft soap boxes](/shop/packaging/kraft-boxes/kraft-soap-box) and kraft shipping boxes.',
         'Kraft boxes are made from recyclable 350 gsm kraft board and look best with a simple 1-colour logo, though full-colour print, foil accents and clear windows are also available. Choose a standard size or a custom size made to your product. The minimum order is 100 boxes, produced in 7–10 business days after proof approval.',
         'Soap makers, candle brands, bakeries, tea and spice sellers and gift shops across Pakistan use kraft boxes from our studio in Lahore. For shipping, see [kraft mailer boxes](/shop/packaging/mailer-boxes/kraft-mailer-box), and seal them with a [custom sticker](/shop/labels-stickers/stickers).',
      ],
      faqs: [
         {
            q: 'Are kraft boxes eco-friendly?',
            a: 'Yes. Kraft board is made from unbleached paper fibre and is recyclable. It is a popular choice for brands that want natural, low-impact packaging.',
         },
         {
            q: 'Can you print colour on kraft boxes?',
            a: 'Yes. A 1-colour logo in black or white looks cleanest on kraft, but full-colour print and foil are also available. Colours print slightly darker on brown board.',
         },
         {
            q: 'What is the minimum order for kraft boxes?',
            a: '100 boxes per design, produced in 7–10 business days after proof approval.',
         },
         ORDERING,
         DELIVERY,
      ],
   },

   'signage-displays/sign-boards': {
      title: 'Sign Boards in Lahore: Acrylic, ACP & 3D',
      description:
         'Shop and office sign boards in Lahore: acrylic, ACP, metal, PVC, 3D and lit signs, made to size with installation available. Delivered across Pakistan.',
      heading: 'Shop and office sign boards made in Lahore',
      paragraphs: [
         'A good sign board brings customers through the door. Joji Arts designs and fabricates [shop sign boards](/shop/signage-displays/sign-boards/shop-sign-boards), [office sign boards](/shop/signage-displays/sign-boards/office-sign-boards), [acrylic sign boards](/shop/signage-displays/sign-boards/acrylic-sign-boards), [ACP sign boards](/shop/signage-displays/sign-boards/acp-sign-boards), aluminium and stainless steel boards, PVC and flex boards, [3D sign boards](/shop/signage-displays/sign-boards/3d-sign-boards), and front-lit and [back-lit sign boards](/shop/signage-displays/sign-boards/back-lit-sign-boards), plus directional, safety and parking signs.',
         'Boards are made in acrylic, ACP, metal or PVC, in indoor or outdoor grades with weatherproof UV inks, and outdoor boards carry a warranty of up to 5 years. Choose a standard size from 60 × 40 cm to 180 × 90 cm or a custom size, and wall, stand-off, hanging or free-standing mounting. You can order a single sign, made in 5–10 business days, with a free layout mock-up before production.',
         'We can deliver your sign or install it for you. For dimensional lettering, see our [3D and raised letter signs](/shop/signage-displays/3d-raised-letter-signs), and for an eye-catching feature, [custom neon signs](/shop/signage-displays/neon-signs).',
      ],
      faqs: [
         {
            q: 'Which sign board material is best for outdoors?',
            a: 'ACP (aluminium composite) and metal boards are the most durable outdoors. Acrylic looks premium for shop fronts and receptions. All outdoor boards use weatherproof UV inks, with a warranty of up to 5 years.',
         },
         {
            q: 'Do you install sign boards?',
            a: 'Yes. Choose delivery only, or delivery and installation, when you request your quote.',
         },
         {
            q: 'Can I order just one sign board?',
            a: 'Yes. Signs are made to order, so the minimum is one. We send a free layout mock-up before production.',
         },
         {
            q: 'How long does a sign board take?',
            a: '5–10 business days after you approve the mock-up, depending on the material and size.',
         },
         DELIVERY,
      ],
   },

   'printing/flyers': {
      title: 'Flyer Printing in Lahore',
      description:
         'Flyer printing in Lahore: A6, A5, A4 and DL flyers, menus, door hangers and rack cards on 150–350 gsm paper. From 100, printed in 2–4 days.',
      heading: 'Fast flyer printing in Lahore',
      paragraphs: [
         'Flyers are still one of the cheapest ways to reach local customers. Joji Arts prints [standard flyers](/shop/printing/flyers/standard-flyers), [premium flyers](/shop/printing/flyers/premium-flyers), [folded flyers](/shop/printing/flyers/folded-flyers), [menu flyers](/shop/printing/flyers/menu-flyers) for restaurants and takeaways, [door hangers](/shop/printing/flyers/door-hangers) and rack cards.',
         'Choose A6, A5, A4 or DL size on 150 gsm gloss, 250 gsm silk or 350 gsm matte paper, printed in vivid full colour on one or both sides. The minimum order is 100 flyers, printed in 2–4 business days after you approve the proof, with volume discounts on larger runs.',
         'Collect from our studio at Lakshmi Chowk, Lahore, or get delivery anywhere in Pakistan. Need more room? See our [brochures](/shop/printing/brochures), and match your flyers with [business cards](/shop/printing/business-cards).',
      ],
      faqs: [
         {
            q: 'How fast can you print flyers?',
            a: 'Flyers are printed in 2–4 business days after you approve the proof.',
         },
         {
            q: 'Which paper should I choose for flyers?',
            a: '150 gsm gloss is economical for handouts; 250 gsm silk feels more substantial; 350 gsm matte is card-like and best for menus and premium flyers.',
         },
         {
            q: 'What is the minimum order for flyers?',
            a: '100 flyers per design. Larger quantities get volume discounts.',
         },
         ORDERING,
         DELIVERY,
      ],
   },

   packaging: {
      title: 'Custom Packaging Boxes in Pakistan',
      description:
         'Custom printed packaging boxes in Pakistan: mailer, corrugated, rigid, kraft and folding carton boxes made to your size. From 100 boxes, printed in Lahore.',
      heading: 'Custom packaging boxes in Pakistan, made to your size',
      paragraphs: [
         'Joji Arts designs and prints custom packaging boxes for brands, online stores, restaurants and manufacturers across Pakistan. Every box is made to your product size and printed with your logo, from simple 1-colour shipping cartons to luxury rigid gift boxes with foil and embossing. Our studio is at Lakshmi Chowk in Lahore, and we deliver to Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar and every other city in Pakistan.',
         '**Which box do you need?** [Mailer boxes](/shop/packaging/mailer-boxes) are self-locking boxes for e-commerce and subscription orders that look great when opened. [Corrugated boxes](/shop/packaging/corrugated-boxes) are strong single and double-wall cartons for shipping, storage and moving. [Rigid boxes](/shop/packaging/rigid-boxes) are heavyweight luxury boxes for perfume, jewellery, watches and gifts. [Folding cartons](/shop/packaging/folding-cartons) are paperboard boxes for retail shelves, cosmetics and pharmaceuticals. [Kraft boxes](/shop/packaging/kraft-boxes) give an eco-friendly, natural look, and [specialty boxes](/shop/packaging/specialty-boxes) include hexagon, cylinder, pillow and sliding-sleeve shapes.',
         '**Materials and printing.** Shipping and mailer boxes use white or kraft corrugated board in E, B or double-wall BC flute. Folding cartons use 350–400 gsm SBS white, kraft or metallic board. Print the outside, or the outside and inside, in full colour with Pantone matching, or keep costs low with a 1-colour logo or unprinted boxes. Finish with matte, gloss or soft-touch lamination, foil accents, spot UV or a clear window.',
         '**Minimums and lead times.** Mailer, corrugated, kraft and folding carton boxes start from 100 boxes and take 7–10 business days after you approve the proof. Rigid and specialty boxes start from 50 boxes and take 12–15 business days. Every order includes a free structural and artwork check, and a digital proof before anything is printed. Need a sample first? Order a [prototype or sample box](/shop/custom-packaging/custom-printing/prototype-and-sample-box), or get help from our [packaging design service](/shop/custom-packaging/custom-printing/packaging-design-service).',
      ],
      faqs: [
         {
            q: 'What is the minimum order for custom packaging boxes?',
            a: 'Mailer, corrugated, kraft and folding carton boxes start from 100 boxes per design. Rigid and specialty luxury boxes start from 50. Larger quantities lower the price per box, and we price every quantity tier in your quote.',
         },
         {
            q: 'Can you make boxes in my exact size?',
            a: 'Yes. Every style is available in small, medium and large, or in a custom size made to your product. Send us your product dimensions and we will check the structure for free before printing.',
         },
         {
            q: 'How long does custom box printing take?',
            a: 'Most boxes take 7–10 business days after proof approval, and rigid luxury boxes 12–15 business days, plus delivery time to your city.',
         },
         {
            q: 'Which box is best for an online store?',
            a: 'Mailer boxes are the most popular for e-commerce: they lock without tape, protect products in transit and can be printed inside for a memorable unboxing. For heavy items, choose a double-wall corrugated box.',
         },
         ORDERING,
         DELIVERY,
      ],
   },

   'packaging/mailer-boxes': {
      title: 'Custom Mailer Boxes in Pakistan',
      description:
         'Printed mailer boxes for e-commerce and subscription brands in Pakistan: self-locking, printed inside and out, made to your size. From 100 boxes.',
      heading: 'Custom printed mailer boxes for e-commerce brands',
      paragraphs: [
         'Mailer boxes are the go-to packaging for online stores and subscription brands. They fold together and lock without tape, protect your products in the post, and turn every delivery into a branded unboxing. Choose a [branded mailer box](/shop/packaging/mailer-boxes/branded-mailer-box), a sturdier [rigid mailer box](/shop/packaging/mailer-boxes/rigid-mailer-box), an economical lite mailer, an eco [kraft mailer box](/shop/packaging/mailer-boxes/kraft-mailer-box), a subscription mailer, or an [inside-printed mailer box](/shop/packaging/mailer-boxes/inside-printed-mailer-box) that reveals a message when it opens.',
         'Mailers are made from white or kraft corrugated board, or double-wall for heavier items, and printed in full colour outside, outside and inside, or with a 1-colour logo. Add a matte, gloss or soft-touch finish or foil accents. Every size can be made to fit your product, which also keeps courier charges down. The minimum order is 100 boxes, produced in 7–10 business days after proof approval.',
         'We print mailer boxes in Lahore for clothing, cosmetics, candles, bakery, gadget and gift brands, and deliver them across Pakistan. Pair them with [custom stickers](/shop/labels-stickers/stickers) and tissue for a complete unboxing.',
      ],
      faqs: [
         {
            q: 'What is a mailer box?',
            a: 'A one-piece corrugated box with a tuck-in lid that locks without tape. It is strong enough to ship by courier and looks premium when the customer opens it, which is why most e-commerce brands use it.',
         },
         {
            q: 'Can you print inside the mailer box?',
            a: 'Yes. Choose "outside + inside" printing to add a pattern, thank-you note or social handles on the inside of the lid.',
         },
         {
            q: 'What is the minimum order for mailer boxes?',
            a: '100 boxes per design and size, with production in 7–10 business days after you approve the proof.',
         },
         ORDERING,
         DELIVERY,
      ],
   },

   'printing/business-cards': {
      title: 'Business Card Printing in Lahore',
      description:
         'Business card printing in Lahore: matte, soft-touch, spot UV, foil and kraft cards on 350–600 gsm stock. From 100 cards, ready in 3–5 days.',
      heading: 'Business card printing in Lahore, ready in 3–5 days',
      paragraphs: [
         'A good business card is still the quickest way to leave a lasting impression. Joji Arts prints [standard business cards](/shop/printing/business-cards/standard-business-cards), [premium matte cards](/shop/printing/business-cards/premium-matte-business-cards), [spot UV cards](/shop/printing/business-cards/spot-uv-business-cards), [foil business cards](/shop/printing/business-cards/foil-business-cards), recycled [kraft business cards](/shop/printing/business-cards/kraft-business-cards) and rounded-corner cards.',
         'Choose 350 gsm silk, 400 gsm matte or thick 600 gsm luxe paper, or recycled kraft, printed on one or both sides at the standard 85 × 55 mm size. Finish with matte, gloss, soft-touch or spot UV, with square or rounded corners. Cards start from 100 and are printed in 3–5 business days, with a free design check and Pantone-accurate colour.',
         'Pick up from our studio at Lakshmi Chowk, Lahore, or have your cards delivered anywhere in Pakistan. Matching [letterheads](/shop/printing/letterheads), [envelopes](/shop/printing/envelopes) and [flyers](/shop/printing/flyers) are available in the same style.',
      ],
      faqs: [
         {
            q: 'How fast can you print business cards?',
            a: 'Business cards are printed in 3–5 business days after you approve the proof, plus delivery time if you are outside Lahore.',
         },
         {
            q: 'What is the minimum order for business cards?',
            a: '100 cards per design. Larger quantities lower the price per card.',
         },
         {
            q: 'Which finish looks most premium?',
            a: 'Soft-touch lamination on 600 gsm luxe board feels the most premium. Add spot UV or foil on your logo to make it stand out.',
         },
         {
            q: 'Can you design my business card?',
            a: 'Yes. Send your logo and details and our team will lay out the card and send a free proof before printing.',
         },
         DELIVERY,
      ],
   },

   'labels-stickers': {
      title: 'Custom Stickers & Labels in Pakistan',
      description:
         'Custom stickers and product labels printed in Lahore: waterproof vinyl, holographic, kraft and BOPP labels on rolls or sheets. From 250, delivered across Pakistan.',
      heading: 'Custom stickers and product labels, printed in Lahore',
      paragraphs: [
         'Labels and stickers are the easiest way to brand jars, bottles, boxes, bags and parcels. Joji Arts prints [product labels](/shop/labels-stickers/product-labels) for food, cosmetics and drinks, [custom stickers](/shop/labels-stickers/stickers) for packaging and giveaways, [shipping labels](/shop/labels-stickers/shipping-labels), and [barcode and QR labels](/shop/labels-stickers/barcode-qr-labels).',
         'Product labels come in white paper, waterproof white BOPP, clear BOPP, kraft paper or metallic, with permanent, removable or freezer adhesive, supplied on machine-ready rolls or sheets. Stickers are printed on gloss, matte, holographic or clear vinyl that is waterproof and UV-resistant, and can be cut to any shape. Both start from 250 pieces and are printed in 4–6 business days after proof approval.',
         'We print in Lahore and deliver to businesses across Pakistan. Pair your labels with our [custom packaging boxes](/shop/packaging) for a consistent brand look.',
      ],
      faqs: [
         {
            q: 'What is the minimum order for custom stickers and labels?',
            a: '250 stickers or labels per design. Larger runs lower the price per piece.',
         },
         {
            q: 'Are your labels waterproof?',
            a: 'Yes, if you choose white or clear BOPP for labels or vinyl for stickers. Both resist water and oil, which makes them ideal for drinks, sauces, cosmetics and fridge or freezer products.',
         },
         {
            q: 'Can I get labels on rolls for a labelling machine?',
            a: 'Yes. Product labels can be supplied on machine-ready rolls or on sheets for hand application.',
         },
         ORDERING,
         DELIVERY,
      ],
   },

   'signage-displays/neon-signs': {
      title: 'Custom Neon Signs in Lahore',
      description:
         'Custom LED neon signs in Lahore: your logo, name or quote in any colour, 50–150 cm wide, plug-and-play with a 2-year warranty. Delivered across Pakistan.',
      heading: 'Custom LED neon signs made in Lahore',
      paragraphs: [
         'Neon signs make shops, cafés, salons, offices and events instantly recognisable, and they look great in photos. Joji Arts makes [custom neon signs](/shop/signage-displays/neon-signs/custom-neon-signs), [neon logo signs](/shop/signage-displays/neon-signs/neon-logo-signs), [neon name signs](/shop/signage-displays/neon-signs/neon-name-signs) for weddings and bedrooms, neon quotes and wall signs, all with modern [LED neon](/shop/signage-displays/neon-signs/led-neon-signs) that is safe, light and energy-efficient.',
         'Choose a size from 50 cm to 150 cm wide, a colour such as hot pink, ice blue, warm white or purple, or RGB colour-changing, and a backboard cut to shape, clear rectangle, black acrylic or free-standing. Every sign is plug-and-play on a 12V adapter and comes with a 2-year warranty. You can order just one sign, and it is made in 7–10 business days after you approve the design mock-up.',
         'We make neon signs in Lahore and deliver across Pakistan. For bigger shop-front projects, see our [sign boards](/shop/signage-displays/sign-boards) and [3D letter signs](/shop/signage-displays/3d-raised-letter-signs).',
      ],
      faqs: [
         {
            q: 'How much does a custom neon sign cost?',
            a: 'The price depends mainly on size, the length of the text or logo, and the colours. Send us your text or logo and preferred size, and we will send a mock-up and price within one business day.',
         },
         {
            q: 'Can I order just one neon sign?',
            a: 'Yes. Neon signs are made to order, so the minimum is one sign.',
         },
         {
            q: 'Are LED neon signs safe to use indoors?',
            a: 'Yes. LED neon runs on a low-voltage 12V adapter, stays cool to the touch and uses far less power than glass neon. Every sign has a 2-year warranty.',
         },
         {
            q: 'How long does a custom neon sign take?',
            a: '7–10 business days after you approve the design mock-up, plus delivery time to your city.',
         },
         DELIVERY,
      ],
   },

   'food-packaging/food-containers': {
      title: 'Custom Food Containers & Meal Trays',
      description:
         'Branded food containers for restaurants and caterers in Pakistan: clamshells, compartment boxes, salad bowls, meal trays and soup containers. From 100.',
      heading: 'Food containers for delivery and catering',
      paragraphs: [
         'Delivery food has to arrive hot, sealed and looking good. Joji Arts supplies branded [hinged food containers](/shop/food-packaging/food-containers/hinged-food-container) (clamshells), [compartment containers](/shop/food-packaging/food-containers/compartmented-container) for rice and curry meals, [salad bowls](/shop/food-packaging/food-containers/salad-bowl-container), [kraft meal trays with lids](/shop/food-packaging/food-containers/kraft-meal-tray-with-lid), [catering meal trays](/shop/food-packaging/food-containers/catering-meal-tray) and soup containers.',
         'Containers are made from food-grade board with a water-based barrier coating in white, kraft or grease-resistant finishes, and can be printed with a 1-colour logo, 2 colours or full colour. The minimum order is 100 pieces, with production in 6–9 business days after you approve the proof.',
         'Complete your takeaway packaging with [pizza and burger boxes](/shop/food-packaging/food-boxes), [cups](/shop/food-packaging/cups) and [food bags](/shop/food-packaging/food-bags). Read our [guide to food packaging in Lahore](/blog/food-packaging-lahore-guide) for help choosing.',
      ],
      faqs: [
         {
            q: 'Are your food containers leak-proof?',
            a: 'They are made from food-grade board with a water-based barrier coating that resists grease and moisture. For very liquid dishes, choose soup containers or the grease-resistant coated option.',
         },
         {
            q: 'What is the minimum order for printed food containers?',
            a: '100 pieces per design, produced in 6–9 business days after proof approval.',
         },
         ORDERING,
         DELIVERY,
      ],
   },
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
