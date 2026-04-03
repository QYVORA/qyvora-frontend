import axios from 'axios'

const ENV_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL
const RENDER_BASE_URL = 'https://hsociety-backend.onrender.com/api'
const DEFAULT_BASE_URL = import.meta.env.DEV ? 'http://localhost:3000/api' : RENDER_BASE_URL

const normalizeBaseUrl = (value) => {
  if (!value) return value
  const trimmed = String(value).replace(/\/+$/, '')
  if (/\/api(\/|$)/.test(trimmed)) return trimmed
  return `${trimmed}/api`
}

const BASE_URL = normalizeBaseUrl(ENV_BASE_URL || DEFAULT_BASE_URL)

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
  return ['/login', '/register', '/forgot-password', '/verify-email'].includes(window.location.pathname)
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

// Attach CSRF token when available (cookie-based auth)
api.interceptors.request.use((config) => {
  const csrfToken = getCookie('csrf_token')
  if (csrfToken) config.headers['X-CSRF-Token'] = csrfToken
  return config
})

// Handle auth errors globally
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config
    const status = err.response?.status
    const url = String(originalRequest?.url || '')
    const isAuthRoute = url.includes('/auth/login')
      || url.includes('/auth/register')
      || url.includes('/auth/refresh')
      || url.includes('/auth/me')
      || url.includes('/auth/password-reset')
      || url.includes('/auth/verify-email')
      || url.includes('/auth/logout')

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true
      try {
        await refreshSession()
        return api(originalRequest)
      } catch (refreshErr) {
        localStorage.removeItem('hs_user')
        window.location.href = '/login'
        return Promise.reject(refreshErr)
      }
    }
    const hasStoredSession = Boolean(localStorage.getItem('hs_user'))
    if (err.response?.status === 401 && hasStoredSession && !isAuthPage()) {
      localStorage.removeItem('hs_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
