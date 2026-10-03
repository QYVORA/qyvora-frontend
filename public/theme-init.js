/**
 * theme-init.js — first-paint theme bootstrap.
 *
 * Applies the theme before the first paint so the page never flashes the wrong
 * one. Reads the same 'qyvora_theme' key as ThemeContext ('dark'|'light'|
 * 'system').
 *
 * This lives in an external file rather than an inline <script> on purpose: the
 * deployed Content-Security-Policy is `script-src 'self'` (see netlify.toml),
 * which blocks inline execution — the inline version was rejected in the
 * browser on every page load.
 *
 * It must stay synchronous and render-blocking: a module or `defer` would run
 * after the first paint and defeat the whole point.
 *
 * LIGHT_THEME_ENABLED: light theme is an unbuilt experiment — every branch
 * below is retained, but the flag pins the document to dark and normalises any
 * stale stored 'light'/'system' preference. Mirrors the identically named
 * export in src/core/contexts/ThemeContext.tsx.
 */
(function () {
  var LIGHT_THEME_ENABLED = false;
  var theme = 'dark';
  if (LIGHT_THEME_ENABLED) {
    try {
      var stored = localStorage.getItem('qyvora_theme');
      if (stored === 'dark') theme = 'dark';
      else if (stored === 'light') theme = 'light';
      else if (stored === 'system' || !stored) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) theme = 'light';
      }
    } catch (e) {}
  }
  var el = document.documentElement;
  el.setAttribute('data-theme', theme);
  el.classList.add(theme);
  if (!LIGHT_THEME_ENABLED) {
    try { localStorage.setItem('qyvora_theme', 'dark'); } catch (e) {}
  }
})();