import type { DiscountCode, Prisma, PrismaClient } from '@prisma/client'
import { initializeOrderFulfillment, processOrderAsync } from '../../domain-fulfillment/src'
import { calculatePrice, type PricingVariant } from '../../domain-pricing/src'

export type DesignTransform = {
   scale: number
   rotate: number
   x: number
   y: number
}

export interface OrderItemInput {
   productId: string
   count: number
   product: {
      id: string
      price: number
      discount: number
   }
   selectedVariants?: PricingVariant[]
   customDesign?: {
      designImage?: string
      transform?: DesignTransform
      variants?: PricingVariant[]
   }
}

export interface OrderTotals {
   total: number
   discount: number
   tax: number
   payable: number
}

export class DomainOrderError extends Error {
   code: 'EMPTY_CART' | 'INVALID_DISCOUNT_CODE'
   constructor(code: 'EMPTY_CART' | 'INVALID_DISCOUNT_CODE') {
      super(code)
      this.code = code
   }
}

export function calculateOrderTotals(
   items: OrderItemInput[],
   discountCode?: DiscountCode | null
): OrderTotals {
   let total = 0
   let productDiscount = 0

   for (const item of items) {
      const variants = item.selectedVariants ?? item.customDesign?.variants ?? []
      const discounted = calculatePrice({
         basePrice: item.product.price,
         quantity: item.count,
         variants,
         discount: item.product.discount,
      })
      const lineBaseTotal =
         discounted.total + item.count * (Number(item.product.discount) || 0)
      total += lineBaseTotal
      productDiscount += lineBaseTotal - discounted.total
   }

   const afterProductDiscount = total - productDiscount
   const codeDiscount = discountCode
      ? Math.min(
           (afterProductDiscount * discountCode.percent) / 100,
           discountCode.maxDiscountAmount
        )
      : 0
   const discount = productDiscount + codeDiscount
   const afterDiscount = total - discount
   const tax = afterDiscount * 0.09
   const payable = afterDiscount + tax

   return {
      total: parseFloat(total.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      payable: parseFloat(payable.toFixed(2)),
   }
}

export async function reserveDiscountCode(
   tx: Prisma.TransactionClient,
   discountCode?: string
) {
   if (!discountCode) return null
   const now = new Date()
   const updated = await tx.discountCode.updateMany({
      where: {
         code: discountCode,
         stock: { gte: 1 },
         startDate: { lte: now },
         endDate: { gte: now },
      },
      data: {
         stock: { decrement: 1 },
      },
   })

   if (updated.count === 0) {
      throw new DomainOrderError('INVALID_DISCOUNT_CODE')
   }

   return tx.discountCode.findUnique({
      where: { code: discountCode },
   })
}

export async function createOrderFromItems({
   tx,
   userId,
   addressId,
   items,
   discountCode,
}: {
   tx: Prisma.TransactionClient
   userId: string
   addressId: string
   items: OrderItemInput[]
   discountCode?: DiscountCode | null
}) {
   const { total, discount, tax, payable } = calculateOrderTotals(items, discountCode)

   const order = await tx.order.create({
      data: {
         user: { connect: { id: userId } },
         status: 'Processing',
         fulfillmentStatus: 'pending',
         total,
         tax,
         payable,
         discount,
         shipping: 0,
         address: { connect: { id: addressId } },
         ...(discountCode
            ? {
                 discountCode: {
                    connect: { id: discountCode.id },
                 },
              }
            : {}),
         orderItems: {
            create: await Promise.all(
               items.map(async (orderItem) => {
                  const variants =
                     orderItem.selectedVariants ?? orderItem.customDesign?.variants ?? []
                  const itemPricing = calculatePrice({
                     basePrice: Number(orderItem.product.price),
                     quantity: Number(orderItem.count),
                     variants,
                     discount: Number(orderItem.product.discount ?? 0),
                  })

                  const fallbackDesign = await tx.design.findUnique({
                     where: {
                        UniqueUserProductDesign: {
                           userId,
                           productId: orderItem.productId,
                        },
                     },
                  })

                  const designJson = orderItem.customDesign
                     ? {
                          transform: orderItem.customDesign.transform,
                          variants,
                       }
                     : fallbackDesign?.designJson

                  const previewUrl =
                     orderItem.customDesign?.designImage ?? fallbackDesign?.previewUrl

                  return {
                     count: orderItem.count,
                     price: itemPricing.unitPrice,
                     discount: Number(orderItem.product.discount ?? 0),
                     designJson,
                     previewUrl,
                     product: {
                        connect: {
                           id: orderItem.productId,
                        },
                     },
                  }
               })
            ),
         },
      },
   })

   await initializeOrderFulfillment(tx, order.id)

   return { order, totals: { total, discount, tax, payable } }
}

export async function placeOrderFromUserCart({
   prisma,
   userId,
   addressId,
   discountCode,
}: {
   prisma: PrismaClient
   userId: string
   addressId: string
   discountCode?: string
}) {
   const cart = await prisma.cart.findUniqueOrThrow({
      where: { userId },
      include: {
         items: {
            include: {
               product: true,
            },
         },
      },
   })

   if (cart.items.length === 0) {
      throw new DomainOrderError('EMPTY_CART')
   }

   const result = await prisma.$transaction(async (tx) => {
      const resolvedDiscountCode = await reserveDiscountCode(tx, discountCode)
      return createOrderFromItems({
         tx,
         userId,
         addressId,
         items: cart.items,
         discountCode: resolvedDiscountCode,
      })
   })

   processOrderAsync({ prisma, orderId: result.order.id })
   return result
}

export async function notifyOwnersAboutOrder({
   prisma,
   order,
   payable,
   onOwnerNotification,
}: {
   prisma: PrismaClient
   order: { id: string; number: number }
   payable: number
   onOwnerNotification?: (owner: { id: string; email: string }) => Promise<void>
}) {
   const owners = await prisma.owner.findMany()
   await prisma.notification.createMany({
      data: owners.map((owner) => ({
         userId: owner.id,
         content: `Order #${order.number} was created was created with a value of $${payable}.`,
      })),
   })

   if (onOwnerNotification) {
      for (const owner of owners) {
         await onOwnerNotification({ id: owner.id, email: owner.email })
      }
   }
}
