/**
 * formatNumber
 * ─────────────────────────────────────────────────────────────────────────────
 * Formats numbers with abbreviations for thousands (K), millions (M), billions (B).
 * 
 * Examples:
 * - 150 → "150"
 * - 1,500 → "1.5K"
 * - 20,000 → "20K"
 * - 1,500,000 → "1.5M"
 * - 1,500,000,000 → "1.5B"
 */
export function formatNumber(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return '0';
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1_000_000_000) {
    // Billions
    const formatted = (absValue / 1_000_000_000).toFixed(1);
    return `${sign}${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}B`;
  }
  
  if (absValue >= 1_000_000) {
    // Millions
    const formatted = (absValue / 1_000_000).toFixed(1);
    return `${sign}${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}M`;
  }
  
  if (absValue >= 1_000) {
    // Thousands
    const formatted = (absValue / 1_000).toFixed(1);
    return `${sign}${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}K`;
  }
  
  return `${sign}${absValue}`;
}
