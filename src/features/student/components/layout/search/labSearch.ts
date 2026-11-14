import type { UnifiedLab } from '@/features/student/data/labs';

const scoreLab = (lab: UnifiedLab, tokens: string[]): number | null => {
  const title = lab.title.toLowerCase();
  const description = lab.description.toLowerCase();
  const tags = lab.tags.join(' ').toLowerCase();
  const difficulty = (lab.difficulty ?? '').toLowerCase();
  const format = lab.format.toLowerCase();
  const haystack = `${title} ${description} ${tags} ${difficulty} ${format}`;

  let score = 0;

  for (const token of tokens) {
    if (!haystack.includes(token)) return null;

    if (title === token) score += 12;
    else if (title.startsWith(token)) score += 8;
    else if (title.includes(token)) score += 5;
    else if (tags.includes(token)) score += 3;
    else if (difficulty.includes(token)) score += 2;
    else score += 1;
  }

  if (lab.source === 'practical') score += 1;
  if (lab.isNew) score += 1;

  return score;
};

/**
 * Rank the unified Lab catalogue against a free-text query.
 *
 * Matches title, description, tags, difficulty and delivery format. An empty
 * query returns the discovery set (the first `limit` Labs) rather than an
 * artificial "popular" list.
 */
export function searchLabs(entries: UnifiedLab[], query: string, limit = 8): UnifiedLab[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return entries.slice(0, limit);

  const tokens = trimmed.split(/\s+/);

  return entries
    .map((lab) => ({ lab, score: scoreLab(lab, tokens) }))
    .filter((result): result is { lab: UnifiedLab; score: number } => result.score !== null)
    .sort((a, b) => b.score - a.score || a.lab.title.localeCompare(b.lab.title))
    .slice(0, limit)
    .map((result) => result.lab);
}
