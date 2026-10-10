import { createContext, useContext } from 'react'

export const InteractionContext = createContext(null)

export function useInteractions() {
  const ctx = useContext(InteractionContext)
  if (!ctx) throw new Error('useInteractions must be used within InteractionProvider')
  return ctx
}