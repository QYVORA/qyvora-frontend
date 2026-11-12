import React from 'react';
import PageBody from '@/shared/components/layout/PageBody';
import TwoColumn from '@/shared/components/layout/TwoColumn';
import ProfileBanner from './ProfileBanner';

interface ProfileLayoutProps {
  handle: string;
  avatarUrl?: string;
  showCredentials?: boolean;
  /** Public pages sit under the fixed topbar and must clear it themselves. */
  clearTopbar?: boolean;
  children: React.ReactNode;
}

/**
 * ProfileLayout — banner, then the 36/64 profile split inside PageBody.
 * Children are the left rail followed by the main column.
 */
const ProfileLayout: React.FC<ProfileLayoutProps> = ({
  handle,
  avatarUrl,
  showCredentials,
  clearTopbar = false,
  children,
}) => (
  <div
    className={
      clearTopbar
        ? 'min-h-full bg-canvas pt-[calc(var(--app-topbar-h,80px)+var(--app-safe-top,0px))]'
        : 'min-h-full bg-canvas'
    }
  >
    <ProfileBanner handle={handle} avatarUrl={avatarUrl} showCredentials={showCredentials} />
    <PageBody className="!pt-0">
      <TwoColumn split="profile">{children}</TwoColumn>
    </PageBody>
  </div>
);

export default ProfileLayout;
