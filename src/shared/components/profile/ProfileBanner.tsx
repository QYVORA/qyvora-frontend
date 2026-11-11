import React from 'react';
import { Award } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';

interface ProfileBannerProps {
  handle: string;
  avatarUrl?: string;
  showCredentials?: boolean;
  credentialsHref?: string;
}

/**
 * ProfileBanner — full-bleed gradient band with a faint grid. The avatar is
 * half over the bottom edge; the banner reserves room for it.
 */
const ProfileBanner: React.FC<ProfileBannerProps> = ({
  handle,
  avatarUrl,
  showCredentials = false,
  credentialsHref = '#profile-section-credentials',
}) => (
  <header className="profile-banner" data-testid="profile-banner">
    <div className="line-grid absolute inset-0 opacity-[0.05]" aria-hidden="true" />

    <div className="absolute bottom-0 left-[var(--app-gutter,12px)] z-10 translate-y-1/2">
      <ProfileAvatar
        handle={handle}
        avatarUrl={avatarUrl}
        size="banner"
        shape="circle"
        className="border-2 border-border ring-4 ring-canvas"
      />
    </div>

    {showCredentials && (
      <a
        href={credentialsHref}
        className="absolute right-[var(--app-gutter,12px)] top-4 z-10 inline-flex min-h-[40px] items-center gap-2 rounded-md border border-border-subtle bg-surface-raised px-3 text-sm font-medium text-text-primary transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <Award className="h-4 w-4 text-accent" aria-hidden="true" />
        Certs
      </a>
    )}
  </header>
);

export default ProfileBanner;
