import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, Shield, Users } from 'lucide-react';
import { BrandGithubIcon, BrandInstagramIcon, BrandLinkedinIcon, BrandXIcon, BrandYoutubeIcon, BrandMediumIcon } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Badge from '@/shared/components/ui/Badge';
import { teamData, type TeamMember } from '@/features/marketing/content/teamData';
import { QUITEROOT_TEAMS, type QuiterootRole, type QuiterootHolder } from '@/features/marketing/content/quiterootData';

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  github: BrandGithubIcon,
  linkedin: BrandLinkedinIcon,
  twitter: BrandXIcon,
  youtube: BrandYoutubeIcon,
  medium: BrandMediumIcon,
  instagram: BrandInstagramIcon,
};

const SocialLinks = ({ member }: { member: TeamMember | QuiterootHolder }) => {
  const socials = member.socials || {};
  return (
    <div className="flex items-center gap-2">
      {Object.entries(socials).map(([platform, url]) => {
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
            className="flex h-10 w-10 items-center justify-center text-text-muted transition-colors hover:text-accent"
          >
            <Icon className="h-4 w-4" />
          </a>
        );
      })}
    </div>
  );
};

const TeamMemberCard = ({ member, handle }: { member: TeamMember | QuiterootHolder; handle?: string }) => (
  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface">
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-raised">
      <img
        src={'image' in member ? member.image : ''}
        alt={member.name}
        width={'imageWidth' in member ? member.imageWidth : 560}
        height={'imageHeight' in member ? member.imageHeight : 560}
        loading="lazy"
        className="h-full w-full object-cover object-[center_20%] transition-transform duration-700 hover:scale-105"
      />
    </div>

    <div className="flex flex-1 flex-col p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-lg border border-accent/30 bg-accent/10 px-2 py-0.5 text-tiny font-black uppercase tracking-widest text-accent">
          {'role' in member && 'bio' in member && 'profile' in member ? member.role : 'Team Member'}
        </span>
        {handle && (
          <span className="text-tiny font-black uppercase tracking-widest text-text-muted">
            @{handle}
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
        {member.bio}
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
          {handle ? (
            <Link
              to={`/@${handle}`}
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
 * Complete QYVORA team directory — Leadership, Security Team, and Tech Team.
 * 
 * This page consolidates all QYVORA personnel into one organized directory with three
 * distinct sections representing the company's organizational structure.
 */
const TeamPage = () => {
  const securityTeam = QUITEROOT_TEAMS.find((t) => t.id === 'security');
  const techTeam = QUITEROOT_TEAMS.find((t) => t.id === 'tech');

  const securityMembers = securityTeam?.roles.filter((role) => role.holder !== null) || [];
  const techMembers = techTeam?.roles.filter((role) => role.holder !== null) || [];

  const totalCount = teamData.length + securityMembers.length + techMembers.length;

  return (
    <div className="min-h-dvh bg-canvas">
      <SEO
        title="Team - QYVORA"
        description="The complete QYVORA team | leadership, security operators, and engineers building Africa's offensive security platform."
        breadcrumbName="Team"
      />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker="QYVORA · Team Directory"
          title="Our Team"
          description="The people behind QYVORA — from founding leadership to security operators and engineers — all working to build Africa's premier offensive security training platform and services team."
          metadata={
            <span className="type-meta inline-flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              <span className="font-bold text-text-primary">{totalCount}</span>
              Team members
            </span>
          }
        />

        {/* Section 01: Founding & Leadership Team */}
        <section aria-label="Founding & Leadership Team" className="mt-12 md:mt-16">
          <div className="mb-6 flex flex-col gap-2">
            <p className="type-label uppercase tracking-[0.12em] text-accent">01. Founding & Leadership</p>
            <h2 className="text-2xl font-black uppercase tracking-tight text-text-primary md:text-3xl">
              Executive Team
            </h2>
            <p className="type-body text-text-secondary max-w-3xl">
              QYVORA's founding and executive leadership — the six core positions responsible for the company's direction, operations, and growth.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teamData.map((member) => (
              <TeamMemberCard key={member.id} member={member} handle={member.handle} />
            ))}
          </div>
        </section>

        {/* Section 02: QYVORA Security Team */}
        <section aria-label="QYVORA Security Team" className="mt-14 md:mt-20">
          <div className="mb-6 flex flex-col gap-2">
            <p className="type-label uppercase tracking-[0.12em] text-accent">02. QYVORA Security Team</p>
            <h2 className="text-2xl font-black uppercase tracking-tight text-text-primary md:text-3xl">
              Security Operations & Research
            </h2>
            <p className="type-body text-text-secondary max-w-3xl">
              The security professionals conducting offensive security research, penetration testing, and authorized security work for QYVORA and its clients.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {securityMembers.map((role: QuiterootRole) => role.holder && (
              <TeamMemberCard key={role.id} member={role.holder} />
            ))}
          </div>
          {securityMembers.length === 0 && (
            <div className="rounded-2xl border border-border-subtle bg-surface p-8 text-center">
              <Shield className="mx-auto h-12 w-12 text-text-muted" aria-hidden="true" />
              <p className="mt-4 type-body text-text-secondary">
                Security team positions are being filled. Check back soon or visit{' '}
                <Link to="/quiteroot?team=security" className="text-accent hover:underline">
                  Quiteroot
                </Link>{' '}
                to see open roles.
              </p>
            </div>
          )}
        </section>

        {/* Section 03: QYVORA Tech Team */}
        <section aria-label="QYVORA Tech Team" className="mt-14 md:mt-20">
          <div className="mb-6 flex flex-col gap-2">
            <p className="type-label uppercase tracking-[0.12em] text-accent">03. QYVORA Tech Team</p>
            <h2 className="text-2xl font-black uppercase tracking-tight text-text-primary md:text-3xl">
              Engineering & Development
            </h2>
            <p className="type-body text-text-secondary max-w-3xl">
              The engineers and designers building QYVORA's platform, products, and interfaces — turning security training and tooling into scalable, accessible technology.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {techMembers.map((role: QuiterootRole) => role.holder && (
              <TeamMemberCard key={role.id} member={role.holder} />
            ))}
          </div>
          {techMembers.length === 0 && (
            <div className="rounded-2xl border border-border-subtle bg-surface p-8 text-center">
              <Users className="mx-auto h-12 w-12 text-text-muted" aria-hidden="true" />
              <p className="mt-4 type-body text-text-secondary">
                Tech team positions are being filled. Check back soon or visit{' '}
                <Link to="/quiteroot?team=tech" className="text-accent hover:underline">
                  Quiteroot
                </Link>{' '}
                to see open roles.
              </p>
            </div>
          )}
        </section>

        {/* Call to action: Join the team */}
        <section className="mt-14 md:mt-20">
          <div className="rounded-2xl border border-border-subtle bg-surface p-8 md:p-12 text-center">
            <Badge variant="default" size="sm" className="mx-auto">
              <Shield className="mr-1.5 h-3 w-3" aria-hidden="true" />
              We're hiring
            </Badge>
            <h2 className="mt-4 text-2xl font-black uppercase tracking-tight text-text-primary md:text-3xl">
              Join QYVORA
            </h2>
            <p className="mt-3 type-body text-text-secondary max-w-2xl mx-auto">
              We're building Africa's offensive security platform and services team. Explore open positions across security and engineering on Quiteroot, or reach out directly if you'd like to discuss opportunities.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/quiteroot"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-black uppercase tracking-widest text-on-accent transition-colors hover:bg-accent/90"
              >
                View open roles
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-border-subtle bg-surface px-6 py-3 text-sm font-black uppercase tracking-widest text-text-primary transition-colors hover:border-accent/40 hover:text-accent"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </section>
      </PublicContainer>
    </div>
  );
};

export default TeamPage;