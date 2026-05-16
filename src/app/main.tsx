/**
 * main.tsx
 *
 * The application entry point. This file is responsible for one thing:
 * mounting the React component tree onto the real DOM node defined in
 * index.html (<div id="root">).
 *
 * Provider order matters — each provider can only consume context from
 * providers that wrap it. The nesting order here is intentional:
 *
 *   StrictMode
 *   └─ ThemeProvider       (no dependencies — safe to be outermost)
 *      └─ AuthProvider     (no dependencies on Toast or Tooltip)
 *         └─ ToastProvider (may internally consume Auth in future)
 *            └─ TooltipProvider (UI-only, innermost is fine)
 *               └─ App
 *
 * Global styles are imported here so they are bundled once and apply to
 * the entire app regardless of which route is active.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../styles/index.css'; // Global CSS: resets, CSS variables, base typography
import { AuthProvider } from '../core/contexts/AuthContext';
import { ToastProvider } from '../core/contexts/ToastContext';
import { ThemeProvider } from '../core/contexts/ThemeContext';
import { TooltipProvider } from '../shared/components/ui/Tooltip';

/*
  createRoot(document.getElementById('root')!)
  ─────────────────────────────────────────────────────────────────────────────
  Finds the <div id="root"> element in index.html and hands it to React as the
  mount point for the entire component tree.

  The non-null assertion (!) tells TypeScript we are certain the element exists.
  If it were ever missing (e.g. index.html is modified incorrectly), React would
  throw a clear error at startup rather than failing silently later.

  createRoot() is the React 18+ concurrent-mode API. It enables features like
  automatic batching, concurrent rendering, and Suspense-based data fetching.
  The older ReactDOM.render() is deprecated and should not be used.
*/
createRoot(document.getElementById('root')!).render(

  /*
    StrictMode
    ───────────────────────────────────────────────────────────────────────────
    A development-only wrapper that activates additional runtime checks and
    intentionally double-invokes certain lifecycle methods (render, effects)
    to surface bugs caused by impure functions or missing effect cleanup.

    StrictMode has ZERO effect in production builds — it is stripped out by
    the bundler. Safe to keep permanently; remove only if a third-party library
    is incompatible with double-invocation (which is itself a bug in that library).
  */
  <StrictMode>

    {/*
      ThemeProvider (outermost context)
      ─────────────────────────────────────────────────────────────────────────
      Manages the active colour theme ('dark' | 'light'), persists it to
      localStorage, and writes data-theme to <html> so CSS variables update
      globally. Placed outermost because every other provider and component
      may depend on theme tokens.
    */}
    <ThemeProvider>

      {/*
        AuthProvider
        ───────────────────────────────────────────────────────────────────────
        Owns authentication state (current user, loading flag) and exposes
        login / logout / refreshMe actions. Wraps everything so any route or
        component can call useAuth() to read the session.

        Placed inside ThemeProvider (can read theme if needed) but outside
        ToastProvider and TooltipProvider (which do not affect auth logic).
      */}
      <AuthProvider>

        {/*
          ToastProvider
          ─────────────────────────────────────────────────────────────────────
          Manages the global notification stack and renders the fixed-position
          toast overlay. Placed inside AuthProvider so future toast triggers
          that depend on auth state (e.g. "Session expired") can access useAuth()
          without prop drilling.
        */}
        <ToastProvider>

          {/*
            TooltipProvider
            ───────────────────────────────────────────────────────────────────
            Sets up the shared tooltip portal and delay configuration used by
            all <Tooltip> components across the app. Innermost because tooltips
            are pure UI and have no dependency on auth, theme, or toast state.
          */}
          <TooltipProvider>

            {/* App — the root component that sets up routing and renders pages */}
            <App />

          </TooltipProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);