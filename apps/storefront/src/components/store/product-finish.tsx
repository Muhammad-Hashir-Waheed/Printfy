'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

/** Shares the selected metalized finish between the configurator and the gallery. */
const FinishContext = createContext<{ metallic: string | null; setMetallic: (v: string | null) => void }>({
   metallic: null,
   setMetallic: () => {},
})

export function ProductFinishProvider({ children }: { children: ReactNode }) {
   const [metallic, setMetallic] = useState<string | null>(null)
   return <FinishContext.Provider value={{ metallic, setMetallic }}>{children}</FinishContext.Provider>
}

export const useProductFinish = () => useContext(FinishContext)
