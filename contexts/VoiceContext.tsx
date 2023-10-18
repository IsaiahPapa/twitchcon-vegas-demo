import { AiVoiceSchema } from '@/lib/models'
import { fetcher } from '@/lib/utils'
import { createContext, useContext } from 'react'

import { useState, useEffect, ReactNode } from 'react'

interface VoiceContextType {
  voices: AiVoiceSchema[]
  fetchVoices: () => void // You can define more functions or values if required
}

export const VoiceContext = createContext<VoiceContextType | undefined>(
  undefined
)

interface VoiceProviderProps {
  children: ReactNode
}

export const VoiceProvider: React.FC<VoiceProviderProps> = ({ children }) => {
  const [voices, setVoices] = useState<AiVoiceSchema[]>([])

  const fetchVoices = async () => {
    if (voices.length > 0) return
    const data = await fetcher<AiVoiceSchema[]>(
      'https://bot.isaiahcreati.com/api/resources/voices'
    )
    //@ts-ignore
    setVoices(data.filter(voice => voice.type === 'ai'))
  }

  useEffect(() => {
    fetchVoices()
  }, [])

  return (
    <VoiceContext.Provider value={{ voices, fetchVoices }}>
      {children}
    </VoiceContext.Provider>
  )
}

export function useVoices() {
  const context = useContext(VoiceContext)
  if (!context) {
    throw new Error('useVoices must be used within a VoiceProvider')
  }
  return context
}
