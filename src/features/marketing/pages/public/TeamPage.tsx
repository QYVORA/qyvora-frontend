import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { IconArrowRight, BrandGithubIcon, BrandLinkedinIcon, BrandXIcon } from '@/shared/components/icons';
import { ScrollReveal } from '@/shared/components';
import SEO from '@/shared/components/SEO';
import StudentHeroSection from '@/shared/components/StudentHeroSection';
import { teamData } from '@/features/marketing/content/teamData';

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  github: BrandGithubIcon,
  linkedin: BrandLinkedinIcon,
  twitter: BrandXIcon,
};

const TeamPage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-bg min-h-full">
      <SEO title="Team - QYVORA" description="The team behind QYVORA — operators, engineers, and security researchers." noindex />
      <div className="px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-8">
        <StudentHeroSection
          icon={<Users className="w-8 h-8 text-accent" />}
          title="Our Team"
          description="Operators, engineers, and researchers building Africa's offensive security ecosystem."
          stats={[{ label: 'Members', value: teamData.length }]}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {teamData.map((member) => (
            <ScrollReveal key={member.id} amount={0.05}>
              <div className="rounded-2xl border border-border/30 bg-bg-card p-5 flex flex-col gap-3 hover:border-accent/30 transition-colors h-full">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-6 h-6 text-accent" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-text-primary truncate">{member.name}</h3>
                    <p className="text-[10px] font-mono text-text-muted truncate">{member.role}</p>
                  </div>
                </div>
                <p className="text-xs text-text-muted leading-relaxed flex-1 line-clamp-3">{member.bio}</p>
                <div className="flex items-center gap-2 pt-1">
                  {member.handle && (
                    <Link
                      to={`/@${member.handle}`}
                      className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
                    >
                      @{member.handle}
                    </Link>
                  )}
                  <div className="ml-auto flex items-center gap-1.5">
                    {Object.entries(member.socials || {}).map(([platform, url]) => {
                      if (!url) return null;
                      const Icon = SOCIAL_ICONS[platform];
                      if (!Icon) return null;
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-text-muted hover:border-accent/40 hover:text-accent transition-colors"
                        >
                          <Icon className="h-3 w-3" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
