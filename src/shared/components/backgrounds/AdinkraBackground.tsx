import React from 'react';

interface AdinkraBackgroundProps {
  /**
   * Overall opacity of the Adinkra symbols layer (0-1)
   * @default 0.18
   */
  opacity?: number;

  /**
   * Whether to include the ambient gradient blobs
   * @default true
   */
  includeGradients?: boolean;

  /**
   * Whether to include the dot grid pattern
   * @default true
   */
  includeDotGrid?: boolean;

  /**
   * Additional CSS classes for the container
   */
  className?: string;
}

/**
 * AdinkraBackground Component
 *
 * A reusable background component featuring authentic West African Adinkra symbols
 * from the Akan people of Ghana, combined with ambient gradient effects and a subtle
 * dot grid. Symbols are accurately drawn from traditional iconographic references.
 *
 * Adinkra symbols included:
 * - GYE NYAME        — "Except God"; supremacy of God (most iconic Adinkra symbol)
 * - SANKOFA          — "Go back and get it"; learning from the past (bird form)
 * - ADINKRAHENE      — Concentric circles; authority, leadership, charisma
 * - DWENNIMMEN       — Ram's horns; strength and humility
 * - NKYINKYIM        — "Twisting"; adaptability, initiative, dynamism
 * - NSOROMMA         — 8-pointed star; faithfulness, guardianship
 * - AYA              — Fern frond; endurance, resourcefulness
 * - AKOMA            — Heart; patience and tolerance
 */

/* ─────────────────────────────────────────────
   SYMBOL COMPONENTS (100×100 viewBox each)
───────────────────────────────────────────── */

/**
 * GYE NYAME — The most widely recognised Adinkra symbol.
 * Bilaterally symmetric "butterfly-wing" form: a vertical central spine with a
 * short crossbar at top and bottom, two large sweeping wing arcs meeting at the
 * centre, and two smaller crescent lobes below. Appears on Ghana's 200-cedi note.
 */
const GyeNyame: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Vertical spine */}
    <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    {/* Top finial bar */}
    <line x1="42" y1="14" x2="58" y2="14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    {/* Bottom finial bar */}
    <line x1="42" y1="86" x2="58" y2="86" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    {/* Left upper wing */}
    <path d="M50 28 C40 26 18 28 12 42 C8 54 22 64 50 60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Right upper wing */}
    <path d="M50 28 C60 26 82 28 88 42 C92 54 78 64 50 60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Horizontal midbar */}
    <line x1="18" y1="46" x2="82" y2="46" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    {/* Left lower lobe */}
    <path d="M50 60 C38 60 20 66 22 76 C24 84 38 82 50 78" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Right lower lobe */}
    <path d="M50 60 C62 60 80 66 78 76 C76 84 62 82 50 78" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

/**
 * SANKOFA (bird form) — A stylised bird body facing forward, neck curving
 * backward so the head and beak point rearward. A small egg sits on the back.
 * Represents the wisdom of learning from the past to build the future.
 */
const Sankofa: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body */}
    <ellipse cx="50" cy="64" rx="22" ry="15" stroke="currentColor" strokeWidth="3" />
    {/* Neck curving backward */}
    <path d="M34 52 C28 42 26 30 36 24 C44 19 54 23 58 34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Beak pointing left/back */}
    <path d="M36 24 C30 20 20 20 18 27" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Eye */}
    <circle cx="34" cy="24" r="2.5" fill="currentColor" />
    {/* Egg on back */}
    <ellipse cx="58" cy="48" rx="5" ry="6.5" stroke="currentColor" strokeWidth="2.5" />
    {/* Tail feathers */}
    <path d="M72 62 C80 57 88 61 84 68" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M72 67 C82 63 90 69 86 76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* Left leg + foot */}
    <line x1="42" y1="78" x2="38" y2="90" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="38" y1="90" x2="32" y2="90" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="38" y1="90" x2="38" y2="95" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* Right leg + foot */}
    <line x1="58" y1="78" x2="62" y2="90" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="62" y1="90" x2="56" y2="90" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="62" y1="90" x2="66" y2="95" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * ADINKRAHENE — "King of the Adinkra symbols". Three concentric circles with a
 * filled centre dot. Said to have inspired the design of all other Adinkra symbols.
 * Represents authority, leadership, and charisma.
 */
const Adinkrahene: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="3" />
    <circle cx="50" cy="50" r="26" stroke="currentColor" strokeWidth="3" />
    <circle cx="50" cy="50" r="12" stroke="currentColor" strokeWidth="3" />
    <circle cx="50" cy="50" r="4" fill="currentColor" />
  </svg>
);

