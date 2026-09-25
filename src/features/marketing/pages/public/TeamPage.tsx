import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, Users } from 'lucide-react';
import { BrandGithubIcon, BrandInstagramIcon, BrandLinkedinIcon, BrandXIcon, BrandYoutubeIcon, BrandMediumIcon } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import { teamData, type TeamMember } from '@/features/marketing/content/teamData';

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

const TeamPage = () => {
  const founders = teamData.filter((m) => FOUNDERS[m.id]);
  const operators = teamData.filter((m) => !FOUNDERS[m.id]);

  return (
    <div className="min-h-dvh bg-canvas">
      <SEO title="Team - QYVORA" description="The team behind QYVORA | operators, engineers, and security researchers." />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker="QYVORA · Operators"
          title="Our Team"
          description="Operators, engineers, and researchers building Africa's offensive security ecosystem."
          metadata={
            <span className="type-meta inline-flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              <span className="font-bold text-text-primary">{teamData.length}</span>
              Members
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

        <section aria-label="Operators" className="mt-14 md:mt-20">
          <div className="mb-6 flex flex-col gap-2">
            <p className="type-label uppercase tracking-[0.12em] text-accent">{"The operators"}</p>
            <h2 className="text-2xl font-black uppercase tracking-tight text-text-primary md:text-3xl">
              {"The crew running the day-to-day"}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {operators.map((member) => <OperatorCard key={member.id} member={member} />)}
          </div>
        </section>
      </PublicContainer>
    </div>
  );
};

export default TeamPage;