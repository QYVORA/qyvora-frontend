import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { cn } from '@/shared/utils/cn';

const SCROLL_THRESHOLD = 240;
const HIDE_DELAY_MS = 1000;

interface WalkthroughScrollControlsProps {
  className?: string;
}

const WalkthroughScrollControls: React.FC<WalkthroughScrollControlsProps> = ({ className }) => {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const [scrolledPast, setScrolledPast] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [pinned, setPinned] = useState(false);
  const hideTimerRef = useRef<number | null>(null);

  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => setEngaged(false), HIDE_DELAY_MS);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolledPast(window.scrollY > SCROLL_THRESHOLD);
      setEngaged(true);
      scheduleHide();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
    };
  }, [scheduleHide]);

  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [prefersReducedMotion]);

  const scrollDown = useCallback(() => {
    const bottom = Math.max(
      document.documentElement.scrollHeight,
      document.body ? document.body.scrollHeight : 0,
    );
    window.scrollTo({ top: bottom, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [prefersReducedMotion]);

  const visible = scrolledPast && (engaged || pinned);

  const baseBtn = 'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-bg-card text-text-secondary transition-[color,opacity,border-color] duration-[var(--dur-base)] ease-[var(--ease-smooth)] hover:border-accent/50 hover:text-accent opacity-60 hover:opacity-100 focus-visible:opacity-100 active:scale-90';

  return (
    <div
      onMouseEnter={() => setPinned(true)}
      onMouseLeave={() => setPinned(false)}
      onFocus={() => setPinned(true)}
      onBlur={() => setPinned(false)}
      className={cn(
        'fixed left-4 bottom-20 z-[90] flex flex-col gap-2',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0',
        prefersReducedMotion ? 'transition-none' : 'transition-opacity duration-300',
        className,
      )}
    >
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