/**
 * AIOperator.tsx
 *
 * QYVORA AI Operator — an intelligent cybersecurity academy assistant
 * rendered as a premium SVG with lightweight, performant animations.
 *
 * The Operator represents the official QYVORA AI and lives at the
 * bottom-right of the viewport as a fixed-position floating element.
 *
 * @design Minimal, geometric, cyber-security themed aesthetic.
 * @animation Gentle float, breathing, blink, core glow, scan.
 * @accessibility Full keyboard + screen-reader support, respects reduced motion.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import styles from './AIOperator.module.css';
import {
  floatVariants,
  breatheVariants,
  coreGlowVariants,
  eyeGlowVariants,
  scanVariants,
  blinkTransition,
  BLINK_INTERVAL_MIN,
  BLINK_INTERVAL_MAX,
  entranceVariants,
  defaultTransition,
  hoverTransition,
  headTiltVariants,
} from './AIOperatorAnimations';

// ─── Type definitions ───────────────────────────────────────────────────

export type AIOperatorExpression =
  | 'neutral'
  | 'happy'
  | 'focused'
  | 'thinking'
  | 'curious'
  | 'surprised'
  | 'loading'
  | 'scanning'
  | 'success'
  | 'alert';

export interface AIOperatorProps {
  /** Character expression state */
  expression?: AIOperatorExpression;
  /** Enable/disable all animation */
  animate?: boolean;
  /** Make interactive (clickable, hover effects) */
  interactive?: boolean;
  /** Base SVG size in px */
  size?: number;
  /** Use fixed positioning */
  fixed?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional class name */
  className?: string;
}

// ─── SVG Dimensions ─────────────────────────────────────────────────────
const VIEWBOX = '0 0 480 720';
const DEFAULT_SIZE = 120;

// ─── Component ──────────────────────────────────────────────────────────

