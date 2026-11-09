import type { FC } from 'react';
import LabBadge from '@/shared/components/LabBadge';

interface CourseBadgeProps {
  courseId: string;
  className?: string;
  glow?: boolean;
}

/** Compatibility wrapper for profile surfaces that still use the old name. */
const CourseBadge: FC<CourseBadgeProps> = ({ courseId, className = '', glow = true }) => (
  <LabBadge labId={courseId} className={className} glow={glow} />
);

export default CourseBadge;
