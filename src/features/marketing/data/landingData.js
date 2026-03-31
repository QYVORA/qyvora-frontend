import { Globe, Code2, Target, Zap, Unlock, Bug, Database, Shield } from 'lucide-react'

export const HERO_BG = '/images/hero-bakground/hero-background-imag.png'
export const PHASES_SECTION_BG = '/images/phases-background-image/phases-section-background.png'
export const CTA_BG = '/images/cta-setion-background/cta-background.png'
export const CP_COIN = '/icons/Cp-icon/cp-coin.png'
export const CP_MARKET_BG = '/images/cp-card-background/zeroday-maket-background.png'

export const FLOW_IMGS = [
  'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&q=75',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=75',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=75',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=75',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=75',
]

export const PHASE_IMGS = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=75',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&q=75',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=75',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=75',
  'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=600&q=75',
]

export const FLOW_STEPS = [
  { icon: Globe, label: 'Join', desc: 'Create your operator account', img: FLOW_IMGS[0] },
  { icon: Code2, label: 'Train', desc: 'Complete phased bootcamp modules', img: FLOW_IMGS[1] },
  { icon: Target, label: 'Validate', desc: 'Prove skills in live challenges', img: FLOW_IMGS[2] },
  { icon: Zap, label: 'Earn', desc: 'Collect CP for your progress', img: FLOW_IMGS[3] },
  { icon: Unlock, label: 'Unlock', desc: 'Access the Zero-Day Market', img: FLOW_IMGS[4] },
]

export const PHASE_ICONS = [Target, Code2, Bug, Database, Shield]
