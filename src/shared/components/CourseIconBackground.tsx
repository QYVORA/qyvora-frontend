import React from 'react';
import { getCourseIconConfig } from '@/features/student/data/courses';

interface CourseIconBackgroundProps {
  courseId: string;
  className?: string;
}

/**
 * Decorative full-bleed course icon layer for course cards.
 *
 * Renders the course's traced icon as a large, centered background
 * illustration behind the card content. Uses `fill="currentColor"` so the
 * subdued tint follows each theme; sizing keeps the icon's native aspect
 * ratio (`preserveAspectRatio="meet"`) so landscape icons like Burp Suite
 * are never distorted, and `max-w/max-h` keep a comfortable margin.
 */
const CourseIconBackground: React.FC<CourseIconBackgroundProps> = ({ courseId, className = '' }) => {
  const config = getCourseIconConfig(courseId);
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 flex items-center justify-center text-accent/25 ${className}`}
    >
      <Icon className="w-full h-full max-w-[70%] max-h-[70%]" />
    </div>
  );
};

export default CourseIconBackground;
