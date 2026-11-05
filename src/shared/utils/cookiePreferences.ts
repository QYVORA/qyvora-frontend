export const OPEN_COOKIE_PREFERENCES_EVENT = 'qyvora:open-cookie-preferences';

/** Opens the consent banner in its customisable state from anywhere in the app. */
export const openCookiePreferences = () => {
  window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES_EVENT));
};
