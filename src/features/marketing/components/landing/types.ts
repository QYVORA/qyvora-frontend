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
