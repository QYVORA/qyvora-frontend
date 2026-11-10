/**
 * ANIMATION VISUAL COMPONENTS
 * ===========================
 * 
 * Visual elements for animated diagram effects:
 * packet markers, signal rings, pulse effects.
 */

import React, { memo } from 'react';
import { motion } from 'motion/react';
import { DiagramAnimations } from '../theme/tokens';

export interface PacketMarkerProps {
  color?: string;
  size?: number;
  delay?: number;
}

/**
 * PacketMarker — Animated dot traveling along an edge
 */
export const PacketMarker = memo<PacketMarkerProps>(({
  color = 'var(--color-accent)',
  size = 8,
  delay = 0,
}) => {
  return (
    <motion.div
      className="diagram-packet"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 ${size * 1.5}px ${color}`,
        '--packet-color': color,
      } as React.CSSProperties}
      initial={{ opacity: 0, offsetDistance: '0%' }}
      animate={{
        opacity: [0, 1, 1, 0],
        offsetDistance: ['0%', '0%', '100%', '100%'],
      }}
      transition={{
        duration: DiagramAnimations.duration.packet / 1000,
        delay,
        ease: 'linear',
        repeat: Infinity,
        times: [0, 0.05, 0.95, 1],
      }}
    />
  );
});
PacketMarker.displayName = 'PacketMarker';

export interface SignalRingProps {
  color?: string;
  maxRadius?: number;
  duration?: number;
  delay?: number;
}

/**
 * SignalRing — Expanding ring for wireless signal propagation
 */
export const SignalRing = memo<SignalRingProps>(({
  color = 'var(--color-accent)',
  maxRadius = 40,
  duration = 1.5,
  delay = 0,
}) => {
  return (
    <motion.div
      className="diagram-signal"
      style={{
        borderColor: color,
        '--signal-color': color,
      } as React.CSSProperties}
      initial={{ scale: 0, opacity: 0.6 }}
      animate={{ scale: 2, opacity: 0 }}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
        repeat: Infinity,
      }}
    />
  );
});
SignalRing.displayName = 'SignalRing';

export interface PulseEffectProps {
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
  duration?: number;
}

/**
 * PulseEffect — Pulsing glow effect for active nodes
 */
export const PulseEffect = memo<PulseEffectProps>(({
  color = 'var(--color-accent)',
  intensity = 'medium',
  duration = 2,
}) => {
  const glowSize = intensity === 'low' ? 8 : intensity === 'high' ? 20 : 12;
  const opacityRange = intensity === 'low' ? [0.2, 0.4] : intensity === 'high' ? [0.4, 0.7] : [0.3, 0.5];
  
  return (
    <motion.div
      className="absolute inset-0 rounded-lg pointer-events-none"
      style={{
        boxShadow: `0 0 ${glowSize}px ${color}`,
      }}
      animate={{
        opacity: opacityRange,
      }}
      transition={{
        duration,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'reverse',
      }}
    />
  );
});
PulseEffect.displayName = 'PulseEffect';

export interface FlowLineProps {
  color?: string;
  width?: number;
  length?: number;
  speed?: number;
}

/**
 * FlowLine — Moving dashed line for data flow visualization
 */
export const FlowLine = memo<FlowLineProps>(({
  color = 'var(--color-accent)',
  width = 2,
  length = 100,
  speed = 1,
}) => {
  return (
    <motion.div
      className="absolute"
      style={{
        width: length,
        height: width,
        background: `repeating-linear-gradient(
          90deg,
          ${color},
          ${color} 8px,
          transparent 8px,
          transparent 16px
        )`,
      }}
      animate={{
        backgroundPosition: ['0px 0px', '-16px 0px'],
      }}
      transition={{
        duration: 1 / speed,
        ease: 'linear',
        repeat: Infinity,
      }}
    />
  );
});
FlowLine.displayName = 'FlowLine';

export interface ProgressIndicatorProps {
  progress: number; // 0-100
  label?: string;
  color?: string;
}

/**
 * ProgressIndicator — Visual progress bar for animation stages
 */
export const ProgressIndicator = memo<ProgressIndicatorProps>(({
  progress,
  label,
  color = 'var(--color-accent)',
}) => {
  return (
    <div className="w-full">
      {label && (
        <div className="text-xs font-mono text-text-secondary mb-2">
          {label}
        </div>
      )}
      <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
});
ProgressIndicator.displayName = 'ProgressIndicator';

export interface HighlightOverlayProps {
  show: boolean;
  color?: string;
  intensity?: number;
}

/**
 * HighlightOverlay — Overlay effect for highlighting diagram elements
 */
export const HighlightOverlay = memo<HighlightOverlayProps>(({
  show,
  color = 'var(--color-accent)',
  intensity = 0.2,
}) => {
  if (!show) return null;
  
  return (
    <motion.div
      className="absolute inset-0 rounded-lg pointer-events-none"
      style={{
        backgroundColor: color,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: intensity }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    />
  );
});
HighlightOverlay.displayName = 'HighlightOverlay';
