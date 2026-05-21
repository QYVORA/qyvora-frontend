/**
 * ThemeContext.tsx
 *
 * Provides application-wide theme state ('dark' | 'light') via React Context.
 * The selected theme is persisted to localStorage so it survives page reloads,
 * and is applied to the document root so CSS variables can respond to it.
 *
 * Usage: wrap the app root with <ThemeProvider> and read/change the theme
 * from any descendant using the `useTheme()` hook.
 */

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isCategoryAllowed } from '../../shared/utils/storageConsent';

// ─── Types ────────────────────────────────────────────────────────────────────

/** The two supported colour modes. */
type Theme = 'dark' | 'light';

/** Public API exposed to consumers via useTheme(). */
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;  // Set a specific theme explicitly
  toggleTheme: () => void;            // Flip between dark and light
}

// ─── Context creation ─────────────────────────────────────────────────────────

/**
 * Raw React context. Components should not consume this directly —
 * use the `useTheme()` hook below, which provides a clear error message
 * if the provider is absent from the tree.
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * ThemeProvider — manages and persists the active colour theme.
 *
 * On first render the initial theme is read from localStorage (if available).
 * Any value other than 'light' or 'dark' is ignored and 'dark' is used as
 * the safe default, preventing a stored XSS payload or corrupted value from
 * affecting rendering.
 *
 * Whenever the theme changes it is:
 *   1. Written to the <html> element as data-theme="dark|light" so all CSS
 *      custom properties (var(--color-*) etc.) update automatically.
 *   2. Persisted to localStorage so the preference survives page reloads.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // The initialiser runs once during component creation (not on every render).
    // Guard against SSR / non-browser environments where `window` is undefined.
    if (typeof window === 'undefined') return 'dark';

    // Read both the standard hsociety key and any legacy duplicate 'theme' key
    const savedHsoc = localStorage.getItem('hsociety_theme');
    const savedLegacy = localStorage.getItem('theme');
    const saved = savedHsoc || savedLegacy;

    // Strict allowlist check — only accept exactly 'light' or 'dark'.
    if (saved === 'light' || saved === 'dark') {
      // Clean up duplicate legacy key to keep localStorage tidy
      if (savedLegacy && savedLegacy !== savedHsoc) {
        try {
          localStorage.removeItem('theme');
          localStorage.setItem('hsociety_theme', saved);
        } catch (e) {
          // Ignore storage consent restrictions during bootstrap
        }
      }
      return saved;
    }

    // Default to browser preference if no manual setting is stored
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }

    return 'dark';
  });

  /**
   * Listen for browser/system theme changes dynamically.
   * If the user hasn't set a manual preference in localStorage, we adapt on the fly.
   */
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    // If the user already has a saved theme, do not override it automatically
    const saved = localStorage.getItem('hsociety_theme');
    if (saved === 'light' || saved === 'dark') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'light' : 'dark');
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleThemeChange);
    } else {
      mediaQuery.addListener(handleThemeChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleThemeChange);
      } else {
        mediaQuery.removeListener(handleThemeChange);
      }
    };
  }, []);

  /**
   * Flips the theme between dark and light.
   * Uses the functional form of setState to guarantee we act on the latest
   * value, avoiding stale-closure bugs if toggleTheme is called rapidly.
   */
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  /**
   * Sync the theme to the DOM and localStorage whenever it changes.
   *
   * data-theme on <html> is the single source of truth for CSS.
   * CSS rules should be written as:
   *   [data-theme="dark"]  { --bg: #0a0a0a; }
   *   [data-theme="light"] { --bg: #ffffff; }
   */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (isCategoryAllowed('functional')) {
      localStorage.setItem('hsociety_theme', theme);
      // Clean up legacy key here too if it gets set by accident
      localStorage.removeItem('theme');
    }
  }, [theme]); // Only re-runs when `theme` changes.

  /**
   * Memoize the context value to prevent unnecessary re-renders of consumers
   * when unrelated state in ThemeProvider changes.
   * `toggleTheme` is defined inside the component but is stable across renders
   * (it captures no external state directly), so it is safe to include in the
   * memoized object without being added to the dependency array.
   */
  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useTheme — consume the current theme and theme-change actions.
 *
 * Must be called from a component inside the ThemeProvider tree.
 * Throws a descriptive error on misconfiguration so it fails loudly in dev.
 *
 * @example
 *   const { theme, toggleTheme } = useTheme();
 */
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};
