/**
 * Curated Pixabay search rules for catalog photography.
 *
 *   queries — literal searches Pixabay covers well (tried in order, results pooled)
 *   must    — a photo needs at least one of these words in its tags
 *   exclude — a photo with any of these tags is rejected
 *
 * Products first try their own query from data.ts, but only accept a photo that
 * passes their category's must/exclude rules; otherwise they take the next unused
 * photo from the category pool.
 */

/** Rejected everywhere: trademarks, off-brand subjects, unsafe content. */
export const GLOBAL_EXCLUDE = [
   'chanel', 'dior', 'gucci', 'prada', 'boss', 'hugo', 'apple', 'iphone', 'ipad', 'macbook', 'samsung', 'nike',
   'adidas', 'coca', 'cola', 'pepsi', 'starbucks', 'mcdonald', 'mcdonalds', 'kfc', 'amazon', 'ikea', 'lego',
   'disney', 'wordpress', 'hp', 'google', 'facebook', 'instagram', 'twitter', 'microsoft', 'ferrari', 'bmw',
   'cigarette', 'cigarettes', 'tobacco', 'smoking', 'bullet', 'bullets', 'ammunition', 'cartridge', 'weapon',
   'gun', 'pistol', 'rifle', 'drug', 'drugs', 'nude', 'sexy', 'lingerie', 'bikini', 'blood', 'skull', 'death',
   'war', 'mailbox', 'letterbox', 'kangaroo', 'marsupial', 'christmas', 'santa', 'halloween',
]

export const DEPARTMENTS = {
   packaging: { queries: ['cardboard boxes', 'packaging boxes', 'gift boxes'], must: ['box', 'carton', 'cardboard'] },
   'food-packaging': { queries: ['takeaway food', 'pizza box', 'takeaway coffee'], must: ['food', 'pizza', 'takeaway', 'coffee', 'burger'] },
   'retail-packaging': { queries: ['product packaging', 'gift boxes', 'cosmetic packaging'], must: ['box', 'packaging', 'package', 'gift'] },
   bags: { queries: ['shopping bags', 'paper bags'], must: ['bag'] },
   printing: { queries: ['business cards', 'stationery mockup', 'stationery'], must: ['card', 'stationery', 'paper'] },
   'labels-stickers': { queries: ['stickers', 'labels', 'label'], must: ['sticker', 'label'] },
   marketing: { queries: ['poster mockup', 'poster', 'advertising'], must: ['poster', 'advertising', 'banner', 'billboard', 'frame'] },
   corporate: { queries: ['office desk stationery', 'corporate gift', 'office desk'], must: ['office', 'desk', 'gift', 'stationery', 'notebook'] },
   'custom-packaging': { queries: ['packaging design', 'gift boxes', 'cardboard box'], must: ['box', 'packaging'] },
   'acrylic-plastic-packaging': { queries: ['acrylic box', 'clear plastic box', 'glass box', 'plexiglass'], must: ['acrylic', 'clear', 'glass', 'transparent', 'plastic', 'plexiglass'] },
   'signage-displays': { queries: ['neon sign', 'neon', 'neon light'], must: ['neon'] },
}

