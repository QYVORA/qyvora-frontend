import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/core/contexts/AuthContext';
import api from '@/core/services/api';
import { usePopupManager } from '@/core/hooks/usePopupManager';
import SpotlightTour, { TourStep } from '@/shared/components/tour/SpotlightTour';

interface StudentTourProps {
  cpBalance: number;
  username: string;
  /** External open control for replay. When provided, bypasses popup manager. */
  open?: boolean;
  /** Called when externally-controlled tour closes. */
  onOpenChange?: (open: boolean) => void;
}

const queryTarget = (id: string) =>
  document.querySelector<HTMLElement>(`[data-tour-id="${id}"]`);

/**
 * Interactive guided tutorial that spotlights real UI elements via data-tour-id.
 *
 * This is NOT the onboarding modal — it is the post-onboarding guided tour
 * that teaches students how the platform works. It can be:
 *   1. Auto-triggered via usePopupManager after onboarding completes
 *   2. Manually opened via the "Take a Tour" replay button
 *
 * The tutorial resolves ACTUAL DOM elements using getBoundingClientRect(),
 * never manual coordinates.
 */
export const StudentTour: React.FC<StudentTourProps> = ({
  cpBalance,
  username,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}) => {
  const { t } = useTranslation();
  const { user, refreshMe } = useAuth();
  const { isVisible: popupVisible, onDismiss: popupDismiss } = usePopupManager('onboarding-tour', 2);
  const [replayOpen, setReplayOpen] = useState(false);

  const isExternallyControlled = externalOpen !== undefined;
  const isVisible = isExternallyControlled ? externalOpen : popupVisible;

  const onDismissAll = useCallback(() => {
    // Closing the tour must always reset the replay flag, otherwise a manual
    // "Take a Tour" replay stays open forever (the Finish/Skip button would
    // appear to do nothing on desktop).
    setReplayOpen(false);
    if (isExternallyControlled) {
      externalOnOpenChange?.(false);
    } else {
      popupDismiss();
    }
  }, [isExternallyControlled, externalOnOpenChange, popupDismiss]);

  const onDismissRef = useRef(onDismissAll);
  onDismissRef.current = onDismissAll;

  useEffect(() => () => { onDismissRef.current(); }, []);

  // Listen for replay events from the "Take a Tour" button
  useEffect(() => {
    const handler = () => setReplayOpen(true);
    window.addEventListener('qyvora:start-tutorial', handler);
    return () => window.removeEventListener('qyvora:start-tutorial', handler);
  }, []);

  const completeTour = useCallback(async () => {
    // Closing the tour must not flip server-side onboarding state: skippers
    // keep their skip state and replays don't overwrite a completed state.
    if (user?.onboardingCompletedAt || user?.onboardingSkippedAt) return;
    try {
      await api.post('/profile/onboarding/complete');
      await refreshMe();
    } catch {
      // Best-effort — the tour is informational, completion is a nice-to-have.
    }
  }, [user?.onboardingCompletedAt, user?.onboardingSkippedAt, refreshMe]);

  const handleClose = useCallback(() => {
    completeTour();
    onDismissAll();
  }, [completeTour, onDismissAll]);

  const handleSkip = useCallback(() => {
    onDismissAll();
  }, [onDismissAll]);

  const getTarget = useCallback((targetId: string): HTMLElement | null => {
    const md = window.matchMedia('(min-width: 768px)').matches;
    const lg = window.matchMedia('(min-width: 1024px)').matches;
    // Returns the first candidate that is actually present and laid out
    // (has client rects). The desktop CP/profile anchors live in the
    // auto-hiding fixed topbar; if it has slid off-screen those elements
    // report zero/off-screen rects, so fall back to the always-visible
    // dashboard/topbar static anchors instead of rendering a black spotlight.
    const firstVisible = (...ids: string[]): HTMLElement | null => {
      for (const id of ids) {
        const el = queryTarget(id);
        if (el && el.getClientRects().length > 0) {
          const r = el.getBoundingClientRect();
          // Skip anchors that are not actually visible on screen — the fixed
          // topbar anchors report rects even when hidden (slid off via
          // translate-y), which is exactly when we want to fall back.
          if (
            r.width > 0 &&
            r.height > 0 &&
            r.bottom > 0 &&
            r.top < window.innerHeight &&
            r.right > 0 &&
            r.left < window.innerWidth
          ) {
            return el;
          }
        }
      }
      return queryTarget(ids[0]) ?? null;
    };
    switch (targetId) {
      case 'tour-nav':
        // tour-nav-md is the topbar brand anchor, visible on md..lg where the
        // desktop nav (lg+) and the mobile menu trigger (md-) do not exist.
        // Highlighting something beats a dead black spotlight on 768-1023px.
        if (lg) return firstVisible('tour-nav-desktop', 'tour-nav-mobile', 'tour-nav-md');
        if (md) return firstVisible('tour-nav-md', 'tour-nav-desktop', 'tour-nav-mobile');
        return firstVisible('tour-nav-mobile', 'tour-nav-desktop', 'tour-nav-md');
      case 'tour-cp':
        return md ? firstVisible('tour-cp-desktop', 'tour-cp-dashboard', 'tour-cp-mobile')
                  : firstVisible('tour-cp-dashboard', 'tour-cp-mobile', 'tour-cp-desktop');
      case 'tour-profile':
        return md ? firstVisible('tour-profile-desktop', 'tour-profile-mobile')
                  : firstVisible('tour-profile-mobile', 'tour-profile-desktop');
      default:
        return queryTarget(targetId);
    }
  }, []);

  const steps: TourStep[] = useMemo(
    () => [
      {
        targetId: 'tour-hero',
        title: t('student.tour.welcome.title'),
        body: t('student.tour.welcome.body', { username }),
      },
      {
        targetId: 'tour-nav',
        title: t('student.tour.nav.title'),
        body: t('student.tour.nav.body'),
      },
      {
        targetId: 'tour-learning',
        title: t('student.tour.learning.title'),
        body: t('student.tour.learning.body'),
      },
      {
        targetId: 'tour-cp',
        title: t('student.tour.cp.title'),
        body: t('student.tour.cp.body', { cp: cpBalance.toLocaleString() }),
      },
      {
        targetId: 'tour-profile',
        title: t('student.tour.profile.title'),
        body: t('student.tour.profile.body'),
      },
      {
        title: t('student.tour.done.title'),
        body: t('student.tour.done.body'),
      },
    ],
    [t, username, cpBalance],
  );

  const tourOpen = isExternallyControlled ? externalOpen : (popupVisible || replayOpen);

  return (
    <SpotlightTour
      open={!!tourOpen}
      steps={steps}
      onClose={handleClose}
      getTarget={getTarget}
      labels={{
        skip: t('student.tour.controls.skip'),
        back: t('student.tour.controls.back'),
        next: t('student.tour.controls.next'),
        finish: t('student.tour.controls.finish'),
      }}
    />
  );
};

export default StudentTour;
