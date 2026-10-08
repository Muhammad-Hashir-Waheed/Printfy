'use client'

import {
   getProductByKey,
   priceFor,
   sanitizeSelections,
   type CatalogImage,
   type Selections,
} from '@/catalog'
import { useCallback, useMemo, useSyncExternalStore } from 'react'

export const DESIGN_SERVICE_FEE = 25

export type ArtworkMode = 'upload' | 'design' | 'later'

export type CartArtwork = {
   mode: ArtworkMode
   fileName?: string
   /** Small JPEG preview (data URL) — the full file is requested by email after ordering */
   thumb?: string
   brief?: string
}

export type CartLine = {
   id: string
   productKey: string
   selections: Selections
   qty: number
   artwork: CartArtwork
   addedAt: number
}

export type PricedLine = CartLine & {
   name: string
   href: string
   categoryName: string
   departmentName: string
   image: CatalogImage | null
   unit: number
   productTotal: number
   designFee: number
   total: number
   savings: number
   tiers: number[]
   unitLabel: string
}

const STORAGE_KEY = 'joji-cart-v1'
const EMPTY: CartLine[] = []

let cache: CartLine[] | null = null
const listeners = new Set<() => void>()

function read(): CartLine[] {
   if (cache) return cache
   if (typeof window === 'undefined') return EMPTY
   try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      cache = Array.isArray(parsed) ? parsed.filter((l) => getProductByKey(l?.productKey)) : []
   } catch {
      cache = []
   }
   return cache
}

function write(lines: CartLine[]) {
   cache = lines
   try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
   } catch {
      // Storage full or blocked (private mode) — keep the in-memory cart working.
   }
   listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
   listeners.add(listener)
   const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
         cache = null
         listener()
      }
   }
   window.addEventListener('storage', onStorage)
   return () => {
      listeners.delete(listener)
      window.removeEventListener('storage', onStorage)
   }
}

export function priceLine(line: CartLine): PricedLine | null {
   const product = getProductByKey(line.productKey)
   if (!product || product.quote) return null
   const selections = sanitizeSelections(product, line.selections)
   const price = priceFor(product, selections, line.qty)
   const designFee = line.artwork?.mode === 'design' ? DESIGN_SERVICE_FEE : 0
   return {
      ...line,
      selections,
      name: product.name,
      href: product.href,
      categoryName: product.categoryName,
      departmentName: product.departmentName,
      image: product.image,
      unit: price.unit,
      productTotal: price.total,
      designFee,
      total: Math.round((price.total + designFee) * 100) / 100,
      savings: price.savings,
      tiers: product.preset.tiers.map((t) => t.qty),
      unitLabel: product.preset.unit,
   }
}

function newId() {
   return typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function useCart() {
   const lines = useSyncExternalStore(subscribe, read, () => EMPTY)

   const priced = useMemo(
      () => lines.map(priceLine).filter(Boolean) as PricedLine[],
      [lines]
   )

   const subtotal = useMemo(
      () => Math.round(priced.reduce((sum, l) => sum + l.total, 0) * 100) / 100,
      [priced]
   )

   const add = useCallback((line: Omit<CartLine, 'id' | 'addedAt'>) => {
      const next: CartLine = { ...line, id: newId(), addedAt: Date.now() }
      write([...read(), next])
      return next
   }, [])

   const update = useCallback((id: string, patch: Partial<Omit<CartLine, 'id'>>) => {
      write(read().map((l) => (l.id === id ? { ...l, ...patch } : l)))
   }, [])

   const remove = useCallback((id: string) => {
      write(read().filter((l) => l.id !== id))
   }, [])

   const clear = useCallback(() => write([]), [])

   return {
      lines: priced,
      count: priced.length,
      subtotal,
      add,
      update,
      remove,
      clear,
   }
}
