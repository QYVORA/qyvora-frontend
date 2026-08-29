import { useEffect } from 'react';
import { useAuth } from '../../core/contexts/AuthContext';
import { usePreferences } from '../hooks/usePreferences';

/**
 * PreferencesApplier — renderless component that syncs the authenticated user's
 * display preferences (font size, animations) onto the document root so they
 * are honoured across every page, not just the settings screen.
 *
 * The settings page applies these attributes optimistically when the user
 * changes them; this component reapplies them from the server on app boot.
 */
const PreferencesApplier = () => {
  const { user } = useAuth();
  const { preferences, loading } = usePreferences();

  useEffect(() => {
    if (!user || loading) return;
    const root = document.documentElement;
    root.setAttribute('data-font-size', preferences.display.fontSize);
    root.setAttribute('data-animations', preferences.display.showAnimations ? 'on' : 'off');
  }, [user, loading, preferences.display.fontSize, preferences.display.showAnimations]);

  return null;
};

export default PreferencesApplier;