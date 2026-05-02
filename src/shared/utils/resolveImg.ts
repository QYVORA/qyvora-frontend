export const resolveImg = (value?: string, fallback = ''): string => {
  const src = String(value || '').trim();
  if (!src) return fallback;
  if (/^(blob:|data:)/i.test(src)) return src;

  const apiBase = String(import.meta.env.VITE_API_BASE_URL || '').trim();
  const isDev = apiBase.startsWith('/api') || apiBase === '/api';

  // Absolute URL — in dev, rewrite production backend URLs to go through the local proxy
  if (/^https?:\/\//i.test(src)) {
    if (isDev) {
      // Extract the path portion and let Vite proxy handle it
      try {
        const url = new URL(src);
        const pathPart = url.pathname;
        // Only rewrite backend upload paths
        if (pathPart.startsWith('/uploads/')) return pathPart;
      } catch { /* fall through */ }
    }
    return src;
  }

  // Public-folder assets — served by the frontend, no API prefix needed
  if (
    src.startsWith('/images/')
    || src.startsWith('/assets/')
    || src.startsWith('/walkthrough/')
    || src.startsWith('/public/')
  ) return src;

  // Any other root-relative path that isn't an upload — treat as a local public asset
  if (src.startsWith('/') && !src.startsWith('/uploads/')) return src;

  // Backend-uploaded assets (e.g. /uploads/...) — served directly from the backend
  // origin WITHOUT the /api prefix (Express registers these routes outside /api)
  if (src.startsWith('/uploads/')) {
    // Absolute backend URL (e.g. http://localhost:3000/api) → strip /api suffix
    if (/^https?:\/\//i.test(apiBase)) return `${apiBase.replace(/\/api\/?$/, '')}${src}`;
    // Relative /api proxy in dev → strip /api so Vite proxy forwards to backend root
    if (apiBase.startsWith('/api')) return src;
    return src;
  }

  // Anything else — prepend backend base
  const base = apiBase.replace(/\/api\/?$/, '');
  return `${base}${src.startsWith('/') ? '' : '/'}${src}`;
};
