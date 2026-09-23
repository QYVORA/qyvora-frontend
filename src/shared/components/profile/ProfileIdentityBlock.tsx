import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { Globe, Github, Linkedin, Twitter, Calendar, MapPin, Building2, Mail } from 'lucide-react';
import ShareProfile from '@/shared/components/ShareProfile';
import Identicon from '@/shared/components/Identicon';

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

interface MetaRow {
  icon: ReactNode;
  text: string;
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
  const prefersReduced = useReducedMotion();

  const xpPercent = xpToNext && xpToNext > 0
    ? Math.min(Math.round(((xpCurrent || 0) / xpToNext) * 100), 100)
    : 0;

  const socialLinks = [
    { url: website, icon: <Globe className="w-3.5 h-3.5" />, label: 'Website' },
    { url: github, icon: <Github className="w-3.5 h-3.5" />, label: 'GitHub' },
    { url: linkedin, icon: <Linkedin className="w-3.5 h-3.5" />, label: 'LinkedIn' },
    { url: twitter, icon: <Twitter className="w-3.5 h-3.5" />, label: 'X' },
  ].filter((l) => l.url);

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
      className={`relative rounded-2xl border border-border/50 bg-bg-card overflow-hidden ${className}`}
    >
      <div className="h-1.5 w-full bg-accent" />

      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-2xl border-2 border-accent bg-black">
              <Identicon value={handle} size={400} className="h-full w-full" />
            </div>
            {rank && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-widest text-accent">
                {rank}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            {name && (
              <h2 className="truncate text-xl font-black uppercase tracking-tight text-text-primary sm:text-2xl">
                {name}
              </h2>
            )}
            <p className="mt-0.5 truncate font-mono text-sm text-accent">@{handle}</p>
          </div>
        </div>

        {bio && (
          <p className="text-sm leading-relaxed text-text-secondary">{bio}</p>
        )}

        {metaRows.length > 0 && (
          <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            {metaRows.map((row, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-text-muted">
                <span className="shrink-0 text-text-muted/70">{row.icon}</span>
                <span className="truncate">{row.text}</span>
              </div>
            ))}
          </dl>
        )}

        {socialLinks.length > 0 && (
          <div className="flex items-center gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-bg-elevated text-text-muted transition-colors hover:border-accent/50 hover:text-accent"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        )}

        {xpLevel != null && xpToNext != null && xpToNext > 0 && (
          <div className="rounded-xl border border-border/20 bg-bg-elevated p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-text-muted">
                Level {xpLevel}
              </span>
              <span className="font-mono text-xs text-text-muted/60">
                {(xpCurrent || 0).toLocaleString()} / {xpToNext.toLocaleString()} XP
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-border/20">
              <motion.div
                initial={prefersReduced ? false : { width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: prefersReduced ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-accent"
              />
            </div>
          </div>
        )}

        {(actions.length > 0 || showPublicView || showShare) && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {actions.map((action, i) => {
              if (action.to) {
                return (
                  <Link
                    key={i}
                    to={action.to}
                    className="btn-secondary flex items-center gap-2"
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
                  className="btn-secondary flex items-center gap-2"
                >
                  {action.icon}
                  {action.label}
                </button>
              );
            })}
            {showPublicView && publicViewPath && (
              <Link
                to={publicViewPath}
                className="btn-secondary flex items-center gap-2"
              >
                {"Public View"}
              </Link>
            )}
            {showShare && <ShareProfile handle={handle} />}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfileIdentityBlock;