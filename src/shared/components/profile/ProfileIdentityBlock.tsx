import { type ReactNode } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { Calendar, MapPin, Building2, Mail, ExternalLink } from 'lucide-react';
import ShareProfile from '@/shared/components/ShareProfile';
import { Button } from '@/shared/components/ui';
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
  xpLevel?: number;
  xpCurrent?: number;
  xpToNext?: number;
  joinDate?: string;
  country?: string;
  website?: string;
  github?: string;
  githubConnected?: boolean;
  githubPublic?: boolean;
  githubProfileUrl?: string;
  githubUsername?: string;
  linkedin?: string;
  twitter?: string;
}

interface FactRow {
  icon: ReactNode;
  label: string;
  value: string;
}

/**
 * Profile identity — borderless, sits on the page background. The avatar lives
 * in the banner; rank/level/CP live in RankLevelCard.
 */
export const ProfileIdentityBlock: React.FC<ProfileIdentityBlockProps> = ({
  handle,
  name,
  bio,
  organization,
  email,
  actions = [],
  showShare = false,
  showPublicView = false,
  publicViewPath,
  className = '',
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
      className={`relative ${className}`}
    >
      <h1 className="truncate text-2xl font-bold leading-tight text-text-primary sm:text-[28px]">
        {name || handle}
      </h1>
      <p className="mt-1 truncate text-base text-accent">@{handle}</p>

      {bio && (
        <p className="mt-4 break-words text-base leading-7 text-text-secondary">{bio}</p>
      )}

      {facts.length > 0 && (
        <dl className="mt-4 flex flex-col gap-2">
          {facts.map((row) => (
            <div key={row.label} className="flex min-w-0 items-center gap-2 text-sm text-text-muted">
              <span className="[&_svg]:h-4 [&_svg]:w-4" aria-hidden="true">{row.icon}</span>
              <dt className="sr-only">{row.label}</dt>
              <dd className="truncate">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-4">
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

      <div className="mt-5 grid grid-cols-2 gap-3">
        {showShare && <ShareProfile handle={handle} />}
        {actions.slice(0, 1).map((act) =>
          act.to ? (
            <Button key={act.label} to={act.to} variant="secondary" icon={act.icon}>
              {act.label}
            </Button>
          ) : (
            <Button key={act.label} type="button" variant="secondary" icon={act.icon} onClick={act.onClick}>
              {act.label}
            </Button>
          ),
        )}
      </div>

      {showPublicView && publicViewPath && (
        <Button
          to={publicViewPath}
          variant="ghost"
          size="sm"
          className="mt-2"
          trailingIcon={<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />}
        >
          Public view
        </Button>
      )}
    </motion.section>
  );
};

export default ProfileIdentityBlock;
