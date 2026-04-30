export const resolveImg = (value?: string, fallback = '') => {
  const src = String(value || '').trim();
  if (!src) return fallback;
  if (/^(blob:|data:)/i.test(src)) return src;
  if (/^https?:\/\//i.test(src)) return src;

  // Public-folder assets — served by the frontend, no API prefix needed
  if (
    src.startsWith('/images/')
    || src.startsWith('/assets/')
    || src.startsWith('/walkthrough/')
    || src.startsWith('/public/')
  ) return src;

  // Any other root-relative path that isn't an upload — treat as a local public asset
  if (src.startsWith('/') && !src.startsWith('/uploads/')) return src;

  const apiBase = String(import.meta.env.VITE_API_BASE_URL || '').trim();

  if (src.startsWith('/uploads/')) {
    if (/^https?:\/\//i.test(apiBase)) {
      const origin = apiBase.replace(/\/api\/?$/, '');
      return `${origin}${src}`;
    }
    if (apiBase.startsWith('/api')) {
      return `/api${src}`;
    }
    return src;
  }

  const base = apiBase.replace(/\/api\/?$/, '');
  return `${base}${src.startsWith('/') ? '' : '/'}${src}`;
};
