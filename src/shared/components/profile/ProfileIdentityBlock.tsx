import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { Calendar, MapPin, Building2, Mail, ExternalLink } from 'lucide-react';
import ShareProfile from '@/shared/components/ShareProfile';
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

interface MetaRow {
  icon: ReactNode;
  text: string;
}

export const ProfileIdentityBlock: React.FC<ProfileIdentityBlockProps> = ({
  id,
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

  const metaRows: MetaRow[] = [];
  if (organization) metaRows.push({ icon: <Building2 className="w-3.5 h-3.5" />, text: organization });
  if (email) metaRows.push({ icon: <Mail className="w-3.5 h-3.5" />, text: email });
  if (formattedJoinDate) metaRows.push({ icon: <Calendar className="w-3.5 h-3.5" />, text: `Joined ${formattedJoinDate}` });
  if (country) metaRows.push({ icon: <MapPin className="w-3.5 h-3.5" />, text: country });

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReduced ? 0 : 0.45, delay: prefersReduced ? 0 : 0.05 }}
      className={`relative rounded-2xl border border-border bg-bg-card shadow-sm ${className}`}
    >
      <div className="space-y-5 p-5 sm:p-6">
        {/* Avatar + Name + Rank Insignia */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <ProfileAvatar handle={handle} avatarUrl={avatarUrl} size="lg" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="truncate font-mono text-xl font-black uppercase tracking-tight text-text-primary sm:text-2xl">
                {name || handle}
              </h1>
            </div>
            <p className="mt-0.5 truncate font-mono text-sm font-bold text-accent">
              @{handle}
            </p>

            {/* Authoritative Rank Badge */}
            {rank && (
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-2.5 py-0.5">
                <RankInsignia rank={rank} size="xs" />
                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-text-primary">
                  {rank}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* CP Balance Presentation — Direct coin alongside number without card wrapper */}
        {cp != null && (
          <div className="flex items-center justify-between border-y border-border/50 py-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-muted">
              Cyber Points
            </span>
            <ProfileCPBalance cp={cp} size="sm" />
          </div>
        )}

        {/* Bio */}
        {bio && (
          <p className="break-words font-mono text-xs leading-relaxed text-text-secondary">
            {bio}
          </p>
        )}

        {/* Metadata: Org, Email, Joined, Location */}
        {metaRows.length > 0 && (
          <dl className="grid grid-cols-1 gap-x-4 gap-y-2 border-t border-border/40 pt-3 sm:grid-cols-2">
            {metaRows.map((row, i) => (
              <div key={i} className="flex items-center gap-2 font-mono text-xs text-text-muted">
                <span className="shrink-0 text-text-muted/70">{row.icon}</span>
                <span className="min-w-0 truncate">{row.text}</span>
              </div>
            ))}
          </dl>
        )}

        {/* Public Social Links */}
        <div className="border-t border-border/40 pt-3">
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

        {/* Progression XP Level */}
        {xpLevel != null && xpToNext != null && xpToNext > 0 && (
          <div className="rounded-xl border border-border/60 bg-surface/50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-text-muted">
                Level {xpLevel}
              </span>
              <span className="font-mono text-xs text-text-muted/70">
                {(xpCurrent || 0).toLocaleString()} / {xpToNext.toLocaleString()} XP
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-border/40">
              <motion.div
                initial={prefersReduced ? false : { width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: prefersReduced ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-accent"
              />
            </div>
          </div>
        )}

        {/* Actions Strip */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {actions.map((act) =>
            act.to ? (
              <Link
                key={act.label}
                to={act.to}
                className="btn-secondary inline-flex items-center gap-1.5 !rounded-xl !px-3 !py-2 !text-xs font-mono font-bold uppercase tracking-wider"
              >
                {act.icon}
                <span>{act.label}</span>
              </Link>
            ) : (
              <button
                key={act.label}
                type="button"
                onClick={act.onClick}
                className="btn-secondary inline-flex items-center gap-1.5 !rounded-xl !px-3 !py-2 !text-xs font-mono font-bold uppercase tracking-wider"
              >
                {act.icon}
                <span>{act.label}</span>
              </button>
            )
          )}

          {showPublicView && publicViewPath && (
            <Link
              to={publicViewPath}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-1.5 !rounded-xl !px-3 !py-2 !text-xs font-mono font-bold uppercase tracking-wider"
            >
              <span>Public View</span>
              <ExternalLink className="h-3 w-3 text-text-muted" aria-hidden="true" />
            </Link>
          )}

          {showShare && (
            <ShareProfile
              handle={handle}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileIdentityBlock;