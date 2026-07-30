import React from 'react';
import Dobia from '@/shared/components/Dobia';
import type { DobiaSize, DobiaExpression } from '@/shared/components/Dobia';
import { getCourseIconConfig } from '@/features/student/data/courses/courseIcons';

interface CourseAvatarProps {
  courseId: string;
  variant?: 'full' | 'badge';
  dobiaSize?: DobiaSize;
  expression?: DobiaExpression;
  className?: string;
}

const BADGE_CLASS = 'flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg bg-bg-card border border-accent/30 shadow-lg';

const CourseAvatar: React.FC<CourseAvatarProps> = ({
  courseId,
  variant = 'full',
  dobiaSize = 'md',
  expression = 'idle',
  className = '',
}) => {
  const iconConfig = getCourseIconConfig(courseId);

  if (!iconConfig) {
    if (variant === 'full') {
      return <Dobia expression={expression} size={dobiaSize} className={className} />;
    }
    return null;
  }

  const IconComponent = iconConfig.icon;

  if (variant === 'badge') {
    return (
      <div className={`${BADGE_CLASS} ${className}`}>
        <IconComponent className="w-3 h-3 text-accent" />
        <span className="text-[7px] font-black text-accent leading-none">{iconConfig.label}</span>
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <Dobia expression={expression} size={dobiaSize} />
      <div className={`absolute -bottom-1 -right-1 z-10 ${BADGE_CLASS}`}>
        <IconComponent className="w-3 h-3 text-accent" />
        <span className="text-[7px] font-black text-accent leading-none">{iconConfig.label}</span>
      </div>
    </div>
  );
};

export default CourseAvatar;
