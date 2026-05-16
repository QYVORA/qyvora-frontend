import React, { useEffect, useLayoutEffect, useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import figlet from 'figlet';
import { cn } from '../../../shared/utils/cn';

// ── Available figlet fonts ──────────────────────────────────────────────────
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
  static?: boolean;
}

function normalizeFont(name: string | undefined): string {
  if (!name) return 'ANSI Shadow';
  const found = FONT_OPTIONS.find(f => f.toLowerCase() === name.toLowerCase());
  if (found) return found;
  return 'ANSI Shadow';
}

const FONT_BASE_URL = 'https://cdn.jsdelivr.net/npm/figlet@1.11.0/fonts/';

// Global cache for font data to prevent redundant fetches
const fontDataCache: Record<string, Promise<string>> = {};
// Set of fonts already parsed by figlet
const parsedFonts = new Set<string>();

const AsciiHeading: React.FC<AsciiHeadingProps> = ({
  text, font = 'ANSI Shadow', className = '', preClassName = '',
  align = 'center', compact = false, responsive = true,
  glow = 'normal', animated = true, animationDuration = 800,
  animationDelay = 0, color, disabled = false, static: isStatic = false,
}) => {
  const [asciiText, setAsciiText] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia('(max-width: 639px)').matches,
  );

  const normalizedFont = useMemo(() => normalizeFont(font), [font]);

  useEffect(() => {
    let isMounted = true;
    
    // Set a timeout to ensure we don't wait forever
    const timer = setTimeout(() => {
      if (isMounted && !isLoaded) {
        setIsLoaded(true);
      }
    }, 2000);

    const loadAndRender = async () => {
      try {
        if (!fontDataCache[normalizedFont]) {
          fontDataCache[normalizedFont] = fetch(`${FONT_BASE_URL}${encodeURIComponent(normalizedFont)}.flf`)
            .then(res => {
              if (!res.ok) throw new Error('Font download failed');
              return res.text();
            });
        }

        const fontData = await fontDataCache[normalizedFont];
        if (!isMounted) return;

        if (!parsedFonts.has(normalizedFont)) {
          figlet.parseFont(normalizedFont, fontData);
          parsedFonts.add(normalizedFont);
        }

        figlet.text(text, {
          font: normalizedFont as any,
          horizontalLayout: 'default',
          verticalLayout: 'default',
          width: 500,
          whitespaceBreak: false,
        }, (err, data) => {
          if (isMounted) {
            clearTimeout(timer);
            if (err) {
              console.error('Figlet generation error:', err);
              setError(true);
              setAsciiText(text);
            } else {
              setAsciiText(data || text);
            }
            setIsLoaded(true);
          }
        });
      } catch (err) {
        console.error('Font loading error:', err);
        if (isMounted) {
          clearTimeout(timer);
          setError(true);
          setAsciiText(text);
          setIsLoaded(true);
        }
      }
    };

    void loadAndRender();

    return () => { isMounted = false; clearTimeout(timer); };
  }, [text, normalizedFont]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px)');
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    setIsMobile(media.matches);
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  const outerRef = React.useRef<HTMLDivElement>(null);
  const preRef = React.useRef<HTMLPreElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const [mobileHeight, setMobileHeight] = useState<number | null>(null);
  const fitScaleRef = React.useRef(1);
  const shouldReduceMotion = useReducedMotion();
  const minimizeEffects = shouldReduceMotion;

  useLayoutEffect(() => {
    if (!responsive || disabled || error) return undefined;

    let frame = 0;
    const measure = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const outer = outerRef.current;
        const pre = preRef.current;
        if (!outer || !pre) return;

        const available = outer.clientWidth;
        if (!available) return;

        const unscaledWidth = isMobile
          ? pre.scrollWidth
          : pre.scrollWidth / Math.max(fitScaleRef.current, 0.01);
        const minScale = isMobile ? 0.08 : 0.32;
        const nextScale = Math.min(1, Math.max(minScale, (available - 2) / Math.max(unscaledWidth, 1)));
        setMobileHeight(isMobile ? Math.ceil(pre.scrollHeight * nextScale) : null);
        setFitScale(prev => {
          if (Math.abs(prev - nextScale) <= 0.01) return prev;
          fitScaleRef.current = nextScale;
          return nextScale;
        });
      });
    };

    fitScaleRef.current = 1;
    setFitScale(1);
    measure();

    const resizeObserver = new ResizeObserver(measure);
    if (outerRef.current) resizeObserver.observe(outerRef.current);
    if (preRef.current) resizeObserver.observe(preRef.current);
    window.addEventListener('resize', measure);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [asciiText, disabled, error, isMobile, responsive, text]);

  const glowConfig = useMemo(() => {
    const baseColor = color || 'var(--color-accent)';
    const configs: Record<string, { shadow: string; intensity: number }> = {
      none:    { shadow: 'none', intensity: 0 },
      subtle:  { shadow: `0 0 8px ${baseColor}40, 0 0 20px ${baseColor}20`, intensity: 0.3 },
      normal:  { shadow: `0 0 12px ${baseColor}60, 0 0 40px ${baseColor}30, 0 0 80px ${baseColor}15`, intensity: 0.6 },
      intense: { shadow: `0 0 16px ${baseColor}80, 0 0 60px ${baseColor}40, 0 0 120px ${baseColor}20, 0 0 200px ${baseColor}08`, intensity: 0.9 },
      extreme: { shadow: `0 0 20px ${baseColor}90, 0 0 80px ${baseColor}50, 0 0 160px ${baseColor}30, 0 0 300px ${baseColor}10`, intensity: 1 },
    };
    return configs[glow] || configs.normal;
  }, [glow, color]);

  const sizeStyle = useMemo(() => {
    const baseSize = isMobile ? (compact ? '8px' : '10px') : (compact ? '12px' : '16px');
    const lineHeight = 1.0;
    if (!responsive) return { fontSize: compact ? '9px' : '15px', lineHeight: 1.0 };
    if (isMobile) {
      return {
        fontSize: baseSize,
        lineHeight,
        transform: `scale(${fitScale})`,
        transformOrigin: align === 'right' ? 'top right' : align === 'center' ? 'top center' : 'top left',
        width: 'max-content',
        maxWidth: 'none',
      };
    }
    return {
      fontSize: `calc(${baseSize} * ${fitScale})`,
      lineHeight,
    };
  }, [align, compact, fitScale, isMobile, responsive]);

  // Render high-quality normal text if disabled or if figlet failed
  if (disabled || (isLoaded && error)) {
    return (
      <h1
        ref={outerRef}
        className={cn(
          'font-mono font-black text-text-primary leading-tight tracking-tight transition-all duration-500',
          compact ? 'text-2xl md:text-3xl' : 'text-4xl md:text-6xl',
          className,
        )}
        style={{ 
          textAlign: align as React.CSSProperties['textAlign'],
          color: color || 'var(--color-accent)',
          textShadow: glow === 'none' ? 'none' : `0 0 12px ${color || 'var(--color-accent)'}60`,
        }}
      >
        {text}
      </h1>
    );
  }

  const shouldAnimate = animated && !isStatic && !minimizeEffects;

  const inner = (
    <pre
      ref={preRef}
      className={cn(
        'ascii-heading ascii-text-beam whitespace-pre select-none transition-all duration-500 overflow-hidden no-scrollbar m-0 p-0 max-w-full',
        preClassName,
        glow !== 'none' && 'ascii-heading-glow',
        isMobile && 'ascii-heading-mobile',
        align === 'center' ? 'mx-auto w-fit' : '',
        align === 'left' ? 'text-left ml-0' : '',
        align === 'right' ? 'text-right ml-auto w-fit' : '',
      )}
      style={{
        ...sizeStyle,
        fontFamily: '"JetBrains Mono", "Courier New", monospace',
        color: color || (glow !== 'none' ? 'var(--color-accent)' : 'var(--color-text-primary)'),
        textShadow: glowConfig.shadow === 'none' ? undefined : glowConfig.shadow,
        opacity: isLoaded ? 1 : 0,
        ['--ascii-glow-color' as string]: color || 'var(--color-accent)',
        ['--ascii-glow-intensity' as string]: glowConfig.intensity,
      } as React.CSSProperties}
      aria-label={text}
      role="heading"
      aria-level={1}
    >
      {asciiText || text}
    </pre>
  );

  return (
    <motion.div
      ref={outerRef}
      className={cn('ascii-heading-wrapper overflow-hidden', className)}
      initial={shouldAnimate ? { opacity: 0, y: 16, filter: 'blur(4px)' } : { opacity: 1, y: 0 }}
      whileInView={shouldAnimate ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: Math.min(animationDuration / 1000, 1.2),
        delay: animationDelay / 1000,
        ease: [0.16, 1, 0.3, 1],
        filter: { duration: Math.min(animationDuration / 1000 * 0.6, 0.5) },
      }}
      style={{
        textAlign: align as React.CSSProperties['textAlign'],
        height: isMobile && mobileHeight ? `${mobileHeight}px` : undefined,
      }}
    >
      {inner}
    </motion.div>
  );
};

export default AsciiHeading;
