'use client'

import React, { createContext, useContext, useState } from 'react'

export type PlaygroundMode = 'create' | 'contracts' | 'deploy' | 'interact' | 'faucet' | 'assets'

interface PlaygroundContextValue {
  mode: PlaygroundMode
  setMode: (mode: PlaygroundMode) => void
  selectedContract: string | null
  setSelectedContract: (contract: string | null) => void
}

const PlaygroundContext = createContext<PlaygroundContextValue | undefined>(undefined)

interface PlaygroundProviderProps {
  children: React.ReactNode
  initialMode?: PlaygroundMode
}

export function PlaygroundProvider({ children, initialMode = 'create' }: PlaygroundProviderProps) {
  const [mode, setMode] = useState<PlaygroundMode>(initialMode)
  const [selectedContract, setSelectedContract] = useState<string | null>(null)

  return (
    <PlaygroundContext.Provider value={{ mode, setMode, selectedContract, setSelectedContract }}>
      {children}
    </PlaygroundContext.Provider>
  )
}

export function usePlayground(): PlaygroundContextValue {
  const ctx = useContext(PlaygroundContext)
  if (!ctx) throw new Error('usePlayground must be used within a PlaygroundProvider')
  return ctx
}