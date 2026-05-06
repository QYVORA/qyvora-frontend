export const RANKS = [
  { name: 'Candidate',   min: 0,    max: 149,      color: 'text-zinc-400'   },
  { name: 'Contributor', min: 150,  max: 449,      color: 'text-blue-400'   },
  { name: 'Specialist',  min: 450,  max: 899,      color: 'text-purple-400' },
  { name: 'Architect',   min: 900,  max: 1499,     color: 'text-amber-400'  },
  { name: 'Vanguard',    min: 1500, max: Infinity,  color: 'text-accent'     },
] as const;

export function getRankInfo(cp: number) {
  const rank = RANKS.find(r => cp >= r.min && cp <= r.max) ?? RANKS[0];
  const next = RANKS[RANKS.indexOf(rank as typeof RANKS[number]) + 1] ?? null;
  const progress = next ? Math.round(((cp - rank.min) / (next.min - rank.min)) * 100) : 100;
  return { rank, next, progress };
}
