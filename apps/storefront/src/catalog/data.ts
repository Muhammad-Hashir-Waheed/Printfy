/**
 * Joji Arts catalog — single source of truth for departments, categories and products.
 *
 * This file intentionally has NO imports so it can be read both by Next.js and by
 * `scripts/fetch-catalog-images.mjs` (plain Node with type stripping).
 *
 * Product tuple: [name, summary, price?, imageQuery?]
 *   - price: number  → starting unit price (USD) for the category's pricing preset
 *   - price: { quote: number } → quote-only product, "from" price shown
 */

export type ProductPrice = number | { quote: number }

export type ProductSeed = [
   name: string,
   summary: string,
   price?: ProductPrice,
   imageQuery?: string,
]

export type PresetKind =
   | 'box'
   | 'rigid'
   | 'carton'
   | 'food'
   | 'cup'
   | 'accessory'
   | 'display-box'
   | 'insert'
   | 'wrap'
   | 'bag'
   | 'fabric-bag'
   | 'pouch'
   | 'card'
   | 'stationery'
   | 'envelope'
   | 'flyer'
   | 'brochure'
   | 'office'
   | 'label'
   | 'sticker'
   | 'poster'
   | 'banner'
   | 'promo'
   | 'apparel'
   | 'gift'
   | 'service'
   | 'acrylic'
   | 'plastic'
   | 'sign'
   | 'letters'
   | 'neon'
   | 'digital'
   | 'led'
   | 'display'
   | 'branding'
   | 'office-sign'
   | 'event'

export type CategorySeed = {
   slug: string
   name: string
   blurb: string
   kind: PresetKind
   imageQuery?: string
   /** Show this category's products from another category (e.g. Marketing → Flyers) */
   aliasOf?: string
   /** Link straight to a page instead of a product list (e.g. Request a Quote) */
   href?: string
   products: ProductSeed[]
}

export type DepartmentSeed = {
   slug: string
   name: string
   short: string
   tagline: string
   description: string
   /** Accent colour for this department (hex) */
   accent: string
   /** Dark, glowing presentation (used for Signage) */
   dark?: boolean
   imageQuery: string
   categories: CategorySeed[]
}

