/**
 * App.tsx
 *
 * The root application component. It is responsible for setting up three
 * cross-cutting concerns that every page in the app depends on:
 *
 *   1. Error boundary  — catches any unhandled React render errors at the
 *                        top level so the whole app doesn't go blank.
 *   2. Motion config   — a single place to configure animation behaviour
 *                        for every Framer Motion element in the tree.
 *   3. Router          — provides the URL-based navigation context that
 *                        AppRouter and all <Link> / <Navigate> components need.
 *
 * App itself renders no visible UI — it is purely a configuration shell.
 * All actual page content is rendered by AppRouter.
 */

import { BrowserRouter as Router } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { AppRouter } from './router';
import ScrollToTop from '../shared/components/ScrollToTop';
import ErrorBoundary from '../shared/components/ErrorBoundary';
import AdaptiveMode from '../shared/components/AdaptiveMode';

export default function App() {
  return (
    /*
      ErrorBoundary (outermost layer)
      ─────────────────────────────────────────────────────────────────────────
      Catches any JavaScript error thrown during rendering anywhere inside the
      app and replaces the crashed subtree with a fallback UI instead of a
      blank white screen.

      `scope="App"` is passed through to the boundary's error reporting so
      logged errors are clearly identified as originating at the top level,
      making them easy to triage in production error tracking tools.
    */
    <ErrorBoundary scope="App">

      {/*
        MotionConfig (animation defaults)
        ───────────────────────────────────────────────────────────────────────
        Sets global defaults for every `motion.*` element in the entire tree.
        Child components can still override these on a per-element basis.

        reducedMotion="user"
          Automatically disables or reduces animations for users who have
          enabled "Reduce Motion" in their OS accessibility settings.
          This is an important accessibility requirement — do not remove it.

        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          The default easing curve is a custom cubic-bezier that produces a
          quick acceleration with a soft, natural deceleration — similar to
          iOS spring physics. 0.42 s is deliberately slightly longer than a
          standard 0.3 s transition to give the UI a premium, unhurried feel.
          Both values are purely aesthetic and can be tuned freely.
      */}
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >

        {/*
          BrowserRouter (client-side routing context)
          ─────────────────────────────────────────────────────────────────────
          Provides React Router's navigation context to the entire app.
          Must wrap AppRouter and any component that uses useNavigate(),
          useLocation(), <Link>, or <Navigate>.

          future flags:
            v7_startTransition     — Wraps route state updates in
                                     React.startTransition(), keeping
                                     the UI responsive during navigations.
                                     This is required in React Router v7
                                     and opts in early here to avoid
                                     deprecation warnings.
            v7_relativeSplatPath   — Changes how relative paths are resolved
                                     inside splat ("*") routes to align with
                                     the v7 behaviour. Enabling it now prevents
                                     breaking changes when upgrading later.
        */}
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>

          {/*
            AdaptiveMode
            ───────────────────────────────────────────────────────────────────
            A renderless component (returns null) that detects the user's
            environment (e.g. device capabilities, connection speed, or
            preference signals) and applies adaptive classes or CSS variables
            to the document root. Placed inside the Router so it can read
            the current route if needed for per-page adaptations.
          */}
          <AdaptiveMode />

          {/*
            ScrollToTop
            ───────────────────────────────────────────────────────────────────
            A renderless component that listens for route changes and scrolls
            the window back to the top on every navigation. Without this,
            React Router preserves the previous page's scroll position when
            navigating to a new route, which is almost never the desired UX
            for a page-level navigation.
          */}
          <ScrollToTop />

          {/*
            AppRouter
            ───────────────────────────────────────────────────────────────────
            Declares all route definitions and renders the correct page
            component for the current URL. See router/index.tsx for the
            full route map.
          */}
          <AppRouter />

        </Router>
      </MotionConfig>
    </ErrorBoundary>
  );
}