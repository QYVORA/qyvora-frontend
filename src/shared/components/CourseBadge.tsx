import React from 'react';
import { getCourseIconConfig } from '@/features/student/data/courses';
import { getCourseById } from '@/features/student/data/courses';

interface CourseBadgeProps {
  courseId: string;
  className?: string;
}

const BADGE_BG = '#0c1222';
const BADGE_BG_INNER = '#080e1a';

const CATEGORY_RING_COLORS: Record<string, string> = {
  terminal:     '#06B66F',
  networking:   '#3B82F6',
  programming:  '#FBBF24',
  'web-security': '#EF4444',
  wireless:     '#F97316',
  tools:        '#14B8A6',
};

const DEFAULT_RING_COLOR = '#06B66F';

/**
 * Generates tick-mark SVG elements radiating outward at regular angular intervals.
 * Creates a compass/scope-like aesthetic around the badge ring.
 */
function TickMarks({ color }: { color: string }) {
  const ticks = [];
  const count = 24;
  for (let i = 0; i < count; i++) {
    const angle = (i * 360) / count;
    const rad = (angle * Math.PI) / 180;
    const isMajor = i % 6 === 0;
    const innerR = isMajor ? 89 : 91;
    const outerR = 95;
    const x1 = 100 + innerR * Math.cos(rad);
    const y1 = 100 + innerR * Math.sin(rad);
    const x2 = 100 + outerR * Math.cos(rad);
    const y2 = 100 + outerR * Math.sin(rad);
    ticks.push(
      <line
        key={`tick-${i}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={isMajor ? 1.8 : 0.8}
        opacity={isMajor ? 0.7 : 0.35}
        strokeLinecap="round"
      />
    );
  }
  return <>{ticks}</>;
}

/**
 * Circular cybersecurity insignia badge for course cards.
 *
 * Transforms the existing course SVG icon into a collectible security badge:
 * thick colored outer ring with tick marks → secondary decorative ring →
 * dark circular interior → inner boundary → course illustration.
 * The ring color is determined by the course's category.
 */
const CourseBadge: React.FC<CourseBadgeProps> = ({ courseId, className = '' }) => {
  const config = getCourseIconConfig(courseId);
  if (!config) return null;

  const course = getCourseById(courseId);
  const ringColor = CATEGORY_RING_COLORS[course?.categoryId || ''] || DEFAULT_RING_COLOR;
  const Icon = config.icon;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      role="img"
      aria-label="Course badge"
    >
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        {/* Outer thick ring — establishes the badge silhouette */}
        <circle cx="100" cy="100" r="94" stroke={ringColor} strokeWidth="12" fill="none" />

        {/* Tick marks — compass/scope aesthetic around the ring */}
        <TickMarks color={ringColor} />

        {/* Secondary decorative ring — thin, adds depth */}
        <circle cx="100" cy="100" r="85" stroke={ringColor} strokeWidth="1" fill="none" opacity="0.25" />

        {/* Dark circular interior — contrast field for the artwork */}
        <circle cx="100" cy="100" r="82" fill={BADGE_BG} />

        {/* Inner gradient ring — subtle radial depth */}
        <circle cx="100" cy="100" r="82" fill="none" stroke={BADGE_BG_INNER} strokeWidth="8" opacity="0.4" />

        {/* Inner boundary ring — separates outer structure from artwork */}
        <circle cx="100" cy="100" r="74" stroke={ringColor} strokeWidth="0.8" fill="none" opacity="0.3" />

        {/* Cardinal accent dots — N/S/E/W positions */}
        <circle cx="100" cy="16" r="2" fill={ringColor} opacity="0.55" />
        <circle cx="100" cy="184" r="2" fill={ringColor} opacity="0.55" />
        <circle cx="16" cy="100" r="2" fill={ringColor} opacity="0.55" />
        <circle cx="184" cy="100" r="2" fill={ringColor} opacity="0.55" />

        {/* Intercardinal accent dots — NE/SE/SW/NW */}
        <circle cx="33.5" cy="33.5" r="1.2" fill={ringColor} opacity="0.25" />
        <circle cx="166.5" cy="33.5" r="1.2" fill={ringColor} opacity="0.25" />
        <circle cx="33.5" cy="166.5" r="1.2" fill={ringColor} opacity="0.25" />
        <circle cx="166.5" cy="166.5" r="1.2" fill={ringColor} opacity="0.25" />

        {/* Subtle radial lines — structural detail at cardinal axes */}
        <line x1="100" y1="22" x2="100" y2="30" stroke={ringColor} strokeWidth="0.5" opacity="0.2" />
        <line x1="100" y1="170" x2="100" y2="178" stroke={ringColor} strokeWidth="0.5" opacity="0.2" />
        <line x1="22" y1="100" x2="30" y2="100" stroke={ringColor} strokeWidth="0.5" opacity="0.2" />
        <line x1="170" y1="100" x2="178" y2="100" stroke={ringColor} strokeWidth="0.5" opacity="0.2" />

        {/* Inner arc accents — quarter-circle details at intercardinal positions */}
        <path d="M 60 60 A 40 40 0 0 1 74 48" fill="none" stroke={ringColor} strokeWidth="0.6" opacity="0.15" />
        <path d="M 140 60 A 40 40 0 0 0 126 48" fill="none" stroke={ringColor} strokeWidth="0.6" opacity="0.15" />
        <path d="M 60 140 A 40 40 0 0 0 74 152" fill="none" stroke={ringColor} strokeWidth="0.6" opacity="0.15" />
        <path d="M 140 140 A 40 40 0 0 1 126 152" fill="none" stroke={ringColor} strokeWidth="0.6" opacity="0.15" />
      </svg>

      {/* Course SVG illustration — centered, with subtle glow for depth */}
      <div className="relative z-10 flex items-center justify-center w-[52%] h-[52%]">
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-md"
          style={{ backgroundColor: ringColor }}
        />
        <Icon className="relative w-full h-full text-white" />
      </div>
    </div>
  );
};

export default CourseBadge;
