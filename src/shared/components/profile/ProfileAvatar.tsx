import React from 'react';
import Identicon from '@/shared/components/Identicon';

interface ProfileAvatarProps {
  handle: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'banner';
  shape?: 'square' | 'circle';
  className?: string;
}

const SIZES = {
  sm: 'h-10 w-10 text-xs',
  md: 'h-16 w-16 text-sm',
  lg: 'h-20 w-20 sm:h-24 sm:w-24 text-base',
  xl: 'h-24 w-24 sm:h-28 sm:w-28 text-lg',
  banner: 'h-24 w-24 sm:h-32 sm:w-32 lg:h-[150px] lg:w-[150px] text-lg',
};

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  handle,
  avatarUrl,
  size = 'lg',
  shape = 'square',
  className = '',
}) => {
  const sizeCls = SIZES[size] || SIZES.lg;

  return (
    <div
      className={`relative shrink-0 overflow-hidden ${shape === 'circle' ? 'rounded-full' : 'rounded-2xl'} border-2 border-border bg-bg-card ${sizeCls} ${className}`}
      role="img"
      aria-label={`Avatar for @${handle}`}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`@${handle}`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <Identicon value={handle} size={400} className="h-full w-full" />
      )}
    </div>
  );
};

export default ProfileAvatar;
