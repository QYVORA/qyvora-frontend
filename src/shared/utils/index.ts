/**
 * Copy text to clipboard with a fallback for older browsers.
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Format a number with locale-aware thousands separators.
 */
export const formatNumber = (n: number): string => n.toLocaleString();

/**
 * Truncate a string to a max length with an ellipsis.
 */
export const truncate = (str: string, max = 80): string =>
  str.length > max ? `${str.slice(0, max)}…` : str;
