import React from 'react';

type SkeletonVariant = 'text' | 'card' | 'icon' | 'image' | 'title' | 'stat-value';

interface SkeletonProps {
  className?: string;
  variant?: SkeletonVariant;
}

const variantClasses: Record<SkeletonVariant, string> = {
  text: 'h-3 w-full rounded',
  card: 'h-32 w-full rounded-2xl',
  icon: 'h-12 w-12 rounded-2xl',
  image: 'aspect-video w-full rounded-2xl',
  title: 'h-6 w-3/4 rounded-lg',
  'stat-value': 'h-10 w-32 rounded-lg',
};

const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'text' }) => (
  <div
    className={`animate-pulse bg-border/30 ${variantClasses[variant]} ${className}`}
    aria-hidden="true"
  />
);

export default Skeleton;
