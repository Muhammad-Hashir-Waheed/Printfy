import type { PresetKind } from './data'

export type OptionChoice = {
   label: string
   hint?: string
   /** Multiplies the unit price */
   mult?: number
}

export type OptionGroup = {
   id: string
   label: string
   choices: OptionChoice[]
}

export type QuantityTier = { qty: number; factor: number }

export type Preset = {
   /** Unit label, e.g. "box", "card", "sign" */
   unit: string
   tiers: QuantityTier[]
   options: OptionGroup[]
   highlights: string[]
   specs: Array<[string, string]>
   leadTime: string
}

const t = (pairs: Array<[number, number]>): QuantityTier[] =>
   pairs.map(([qty, factor]) => ({ qty, factor }))

/* Quantity curves ------------------------------------------------------- */
const BULK = t([[100, 1], [250, 0.9], [500, 0.8], [1000, 0.7], [2500, 0.62], [5000, 0.55]])
const MID = t([[50, 1], [100, 0.92], [250, 0.84], [500, 0.76], [1000, 0.68]])
const PAPER = t([[100, 1], [250, 0.78], [500, 0.62], [1000, 0.5], [2500, 0.42], [5000, 0.36]])
const LABEL = t([[250, 1], [500, 0.8], [1000, 0.62], [2500, 0.5], [5000, 0.42], [10000, 0.36]])
const SMALL = t([[10, 1], [25, 0.92], [50, 0.85], [100, 0.78], [250, 0.7], [500, 0.64]])
const PIECE = t([[1, 1], [2, 0.96], [3, 0.93], [5, 0.9], [10, 0.85]])
const SQM = t([[1, 1], [5, 0.92], [10, 0.86], [25, 0.8], [50, 0.75]])

/* Shared option groups -------------------------------------------------- */
const boxSize: OptionGroup = {
   id: 'size',
   label: 'Size',
   choices: [
      { label: 'Small', hint: 'up to 15 × 10 × 5 cm' },
      { label: 'Medium', hint: 'up to 25 × 20 × 10 cm', mult: 1.25 },
      { label: 'Large', hint: 'up to 40 × 30 × 15 cm', mult: 1.6 },
      { label: 'Custom size', hint: 'made to your dimensions', mult: 1.8 },
   ],
}

const boxPrint: OptionGroup = {
   id: 'print',
   label: 'Printing',
   choices: [
      { label: 'Outside, full colour' },
      { label: 'Outside + inside', mult: 1.3 },
      { label: '1-colour logo', mult: 0.82 },
      { label: 'Unprinted', mult: 0.65 },
   ],
}

const coating: OptionGroup = {
   id: 'finish',
   label: 'Finish',
   choices: [
      { label: 'Matte' },
      { label: 'Gloss' },
      { label: 'Soft-touch', mult: 1.15 },
      { label: 'Foil accent', mult: 1.3 },
   ],
}

const paperFinish: OptionGroup = {
   id: 'finish',
   label: 'Finish',
   choices: [{ label: 'Matte' }, { label: 'Gloss' }, { label: 'Uncoated' }],
}

const signSize: OptionGroup = {
   id: 'size',
   label: 'Size',
   choices: [
      { label: '60 × 40 cm' },
      { label: '90 × 60 cm', mult: 1.7 },
      { label: '120 × 80 cm', mult: 2.6 },
      { label: '180 × 90 cm', mult: 3.8 },
      { label: 'Custom size', hint: 'we confirm the price', mult: 4.2 },
   ],
}

const mounting: OptionGroup = {
   id: 'mounting',
   label: 'Mounting',
   choices: [
      { label: 'Wall mounted' },
      { label: 'Stand-off fixings', mult: 1.08 },
      { label: 'Hanging kit', mult: 1.06 },
      { label: 'Free-standing', mult: 1.2 },
   ],
}

const install: OptionGroup = {
   id: 'install',
   label: 'Installation',
   choices: [
      { label: 'Delivery only' },
      { label: 'Delivery + installation', mult: 1.25 },
   ],
}

