import type { ImageLoaderProps } from 'next/image'

/** Widths pre-built by scripts/image-variants.mjs — keep in sync with WIDTHS there. */
const VARIANT_WIDTHS = [256, 640, 1080]

const LOCAL_IMAGE = /^\/(catalog|packaging)\/.+\.(jpe?g|png|webp)$/i

/**
 * next/image loader without an optimisation server (none runs on Cloudflare Workers):
 *  - catalog images → the smallest pre-built WebP copy that covers the requested width,
 *    or the original when the layout wants more than the largest copy;
 *  - Unsplash and Pexels → their own CDN resizing;
 *  - anything else → as is.
 */
export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
   if (LOCAL_IMAGE.test(src)) {
      const w = VARIANT_WIDTHS.find((v) => v >= width)
      return w ? `/_v/${w}${src.replace(/\.(jpe?g|png|webp)$/i, '.webp')}` : src
   }
   if (src.startsWith('https://images.unsplash.com/')) {
      const url = new URL(src)
      url.searchParams.set('w', String(width))
      url.searchParams.set('q', String(quality ?? 75))
      url.searchParams.set('auto', 'format')
      return url.toString()
   }
   if (src.startsWith('https://images.pexels.com/')) {
      const url = new URL(src)
      url.searchParams.set('w', String(width))
      url.searchParams.set('auto', 'compress')
      return url.toString()
   }
   return src
}
