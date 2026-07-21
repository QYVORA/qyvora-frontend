import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Globe, Github, Linkedin, Calendar, Flame } from 'lucide-react';
import Identicon from '@/shared/components/Identicon';
import ShareProfile from '@/shared/components/ShareProfile';

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
  /** LinkedIn URL */
  linkedin?: string;
  /** Twitter/X handle */
  twitter?: string;
}

const ProfileIdentityBlock: React.FC<ProfileIdentityBlockProps> = ({
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
  xpLevel,
  xpCurrent,
  xpToNext,
  joinDate,
  country,
  website,
  github,
  linkedin,
  twitter,
}) => {
  const { t } = useTranslation();

  const xpPercent = xpToNext && xpToNext > 0
    ? Math.min(Math.round(((xpCurrent || 0) / xpToNext) * 100), 100)
    : 0;

  const socialLinks = [
    { url: website, icon: <Globe className="w-3.5 h-3.5" />, label: 'Website' },
    { url: github, icon: <Github className="w-3.5 h-3.5" />, label: 'GitHub' },
    { url: linkedin, icon: <Linkedin className="w-3.5 h-3.5" />, label: 'LinkedIn' },
  ].filter((l) => l.url);

  const formattedJoinDate = joinDate
    ? new Date(joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`rounded-2xl border border-border/30 bg-bg-card overflow-hidden ${className}`}
    >
      {/* Accent stripe at top */}
      <div className="h-1 w-full bg-accent" />

      <div className="p-5 sm:p-6">
        {/* Top row: Avatar + Identity */}
        <div className="flex items-start gap-4 sm:gap-5">
          {/* Circular avatar */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl border border-border/30 overflow-hidden flex items-center justify-center">
            <Identicon value={handle || id} size={256} className="w-full h-full" />
          </div>

          {/* Name + handle + badges */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {name && (
                <h2 className="text-lg sm:text-xl font-black text-text-primary truncate">
                  {name}
                </h2>
              )}
              <span className="px-2 py-0.5 rounded-lg bg-bg-elevated border border-border/30 text-[10px] font-black uppercase tracking-widest text-accent font-mono">
                @{handle}
              </span>
              {rank && (
                <span className="px-2 py-0.5 rounded-lg bg-accent/10 border border-accent/20 text-[10px] font-black uppercase tracking-widest text-accent">
                  {rank}
                </span>
              )}
            </div>

            {/* Bio */}
            {bio && (
              <p className="text-sm text-text-secondary leading-relaxed mt-1.5 line-clamp-2">
                {bio}
              </p>
            )}

            {/* Meta line: org + email + join date + country */}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-text-muted">
              {organization && <span>{organization}</span>}
              {email && <span className="hidden sm:inline">{email}</span>}
              {formattedJoinDate && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Joined {formattedJoinDate}
                </span>
              )}
              {country && <span>{country}</span>}
            </div>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg bg-bg-elevated border border-border/30 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-colors"
                    aria-label={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* XP Progress Bar */}
        {xpLevel != null && xpToNext != null && xpToNext > 0 && (
          <div className="mt-5 p-3 rounded-xl bg-bg-elevated border border-border/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                Level {xpLevel}
              </span>
              <span className="text-[10px] font-mono text-text-muted/60">
                {(xpCurrent || 0).toLocaleString()} / {xpToNext.toLocaleString()} XP
              </span>
            </div>
            <div className="h-2 rounded-full bg-border/20 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-accent"
              />
            </div>
          </div>
        )}

        {/* Action buttons row */}
        <div className="flex flex-wrap items-center gap-2 mt-5">
          {actions.map((action, i) => {
            const base = 'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95';
            if (action.to) {
              return (
                <Link
                  key={i}
                  to={action.to}
                  className={`bg-bg border border-border hover:border-accent/50 text-text-muted ${base}`}
                >
                  {action.icon}
                  {action.label}
                </Link>
              );
            }
            return (
              <button
                key={i}
                onClick={action.onClick}
                className={`bg-bg border border-border hover:border-accent/50 text-text-muted ${base}`}
              >
                {action.icon}
                {action.label}
              </button>
            );
          })}
          {showPublicView && publicViewPath && (
            <Link
              to={publicViewPath}
              className={`bg-bg border border-border hover:border-accent/50 text-text-muted inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95`}
            >
              {t('student.profile.publicView')}
            </Link>
          )}
          {showShare && <ShareProfile handle={handle} />}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileIdentityBlock;
