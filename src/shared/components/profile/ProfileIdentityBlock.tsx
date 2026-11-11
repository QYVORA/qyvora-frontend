import { type ReactNode } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { Calendar, MapPin, Building2, Mail, ExternalLink } from 'lucide-react';
import ShareProfile from '@/shared/components/ShareProfile';
import { Button, Progress } from '@/shared/components/ui';
import ProfileAvatar from './ProfileAvatar';
import RankInsignia from './RankInsignia';
import ProfileCPBalance from './ProfileCPBalance';
import SocialLinks from './SocialLinks';

interface IdentityAction {
  label: string;
  to?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

export interface ProfileIdentityBlockProps {
  id: string;
  handle: string;
  name?: string;
  bio?: string;
  rank?: string;
  organization?: string;
  email?: string;
  actions?: IdentityAction[];
  showShare?: boolean;
  showPublicView?: boolean;
  publicViewPath?: string;
  className?: string;
  avatarUrl?: string;
  cp?: number;
  /** XP level (displayed as "Level N") */
  xpLevel?: number;
  /** Current XP within the level */
  xpCurrent?: number;
  /** XP needed for next level */
  xpToNext?: number;
  /** ISO date string of when the user joined */
  joinDate?: string;
  /** Country code or name */
  country?: string;
  /** Website URL */
  website?: string;
  /** GitHub username or URL */
  github?: string;
  githubConnected?: boolean;
  githubPublic?: boolean;
  githubProfileUrl?: string;
  githubUsername?: string;
  /** LinkedIn URL */
  linkedin?: string;
  /** Twitter/X handle */
  twitter?: string;
}

interface FactRow {
  icon: ReactNode;
  label: string;
  value: string;
}

/**
 * Profile identity card — one flat surface. Avatar + @handle + rank, a facts
 * grid, a two-line bio, social links and a 4px XP strip. No nested cards.
 */
export const ProfileIdentityBlock: React.FC<ProfileIdentityBlockProps> = ({
  handle,
  name,
  bio,
  rank,
  organization,
  email,
  actions = [],
  showShare = false,
  showPublicView = false,
  publicViewPath,
  className = '',
  avatarUrl,
  cp = 0,
  xpLevel,
  xpCurrent,
  xpToNext,
  joinDate,
  country,
  website,
  github,
  githubConnected,
  githubPublic,
  githubProfileUrl,
  githubUsername,
  linkedin,
  twitter,
}) => {
  const prefersReduced = useReducedMotion();

  const xpPercent =
    xpToNext && xpToNext > 0
      ? Math.min(Math.round(((xpCurrent || 0) / xpToNext) * 100), 100)
      : 0;

  const formattedJoinDate = joinDate
    ? new Date(joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null;

  const facts: FactRow[] = [];
  if (formattedJoinDate) facts.push({ icon: <Calendar />, label: 'Joined', value: formattedJoinDate });
  if (country) facts.push({ icon: <MapPin />, label: 'Location', value: country });
  if (organization) facts.push({ icon: <Building2 />, label: 'Organization', value: organization });
  if (email) facts.push({ icon: <Mail />, label: 'Email', value: email });

  return (
    <motion.section
      initial={prefersReduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReduced ? 0 : 0.45, delay: prefersReduced ? 0 : 0.05 }}
      className={`relative rounded-2xl border border-border-subtle bg-gradient-hero p-5 sm:p-6 ${className}`}
    >
      <div className="flex items-start gap-4">
        <ProfileAvatar handle={handle} avatarUrl={avatarUrl} size="lg" />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold leading-tight text-text-primary sm:text-2xl">
            {name || handle}
          </h1>
          <p className="mt-0.5 truncate text-sm text-accent">@{handle}</p>
          {rank && (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-surface-raised px-2.5 py-0.5">
              <RankInsignia rank={rank} size="xs" />
              <span className="text-[12px] font-medium text-text-secondary">{rank}</span>
            </div>
          )}
        </div>
      </div>

      {cp != null && (
        <div className="mt-5 flex items-center justify-between border-y border-border-subtle py-3">
          <span className="text-sm text-text-muted">Cyber Points</span>
          <ProfileCPBalance cp={cp} size="sm" />
        </div>
      )}

      {bio && (
        <p className="mt-4 break-words text-[15px] leading-6 text-text-secondary line-clamp-2">
          {bio}
        </p>
      )}

      {facts.length > 0 && (
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border-subtle pt-4">
          {facts.map((row) => (
            <div key={row.label} className="min-w-0">
              <dt className="flex items-center gap-1.5 text-[12px] text-text-muted">
                <span className="[&_svg]:h-3.5 [&_svg]:w-3.5" aria-hidden="true">{row.icon}</span>
                {row.label}
              </dt>
              <dd className="mt-0.5 truncate text-sm text-text-primary">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-4 border-t border-border-subtle pt-4">
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

      {xpLevel != null && xpToNext != null && xpToNext > 0 && (
        <div className="mt-4 border-t border-border-subtle pt-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-text-primary">Level {xpLevel}</span>
            <span className="text-[13px] tabular-nums text-text-muted">
              {(xpCurrent || 0).toLocaleString()} / {xpToNext.toLocaleString()} XP
            </span>
          </div>
          <Progress
            label={`Level ${xpLevel} progress`}
            hideLabel
            value={xpPercent}
            size="strip"
          />
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {actions.map((act) =>
          act.to ? (
            <Button key={act.label} to={act.to} variant="secondary" size="sm" icon={act.icon}>
              {act.label}
            </Button>
          ) : (
            <Button key={act.label} type="button" variant="secondary" size="sm" icon={act.icon} onClick={act.onClick}>
              {act.label}
            </Button>
          ),
        )}

        {showPublicView && publicViewPath && (
          <Button
            to={publicViewPath}
            variant="ghost"
            size="sm"
            trailingIcon={<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />}
          >
            Public view
          </Button>
        )}

        {showShare && <ShareProfile handle={handle} />}
      </div>
    </motion.section>
  );
};

export default ProfileIdentityBlock;
