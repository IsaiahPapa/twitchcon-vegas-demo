import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface VoiceItemProps {
  title: string
  subtitle: string
  imageUrl: string
  demoUrl: string
  additionalClasses?: string
  onClick: () => void
  size?: 'small' | 'medium'
}

const VoiceItem: React.FC<VoiceItemProps> = ({
  title,
  subtitle,
  imageUrl,
  size = 'small',
  onClick,
}) => {
  const getSize = (component: 'image' | 'title' | 'subtitle') => {
    if (component === 'image') {
      if (size === 'medium') return 'w-20 h-20 md:w-24 md:h-24'
      return 'w-16 h-16'
    }
    if (component === 'title') {
      if (size === 'medium') return 'text-2xl md:text-3xl'
      return 'text-2xl'
    }
    if (component === 'subtitle') {
      return 'text-md'
    }
  }

  return (
    <Card className={`flex flex-row cursor-pointer duration-100 hover:bg-gray-900`} onClick={onClick}>
      <CardHeader>
        <Avatar className='w-24 h-24'>
          <AvatarImage src={imageUrl} alt={title} />
          <AvatarFallback>Avatar</AvatarFallback>
        </Avatar>
        
      </CardHeader>
      <CardContent className="flex w-full flex-col justify-center p-6">
        <CardTitle
          className={`${getSize(
            'title'
          )} font-semibold leading-tight text-gray-300`}
        >
          {title}
        </CardTitle>
        <CardDescription className="text-md text-gray-500">
          {subtitle}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

export default VoiceItem