const AIOperator: React.FC<AIOperatorProps> = ({
  expression = 'neutral',
  animate = true,
  interactive = true,
  size = DEFAULT_SIZE,
  fixed = true,
  onClick,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const canAnimate = animate && !shouldReduceMotion;

  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const blinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  // ─── Blink cycle ──────────────────────────────────────────────────────
  const scheduleBlink = useCallback(() => {
    if (!canAnimate) return;
    const delay =
      BLINK_INTERVAL_MIN +
      Math.random() * (BLINK_INTERVAL_MAX - BLINK_INTERVAL_MIN);
    blinkTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setIsBlinking(true);
      setTimeout(() => {
        if (mountedRef.current) setIsBlinking(false);
        scheduleBlink();
      }, 120);
    }, delay);
  }, [canAnimate]);

  useEffect(() => {
    mountedRef.current = true;
    if (canAnimate) scheduleBlink();
    return () => {
      mountedRef.current = false;
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
    };
  }, [canAnimate, scheduleBlink]);

  // ─── Expression-based accent colors ──────────────────────────────────
  const getAccentColor = () => {
    switch (expression) {
      case 'success':
        return '#06B66F';
      case 'alert':
        return '#F59E0B';
      case 'surprised':
        return '#60A5FA';
      case 'happy':
        return '#06B66F';
      case 'scanning':
        return '#06B66F';
      case 'loading':
        return '#06B66F';
      default:
        return '#06B66F';
    }
  };

  const accentColor = getAccentColor();

  // ─── Head tilt based on expression ────────────────────────────────────
  const getHeadTilt = () => {
    switch (expression) {
      case 'curious':
        return -3;
      case 'thinking':
        return 2;
      case 'happy':
        return -2;
      case 'surprised':
        return -1;
      default:
        return 0;
    }
  };

  // ─── Eye expression adjustments ──────────────────────────────────────
  const getEyeScaleY = () => {
    switch (expression) {
      case 'surprised':
        return 1.3;
      case 'alert':
        return 1.15;
      case 'happy':
        return 0.85;
      default:
        return 1;
    }
  };

  const headTilt = getHeadTilt();
  const eyeScaleY = getEyeScaleY();

  // ─── Container position styles ────────────────────────────────────────
  const containerStyle: React.CSSProperties = fixed
    ? {
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9998,
      }
    : {};

  return (
<motion.div
      className={`${styles.container} ${className}`}
      initial={canAnimate ? 'hidden' : 'visible'}
      animate={canAnimate ? 'visible' : 'visible'}
      variants={canAnimate ? entranceVariants : undefined}
      role="button"
      tabIndex={interactive ? 0 : -1}
      aria-label="QYVORA AI Operator — I'm here if you need help"
      aria-description="Interactive cybersecurity learning assistant. Click to open the AI assistant panel."
      onClick={interactive ? onClick : undefined}
      onKeyDown={
        interactive
          ? (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      style={containerStyle}
    >
      {/* ── Tooltip ─────────────────────────────────────────────── */}
      {interactive && (
        <div className={styles.tooltip} aria-hidden="true">
          Ask me anything
        </div>
      )}

      {/* ── SVG Container ───────────────────────────────────────── */}
      <motion.div
        className={styles.svgWrapper}
        animate={
          canAnimate
            ? {
                scale: isHovered ? 1.02 : 1,
              }
            : undefined
        }
        transition={hoverTransition}
        style={{ width: size, height: size }}
      >
        <motion.div
          animate={canAnimate ? { y: [0, -4, 0] } : undefined}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: [0.22, 1, 0.36, 1],
            repeatType: 'mirror' as const,
          }}
        >
          <motion.div
            animate={canAnimate ? { scale: [1, 1.008, 1] } : undefined}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: [0.22, 1, 0.36, 1],
              repeatType: 'mirror' as const,
            }}
          >
            <svg
              viewBox={VIEWBOX}
              width={size}
              height={size}
              xmlns="http://www.w3.org/2000/svg"
              className={styles.svg}
              role="img"
              aria-labelledby="ai-operator-title ai-operator-desc"
            >
              <title id="ai-operator-title">QYVORA AI Operator</title>
              <desc id="ai-operator-desc">
                Interactive cybersecurity learning assistant.
              </desc>

              {/* ─── Antenna ──────────────────────────────────────── */}
              <g transform={`rotate(${headTilt}, 240, 360)`}>
                {/* Antenna base */}
                <rect x="234" y="38" width="12" height="14" rx="2" fill="#1a1d1a" />
                {/* Antenna stem */}
                <rect x="237" y="20" width="6" height="22" rx="3" fill="#2a2d2a" />
                {/* Antenna tip glow */}
                <motion.circle
                  cx="240"
                  cy="18"
                  r="5"
                  fill={accentColor}
                  animate={canAnimate ? { opacity: [0.6, 1, 0.6] } : undefined}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: [0.22, 1, 0.36, 1],
                    repeatType: 'mirror' as const,
                  }}
                />
                {/* Antenna glow ring */}
                <motion.circle
                  cx="240"
                  cy="18"
                  r="10"
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1"
                  opacity="0.2"
                  animate={canAnimate ? { opacity: [0.1, 0.3, 0.1], r: [10, 12, 10] } : undefined}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: [0.22, 1, 0.36, 1],
                    repeatType: 'mirror' as const,
                  }}
                />

                {/* ─── Head ────────────────────────────────────────── */}
                {/* Head base */}
                <path
                  d="M 180 120 L 300 120 Q 320 120 320 140 L 320 260 Q 320 280 300 280 L 180 280 Q 160 280 160 260 L 160 140 Q 160 120 180 120 Z"
                  fill="#0b0b0b"
                  stroke="#1a1d1a"
                  strokeWidth="2"
                />

                {/* Head top accent line */}
                <path
                  d="M 190 122 L 290 122"
                  stroke={accentColor}
                  strokeWidth="1.5"
                  opacity="0.3"
                />

                {/* ─── Visor/Faceplate ──────────────────────────────── */}
                <path
                  d="M 175 140 L 305 140 Q 315 140 315 150 L 315 230 Q 315 240 305 240 L 175 240 Q 165 240 165 230 L 165 150 Q 165 140 175 140 Z"
                  fill="#050505"
                  stroke="#2a2d2a"
                  strokeWidth="1.5"
                />

                {/* Visor inner glow */}
                <path
                  d="M 180 145 L 300 145 Q 308 145 308 153 L 308 225 Q 308 233 300 233 L 180 233 Q 172 233 172 225 L 172 153 Q 172 145 180 145 Z"
                  fill="#080808"
                  stroke={accentColor}
                  strokeWidth="0.5"
                  opacity="0.3"
                />

                {/* ─── Eyes ──────────────────────────────────────────── */}
                {/* Left eye */}
                <motion.g
                  animate={
                    canAnimate && isBlinking
                      ? { scaleY: 0.1, scaleX: 1 }
                      : { scaleY: eyeScaleY, scaleX: 1 }
                  }
                  transition={blinkTransition}
                  style={{ originX: '210px', originY: '195px' }}
                >
                  {/* Left eye socket */}
                  <rect
                    x="195"
                    y="182"
                    width="30"
                    height="26"
                    rx="4"
                    fill="#000000"
                    stroke={accentColor}
                    strokeWidth="1.5"
                    opacity="0.8"
                  />
                  {/* Left eye glow */}
                  <motion.rect
                    x="200"
                    y="187"
                    width="20"
                    height="16"
                    rx="3"
                    fill={accentColor}
                    opacity="0.15"
                    animate={canAnimate ? { opacity: [0.1, 0.25, 0.1] } : undefined}
                    transition={{
                      duration: 3.2,
                      repeat: Infinity,
                      ease: [0.22, 1, 0.36, 1],
                      repeatType: 'mirror' as const,
                    }}
                  />
                  {/* Left eye pupil */}
                  <rect
                    x="203"
                    y="190"
                    width="14"
                    height="10"
                    rx="2"
                    fill={accentColor}
                    opacity="0.9"
                  />
                  {/* Left eye highlight */}
                  <rect
                    x="206"
                    y="192"
                    width="5"
                    height="3"
                    rx="1"
                    fill="#ffffff"
                    opacity="0.4"
                  />
                </motion.g>

                {/* Right eye */}
                <motion.g
                  animate={
                    canAnimate && isBlinking
                      ? { scaleY: 0.1, scaleX: 1 }
                      : { scaleY: eyeScaleY, scaleX: 1 }
                  }
                  transition={blinkTransition}
                  style={{ originX: '270px', originY: '195px' }}
                >
                  {/* Right eye socket */}
                  <rect
                    x="255"
                    y="182"
                    width="30"
                    height="26"
                    rx="4"
                    fill="#000000"
                    stroke={accentColor}
                    strokeWidth="1.5"
                    opacity="0.8"
                  />
                  {/* Right eye glow */}
                  <motion.rect
                    x="260"
                    y="187"
                    width="20"
                    height="16"
                    rx="3"
                    fill={accentColor}
                    opacity="0.15"
                    animate={canAnimate ? { opacity: [0.1, 0.25, 0.1] } : undefined}
                    transition={{
                      duration: 3.2,
                      repeat: Infinity,
                      ease: [0.22, 1, 0.36, 1],
                      repeatType: 'mirror' as const,
                    }}
                  />
                  {/* Right eye pupil */}
                  <rect
                    x="263"
                    y="190"
                    width="14"
                    height="10"
                    rx="2"
                    fill={accentColor}
                    opacity="0.9"
                  />
                  {/* Right eye highlight */}
                  <rect
                    x="266"
                    y="192"
                    width="5"
                    height="3"
                    rx="1"
                    fill="#ffffff"
                    opacity="0.4"
                  />
                </motion.g>

                {/* ─── Mouth / Expression indicator ──────────────────── */}
                <g>
                  {expression === 'neutral' && (
                    /* Neutral: straight line */
                    <line
                      x1="225"
                      y1="215"
                      x2="255"
                      y2="215"
                      stroke={accentColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.5"
                    />
                  )}
                  {expression === 'happy' && (
                    /* Happy: subtle upward curve */
                    <path
                      d="M 228 218 Q 240 210 252 218"
                      fill="none"
                      stroke={accentColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.6"
                    />
                  )}
                  {expression === 'curious' && (
                    /* Curious: slight tilt up-right */
                    <path
                      d="M 225 215 L 255 210"
                      stroke={accentColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.5"
                    />
                  )}
                  {expression === 'thinking' && (
                    /* Thinking: small circle */
                    <circle
                      cx="240"
                      cy="216"
                      r="4"
                      fill="none"
                      stroke={accentColor}
                      strokeWidth="2"
                      opacity="0.5"
                    />
                  )}
                  {expression === 'surprised' && (
                    /* Surprised: small open oval */
                    <ellipse
                      cx="240"
                      cy="216"
                      rx="5"
                      ry="4"
                      fill="none"
                      stroke={accentColor}
                      strokeWidth="2"
                      opacity="0.6"
                    />
                  )}
                  {expression === 'alert' && (
                    /* Alert: downward V */
                    <path
                      d="M 230 212 L 240 222 L 250 212"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.7"
                    />
                  )}
                  {expression === 'success' && (
                    /* Success: checkmark */
                    <path
                      d="M 233 216 L 238 221 L 248 211"
                      fill="none"
                      stroke={accentColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.7"
                    />
                  )}
                  {expression === 'focused' && (
                    /* Focused: dash */
                    <line
                      x1="228"
                      y1="216"
                      x2="252"
                      y2="216"
                      stroke={accentColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity="0.6"
                    />
                  )}
                </g>

                {/* ─── Cheek accents (subtle) ─────────────────────────── */}
                <circle cx="185" cy="205" r="3" fill={accentColor} opacity="0.08" />
                <circle cx="295" cy="205" r="3" fill={accentColor} opacity="0.08" />

                {/* ─── Ear pieces ─────────────────────────────────────── */}
                {/* Left ear */}
                <rect x="158" y="175" width="8" height="30" rx="3" fill="#1a1d1a" stroke="#2a2d2a" strokeWidth="1" />
                <rect x="160" y="180" width="4" height="20" rx="2" fill={accentColor} opacity="0.15" />
                {/* Right ear */}
                <rect x="314" y="175" width="8" height="30" rx="3" fill="#1a1d1a" stroke="#2a2d2a" strokeWidth="1" />
                <rect x="316" y="180" width="4" height="20" rx="2" fill={accentColor} opacity="0.15" />

                {/* ─── Neck ─────────────────────────────────────────────── */}
                <rect x="225" y="280" width="30" height="20" rx="2" fill="#0b0b0b" stroke="#1a1d1a" strokeWidth="1" />
                {/* Neck rings */}
                <line x1="228" y1="288" x2="252" y2="288" stroke="#2a2d2a" strokeWidth="1" />
                <line x1="228" y1="294" x2="252" y2="294" stroke="#2a2d2a" strokeWidth="1" />

                {/* ─── Shoulders / Body ─────────────────────────────────── */}
                <path
                  d="M 160 300 L 150 340 Q 145 360 160 370 L 130 420 Q 120 440 130 460 L 350 460 Q 360 440 350 420 L 320 370 Q 335 360 330 340 L 320 300 Z"
                  fill="#0b0b0b"
                  stroke="#1a1d1a"
                  strokeWidth="1.5"
                />

                {/* Body inner panel */}
                <path
                  d="M 170 310 L 170 440 Q 170 450 180 450 L 300 450 Q 310 450 310 440 L 310 310 Z"
                  fill="#050505"
                  stroke="#1a1d1a"
                  strokeWidth="1"
                />

                {/* ─── Academy Core (Chest emblem) ──────────────────────── */}
                <g transform="translate(240, 375)">
                  {/* Core outer ring */}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="28"
                    fill="none"
                    stroke={accentColor}
                    strokeWidth="2"
                    opacity="0.3"
                    animate={canAnimate ? { opacity: [0.2, 0.5, 0.2] } : undefined}
                    transition={{
                      duration: 2.8,
                      repeat: Infinity,
                      ease: [0.22, 1, 0.36, 1],
                      repeatType: 'mirror' as const,
                    }}
                  />
                  {/* Core inner ring */}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="20"
                    fill="#080808"
                    stroke={accentColor}
                    strokeWidth="1.5"
                    opacity="0.5"
                    animate={canAnimate ? { opacity: [0.4, 0.7, 0.4] } : undefined}
                    transition={{
                      duration: 2.8,
                      repeat: Infinity,
                      ease: [0.22, 1, 0.36, 1],
                      repeatType: 'mirror' as const,
                      delay: 0.3,
                    }}
                  />
                  {/* Core center */}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="10"
                    fill={accentColor}
                    opacity="0.8"
                    animate={canAnimate ? { opacity: [0.6, 1, 0.6] } : undefined}
                    transition={{
                      duration: 2.8,
                      repeat: Infinity,
                      ease: [0.22, 1, 0.36, 1],
                      repeatType: 'mirror' as const,
                      delay: 0.6,
                    }}
                  />
                  {/* Core center dot */}
                  <circle cx="0" cy="0" r="4" fill="#ffffff" opacity="0.9" />
                  {/* Core glow effect */}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="16"
                    fill={accentColor}
                    opacity="0.08"
                    animate={canAnimate ? { opacity: [0.04, 0.12, 0.04], r: [16, 18, 16] } : undefined}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: [0.22, 1, 0.36, 1],
                      repeatType: 'mirror' as const,
                    }}
                  />
                </g>

                {/* ─── Shoulder pauldrons ──────────────────────────────── */}
                {/* Left pauldron */}
                <path
                  d="M 160 310 L 130 340 Q 125 350 135 355 L 155 345 Q 160 340 160 335 Z"
                  fill="#1a1d1a"
                  stroke="#2a2d2a"
                  strokeWidth="1"
                />
                <rect x="140" y="335" width="4" height="12" rx="2" fill={accentColor} opacity="0.15" />

                {/* Right pauldron */}
                <path
                  d="M 320 310 L 350 340 Q 355 350 345 355 L 325 345 Q 320 340 320 335 Z"
                  fill="#1a1d1a"
                  stroke="#2a2d2a"
                  strokeWidth="1"
                />
                <rect x="336" y="335" width="4" height="12" rx="2" fill={accentColor} opacity="0.15" />

                {/* ─── Body accent lines ───────────────────────────────── */}
                {/* Left side accent */}
                <line
                  x1="175"
                  y1="320"
                  x2="175"
                  y2="440"
                  stroke={accentColor}
                  strokeWidth="0.5"
                  opacity="0.15"
                />
                {/* Right side accent */}
                <line
                  x1="305"
                  y1="320"
                  x2="305"
                  y2="440"
                  stroke={accentColor}
                  strokeWidth="0.5"
                  opacity="0.15"
                />

                {/* ─── Holographic scan line ────────────────────────────── */}
                {canAnimate && (
                  <motion.rect
                    x="170"
                    y="310"
                    width="140"
                    height="2"
                    rx="1"
                    fill={accentColor}
                    opacity="0.12"
                    animate={{
                      y: ['0%', '130px', '0%'],
                      opacity: [0, 0.15, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: [0.22, 1, 0.36, 1],
                      repeatType: 'mirror' as const,
                    }}
                  />
                )}

                {/* ─── Grid lines (subtle tech pattern) ────────────────── */}
                <line x1="190" y1="320" x2="190" y2="440" stroke="#1a1d1a" strokeWidth="0.5" opacity="0.3" />
                <line x1="210" y1="320" x2="210" y2="440" stroke="#1a1d1a" strokeWidth="0.5" opacity="0.3" />
                <line x1="270" y1="320" x2="270" y2="440" stroke="#1a1d1a" strokeWidth="0.5" opacity="0.3" />
                <line x1="290" y1="320" x2="290" y2="440" stroke="#1a1d1a" strokeWidth="0.5" opacity="0.3" />

                {/* ─── Bottom status bar ───────────────────────────────── */}
                <rect
                  x="200"
                  y="460"
                  width="80"
                  height="3"
                  rx="1.5"
                  fill="#1a1d1a"
                />
                <motion.rect
                  x="200"
                  y="460"
                  width="40"
                  height="3"
                  rx="1.5"
                  fill={accentColor}
                  opacity="0.5"
                  animate={canAnimate ? { opacity: [0.3, 0.6, 0.3] } : undefined}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: [0.22, 1, 0.36, 1],
                    repeatType: 'mirror' as const,
                  }}
                />
              </g>
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AIOperator;