export const CATEGORIES = {
   'packaging/corrugated-boxes': { queries: ['cardboard boxes', 'cardboard box', 'moving boxes', 'shipping box', 'carton boxes'], must: ['box', 'cardboard', 'carton'] },
   'packaging/mailer-boxes': { queries: ['cardboard box package', 'parcel box', 'delivery box', 'box package', 'parcel'], must: ['box', 'parcel', 'package', 'cardboard'], exclude: ['post', 'letter'] },
   'packaging/rigid-boxes': { queries: ['gift box', 'luxury gift box', 'black gift box', 'jewelry box', 'present box'], must: ['box', 'gift', 'present'] },
   'packaging/folding-cartons': { queries: ['white box packaging', 'paper box', 'cosmetic packaging', 'product box', 'box mockup', 'carton box'], must: ['box', 'packaging', 'package', 'carton'], exclude: ['egg', 'eggs'] },
   'packaging/kraft-boxes': { queries: ['kraft box', 'brown paper box', 'kraft paper gift', 'brown gift box', 'kraft paper'], must: ['box', 'kraft', 'gift', 'package'] },
   'packaging/specialty-boxes': { queries: ['gift box', 'round box', 'decorative box', 'present box', 'gift boxes'], must: ['box', 'gift', 'present'] },

   'food-packaging/food-boxes': { queries: ['pizza box', 'takeaway food box', 'donut box', 'cake box', 'burger box', 'fries'], must: ['box', 'pizza', 'takeaway', 'donut', 'cake', 'burger', 'fries'] },
   'food-packaging/food-containers': { queries: ['takeaway food container', 'meal prep container', 'food container', 'lunch box', 'sushi box'], must: ['container', 'box', 'takeaway', 'lunch', 'meal', 'sushi'] },
   'food-packaging/food-bags': { queries: ['paper bag food', 'takeaway paper bag', 'bread paper bag', 'brown paper bag', 'coffee bag'], must: ['bag'] },
   'food-packaging/cups': { queries: ['coffee cup takeaway', 'paper cup', 'coffee to go', 'disposable cup', 'smoothie cup'], must: ['cup', 'coffee to go', 'takeaway'] },
   'food-packaging/food-accessories': { queries: ['takeaway coffee cups', 'napkins table setting', 'bottles carrier', 'cutlery napkin', 'coffee to go'], must: ['cup', 'napkin', 'bottle', 'coffee', 'cutlery'] },

   'retail-packaging/product-boxes': { queries: ['product packaging', 'cosmetic box', 'box packaging', 'gift box', 'candle box'], must: ['box', 'packaging', 'package'] },
   'retail-packaging/display-boxes': { queries: ['store shelf display', 'retail display', 'shop display', 'candy display', 'shop shelf'], must: ['display', 'shelf', 'store', 'shop', 'retail'] },
   'retail-packaging/inserts': { queries: ['thank you card', 'greeting card envelope', 'card mockup', 'note card', 'card paper'], must: ['card', 'note', 'paper'] },
   'retail-packaging/specialty-packaging': { queries: ['wrapping paper gift', 'tissue paper gift', 'gift tag', 'ribbon gift', 'gift wrapping'], must: ['paper', 'gift', 'tag', 'ribbon', 'wrapping'] },

   'bags/paper-bags': { queries: ['shopping bags', 'paper shopping bag', 'gift bag', 'paper bag', 'shopping bag'], must: ['bag'] },
   'bags/kraft-bags': { queries: ['brown paper bag', 'kraft paper bag', 'paper bags', 'brown bag'], must: ['bag'] },
   'bags/fabric-bags': { queries: ['tote bag', 'canvas bag', 'cotton bag', 'jute bag', 'fabric bag'], must: ['bag', 'tote'] },
   'bags/pouches': { queries: ['pouch packaging', 'coffee bag', 'zipper bag', 'padded envelope', 'pouch'], must: ['pouch', 'bag', 'envelope'] },

   'printing/business-cards': { queries: ['business card', 'business cards', 'visiting card', 'business card mockup'], must: ['card'] },
   'printing/letterheads': { queries: ['letterhead', 'stationery mockup', 'paper document desk', 'letter paper', 'document'], must: ['paper', 'letter', 'stationery', 'document'] },
   'printing/envelopes': { queries: ['envelope', 'envelopes', 'letter envelope', 'mail envelope'], must: ['envelope'] },
   'printing/flyers': { queries: ['flyer', 'flyer mockup', 'leaflet', 'brochure', 'poster mockup'], must: ['flyer', 'leaflet', 'brochure', 'paper', 'print', 'poster', 'mockup'] },
   'printing/brochures': { queries: ['brochure', 'magazine', 'catalog', 'booklet', 'magazine mockup'], must: ['brochure', 'magazine', 'catalog', 'booklet', 'book'] },
   'printing/office-stationery': { queries: ['stationery', 'notebook', 'office supplies', 'notepad pen', 'desk calendar'], must: ['notebook', 'stationery', 'office', 'paper', 'pen', 'notepad', 'desk', 'calendar', 'stamp'] },

   'labels-stickers/product-labels': { queries: ['label bottle', 'product label', 'jar label', 'labels', 'bottle mockup'], must: ['label', 'bottle', 'jar'] },
   'labels-stickers/stickers': { queries: ['stickers', 'sticker', 'laptop stickers', 'sticker sheet', 'vinyl sticker', 'sticker bomb'], must: ['sticker'] },
   'labels-stickers/shipping-labels': { queries: ['shipping label box', 'parcel label', 'package label', 'fragile box', 'parcel'], must: ['box', 'parcel', 'package', 'label'] },
   'labels-stickers/barcode-qr-labels': { queries: ['barcode', 'qr code', 'barcode label', 'barcode scan', 'qr code sticker'], must: ['barcode', 'qr', 'qr-code'] },

   'marketing/posters': { queries: ['poster mockup', 'poster', 'frame wall', 'poster wall'], must: ['poster', 'frame', 'print', 'wall'] },
   'marketing/banners': { queries: ['banner', 'flags', 'advertising banner', 'vinyl banner', 'feather flag', 'flag pole', 'banner mockup'], must: ['banner', 'flag', 'advertising'], exclude: ['ukraine', 'national', 'patriotic', 'union'] },
   'marketing/promotional-materials': { queries: ['postcard', 'greeting card', 'gift card', 'restaurant menu', 'loyalty card', 'postcards', 'calendar'], must: ['card', 'postcard', 'menu', 'voucher', 'calendar'] },

   'corporate/promotional-products': { queries: ['pen', 'coffee mug', 'water bottle', 'keychain', 'usb stick'], must: ['pen', 'mug', 'bottle', 'key', 'usb', 'mouse', 'lanyard', 'power'] },
   'corporate/apparel': { queries: ['t-shirt', 'clothing', 'polo shirt', 'cap hat', 't-shirt mockup'], must: ['shirt', 'clothing', 'cap', 'hat', 'hoodie', 'apron', 'jacket', 't-shirt', 'polo'] },
   'corporate/corporate-gifts': { queries: ['gift set', 'corporate gift', 'notebook pen', 'trophy', 'leather notebook'], must: ['gift', 'notebook', 'pen', 'trophy', 'award', 'diary', 'leather'] },

   'custom-packaging/custom-boxes': { queries: ['gift boxes', 'cardboard box', 'packaging design', 'box'], must: ['box'] },
   'custom-packaging/custom-bags': { queries: ['shopping bags', 'paper bags', 'gift bags', 'paper bag'], must: ['bag'], exclude: ['kermit', 'frog', 'toy'] },
   'custom-packaging/custom-printing': { queries: ['printing press', 'printer', 'print shop', 'offset printing'], must: ['print', 'printing', 'printer', 'press'] },
   'custom-packaging/request-a-quote': { queries: ['designer desk', 'graphic design', 'designer'], must: ['design', 'designer', 'desk'] },

   'acrylic-plastic-packaging/acrylic-boxes': { queries: ['acrylic box', 'clear box', 'plexiglass box', 'display case', 'glass display case', 'jewelry display', 'transparent box', 'acrylic stand', 'glass box'], must: ['acrylic', 'clear', 'glass', 'transparent', 'plexiglass', 'display', 'case', 'showcase'], exclude: ['paint', 'painting', 'art', 'artist', 'canvas', 'watercolor', 'brush', 'palette', 'abstract', 'texture', 'fluid', 'colorful'] },
   'acrylic-plastic-packaging/plastic-packaging': { queries: ['plastic container', 'plastic box', 'food container plastic', 'clear plastic box', 'blister packaging', 'plastic jar', 'plastic packaging'], must: ['plastic', 'container', 'clear', 'transparent', 'jar'], exclude: ['waste', 'trash', 'garbage', 'pollution', 'bin', 'recycling', 'sea', 'ocean', 'beach'] },

   'signage-displays/sign-boards': { queries: ['shop sign', 'store sign', 'signboard', 'hanging sign', 'street sign', 'open sign', 'sign board', 'business sign'], must: ['sign', 'signboard', 'signage'] },
   'signage-displays/3d-raised-letter-signs': { queries: ['letters wall', 'logo wall', 'metal letters', '3d letters', 'sign letters', 'channel letters', 'building sign', 'wooden letters'], must: ['letter', 'letters', 'logo', 'sign', 'signage', 'lettering'] },
   'signage-displays/neon-signs': { queries: ['neon sign', 'neon', 'neon light', 'neon lettering'], must: ['neon'] },
   'signage-displays/digital-sign-boards': { queries: ['digital signage', 'menu board', 'led sign', 'advertising screen', 'screen display', 'billboard night', 'digital billboard'], must: ['screen', 'display', 'led', 'digital', 'monitor', 'billboard', 'signage', 'menu'] },
   'signage-displays/led-displays': { queries: ['led screen', 'video wall', 'big screen', 'concert stage screen', 'led wall', 'stage screen', 'concert screen'], must: ['led', 'screen', 'video', 'display', 'stage'] },
   'signage-displays/advertising-displays': { queries: ['trade show booth', 'exhibition stand', 'trade fair', 'exhibition hall', 'banner stand', 'promotion stand', 'expo booth', 'roll up banner'], must: ['banner', 'exhibition', 'booth', 'stand', 'trade', 'display', 'fair', 'expo'] },
   'signage-displays/retail-shop-branding': { queries: ['storefront', 'shop window', 'shop front', 'store front sign', 'shop facade'], must: ['shop', 'store', 'storefront', 'window', 'sign', 'facade'] },
   'signage-displays/office-corporate-signage': { queries: ['office sign', 'door sign', 'reception desk', 'office lobby', 'office interior', 'name plate', 'company sign'], must: ['sign', 'office', 'door', 'reception', 'lobby', 'plate'] },
   'signage-displays/event-exhibition-signage': { queries: ['event backdrop', 'wedding sign', 'welcome sign', 'conference stage', 'event stage', 'photo booth', 'wedding decoration sign'], must: ['event', 'exhibition', 'wedding', 'sign', 'backdrop', 'stage', 'booth', 'conference'] },
}
