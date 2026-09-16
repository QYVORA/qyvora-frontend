import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface TextLinkProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * Canonical inline text link. Underlined accent, visible focus state, and the
 * global 44px touch-target floor. Use for prose links and quiet secondary
 * actions; use <Button> whenever the link is a primary/segmented action.
 */
const TextLink: React.FC<TextLinkProps> = ({
  children,
  to,
  href,
  external,
  onClick,
  className,
  ariaLabel,
}) => {
  const classes = cn(
    'inline-flex items-center gap-1.5 rounded-sm font-medium text-accent underline underline-offset-4',
    'transition-colors hover:brightness-110 hover:decoration-accent',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    className,
  );

  if (to) {
    return (
      <Link to={to} className={classes} aria-label={ariaLabel} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={classes}
      aria-label={ariaLabel}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onClick={onClick}
    >
      {children}
      {external && <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />}
    </a>
  );
};

export default TextLink;