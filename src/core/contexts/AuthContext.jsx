import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '@/core/services'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authState, setAuthState] = useState(null)

  const clearSession = useCallback(() => {
    setUser(null)
    setAuthState(null)
    localStorage.removeItem('hs_user')
    localStorage.removeItem('hs_csrf')
  }, [])

  const loadSession = useCallback(async () => {
    const hasStoredUser = typeof window !== 'undefined' && Boolean(localStorage.getItem('hs_user'))
    const hasCsrfCookie = typeof document !== 'undefined' && document.cookie.includes('csrf_token=')
    if (!hasStoredUser && !hasCsrfCookie) {
      setLoading(false)
      return
    }
    try {
      const res = await authService.me()
      setUser(res.data)
    } catch (err) {
      // Only clear session on an explicit 401 — not on network errors, timeouts, etc.
      const status = err?.response?.status
      if (status === 401 || status === 403) {
        clearSession()
      }
      // For any other error (network, 5xx, timeout) keep the stored session intact
      // so the user isn't logged out due to a backend hiccup
    } finally {
      setLoading(false)
    }
  }, [clearSession])

  useEffect(() => {
    // Don't re-run session load if user is already in state (e.g. just logged in)
    if (user) { setLoading(false); return }
    loadSession()
  }, [loadSession])

  const login = async (email, password) => {
    const res = await authService.login(email, password)
    const data = res.data || {}
    setAuthState(data)
    if (data.user) {
      setUser(data.user)
      localStorage.setItem('hs_user', JSON.stringify(data.user))
    }
    return data
  }

  const register = async (payload) => {
    const res = await authService.register(payload)
    const data = res.data || {}
    setAuthState(data)
    if (data.user) {
      setUser(data.user)
      localStorage.setItem('hs_user', JSON.stringify(data.user))
    }
    return data
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch {
      // ignore logout failures
    }
    clearSession()
  }

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...(prev || {}), ...updates }
      localStorage.setItem('hs_user', JSON.stringify(updated))
      return updated
    })
  }, [])

  const setSession = useCallback((nextUser) => {
    if (!nextUser) return
    setUser(nextUser)
    localStorage.setItem('hs_user', JSON.stringify(nextUser))
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, setSession, authState, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be within AuthProvider')
  return ctx
}
