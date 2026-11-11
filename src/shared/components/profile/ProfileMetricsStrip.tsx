import React from 'react';
import StatStrip, { type StatStripCell } from '@/shared/components/ui/StatStrip';

interface ProfileMetricsStripProps {
  metrics: StatStripCell[];
  className?: string;
}

/**
 * Profile metrics — one five-cell StatStrip, no section header.
 * Kept as a thin alias so both profile pages share the exact composition.
 */
const ProfileMetricsStrip: React.FC<ProfileMetricsStripProps> = ({ metrics, className }) => (
  <StatStrip cells={metrics} label="Profile statistics" className={className} />
);

export default ProfileMetricsStrip;
