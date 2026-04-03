import { useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'hs_landing_rewards'

const readStored = () => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function useLandingRewards() {
  const [state, setState] = useState(() => (
    readStored() || { cp: 0, xp: 0, completed: {} }
  ))

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore storage failures
    }
  }, [state])

  const isCompleted = useCallback((key) => Boolean(state.completed?.[key]), [state.completed])

  const award = useCallback(({ key, cp = 0, xp = 0 }) => {
    setState((prev) => {
      if (key && prev.completed?.[key]) return prev
      const nextCompleted = key ? { ...(prev.completed || {}), [key]: true } : (prev.completed || {})
      return {
        cp: Number(prev.cp || 0) + Number(cp || 0),
        xp: Number(prev.xp || 0) + Number(xp || 0),
        completed: nextCompleted,
      }
    })
  }, [])

  const totals = useMemo(() => ({
    cp: Number(state.cp || 0),
    xp: Number(state.xp || 0),
  }), [state.cp, state.xp])

  return { totals, award, isCompleted }
}
