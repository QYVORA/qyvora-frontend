import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';

type Theme = 'dark' | 'light';
type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeContextType {
  /** The resolved theme actually applied to the document ('dark' | 'light'). */
  theme: Theme;
  /** The user's chosen mode — 'system' tracks the OS preference live. */
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'qyvora_theme';

function getSystemTheme(): Theme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return 'dark';
}

function readStoredMode(): ThemeMode | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {}
  return null;
}

function getInitialMode(): ThemeMode {
  // No stored choice → follow the device. A stored 'system' re-enters tracking.
  return readStoredMode() ?? 'system';
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(getInitialMode);
  const [systemTheme, setSystemTheme] = useState<Theme>(getSystemTheme);
  // The last explicit dark/light choice; used by toggleTheme to flip from a
  // system-derived theme.
  const pinnedRef = useRef<Theme>('dark');

  const theme: Theme = mode === 'system' ? systemTheme : mode;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    try { localStorage.setItem(THEME_STORAGE_KEY, mode); } catch {}
  }, [theme, mode]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'light' : 'dark');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    if (m !== 'system') pinnedRef.current = m;
  }, []);

  const toggleTheme = useCallback(() => {
    const base = mode === 'system' ? systemTheme : mode;
    const next: Theme = base === 'dark' ? 'light' : 'dark';
    pinnedRef.current = next;
    setModeState(next);
  }, [mode, systemTheme]);

  const value = useMemo(() => ({ theme, mode, toggleTheme, setMode }), [theme, mode, toggleTheme, setMode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return { theme: 'dark' as Theme, mode: 'system' as ThemeMode, toggleTheme: () => {}, setMode: (_: ThemeMode) => {} };
  }
  return ctx;
};