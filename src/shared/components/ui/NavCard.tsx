/**
 * NavCard Component
 * TryHackMe-style navigation cards with icon on top, label below
 * Perfect for student dashboard and feature navigation
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface NavCardProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  href: string;
  isActive?: boolean;
  badge?: string | number;
  locked?: boolean;
  className?: string;
}

export const NavCard: React.FC<NavCardProps> = ({
  icon,
  label,
  description,
  href,
  isActive = false,
  badge,
  locked = false,
  className,
}) => {
  const CardWrapper = locked ? 'div' : Link;
  const wrapperProps = locked ? {} : { to: href } as const;

  return (
    <CardWrapper
      {...(wrapperProps as any)}
      className={cn(
        // Base styles
        'relative group block',
        'bg-bg-card border border-border rounded-2xl',
        'p-4 sm:p-5',
        'transition-all duration-300',
        
        // Hover & interaction states
        !locked && 'hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5',
        !locked && 'hover:scale-[1.02] active:scale-[0.98]',
        !locked && 'cursor-pointer',
        
        // Active state
        isActive && 'border-accent/50 bg-accent/5',
        
        // Locked state
        locked && 'opacity-50 cursor-not-allowed',
        
        // Accessibility
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        
        className
      )}
    >
      {/* Badge (notifications, counts, etc.) */}
      {badge !== undefined && (
        <div className="absolute top-3 right-3 min-w-[24px] h-6 px-2 flex items-center justify-center bg-accent text-bg text-xs font-bold rounded-full">
          {badge}
        </div>
      )}

      {/* Locked indicator */}
      {locked && (
        <div className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-muted"
          >
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
        </div>
      )}

      {/* Icon */}
      <div
        className={cn(
          'w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3',
          'flex items-center justify-center',
          'text-accent',
          'transition-all duration-300',
          !locked && 'group-hover:scale-110 group-hover:brightness-110',
          locked && 'text-text-muted'
        )}
      >
        {icon}
      </div>

      {/* Label */}
      <h3
        className={cn(
          'text-center font-bold text-xs sm:text-sm mb-0.5',
          'text-text-primary uppercase tracking-wide',
          'transition-colors duration-300',
          isActive && 'text-accent'
        )}
      >
        {label}
      </h3>

      {/* Description (optional) */}
      {description && (
        <p className="text-center text-[11px] text-text-secondary mt-1 leading-relaxed">
          {description}
        </p>
      )}

      {/* Hover glow effect */}
      {!locked && (
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent" />
        </div>
      )}
    </CardWrapper>
  );
};
