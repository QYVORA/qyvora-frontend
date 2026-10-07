export type ProgramBadgeVariant = 'qose' | 'hpb' | 'generic';

export interface BadgeBaseProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  title?: string;
  ariaLabel?: string;
  downloadable?: boolean;
  downloadFilename?: string;
}
