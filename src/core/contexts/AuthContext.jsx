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
  }, [])

  const loadSession = useCallback(async () => {
    try {
      const res = await authService.me()
      setUser(res.data)
    } catch {
      clearSession()
    } finally {
      setLoading(false)
    }
  }, [clearSession])

  useEffect(() => {
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

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, authState, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be within AuthProvider')
  return ctx
}
