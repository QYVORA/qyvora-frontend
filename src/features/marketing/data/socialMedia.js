import { Twitter, Linkedin, MessageCircle } from 'lucide-react'
import { SOCIAL_LINKS } from '@/features/marketing/data/siteConfig'

const ICONS_BY_KEY = {
  x: Twitter,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
}

export const SOCIAL_MEDIA = SOCIAL_LINKS.map((item) => ({
  ...item,
  icon: ICONS_BY_KEY[item.key] || Twitter,
}))
