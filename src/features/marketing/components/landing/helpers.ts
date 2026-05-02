// Re-export the canonical resolveImg so all landing components use the same logic.
// The local copy previously had a bug that prepended /api to /uploads/ paths,
// causing 404s in dev where Vite proxies /uploads directly (no /api prefix).
export { resolveImg } from '../../../../shared/utils/resolveImg';
