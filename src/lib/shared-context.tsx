'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { ExciseData, PRData } from './interface'
import { prData as initialPrData } from './data'

type SharedContextType = {
    prData: ExciseData[]
    setPrData: (data: ExciseData[]) => void
}

const SharedContext = createContext<SharedContextType | undefined>(undefined)

export function SharedProvider({ children }: { children: ReactNode }) {
    const [prData, setPrData] = useState<ExciseData[]>(initialPrData)

    return (
        <SharedContext.Provider value={{ prData, setPrData }}>
            {children}
        </SharedContext.Provider>
    )
}

export function useSharedContext() {
    const context = useContext(SharedContext)
    if (context === undefined) {
        throw new Error('useSharedContext must be used within a SharedProvider')
    }
    return context
}
