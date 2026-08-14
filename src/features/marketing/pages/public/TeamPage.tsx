import { Link } from 'react-router-dom';
import { ArrowUpRight, Cpu, MapPin, Palette, ShieldCheck, Terminal } from 'lucide-react';
import { BrandGithubIcon, BrandLinkedinIcon, BrandXIcon, BrandYoutubeIcon } from '@/shared/components/icons';
import { ScrollReveal } from '@/shared/components';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import PublicSnapSection from '@/shared/components/PublicSnapSection';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { teamData, type TeamMember } from '@/features/marketing/content/teamData';

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  github: BrandGithubIcon,
  linkedin: BrandLinkedinIcon,
  twitter: BrandXIcon,
  youtube: BrandYoutubeIcon,
};

const MEMBER_ICONS: Record<string, React.ElementType> = {
  wsuits6: Terminal,
  sopt4: Palette,
  mohammedRafiq: Cpu,
  ghostVenom: ShieldCheck,
};

const MEMBER_LAYOUTS: Record<string, { imageFirst: boolean; imagePosition: string; marker: string }> = {
  wsuits6: { imageFirst: false, imagePosition: 'object-[center_20%]', marker: '01' },
  sopt4: { imageFirst: true, imagePosition: 'object-[center_20%]', marker: '02' },
  mohammedRafiq: { imageFirst: false, imagePosition: 'object-[center_20%]', marker: '03' },
  ghostVenom: { imageFirst: true, imagePosition: 'object-[center_20%]', marker: '04' },
};

const TeamMemberSection = ({ member }: { member: TeamMember }) => {
  const layout = MEMBER_LAYOUTS[member.id];
  const MemberIcon = MEMBER_ICONS[member.id] ?? ShieldCheck;

  return (
    <PublicSnapSection id={member.id} fitViewport>
      <ScrollReveal amount={0.08} className="h-full w-full min-h-0">
        <article className="relative grid h-full w-full min-h-0 grid-cols-1 grid-rows-[minmax(100px,0.5fr)_minmax(0,1.5fr)] gap-3 sm:grid-rows-[minmax(150px,0.7fr)_minmax(0,1.3fr)] sm:gap-4 lg:grid-cols-2 lg:grid-rows-1 lg:gap-12">
          <div className={`relative min-h-0 overflow-hidden rounded-2xl border border-border/30 bg-bg-card ${layout.imageFirst ? 'lg:order-1' : 'lg:order-2'}`}>
            <img
              src={member.image}
              alt={member.name}
              width={member.width}
              height={member.height}
              className={`h-full w-full object-cover ${layout.imagePosition} transition-transform duration-700 hover:scale-105`}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />
            <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg border border-border/30 bg-bg/80 text-[9px] font-black tracking-widest text-accent backdrop-blur-sm sm:left-5 sm:top-5 sm:h-11 sm:w-11 sm:text-[10px]">
              {layout.marker}
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-4 sm:bottom-5 sm:left-5 sm:right-5">
              <div>
                <p className="mb-1 text-[8px] font-black uppercase tracking-widest text-text-muted sm:mb-2 sm:text-[9px]">Qyvora operator</p>
                <p className="text-xs font-black uppercase tracking-tight text-text-primary sm:text-sm">{member.name}</p>
              </div>
              <MemberIcon className="h-6 w-6 shrink-0 text-accent" aria-hidden="true" />
            </div>
          </div>

          <div className={`flex min-h-0 min-w-0 flex-col justify-center ${layout.imageFirst ? 'lg:order-2' : 'lg:order-1'}`}>
            <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-3 sm:gap-3 lg:mb-5">
              <span className="px-2.5 py-1 rounded-lg border border-accent/30 bg-accent/10 text-[9px] font-black uppercase tracking-widest text-accent">{member.role}</span>
              {member.location && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-muted"><MapPin className="h-3.5 w-3.5 text-accent" />{member.location}</span>
              )}
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-6xl font-black uppercase tracking-tight leading-[.95] text-text-primary break-words">
              {member.name}
            </h2>
            {member.handle && <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-accent sm:mt-3 sm:text-xs">@{member.handle}</p>}
            <p className="mt-3 max-w-2xl text-[11px] leading-[1.45] text-text-secondary sm:mt-4 sm:text-sm sm:leading-relaxed lg:mt-6 lg:text-base">{member.profile}</p>

            <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2 lg:mt-7">
              {member.disciplines.map((discipline) => (
                <span key={discipline} className="px-2 py-0.5 rounded-lg border border-border/30 bg-bg-card text-[9px] font-black uppercase tracking-widest text-text-muted sm:px-2.5 sm:py-1">{discipline}</span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/30 pt-3 sm:mt-5 sm:pt-4 lg:mt-8 lg:pt-5">
              {member.handle && (
                <Link to={`/@${member.handle}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent transition-colors hover:text-text-primary">
                  View profile <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              )}
              {Object.entries(member.socials).map(([platform, url]) => {
                if (!url) return null;
                const Icon = SOCIAL_ICONS[platform];
                if (!Icon) return null;
                return (
                  <a key={platform} href={url} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on ${platform}`} className="text-text-muted transition-colors hover:text-accent">
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </article>
      </ScrollReveal>
    </PublicSnapSection>
  );
};

const TeamPage = () => {
  const { user } = useAuth();

  return (
    <div className="bg-bg min-h-full">
      <SEO title="Team - QYVORA" description="The team behind QYVORA — operators, engineers, and security researchers." />
      <PublicSnapLayout>
        <StudentHeroSection
          title="Our"
          accentWord="Team"
          titleClassName={PUBLIC_HERO_TITLE_CLASS}
          showGlobe
          typewrite
          description="Operators, engineers, and researchers building Africa's offensive security ecosystem."
          stats={[{ label: 'Members', value: teamData.length }]}
        />

        {teamData.map((member) => <TeamMemberSection key={member.id} member={member} />)}
        <LandingFinalCtaSection user={user} />
        <Footer />
      </PublicSnapLayout>
    </div>
  );
};

export default TeamPage;
