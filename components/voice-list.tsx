'use client'
import { useEffect, useState } from 'react'
import VoiceItem from './voice-item'
import Models, { AiVoiceSchema } from '@/lib/models'
import { useVoices } from '@/contexts/VoiceContext'
import { useRouter } from 'next/navigation'
import { Progress } from './ui/progress'

export interface VoiceListProps {}

export function VoiceList({}: VoiceListProps) {
  //   const chats = await getChats(userId)
  const router = useRouter()
  const { voices } = useVoices()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('Getting data')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (progress >= 100) return

    const interval = setInterval(() => {
      // Increase the progress in a pseudo-random manner
      const increment = Math.random() * 2 + 1 // Random number between 1 and 3
      setProgress(prev => Math.min(prev + increment, 100)) // Ensure it doesn't exceed 100
    }, Math.random() * 500 + 500) // Random interval between 500ms to 1000ms

    // This will clear the interval after the component is unmounted or when progress reaches 100
    return () => clearInterval(interval)
  }, [progress])

  useEffect(() => {
    const messages = [
      'Loading new DLC...',
      'Questing for bytes...',
      'Looting code repositories...',
      'Patching the matrix...',
      'Summoning in-game NPCs...',
      'Compiling shaders...',
      'Upgrading GPU...',
      'Achieving 60 FPS...',
      'Respawning...',
      'Spawning random bugs...',
      'Rolling back to last checkpoint...',
      'Building terrain...',
      'Generating random loot...',
      'Defragging the dungeon...',
      'Casting to int...',
      'Optimizing AI routines...',
      'Training neural networks to game...',
      'Rerolling character stats...'
    ]
    let currentMessageIndex = 0

    const messageInterval = setInterval(() => {
      currentMessageIndex = (currentMessageIndex + 1) % messages.length
      setMessage(messages[currentMessageIndex])
    }, 3000)

    return () => clearInterval(messageInterval)
  }, [])

  return (
    <div className="relative flex-1 overflow-auto">
      {loading && (
        <div
          className="absolute left-0 top-0 z-10 h-full w-full flex items-center justify-center p-12"
          style={{ backdropFilter: 'blur(5px)' }}
        >
          <div className="flex flex-col items-center justify-center w-full gap-4">
            <span>{message}</span>
            <Progress value={progress} className="h-4 w-full" />
          </div>
        </div>
      )}
      {voices?.length ? (
        <div className="space-y-2 px-2">
          {voices.map(
            voice =>
              voice &&
              Models.find(model => model.id === voice.model_id) && (
                <VoiceItem
                  onClick={() => {
                    const newChat = async () => {
                      try {
                        if (loading) return
                        setLoading(true)
                        const response = await fetch('/api/chat/generate', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify(voice)
                        })
                        setLoading(false)
                        if (!response.ok) {
                          throw new Error(
                            `Failed to generate chat:
                            ${await response.text()}`
                          )
                        }

                        const newChatResponse: { id: string; path: string } =
                          await response.json()
                        router.push(newChatResponse.path)
                      } catch (error) {
                        console.error('Error occurred:', error)
                        setLoading(false)
                      }
                    }

                    newChat()
                  }}
                  key={voice?.uuid}
                  title={voice.name}
                  subtitle={voice.alt}
                  imageUrl={String(voice.image_thumbnail_url)}
                  demoUrl={String(voice.audio_sample_url)}
                  size="medium"
                />
              )
          )}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No voices</p>
        </div>
      )}
    </div>
  )
}