/**
 * DWENNIMMEN — Ram's horns. Two pairs of mirrored S-curve spiral horns radiating
 * from a central knot: one pair pointing up, one down. Each horn sweeps outward
 * then curls back inward. Represents strength paired with humility.
 */
const Dwennimmen: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Top-left horn */}
    <path d="M50 50 C50 38 42 22 30 20 C18 18 12 28 18 38 C22 44 32 44 38 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Top-right horn */}
    <path d="M50 50 C50 38 58 22 70 20 C82 18 88 28 82 38 C78 44 68 44 62 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Bottom-left horn */}
    <path d="M50 50 C50 62 42 78 30 80 C18 82 12 72 18 62 C22 56 32 56 38 60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Bottom-right horn */}
    <path d="M50 50 C50 62 58 78 70 80 C82 82 88 72 82 62 C78 56 68 56 62 60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Central knot */}
    <circle cx="50" cy="50" r="5" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);

/**
 * NKYINKYIM — "Twisting". A diagonal cross form where each arm ends in a reversed
 * hook, creating dynamic rotational energy. Represents adaptability and initiative.
 */
const Nkyinkyim: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Top arm hooks right */}
    <path d="M50 50 C50 42 46 30 40 24 C36 20 34 24 38 30 C40 33 46 36 50 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Right arm hooks down */}
    <path d="M50 50 C58 50 70 46 76 40 C80 36 76 34 70 38 C67 40 65 46 70 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Bottom arm hooks left */}
    <path d="M50 50 C50 58 54 70 60 76 C64 80 66 76 62 70 C59 67 54 66 50 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Left arm hooks up */}
    <path d="M50 50 C42 50 30 54 24 60 C20 64 24 66 30 62 C33 59 34 54 30 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Central node */}
    <circle cx="50" cy="50" r="4.5" fill="currentColor" />
  </svg>
);

/**
 * NSOROMMA — "Child of the heavens / Star". An 8-pointed star: 4 long cardinal
 * diamond points + 4 shorter diagonal lines, all meeting at a central circle.
 * Represents guardianship, faithfulness, and service to others.
 */
const Nsoromma: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 4 main diamond points */}
    <path d="M50 8 L54 42 L50 92 L46 58 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
    <path d="M8 50 L42 46 L92 50 L58 54 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
    {/* 4 shorter diagonal arms */}
    <line x1="72" y1="28" x2="57" y2="43" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="72" y1="72" x2="57" y2="57" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="28" y1="72" x2="43" y2="57" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="28" y1="28" x2="43" y2="43" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    {/* Centre circle */}
    <circle cx="50" cy="50" r="7" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);

/**
 * AYA — Fern frond. A straight central stem with 4 pairs of curved leaf fronds
 * branching symmetrically left and right, each arcing outward then back toward
 * the stem tip. Represents endurance and resourcefulness ("I am not afraid of you").
 */
const Aya: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Central stem */}
    <line x1="50" y1="90" x2="50" y2="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    {/* Frond pair 1 — bottom */}
    <path d="M50 80 C44 74 30 76 26 68 C22 60 34 56 50 64" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M50 80 C56 74 70 76 74 68 C78 60 66 56 50 64" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Frond pair 2 */}
    <path d="M50 66 C44 60 28 62 24 54 C20 46 34 42 50 50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M50 66 C56 60 72 62 76 54 C80 46 66 42 50 50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Frond pair 3 */}
    <path d="M50 52 C44 46 30 48 26 40 C22 32 36 28 50 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M50 52 C56 46 70 48 74 40 C78 32 64 28 50 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Frond pair 4 — top, smaller */}
    <path d="M50 36 C46 32 38 32 36 26 C34 20 42 18 50 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M50 36 C54 32 62 32 64 26 C66 20 58 18 50 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

/**
 * AKOMA — Heart. A classic pointed heart silhouette with a small cross above it,
 * as depicted in traditional Adinkra. Represents patience, tolerance, and goodwill.
 */
const Akoma: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M50 84 C50 84 14 58 14 36 C14 22 24 14 36 16 C42 17 48 22 50 29 C52 22 58 17 64 16 C76 14 86 22 86 36 C86 58 50 84 50 84 Z"
      stroke="currentColor" strokeWidth="3" strokeLinejoin="round"
    />
    {/* Cross above */}
    <line x1="50" y1="6" x2="50" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="45" y1="11" x2="55" y2="11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/* ─────────────────────────────────────────────
   PLACEMENT MAP
   Covers all quadrants with varied sizes for
   visual depth. Uses pixel sizes + percentage
   positions so it works in any height container.
