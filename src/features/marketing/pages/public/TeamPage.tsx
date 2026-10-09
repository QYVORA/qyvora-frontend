import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, Shield, Users } from 'lucide-react';
import { BrandGithubIcon, BrandInstagramIcon, BrandLinkedinIcon, BrandXIcon, BrandYoutubeIcon, BrandMediumIcon } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Badge from '@/shared/components/ui/Badge';
import Button from '@/shared/components/ui/Button';
import { teamData, type TeamMember } from '@/features/marketing/content/teamData';
import {
  QUIETROOT_ROLE_COUNT,
  QUIETROOT_TEAMS,
} from '@/features/marketing/content/quietRootData';

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  github: BrandGithubIcon,
  linkedin: BrandLinkedinIcon,
  twitter: BrandXIcon,
  youtube: BrandYoutubeIcon,
  medium: BrandMediumIcon,
  instagram: BrandInstagramIcon,
};

const FOUNDERS: Record<string, boolean> = {
  wsuits6: true,
  sopt4: true,
  ghostVenom: true,
};

const SocialLinks = ({ member }: { member: TeamMember }) => (
  <div className="flex items-center gap-2">
    {Object.entries(member.socials).map(([platform, url]) => {
      if (!url) return null;
      const Icon = SOCIAL_ICONS[platform];
      if (!Icon) return null;
      return (
        <a
          key={platform}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} on ${platform}`}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle text-text-muted transition-colors hover:border-accent/40 hover:text-accent"
        >
          <Icon className="h-4 w-4" />
        </a>
      );
    })}
  </div>
);

const OperatorCard = ({ member }: { member: TeamMember }) => (
  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface">
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-raised">
      <img
        src={member.image}
        alt={member.name}
        width={member.width}
        height={member.height}
        loading="lazy"
        className="h-full w-full object-cover object-[center_20%] transition-transform duration-700 hover:scale-105"
      />
    </div>

    <div className="flex flex-1 flex-col p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-lg border border-accent/30 bg-accent/10 px-2 py-0.5 text-tiny font-black uppercase tracking-widest text-accent">
          {member.role}
        </span>
        {member.handle && (
          <span className="text-tiny font-black uppercase tracking-widest text-text-muted">
            @{member.handle}
          </span>
        )}
      </div>

      <h3 className="mt-3 text-lg font-black uppercase tracking-tight leading-tight text-text-primary break-words">
        {member.name}
      </h3>

      {member.location && (
        <p className="mt-1.5 inline-flex items-center gap-1.5 text-tiny font-black uppercase tracking-widest text-text-muted">
          <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          {member.location}
        </p>
      )}

      <p className="mt-3 text-xs font-mono leading-relaxed text-text-secondary line-clamp-3">
        {member.profile}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {member.disciplines.map((discipline) => (
          <span
            key={discipline}
            className="rounded-md border border-border-subtle bg-surface-raised px-2 py-0.5 text-tiny font-black uppercase tracking-widest text-text-muted"
          >
            {discipline}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-4">
        <div className="flex items-center justify-between gap-3 border-t border-border-subtle pt-4">
          {member.handle ? (
            <Link
              to={`/@${member.handle}`}
              className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-black uppercase tracking-widest text-accent transition-colors hover:text-text-primary"
            >
              View profile <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <span />
          )}
          <SocialLinks member={member} />
        </div>
      </div>
    </div>
  </article>
);

/**
 * QYVORA's technical community is a separate structure from the leadership
 * team above: capability placement, not officer appointment. It is surfaced
 * here as a route into /quiteroot rather than as company team members.
 */
const QuietRootCallout = () => (
  <div className="flex h-full flex-col gap-6 rounded-2xl border border-border-subtle bg-surface p-5 md:p-8">
    <div className="flex flex-col gap-3">
      <span className="type-kicker block text-accent">QYVORA · Technical team</span>
      <h2 className="type-h2 font-black uppercase tracking-tight text-text-primary">
        QuietRoot
      </h2>
      <p className="type-body text-text-secondary">
        Engineering and security at QYVORA is organised as QuietRoot — a technical
        community placed by demonstrated capability rather than by appointment. Every
        defined role is published, whether it is filled or open.
      </p>
    </div>

    <ul className="flex flex-col gap-3">
      {QUIETROOT_TEAMS.map((team) => (
        <li key={team.id}>
          <Link
            to={`/quiteroot?team=${team.id}`}
            aria-label={`View the ${team.name}`}
            className="group relative flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface-raised p-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent hover:border-accent/40"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-surface p-1.5">
              <img
                src={team.logo}
                alt=""
                aria-hidden="true"
                width={team.logoWidth}
                height={team.logoHeight}
                loading="lazy"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black uppercase tracking-tight text-text-primary">
                {team.name}
              </p>
              <p className="type-meta mt-1 text-text-muted">
                {`${team.roles.length} roles · ${team.roles.filter((role) => role.holder === null).length} open`}
              </p>
            </div>
            <ArrowUpRight
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-accent opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              aria-hidden="true"
            />
          </Link>
        </li>
      ))}
    </ul>

    <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-border-subtle pt-5">
      <Button to="/quiteroot" variant="secondary" size="md">
        Meet QuietRoot
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Button>
      <Badge variant="default" size="sm">
        <Shield className="mr-1.5 h-3 w-3" aria-hidden="true" />
        {`${QUIETROOT_ROLE_COUNT} roles published`}
      </Badge>
    </div>
  </div>
);

/**
 * Leadership page — the four officer roles. QuietRoot is presented separately
 * because it is a technical community, not an officer appointment.
 */
const TeamPage = () => {
  const founders = teamData.filter((m) => FOUNDERS[m.id]);
  const operators = teamData.filter((m) => !FOUNDERS[m.id]);

  return (
    <div className="min-h-dvh bg-canvas">
      <SEO
        title="Team - QYVORA"
        description="The team behind QYVORA | operators, engineers, and security researchers."
        breadcrumbName="Team"
      />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker="QYVORA · Leadership"
          title="Our Team"
          description="The people accountable for QYVORA's direction, operations and people — plus QuietRoot, the technical community that builds and secures the platform."
          metadata={
            <span className="type-meta inline-flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              <span className="font-bold text-text-primary">{teamData.length}</span>
              Leadership roles
            </span>
          }
        />

        <section aria-label="Founding team" className="mt-12 md:mt-16">
          <div className="mb-6 flex flex-col gap-2">
            <p className="type-label uppercase tracking-[0.12em] text-accent">{"The founding crew"}</p>
            <h2 className="text-2xl font-black uppercase tracking-tight text-text-primary md:text-3xl">
              {"From Tamale, building the platform"}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {founders.map((member) => <OperatorCard key={member.id} member={member} />)}
          </div>
        </section>

        <section aria-label="Operations and technical team" className="mt-14 md:mt-20">
          <div className="mb-6 flex flex-col gap-2">
            <p className="type-label uppercase tracking-[0.12em] text-accent">{"Operations & engineering"}</p>
            <h2 className="text-2xl font-black uppercase tracking-tight text-text-primary md:text-3xl">
              {"The crew running the day-to-day"}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
            <div className="lg:col-span-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {operators.map((member) => <OperatorCard key={member.id} member={member} />)}
              </div>
            </div>
            <div className="lg:col-span-7">
              <QuietRootCallout />
            </div>
          </div>
        </section>
      </PublicContainer>
    </div>
  );
};

export default TeamPage;