/**
 * AsciiHeading.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders figlet ASCII art headings that scale to fit any container width.
 *
 * Key design decisions
 * ────────────────────
 * 1. Scale-then-measure pattern: temporarily force scale(1) before reading
 *    scrollWidth so measurements are always the natural unscaled size.
 * 2. Explicit container height: compensates for CSS transform not affecting
 *    layout flow. Only applied when fitScale < 1.
 * 3. Alignment via marginLeft math — always scale from origin 0 0.
 * 4. Mobile font fallback: wide/tall fonts swap to ANSI Shadow on ≤ 639 px.
 * 5. Error fallback is a styled <h1>, never a raw unstyled <pre>.
 * 6. Font data cached at module scope — fetched once per font per page load.
 */

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
// Import the callable AND the type namespace separately so both work.
import figletModule from 'figlet';
import type { FigletOptions, FontName as FigletFontName } from 'figlet';
import { cn } from '../../../shared/utils/cn';

// Vite/ESM interop: figlet ships as CommonJS. In some bundler configs the
// callable lands on `.default`; in others it IS the default. Normalise once.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const figlet = ((figletModule as any).default ?? figletModule) as typeof figletModule;

// ── Font catalogue ────────────────────────────────────────────────────────────
const FONT_OPTIONS = [
  'Standard', 'Ghost', '3-D', 'Acrobatic', 'Big Money-ne',
  'Cybermedium', 'Digital', 'Doh', 'Isometric1',
  'JS Block Letters', 'Kban', 'Larry 3D', 'Marquee',
  'Maxfour', 'Ogre', 'Poison', 'Red Phoenix', 'Rounded',
  'Shadow', 'Slant', 'Small', 'Soft', 'Speed',
  'Star Wars', 'Stellar', 'Term', 'Tiles', 'Twisted', 'Uppercase',
  'ANSI Shadow', 'Colossal', 'Bloody', 'Slant Relief',
] as const;

type FontName = typeof FONT_OPTIONS[number];

/**
 * Fonts too wide/tall to be legible when crushed on mobile.
 * Automatically swapped to ANSI Shadow on screens ≤ 639 px.
 */
const WIDE_FONTS = new Set<string>([
  'Larry 3D', 'Isometric1', 'Doh', 'Big Money-ne', 'Colossal',
  '3-D', 'Acrobatic', 'JS Block Letters', 'Slant Relief',
]);

// ── Props ─────────────────────────────────────────────────────────────────────
interface AsciiHeadingProps {
  text: string;
  font?: FontName;
  className?: string;
  preClassName?: string;
  align?: 'left' | 'center' | 'right';
  compact?: boolean;
  responsive?: boolean;
  glow?: 'none' | 'subtle' | 'normal' | 'intense' | 'extreme';
  animated?: boolean;
  animationDuration?: number;
  animationDelay?: number;
  color?: string;
  disabled?: boolean;
  /** Skips the motion entry animation entirely */
  static?: boolean;
}

// ── Font loading helpers (module-scoped) ──────────────────────────────────────
const FONT_BASE_URL = 'https://cdn.jsdelivr.net/npm/figlet@1.11.0/fonts/';
const fontFetchCache: Record<string, Promise<string>> = {};
const parsedFonts = new Set<string>();

function loadFont(fontName: string): Promise<string> {
  if (!fontFetchCache[fontName]) {
    fontFetchCache[fontName] = fetch(
      `${FONT_BASE_URL}${encodeURIComponent(fontName)}.flf`,
    ).then(res => {
      if (!res.ok) throw new Error(`figlet font fetch failed: ${fontName}`);
      return res.text();
    });
  }
  return fontFetchCache[fontName];
}

async function renderFiglet(text: string, fontName: string): Promise<string> {
  const data = await loadFont(fontName);
  if (!parsedFonts.has(fontName)) {
    figlet.parseFont(fontName, data);
    parsedFonts.add(fontName);
  }

  const opts: FigletOptions = {
    font: fontName as FigletFontName,
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 500,
    whitespaceBreak: false,
  };

  return new Promise<string>((resolve, reject) => {
    figlet.text(text, opts, (err, result) => {
      if (err || !result) reject(err ?? new Error('figlet returned empty'));
      else resolve(result);
    });
  });
}

function normalizeFont(name: string | undefined): string {
  if (!name) return 'ANSI Shadow';
  const hit = FONT_OPTIONS.find(f => f.toLowerCase() === name.toLowerCase());
  return hit ?? 'ANSI Shadow';
}

