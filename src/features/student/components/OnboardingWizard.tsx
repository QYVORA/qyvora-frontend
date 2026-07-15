import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Rocket, Edit3, BookOpen, Zap } from 'lucide-react';
import { Dialog, DialogContent } from '@/shared/components/ui/Dialog';
import { usePopupManager } from '@/core/hooks/usePopupManager';

const ONBOARDING_SEEN_KEY = 'qyvora_onboarding_dismissed';
const ONBOARDING_SEEN_LEGACY = 'qyvora_onboarding_seen';

const OnboardingWizard: React.FC = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const STEPS = [
    {
      icon: Rocket,
      title: t('student.onboarding.welcome.title'),
      description: t('student.onboarding.welcome.subtitle'),
    },
    {
      icon: Edit3,
      title: t('student.onboarding.path.title'),
      description: t('student.onboarding.path.prompt'),
      action: { label: 'Go to Profile', link: '/dashboard/profile' },
    },
    {
      icon: BookOpen,
      title: t('student.onboarding.focus.title'),
      description: t('student.onboarding.almost.title'),
      action: { label: 'Open HPB', link: '/hpb' },
    },
    {
      icon: Zap,
      title: t('student.onboarding.complete.title'),
      description: '',
    },
  ];
  const { isVisible, onDismiss } = usePopupManager('onboarding', 2);

  const [needsOnboarding, setNeedsOnboarding] = useState(() => {
    try {
      return localStorage.getItem(ONBOARDING_SEEN_KEY) !== '1'
        && localStorage.getItem(ONBOARDING_SEEN_LEGACY) !== '1';
    } catch { return false; }
  });

  const open = needsOnboarding && isVisible;

  const handleDismiss = () => {
    try { localStorage.setItem(ONBOARDING_SEEN_KEY, '1'); } catch { /* ignore */ }
    setNeedsOnboarding(false);
    onDismiss();
    setStep(0);
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleDismiss();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const current = STEPS[step];
  const IconComp = current.icon;

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleDismiss(); }}>
      <DialogContent title={`Step ${step + 1} of ${STEPS.length}`} maxWidth="max-w-lg">
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 rounded-2xl bg-accent-dim border border-accent/30 flex items-center justify-center mb-6">
            <IconComp className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-2xl font-black text-text-primary mb-3 tracking-tight">{current.title}</h2>
          <p className="text-sm text-text-muted leading-relaxed max-w-sm">{current.description}</p>
          {current.action && (
            <Link
              to={current.action.link}
              onClick={handleDismiss}
              className="mt-6 btn-primary inline-flex items-center gap-2 !text-xs !px-6 !py-3 !rounded-2xl"
            >
              {current.action.label}
            </Link>
          )}
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <button
            onClick={handleDismiss}
            className="text-xs font-bold text-text-muted hover:text-accent transition-colors uppercase tracking-widest"
          >
            {t('student.onboarding.skip')}
          </button>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={handleBack}
                className="px-5 py-2.5 rounded-2xl border border-border text-xs font-black uppercase tracking-widest text-text-primary hover:border-accent/40 transition-all"
              >
                {t('student.onboarding.back')}
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-2xl bg-accent text-bg text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110"
            >
              {step < STEPS.length - 1 ? t('student.onboarding.next') : t('student.onboarding.complete.cta')}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingWizard;
