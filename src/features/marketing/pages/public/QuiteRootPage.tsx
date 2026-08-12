import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import { ScrollReveal } from '@/shared/components';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import PublicSnapSection from '@/shared/components/PublicSnapSection';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { researchersData } from '@/features/marketing/content/researchersData';
import quiteRootLogo from '@/assets/quiteRoot/ChatGPT Image Jul 3, 2026, 02_45_59 AM.webp';
import { BatchPagination } from '@/shared/components/ui';

const BATCH_SIZE = 4;

const QuiteRootPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(researchersData.length / BATCH_SIZE);
  const currentBatch = researchersData.slice(page * BATCH_SIZE, (page + 1) * BATCH_SIZE);

  return (
    <div className="bg-bg min-h-full">
      <SEO title="QuiteRoot - QYVORA" description="QuiteRoot — a network of security researchers pushing the boundaries of offensive security." />
      <PublicSnapLayout>
        <StudentHeroSection
          title="Quite"
          accentWord="Root"
          titleClassName={PUBLIC_HERO_TITLE_CLASS}
          showGlobe
          typewrite
          description="A network of independent security researchers pushing the boundaries of offensive security research and tooling."
          stats={[{ label: 'Researchers', value: researchersData.length }]}
          rightContent={
            <div className="relative md:hidden lg:flex items-center justify-center w-full h-full py-6 lg:py-0">
              <img
                src={quiteRootLogo}
                alt="QuiteRoot"
                width={793}
                height={787}
                className="w-[72%] xl:w-[64%] 2xl:w-[56%] max-h-[68vh] object-contain"
              />
            </div>
          }
        >
          <Link
            to="/register"
            className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"
          >
            <Users className="w-4 h-4" /> Join the Network <IconArrowRight size={14} />
          </Link>
        </StudentHeroSection>

        <PublicSnapSection>
          <div className="flex flex-col justify-between flex-1 min-h-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 flex-1 items-stretch">
              {currentBatch.map((researcher, idx) => {
                const globalIdx = page * BATCH_SIZE + idx;
                return (
                  <ScrollReveal key={researcher.id} amount={0.05} className="h-full">
                    <div className="group relative flex flex-col rounded-2xl border border-border/30 bg-bg-card p-5 transition-all duration-300 hover:border-accent/40 h-full overflow-hidden justify-between min-h-[220px]">
                      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                      <span className="absolute top-4 right-5 font-mono text-sm font-black text-accent/25 group-hover:text-accent/60 transition-colors">
                        {String(globalIdx + 1).padStart(2, '0')}
                      </span>

                      <div>
                        <div className="flex items-center gap-4 mb-4 pr-12">
                          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-border/30 shrink-0">
                            <img src={researcher.image} alt={researcher.name} width={researcher.width} height={researcher.height} className="w-full h-full object-cover" loading="lazy" />
                            <span className="absolute inset-0 ring-1 ring-inset ring-black/40" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-black uppercase tracking-tight text-text-primary group-hover:text-accent transition-colors truncate">
                              {researcher.name}
                            </h3>
                            <span className="inline-block px-2 py-0.5 rounded-lg bg-accent/10 text-[10px] font-black uppercase tracking-widest text-accent mt-1">
                              {researcher.role}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-text-muted line-clamp-3 leading-relaxed mb-2">{researcher.bio}</p>
                      </div>

                      <div className="mt-auto pt-3 border-t border-border/20 flex items-center gap-3">
                        <span className="font-mono text-[10px] font-black uppercase tracking-widest text-accent/80">
                          &gt; {researcher.id.toUpperCase()}
                        </span>
                        <span className="ml-auto inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-text-muted">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                          Active
                        </span>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
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

export default QuiteRootPage;
