import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Search, Users } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import { ScrollReveal } from '@/shared/components';
import SEO from '@/shared/components/SEO';
import StudentHeroSection from '@/shared/components/StudentHeroSection';
import { researchersData } from '@/features/marketing/content/researchersData';
import quiteRootLogo from '@/assets/quiteRoot/ChatGPT Image Jul 3, 2026, 02_45_59 AM.webp';

const QuiteRootPage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-bg min-h-full">
      <SEO title="QuiteRoot - QYVORA" description="QuiteRoot — a network of security researchers pushing the boundaries of offensive security." />
      <div className="px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-8">
        <StudentHeroSection
          icon={<img src={quiteRootLogo} alt="QuiteRoot" className="w-10 h-10 object-contain" />}
          title="Quite"
          accentWord="Root"
          description="A network of independent security researchers pushing the boundaries of offensive security research and tooling."
          stats={[{ label: 'Researchers', value: researchersData.length }]}
        >
          <Link
            to="/register"
            className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"
          >
            <Users className="w-4 h-4" /> Join the Network <IconArrowRight size={14} />
          </Link>
        </StudentHeroSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {researchersData.map((researcher) => (
            <ScrollReveal key={researcher.id} amount={0.05}>
              <div className="rounded-2xl border border-border/30 bg-bg-card p-5 flex flex-col gap-3 hover:border-accent/30 transition-colors h-full">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {researcher.image ? (
                      <img src={researcher.image} alt={researcher.name} className="w-full h-full object-cover" />
                    ) : (
                      <Search className="w-6 h-6 text-accent" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-text-primary truncate">{researcher.name}</h3>
                    <p className="text-[10px] font-mono text-text-muted truncate">{researcher.role}</p>
                  </div>
                </div>
                <p className="text-xs text-text-muted leading-relaxed flex-1 line-clamp-3">{researcher.bio}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuiteRootPage;
