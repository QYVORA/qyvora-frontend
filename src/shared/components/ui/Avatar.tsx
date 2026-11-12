import React, { useState } from 'react';
import Identicon from '@/shared/components/Identicon';
import { cn } from '@/shared/utils/cn';

type AvatarSize = 24 | 32 | 40 | 48 | 64 | 80;

interface AvatarProps {
  /** Stable handle/name used for the identicon and alt text. */
  name: string;
  src?: string | null;
  size?: AvatarSize;
  /** Accent ring for the topbar / active states. */
  ring?: boolean;
  /** Surface the ring gap should match (defaults to the page canvas). */
  ringOffsetClassName?: string;
  className?: string;
}

const SIZE_CLASS: Record<AvatarSize, string> = {
  24: 'h-6 w-6 text-[10px]',
  32: 'h-8 w-8 text-xs',
  40: 'h-10 w-10 text-sm',
  48: 'h-12 w-12 text-base',
  64: 'h-16 w-16 text-lg',
  80: 'h-20 w-20 text-xl',
};

/**
 * Circular avatar: image → identicon fallback → initial. 1px border by
 * default, optional accent ring.
 */
const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 40,
  ring,
  ringOffsetClassName = 'ring-offset-canvas',
  className,
}) => {
  const [broken, setBroken] = useState(false);
  const showImage = Boolean(src) && !broken;

  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-raised',
        ring
          ? cn('ring-2 ring-accent ring-offset-2', ringOffsetClassName)
          : 'border border-border-subtle',
        SIZE_CLASS[size],
        className,
      )}
      role="img"
      aria-label={`Avatar for ${name}`}
    >
      {showImage ? (
        <img
          src={src as string}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setBroken(true)}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center">
          <Identicon value={name} size={size * 4} className="h-full w-full" />
          <span className="sr-only">{name.charAt(0).toUpperCase()}</span>
        </span>
      )}
    </span>
  );
};

export default Avatar;
