import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap } from 'lucide-react';
import CpLogo from '@/shared/components/CpLogo';
import { useScrollLock } from '@/core/hooks/useScrollLock';

const BURST = [
  { tx: -90, ty: -70, delay: 0.05, size: 10 },
  { tx: 90, ty: -70, delay: 0.15, size: 12 },
  { tx: -130, ty: -10, delay: 0.1, size: 8 },
  { tx: 130, ty: -10, delay: 0.2, size: 10 },
  { tx: -70, ty: -110, delay: 0.25, size: 9 },
  { tx: 70, ty: -110, delay: 0.3, size: 11 },
  { tx: -120, ty: -60, delay: 0.35, size: 7 },
  { tx: 120, ty: -60, delay: 0.4, size: 8 },
];

interface CelebrationModalProps {
  open: boolean;
  onClose: () => void;
  badge?: string;
  title: string;
  description?: React.ReactNode;
  rewardCp?: number;
  rewardLabel?: string;
  ctaLabel?: string;
  mascot?: React.ReactNode;
  children?: React.ReactNode;
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({
  open,
  onClose,
  badge,
  title,
  description,
  rewardCp,
  rewardLabel,
  ctaLabel,
  mascot,
  children,
}) => {
  useScrollLock(open);
  const cardRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
    }
    if (e.key === 'Tab' && cardRef.current) {
      const focusable = cardRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [onClose]);

  useEffect(() => {
    if (open) {
      previousFocus.current = document.activeElement as HTMLElement;
      requestAnimationFrame(() => {
        cardRef.current?.focus();
      });
    } else {
      previousFocus.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Celebration card */}
          <motion.div
            ref={cardRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="celebration-title"
            tabIndex={-1}
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="relative z-10 w-full max-w-md mx-4 outline-none"
          >
            <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-bg-card text-center">

              {/* Burst */}
              <div className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2">
                {BURST.map((b, i) => (
                  <motion.span
                    key={i}
                    className="absolute left-0 top-0 rounded-full bg-accent"
                    style={{ width: b.size, height: b.size }}
                    initial={{ x: 0, y: 0, opacity: 0.9, scale: 1 }}
                    animate={{ x: b.tx, y: b.ty, opacity: 0, scale: 0.4 }}
                    transition={{ duration: 1.1, delay: b.delay, ease: 'easeOut' }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative z-10 p-8 md:p-10">
                {mascot && <div className="mx-auto mb-6 flex items-center justify-center">{mascot}</div>}

                {badge && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent/10 text-accent border border-accent/20 mb-4">
                    {badge}
                  </span>
                )}

                <h2 id="celebration-title" className="mb-2 text-2xl md:text-3xl font-black uppercase tracking-tight text-text-primary">
                  {title}
                </h2>

                {description && (
                  <p className="mb-6 text-sm text-text-secondary font-mono leading-relaxed">{description}</p>
                )}

                {(rewardCp !== undefined || rewardLabel) && (
                  <div className="mb-8 inline-flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent-dim px-6 py-4">
                    <Zap className="h-5 w-5 text-accent" />
                    <span className="font-mono text-2xl font-black text-accent">
                      {rewardLabel ?? `+${rewardCp}`}
                    </span>
                    <CpLogo className="h-6 w-6" />
                  </div>
                )}

                {children}

                <button
                  onClick={onClose}
                  className="w-full btn-primary !rounded-xl !text-[10px] !py-3"
                >
                  {ctaLabel || 'Continue'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CelebrationModal;