───────────────────────────────────────────── */
interface Placement {
  Symbol: React.FC<{ className?: string }>;
  style: React.CSSProperties;
  symOpacity: number;
  label: string;
}

const PLACEMENTS: Placement[] = [
  // ── Large background anchors (one per quadrant) ──────────────
  {
    Symbol: GyeNyame,
    style: { top: '6%', left: '5%', width: 112, height: 112, transform: 'rotate(-6deg)' },
    symOpacity: 0.55,
    label: 'gye-nyame-tl',
  },
  {
    Symbol: Adinkrahene,
    style: { bottom: '7%', right: '5%', width: 120, height: 120 },
    symOpacity: 0.45,
    label: 'adinkrahene-br',
  },
  {
    Symbol: Dwennimmen,
    style: { top: '10%', right: '7%', width: 104, height: 104, transform: 'rotate(10deg)' },
    symOpacity: 0.50,
    label: 'dwennimmen-tr',
  },
  {
    Symbol: Aya,
    style: { bottom: '6%', left: '8%', width: 96, height: 96, transform: 'rotate(5deg)' },
    symOpacity: 0.48,
    label: 'aya-bl',
  },

  // ── Medium mid-layer ──────────────────────────────────────────
  {
    Symbol: Sankofa,
    style: { top: '40%', left: '2%', width: 80, height: 80, transform: 'rotate(8deg)' },
    symOpacity: 0.45,
    label: 'sankofa-ml',
  },
  {
    Symbol: Nkyinkyim,
    style: { top: '22%', right: '20%', width: 72, height: 72, transform: 'rotate(-12deg)' },
    symOpacity: 0.40,
    label: 'nkyinkyim-tm',
  },
  {
    Symbol: Akoma,
    style: { bottom: '26%', right: '3%', width: 80, height: 80, transform: 'rotate(-5deg)' },
    symOpacity: 0.45,
    label: 'akoma-mr',
  },
  {
    Symbol: Nsoromma,
    style: { bottom: '30%', left: '26%', width: 68, height: 68, transform: 'rotate(15deg)' },
    symOpacity: 0.38,
    label: 'nsoromma-bml',
  },

  // ── Small accent pieces ───────────────────────────────────────
  {
    Symbol: GyeNyame,
    style: { top: '58%', right: '12%', width: 52, height: 52, transform: 'rotate(18deg)' },
    symOpacity: 0.30,
    label: 'gye-nyame-sm1',
  },
  {
    Symbol: Adinkrahene,
    style: { top: '16%', left: '38%', width: 48, height: 48 },
    symOpacity: 0.28,
    label: 'adinkrahene-sm',
  },
  {
    Symbol: Nsoromma,
    style: { top: '7%', right: '30%', width: 44, height: 44, transform: 'rotate(22deg)' },
    symOpacity: 0.28,
    label: 'nsoromma-sm',
  },
  {
    Symbol: Aya,
    style: { top: '72%', right: '28%', width: 52, height: 52, transform: 'rotate(-8deg)' },
    symOpacity: 0.28,
    label: 'aya-sm',
  },
  {
    Symbol: Dwennimmen,
    style: { bottom: '16%', left: '46%', width: 56, height: 56, transform: 'rotate(-15deg)' },
    symOpacity: 0.28,
    label: 'dwennimmen-sm',
  },
  {
    Symbol: Sankofa,
    style: { top: '82%', left: '58%', width: 44, height: 44, transform: 'rotate(12deg)' },
    symOpacity: 0.25,
    label: 'sankofa-sm',
  },
];

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
const AdinkraBackground: React.FC<AdinkraBackgroundProps> = ({
  opacity = 0.18,
  includeGradients = true,
  includeDotGrid = true,
  className = '',
}) => {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Dot Grid */}
      {includeDotGrid && (
        <div className="absolute inset-0 dot-grid opacity-[0.04]" />
      )}

      {/* Ambient gradient orbs */}
      {includeGradients && (
        <>
          <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-accent/[0.03] rounded-full blur-[120px]" />
          <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-accent/[0.04] rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/[0.02] rounded-full blur-[80px]" />
        </>
      )}

      {/* Adinkra symbols layer */}
      <div className="absolute inset-0 text-accent" style={{ opacity }}>
        {PLACEMENTS.map(({ Symbol, style, symOpacity, label }) => (
          <div
            key={label}
            className="absolute"
            style={{ ...style, opacity: symOpacity }}
          >
            <Symbol className="w-full h-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdinkraBackground;