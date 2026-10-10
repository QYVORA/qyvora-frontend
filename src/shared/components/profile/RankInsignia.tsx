import React from 'react';

export type RankTier = 'Candidate' | 'Contributor' | 'Specialist' | 'Architect' | 'Vanguard';

export interface RankInfo {
  tier: RankTier;
  label: string;
  minPoints: number;
  description: string;
}

export const RANK_TIERS: Record<RankTier, RankInfo> = {
  Candidate: {
    tier: 'Candidate',
    label: 'Candidate',
    minPoints: 0,
    description: 'Entry-level operator initializing security foundations.',
  },
  Contributor: {
    tier: 'Contributor',
    label: 'Contributor',
    minPoints: 3000,
    description: 'Active learner demonstrating consistent problem-solving capability.',
  },
  Specialist: {
    tier: 'Specialist',
    label: 'Specialist',
    minPoints: 5000,
    description: 'Skilled practitioner with proven attack vector proficiency.',
  },
  Architect: {
    tier: 'Architect',
    label: 'Architect',
    minPoints: 9000,
    description: 'Advanced analyst mastering comprehensive offensive operations.',
  },
  Vanguard: {
    tier: 'Vanguard',
    label: 'Vanguard',
    minPoints: 17000,
    description: 'Elite operator holding mastery across all cyber domains.',
  },
};

/**
 * Normalizes any string rank from the backend to a known RankTier.
 */
export function normalizeRank(rank?: string): RankTier {
  if (!rank) return 'Candidate';
  const clean = rank.trim().toLowerCase();
  if (clean.includes('vanguard')) return 'Vanguard';
  if (clean.includes('architect')) return 'Architect';
  if (clean.includes('specialist')) return 'Specialist';
  if (clean.includes('contributor')) return 'Contributor';
  if (clean.includes('candidate')) return 'Candidate';
  return 'Candidate';
}

/* ──────────────────────────────────────────────────────────────────────────
 * 1. CANDIDATE INSIGNIA
 * Minimalist diamond-core chevron. Single crisp angled vector with central
 * pulse node. Clean, restrained geometry.
 * ────────────────────────────────────────────────────────────────────────── */
export const CandidateInsignia: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Candidate rank insignia"
  >
    {/* Outer guide shield line */}
    <path
      d="M24 4L38 12V24C38 33 24 44 24 44C24 44 10 33 10 24V12L24 4Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text-muted/40"
    />
    {/* Primary chevron */}
    <path
      d="M17 21L24 27L31 21"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text-secondary"
    />
    {/* Core node */}
    <circle cx="24" cy="16" r="2.5" fill="currentColor" className="text-accent" />
  </svg>
);

/* ──────────────────────────────────────────────────────────────────────────
 * 2. CONTRIBUTOR INSIGNIA
 * Dual nested chevrons with fortified node and flanking alignment marks.
 * ────────────────────────────────────────────────────────────────────────── */
export const ContributorInsignia: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Contributor rank insignia"
  >
    {/* Shield boundary */}
    <path
      d="M24 4L40 12V24C40 33.5 24 44 24 44C24 44 8 33.5 8 24V12L24 4Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text-muted/50"
    />
    {/* Lower chevron */}
    <path
      d="M16 26L24 32L32 26"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-accent"
    />
    {/* Upper chevron */}
    <path
      d="M17 19L24 24.5L31 19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text-primary"
    />
    {/* Alignment pips */}
    <circle cx="24" cy="12" r="2" fill="currentColor" className="text-accent" />
    <circle cx="12" cy="24" r="1.2" fill="currentColor" className="text-text-muted" />
    <circle cx="36" cy="24" r="1.2" fill="currentColor" className="text-text-muted" />
  </svg>
);

/* ──────────────────────────────────────────────────────────────────────────
 * 3. SPECIALIST INSIGNIA
 * Hexagonal tactical reticle / shield matrix with tri-blade chevrons and
 * target crosshair core.
 * ────────────────────────────────────────────────────────────────────────── */
export const SpecialistInsignia: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Specialist rank insignia"
  >
    {/* Outer hexagonal crest */}
    <path
      d="M24 3L41 12.8V32.2L24 42L7 32.2V12.8L24 3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      className="text-text-muted/60"
    />
    {/* Inner chevron stack */}
    <path
      d="M14 27L24 34L34 27"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-accent"
    />
    <path
      d="M16 20.5L24 26.5L32 20.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text-primary"
    />
    <path
      d="M18 14.5L24 19.5L30 14.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text-muted"
    />
    {/* Center target node */}
    <circle cx="24" cy="9.5" r="2" fill="currentColor" className="text-accent" />
    {/* Cardinal ticks */}
    <line x1="4" y1="22.5" x2="8" y2="22.5" stroke="currentColor" strokeWidth="1.5" className="text-accent" />
    <line x1="40" y1="22.5" x2="44" y2="22.5" stroke="currentColor" strokeWidth="1.5" className="text-accent" />
  </svg>
);

/* ──────────────────────────────────────────────────────────────────────────
 * 4. ARCHITECT INSIGNIA
 * Octagonal cyber-lattice crest with interlocking diamond geometry,
 * triple chevron arrays, and vector anchors.
 * ────────────────────────────────────────────────────────────────────────── */
export const ArchitectInsignia: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Architect rank insignia"
  >
    {/* Outer octagonal shield */}
    <path
      d="M15 3H33L44 14V32L33 43H15L4 32V14L15 3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      className="text-accent/60"
    />
    {/* Inner lattice diamond */}
    <path
      d="M24 8L36 20L24 32L12 20L24 8Z"
      stroke="currentColor"
      strokeWidth="1"
      strokeDasharray="2 2"
      className="text-text-muted"
    />
    {/* Heavy base chevron */}
    <path
      d="M13 29L24 37L35 29"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-accent"
    />
    {/* Mid chevron */}
    <path
      d="M16 23L24 29.5L32 23"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text-primary"
    />
    {/* Diamond apex core */}
    <polygon points="24,12 28,17 24,22 20,17" fill="currentColor" className="text-accent" />
    <circle cx="24" cy="17" r="1.5" fill="#000000" />
  </svg>
);

/* ──────────────────────────────────────────────────────────────────────────
 * 5. VANGUARD INSIGNIA
 * Apex cyber aegis crest with radiant crown facets, internal core prism,
 * and dual flanking kinetic vectors.
 * ────────────────────────────────────────────────────────────────────────── */
export const VanguardInsignia: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Vanguard rank insignia"
  >
    {/* Outer crest wings */}
    <path
      d="M24 2L42 10V22C42 34 24 46 24 46C24 46 6 34 6 22V10L24 2Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-accent"
    />
    {/* Crown facets */}
    <path
      d="M13 14L24 7L35 14L24 18L13 14Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="currentColor"
      className="text-accent/20 stroke-accent"
    />
    {/* Apex chevron */}
    <path
      d="M12 32L24 40L36 32"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-accent"
    />
    <path
      d="M15 26L24 33L33 26"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text-primary"
    />
    <path
      d="M18 20L24 25L30 20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-accent"
    />
    {/* Vanguard radiant prism node */}
    <circle cx="24" cy="12.5" r="2.5" fill="currentColor" className="text-accent" />
    <circle cx="24" cy="12.5" r="4.5" stroke="currentColor" strokeWidth="0.8" className="text-accent/60" />
  </svg>
);

/* ──────────────────────────────────────────────────────────────────────────
 * Fallback insignia
 * ────────────────────────────────────────────────────────────────────────── */
export const UnknownRankInsignia: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <CandidateInsignia className={className} />
);

export const RANK_INSIGNIA_MAP: Record<RankTier, React.FC<{ className?: string }>> = {
  Candidate: CandidateInsignia,
  Contributor: ContributorInsignia,
  Specialist: SpecialistInsignia,
  Architect: ArchitectInsignia,
  Vanguard: VanguardInsignia,
};

interface RankInsigniaProps {
  rank?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

const SIZE_CLASSES = {
  xs: 'w-4 h-4',
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10',
};

export const RankInsignia: React.FC<RankInsigniaProps> = ({
  rank,
  className = '',
  size = 'md',
  showLabel = false,
}) => {
  const tier = normalizeRank(rank);
  const InsigniaComponent = RANK_INSIGNIA_MAP[tier] || UnknownRankInsignia;
  const sizeCls = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  if (!showLabel) {
    return <InsigniaComponent className={`${sizeCls} ${className}`} />;
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <InsigniaComponent className={sizeCls} />
      <span className="font-mono text-xs font-black uppercase tracking-wider text-text-primary">
        {tier}
      </span>
    </div>
  );
};

export default RankInsignia;
