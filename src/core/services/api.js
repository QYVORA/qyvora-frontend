import axios from 'axios'

const ENV_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL
const RENDER_BASE_URL = 'https://hsociety-backend.onrender.com/api'
const DEFAULT_BASE_URL = import.meta.env.DEV ? 'http://localhost:3000/api' : RENDER_BASE_URL

const isLocalhostUrl = (value) => {
  const src = String(value || '').trim()
  if (!src) return false
  return /(^|\/\/)(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?(\/|$)/i.test(src)
}

const normalizeBaseUrl = (value) => {
  if (!value) return value
  const trimmed = String(value).replace(/\/+$/, '')
  if (/\/api(\/|$)/.test(trimmed)) return trimmed
  return `${trimmed}/api`
}

const resolveBaseUrl = () => {
  if (!ENV_BASE_URL) return DEFAULT_BASE_URL

  // Safety guard: never ship localhost API URLs in production bundles.
  if (import.meta.env.PROD && isLocalhostUrl(ENV_BASE_URL)) {
    console.warn(`Ignoring localhost API URL in production (${ENV_BASE_URL}); falling back to Render backend`)
    return RENDER_BASE_URL
  }

  return ENV_BASE_URL
}

const BASE_URL = normalizeBaseUrl(resolveBaseUrl())
export const API_BASE_URL = BASE_URL
export const API_ORIGIN = BASE_URL.replace(/\/api\/?$/, '')

if (import.meta.env.PROD && !ENV_BASE_URL) {
  console.warn('VITE_API_URL/VITE_API_BASE_URL not set; falling back to Render backend')
}

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

const isAuthPage = () => {
  if (typeof window === 'undefined') return false
  return ['/login', '/register', '/forgot-password', '/verify-email', '/change-password'].includes(window.location.pathname)
}

let refreshPromise = null
const refreshSession = () => {
  if (!refreshPromise) {
    refreshPromise = api.post('/auth/refresh').finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

const getCookie = (name) => {
  if (typeof document === 'undefined') return ''
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : ''
}

const CSRF_STORAGE_KEY = 'hs_csrf'

const setStoredCsrf = (token) => {
  if (typeof window === 'undefined') return
  if (!token) {
    localStorage.removeItem(CSRF_STORAGE_KEY)
    return
  }
  localStorage.setItem(CSRF_STORAGE_KEY, String(token))
}

const clearSessionAndRedirect = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('hs_user')
  localStorage.removeItem(CSRF_STORAGE_KEY)
  if (!isAuthPage()) {
    window.location.href = '/login'
  }
}

const readCsrfFromCookie = () => {
  const cookieToken = getCookie('csrf_token')
  if (!cookieToken) {
    setStoredCsrf('')
    return ''
  }
  // Cookie is source of truth; keep localStorage synced for legacy reads.
  setStoredCsrf(cookieToken)
  return cookieToken
}

const ensureCsrfOrReauth = () => {
  const csrfToken = readCsrfFromCookie()
  if (csrfToken) return csrfToken
  if (typeof window !== 'undefined' && localStorage.getItem('hs_user')) {
    clearSessionAndRedirect()
  }
  return ''
}

// Attach CSRF token when available (cookie-based auth)
api.interceptors.request.use((config) => {
  const csrfToken = ensureCsrfOrReauth()
  if (csrfToken) config.headers['X-CSRF-Token'] = csrfToken
  return config
})

// Handle auth errors globally
api.interceptors.response.use(
  (res) => {
    const headerToken = res?.headers?.['x-csrf-token'] || res?.headers?.['X-CSRF-Token']
    const bodyToken = res?.data?.csrfToken
    setStoredCsrf(headerToken || bodyToken)
    return res
  },
  async (err) => {
    const originalRequest = err.config
    const status = err.response?.status
    const url = String(originalRequest?.url || '')
    const isAuthRoute = url.includes('/auth/login')
      || url.includes('/auth/register')
      || url.includes('/auth/refresh')
      || url.includes('/auth/password-reset')
      || url.includes('/auth/verify-email')
      || url.includes('/auth/logout')

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true
      try {
        const hasCsrf = Boolean(ensureCsrfOrReauth())
        if (!hasCsrf) {
          throw new Error('No CSRF token; skip refresh')
        }
        await refreshSession()
        return api(originalRequest)
      } catch (refreshErr) {
        clearSessionAndRedirect()
        return Promise.reject(refreshErr)
      }
    }
    const hasStoredSession = Boolean(localStorage.getItem('hs_user'))
    if (err.response?.status === 401 && hasStoredSession && !isAuthPage() && !url.includes('/auth/me')) {
      clearSessionAndRedirect()
    }

    if (url.includes('/auth/refresh')) {
      clearSessionAndRedirect()
    }
    return Promise.reject(err)
  }
)

export default api
