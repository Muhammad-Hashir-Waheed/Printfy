export type PricingVariant = {
   name: string
   value: string
   priceModifier: number
}

export function calculatePrice({
   basePrice,
   quantity,
   variants = [],
   discount = 0,
}: {
   basePrice: number
   quantity: number
   variants?: PricingVariant[]
   discount?: number
}) {
   const safeQuantity = Math.max(1, Number(quantity) || 1)
   const variantDelta = variants.reduce(
      (sum, variant) => sum + (Number(variant.priceModifier) || 0),
      0
   )
   const unitBase = Math.max(0, Number(basePrice) + variantDelta)
   const unitAfterDiscount = Math.max(0, unitBase - (Number(discount) || 0))

   return {
      unitPrice: parseFloat(unitAfterDiscount.toFixed(2)),
      total: parseFloat((unitAfterDiscount * safeQuantity).toFixed(2)),
      quantity: safeQuantity,
      appliedVariantDelta: parseFloat(variantDelta.toFixed(2)),
   }
}
