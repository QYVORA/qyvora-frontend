import { Youtube, Twitter, Linkedin, MessageCircle } from 'lucide-react'

export const SOCIAL_MEDIA = [
  {
    key: 'youtube',
    label: 'YouTube',
    handle: '@hsocietyoffsec',
    url: 'https://www.youtube.com/@hsocietyoffsec',
    icon: Youtube,
    description: 'Video drops, walkthroughs, and live ops.',
  },
  {
    key: 'x',
    label: 'X',
    handle: '@hsocietyoffsec',
    url: 'https://x.com/hsocietyoffsec',
    icon: Twitter,
    description: 'Ops updates, alerts, and announcements.',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    handle: 'HSOCIETY OFFSEC',
    url: 'https://www.linkedin.com/company/hsociety-offsec/',
    icon: Linkedin,
    description: 'Company updates and operator wins.',
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    handle: 'HSOCIETY OFFSEC',
    url: 'https://chat.whatsapp.com/Ja8pR0FZQAI2pceGjQpji5',
    icon: MessageCircle,
    description: 'Join the community briefing room.',
  },
]
