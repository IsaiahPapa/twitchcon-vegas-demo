import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { AiVoiceSchema } from '@/lib/models'
import { useVoices } from '@/contexts/VoiceContext'
import { ChatList } from './chat-list'
import { VoiceList } from './voice-list'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'

const exampleMessages = [
  {
    heading: 'Explain technical concepts',
    message: `What is a "serverless function"?`
  },
  {
    heading: 'Summarize an article',
    message: 'Summarize the following article for a 2nd grader: \n'
  },
  {
    heading: 'Draft an email',
    message: `Draft an email to my boss about the following: \n`
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  const { voices } = useVoices()

  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-8 text-center text-5xl font-extrabold leading-tight tracking-tighter md:text-6xl">
          Isaiah{' '}
          <span className="bg-blue-500 bg-clip-text text-transparent">
            Creati{`'`}s Bot
          </span>
        </h1>

        <CardHeader>
          <CardTitle>Select a Character</CardTitle>
          <CardDescription>Who would you like to chat with?</CardDescription>
        </CardHeader>

        <VoiceList />
      </div>
    </div>
  )
}