/* Presets --------------------------------------------------------------- */
export const PRESETS: Record<PresetKind, Preset> = {
   box: {
      unit: 'box',
      tiers: BULK,
      options: [
         boxSize,
         {
            id: 'material',
            label: 'Material',
            choices: [
               { label: 'White corrugated' },
               { label: 'Kraft corrugated', mult: 0.95 },
               { label: 'Double-wall', mult: 1.35 },
            ],
         },
         boxPrint,
         coating,
      ],
      highlights: ['Full-colour CMYK + Pantone matching', 'Free structural & artwork check', 'Recyclable materials'],
      specs: [['Board', 'E / B / BC flute'], ['Print', 'Digital or litho-lam'], ['Minimum order', '100 boxes']],
      leadTime: '7–10 business days',
   },
   rigid: {
      unit: 'box',
      tiers: MID,
      options: [
         boxSize,
         {
            id: 'wrap',
            label: 'Wrap paper',
            choices: [
               { label: 'Printed art paper' },
               { label: 'Textured paper', mult: 1.12 },
               { label: 'Soft-touch black', mult: 1.18 },
               { label: 'Leatherette', mult: 1.3 },
            ],
         },
         {
            id: 'decoration',
            label: 'Decoration',
            choices: [
               { label: 'None' },
               { label: 'Foil stamping', mult: 1.12 },
               { label: 'Emboss / deboss', mult: 1.1 },
               { label: 'Foil + emboss', mult: 1.22 },
            ],
         },
         {
            id: 'insert',
            label: 'Insert',
            choices: [
               { label: 'No insert' },
               { label: 'Card insert', mult: 1.08 },
               { label: 'Foam insert', mult: 1.15 },
               { label: 'Velvet / satin', mult: 1.25 },
            ],
         },
      ],
      highlights: ['1200–2000gsm chipboard', 'Hand-finished corners', 'Ribbon pulls & magnets available'],
      specs: [['Board', '1.5–2.5 mm greyboard'], ['Wrap', 'Art, textured or speciality paper'], ['Minimum order', '50 boxes']],
      leadTime: '12–15 business days',
   },
   carton: {
      unit: 'carton',
      tiers: BULK,
      options: [
         boxSize,
         {
            id: 'board',
            label: 'Board',
            choices: [
               { label: 'SBS white 350gsm' },
               { label: 'Kraft 350gsm', mult: 0.95 },
               { label: 'Premium 400gsm', mult: 1.12 },
               { label: 'Metallic board', mult: 1.35 },
            ],
         },
         coating,
         {
            id: 'window',
            label: 'Window',
            choices: [{ label: 'No window' }, { label: 'Clear PET window', mult: 1.12 }],
         },
      ],
      highlights: ['Food & cosmetic-safe inks', 'Spot UV and foil options', 'Ships flat to save space'],
      specs: [['Board', '300–400gsm SBS / kraft'], ['Print', 'Offset CMYK'], ['Minimum order', '100 cartons']],
      leadTime: '7–10 business days',
   },
   food: {
      unit: 'piece',
      tiers: BULK,
      options: [
         boxSize,
         {
            id: 'material',
            label: 'Material',
            choices: [
               { label: 'White food board' },
               { label: 'Kraft food board', mult: 0.95 },
               { label: 'Grease-resistant coated', mult: 1.1 },
            ],
         },
         {
            id: 'print',
            label: 'Printing',
            choices: [{ label: '1-colour logo' }, { label: '2-colour', mult: 1.12 }, { label: 'Full colour', mult: 1.25 }],
         },
      ],
      highlights: ['Food-safe, odour-free inks', 'Grease & moisture resistant', 'Compostable options'],
      specs: [['Material', 'FDA-grade food board'], ['Coating', 'Water-based barrier'], ['Minimum order', '100 pieces']],
      leadTime: '6–9 business days',
   },
   cup: {
      unit: 'cup',
      tiers: t([[500, 1], [1000, 0.85], [2500, 0.72], [5000, 0.62], [10000, 0.55]]),
      options: [
         {
            id: 'size',
            label: 'Size',
            choices: [{ label: '8 oz' }, { label: '12 oz', mult: 1.12 }, { label: '16 oz', mult: 1.25 }, { label: '20 oz', mult: 1.38 }],
         },
         {
            id: 'wall',
            label: 'Wall',
            choices: [{ label: 'Single wall' }, { label: 'Double wall', mult: 1.3 }, { label: 'Ripple wall', mult: 1.4 }],
         },
         {
            id: 'lids',
            label: 'Lids',
            choices: [{ label: 'No lids' }, { label: 'White lids', mult: 1.15 }, { label: 'Black lids', mult: 1.15 }],
         },
      ],
      highlights: ['Full-wrap 360° print', 'PE or aqueous lining', 'Matching lids & sleeves'],
      specs: [['Board', '230–300gsm cupstock'], ['Lining', 'PE / PLA / aqueous'], ['Minimum order', '500 cups']],
      leadTime: '10–14 business days',
   },
   accessory: {
      unit: 'piece',
      tiers: BULK,
      options: [
         {
            id: 'material',
            label: 'Material',
            choices: [{ label: 'Kraft' }, { label: 'White', mult: 1.05 }, { label: 'Recycled', mult: 0.95 }],
         },
         {
            id: 'print',
            label: 'Printing',
            choices: [{ label: '1-colour logo' }, { label: 'Full colour', mult: 1.25 }, { label: 'Unprinted', mult: 0.7 }],
         },
      ],
      highlights: ['Food-service ready', 'Matches your packaging range', 'Bulk pricing'],
      specs: [['Material', 'Paperboard / tissue'], ['Minimum order', '100 pieces']],
      leadTime: '6–9 business days',
   },
   'display-box': {
      unit: 'display',
      tiers: t([[25, 1], [50, 0.9], [100, 0.8], [250, 0.7], [500, 0.62]]),
      options: [
         {
            id: 'size',
            label: 'Size',
            choices: [{ label: 'Counter (small)' }, { label: 'Counter (large)', mult: 1.4 }, { label: 'Shelf tray', mult: 0.9 }],
         },
         boxPrint,
         coating,
      ],
      highlights: ['Ships flat, pops up in seconds', 'Tear-away or fixed header', 'Retail-ready'],
      specs: [['Board', 'E-flute or 400gsm SBS'], ['Minimum order', '25 displays']],
      leadTime: '8–12 business days',
   },
   insert: {
      unit: 'piece',
      tiers: PAPER,
      options: [
         {
            id: 'size',
            label: 'Size',
            choices: [{ label: 'A7 (74 × 105 mm)' }, { label: 'A6 (105 × 148 mm)', mult: 1.2 }, { label: 'A5 (148 × 210 mm)', mult: 1.5 }],
         },
         {
            id: 'paper',
            label: 'Paper',
            choices: [{ label: '350gsm silk' }, { label: '400gsm matte', mult: 1.12 }, { label: 'Kraft', mult: 1.08 }],
         },
         {
            id: 'sides',
            label: 'Sides',
            choices: [{ label: 'Single-sided' }, { label: 'Double-sided', mult: 1.2 }],
         },
      ],
      highlights: ['Fits any mailer or box', 'QR codes welcome', 'Same-day proofs'],
      specs: [['Paper', '350–400gsm'], ['Minimum order', '100 pieces']],
      leadTime: '4–6 business days',
   },
   wrap: {
      unit: 'sheet',
      tiers: PAPER,
      options: [
         {
            id: 'size',
            label: 'Size',
            choices: [{ label: '50 × 70 cm' }, { label: '70 × 100 cm', mult: 1.6 }, { label: 'Roll (10 m)', mult: 18 }],
         },
         {
            id: 'print',
            label: 'Printing',
            choices: [{ label: '1-colour repeat' }, { label: '2-colour repeat', mult: 1.15 }, { label: 'Full colour', mult: 1.35 }],
         },
      ],
      highlights: ['Acid-free and soft-touch', 'Logo repeat patterns', 'Perfect for unboxing'],
      specs: [['Paper', '17–80gsm tissue / wrap'], ['Minimum order', '100 sheets']],
      leadTime: '7–10 business days',
   },
   bag: {
      unit: 'bag',
      tiers: BULK,
      options: [
         {
            id: 'size',
            label: 'Size',
            choices: [
               { label: 'Small', hint: '18 × 8 × 22 cm' },
               { label: 'Medium', hint: '26 × 12 × 32 cm', mult: 1.25 },
               { label: 'Large', hint: '32 × 14 × 42 cm', mult: 1.55 },
            ],
         },
         {
            id: 'handle',
            label: 'Handle',
            choices: [
               { label: 'Twisted paper' },
               { label: 'Flat paper', mult: 0.92 },
               { label: 'Cotton rope', mult: 1.25 },
               { label: 'Satin ribbon', mult: 1.35 },
            ],
         },
         {
            id: 'print',
            label: 'Printing',
            choices: [{ label: '1-colour logo' }, { label: 'Full colour', mult: 1.3 }, { label: 'Full colour + foil', mult: 1.55 }],
         },
      ],
      highlights: ['Reinforced handles', 'Gusseted for volume', 'Recyclable paper'],
      specs: [['Paper', '120–250gsm'], ['Minimum order', '100 bags']],
      leadTime: '10–14 business days',
   },
   'fabric-bag': {
      unit: 'bag',
      tiers: MID,
      options: [
         {
            id: 'size',
            label: 'Size',
            choices: [{ label: 'Standard 38 × 42 cm' }, { label: 'Large 45 × 50 cm', mult: 1.2 }, { label: 'With gusset', mult: 1.3 }],
         },
         {
            id: 'print',
            label: 'Decoration',
            choices: [{ label: '1-colour screen print' }, { label: 'Full colour DTF', mult: 1.25 }, { label: 'Embroidery', mult: 1.45 }],
         },
      ],
      highlights: ['Reusable & durable', 'Natural or dyed fabrics', 'Great event giveaway'],
      specs: [['Fabric', 'Cotton / canvas / jute / non-woven'], ['Minimum order', '50 bags']],
      leadTime: '10–14 business days',
   },
   pouch: {
      unit: 'pouch',
      tiers: BULK,
      options: [
         {
            id: 'size',
            label: 'Size',
            choices: [{ label: 'Small (100 g)' }, { label: 'Medium (250 g)', mult: 1.25 }, { label: 'Large (1 kg)', mult: 1.7 }],
         },
         {
            id: 'material',
            label: 'Material',
            choices: [{ label: 'Matte film' }, { label: 'Kraft + liner', mult: 1.08 }, { label: 'Recyclable mono-PE', mult: 1.15 }],
         },
         {
            id: 'closure',
            label: 'Closure',
            choices: [{ label: 'Zip lock' }, { label: 'Heat seal only', mult: 0.9 }, { label: 'Zip + valve', mult: 1.12 }],
         },
      ],
      highlights: ['Moisture & aroma barrier', 'Tear notch included', 'Digital print, no plates'],
      specs: [['Film', 'PET / PE / kraft laminates'], ['Minimum order', '100 pouches']],
      leadTime: '10–12 business days',
   },
   card: {
      unit: 'card',
      tiers: PAPER,
      options: [
         {
            id: 'paper',
            label: 'Paper',
            choices: [
               { label: '350gsm silk' },
               { label: '400gsm matte', mult: 1.15 },
               { label: '600gsm luxe', mult: 1.6 },
               { label: 'Recycled kraft', mult: 1.1 },
            ],
         },
         {
            id: 'sides',
            label: 'Print sides',
            choices: [{ label: 'Front only' }, { label: 'Front + back', mult: 1.2 }],
         },
         {
            id: 'finish',
            label: 'Finish',
            choices: [
               { label: 'Matte' },
               { label: 'Gloss' },
               { label: 'Soft-touch', mult: 1.2 },
               { label: 'Spot UV', mult: 1.35 },
            ],
         },
         {
            id: 'corners',
            label: 'Corners',
            choices: [{ label: 'Square' }, { label: 'Rounded', mult: 1.08 }],
         },
      ],
      highlights: ['Pantone-accurate colour', 'Free design check', 'Delivered in 3–5 days'],
      specs: [['Size', '85 × 55 mm (standard)'], ['Paper', '350–600gsm'], ['Minimum order', '100 cards']],
      leadTime: '3–5 business days',
   },
   stationery: {
      unit: 'sheet',
      tiers: PAPER,
      options: [
         {
            id: 'paper',
            label: 'Paper',
            choices: [{ label: '100gsm uncoated' }, { label: '120gsm premium', mult: 1.2 }, { label: 'Textured / laid', mult: 1.45 }],
         },
         {
            id: 'sides',
            label: 'Print sides',
            choices: [{ label: 'Front only' }, { label: 'Front + back', mult: 1.25 }],
         },
      ],
      highlights: ['Laser & inkjet printer safe', 'Matches your business cards', 'A4 or Letter size'],
      specs: [['Size', 'A4 / US Letter'], ['Minimum order', '100 sheets']],
      leadTime: '3–5 business days',
   },
   envelope: {
      unit: 'envelope',
      tiers: PAPER,
      options: [
         {
            id: 'paper',
            label: 'Paper',
            choices: [{ label: '100gsm white' }, { label: '120gsm premium', mult: 1.15 }, { label: 'Kraft', mult: 1.1 }],
         },
         {
            id: 'closure',
            label: 'Closure',
            choices: [{ label: 'Peel & seal' }, { label: 'Gummed', mult: 0.95 }],
         },
         {
            id: 'print',
            label: 'Printing',
            choices: [{ label: 'Front logo' }, { label: 'Front + flap', mult: 1.15 }, { label: 'Full colour inside', mult: 1.45 }],
         },
      ],
      highlights: ['Postage-ready sizes', 'Window options', 'Matching stationery'],
      specs: [['Sizes', 'DL, C5, C4'], ['Minimum order', '100 envelopes']],
      leadTime: '4–6 business days',
   },
   flyer: {
      unit: 'piece',
      tiers: PAPER,
      options: [
         {
            id: 'size',
            label: 'Size',
            choices: [{ label: 'A6' }, { label: 'A5', mult: 1.35 }, { label: 'A4', mult: 1.9 }, { label: 'DL', mult: 1.2 }],
         },
         {
            id: 'paper',
            label: 'Paper',
            choices: [{ label: '150gsm gloss' }, { label: '250gsm silk', mult: 1.2 }, { label: '350gsm matte', mult: 1.4 }],
         },
         {
            id: 'sides',
            label: 'Print sides',
            choices: [{ label: 'Single-sided' }, { label: 'Double-sided', mult: 1.18 }],
         },
      ],
      highlights: ['Vivid full-colour print', 'Fast 2–4 day turnaround', 'Volume discounts'],
      specs: [['Paper', '150–350gsm'], ['Minimum order', '100 pieces']],
      leadTime: '2–4 business days',
   },
   brochure: {
      unit: 'brochure',
      tiers: PAPER,
      options: [
         {
            id: 'size',
            label: 'Finished size',
            choices: [{ label: 'A5' }, { label: 'A4', mult: 1.45 }, { label: 'DL', mult: 0.9 }],
         },
         {
            id: 'paper',
            label: 'Paper',
            choices: [{ label: '170gsm silk' }, { label: '250gsm silk', mult: 1.2 }, { label: 'Uncoated 150gsm', mult: 1.05 }],
         },
         {
            id: 'pages',
            label: 'Pages',
            choices: [
               { label: 'Standard' },
               { label: '+ 8 pages', mult: 1.6 },
               { label: '+ 16 pages', mult: 2.4 },
            ],
         },
      ],
      highlights: ['Precision folding & binding', 'Soft-touch covers available', 'Free proof'],
      specs: [['Binding', 'Fold / saddle stitch / perfect bound'], ['Minimum order', '100 pieces']],
      leadTime: '4–7 business days',
   },
   office: {
      unit: 'piece',
      tiers: SMALL,
      options: [
         {
            id: 'finish',
            label: 'Branding',
            choices: [{ label: 'Printed logo' }, { label: 'Debossed', mult: 1.2 }, { label: 'Foil', mult: 1.3 }],
         },
         {
            id: 'colour',
            label: 'Colour',
            choices: [{ label: 'Brand colour' }, { label: 'Black' }, { label: 'White' }, { label: 'Kraft / natural' }],
         },
      ],
      highlights: ['Matches your brand kit', 'Great for teams & clients', 'Small minimums'],
      specs: [['Minimum order', '10 pieces']],
      leadTime: '5–8 business days',
   },
   label: {
      unit: 'label',
      tiers: LABEL,
      options: [
         {
            id: 'size',
            label: 'Size',
            choices: [{ label: '25 × 25 mm' }, { label: '50 × 50 mm', mult: 1.35 }, { label: '75 × 50 mm', mult: 1.6 }, { label: '100 × 150 mm', mult: 2.4 }],
         },
         {
            id: 'material',
            label: 'Material',
            choices: [
               { label: 'White paper' },
               { label: 'White BOPP (waterproof)', mult: 1.25 },
               { label: 'Clear BOPP', mult: 1.35 },
               { label: 'Kraft paper', mult: 1.15 },
               { label: 'Metallic', mult: 1.6 },
            ],
         },
         {
            id: 'format',
            label: 'Supplied on',
            choices: [{ label: 'Rolls' }, { label: 'Sheets', mult: 1.1 }],
         },
      ],
      highlights: ['Any shape, any size', 'Permanent or removable adhesive', 'Machine-ready rolls'],
      specs: [['Adhesive', 'Permanent / removable / freezer'], ['Minimum order', '250 labels']],
      leadTime: '4–6 business days',
   },
   sticker: {
      unit: 'sticker',
      tiers: LABEL,
      options: [
         {
            id: 'size',
            label: 'Size',
            choices: [{ label: '5 cm' }, { label: '7.5 cm', mult: 1.4 }, { label: '10 cm', mult: 1.9 }],
         },
         {
            id: 'material',
            label: 'Material',
            choices: [
               { label: 'Gloss vinyl' },
               { label: 'Matte vinyl' },
               { label: 'Holographic', mult: 1.5 },
               { label: 'Clear vinyl', mult: 1.2 },
            ],
         },
      ],
      highlights: ['Waterproof & UV-resistant', 'Cut to any shape', 'Dishwasher-safe vinyl'],
      specs: [['Material', 'Vinyl / paper / holographic'], ['Minimum order', '250 stickers']],
      leadTime: '4–6 business days',
   },
   poster: {
      unit: 'print',
      tiers: SMALL,
      options: [
         {
            id: 'size',
            label: 'Size',
            choices: [{ label: 'A3' }, { label: 'A2', mult: 1.6 }, { label: 'A1', mult: 2.4 }, { label: 'A0', mult: 3.6 }],
         },
         {
            id: 'paper',
            label: 'Material',
            choices: [{ label: '170gsm satin' }, { label: '200gsm photo', mult: 1.25 }, { label: 'Backlit film', mult: 1.6 }],
         },
      ],
      highlights: ['Gallery-quality inks', 'Rich, saturated colour', 'Ships rolled in tubes'],
      specs: [['Resolution', 'Up to 1440 dpi'], ['Minimum order', '10 prints']],
      leadTime: '3–5 business days',
   },
   banner: {
      unit: 'banner',
      tiers: PIECE,
      options: [
         {
            id: 'size',
            label: 'Size',
            choices: [{ label: '1 × 0.5 m' }, { label: '2 × 1 m', mult: 2.6 }, { label: '3 × 1 m', mult: 3.6 }, { label: '5 × 1 m', mult: 5.6 }],
         },
         {
            id: 'finishing',
            label: 'Finishing',
            choices: [{ label: 'Hemmed + eyelets' }, { label: 'Pole pockets', mult: 1.08 }, { label: 'Rope + eyelets', mult: 1.12 }],
         },
      ],
      highlights: ['Weather & UV resistant', 'Double-sided options', 'Free hanging kit'],
      specs: [['Material', '440–510gsm PVC / mesh / fabric'], ['Minimum order', '1 banner']],
      leadTime: '3–5 business days',
   },
   promo: {
      unit: 'item',
      tiers: t([[50, 1], [100, 0.9], [250, 0.8], [500, 0.72], [1000, 0.65]]),
      options: [
         {
            id: 'branding',
            label: 'Branding',
            choices: [{ label: '1-colour print' }, { label: 'Full colour', mult: 1.25 }, { label: 'Laser engraving', mult: 1.3 }],
         },
         {
            id: 'colour',
            label: 'Item colour',
            choices: [{ label: 'White' }, { label: 'Black' }, { label: 'Navy' }, { label: 'Brand colour', mult: 1.1 }],
         },
      ],
      highlights: ['Logo-accurate branding', 'Gift packaging available', 'Bulk discounts'],
      specs: [['Minimum order', '50 items']],
      leadTime: '8–12 business days',
   },
   apparel: {
      unit: 'item',
      tiers: t([[10, 1], [25, 0.9], [50, 0.82], [100, 0.75], [250, 0.68]]),
      options: [
         {
            id: 'colour',
            label: 'Garment colour',
            choices: [{ label: 'White' }, { label: 'Black' }, { label: 'Navy' }, { label: 'Heather grey' }, { label: 'Red' }],
         },
         {
            id: 'decoration',
            label: 'Decoration',
            choices: [{ label: 'Front print' }, { label: 'Front + back', mult: 1.35 }, { label: 'Embroidery', mult: 1.4 }],
         },
         {
            id: 'sizes',
            label: 'Sizes',
            choices: [{ label: 'Mixed S–XL' }, { label: 'Mixed S–3XL', mult: 1.06 }],
         },
      ],
      highlights: ['Soft, durable fabrics', 'Wash-tested prints', 'Mix sizes in one order'],
      specs: [['Fabric', '180–320gsm cotton / poly blends'], ['Minimum order', '10 items']],
      leadTime: '7–10 business days',
   },
   gift: {
      unit: 'set',
      tiers: t([[10, 1], [25, 0.94], [50, 0.88], [100, 0.82], [250, 0.76]]),
      options: [
         {
            id: 'branding',
            label: 'Branding',
            choices: [{ label: 'Printed logo' }, { label: 'Debossed', mult: 1.12 }, { label: 'Foil', mult: 1.18 }],
         },
         {
            id: 'packaging',
            label: 'Gift packaging',
            choices: [{ label: 'Standard box' }, { label: 'Rigid gift box', mult: 1.2 }, { label: 'Personalised name', mult: 1.3 }],
         },
      ],
      highlights: ['Curated, premium items', 'Personalisation available', 'Delivered gift-ready'],
      specs: [['Minimum order', '10 sets']],
      leadTime: '10–14 business days',
   },
   service: {
      unit: 'job',
      tiers: t([[1, 1], [2, 0.95], [5, 0.9]]),
      options: [
         {
            id: 'speed',
            label: 'Turnaround',
            choices: [{ label: 'Standard' }, { label: 'Express', mult: 1.35 }],
         },
      ],
      highlights: ['Dedicated project manager', 'Unlimited proof revisions', 'Production-ready files'],
      specs: [['Revisions', 'Unlimited until approval']],
      leadTime: '3–7 business days',
   },
   acrylic: {
      unit: 'box',
      tiers: SMALL,
      options: [
         {
            id: 'size',
            label: 'Size',
            choices: [
               { label: '10 × 10 × 10 cm' },
               { label: '20 × 15 × 10 cm', mult: 1.6 },
               { label: '30 × 20 × 15 cm', mult: 2.4 },
               { label: 'Custom size', mult: 2.8 },
            ],
         },
         {
            id: 'thickness',
            label: 'Thickness',
            choices: [{ label: '2 mm' }, { label: '3 mm', mult: 1.2 }, { label: '5 mm', mult: 1.55 }],
         },
         {
            id: 'colour',
            label: 'Acrylic',
            choices: [
               { label: 'Crystal clear' },
               { label: 'Frosted', mult: 1.1 },
               { label: 'Coloured', mult: 1.15 },
               { label: 'Mirror gold / silver', mult: 1.45 },
            ],
         },
         {
            id: 'branding',
            label: 'Branding',
            choices: [{ label: 'None' }, { label: 'UV-printed logo', mult: 1.15 }, { label: 'Laser engraving', mult: 1.12 }],
         },
      ],
      highlights: ['Flame-polished crystal edges', 'Laser-cut precision', 'Protective film on delivery'],
      specs: [['Material', 'Cast acrylic (PMMA)'], ['Thickness', '2–5 mm'], ['Minimum order', '10 boxes']],
      leadTime: '7–10 business days',
   },
   plastic: {
      unit: 'box',
      tiers: BULK,
      options: [
         {
            id: 'size',
            label: 'Size',
            choices: [{ label: 'Small' }, { label: 'Medium', mult: 1.3 }, { label: 'Large', mult: 1.7 }, { label: 'Custom size', mult: 1.9 }],
         },
         {
            id: 'material',
            label: 'Material',
            choices: [{ label: 'PET (recyclable)' }, { label: 'PVC', mult: 0.92 }, { label: 'PP frosted', mult: 0.95 }],
         },
         {
            id: 'print',
            label: 'Printing',
            choices: [{ label: 'Unprinted' }, { label: '1-colour', mult: 1.15 }, { label: 'Full colour', mult: 1.35 }],
         },
      ],
      highlights: ['Crystal-clear visibility', 'Scratch-resistant film', 'Food-grade options'],
      specs: [['Material', '0.25–0.5 mm PET / PVC / PP'], ['Minimum order', '100 boxes']],
      leadTime: '8–12 business days',
   },
   sign: {
      unit: 'sign',
      tiers: PIECE,
      options: [signSize, mounting, install],
      highlights: ['Indoor & outdoor grades', 'Weatherproof UV inks', 'Free layout mock-up'],
      specs: [['Materials', 'Acrylic / ACP / metal / PVC'], ['Warranty', 'Up to 5 years outdoor']],
      leadTime: '5–10 business days',
   },
   letters: {
      unit: 'sign',
      tiers: PIECE,
      options: [
         {
            id: 'height',
            label: 'Letter height',
            choices: [{ label: '15 cm' }, { label: '30 cm', mult: 1.8 }, { label: '45 cm', mult: 2.6 }, { label: '60 cm', mult: 3.5 }],
         },
         {
            id: 'lighting',
            label: 'Lighting',
            choices: [{ label: 'Non-lit' }, { label: 'Front-lit LED', mult: 1.5 }, { label: 'Halo back-lit', mult: 1.6 }],
         },
         install,
      ],
      highlights: ['Up to 10 characters included', 'Exact brand colours', 'Mounting template supplied'],
      specs: [['Depth', '10–100 mm returns'], ['Warranty', '3 years on LEDs']],
      leadTime: '10–14 business days',
   },
   neon: {
      unit: 'sign',
      tiers: PIECE,
      options: [
         {
            id: 'size',
            label: 'Size',
            choices: [
               { label: 'S — 50 cm wide' },
               { label: 'M — 75 cm wide', mult: 1.5 },
               { label: 'L — 100 cm wide', mult: 2.1 },
               { label: 'XL — 150 cm wide', mult: 3 },
            ],
         },
         {
            id: 'colour',
            label: 'Neon colour',
            choices: [
               { label: 'Hot pink' },
               { label: 'Ice blue' },
               { label: 'Warm white' },
               { label: 'Purple' },
               { label: 'RGB colour-changing', mult: 1.3 },
            ],
         },
         {
            id: 'backboard',
            label: 'Backboard',
            choices: [
               { label: 'Cut to shape' },
               { label: 'Rectangle clear' },
               { label: 'Black acrylic', mult: 1.1 },
               { label: 'Free-standing', mult: 1.2 },
            ],
         },
      ],
      highlights: ['Safe low-voltage LED neon', 'Dimmer & remote included', '50,000-hour lifespan'],
      specs: [['Power', '12V adapter, plug-and-play'], ['Warranty', '2 years']],
      leadTime: '7–10 business days',
   },
   digital: {
      unit: 'display',
      tiers: PIECE,
      options: [],
      highlights: ['Free site survey', 'Content management software', 'Installation & training'],
      specs: [['Brightness', '1,500–6,500 nits'], ['Control', 'Wi-Fi / 4G / USB']],
      leadTime: '2–4 weeks',
   },
   led: {
      unit: 'display',
      tiers: PIECE,
      options: [],
      highlights: ['Modular, seamless panels', 'Pixel pitch from 1.2 mm', 'Engineering & install included'],
      specs: [['Pixel pitch', 'P1.2 – P10'], ['Service', 'On-site support available']],
      leadTime: '3–6 weeks',
   },
   display: {
      unit: 'unit',
      tiers: PIECE,
      options: [
         {
            id: 'size',
            label: 'Size',
            choices: [{ label: 'Standard (85 × 200 cm)' }, { label: 'Wide (120 × 200 cm)', mult: 1.3 }, { label: 'Extra wide (150 × 220 cm)', mult: 1.6 }],
         },
         {
            id: 'print',
            label: 'Graphic',
            choices: [{ label: 'Anti-curl PVC' }, { label: 'Fabric', mult: 1.15 }, { label: 'Double-sided', mult: 1.5 }],
         },
      ],
      highlights: ['Sets up in under 2 minutes', 'Carry bag included', 'Replaceable graphics'],
      specs: [['Hardware', 'Aluminium stand'], ['Minimum order', '1 unit']],
      leadTime: '3–5 business days',
   },
   branding: {
      unit: 'm²',
      tiers: SQM,
      options: [
         {
            id: 'material',
            label: 'Material',
            choices: [{ label: 'Printed vinyl' }, { label: 'Cut vinyl', mult: 1.1 }, { label: 'One-way vision', mult: 1.2 }, { label: 'Frosted film', mult: 1.15 }],
         },
         install,
      ],
      highlights: ['Measured & installed by pros', 'Bubble-free application', 'Removable without residue'],
      specs: [['Material', 'Cast / calendered vinyl'], ['Pricing', 'Per square metre']],
      leadTime: '5–8 business days',
   },
   'office-sign': {
      unit: 'sign',
      tiers: PIECE,
      options: [
         {
            id: 'material',
            label: 'Material',
            choices: [{ label: 'Acrylic' }, { label: 'Brushed aluminium', mult: 1.2 }, { label: 'Wood', mult: 1.25 }, { label: 'Stainless steel', mult: 1.5 }],
         },
         {
            id: 'size',
            label: 'Size',
            choices: [{ label: 'Small' }, { label: 'Medium', mult: 1.6 }, { label: 'Large', mult: 2.4 }],
         },
         install,
      ],
      highlights: ['Consistent brand look', 'ADA / braille options', 'Stand-off or adhesive fixing'],
      specs: [['Fixing', 'Stand-offs / VHB tape'], ['Minimum order', '1 sign']],
      leadTime: '5–8 business days',
   },
   event: {
      unit: 'piece',
      tiers: PIECE,
      options: [
         {
            id: 'size',
            label: 'Size',
            choices: [{ label: '2 × 2 m' }, { label: '3 × 2.5 m', mult: 1.6 }, { label: '4 × 3 m', mult: 2.3 }, { label: 'A1 board', mult: 0.3 }],
         },
         {
            id: 'material',
            label: 'Material',
            choices: [{ label: 'Fabric (tension)' }, { label: 'Vinyl', mult: 0.9 }, { label: 'Foam board', mult: 0.85 }],
         },
         install,
      ],
      highlights: ['Wrinkle-free fabrics', 'Reusable frames', 'Set-up service available'],
      specs: [['Frames', 'Aluminium tube / pop-up'], ['Minimum order', '1 piece']],
      leadTime: '4–7 business days',
   },
}
