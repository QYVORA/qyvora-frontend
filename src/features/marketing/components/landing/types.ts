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
  '/images/Curriculum-images/phase1.webp',
  '/images/Curriculum-images/phase2.webp',
  '/images/Curriculum-images/phase3.webp',
  '/images/Curriculum-images/phase4.webp',
  '/images/Curriculum-images/phase5.webp',
];
