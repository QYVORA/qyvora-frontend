import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, UserRound } from 'lucide-react';
import { BrandGithubIcon, BrandInstagramIcon, BrandLinkedinIcon, BrandXIcon, BrandYoutubeIcon, BrandMediumIcon } from '@/shared/components/icons';
import Badge from '@/shared/components/ui/Badge';
import Button from '@/shared/components/ui/Button';
import type { QuietRootHolder, QuietRootRole } from '@/features/marketing/content/quietRootData';

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  github: BrandGithubIcon,
  linkedin: BrandLinkedinIcon,
  twitter: BrandXIcon,
  youtube: BrandYoutubeIcon,
  medium: BrandMediumIcon,
  instagram: BrandInstagramIcon,
};

export interface QuietRootRoleSocials {
  [platform: string]: string | undefined;
}

const HolderPortrait = ({ holder }: { holder: QuietRootHolder }) => (
  <>
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-raised">
      <img
        src={holder.image}
        alt={holder.name}
        width={holder.imageWidth}
        height={holder.imageHeight}
        loading="lazy"
        className="h-full w-full object-cover object-[center_20%]"
      />
    </div>

    {holder.socials && (
      <div className="flex flex-wrap items-center gap-2">
        {Object.entries(holder.socials).map(([platform, url]) => {
          if (!url) return null;
          const Icon = SOCIAL_ICONS[platform];
          if (!Icon) return null;
          return (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${holder.name} on ${platform}`}
              className="flex h-11 w-11 min-h-[44px] items-center justify-center rounded-lg border border-border-subtle text-text-muted transition-colors hover:border-accent/40 hover:text-accent"
            >
              <Icon className="h-4 w-4" />
            </a>
          );
        })}
      </div>
    )}
  </>
);

/**
 * Neutral silhouette for a vacant role. Deliberately not a person: no name, no
 * photo, no biography — just the shape of the seat, marked OPEN, with a route
 * to apply for it.
 */
const OpenPortrait = () => (
  <div className="flex aspect-[4/3] w-full items-center justify-center border-b border-border-subtle bg-surface-raised p-5">
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border-subtle">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-border-subtle bg-surface text-text-muted">
        <UserRound className="h-8 w-8" aria-hidden="true" />
      </span>
      <span className="type-label uppercase tracking-[0.3em] text-text-muted">Position open</span>
    </div>
  </div>
);

/**
 * One QuietRoot role. Renders either the documented holder (photo, location,
 * disciplines, profile links) or an OPEN vacancy (silhouette, capability bar,
 * and an application CTA routed through the QYVORA contact page).
 */
const QuietRootRoleCard = ({
  role,
  applyLabel = 'Apply for this role',
}: {
  role: QuietRootRole;
  applyLabel?: string;
}) => {
  const filled = role.holder !== null;
  const applies = !filled || role.openToApplications !== false;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface">
      {filled && role.holder ? (
        <HolderPortrait holder={role.holder} />
      ) : (
        <OpenPortrait />
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-black uppercase leading-tight tracking-tight text-text-primary break-words">
            {role.title}
          </h3>
          {filled ? (
            <Badge variant="accent" size="sm" className="mt-0.5 shrink-0">
              In place
            </Badge>
          ) : (
            <Badge variant="default" size="sm" className="mt-0.5 shrink-0">
              Open
            </Badge>
          )}
        </div>

        {filled && role.holder ? (
          <>
            <p className="mt-2 text-sm font-bold text-text-primary break-words">{role.holder.name}</p>
            {role.holder.location && (
              <p className="mt-1 inline-flex items-center gap-1.5 text-tiny font-black uppercase tracking-widest text-text-muted">
                <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                {role.holder.location}
              </p>
            )}
            <p className="mt-3 text-xs font-mono leading-relaxed text-text-secondary">
              {role.holder.bio}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {role.holder.disciplines.map((discipline) => (
                <span
                  key={discipline}
                  className="rounded-md border border-border-subtle bg-surface-raised px-2 py-0.5 text-tiny font-black uppercase tracking-widest text-text-muted"
                >
                  {discipline}
                </span>
              ))}
            </div>
          </>
        ) : null}

        <div className="mt-4 border-t border-border-subtle pt-4">
          <p className="type-label uppercase tracking-[0.12em] text-accent">
            {filled ? 'What the role covers' : 'Evidence that qualifies'}
          </p>
          <p className="mt-2 text-xs font-mono leading-relaxed text-text-secondary">
            {role.summary}
          </p>
        </div>

        <div className="mt-auto pt-4">
          {applies ? (
            <Button to="/contact" variant={filled ? 'ghost' : 'secondary'} size="sm" className="w-full">
              {applyLabel}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          ) : (
            <Link
              to="/contact"
              className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-black uppercase tracking-widest text-text-muted transition-colors hover:text-text-primary"
            >
              Contact QYVORA <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default QuietRootRoleCard;