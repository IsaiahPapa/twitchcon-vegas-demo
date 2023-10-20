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

const EnabledVoiceModels: AiVoiceSchema[] = [
  {
    model_id: '1rQVOSBepnQc6EUTNulQDzAntxmv1majt',
    name: 'Qneeks',
    alt: 'Runscape Streamer',
    category: ['Clone'],
    public: false,
    allowed_ids: ['127584396'],
    messages_generated: 10,
    featured: true,
    image_banner_url: '',
    image_thumbnail_url:
      'https://cdn.isaiahcreati.com/ai/52779c41-a0c3-466c-b4cf-4643115de934/qneeks_profile.png',
    audio_sample_url:
      'https://cdn.isaiahcreati.com/ai/52779c41-a0c3-466c-b4cf-4643115de934/qneeks_demo.mp3',
    enabled: true,
    type: 'ai'
  },
  {
    model_id: '1Tmoco1zi1i_RXRQut-OUrn95FfcssPru',
    name: 'Brittballs',
    alt: 'Variety Streamer',
    category: ['Clone'],
    public: false,
    allowed_ids: ['181730455'],
    messages_generated: 14,
    featured: true,
    image_banner_url: '',
    image_thumbnail_url:
      'https://cdn.isaiahcreati.com/ai/1Tmoco1zi1i_RXRQut-OUrn95FfcssPru/britballs_profile.png',
    audio_sample_url:
      'https://cdn.isaiahcreati.com/ai/1Tmoco1zi1i_RXRQut-OUrn95FfcssPru/ai_voice_britt.mp3',
    enabled: true,
    type: 'ai'
  },
  {
    model_id: '1g4rRgL0hGqkD2kcpfoBBoW6gaOJOPAI_',
    name: 'mick_homie',
    alt: 'Runscape Streamer',
    category: ['Clone'],
    public: false,
    allowed_ids: ['195073455'],
    messages_generated: 0,
    featured: true,
    image_banner_url: '',
    image_thumbnail_url:
      'https://cdn.isaiahcreati.com/ai/1g4rRgL0hGqkD2kcpfoBBoW6gaOJOPAI_/mick_profile.png',
    audio_sample_url:
      'https://cdn.isaiahcreati.com/ai/1g4rRgL0hGqkD2kcpfoBBoW6gaOJOPAI_/mick_sample.mp3',
    enabled: true,
    type: 'ai'
  },
  {
    model_id: '1eVBMOaRZ4yEuL8nUDtk_dYmFVcbo-IW3',
    name: 'Deme',
    alt: 'Variety Streamer',
    category: ['Clone'],
    public: false,
    allowed_ids: ['422275514'],
    messages_generated: 0,
    featured: true,
    image_banner_url: '',
    image_thumbnail_url:
      'https://cdn.isaiahcreati.com/ai/1eVBMOaRZ4yEuL8nUDtk_dYmFVcbo-IW3/deme_profile.png',
    audio_sample_url:
      'https://cdn.isaiahcreati.com/ai/1eVBMOaRZ4yEuL8nUDtk_dYmFVcbo-IW3/deme_sample.mp3',
    enabled: true,
    type: 'ai'
  },
  {
    model_id: '1dKq7D3mcXh9RrDvSQPP30rtcrW7CPvBm',
    name: 'Michael Scott',
    alt: 'Office Worker',
    category: [],
    public: true,
    allowed_ids: [],
    messages_generated: 448,
    featured: true,
    image_banner_url: '',
    image_thumbnail_url:
      'https://cdn.isaiahcreati.com/ai/5615023b-fbb2-4aa6-9e84-b7782ba976f4/Michael Scott.webp',
    audio_sample_url:
      'https://cdn.isaiahcreati.com/ai/5615023b-fbb2-4aa6-9e84-b7782ba976f4/Michael Scott_sample.mp3',
    enabled: true,
    type: 'ai'
  },
  {
    model_id: '1h5PwfMQFih3mDOxjhhkoRSpKy_nMjg8k',
    name: 'Spongebob',
    alt: 'Impersonation',
    category: [],
    public: true,
    allowed_ids: [],
    messages_generated: 3435,
    featured: true,
    image_banner_url: '',
    image_thumbnail_url:
      'https://cdn.isaiahcreati.com/ai/1h5PwfMQFih3mDOxjhhkoRSpKy_nMjg8k/spongebob_2.webp',
    audio_sample_url:
      'https://cdn.isaiahcreati.com/ai/1h5PwfMQFih3mDOxjhhkoRSpKy_nMjg8k/Spongebob.mp3',
    enabled: true,
    type: 'ai'
  },
  {
    model_id: '1FlHLDKaHGjOKIF1RfrX8ygi2tRCX-ss8',
    name: 'Computer',
    alt: 'Robot',
    category: [],
    public: true,
    allowed_ids: [],
    messages_generated: 193,
    featured: true,
    image_banner_url: '',
    image_thumbnail_url:
      'https://cdn.isaiahcreati.com/ai/1FlHLDKaHGjOKIF1RfrX8ygi2tRCX-ss8/computer_thumb.jpg',
    audio_sample_url:
      'https://cdn.isaiahcreati.com/ai/1FlHLDKaHGjOKIF1RfrX8ygi2tRCX-ss8/Computer_sample.mp3',
    enabled: true,
    type: 'ai'
  },
  {
    model_id: '1ZTIz9RpzXevWbnQA8ItX6OdzNUjWPhCe',
    name: '3Head',
    alt: 'British',
    category: [],
    public: true,
    allowed_ids: [],
    messages_generated: 12,
    featured: true,
    image_banner_url: '',
    image_thumbnail_url:
      'https://cdn.isaiahcreati.com/ai/1ZTIz9RpzXevWbnQA8ItX6OdzNUjWPhCe/3Head.png',
    audio_sample_url:
      'https://cdn.isaiahcreati.com/ai/1ZTIz9RpzXevWbnQA8ItX6OdzNUjWPhCe/3Head_sample.mp3',
    enabled: true,
    type: 'ai'
  },
  {
    model_id: '1fY161y9U9HqbevlhSL27xPhEFL7dHNN6',
    name: 'Barney Calhoun',
    alt: 'Security Guard',
    category: [],
    public: true,
    allowed_ids: [],
    messages_generated: 130,
    featured: true,
    image_banner_url: '',
    image_thumbnail_url:
      'https://cdn.isaiahcreati.com/ai/1fY161y9U9HqbevlhSL27xPhEFL7dHNN6/Barney Calhoun.png',
    audio_sample_url:
      'https://cdn.isaiahcreati.com/ai/1fY161y9U9HqbevlhSL27xPhEFL7dHNN6/barney_sample.mp3',
    enabled: true,
    type: 'ai'
  },
  {
    model_id: '2d57a251-a014-427a-a33d-575d7009e7e0',
    name: 'KKona',
    alt: 'Farmer',
    category: [],
    public: true,
    allowed_ids: [],
    messages_generated: 238,
    featured: true,
    image_banner_url: '',
    image_thumbnail_url:
      'https://cdn.isaiahcreati.com/ai/2d57a251-a014-427a-a33d-575d7009e7e0/kkona.png',
    audio_sample_url:
      'https://cdn.isaiahcreati.com/ai/2d57a251-a014-427a-a33d-575d7009e7e0/kkona_sample.mp3',
    enabled: true,
    type: 'ai'
  },
  {
    uuid: '6b52a42c-67e8-4260-ba74-8c418390fe81',
    model_id: '1rPQ1VJRM8fzQC8pO5nDH6xBpjU4e4DHk',
    name: 'GLaDOS',
    alt: 'Robot',
    category: [],
    public: true,
    allowed_ids: [],
    messages_generated: 73,
    featured: true,
    image_banner_url: '',
    image_thumbnail_url:
      'https://cdn.isaiahcreati.com/ai/6b52a42c-67e8-4260-ba74-8c418390fe81/GLaDOS.jpg',
    audio_sample_url:
      'https://cdn.isaiahcreati.com/ai/6b52a42c-67e8-4260-ba74-8c418390fe81/glados_demo.mp3',
    enabled: true,
    type: 'ai'
  },
  {
    uuid: 'b34836b9-5bfb-409c-8882-9e891a80c19b',
    model_id: '1XjVGWtO3cgb7O-5rehjpWL46CfjuYKJs',
    name: 'TikTok Female',
    alt: 'Human',
    category: [],
    public: true,
    allowed_ids: [],
    messages_generated: 1403,
    featured: true,
    image_banner_url: '',
    image_thumbnail_url:
      'https://cdn.isaiahcreati.com/ai/b34836b9-5bfb-409c-8882-9e891a80c19b/tiktok.png',
    audio_sample_url:
      'https://cdn.isaiahcreati.com/ai/b34836b9-5bfb-409c-8882-9e891a80c19b/Tiktok_female_demo.mp3',
    enabled: true,
    type: 'ai'
  }
]

interface VoiceProviderProps {
  children: ReactNode
}

export const VoiceProvider: React.FC<VoiceProviderProps> = ({ children }) => {
  const [voices, setVoices] = useState<AiVoiceSchema[]>(EnabledVoiceModels)

  const fetchVoices = async () => {
    if (voices.length > 0) return
    // const data = await fetcher<AiVoiceSchema[]>(
    //   'https://bot.isaiahcreati.com/api/resources/voices'
    // )
    // //@ts-ignore
    // setVoices(data.filter(voice => voice.type === 'ai'))
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
