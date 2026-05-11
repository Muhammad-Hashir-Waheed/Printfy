import { useAuthenticated } from '@/hooks/useAuthentication'
import { isVariableValid } from '@/lib/utils'
import React, { createContext, useContext, useEffect, useState } from 'react'

const UserContext = createContext({
   user: null,
   loading: true,
   refreshUser: () => {},
})

export const useUserContext = () => {
   return useContext(UserContext)
}

export const UserContextProvider = ({ children }) => {
   const { authenticated } = useAuthenticated()

   const [user, setUser] = useState(null)
   const [loading, setLoading] = useState(true)

   const refreshUser = async () => {
      try {
         if (authenticated) {
            setLoading(true)

            const response = await fetch(`/api/profile`, {
               cache: 'no-store',
            })

            const json = await response.json()

            if (isVariableValid(json)) {
               setUser(json)
               setLoading(false)
            }

            setLoading(false)
         }
      } catch (error) {
         console.error({ error })
      }
   }

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await fetch(`/api/profile`, {
               cache: 'no-store',
            })

            const json = await response.json()

            if (isVariableValid(json)) {
               setUser(json)
               setLoading(false)
            }
         } catch (error) {
            console.error({ error })
         }
      }

      if (authenticated) {
         fetchData()
      } else {
         setLoading(false)
      }
   }, [authenticated])

   return (
      <UserContext.Provider value={{ user, loading, refreshUser }}>
         {children}
      </UserContext.Provider>
   )
}
