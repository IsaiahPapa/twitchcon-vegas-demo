'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { type Chat } from '@/lib/types'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { IconMessage, IconUsers } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useVoices } from '@/contexts/VoiceContext'

interface SidebarItemProps {
  chat: Chat
  children: React.ReactNode
}

export function SidebarItem({ chat, children }: SidebarItemProps) {
  const pathname = usePathname()
  const { voices } = useVoices()
  const isActive = pathname === chat.path

  const voice = voices.find(v => v.model_id === chat.modelId)

  if (!chat?.id || !voice) return null

  return (
    <div className="relative flex flex-row gap-2">

        <img className='h-12 w-12 rounded-md' key={voice.name} src={voice.image_thumbnail_url}/>
      
      <Link
        href={chat.path}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'group w-full pr-16',
          isActive && 'bg-accent'
        )}
      >
        <div
          className="relative max-h-5 flex-1 select-none overflow-hidden text-ellipsis break-all"
          title={chat.title}
        >
          <span className="whitespace-nowrap">{chat.title}</span>
        </div>
      </Link>
      {/* {isActive && <div className="absolute right-2 top-1">{children}</div>} */}
    </div>
  )
}
