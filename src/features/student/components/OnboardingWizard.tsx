import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Edit3, BookOpen, Zap } from 'lucide-react';
import { Dialog, DialogContent } from '@/shared/components/ui/Dialog';

const STEPS = [
  {
    icon: Rocket,
    title: 'Welcome, Operator',
    description: 'QYVORA is your launchpad into offensive security. You\'ll complete missions, earn CP, and level up your hacker rank. Every room you clear moves you closer to mastery.',
  },
  {
    icon: Edit3,
    title: 'Set your hacker handle',
    description: 'Your handle is your identity across the platform. Visit your profile to choose one that represents your operator persona.',
    action: { label: 'Go to Profile', link: '/dashboard/profile' },
  },
  {
    icon: BookOpen,
    title: 'Start the Hacker Protocol Bootcamp',
    description: 'Your first objective is to complete the Hacker Protocol Bootcamp (HPB). This will establish your foundation in offsec methodology, Linux, networking, and more.',
    action: { label: 'Open HPB', link: '/hpb' },
  },
  {
    icon: Zap,
    title: 'Earn your first CP',
    description: 'Complete a room in the bootcamp to earn your first CP (Credential Points). CP unlocks marketplace items and determines your rank progression.',
  },
];

const OnboardingWizard: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (localStorage.getItem('qyvora_onboarding_seen') !== '1') {
        setOpen(true);
      }
    } catch { /* ignore */ }
  }, []);

  const handleDismiss = () => {
    try { localStorage.setItem('qyvora_onboarding_seen', '1'); } catch { /* ignore */ }
    setOpen(false);
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
              className="mt-6 inline-flex items-center gap-2 bg-accent text-bg px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110"
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
            Skip
          </button>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl border border-border text-xs font-black uppercase tracking-widest text-text-primary hover:border-accent/40 transition-all"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-accent text-bg text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110"
            >
              {step < STEPS.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingWizard;
