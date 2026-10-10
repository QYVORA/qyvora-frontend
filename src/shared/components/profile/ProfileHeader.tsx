import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Building2, Edit3, ExternalLink } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';
import ProfileRank from './ProfileRank';
import ProfileCPBalance from './ProfileCPBalance';
import SocialLinks from './SocialLinks';
import Button from '@/shared/components/ui/Button';

export interface ProfileHeaderProps {
  handle: string;
  displayName?: string;
  bio?: string;
  organization?: string;
  country?: string;
  joinDate?: string;
  avatarUrl?: string;
  rank?: string;
  cp: number;
  github?: string;
  githubConnected?: boolean;
  githubPublic?: boolean;
  githubProfileUrl?: string;
  githubUsername?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
  isOwnProfile?: boolean;
  onEditProfile?: () => void;
  publicViewUrl?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  handle,
  displayName,
  bio,
  organization,
  country,
  joinDate,
  avatarUrl,
  rank,
  cp,
  github,
  githubConnected,
  githubPublic,
  githubProfileUrl,
  githubUsername,
  twitter,
  linkedin,
  website,
  isOwnProfile = false,
  onEditProfile,
  publicViewUrl,
  actions,
  className = '',
}) => {
  const formattedJoinDate = joinDate
    ? new Date(joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null;

  const displayHandle = handle ? (handle.startsWith('@') ? handle : `@${handle}`) : '@operator';

  return (
    <header
      aria-label="Operator Identity"
      className={`rounded-2xl border border-border bg-bg-card p-5 sm:p-6 md:p-8 ${className}`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Left Column: Avatar + Core Identity Info */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <ProfileAvatar handle={handle || 'operator'} avatarUrl={avatarUrl} size="lg" />

          <div className="min-w-0 flex-1 space-y-2">
            {/* Name + Handle */}
            <div>
              <div className="flex flex-wrap items-baseline gap-2">
                <h1 className="font-mono text-xl sm:text-2xl font-black uppercase tracking-tight text-text-primary">
                  {displayName || handle || 'Operator'}
                </h1>
                <span className="font-mono text-sm font-bold text-accent">
                  {displayHandle}
                </span>
              </div>
            </div>

            {/* Bio (if provided) */}
            {bio && (
              <p className="max-w-2xl font-mono text-xs leading-relaxed text-text-secondary sm:text-sm">
                {bio}
              </p>
            )}

            {/* Meta Tags: Organization, Country, Joined */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 font-mono text-xs text-text-muted">
              {organization && (
                <div className="inline-flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
                  <span>{organization}</span>
                </div>
              )}
              {country && (
                <div className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
                  <span>{country}</span>
                </div>
              )}
              {formattedJoinDate && (
                <div className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
                  <span>Joined {formattedJoinDate}</span>
                </div>
              )}
            </div>

            {/* Public Social Links */}
            <div className="pt-2">
              <SocialLinks
                github={github}
                githubConnected={githubConnected}
                githubPublic={githubPublic}
                githubProfileUrl={githubProfileUrl}
                githubUsername={githubUsername}
                twitter={twitter}
                linkedin={linkedin}
                website={website}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Progression (Rank & CP) + Optional Actions */}
        <div className="flex flex-col gap-4 border-t border-border/50 pt-4 sm:flex-row sm:items-center sm:justify-between lg:border-t-0 lg:pt-0 lg:flex-col lg:items-end lg:gap-5">
          {/* Rank Insignia & Direct CP Presentation */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:flex-col lg:items-end lg:gap-3">
            <ProfileRank rank={rank} size="md" />
            <ProfileCPBalance cp={cp} size="md" />
          </div>

          {/* Private Controls: Edit Profile & View Public Profile */}
          {isOwnProfile && (
            <div className="flex flex-wrap items-center gap-2 pt-1 lg:pt-2">
              {onEditProfile && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onEditProfile}
                  className="!text-xs font-mono font-bold uppercase tracking-wider"
                >
                  <Edit3 className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                  Edit Profile
                </Button>
              )}
              {publicViewUrl && (
                <Link
                  to={publicViewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex items-center gap-1 !text-xs font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl border border-border hover:border-accent text-text-secondary hover:text-text-primary transition-colors"
                >
                  <span>Public View</span>
                  <ExternalLink className="h-3 w-3 text-text-muted" aria-hidden="true" />
                </Link>
              )}
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
