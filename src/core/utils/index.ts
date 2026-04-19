/**
 * Resolve an image URL from a relative backend path or return a fallback.
 */
export const resolveImageUrl = (value?: string, fallback = ''): string => {
  const src = String(value || '').trim();
  if (!src) return fallback;
  if (/^https?:\/\//i.test(src)) return src;
  const base = String(import.meta.env.VITE_API_BASE_URL || '').replace(/\/api\/?$/, '');
  return `${base}${src.startsWith('/') ? '' : '/'}${src}`;
};
