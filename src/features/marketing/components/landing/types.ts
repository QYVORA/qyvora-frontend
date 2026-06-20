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
  '/assets/bootcamp/rooms/phaseOne.webp',
  '/assets/bootcamp/rooms/phaseTwo.webp',
  '/assets/bootcamp/rooms/phaseThree.webp',
  '/assets/bootcamp/rooms/phaseFour.webp',
  '/assets/bootcamp/rooms/phaseFive.webp',
];
