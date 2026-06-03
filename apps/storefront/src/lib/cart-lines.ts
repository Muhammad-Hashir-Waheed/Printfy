import type { SelectedVariant } from '@/lib/catalog'

export type CartLineItem = {
   lineKey: string
   productId: string
   product: unknown
   count: number
   selectedVariants?: SelectedVariant[]
}

export function buildLineKey(
   productId: string,
   selectedVariants?: SelectedVariant[]
) {
   if (!selectedVariants?.length) return productId
   const signature = [...selectedVariants]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((v) => `${v.name}:${v.value}`)
      .join('|')
   return `${productId}::${signature}`
}

export function findCartLineIndex(
   items: CartLineItem[] | undefined,
   lineKey: string
) {
   if (!items?.length) return -1
   return items.findIndex((item) => item.lineKey === lineKey)
}

export function getLineCount(
   items: CartLineItem[] | undefined,
   lineKey: string
) {
   const index = findCartLineIndex(items, lineKey)
   return index >= 0 ? items![index].count : 0
}

export function upsertCartLine({
   items,
   productId,
   product,
   selectedVariants,
   delta,
}: {
   items: CartLineItem[]
   productId: string
   product: unknown
   selectedVariants?: SelectedVariant[]
   delta: number
}) {
   const lineKey = buildLineKey(productId, selectedVariants)
   const next = [...items]
   const index = findCartLineIndex(next, lineKey)

   if (index >= 0) {
      const newCount = next[index].count + delta
      if (newCount <= 0) {
         next.splice(index, 1)
      } else {
         next[index] = {
            ...next[index],
            count: newCount,
            selectedVariants,
            product,
         }
      }
      return next
   }

   if (delta > 0) {
      next.push({
         lineKey,
         productId,
         product,
         count: delta,
         selectedVariants,
      })
   }

   return next
}
