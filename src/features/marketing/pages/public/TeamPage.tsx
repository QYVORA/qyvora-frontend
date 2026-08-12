import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { IconArrowRight, BrandGithubIcon, BrandLinkedinIcon, BrandXIcon } from '@/shared/components/icons';
import { ScrollReveal } from '@/shared/components';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import PublicSnapSection from '@/shared/components/PublicSnapSection';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { teamData } from '@/features/marketing/content/teamData';
import { BatchPagination } from '@/shared/components/ui';

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  github: BrandGithubIcon,
  linkedin: BrandLinkedinIcon,
  twitter: BrandXIcon,
};

const BATCH_SIZE = 4;

const TeamPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(teamData.length / BATCH_SIZE);
  const currentBatch = teamData.slice(page * BATCH_SIZE, (page + 1) * BATCH_SIZE);

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

        <PublicSnapSection>
          <div className="flex flex-col justify-between flex-1 min-h-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 flex-1 items-stretch">
              {currentBatch.map((member) => (
                <ScrollReveal key={member.id} amount={0.05} className="h-full">
                  <div className="group relative flex flex-col rounded-2xl border border-border/30 bg-bg-card p-5 transition-all duration-300 hover:border-accent/30 h-full justify-between min-h-[220px]">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-border/30 shrink-0">
                          {member.image ? (
                            <img src={member.image} alt={member.name} width={member.width} height={member.height} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-accent/10">
                              <Users className="w-6 h-6 text-accent" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-black uppercase tracking-tight text-text-primary group-hover:text-accent transition-colors truncate">
                            {member.name}
                          </h3>
                          <span className="inline-block px-2 py-0.5 rounded-lg bg-accent/10 text-[10px] font-black uppercase tracking-widest text-accent mt-1">
                            {member.role}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-text-muted line-clamp-3 leading-relaxed mb-2">{member.bio}</p>
                    </div>

                    {Object.keys(member.socials).length > 0 && (
                      <div className="flex items-center gap-3 mt-auto pt-3 border-t border-border/20">
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
                                className="text-text-muted hover:text-accent transition-colors"
                              >
                                <Icon className="w-4 h-4" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <BatchPagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </PublicSnapSection>
        <LandingFinalCtaSection user={user} />
        <Footer />
      </PublicSnapLayout>
    </div>
  );
};

export default TeamPage;
