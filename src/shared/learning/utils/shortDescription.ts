const SENTENCE_END = /[.!?](?=\s|$)/;

/**
 * Condense a Lab description into a single card-friendly line.
 *
 * Uses the first sentence when it fits, otherwise trims on a word boundary
 * and appends an ellipsis. Full descriptions stay available on detail pages.
 */
export function shortDescription(text: string | undefined, maxLength = 110): string {
  if (!text) return '';

  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return '';
  if (cleaned.length <= maxLength) return cleaned;

  const firstSentence = cleaned.match(/^.*?[.!?](?=\s|$)/)?.[0]?.trim();
  if (firstSentence && firstSentence.length <= maxLength) return firstSentence;

  const clipped = cleaned.slice(0, Math.max(1, maxLength - 1));
  const lastSpace = clipped.lastIndexOf(' ');
  const cut = lastSpace >= Math.floor(maxLength * 0.6) ? clipped.slice(0, lastSpace) : clipped;

  return `${cut.replace(/[.,;:!?\-–—]+$/, '').trimEnd()}…`;
}
