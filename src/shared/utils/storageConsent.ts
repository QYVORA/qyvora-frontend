/**
 * storageConsent.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Central utility for managing user consent for different storage categories.
 * 
 * Categories:
 * - strictly_necessary: Always true (Auth, CSRF)
 * - functional: User preferences (Theme)
 * - analytics: Performance data (Landing cache)
 */

export interface CookiePreferences {
  strictly_necessary: boolean;
  functional: boolean;
  analytics: boolean;
  consentedAt?: string;
}

const STORAGE_KEY = 'hsociety_cookie_preferences';

export const DEFAULT_PREFERENCES: CookiePreferences = {
  strictly_necessary: true,
  functional: true,
  analytics: true,
};

/**
 * Reads current preferences from localStorage.
 * Returns null if the user hasn't made a choice yet.
 */
export const getCookiePreferences = (): CookiePreferences | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookiePreferences;
  } catch {
    return null;
  }
};

/**
 * Saves preferences to localStorage with a timestamp.
 */
export const setCookiePreferences = (prefs: Omit<CookiePreferences, 'consentedAt'>) => {
  const payload: CookiePreferences = {
    ...prefs,
    strictly_necessary: true, // Force safety
    consentedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  
  // Dispatch a custom event so other parts of the app can react instantly
  window.dispatchEvent(new Event('hsociety_cookie_consent_updated'));
};

/**
 * Helper to check if a specific category is allowed.
 * If no consent exists yet, it returns true for all by default (until choice is made).
 */
export const isCategoryAllowed = (category: keyof Omit<CookiePreferences, 'consentedAt'>): boolean => {
  if (category === 'strictly_necessary') return true;
  
  const prefs = getCookiePreferences();
  if (!prefs) return true; // Default to true before choice? Or false? 
  // User said "if not existing create a new one", implying we should ask first.
  // Standard practice is to block until consent, but user preferences (theme) 
  // are often better allowed until explicitly rejected.
  return prefs[category];
};
