import React from 'react';
import { getCourseIconConfig } from '@/features/student/data/courses';

interface CourseBadgeProps {
  courseId: string;
  className?: string;
}

const BADGE_BG = '#0c1222';
const RING_COLOR = '#06B66F';

/**
 * Circular cybersecurity insignia badge for course cards.
 *
 * Wraps the existing course SVG icon inside a proper badge structure:
 * thick colored outer ring → dark circular interior → subtle inner ring →
 * course illustration. The existing course artwork is preserved and rendered
 * in white against the dark disc for strong contrast.
 */
const CourseBadge: React.FC<CourseBadgeProps> = ({ courseId, className = '' }) => {
  const config = getCourseIconConfig(courseId);
  if (!config) return null;

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
        <circle cx="100" cy="100" r="94" stroke={RING_COLOR} strokeWidth="12" fill="none" />
        <circle cx="100" cy="100" r="88" fill={BADGE_BG} />
        <circle cx="100" cy="100" r="82" stroke={`${RING_COLOR}4D`} strokeWidth="1.5" fill="none" />
        <circle cx="100" cy="18" r="2.5" fill={RING_COLOR} opacity="0.6" />
        <circle cx="100" cy="182" r="2.5" fill={RING_COLOR} opacity="0.6" />
        <circle cx="18" cy="100" r="2.5" fill={RING_COLOR} opacity="0.6" />
        <circle cx="182" cy="100" r="2.5" fill={RING_COLOR} opacity="0.6" />
      </svg>
      <div className="relative z-10 flex items-center justify-center w-[52%] h-[52%]">
        <Icon className="w-full h-full text-white" />
      </div>
    </div>
  );
};

export default CourseBadge;
