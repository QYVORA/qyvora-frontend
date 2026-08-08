import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/core/contexts/AuthContext';
import api from '@/core/services/api';
import { usePopupManager } from '@/core/hooks/usePopupManager';
import SpotlightTour, { TourStep } from '@/shared/components/tour/SpotlightTour';

const ONBOARDING_TOUR_SEEN_KEY = 'qyvora_onboarding_tour_seen';

interface StudentTourProps {
  cpBalance: number;
  username: string;
}

const queryTarget = (id: string) =>
  document.querySelector<HTMLElement>(`[data-tour-id="${id}"]`);

const useNeedsOnboarding = (completedOnServer: boolean) =>
  useMemo(() => {
    try {
      const seenLocally = localStorage.getItem(ONBOARDING_TOUR_SEEN_KEY) === '1';
      return !seenLocally || !completedOnServer;
    } catch {
      return true;
    }
  }, [completedOnServer]);

/**
 * Wrapper that only mounts the tour (and thus only registers with the popup
 * priority queue) when onboarding is actually pending. This keeps the slot
 * free for lower-priority popups once the tour is no longer needed.
 *
 * Every signed-in user sees the tour once: it shows until onboarding is
 * complete on the account (server-side `onboardingCompletedAt`) AND on this
 * device (local flag). Existing accounts that never finished onboarding — or
 * that have only a stale local flag — get the flow on their next login.
 */
export const StudentTour: React.FC<StudentTourProps> = (props) => {
  const { user } = useAuth();
  const completedOnServer = Boolean(user?.onboardingCompletedAt);
  const needsOnboarding = useNeedsOnboarding(completedOnServer);
  if (!needsOnboarding) return null;
  return <StudentTourGate {...props} />;
};

const StudentTourGate: React.FC<StudentTourProps> = ({ cpBalance, username }) => {
  const { t } = useTranslation();
  const { refreshMe } = useAuth();
  const { isVisible, onDismiss } = usePopupManager('onboarding-tour', 2);

  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  // Free the popup slot if the user navigates away mid-tour (component unmount).
  useEffect(
    () => () => {
      onDismissRef.current();
    },
    [],
  );

  const completeTour = useCallback(async () => {
    try {
      localStorage.setItem(ONBOARDING_TOUR_SEEN_KEY, '1');
    } catch {
      /* ignore storage errors */
    }
    try {
      await api.post('/profile/onboarding/complete');
      await refreshMe();
    } catch {
      // Best-effort server write-back; the local flag already prevents re-showing.
    }
  }, [refreshMe]);

  const handleClose = useCallback(() => {
    completeTour();
    onDismiss();
  }, [completeTour, onDismiss]);

  const getTarget = useCallback((targetId: string): HTMLElement | null => {
    const md = window.matchMedia('(min-width: 768px)').matches;
    const lg = window.matchMedia('(min-width: 1024px)').matches;
    switch (targetId) {
      case 'tour-nav':
        return lg ? queryTarget('tour-nav-desktop') : queryTarget('tour-nav-mobile');
      case 'tour-cp':
        return md ? queryTarget('tour-cp-desktop') : queryTarget('tour-cp-dashboard');
      case 'tour-profile':
        return md ? queryTarget('tour-profile-desktop') : queryTarget('tour-profile-mobile');
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
        targetId: 'tour-cp',
        title: t('student.tour.cp.title'),
        body: t('student.tour.cp.body', { cp: cpBalance.toLocaleString() }),
      },
      {
        targetId: 'tour-learning',
        title: t('student.tour.learning.title'),
        body: t('student.tour.learning.body'),
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

  return (
    <SpotlightTour
      open={isVisible}
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
