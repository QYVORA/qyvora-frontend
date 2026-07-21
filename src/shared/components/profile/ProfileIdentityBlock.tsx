import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
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
}) => {
  const { t } = useTranslation();

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

            {/* Meta line: org + email */}
            {(organization || email) && (
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-text-muted">
                {organization && <span>{organization}</span>}
                {email && <span className="hidden sm:inline">{email}</span>}
              </div>
            )}
          </div>
        </div>

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
