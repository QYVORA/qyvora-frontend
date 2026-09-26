import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useCopyToClipboard — copies text and reports success for `resetMs`.
 *
 * Returns `false` from `copy` (without flipping state) when the Clipboard API
 * is unavailable, e.g. on a non-secure origin.
 */
export const useCopyToClipboard = (resetMs = 1600) => {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timeout.current), []);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        return false;
      }
      setCopied(true);
      window.clearTimeout(timeout.current);
      timeout.current = window.setTimeout(() => setCopied(false), resetMs);
      return true;
    },
    [resetMs],
  );

  return { copied, copy };
};