export const DEPARTMENT_SEEDS: DepartmentSeed[] = [
   /* ───────────────────────────── 1. PACKAGING ───────────────────────────── */
   {
      slug: 'packaging',
      name: 'Packaging',
      short: 'Packaging',
      tagline: 'Boxes that build your brand',
      description:
         'Corrugated shippers, mailers, rigid luxury boxes and folding cartons — printed in full colour and made to your exact size.',
      accent: '#B7793E',
      imageQuery: 'branded cardboard boxes packaging',
      categories: [
         {
            slug: 'corrugated-boxes',
            name: 'Corrugated Boxes',
            blurb: 'Strong single and double-wall cartons for shipping and storage.',
            kind: 'box',
            imageQuery: 'corrugated cardboard boxes stack',
            products: [
               ['Corrugated Shipping Box', 'Single-wall shipping carton with optional outer branding.', 1.45, 'cardboard shipping box'],
               ['Heavy-Duty Double-Wall Box', 'Double-wall strength for fragile and heavy goods.', 2.35, 'heavy duty cardboard box'],
               ['Cube Shipping Box', 'Square cube carton, ideal for subscription kits.', 1.65, 'square cardboard box'],
               ['Printed Corrugated Box', 'Full-colour flexo or digital print on the outside.', 1.95, 'printed cardboard box'],
               ['Tray & Lid Corrugated Box', 'Two-piece tray and lid for premium shipping.', 2.1, 'cardboard box with lid'],
               ['Moving & Storage Box', 'Large carton with hand holes for moving and archives.', 1.8, 'moving boxes'],
               ['E-Flute Retail Box', 'Thin, crisp flute that prints sharp graphics.', 1.55, 'retail cardboard box'],
            ],
         },
         {
            slug: 'mailer-boxes',
            name: 'Mailer Boxes',
            blurb: 'Self-locking e-commerce mailers that make unboxing memorable.',
            kind: 'box',
            imageQuery: 'mailer box unboxing',
            products: [
               ['Branded Mailer Box', 'Roll-end mailer with exterior and interior print.', 1.25, 'mailer box'],
               ['Rigid Mailer Box', 'Premium rigid mailer for beauty and apparel brands.', 2.1, 'premium mailer box'],
               ['Lite Mailer Box', 'Lightweight mailer that keeps postage costs low.', 0.95, 'white mailer box'],
               ['Kraft Mailer Box', 'Natural kraft mailer with one-colour logo.', 1.1, 'kraft mailer box'],
               ['Subscription Mailer Box', 'Sized and styled for monthly subscription kits.', 1.4, 'subscription box'],
               ['Inside-Printed Mailer Box', 'Hidden interior print for a surprise reveal.', 1.6, 'unboxing box tissue'],
            ],
         },
         {
            slug: 'rigid-boxes',
            name: 'Rigid Boxes',
            blurb: 'Heavyweight luxury boxes with wrapped paper finishes.',
            kind: 'rigid',
            imageQuery: 'luxury rigid gift box',
            products: [
               ['Premium Rigid Box', 'Heavyweight chipboard wrapped in printed or textured paper.', 2.4, 'luxury black box'],
               ['Magnetic Closure Box', 'Book-style lid that snaps shut with hidden magnets.', 2.6, 'magnetic gift box'],
               ['Drawer Rigid Box', 'Slide-out drawer with ribbon pull for unboxing.', 2.75, 'drawer box packaging'],
               ['Sleeve Rigid Box', 'Rigid base with a removable branded sleeve.', 2.55, 'box with sleeve'],
               ['Lift-Off Lid Box', 'Classic two-piece telescope rigid box.', 2.3, 'two piece gift box'],
               ['Book-Style Rigid Box', 'Opens like a hardcover book — perfect for launches.', 2.9, 'book style box'],
               ['Collapsible Rigid Box', 'Ships flat, folds into a sturdy rigid box.', 2.2, 'foldable gift box'],
            ],
         },
         {
            slug: 'folding-cartons',
            name: 'Folding Cartons',
            blurb: 'Paperboard cartons for retail shelves, cosmetics and pharma.',
            kind: 'carton',
            imageQuery: 'product carton boxes',
            products: [
               ['Tuck-End Carton', 'Straight or reverse tuck-end carton in SBS board.', 0.55, 'tuck end box'],
               ['Cosmetic Set Carton', 'Carton for creams, serums and beauty gift sets.', 0.95, 'cosmetic packaging box'],
               ['Perfume Sleeve Carton', 'Tall slip sleeve for fragrance bottles.', 0.72, 'perfume box'],
               ['Makeup Folding Carton', 'Tuck-top carton for palettes and makeup kits.', 0.88, 'makeup packaging'],
               ['Pharmaceutical Carton', 'Clean, compliant cartons for medicine and supplements.', 0.48, 'medicine box'],
               ['Auto-Lock Bottom Carton', 'Crash-lock base that holds heavier products.', 0.65, 'product carton'],
               ['Gable Box', 'Carry-handle gable box for gifts and treats.', 0.7, 'gable box'],
            ],
         },
         {
            slug: 'kraft-boxes',
            name: 'Kraft Boxes',
            blurb: 'Eco-friendly natural kraft boxes with a crafted look.',
            kind: 'carton',
            imageQuery: 'kraft paper boxes',
            products: [
               ['Kraft Gift Box', 'Natural kraft gift box for boutique brands.', 1.2, 'kraft gift box'],
               ['Kraft Pillow Box', 'Curved pillow box for small gifts and favours.', 0.45, 'pillow box'],
               ['Kraft Tuck Box', 'Recyclable tuck box with one-colour stamp print.', 0.52, 'kraft box'],
               ['Kraft Window Box', 'Kraft box with a clear window to show the product.', 0.75, 'kraft box window'],
               ['Kraft Soap Box', 'Compact kraft box sized for handmade soaps.', 0.4, 'soap packaging kraft'],
               ['Kraft Shipping Box', 'Brown kraft corrugated box for eco shipping.', 1.3, 'brown kraft box'],
            ],
         },
         {
            slug: 'specialty-boxes',
            name: 'Specialty Boxes',
            blurb: 'Unique shapes and structures that stand out on the shelf.',
            kind: 'rigid',
            imageQuery: 'unique packaging design box',
            products: [
               ['Luxury Perfume Box', 'Rigid perfume presentation box with foil-ready panels.', 2.15, 'luxury perfume packaging'],
               ['Magnetic Makeup Box', 'Magnetic-lid box for premium makeup collections.', 2.35, 'makeup gift box'],
               ['Hexagon Box', 'Six-sided box for candles, sweets and gifts.', 1.9, 'hexagon box'],
               ['Cylinder Tube Box', 'Round paper tube for tea, cosmetics and posters.', 1.7, 'cylinder paper tube packaging'],
               ['Pillow Box', 'Printed pillow box for jewellery and favours.', 0.5, 'pillow gift box'],
               ['Sliding Sleeve Box', 'Matchbox-style slide box with printed sleeve.', 1.35, 'slide box packaging'],
               ['Briefcase Handle Box', 'Carry box with integrated handle.', 2.1, 'gift box handle'],
            ],
         },
      ],
   },

   /* ───────────────────────────── 2. FOOD PACKAGING ───────────────────────────── */
   {
      slug: 'food-packaging',
      name: 'Food Packaging',
      short: 'Food',
      tagline: 'Takeaway that tastes like your brand',
      description:
         'Pizza boxes, burger clamshells, cups, bags and containers — food-safe, grease-resistant and printed with your logo.',
      accent: '#E5482F',
      imageQuery: 'takeaway food packaging',
      categories: [
         {
            slug: 'food-boxes',
            name: 'Food Boxes',
            blurb: 'Pizza, burger, bakery and fries boxes in food-safe board.',
            kind: 'food',
            imageQuery: 'pizza box',
            products: [
               ['Custom Pizza Box', 'Grease-resistant corrugated pizza box with full-colour lid.', 0.89, 'pizza box'],
               ['Kraft Pizza Box', 'Eco kraft pizza box with one-colour logo.', 0.75, 'kraft pizza box'],
               ['Window Pizza Box', 'White pizza box with a clear display window.', 0.95, 'pizza in box'],
               ['Branded Burger Box', 'Fold-top clamshell with custom logo print.', 0.42, 'burger box'],
               ['Large Combo Burger Box', 'Extra room for double stacks and combo meals.', 0.55, 'burger takeaway'],
               ['Fries & Nugget Carton', 'Open-top carton for fries, nuggets and sides.', 0.28, 'french fries carton'],
               ['Window Bakery Box', 'Clear-window pastry box for cakes and cookies.', 0.72, 'bakery box'],
               ['Donut Box', 'Flat bakery box sized for donuts and sweets.', 0.58, 'donut box'],
               ['Cake Box', 'Tall cake box with easy-fold lid.', 1.1, 'cake box'],
               ['Noodle Box', 'Leak-resistant noodle and rice box with wire-free fold.', 0.36, 'noodle box takeaway'],
            ],
         },
         {
            slug: 'food-containers',
            name: 'Food Containers',
            blurb: 'Clamshells, bowls and trays for delivery and catering.',
            kind: 'food',
            imageQuery: 'food container takeaway',
            products: [
               ['Hinged Food Container', 'Leak-resistant hinged clamshell.', 0.55, 'food clamshell container'],
               ['Compartmented Container', 'Multi-compartment container for combo meals.', 0.68, 'meal prep container'],
               ['Salad Bowl Container', 'Kraft bowl with a clear lid for salads and poke.', 0.62, 'salad bowl takeaway'],
               ['Kraft Meal Tray with Lid', 'Compartment meal tray for bowls and combos.', 0.65, 'kraft food tray'],
               ['Catering Meal Tray', 'Large tray for family and party orders.', 1.15, 'catering tray food'],
               ['Soup Container', 'Insulated paper soup cup with vented lid.', 0.4, 'soup cup takeaway'],
               ['Sushi Tray', 'Printed sushi tray with clear dome lid.', 0.7, 'sushi takeaway box'],
            ],
         },
         {
            slug: 'food-bags',
            name: 'Food Bags',
            blurb: 'Grease-resistant takeaway, bakery and grocery bags.',
            kind: 'bag',
            imageQuery: 'takeaway paper bag food',
            products: [
               ['Grease-Resistant Takeout Bag', 'Twisted-handle bag for burgers and combo orders.', 0.35, 'takeout paper bag'],
               ['SOS Grocery Bag', 'Self-opening paper bag for food delivery.', 0.31, 'paper grocery bag'],
               ['Kraft To-Go Bag', 'Natural kraft takeaway bag with one-colour branding.', 0.29, 'kraft takeaway bag'],
               ['Sandwich Bag', 'Greaseproof flat bag for sandwiches and wraps.', 0.12, 'sandwich paper bag'],
               ['Bakery Bread Bag', 'Window bread bag for loaves and baguettes.', 0.18, 'bread paper bag'],
               ['Coffee Bean Pouch', 'Valved pouch that keeps beans fresh.', 0.45, 'coffee bag'],
            ],
         },
         {
            slug: 'cups',
            name: 'Cups',
            blurb: 'Hot, cold and dessert cups with full-wrap print.',
            kind: 'cup',
            imageQuery: 'paper coffee cups',
            products: [
               ['Hot Paper Cup', 'Single-wall hot cup with full-wrap custom print.', 0.19, 'paper coffee cup'],
               ['Double-Wall Coffee Cup', 'Insulated double-wall cup — no sleeve needed.', 0.26, 'takeaway coffee cup'],
               ['Cold Paper Cup', 'PE-lined cold cup for sodas and iced drinks.', 0.17, 'cold drink paper cup'],
               ['Branded Sip Cup', 'Café-style cup with lid-ready rim.', 0.21, 'coffee cup branding'],
               ['Clear PET Smoothie Cup', 'Crystal-clear cup for smoothies and bubble tea.', 0.22, 'smoothie cup'],
               ['Ice Cream Cup', 'Printed dessert cup for ice cream and frozen yogurt.', 0.15, 'ice cream cup'],
               ['Cup Sleeves', 'Printed corrugated sleeves for hot drinks.', 0.09, 'coffee cup sleeve'],
            ],
         },
         {
            slug: 'food-accessories',
            name: 'Food Accessories',
            blurb: 'Carriers, napkins, liners and the finishing touches.',
            kind: 'accessory',
            imageQuery: 'drink carrier coffee',
            products: [
               ['4-Cup Drink Carrier', 'Sturdy carrier for delivery and pickup.', 0.52, 'cup holder carrier'],
               ['2-Cup Drink Carrier', 'Compact carrier with side branding panels.', 0.34, 'coffee cup carrier'],
               ['4-Bottle Carrier', 'Cardboard carrier for bottles and jars.', 0.85, 'bottle carrier cardboard'],
               ['Wine Bottle Carrier', 'Tall carrier for wine and spirits.', 0.95, 'wine bottle gift box'],
               ['Printed Napkins', 'Soft tissue napkins with your logo.', 0.04, 'napkins restaurant'],
               ['Greaseproof Tray Liners', 'Printed liners for trays and baskets.', 0.06, 'greaseproof paper burger'],
               ['Cutlery Pouch', 'Paper sleeve for cutlery and napkin sets.', 0.08, 'cutlery set paper'],
               ['Branded Food Seals', 'Tamper-evident seals for delivery bags.', 0.05, 'food delivery bag sticker'],
            ],
         },
      ],
   },

   /* ───────────────────────────── 3. RETAIL PACKAGING ───────────────────────────── */
   {
      slug: 'retail-packaging',
      name: 'Retail Packaging',
      short: 'Retail',
      tagline: 'Shelf appeal, sorted',
      description:
         'Product boxes, counter displays, inserts and finishing touches that help your products sell themselves.',
      accent: '#C2417B',
      imageQuery: 'retail product packaging shelf',
      categories: [
         {
            slug: 'product-boxes',
            name: 'Product Boxes',
            blurb: 'Printed boxes for cosmetics, candles, electronics and more.',
            kind: 'carton',
            imageQuery: 'product packaging box',
            products: [
               ['Window Product Box', 'Display carton with a clear window.', 1.05, 'product box window'],
               ['Cosmetic Product Box', 'Printed carton for skincare and beauty.', 0.95, 'skincare packaging'],
               ['Candle Box', 'Rigid or folding box sized for candle jars.', 0.85, 'candle packaging'],
               ['Soap Box', 'Printed sleeve or tuck box for bar soap.', 0.6, 'soap box packaging'],
               ['Electronics Box', 'Precise-fit box for gadgets and accessories.', 1.2, 'electronics packaging'],
               ['Jewelry Box', 'Small rigid box with foam or velvet insert.', 1.4, 'jewelry box'],
               ['Apparel Box', 'Shallow box for shirts, scarves and garments.', 1.3, 'clothing gift box'],
            ],
         },
         {
            slug: 'display-boxes',
            name: 'Display Boxes',
            blurb: 'Counter, shelf and point-of-sale displays.',
            kind: 'display-box',
            imageQuery: 'counter display box retail',
            products: [
               ['Counter Display Box', 'Tear-away lid display for checkout counters.', 2.4, 'counter display'],
               ['Shelf-Ready Display Tray', 'Retail-ready tray that goes straight on the shelf.', 1.6, 'retail shelf display'],
               ['Window Display Box', 'Open-front display with a clear PET window.', 1.25, 'display box'],
               ['Lip Balm Display Box', 'Compact counter display for lip balm and minis.', 1.8, 'cosmetics display'],
               ['Point-of-Sale Display', 'Branded POS unit for impulse purchases.', 3.5, 'point of sale display'],
               ['Floor Display Unit', 'Free-standing cardboard floor display.', { quote: 45 }, 'cardboard floor display'],
            ],
         },
         {
            slug: 'inserts',
            name: 'Inserts',
            blurb: 'Thank-you cards, care cards and protective inserts.',
            kind: 'insert',
            imageQuery: 'thank you card package',
            products: [
               ['Thank-You Insert Card', 'Branded card that turns buyers into fans.', 0.14, 'thank you card'],
               ['Product Care Insert', 'Care instructions for apparel and goods.', 0.12, 'care card'],
               ['Promo Insert Card', 'Discount or QR promo card for every package.', 0.1, 'discount card'],
               ['Cardboard Box Insert', 'Die-cut cardboard insert that holds products in place.', 0.35, 'box insert cardboard'],
               ['Foam Insert', 'Custom-cut foam insert for fragile items.', 0.65, 'foam insert case'],
               ['Product Leaflet', 'Folded leaflet or manual for inside the box.', 0.18, 'leaflet printing'],
            ],
         },
         {
            slug: 'specialty-packaging',
            name: 'Specialty Packaging',
            blurb: 'Tissue, wrapping paper, tags and ribbons.',
            kind: 'wrap',
            imageQuery: 'tissue paper wrapping gift',
            products: [
               ['Custom Tissue Paper', 'Branded tissue sheets for unboxing moments.', 0.11, 'tissue paper'],
               ['Pattern Tissue Paper', 'Full-bleed pattern tissue for gift packaging.', 0.13, 'patterned tissue paper'],
               ['Custom Wrapping Paper', 'Full-bleed printed wrapping paper rolls.', 0.35, 'wrapping paper'],
               ['Kraft Wrapping Paper', 'Eco kraft wrap with logo repeat print.', 0.28, 'kraft wrapping paper'],
               ['Custom Hang Tags', 'Die-cut hang tags for apparel and gifts.', 0.12, 'hang tags'],
               ['Kraft Hang Tags', 'Eco kraft tag with one-colour stamp print.', 0.09, 'kraft tag'],
               ['Fold-Over Product Tags', 'Fold-over tags for jewellery and small goods.', 0.15, 'product tag'],
               ['Logo Ribbons', 'Satin or grosgrain ribbon printed with your logo.', 0.3, 'ribbon gift'],
            ],
         },
      ],
   },

   /* ───────────────────────────── 4. BAGS ───────────────────────────── */
   {
      slug: 'bags',
      name: 'Bags',
      short: 'Bags',
      tagline: 'Carry your brand down the street',
      description:
         'Paper shoppers, kraft bags, reusable totes and pouches — every bag a walking billboard.',
      accent: '#2F8F5B',
      imageQuery: 'shopping bags branding',
      categories: [
         {
            slug: 'paper-bags',
            name: 'Paper Bags',
            blurb: 'Retail shoppers in white, colour and luxury laminated finishes.',
            kind: 'bag',
            imageQuery: 'paper shopping bag',
            products: [
               ['Paper Shopping Bag', 'Retail shopper with twisted paper handles.', 0.55, 'paper shopping bag'],
               ['Luxury Shopper Bag', 'Thick laminated shopper with ribbon handles.', 1.2, 'luxury shopping bag'],
               ['Laminated Paper Bag', 'Gloss or matte laminated bag with rope handles.', 0.95, 'laminated paper bag'],
               ['Rope-Handle Gift Bag', 'Gift bag with soft cotton rope handles.', 1.1, 'gift bag'],
               ['White Paper Bag', 'Clean white bag for boutiques and pharmacies.', 0.45, 'white paper bag'],
               ['Boutique Ribbon Bag', 'Ribbon-tie bag for jewellery and fashion.', 1.35, 'boutique bag'],
            ],
         },
         {
            slug: 'kraft-bags',
            name: 'Kraft Bags',
            blurb: 'Natural brown kraft bags — recyclable and robust.',
            kind: 'bag',
            imageQuery: 'kraft paper bag',
            products: [
               ['Kraft Shopping Bag', 'Brown kraft shopper with logo print.', 0.48, 'brown paper bag'],
               ['Twisted Handle Kraft Bag', 'Kraft bag with twisted paper handles.', 0.52, 'kraft bag handles'],
               ['Flat Handle Kraft Bag', 'Economical flat-handle kraft bag.', 0.42, 'kraft carrier bag'],
               ['Kraft Bag with Window', 'Kraft bag with a clear display window.', 0.58, 'kraft bag window'],
               ['Mini Kraft Gift Bag', 'Small kraft bag for favours and samples.', 0.3, 'small kraft gift bag'],
            ],
         },
         {
            slug: 'fabric-bags',
            name: 'Fabric Bags',
            blurb: 'Reusable canvas, cotton, jute and non-woven bags.',
            kind: 'fabric-bag',
            imageQuery: 'canvas tote bag',
            products: [
               ['Canvas Tote Bag', 'Heavy canvas tote with front print.', 4.5, 'canvas tote bag'],
               ['Non-Woven Bag', 'Durable, low-cost reusable bag.', 0.95, 'reusable shopping bag'],
               ['Jute Bag', 'Natural jute bag with cotton handles.', 3.2, 'jute bag'],
               ['Cotton Drawstring Bag', 'Drawstring bag for gifts, gyms and events.', 1.8, 'drawstring bag'],
               ['Foldable Shopping Bag', 'Folds into its own pouch — perfect giveaway.', 2.4, 'foldable bag'],
               ['Velvet Pouch', 'Soft velvet pouch for jewellery and luxury items.', 1.1, 'velvet pouch'],
            ],
         },
         {
            slug: 'pouches',
            name: 'Pouches',
            blurb: 'Stand-up pouches, zip bags and mailer bags.',
            kind: 'pouch',
            imageQuery: 'stand up pouch packaging',
            products: [
               ['Stand-Up Pouch', 'Printed stand-up pouch with resealable zip.', 0.38, 'stand up pouch'],
               ['Zipper Pouch', 'Flat zip pouch for snacks and samples.', 0.42, 'zip pouch'],
               ['Flat Bottom Pouch', 'Box-bottom pouch with five printable panels.', 0.55, 'coffee pouch'],
               ['Custom Poly Mailer', 'Waterproof poly mailer with full-colour print.', 0.28, 'poly mailer'],
               ['Kraft Paper Mailer', 'Eco kraft mailer envelope for soft goods.', 0.32, 'paper mailer envelope'],
               ['Branded Bubble Mailer', 'Padded bubble mailer with exterior branding.', 0.48, 'bubble mailer'],
            ],
         },
      ],
   },

   /* ───────────────────────────── 5. PRINTING ───────────────────────────── */
   {
      slug: 'printing',
      name: 'Printing',
      short: 'Printing',
      tagline: 'First impressions, perfectly printed',
      description:
         'Business cards, letterheads, envelopes, flyers and brochures on premium stocks with fast turnaround.',
      accent: '#2D5BFF',
      imageQuery: 'business cards printing',
      categories: [
         {
            slug: 'business-cards',
            name: 'Business Cards',
            blurb: 'Standard, premium, foil and spot UV business cards.',
            kind: 'card',
            imageQuery: 'business cards',
            products: [
               ['Standard Business Cards', '350gsm cards with full-colour print on both sides.', 0.06, 'business card'],
               ['Premium Matte Business Cards', 'Thick matte stock with a soft, refined feel.', 0.09, 'matte business card'],
               ['Spot UV Business Cards', 'Raised gloss highlights on a matte base.', 0.14, 'spot uv business card'],
               ['Foil Business Cards', 'Gold, silver or rose-gold foil accents.', 0.22, 'gold foil business card'],
               ['Kraft Business Cards', 'Natural kraft stock for an earthy look.', 0.1, 'kraft business card'],
               ['Rounded Corner Business Cards', 'Soft rounded corners for a modern feel.', 0.08, 'rounded business cards'],
               ['Square Business Cards', 'Square format that stands out in a stack.', 0.09, 'square business card'],
            ],
         },
         {
            slug: 'letterheads',
            name: 'Letterheads',
            blurb: 'Branded letterheads for invoices, proposals and letters.',
            kind: 'stationery',
            imageQuery: 'letterhead stationery design',
            products: [
               ['Standard Letterhead', 'A4 letterhead on 100gsm uncoated paper.', 0.12, 'letterhead'],
               ['Premium Textured Letterhead', 'Laid or linen textured paper for a premium feel.', 0.2, 'textured paper stationery'],
               ['Two-Sided Letterhead', 'Print your brand pattern on the reverse too.', 0.16, 'corporate stationery'],
               ['Continuation Sheets', 'Matching second pages for longer documents.', 0.1, 'stationery paper desk'],
            ],
         },
         {
            slug: 'envelopes',
            name: 'Envelopes',
            blurb: 'DL, C5 and C4 envelopes printed with your brand.',
            kind: 'envelope',
            imageQuery: 'envelopes stationery',
            products: [
               ['DL Envelopes', 'Standard DL envelope for letters and invoices.', 0.18, 'white envelope'],
               ['C5 Envelopes', 'Fits A5 or folded A4 documents.', 0.22, 'envelopes'],
               ['C4 Document Envelopes', 'Large envelope for unfolded A4 documents.', 0.3, 'large envelope'],
               ['Window Envelopes', 'Address window for faster mailing.', 0.2, 'window envelope'],
               ['Kraft Envelopes', 'Natural kraft envelopes with logo print.', 0.24, 'kraft envelope'],
               ['Invitation Envelopes', 'Coloured and textured envelopes for invites.', 0.28, 'invitation envelope'],
            ],
         },
         {
            slug: 'flyers',
            name: 'Flyers',
            blurb: 'Single-sheet and folded flyers for every campaign.',
            kind: 'flyer',
            imageQuery: 'flyer printing',
            products: [
               ['Standard Flyers', 'A5 or A4 flyers on 150gsm gloss.', 0.08, 'flyer'],
               ['Premium Flyers', 'Heavier 300gsm stock with matte or gloss finish.', 0.12, 'printed flyers'],
               ['Folded Flyers', 'Half or tri-fold flyers for more content.', 0.15, 'folded leaflet'],
               ['Menu Flyers', 'Takeaway menus that live on the fridge.', 0.14, 'restaurant menu flyer'],
               ['Door Hangers', 'Die-cut door hangers for local marketing.', 0.16, 'door hanger'],
               ['Rack Cards', 'Slim cards for brochure racks and counters.', 0.11, 'rack card'],
            ],
         },
         {
            slug: 'brochures',
            name: 'Brochures',
            blurb: 'Bi-fold, tri-fold, booklets and catalogs.',
            kind: 'brochure',
            imageQuery: 'brochure design print',
            products: [
               ['Bi-Fold Brochure', 'Four clean panels to tell your story.', 0.32, 'bifold brochure'],
               ['Tri-Fold Brochure', 'Six panels — the classic marketing brochure.', 0.36, 'trifold brochure'],
               ['Booklet Brochure', 'Saddle-stitched booklet, 8 to 48 pages.', 1.2, 'booklet'],
               ['Catalog Printing', 'Perfect-bound product catalogs.', 2.4, 'product catalog magazine'],
               ['Presentation Folder', 'Pocket folder for proposals and press kits.', 1.1, 'presentation folder'],
            ],
         },
         {
            slug: 'office-stationery',
            name: 'Office Stationery',
            blurb: 'Notepads, notebooks, stamps and everyday office essentials.',
            kind: 'office',
            imageQuery: 'office stationery branding',
            products: [
               ['Branded Notepads', 'Tear-off notepads with your logo on every sheet.', 1.6, 'notepad'],
               ['Branded Notebooks', 'Hardcover notebooks with debossed or printed logo.', 3.8, 'notebook branding'],
               ['Compliment Slips', 'DL slips to accompany samples and deliveries.', 0.08, 'compliment slip'],
               ['Desk Calendars', 'Tent-style desk calendar printed with your brand.', 4.5, 'desk calendar'],
               ['ID Cards', 'PVC staff ID cards with photo and barcode.', 0.9, 'id card'],
               ['Self-Inking Stamps', 'Company stamps with custom logo and text.', 9, 'rubber stamp'],
               ['Certificates', 'Premium certificates on textured paper.', 0.4, 'certificate paper'],
            ],
         },
      ],
   },

   /* ───────────────────────────── 6. LABELS & STICKERS ───────────────────────────── */
   {
      slug: 'labels-stickers',
      name: 'Labels & Stickers',
      short: 'Labels',
      tagline: 'Stick your brand on everything',
      description:
         'Product labels, die-cut stickers, shipping and barcode labels — on rolls or sheets, in any shape.',
      accent: '#E89A0C',
      imageQuery: 'stickers labels',
      categories: [
         {
            slug: 'product-labels',
            name: 'Product Labels',
            blurb: 'Roll and sheet labels for bottles, jars and boxes.',
            kind: 'label',
            imageQuery: 'product labels bottles',
            products: [
               ['Roll Labels', 'Labels on rolls for hand or machine application.', 0.05, 'label roll'],
               ['Sheet Labels', 'Easy-peel labels on A4 sheets.', 0.07, 'sheet labels'],
               ['Bottle Labels', 'Water-resistant labels for bottles.', 0.08, 'bottle label'],
               ['Jar Labels', 'Round and wrap labels for jars and tins.', 0.07, 'jar label honey'],
               ['Cosmetic Labels', 'Premium labels for skincare and beauty.', 0.08, 'cosmetic bottle label'],
               ['Food Labels', 'Food-safe labels with ingredient panels.', 0.05, 'food label packaging'],
               ['Clear Labels', 'Transparent labels for a no-label look.', 0.09, 'clear label bottle'],
               ['Foil Labels', 'Metallic foil labels for luxury products.', 0.12, 'gold label'],
            ],
         },
         {
            slug: 'stickers',
            name: 'Stickers',
            blurb: 'Die-cut, vinyl, holographic and seal stickers.',
            kind: 'sticker',
            imageQuery: 'custom stickers',
            products: [
               ['Die-Cut Stickers', 'Cut to the exact shape of your design.', 0.12, 'die cut stickers'],
               ['Circle Stickers', 'Round stickers for seals and branding.', 0.06, 'round stickers'],
               ['Vinyl Stickers', 'Waterproof, scratch-resistant vinyl.', 0.14, 'vinyl stickers laptop'],
               ['Holographic Stickers', 'Rainbow holographic finish that catches the eye.', 0.18, 'holographic sticker'],
               ['Package Closure Seals', 'Round seals for mailers and bags.', 0.06, 'sticker seal package'],
               ['Sticker Sheets', 'Multiple designs on one kiss-cut sheet.', 0.9, 'sticker sheet'],
               ['Window Decals', 'Indoor or outdoor decals for glass.', 1.5, 'window sticker shop'],
            ],
         },
         {
            slug: 'shipping-labels',
            name: 'Shipping Labels',
            blurb: 'Branded shipping, fragile and return-address labels.',
            kind: 'label',
            imageQuery: 'shipping label package',
            products: [
               ['Custom Shipping Labels', 'Branded labels for cartons and mailers.', 0.08, 'shipping label box'],
               ['Thermal Shipping Labels', 'Direct-thermal labels for courier printers.', 0.04, 'thermal label printer'],
               ['Fragile Labels', 'High-visibility handle-with-care labels.', 0.05, 'fragile sticker box'],
               ['Return Address Labels', 'Small labels with your return address.', 0.05, 'address label envelope'],
            ],
         },
         {
            slug: 'barcode-qr-labels',
            name: 'Barcode / QR Labels',
            blurb: 'Barcode, QR, serial and asset labels.',
            kind: 'label',
            imageQuery: 'barcode label',
            products: [
               ['Barcode Labels', 'Scannable EAN, UPC and Code-128 labels.', 0.04, 'barcode'],
               ['QR Code Stickers', 'QR stickers for menus, packaging and promos.', 0.05, 'qr code sticker'],
               ['Asset Tags', 'Durable tags for equipment tracking.', 0.2, 'asset tag label'],
               ['Serial Number Labels', 'Sequentially numbered labels.', 0.06, 'serial number label'],
               ['Inventory Labels', 'Warehouse and shelf inventory labels.', 0.04, 'warehouse label shelf'],
            ],
         },
      ],
   },

   /* ───────────────────────────── 7. MARKETING ───────────────────────────── */
   {
      slug: 'marketing',
      name: 'Marketing',
      short: 'Marketing',
      tagline: 'Get noticed, get remembered',
      description:
         'Flyers, posters, banners, brochures and promo print for launches, events and everyday marketing.',
      accent: '#7A4CFF',
      imageQuery: 'marketing posters print',
      categories: [
         {
            slug: 'flyers',
            name: 'Flyers',
            blurb: 'Promote offers, events and menus.',
            kind: 'flyer',
            aliasOf: 'printing/flyers',
            imageQuery: 'flyers marketing',
            products: [],
         },
         {
            slug: 'posters',
            name: 'Posters',
            blurb: 'From A3 posters to large-format and canvas prints.',
            kind: 'poster',
            imageQuery: 'poster print wall',
            products: [
               ['Standard Posters', 'A3 to A1 posters on satin paper.', 1.8, 'poster'],
               ['Large Format Posters', 'Big, bold prints up to 1.5m wide.', 6.5, 'large poster'],
               ['Foam Board Posters', 'Rigid foam board prints for displays.', 14, 'foam board sign'],
               ['Canvas Prints', 'Gallery-wrapped canvas for offices and lobbies.', 22, 'canvas print wall'],
               ['Event Posters', 'Eye-catching posters for gigs and launches.', 1.6, 'event poster wall'],
            ],
         },
         {
            slug: 'banners',
            name: 'Banners',
            blurb: 'Vinyl, mesh and fabric banners plus flags.',
            kind: 'banner',
            imageQuery: 'vinyl banner outdoor',
            products: [
               ['Vinyl Banners', 'Weatherproof PVC banner with eyelets.', 18, 'vinyl banner'],
               ['Mesh Banners', 'Wind-permeable mesh for fences and scaffolding.', 24, 'mesh banner fence'],
               ['Fabric Banners', 'Crease-resistant fabric banner for indoor use.', 28, 'fabric banner'],
               ['Pole Banners', 'Double-sided banners for street poles.', 35, 'street pole banner'],
               ['Feather Flags', 'Tall feather flags for storefronts and events.', 45, 'feather flag'],
               ['Printed Table Covers', 'Fitted table covers for expos and stalls.', 55, 'trade show table'],
            ],
         },
         {
            slug: 'brochures',
            name: 'Brochures',
            blurb: 'Tell your full story in print.',
            kind: 'brochure',
            aliasOf: 'printing/brochures',
            imageQuery: 'brochure marketing',
            products: [],
         },
         {
            slug: 'promotional-materials',
            name: 'Promotional Materials',
            blurb: 'Postcards, vouchers, tent cards and menus.',
            kind: 'flyer',
            imageQuery: 'postcards printing',
            products: [
               ['Postcards', 'Thick postcards for mailers and handouts.', 0.1, 'postcards'],
               ['Greeting Cards', 'Folded cards with envelopes for any occasion.', 0.4, 'greeting card'],
               ['Gift Vouchers', 'Numbered vouchers with security features.', 0.12, 'gift voucher'],
               ['Loyalty Cards', 'Stamp cards that keep customers coming back.', 0.08, 'loyalty card coffee'],
               ['Table Tent Cards', 'Folded tent cards for tables and counters.', 0.35, 'table tent card restaurant'],
               ['Menu Cards', 'Laminated restaurant menus.', 0.6, 'restaurant menu'],
               ['Wall Calendars', 'Branded wall calendars for the whole year.', 3.2, 'wall calendar'],
            ],
         },
      ],
   },

   /* ───────────────────────────── 8. CORPORATE ───────────────────────────── */
   {
      slug: 'corporate',
      name: 'Corporate',
      short: 'Corporate',
      tagline: 'Branded from boardroom to front desk',
      description:
         'Stationery, promotional products, branded apparel and executive gifts for teams and clients.',
      accent: '#1E4D8C',
      imageQuery: 'corporate gift branded',
      categories: [
         {
            slug: 'stationery',
            name: 'Stationery',
            blurb: 'Notepads, notebooks, stamps and desk essentials.',
            kind: 'office',
            aliasOf: 'printing/office-stationery',
            imageQuery: 'corporate stationery set',
            products: [],
         },
         {
            slug: 'promotional-products',
            name: 'Promotional Products',
            blurb: 'Pens, mugs, bottles and giveaways with your logo.',
            kind: 'promo',
            imageQuery: 'promotional products',
            products: [
               ['Branded Pens', 'Smooth-writing pens printed or engraved.', 0.6, 'pens'],
               ['Custom Mugs', 'Ceramic mugs with wrap-around print.', 3.8, 'custom mug'],
               ['Water Bottles', 'Stainless steel bottles, laser engraved.', 5.5, 'water bottle'],
               ['Keychains', 'Metal, acrylic or leather keychains.', 1.2, 'keychain'],
               ['Lanyards', 'Printed lanyards for staff and events.', 1.1, 'lanyard'],
               ['Mouse Pads', 'Full-colour mouse pads for every desk.', 2.4, 'mouse pad desk'],
               ['Power Banks', 'Branded power banks — a giveaway people keep.', 9.5, 'power bank'],
               ['USB Drives', 'Custom-printed USB flash drives.', 4.8, 'usb flash drive'],
            ],
         },
         {
            slug: 'apparel',
            name: 'Apparel',
            blurb: 'T-shirts, polos, hoodies, caps and uniforms.',
            kind: 'apparel',
            imageQuery: 'custom t-shirt printing',
            products: [
               ['Custom T-Shirts', 'Soft cotton tees with screen or DTF print.', 6.5, 't-shirt'],
               ['Polo Shirts', 'Embroidered polos for staff uniforms.', 11, 'polo shirt'],
               ['Hoodies', 'Heavyweight hoodies with print or embroidery.', 18, 'hoodie'],
               ['Caps', 'Embroidered caps in a range of colours.', 5.2, 'baseball cap'],
               ['Aprons', 'Branded aprons for cafés, kitchens and salons.', 7.5, 'apron'],
               ['Uniform Jackets', 'Embroidered jackets for teams and crews.', 24, 'work jacket'],
            ],
         },
         {
            slug: 'corporate-gifts',
            name: 'Corporate Gifts',
            blurb: 'Executive sets, welcome kits and awards.',
            kind: 'gift',
            imageQuery: 'corporate gift box',
            products: [
               ['Executive Gift Sets', 'Pen, notebook and bottle in a branded box.', 28, 'executive gift set'],
               ['Branded Diaries', 'Dated or undated diaries with debossed logo.', 9, 'diary planner'],
               ['Leather Folders', 'Premium leather conference folders.', 16, 'leather folder'],
               ['Employee Welcome Kits', 'Curated onboarding kits for new hires.', 22, 'welcome kit box'],
               ['Desk Organisers', 'Wooden or leather desk organisers.', 12, 'desk organizer'],
               ['Awards & Trophies', 'Engraved crystal and acrylic awards.', 35, 'trophy award'],
            ],
         },
      ],
   },

   /* ───────────────────────────── 9. CUSTOM PACKAGING ───────────────────────────── */
   {
      slug: 'custom-packaging',
      name: 'Custom Packaging',
      short: 'Custom',
      tagline: 'If you can imagine it, we can make it',
      description:
         'Any size, any shape, any finish. Our packaging engineers build it around your product — from first sample to full production.',
      accent: '#FF5A52',
      imageQuery: 'custom packaging design',
      categories: [
         {
            slug: 'custom-boxes',
            name: 'Custom Boxes',
            blurb: 'Made-to-measure boxes in any style.',
            kind: 'box',
            imageQuery: 'custom printed boxes',
            products: [
               ['Custom Size Box', 'Built to your exact dimensions — no wasted space.', 1.6, 'custom box'],
               ['Custom Shape Box', 'Unique die-lines and structures.', 2.2, 'creative packaging'],
               ['Custom Printed Box', 'Edge-to-edge print inside and out.', 1.8, 'printed packaging box'],
               ['Custom Luxury Box', 'Rigid, foiled, embossed — the full luxury treatment.', 3.2, 'luxury packaging'],
               ['Custom Die-Cut Box', 'Windows, handles and cut-outs where you want them.', 1.9, 'die cut box'],
            ],
         },
         {
            slug: 'custom-bags',
            name: 'Custom Bags',
            blurb: 'Bags in your size, material and finish.',
            kind: 'bag',
            imageQuery: 'custom paper bags',
            products: [
               ['Custom Printed Bags', 'Full-colour bags in any material.', 0.8, 'printed shopping bag'],
               ['Custom Size Bags', 'Bags made to fit your product exactly.', 0.9, 'paper bags'],
               ['Custom Luxury Bags', 'Foil, emboss and rope handles.', 1.6, 'luxury paper bag'],
               ['Custom Fabric Bags', 'Cotton, canvas or jute with your design.', 3.5, 'fabric tote'],
            ],
         },
         {
            slug: 'custom-printing',
            name: 'Custom Printing',
            blurb: 'Special print jobs, design help and prototypes.',
            kind: 'service',
            imageQuery: 'printing press',
            products: [
               ['Custom Print Job', 'Something not in our catalog? We will print it.', 0.2, 'printing press'],
               ['Packaging Design Service', 'Our designers create print-ready artwork for you.', 149, 'graphic designer'],
               ['Prototype & Sample Box', 'A physical sample before you commit to production.', 25, 'box prototype'],
               ['Large Volume Printing', 'Offset pricing for 10,000+ units.', 0.1, 'offset printing'],
            ],
         },
         {
            slug: 'request-a-quote',
            name: 'Request a Quote',
            blurb: 'Tell us what you need — we reply within one business day.',
            kind: 'service',
            href: '/quote',
            imageQuery: 'packaging designer workspace',
            products: [],
         },
      ],
   },

   /* ───────────────────────────── 11. ACRYLIC & PLASTIC PACKAGING ───────────────────────────── */
   {
      slug: 'acrylic-plastic-packaging',
      name: 'Acrylic & Plastic Packaging',
      short: 'Acrylic & Plastic',
      tagline: 'Crystal clear. Seriously premium.',
      description:
         'Laser-cut acrylic boxes and clear PET, PVC and PP packaging that let your product shine.',
      accent: '#0E9FC4',
      imageQuery: 'clear acrylic box',
      categories: [
         {
            slug: 'acrylic-boxes',
            name: 'Acrylic Boxes',
            blurb: 'Clear and coloured acrylic boxes, laser-cut to your design.',
            kind: 'acrylic',
            imageQuery: 'clear acrylic box',
            products: [
               ['Clear Acrylic Boxes', 'Crystal-clear boxes with polished edges.', 6.5, 'clear acrylic box'],
               ['Custom Acrylic Boxes', 'Any size, thickness and colour of acrylic.', 8.5, 'acrylic box'],
               ['Acrylic Gift Boxes', 'Premium see-through gift packaging.', 7.5, 'acrylic gift box'],
               ['Acrylic Display Boxes', 'Display cases that protect and showcase.', 12, 'acrylic display case'],
               ['Acrylic Jewelry Boxes', 'Elegant boxes for rings, watches and jewellery.', 9, 'jewelry display acrylic'],
               ['Acrylic Cosmetic Boxes', 'Organisers and gift boxes for beauty products.', 8, 'acrylic makeup organizer'],
               ['Acrylic Product Boxes', 'Clear retail boxes for premium products.', 7, 'clear plastic product box'],
               ['Acrylic Cake Boxes', 'Show-stopping clear cake presentation boxes.', 14, 'cake in clear box'],
               ['Acrylic Sweet Boxes', 'Clear boxes for chocolates, dates and sweets.', 6, 'chocolate gift box clear'],
               ['Acrylic Hamper Boxes', 'Large clear boxes for gift hampers.', 18, 'gift hamper'],
               ['Acrylic Storage Boxes', 'Stackable clear storage with lids.', 10, 'acrylic storage'],
               ['Acrylic Window Boxes', 'Boxes with an acrylic viewing window.', 5.5, 'box with clear window'],
               ['Acrylic Boxes with Lids', 'Lift-off or hinged acrylic lids.', 7.5, 'acrylic box lid'],
               ['Magnetic Acrylic Boxes', 'Magnetic-close lids for a luxe feel.', 11, 'magnetic acrylic box'],
               ['Printed Acrylic Boxes', 'UV-printed logos and patterns on acrylic.', 9.5, 'printed acrylic'],
               ['Laser-Cut Acrylic Boxes', 'Precision laser-cut and engraved designs.', 10.5, 'laser cut acrylic'],
               ['Custom Shape Acrylic Boxes', 'Hearts, hexagons and bespoke shapes.', 13, 'acrylic heart box'],
            ],
         },
         {
            slug: 'plastic-packaging',
            name: 'Plastic Packaging',
            blurb: 'Clear PET, PVC and PP boxes and containers.',
            kind: 'plastic',
            imageQuery: 'clear plastic packaging box',
            products: [
               ['Clear Plastic Boxes', 'Transparent folding boxes with crisp creases.', 0.55, 'clear plastic box'],
               ['PET Boxes', 'Recyclable PET with excellent clarity.', 0.6, 'pet plastic box'],
               ['PVC Boxes', 'Rigid PVC boxes for retail display.', 0.5, 'pvc box packaging'],
               ['PP Boxes', 'Flexible, frosted polypropylene boxes.', 0.48, 'polypropylene box'],
               ['Plastic Product Containers', 'Tubs, jars and containers with lids.', 0.42, 'plastic containers'],
               ['Transparent Packaging Boxes', 'Show your product from every angle.', 0.58, 'transparent box packaging'],
               ['Plastic Display Boxes', 'Retail display boxes with hang tabs.', 0.7, 'plastic display box'],
               ['Plastic Gift Boxes', 'Clear gift boxes with ribbon or print.', 0.65, 'clear gift box'],
               ['Plastic Food Containers', 'Food-grade clamshells and deli tubs.', 0.32, 'plastic food container'],
               ['Plastic Cosmetic Containers', 'Jars and bottles for creams and lotions.', 0.45, 'cosmetic jar'],
            ],
         },
      ],
   },

   /* ───────────────────────────── 12. SIGNAGE & DISPLAYS ───────────────────────────── */
   {
      slug: 'signage-displays',
      name: 'Signage & Displays',
      short: 'Signage',
      tagline: 'Light up your brand',
      description:
         'Sign boards, 3D letters, neon, LED screens and exhibition displays — designed, fabricated and installed.',
      accent: '#FF2E88',
      dark: true,
      imageQuery: 'neon sign shop night',
      categories: [
         {
            slug: 'sign-boards',
            name: 'Sign Boards',
            blurb: 'Acrylic, ACP, metal and PVC boards for every space.',
            kind: 'sign',
            imageQuery: 'shop sign board',
            products: [
               ['Acrylic Sign Boards', 'Glossy acrylic boards with printed or cut graphics.', 120, 'acrylic sign'],
               ['ACP Sign Boards', 'Aluminium composite panels — tough and weatherproof.', 140, 'aluminum composite sign'],
               ['Aluminum Sign Boards', 'Lightweight, rust-free aluminium signs.', 110, 'aluminum sign'],
               ['Stainless Steel Sign Boards', 'Brushed or mirror steel for a premium finish.', 220, 'stainless steel sign'],
               ['PVC Sign Boards', 'Affordable foam PVC boards for indoor use.', 60, 'pvc sign board'],
               ['Flex Sign Boards', 'Printed flex on a frame — big impact, low cost.', 75, 'flex banner sign'],
               ['Vinyl Sign Boards', 'Vinyl graphics applied to rigid boards.', 70, 'vinyl sign'],
               ['3D Sign Boards', 'Raised elements for depth and shadow.', 260, '3d sign board'],
               ['Raised Letter Sign Boards', 'Board with stand-off raised lettering.', 240, 'raised letters sign'],
               ['Front-Lit Sign Boards', 'Lit from the front for night-time visibility.', 320, 'illuminated sign'],
               ['Back-Lit Sign Boards', 'Glowing light-box signs lit from behind.', 340, 'light box sign'],
               ['Shop Sign Boards', 'Storefront fascia signs that pull people in.', 280, 'shop sign'],
               ['Office Sign Boards', 'Clean, professional signs for offices.', 150, 'office sign'],
               ['Outdoor Sign Boards', 'Weather-rated signs for exterior walls.', 180, 'outdoor sign'],
               ['Indoor Sign Boards', 'Lightweight signs for interiors.', 90, 'indoor sign'],
               ['Directional Sign Boards', 'Guide visitors with clear arrows.', 65, 'directional sign'],
               ['Safety Sign Boards', 'Compliant hazard and PPE signs.', 25, 'safety sign'],
               ['Parking Sign Boards', 'Reflective parking and traffic signs.', 45, 'parking sign'],
            ],
         },
         {
            slug: '3d-raised-letter-signs',
            name: '3D & Raised Letter Signs',
            blurb: 'Dimensional letters and logos in acrylic and metal.',
            kind: 'letters',
            imageQuery: '3d letters sign',
            products: [
               ['3D Acrylic Letters', 'Thick acrylic letters in any colour.', 180, 'acrylic letters wall'],
               ['3D Metal Letters', 'Fabricated metal letters with depth.', 320, 'metal letters sign'],
               ['Stainless Steel Letters', 'Brushed, mirror or gold-finish steel letters.', 360, 'stainless steel letters'],
               ['Aluminum Letters', 'Lightweight aluminium letters, painted to match.', 260, 'aluminum letters'],
               ['PVC Letters', 'Budget-friendly foam PVC letters.', 120, 'foam letters wall'],
               ['Acrylic Letters', 'Flat-cut acrylic letters with stand-offs.', 150, 'acrylic logo wall'],
               ['Gold & Silver Letters', 'Mirror gold or silver letters for luxury spaces.', 380, 'gold letters sign'],
               ['Channel Letters', 'Illuminated channel letters for storefronts.', 450, 'channel letters'],
               ['Raised Logo Signs', 'Your logo in raised dimensional form.', 280, 'logo sign wall'],
               ['Reception Logos', 'Statement logo for your reception wall.', 300, 'reception logo'],
               ['Wall-Mounted Logos', 'Stand-off mounted logos for any wall.', 240, 'logo on wall office'],
               ['Building Logos', 'Large exterior logos for building facades.', { quote: 1200 }, 'building logo facade'],
               ['Corporate Logos', 'Brand-accurate logos for HQs and branches.', 340, 'corporate logo sign'],
            ],
         },
         {
            slug: 'neon-signs',
            name: 'Neon Signs',
            blurb: 'LED neon in any word, logo or shape.',
            kind: 'neon',
            imageQuery: 'neon sign',
            products: [
               ['LED Neon Signs', 'Energy-efficient LED neon in vivid colours.', 89, 'led neon sign'],
               ['Custom Neon Signs', 'Your words, your font, your colour.', 99, 'custom neon sign'],
               ['Neon Logo Signs', 'Your logo recreated in glowing neon.', 149, 'neon logo'],
               ['Neon Name Signs', 'Names in neon for homes, events and gifts.', 79, 'neon name sign'],
               ['Neon Quotes', 'Favourite quotes that glow.', 89, 'neon quote wall'],
               ['Neon Wall Signs', 'Statement wall art in neon.', 119, 'neon wall'],
               ['Neon Shop Signs', 'Open signs and storefront neon.', 129, 'open neon sign'],
               ['Neon Restaurant Signs', 'Atmosphere for cafés and restaurants.', 139, 'restaurant neon'],
               ['Neon Bar Signs', 'Bar and lounge neon that sets the mood.', 129, 'bar neon sign'],
               ['Neon Event Signs', 'Rentable neon for launches and parties.', 99, 'party neon'],
               ['Neon Wedding Signs', 'Better Together, Mr & Mrs and more.', 109, 'wedding neon sign'],
               ['Neon Bedroom Signs', 'Soft glow for bedrooms and studios.', 79, 'neon bedroom'],
               ['Neon Acrylic Signs', 'Neon mounted on clear or coloured acrylic.', 119, 'neon acrylic backboard'],
               ['Custom Shape Neon Signs', 'Hearts, wings, icons and illustrations.', 129, 'neon heart'],
            ],
         },
         {
            slug: 'digital-sign-boards',
            name: 'Digital Sign Boards',
            blurb: 'Programmable LED boards, menus and message displays.',
            kind: 'digital',
            imageQuery: 'digital signage screen',
            products: [
               ['LED Digital Sign Boards', 'Bright programmable boards for any message.', { quote: 650 }, 'led sign board'],
               ['Outdoor LED Displays', 'Sunlight-readable weatherproof displays.', { quote: 2400 }, 'outdoor led screen'],
               ['Indoor LED Displays', 'Crisp indoor displays for retail and lobbies.', { quote: 1400 }, 'indoor led screen'],
               ['Digital Advertising Boards', 'Rotate ads and promotions automatically.', { quote: 900 }, 'digital advertising display'],
               ['Digital Menu Boards', 'Update prices and specials in seconds.', { quote: 750 }, 'digital menu board'],
               ['Digital Billboard Displays', 'Large-format roadside and rooftop screens.', { quote: 9500 }, 'digital billboard'],
               ['Scrolling LED Displays', 'Scrolling text tickers for shopfronts.', { quote: 320 }, 'scrolling led sign'],
               ['Programmable LED Boards', 'Change content from your phone.', { quote: 480 }, 'programmable led display'],
               ['Video Display Boards', 'Full-motion video for maximum attention.', { quote: 1800 }, 'video display screen'],
               ['Electronic Message Boards', 'Info boards for schools, clinics and offices.', { quote: 560 }, 'electronic message board'],
               ['Retail Digital Displays', 'In-store screens that drive sales.', { quote: 980 }, 'retail digital display'],
               ['Restaurant Digital Displays', 'Menu and promo screens for QSRs.', { quote: 900 }, 'restaurant menu screen'],
            ],
         },
         {
            slug: 'led-displays',
            name: 'LED Displays',
            blurb: 'Video walls and LED screens for venues and events.',
            kind: 'led',
            imageQuery: 'led video wall',
            products: [
               ['LED Video Walls', 'Seamless modular walls of any size.', { quote: 6500 }, 'led video wall'],
               ['Indoor LED Walls', 'Fine detail for lobbies, malls and showrooms.', { quote: 5200 }, 'indoor video wall'],
               ['Outdoor LED Walls', 'High-brightness walls built for the elements.', { quote: 8800 }, 'outdoor led wall'],
               ['Fine-Pitch LED Displays', 'Ultra-sharp pixel pitch for close viewing.', { quote: 7400 }, 'control room video wall'],
               ['Commercial LED Displays', 'Reliable screens for daily commercial use.', { quote: 3600 }, 'commercial display screen'],
               ['Event LED Screens', 'Portable screens for conferences and events.', { quote: 2800 }, 'event led screen'],
               ['Stage LED Screens', 'Concert-grade screens for stages.', { quote: 9200 }, 'concert stage screen'],
               ['Rental LED Displays', 'Short-term LED hire with setup included.', { quote: 650 }, 'led screen rental event'],
            ],
         },
         {
            slug: 'advertising-displays',
            name: 'Advertising Displays',
            blurb: 'Roll-ups, pop-ups, backdrops and exhibition stands.',
            kind: 'display',
            imageQuery: 'roll up banner',
            products: [
               ['Roll-Up Banners', 'Retractable stand with printed banner and bag.', 65, 'roll up banner'],
               ['Pull-Up Banners', 'Premium wide-base pull-up stand.', 75, 'pull up banner'],
               ['X-Banners', 'Lightweight X-frame banner stand.', 45, 'x banner stand'],
               ['L-Banners', 'Budget L-frame stand for quick promos.', 50, 'banner stand'],
               ['Pop-Up Displays', 'Curved pop-up walls for trade shows.', 450, 'pop up display trade show'],
               ['Exhibition Stands', 'Complete branded stands, built and installed.', { quote: 2500 }, 'exhibition stand'],
               ['Backdrops', 'Printed backdrops for stages and press.', 220, 'backdrop banner'],
               ['Step & Repeat Walls', 'Logo walls for red carpets and photos.', 260, 'step and repeat'],
               ['Media Walls', 'Interview and press-conference walls.', 380, 'press wall'],
               ['Counter Displays', 'Branded promotion counters for sampling.', 180, 'promotion counter'],
               ['Promotional Stands', 'Brochure and product stands for events.', 150, 'brochure stand'],
            ],
         },
         {
            slug: 'retail-shop-branding',
            name: 'Retail & Shop Branding',
            blurb: 'Storefronts, window graphics and in-store signage.',
            kind: 'branding',
            imageQuery: 'storefront shop window',
            products: [
               ['Shop Front Signs', 'Fascia signs that define your storefront.', 280, 'shop front sign'],
               ['Storefront Branding', 'Complete storefront makeovers.', { quote: 900 }, 'storefront'],
               ['Window Graphics', 'Full-colour graphics for shop windows.', 35, 'window graphics shop'],
               ['Window Vinyl', 'Cut vinyl lettering for glass.', 28, 'window lettering'],
               ['Glass Frosting', 'Privacy frosted film with logo cut-outs.', 32, 'frosted glass office'],
               ['Wall Branding', 'Printed wall wraps and murals.', 30, 'wall mural office'],
               ['Reception Signs', 'Signs that greet every visitor.', 220, 'reception desk sign'],
               ['Counter Signs', 'Small signs for counters and tills.', 35, 'counter sign'],
               ['Shelf Signs', 'Shelf talkers and wobblers.', 3, 'shelf sign supermarket'],
               ['Hanging Signs', 'Ceiling-hung signs for aisles and zones.', 85, 'hanging sign store'],
               ['Wayfinding Signs', 'Navigation systems for malls and campuses.', 95, 'wayfinding sign'],
               ['In-Store Promotional Displays', 'Seasonal and campaign displays.', 120, 'store display promotion'],
            ],
         },
         {
            slug: 'office-corporate-signage',
            name: 'Office & Corporate Signage',
            blurb: 'Reception logos, room signs and wayfinding for offices.',
            kind: 'office-sign',
            imageQuery: 'office signage',
            products: [
               ['Office Reception Logos', 'Make your front desk unforgettable.', 300, 'office reception logo wall'],
               ['Office Reception Signs', 'Company name signs for reception areas.', 220, 'reception sign'],
               ['Company Name Boards', 'Name boards for entrances and lobbies.', 180, 'company sign'],
               ['Department Signs', 'Clear signs for teams and departments.', 45, 'department sign office'],
               ['Room Signs', 'Meeting room and office signs.', 30, 'meeting room sign'],
               ['Door Signs', 'Name plates and door signage.', 25, 'door sign'],
               ['Desk Signs', 'Name plates for desks and counters.', 18, 'desk name plate'],
               ['Office Directional Signs', 'Arrows and directories for corridors.', 40, 'office direction sign'],
               ['Floor Signs', 'Floor graphics and A-frame signs.', 35, 'floor sign'],
               ['Office Safety Signs', 'Compliance and PPE signage.', 20, 'safety signs workplace'],
               ['Emergency Signs', 'Exit, fire and assembly-point signs.', 22, 'emergency exit sign'],
               ['Corporate Branding', 'Full office branding — walls, glass and signs.', { quote: 1500 }, 'office interior branding'],
            ],
         },
         {
            slug: 'event-exhibition-signage',
            name: 'Event & Exhibition Signage',
            blurb: 'Backdrops, booths, welcome boards and wedding signage.',
            kind: 'event',
            imageQuery: 'exhibition booth',
            products: [
               ['Event Backdrops', 'Big, bold backdrops for any event.', 240, 'event backdrop'],
               ['Stage Backdrops', 'Stage-sized backdrops with frames.', 420, 'stage backdrop'],
               ['Exhibition Booths', 'Custom booths designed and built for you.', { quote: 3500 }, 'exhibition booth'],
               ['Exhibition Displays', 'Modular displays for trade shows.', 380, 'trade show display'],
               ['Photo Booth Backdrops', 'Instagrammable backdrops for guests.', 180, 'photo booth backdrop'],
               ['Wedding Signage', 'Seating charts, welcome and table signs.', 65, 'wedding sign'],
               ['Welcome Signs', 'Welcome boards for events and venues.', 55, 'welcome sign event'],
               ['Direction Signs', 'Event wayfinding and arrow signs.', 30, 'event direction sign'],
               ['Sponsor Boards', 'Showcase partners and sponsors.', 140, 'sponsor board'],
               ['Event Promotional Displays', 'Activation displays and sampling stands.', 160, 'event promotion display'],
            ],
         },
      ],
   },
]
