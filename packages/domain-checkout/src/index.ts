import type { PrismaClient } from '@prisma/client'
import {
   createOrderFromItems,
   DomainOrderError,
   reserveDiscountCode,
   type DesignTransform,
   type OrderItemInput,
} from '../../domain-orders/src'
import type { PricingVariant } from '../../domain-pricing/src'
import { z } from 'zod'

const pricingVariantSchema = z.object({
   name: z.string(),
   value: z.string(),
   priceModifier: z.coerce.number().default(0),
})

const designTransformSchema = z.object({
   scale: z.coerce.number(),
   rotate: z.coerce.number(),
   x: z.coerce.number(),
   y: z.coerce.number(),
})

export const checkoutItemSchema = z.object({
   productId: z.string().min(1),
   count: z.coerce.number().int().min(1),
   selectedVariants: z.array(pricingVariantSchema).optional(),
   customDesign: z
      .object({
         designImage: z.string().optional(),
         transform: designTransformSchema.optional(),
         variants: z.array(pricingVariantSchema).optional(),
      })
      .optional(),
})

function toPricingVariants(
   variants?: z.output<typeof pricingVariantSchema>[]
): PricingVariant[] | undefined {
   if (!variants) return undefined
   return variants.map((variant) => ({
      name: variant.name,
      value: variant.value,
      priceModifier: variant.priceModifier,
   }))
}

function toDesignTransform(
   transform?: z.output<typeof designTransformSchema>
): DesignTransform | undefined {
   if (!transform) return undefined
   return {
      scale: transform.scale,
      rotate: transform.rotate,
      x: transform.x,
      y: transform.y,
   }
}

export const checkoutPayloadSchema = z.object({
   phone: z.string().min(5),
   address: z.string().min(5),
   city: z.string().min(2),
   postalCode: z.string().min(3),
   country: z.string().min(2).optional().default('IRI'),
   discountCode: z.string().optional(),
   items: z.array(checkoutItemSchema).min(1),
})

type CheckoutProduct = {
   id: string
   price: number
   discount: number
}

export class DomainCheckoutError extends Error {
   code: 'INVALID_PRODUCT'
   constructor(code: 'INVALID_PRODUCT') {
      super(code)
      this.code = code
   }
}

export async function normalizeCheckoutItems({
   prisma,
   items,
}: {
   prisma: PrismaClient
   items: z.output<typeof checkoutItemSchema>[]
}): Promise<OrderItemInput[]> {
   const productIds = Array.from(new Set(items.map((item) => item.productId)))
   const products = await prisma.product.findMany({
      where: {
         id: { in: productIds },
      },
      select: {
         id: true,
         price: true,
         discount: true,
      },
   })
   const productsMap = new Map<string, CheckoutProduct>(
      products.map((product) => [product.id, product])
   )

   return items.map((item) => {
      const product = productsMap.get(item.productId)
      if (!product) {
         throw new DomainCheckoutError('INVALID_PRODUCT')
      }
      return {
         productId: item.productId,
         count: item.count,
         selectedVariants: toPricingVariants(item.selectedVariants),
         customDesign: item.customDesign
            ? {
                 designImage: item.customDesign.designImage,
                 transform: toDesignTransform(item.customDesign.transform),
                 variants: toPricingVariants(item.customDesign.variants),
              }
            : undefined,
         product: {
            id: product.id,
            price: product.price,
            discount: product.discount,
         },
      }
   })
}

export async function executeCheckout({
   prisma,
   userId,
   payload,
}: {
   prisma: PrismaClient
   userId: string
   payload: z.infer<typeof checkoutPayloadSchema>
}) {
   const normalizedItems = await normalizeCheckoutItems({
      prisma,
      items: payload.items,
   })

   return prisma.$transaction(async (tx) => {
      const resolvedDiscountCode = await reserveDiscountCode(tx, payload.discountCode)

      const createdAddress = await tx.address.create({
         data: {
            userId,
            phone: payload.phone,
            address: payload.address,
            city: payload.city,
            postalCode: payload.postalCode,
            country: payload.country ?? 'IRI',
         },
      })

      return createOrderFromItems({
         tx,
         userId,
         addressId: createdAddress.id,
         items: normalizedItems,
         discountCode: resolvedDiscountCode,
      })
   })
}

export { DomainOrderError }
