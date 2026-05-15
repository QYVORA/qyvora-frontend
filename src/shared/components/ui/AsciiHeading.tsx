import React, { useEffect, useState, useMemo } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import figlet from 'figlet';
import { cn } from '../../../shared/utils/cn';

// ── Available figlet fonts ──────────────────────────────────────────────────
const FONT_OPTIONS = [
  'Standard', 'Ghost', '3-D', 'Acrobatic', 'Big Money-ne',
  'Cybermedium', 'Digital', 'Doh', 'Isometric1',
  'JS Block Letters', 'Kban', 'Larry3d', 'Marquee',
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

const AsciiHeading: React.FC<AsciiHeadingProps> = ({
  text, font = 'ANSI Shadow', className = '', preClassName = '',
  align = 'center', compact = false, responsive = true,
  glow = 'normal', animated = true, animationDuration = 800,
  animationDelay = 0, color, disabled = false, static: isStatic = false,
}) => {
  const [asciiText, setAsciiText] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const normalizedFont = useMemo(() => normalizeFont(font), [font]);

  useEffect(() => {
    let isMounted = true;
    setIsLoaded(false);

    const fontUrl = `${FONT_BASE_URL}${normalizedFont}.flf`;

    fetch(fontUrl)
      .then(response => response.text())
      .then(fontData => {
        if (!isMounted) return;
        
        figlet.parseFont(normalizedFont, fontData);
        
        figlet.text(text, {
          font: normalizedFont as any,
          horizontalLayout: 'default',
          verticalLayout: 'default',
          width: 120,
          whitespaceBreak: false,
        }, (err, data) => {
          if (isMounted) {
            if (err) {
              console.error('Figlet generation error:', err);
              setAsciiText(text);
            } else {
              setAsciiText(data || text);
            }
            setIsLoaded(true);
          }
        });
      })
      .catch(err => {
        console.error('Font loading error:', err);
        if (isMounted) {
          setAsciiText(text);
          setIsLoaded(true);
        }
      });

    return () => { isMounted = false; };
  }, [text, normalizedFont]);

  const outerRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(outerRef, { once: true, amount: 0.15 });
  const shouldReduceMotion = useReducedMotion();
  const minimizeEffects = shouldReduceMotion;

  if (disabled) {
    return (
      <h1
        className={cn(
          'font-mono font-black text-text-primary leading-tight tracking-tight',
          compact ? 'text-2xl md:text-3xl' : 'text-4xl md:text-6xl',
          className,
        )}
        style={{ textAlign: align as React.CSSProperties['textAlign'] }}
      >
        {text}
      </h1>
    );
  }

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
    if (!responsive) return { fontSize: compact ? '14px' : '24px' };
    return {
      fontSize: compact 
        ? 'clamp(10px, 1.6vw, 22px)' 
        : 'clamp(12px, 2.4vw, 38px)', 
      lineHeight: 1.05,
    };
  }, [compact, responsive]);

  const shouldAnimate = animated && !isStatic && isLoaded && !!asciiText && !minimizeEffects;

  const inner = (
    <pre
      className={cn(
        'ascii-heading ascii-text-beam whitespace-pre select-none transition-opacity duration-500 overflow-visible no-scrollbar m-0 p-0',
        !isLoaded ? 'opacity-0' : 'opacity-100',
        preClassName,
        glow !== 'none' && 'ascii-heading-glow',
        align === 'center' ? 'mx-auto w-fit' : '',
        align === 'left' ? 'text-left ml-0' : '',
        align === 'right' ? 'text-right ml-auto w-fit' : '',
        className,
      )}
      style={{
        ...sizeStyle,
        fontFamily: '"JetBrains Mono", "Courier New", monospace',
        color: color || undefined,
        textShadow: glowConfig.shadow === 'none' ? undefined : glowConfig.shadow,
        ['--ascii-glow-color' as string]: color || 'var(--color-accent)',
        ['--ascii-glow-intensity' as string]: glowConfig.intensity,
      } as React.CSSProperties}
      aria-label={text}
      role="heading"
      aria-level={1}
    >
      {asciiText}
    </pre>
  );

  if (shouldAnimate) {
    return (
      <motion.div
        ref={outerRef}
        className={cn('ascii-heading-wrapper overflow-hidden', className)}
        initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
        animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 16, filter: 'blur(4px)' }}
        transition={{
          duration: Math.min(animationDuration / 1000, 1.2),
          delay: animationDelay / 1000,
          ease: [0.16, 1, 0.3, 1],
          filter: { duration: Math.min(animationDuration / 1000 * 0.6, 0.5) },
        }}
        style={{ textAlign: align as React.CSSProperties['textAlign'] }}
      >
        {inner}
      </motion.div>
    );
  }

  return (
    <div
      ref={outerRef}
      className={cn('ascii-heading-wrapper overflow-hidden', className)}
      style={{ textAlign: align as React.CSSProperties['textAlign'] }}
    >
      {inner}
    </div>
  );
};

export default AsciiHeading;
