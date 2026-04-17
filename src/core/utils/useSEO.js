import { useEffect } from 'react'

const BASE = 'HSOCIETY OFFSEC'
const BASE_URL = 'https://hsocietyoffsec.netlify.app'
const DEFAULT_IMG = `${BASE_URL}/HSOCIETY_LOGO.webp`

export function useSEO({ title, description, path = '', image = DEFAULT_IMG } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${BASE}` : `${BASE} — Offensive Security Training Platform`
    const desc = description || 'Train like a hacker. Become a hacker. Africa\'s premier offensive security training platform.'
    const url = `${BASE_URL}${path}`

    document.title = fullTitle

    const set = (sel, attr, val) => {
      let el = document.querySelector(sel)
      if (!el) { el = document.createElement('meta'); document.head.appendChild(el) }
      el.setAttribute(attr, val)
    }

    set('meta[name="description"]', 'content', desc)
    set('meta[property="og:title"]', 'content', fullTitle)
    set('meta[property="og:description"]', 'content', desc)
    set('meta[property="og:url"]', 'content', url)
    set('meta[property="og:image"]', 'content', image)
    set('meta[name="twitter:title"]', 'content', fullTitle)
    set('meta[name="twitter:description"]', 'content', desc)
    set('meta[name="twitter:image"]', 'content', image)

    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
    canonical.href = url
  }, [title, description, path, image])
}
