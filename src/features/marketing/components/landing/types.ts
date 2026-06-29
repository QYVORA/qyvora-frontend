export interface BackendStats {
  stats?: {
    studentsCount?: number;
    learnersTrained?: number;
    bootcampsCount?: number;
    zeroDayProductsCount?: number;
    vulnerabilitiesIdentified?: number;
    cpPoolSize?: number;
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

import phaseOneImg from '@/assets/bootcamp/rooms/phaseOne.webp';
import phaseTwoImg from '@/assets/bootcamp/rooms/phaseTwo.webp';
import phaseThreeImg from '@/assets/bootcamp/rooms/phaseThree.webp';
import phaseFourImg from '@/assets/bootcamp/rooms/phaseFour.webp';
import phaseFiveImg from '@/assets/bootcamp/rooms/phaseFive.webp';

export const PHASE_IMGS = [
  phaseOneImg,
  phaseTwoImg,
  phaseThreeImg,
  phaseFourImg,
  phaseFiveImg,
];
