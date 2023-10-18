import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'

export const runtime = 'edge'
export const preferredRegion = 'home'

export interface ChatPageProps {
  params: {
    id: string
  }
}

const USERID = 'DEMO'

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const chat = await getChat(params.id, USERID)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const chat = await getChat(params.id, USERID)

  if (!chat) {
    notFound()
  }

  if (chat?.userId !== USERID) {
    notFound()
  }

  return (
    <Chat modelId={chat.modelId} id={chat.id} initialMessages={chat.messages} />
  )
}
