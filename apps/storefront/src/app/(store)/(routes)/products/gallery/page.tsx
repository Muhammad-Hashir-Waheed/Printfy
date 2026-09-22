import { redirect } from 'next/navigation'

/** Legacy route — single catalog lives at /products */
export default function ProductsGalleryPage() {
   redirect('/products')
}
