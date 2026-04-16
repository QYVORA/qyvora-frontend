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
  if (import.meta.env.PROD && isLocalhostUrl(ENV_BASE_URL)) {
    console.warn(`Ignoring localhost API URL in production (${ENV_BASE_URL}); falling back to Render backend`)
    return RENDER_BASE_URL
  }
  return ENV_BASE_URL
}

const BASE_URL = normalizeBaseUrl(resolveBaseUrl())
export const API_BASE_URL = BASE_URL
export const API_ORIGIN = BASE_URL.replace(/\/api\/?$/, '')

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

const isAuthPage = () => {
  if (typeof window === 'undefined') return false
  return ['/login', '/register', '/forgot-password', '/verify-email', '/change-password'].includes(window.location.pathname)
}

// Routes that should never trigger a session-clear redirect
const isSafeRoute = (url) => {
  const u = String(url || '')
  return (
    u.includes('/auth/login') ||
    u.includes('/auth/register') ||
    u.includes('/auth/refresh') ||
    u.includes('/auth/password-reset') ||
    u.includes('/auth/verify-email') ||
    u.includes('/auth/logout') ||
    u.includes('/auth/me') ||       // ← never redirect on /me failures
    u.includes('/public/')
  )
}

let refreshPromise = null
const refreshSession = () => {
  if (!refreshPromise) {
    refreshPromise = api.post('/auth/refresh').finally(() => { refreshPromise = null })
  }
  return refreshPromise
}

const getCookie = (name) => {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : ''
}

const CSRF_STORAGE_KEY = 'hs_csrf'

const setStoredCsrf = (token) => {
  if (typeof window === 'undefined') return
  if (!token) { localStorage.removeItem(CSRF_STORAGE_KEY); return }
  localStorage.setItem(CSRF_STORAGE_KEY, String(token))
}

const clearSessionAndRedirect = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('hs_user')
  localStorage.removeItem(CSRF_STORAGE_KEY)
  if (!isAuthPage()) window.location.href = '/login'
}

const readCsrfFromCookie = () => {
  const token = getCookie('csrf_token')
  if (!token) { setStoredCsrf(''); return '' }
  setStoredCsrf(token)
  return token
}

// Request interceptor — attach CSRF token when present
api.interceptors.request.use((config) => {
  const csrfToken = readCsrfFromCookie()
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken
  }
  return config
})

// Response interceptor
api.interceptors.response.use(
  (res) => {
    // Sync CSRF token from response headers/body
    const headerToken = res?.headers?.['x-csrf-token'] || res?.headers?.['X-CSRF-Token']
    const bodyToken = res?.data?.csrfToken
    if (headerToken || bodyToken) setStoredCsrf(headerToken || bodyToken)
    return res
  },
  async (err) => {
    const originalRequest = err.config
    const status = err.response?.status
    const url = String(originalRequest?.url || '')

    const isCsrfFailure =
      status === 403 &&
      String(err?.response?.data?.error || '').toLowerCase().includes('csrf')

    // Attempt token refresh on auth failures for non-safe routes
    if ((status === 401 || isCsrfFailure) && originalRequest && !originalRequest._retry && !isSafeRoute(url)) {
      originalRequest._retry = true
      try {
        await refreshSession()
        return api(originalRequest)
      } catch {
        clearSessionAndRedirect()
        return Promise.reject(err)
      }
    }

    // Hard 401 on non-safe routes with a stored session → clear and redirect
    if (
      status === 401 &&
      !isSafeRoute(url) &&
      !isAuthPage() &&
      localStorage.getItem('hs_user')
    ) {
      clearSessionAndRedirect()
    }

    return Promise.reject(err)
  }
)

export default api
