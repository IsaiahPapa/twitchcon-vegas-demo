'use client'

import { useChat, type Message } from 'ai/react'
import { Howl, Howler } from 'howler'
import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useCallback, useMemo, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { toast } from 'react-hot-toast'
import { useVoices } from '@/contexts/VoiceContext'
import { AiVoiceSchema } from '@/lib/models'

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
  modelId: AiVoiceSchema['model_id']
}

const getAiVoice = (id: string, voices: AiVoiceSchema[]) => {
  return voices.find(voice => voice.model_id === id)
}

function cleanMessage(message: string): string {
  // Replace newlines and carriage returns with spaces
  let cleanedMessage = message.replace(/[\r\n]+/g, ' ')

  // Remove any non-alphanumeric characters, except spaces, periods, commas, exclamation marks, and question marks.
  cleanedMessage = cleanedMessage.replace(/[^a-zA-Z0-9 .,!?]/g, '').trim()

  // Use encodeURIComponent to ensure safe usage in URL
  return encodeURIComponent(cleanedMessage)
}

export function Chat({ id, modelId, initialMessages, className }: ChatProps) {
  const { voices } = useVoices()

  const voice = useMemo(() => getAiVoice(modelId, voices), [modelId, voices])
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null
  )
  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW)
  const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? '')
  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
      id,
      body: {
        id,
        previewToken
      },
      onFinish(message) {
        if (!voice) return
        const sound = new Howl({
          format: ['webm', 'mp3'],
          volume: 1,
          html5: true,
          src: [
            `${process.env.NEXT_PUBLIC_TTS_API_URL}?voice=${
              voice.name
            }&text=${cleanMessage(message.content.trim())}`
          ]
        })
        sound.play()
      },
      onResponse(response) {
        console.log(response)
        if (response.status === 401) {
          toast.error(response.statusText)
        }
      }
    })
  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length ? (
          <>
            <ChatList
              image={voice && voice.image_thumbnail_url}
              messages={messages}
            />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />

      <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            <DialogDescription>
              If you have not obtained your OpenAI API key, you can do so by{' '}
              <a
                href="https://platform.openai.com/signup/"
                className="underline"
              >
                signing up
              </a>{' '}
              on the OpenAI website. This is only necessary for preview
              environments so that the open source community can test the app.
              The token will be saved to your browser&apos;s local storage under
              the name <code className="font-mono">ai-token</code>.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={previewTokenInput}
            placeholder="OpenAI API key"
            onChange={e => setPreviewTokenInput(e.target.value)}
          />
          <DialogFooter className="items-center">
            <Button
              onClick={() => {
                setPreviewToken(previewTokenInput)
                setPreviewTokenDialog(false)
              }}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
