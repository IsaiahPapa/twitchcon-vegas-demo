'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'

import { TooltipProvider } from '@/components/ui/tooltip'
import { VoiceProvider } from '@/contexts/VoiceContext'

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <VoiceProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </VoiceProvider>
    </NextThemesProvider>
  )
}
