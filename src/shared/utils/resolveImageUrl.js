import { API_ORIGIN } from '@/core/services/api'

export function resolveImageUrl(value) {
  const src = String(value || '').trim()
  if (!src) return ''
  if (src.startsWith('data:')) return src
  if (/^https?:\/\//i.test(src)) return src
  if (src.startsWith('//')) return `${window.location.protocol}${src}`
  if (src.startsWith('/')) return `${API_ORIGIN}${src}`
  return `${API_ORIGIN}/${src.replace(/^\/+/, '')}`
}
