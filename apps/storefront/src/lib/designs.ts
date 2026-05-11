export type DesignTransform = {
   scale: number
   rotate: number
   x: number
   y: number
}

export type ProductCustomization = {
   productId: string
   designImage?: string
   variants?: Array<{ name: string; value: string; priceModifier?: number }>
   transform: DesignTransform
   savedAt: string
}

export const defaultTransform: DesignTransform = {
   scale: 100,
   rotate: 0,
   x: 0,
   y: 0,
}

export async function getSavedDesigns(): Promise<ProductCustomization[]> {
   const response = await fetch('/api/designs', {
      method: 'GET',
      cache: 'no-store',
   })
   if (!response.ok) return []
   const designs = await response.json()
   return designs.map((design) => ({
      productId: design.productId,
      designImage: design.previewUrl,
      variants: design.designJson?.variants ?? [],
      transform: design.designJson?.transform ?? defaultTransform,
      savedAt: design.updatedAt ?? design.createdAt ?? new Date().toISOString(),
   }))
}

export async function getSavedDesign(
   productId: string
): Promise<ProductCustomization | null> {
   const response = await fetch(`/api/designs?productId=${productId}`, {
      method: 'GET',
      cache: 'no-store',
   })
   if (!response.ok) return null
   const design = await response.json()
   if (!design) return null
   return {
      productId: design.productId,
      designImage: design.previewUrl,
      variants: design.designJson?.variants ?? [],
      transform: design.designJson?.transform ?? defaultTransform,
      savedAt: design.updatedAt ?? design.createdAt ?? new Date().toISOString(),
   }
}

export async function saveDesign(design: ProductCustomization) {
   const response = await fetch('/api/designs', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         productId: design.productId,
         previewUrl: design.designImage,
         designJson: {
            transform: design.transform,
            variants: design.variants ?? [],
         },
      }),
   })

   if (!response.ok) {
      throw new Error('Failed to save design')
   }

   return response.json()
}

export async function deleteDesign(productId: string) {
   const response = await fetch(`/api/designs?productId=${productId}`, {
      method: 'DELETE',
   })
   if (!response.ok) {
      throw new Error('Failed to delete design')
   }
}
