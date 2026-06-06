export interface BackendStats {
  stats?: {
    studentsCount?: number;
    learnersTrained?: number;
    bootcampsCount?: number;
    zeroDayProductsCount?: number;
    vulnerabilitiesIdentified?: number;
    pentestersActive?: number;
    totalCpEarned?: number;
  };
}

export interface Bootcamp {
  id: string;
  title: string;
  description?: string;
  level?: string;
  duration?: string;
  priceLabel?: string;
  image?: string;
}

export interface MarketplaceItem {
  id?: string;
  title: string;
  cpPrice?: number;
  coverUrl?: string;
}

export const PHASE_IMGS = [
  '/assets/bootcamp/rooms/hacker-mindset.webp',
  '/assets/bootcamp/rooms/linux-foundations.webp',
  '/assets/bootcamp/rooms/networking.webp',
  '/assets/bootcamp/rooms/web-and-backend-systems.webp',
  '/assets/bootcamp/rooms/social-engineering.webp',
];