// ── Component ─────────────────────────────────────────────────────────────────
const AsciiHeading: React.FC<AsciiHeadingProps> = ({
  text,
  font = 'ANSI Shadow',
  className = '',
  preClassName = '',
  align = 'center',
  compact = false,
  responsive = true,
  glow = 'normal',
  animated = true,
  animationDuration = 800,
  animationDelay = 0,
  color,
  disabled = false,
  static: isStatic = false,
}) => {
  const [asciiText, setAsciiText] = useState<string | null>(null);
  const [isLoaded, setIsLoaded]   = useState(false);
  const [error, setError]         = useState(false);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 639px)').matches
      : false,
  );

  const [fitScale, setFitScale]               = useState(1);
  const [visualWidth, setVisualWidth]         = useState<number | null>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  const outerRef = useRef<HTMLDivElement>(null);
  const preRef   = useRef<HTMLPreElement>(null);

  // ── Effective font (mobile fallback) ─────────────────────────────────────────
  const normalizedFont = useMemo(() => normalizeFont(font), [font]);

  const effectiveFont = useMemo(
    () => (isMobile && WIDE_FONTS.has(normalizedFont) ? 'ANSI Shadow' : normalizedFont),
    [isMobile, normalizedFont],
  );

  // ── Font loading ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (disabled) return;

    let cancelled = false;

    const timeoutId = setTimeout(() => {
      if (!cancelled) {
        setError(true);
        setAsciiText(text);
        setIsLoaded(true);
      }
    }, 4000);

    renderFiglet(text, effectiveFont)
      .then(result => {
        if (cancelled) return;
        clearTimeout(timeoutId);
        setError(false);
        setAsciiText(result);
        setIsLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        clearTimeout(timeoutId);
        setError(true);
        setAsciiText(text);
        setIsLoaded(true);
      });

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [text, effectiveFont, disabled]);

  // ── Breakpoint watcher ────────────────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // ── Scale measurement ─────────────────────────────────────────────────────────
  useLayoutEffect(() => {
    if (!responsive || disabled || error || !asciiText) return;

    let rafId = 0;

    const measure = () => {
      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        const outer = outerRef.current;
        const pre   = preRef.current;
        if (!outer || !pre) return;

        const availableWidth = outer.getBoundingClientRect().width;
        if (availableWidth <= 0) return;

        // Reset to natural scale before measuring to avoid compounding drift
        const savedTransform = pre.style.transform;
        const savedOrigin    = pre.style.transformOrigin;
        pre.style.transform       = 'scale(1)';
        pre.style.transformOrigin = '0 0';

        const naturalWidth  = pre.scrollWidth;
        const naturalHeight = pre.scrollHeight;

        pre.style.transform       = savedTransform;
        pre.style.transformOrigin = savedOrigin;

        if (naturalWidth <= 0) return;

        const MIN_SCALE = 0.08;
        const nextScale = Math.min(
          1,
          Math.max(MIN_SCALE, (availableWidth - 48) / naturalWidth),
        );
        const nextVisualWidth = naturalWidth * nextScale;

        setFitScale(prev => (Math.abs(prev - nextScale) > 0.004 ? nextScale : prev));
        setVisualWidth(nextVisualWidth);

        if (nextScale < 1) {
          setContainerHeight(Math.ceil(naturalHeight * nextScale));
        } else {
          setContainerHeight(null);
        }
      });
    };

    measure();

    const ro = new ResizeObserver(measure);
    if (outerRef.current) ro.observe(outerRef.current);
    window.addEventListener('resize', measure);

    return () => {
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [asciiText, responsive, disabled, error, isMobile]);

  const baseFontSize = compact ? (isMobile ? '8px' : '12px') : (isMobile ? '12px' : '16px');

  // Desktop color override: No longer forcing white, allowing theme/accent colors
  const desktopColorOverride = undefined;

  const marginLeft =
    align === 'center'
      ? visualWidth !== null ? `calc(50% - ${visualWidth / 2}px)` : '0'
      : align === 'right'
      ? visualWidth !== null ? `calc(100% - ${visualWidth}px)` : '0'
      : '0';

  // ── Mobile "Cyber-Prompt" Heading ───────────────────────────────────────────
  if (isMobile && !disabled) {
    return (
      <div className={cn('py-2 border-l-2 border-accent/20 pl-4 mb-4', className)}>
        <h1
          className={cn(
            'font-mono font-black uppercase tracking-tighter text-2xl sm:text-3xl leading-none',
            'ascii-text-beam ascii-text-beam-fast',
          )}
          style={{ color: color || 'inherit' }}
        >
          <span className="text-accent/60 mr-2 opacity-70 select-none">{">"}</span>
          {text}
        </h1>
        {!compact && (
          <div className="text-[9px] font-mono text-text-muted mt-2 opacity-50 flex items-center gap-2 tracking-widest uppercase select-none">
            <span className="inline-block w-1 h-1 rounded-full bg-accent/80 animate-pulse" />
            <span>System.Ready</span>
            <span className="opacity-30">//</span>
            <span>ID: {text.replace(/\s+/g, '_').toUpperCase()}</span>
          </div>
        )}
      </div>
    );
  }

  // ── Error / disabled fallback ─────────────────────────────────────────────────
  if (disabled || (isLoaded && error)) {
    return (
      <h1
        className={cn(
          'font-mono font-black text-text-primary leading-tight tracking-tight',
          compact ? 'text-2xl md:text-3xl' : 'text-4xl md:text-6xl',
          className,
        )}
        style={{
          textAlign: align as React.CSSProperties['textAlign'],
          color: color || 'inherit',
        }}
      >
        {text}
      </h1>
    );
  }

  return (
    <div
      ref={outerRef}
      className={cn('ascii-heading-wrapper w-full', className)}
      style={{
        height: containerHeight !== null ? `${containerHeight}px` : undefined,
      }}
    >
      <pre
        ref={preRef}
        className={cn(
          'ascii-heading ascii-text-beam ascii-text-beam-fast whitespace-pre select-none m-0 p-0 overflow-visible',
          preClassName,
        )}
        style={{
          fontFamily: '"JetBrains Mono", "Courier New", monospace',
          fontSize: baseFontSize,
          lineHeight: 1.0,
          color: desktopColorOverride || color || 'var(--color-text-primary)',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.4s ease',
          transform: `scale(${fitScale})`,
          transformOrigin: '0 0',
          display: 'inline-block',
          marginLeft,
        } as React.CSSProperties}
        aria-label={text}
        role="heading"
        aria-level={1}
      >
        {asciiText ?? ''}
      </pre>
    </div>
  );
};

export default AsciiHeading;