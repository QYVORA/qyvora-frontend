import type { ComponentType } from 'react';
import {
  BrandWhatsAppIcon,
  BrandLinkedinIcon,
  BrandYoutubeIcon,
  BrandGithubIcon,
  BrandXIcon,
  BrandMediumIcon,
  BrandTikTokIcon,
} from '@/shared/components/icons';

export interface SocialLink {
  key: string;
  label: string;
  href: string;
  Icon: ComponentType<{ className?: string }>;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { key: 'x',        label: 'X',        href: 'https://x.com/qyvorasec',                Icon: BrandXIcon },
  { key: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/company/qyvora',    Icon: BrandLinkedinIcon },
  { key: 'github',   label: 'GitHub',   href: 'https://github.com/QYVORA',             Icon: BrandGithubIcon },
  { key: 'youtube',  label: 'YouTube',  href: 'https://www.youtube.com/@QYVORASEC',     Icon: BrandYoutubeIcon },
  { key: 'medium',   label: 'Medium',   href: 'https://medium.com/@qyvorasec',         Icon: BrandMediumIcon },
  { key: 'tiktok',   label: 'TikTok',   href: 'https://www.tiktok.com/@qyvorasecurity', Icon: BrandTikTokIcon },
  { key: 'whatsapp', label: 'WhatsApp', href: 'https://whatsapp.com/channel/0029Vb8Aw6L5EjxzLY6L2m1V', Icon: BrandWhatsAppIcon },
];
