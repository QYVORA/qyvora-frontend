import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/core/contexts/AuthContext';
import api from '@/core/services/api';
import { usePopupManager } from '@/core/hooks/usePopupManager';
import { Dialog, DialogContent } from '@/shared/components/ui/Dialog';
import { IconShield, IconTarget, IconLeaderboard, IconArrowRight } from '@/shared/components/icons';

const ONBOARDING_COMPLETED_KEY = 'qyvora_onboarding_completed';

/**
 * Multi-step onboarding modal that appears when a student has not completed
 * onboarding. Primary goal: drive the student to register/continue with the
 * Hacker Protocol Bootcamp.
 *
 * Uses usePopupManager('onboarding', 0) — absolute highest priority popup slot.
 * After onboarding completes, the guided tutorial (priority 2) can auto-show.
 */
const StudentOnboardingModal: React.FC = () => {
  const { t } = useTranslation();
  const { user, refreshMe } = useAuth();
  const navigate = useNavigate();

  const completedOnServer = Boolean(user?.onboardingCompletedAt);
  const skippedOnServer = Boolean(user?.onboardingSkippedAt);

  const needsOnboarding = useMemo(() => {
    if (completedOnServer) return false;
    try {
      return localStorage.getItem(ONBOARDING_COMPLETED_KEY) !== '1';
    } catch {
      return true;
    }
  }, [completedOnServer]);

  const { isVisible, onDismiss } = usePopupManager('onboarding', 0);
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => () => { onDismissRef.current(); }, []);

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const isEnrolled = user?.bootcampStatus !== 'not_enrolled';
  const totalSteps = 4;

  const markLocalComplete = useCallback(() => {
    try { localStorage.setItem(ONBOARDING_COMPLETED_KEY, '1'); } catch { /* ignore */ }
  }, []);

  const handleSkip = useCallback(async () => {
    setSubmitting(true);
    try {
      await api.post('/profile/onboarding/skip');
      await refreshMe();
    } catch { /* best-effort */ }
    markLocalComplete();
    onDismiss();
  }, [refreshMe, onDismiss, markLocalComplete]);

  const handleComplete = useCallback(async () => {
    setSubmitting(true);
    try {
      await api.post('/profile/onboarding/complete');
      await refreshMe();
    } catch { /* best-effort */ }
    markLocalComplete();
    onDismiss();
    navigate('/dashboard/bootcamps/bc_1775270338500');
  }, [refreshMe, onDismiss, navigate, markLocalComplete]);

  const handleNext = useCallback(() => {
    if (step < totalSteps - 1) setStep(step + 1);
    else handleComplete();
  }, [step, handleComplete]);

  if (!needsOnboarding || !isVisible) return null;

  return (
    <Dialog open={isVisible} onOpenChange={(open) => { if (!open) handleSkip(); }}>
      <DialogContent
        title={t(`student.onboardingModal.step${step}.title`)}
        maxWidth="max-w-lg"
        hideClose
      >
        <div className="flex flex-col items-center text-center gap-6 py-2">
          {/* Step icon */}
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-accent/10 border border-accent/20">
            {step === 0 && <IconShield size={32} className="text-accent" />}
            {step === 1 && <IconTarget size={32} className="text-accent" />}
            {step === 2 && <IconLeaderboard size={32} className="text-accent" />}
            {step === 3 && <IconTarget size={32} className="text-accent" />}
          </div>

          {/* Step body */}
          <p className="text-sm text-text-muted font-mono leading-relaxed max-w-sm">
            {t(`student.onboardingModal.step${step}.body`)}
          </p>

          {/* Step indicator */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-accent' : i < step ? 'w-3 bg-accent/40' : 'w-3 bg-border'
                }`}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
            {step < totalSteps - 1 && (
              <button
                onClick={handleSkip}
                disabled={submitting}
                className="btn-secondary !py-2.5 !rounded-xl text-xs w-full sm:w-auto"
              >
                {t('student.onboardingModal.skip')}
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={submitting}
              className="btn-primary !py-2.5 !rounded-xl text-xs w-full sm:w-auto flex items-center justify-center gap-1.5"
            >
              {step === totalSteps - 1
                ? (isEnrolled ? t('student.onboardingModal.step3.ctaEnrolled') : t('student.onboardingModal.step3.cta'))
                : t('student.onboardingModal.next')}
              <IconArrowRight size={14} />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentOnboardingModal;
