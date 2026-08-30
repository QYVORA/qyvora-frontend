import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/utils/cn';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

export type TourPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TourStep {
  targetId?: string;
  title: string;
  body: React.ReactNode;
  placement?: TourPlacement;
}

export interface SpotlightTourLabels {
  skip: string;
  back: string;
  next: string;
  finish: string;
}

interface SpotlightTourProps {
  open: boolean;
  steps: TourStep[];
  onClose: () => void;
  getTarget?: (targetId: string) => HTMLElement | null;
  labels?: Partial<SpotlightTourLabels>;
  zIndex?: number;
}

const DEFAULT_LABELS: SpotlightTourLabels = {
  skip: 'Skip',
  back: 'Back',
  next: 'Next',
  finish: 'Finish',
};

interface TargetRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

const DEFAULT_Z = 600;

const pad = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export const SpotlightTour: React.FC<SpotlightTourProps> = ({
  open,
  steps,
  onClose,
  getTarget,
  labels,
  zIndex = DEFAULT_Z,
}) => {
  const prefersReduced = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches,
  );

  const cardRef = useRef<HTMLDivElement>(null);
  const [cardSize, setCardSize] = useState({ width: 320, height: 200 });
  const getTargetRef = useRef(getTarget);
  getTargetRef.current = getTarget;

  const step = steps[Math.min(stepIndex, steps.length - 1)];
  const labelsResolved = { ...DEFAULT_LABELS, ...labels };

  useEffect(() => {
    if (!open) return;
    setStepIndex(0);
  }, [open]);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const resolveTarget = useCallback((targetId?: string): HTMLElement | null => {
    if (!targetId) return null;
    const el = getTargetRef.current
      ? getTargetRef.current(targetId)
      : document.querySelector<HTMLElement>(`[data-tour-id="${targetId}"]`);
    if (!el) return null;
    if (el.getClientRects().length === 0) return null;
    return el;
  }, []);

  const measure = useCallback(() => {
    const el = resolveTarget(step?.targetId);
    if (!el) {
      setTargetRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setTargetRect({ left: r.left, top: r.top, width: r.width, height: r.height });
  }, [resolveTarget, step?.targetId]);

  useLayoutEffect(() => {
    if (!open) return;
    const el = resolveTarget(step?.targetId);
    if (!el) {
      setTargetRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    const fullyVisible =
      r.top >= 0 &&
      r.bottom <= window.innerHeight &&
      r.left >= 0 &&
      r.right <= window.innerWidth;
    if (!fullyVisible) {
      el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'center' });
    }
    const raf = requestAnimationFrame(measure);
    const timer = window.setTimeout(measure, prefersReduced ? 0 : 500);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [open, stepIndex, resolveTarget, step?.targetId, measure, prefersReduced]);

  useEffect(() => {
    if (!open) return;
    let raf = 0;
    const handle = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    window.addEventListener('scroll', handle, true);
    window.addEventListener('resize', handle);
    return () => {
      window.removeEventListener('scroll', handle, true);
      window.removeEventListener('resize', handle);
      cancelAnimationFrame(raf);
    };
  }, [open, measure]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useLayoutEffect(() => {
    if (!open) return;
    const el = cardRef.current;
    if (!el) return;
    setCardSize({ width: el.offsetWidth, height: el.offsetHeight });
  }, [open, stepIndex, isDesktop]);

  if (!open || steps.length === 0) return null;

  const isLast = stepIndex === steps.length - 1;
  const isFirst = stepIndex === 0;
  const hasTarget = Boolean(step?.targetId && targetRect);

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const gutter = 16;
  const arrowSize = 10;

  const computeDesktopPosition = (): { left: number; top: number; placement: TourPlacement } => {
    if (!targetRect) {
      return {
        left: Math.round((window.innerWidth - cardSize.width) / 2),
        top: Math.max(gutter, Math.round((window.innerHeight - cardSize.height) / 2)),
        placement: 'bottom',
      };
    }
    const preferred = step?.placement;
    const order: TourPlacement[] = preferred
      ? [preferred]
      : ['bottom', 'top', 'right', 'left'];
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = arrowSize + 8;
    const fits = (x: number, y: number) =>
      x >= gutter && x + cardSize.width <= vw - gutter &&
      y >= gutter && y + cardSize.height <= vh - gutter;

    for (const p of order) {
      let x: number;
      let y: number;
      if (p === 'bottom') {
        x = targetRect.left + targetRect.width / 2 - cardSize.width / 2;
        y = targetRect.top + targetRect.height + gap;
      } else if (p === 'top') {
        x = targetRect.left + targetRect.width / 2 - cardSize.width / 2;
        y = targetRect.top - gap - cardSize.height;
      } else if (p === 'right') {
        x = targetRect.left + targetRect.width + gap;
        y = targetRect.top + targetRect.height / 2 - cardSize.height / 2;
      } else {
        x = targetRect.left - gap - cardSize.width;
        y = targetRect.top + targetRect.height / 2 - cardSize.height / 2;
      }
      x = pad(x, gutter, vw - cardSize.width - gutter);
      y = pad(y, gutter, vh - cardSize.height - gutter);
      if (fits(x, y)) return { left: Math.round(x), top: Math.round(y), placement: p };
    }
    return {
      left: Math.round((vw - cardSize.width) / 2),
      top: Math.max(gutter, Math.round(vh - cardSize.height - gutter)),
      placement: 'bottom',
    };
  };

  const desktop = computeDesktopPosition();

  const arrowOffset = (placement: TourPlacement) => {
    if (!targetRect) return '50%';
    if (placement === 'bottom' || placement === 'top') {
      const center = targetRect.left + targetRect.width / 2 - desktop.left;
      return `${pad(center, 24, cardSize.width - 24)}px`;
    }
    const center = targetRect.top + targetRect.height / 2 - desktop.top;
    return `${pad(center, 24, cardSize.height - 24)}px`;
  };

  const arrowStyle: React.CSSProperties = (() => {
    const p = desktop.placement;
    const base: React.CSSProperties = {
      position: 'absolute',
      width: arrowSize * 2,
      height: arrowSize * 2,
      transform: 'rotate(45deg)',
      backgroundColor: 'var(--color-bg-card)',
      borderColor: 'var(--color-border)',
    };
    if (p === 'bottom') {
      base.top = -arrowSize;
      base.left = arrowOffset(p);
      base.borderLeft = '1px solid';
      base.borderTop = '1px solid';
    } else if (p === 'top') {
      base.bottom = -arrowSize;
      base.left = arrowOffset(p);
      base.borderRight = '1px solid';
      base.borderBottom = '1px solid';
    } else if (p === 'right') {
      base.left = -arrowSize;
      base.top = arrowOffset(p);
      base.borderBottom = '1px solid';
      base.borderLeft = '1px solid';
    } else {
      base.right = -arrowSize;
      base.top = arrowOffset(p);
      base.borderRight = '1px solid';
      base.borderTop = '1px solid';
    }
    return base;
  })();

  const highlightStyle: React.CSSProperties = targetRect
    ? {
        left: targetRect.left - 4,
        top: targetRect.top - 4,
        width: targetRect.width + 8,
        height: targetRect.height + 8,
        transition: prefersReduced ? undefined : 'left 300ms cubic-bezier(0.22, 1, 0.36, 1), top 300ms cubic-bezier(0.22, 1, 0.36, 1), width 300ms cubic-bezier(0.22, 1, 0.36, 1), height 300ms cubic-bezier(0.22, 1, 0.36, 1)',
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.72), 0 0 30px rgba(6, 182, 111, 0.35)',
      }
    : undefined;

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0"
      style={{ zIndex }}
      role="dialog"
      aria-modal="false"
      aria-label={step.title}
    >
      {targetRect && (
        <div
          className="pointer-events-none absolute rounded-2xl border-2 border-accent"
          style={highlightStyle}
        />
      )}
      {!targetRect && (
        <div className="pointer-events-none absolute inset-0 bg-black/70" />
      )}

      <div
        key={stepIndex}
        ref={cardRef}
        className={cn(
          'pointer-events-auto fixed z-[1] bg-bg-card border border-border/50 rounded-2xl p-5 shadow-2xl animate-fade-in',
          isDesktop ? 'w-[320px]' : 'inset-x-3 bottom-3 top-auto',
        )}
        style={isDesktop ? { left: desktop.left, top: desktop.top } : undefined}
      >
        {!isDesktop && (
          <div className="mx-auto mb-3 h-1 w-8 rounded-full bg-border" />
        )}

        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] font-black uppercase tracking-widest text-accent">
            {stepIndex + 1} / {steps.length}
          </span>
          <button
            onClick={onClose}
            className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
          >
            {labelsResolved.skip}
          </button>
        </div>

        <h3 className="text-sm md:text-base font-black text-text-primary leading-tight mb-1.5">
          {step.title}
        </h3>
        <div className="text-xs text-text-muted font-mono leading-relaxed">{step.body}</div>

        <div className="flex items-center justify-between gap-3 mt-5 pt-4">
          <button
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            disabled={isFirst}
            className="btn-secondary !py-2 px-4 text-[10px] disabled:opacity-50"
          >
            {labelsResolved.back}
          </button>
          <button
            onClick={handleNext}
            className="btn-primary !py-2 px-4 text-[10px]"
          >
            {isLast ? labelsResolved.finish : labelsResolved.next}
          </button>
        </div>

        {isDesktop && hasTarget && (
          <span className="pointer-events-none absolute" style={arrowStyle} />
        )}
      </div>
    </div>,
    document.body,
  );
};

export default SpotlightTour;
