export interface LegalSection {
  title: string;
  /** Compact label for the sticky on-page nav; falls back to `title`. */
  shortTitle?: string;
  body?: string;
  bullets: string[];
}

export interface LegalDocument {
  /** Used to build stable section anchors for the on-page nav. */
  slug: string;
  kicker: string;
  title: string;
  summary: string;
  effectiveDate: string;
  lastUpdated: string;
  jurisdiction: string;
  sections: LegalSection[];
}
