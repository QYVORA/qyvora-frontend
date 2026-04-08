import { Globe, Code2, Target, Zap, Unlock, Bug, Database, Shield } from 'lucide-react'

export const HERO_BG = '/images/hero-bakground/hero-background.webp'
export const PHASES_SECTION_BG = '/images/phases-background-image/phases-section-background.webp'
export const CTA_BG = '/images/cta-setion-background/cta-background.webp'
export const CP_COIN = '/icons/Cp-icon/cp-coin.webp'
export const CP_MARKET_BG = '/images/cp-card-background/zeroday-maket-background.webp'
export const HOW_IT_WORKS_IMGS = [
  '/images/how-it-works-section/Learners-Trained.webp',
  '/images/how-it-works-section/Pentesters-Active.webp',
  '/images/how-it-works-section/Engagements-4Completed.webp',
  '/images/how-it-works-section/Findings-Identified.webp',
]

export const FLOW_IMGS = [
  'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&q=75',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=75',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=75',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=75',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=75',
]

export const PHASE_IMGS = [
  '/images/Curriculum-images/phase1.webp',
  '/images/Curriculum-images/phase2.webp',
  '/images/Curriculum-images/phase3.webp',
  '/images/Curriculum-images/phase4.webp',
  '/images/Curriculum-images/phase5.webp',
]

export const PHASE_PREVIEW = [
  { id: 1, title: 'Phase 01 — Reconnaissance', status: 'in-progress', roomsCompleted: 4, roomsTotal: 8, progress: 50 },
  { id: 2, title: 'Phase 02 — Exploitation', status: 'next', roomsCompleted: 1, roomsTotal: 10, progress: 10 },
  { id: 3, title: 'Phase 03 — Post-Exploitation', status: 'locked', roomsCompleted: 0, roomsTotal: 9, progress: 0 },
  { id: 4, title: 'Phase 04 — Persistence', status: 'locked', roomsCompleted: 0, roomsTotal: 7, progress: 0 },
  { id: 5, title: 'Phase 05 — Zero-Day', status: 'locked', roomsCompleted: 0, roomsTotal: 6, progress: 0 },
]

export const FLOW_STEPS = [
  { icon: Globe, label: 'Join', desc: 'Create your operator account', img: FLOW_IMGS[0] },
  { icon: Code2, label: 'Train', desc: 'Complete phased bootcamp modules', img: FLOW_IMGS[1] },
  { icon: Target, label: 'Validate', desc: 'Prove skills in live challenges', img: FLOW_IMGS[2] },
  { icon: Zap, label: 'Earn', desc: 'Collect CP for your progress', img: FLOW_IMGS[3] },
  { icon: Unlock, label: 'Unlock', desc: 'Access the Zero-Day Market', img: FLOW_IMGS[4] },
]

export const PHASE_ICONS = [Target, Code2, Bug, Database, Shield]
