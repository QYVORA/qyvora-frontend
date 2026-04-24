export const resolveImg = (value?: string, fallback = ''): string => {
  const src = String(value || '').trim();
  if (!src) return fallback;
  if (/^(blob:|data:)/i.test(src)) return src;
  if (/^https?:\/\//i.test(src)) return src;
  const apiBase = String(import.meta.env.VITE_API_BASE_URL || '').trim();
  if (src.startsWith('/uploads/')) {
    if (/^https?:\/\//i.test(apiBase)) return `${apiBase.replace(/\/api\/?$/, '')}${src}`;
    if (apiBase.startsWith('/api')) return `/api${src}`;
  }
  const base = apiBase.replace(/\/api\/?$/, '');
  return `${base}${src.startsWith('/') ? '' : '/'}${src}`;
};
