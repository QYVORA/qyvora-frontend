import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { cn } from '@/shared/utils/cn';

const SCROLL_THRESHOLD = 240;

interface WalkthroughScrollControlsProps {
  className?: string;
}

const WalkthroughScrollControls: React.FC<WalkthroughScrollControlsProps> = ({ className }) => {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);

  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [prefersReducedMotion]);

  const scrollDown = useCallback(() => {
    window.scrollBy({ top: window.innerHeight, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [prefersReducedMotion]);

  if (!visible) return null;

  const baseBtn = 'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-bg-card text-text-secondary transition-[color,opacity,border-color] duration-[var(--dur-base)] ease-[var(--ease-smooth)] hover:border-accent/50 hover:text-accent opacity-60 hover:opacity-100 focus-visible:opacity-100 active:scale-90';

  return (
    <div className={cn('fixed left-4 bottom-20 z-[90] flex flex-col gap-2', className)}>
      <button
        type="button"
        onClick={scrollTop}
        aria-label={t('aria.scrollUp')}
        title={t('aria.scrollUp')}
        className={baseBtn}
      >
        <ChevronUp className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={scrollDown}
        aria-label={t('aria.scrollDown')}
        title={t('aria.scrollDown')}
        className={baseBtn}
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
};

export default WalkthroughScrollControls;