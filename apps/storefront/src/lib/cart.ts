export function writeLocalCart(items) {
   window.localStorage.setItem('Cart', JSON.stringify(items))
}

export function getLocalCart() {
   if (typeof window !== 'undefined' && window.localStorage) {
      try {
         return JSON.parse(window.localStorage.getItem('Cart'))
      } catch {
         writeLocalCart({ items: [] })
         return { items: [] }
      }
   }
}

export function getCountInCart({
   cartItems,
   productId,
   lineKey,
}: {
   cartItems?: Array<{ productId?: string; lineKey?: string; count?: number }>
   productId?: string
   lineKey?: string
}) {
   try {
      if (!cartItems?.length) return 0
      if (lineKey) {
         const line = cartItems.find((i) => i.lineKey === lineKey)
         return line?.count ?? 0
      }
      for (let i = 0; i < cartItems.length; i++) {
         if (cartItems[i]?.productId === productId) {
            return cartItems[i]?.count ?? 0
         }
      }
      return 0
   } catch (error) {
      console.error({ error })
      return 0
   }
}
