export interface BackendStats {
  stats?: {
    studentsCount?: number;
    learnersTrained?: number;
    bootcampsCount?: number;
    zeroDayProductsCount?: number;
    vulnerabilitiesIdentified?: number;
    pentestersActive?: number;
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

export interface LeaderboardEntry {
  handle?: string;
  name?: string;
  totalXp?: number;
  rank?: string;
  avatarUrl?: string;
}

export interface MarketplaceItem {
  id?: string;
  title: string;
  cpPrice?: number;
  coverUrl?: string;
}

export const PHASE_IMGS = [
  '/assets/sections/curriculum/phase-01.webp',
  '/assets/sections/curriculum/phase-02.webp',
  '/assets/sections/curriculum/phase-03.webp',
  '/assets/sections/curriculum/phase-04.webp',
  '/assets/sections/curriculum/phase-05.webp',
];
