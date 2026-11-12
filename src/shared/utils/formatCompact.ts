/**
 * formatCompact
 * ─────────────────────────────────────────────────────────────────────────────
 * Formats numbers for compact display in stat cards.
 * 
 * Rules:
 * - Under 1,000: plain number (e.g., 365)
 * - 1,000 to 99,999: thousands separator (e.g., 6,037)
 * - 100,000 to 999,999: one decimal + "k" (e.g., 124.5k)
 * - 1,000,000+: one decimal + "M" (e.g., 1.2M)
 * 
 * Never shrinks below readable size; callers should use fluid font sizing
 * with clamp(14px, 4.4vw, 18px) and tabular-nums.
 */
export function formatCompact(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return '-';
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1_000_000) {
    const formatted = (absValue / 1_000_000).toFixed(1);
    return `${sign}${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}M`;
  }
  
  if (absValue >= 100_000) {
    const formatted = (absValue / 1_000).toFixed(1);
    return `${sign}${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}k`;
  }
  
  if (absValue >= 1_000) {
    return `${sign}${absValue.toLocaleString()}`;
  }
  
  return `${sign}${absValue}`;
}