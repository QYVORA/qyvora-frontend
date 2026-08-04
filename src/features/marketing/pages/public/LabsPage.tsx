import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FlaskConical, Zap, Star } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import { ScrollReveal } from '@/shared/components';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';

const LABS = [
  { id: 'privesc', route: '/dashboard/labs/privesc', accentColor: '#FBBF24', difficulty: 'beginner-advanced', cpReward: '50-400' },
  { id: 'passwords', route: '/dashboard/labs/passwords', accentColor: '#F59E0B', difficulty: 'beginner-advanced', cpReward: '100-300' },
  { id: 'sqli', route: '/dashboard/labs/sql-injection', accentColor: '#06B66F', difficulty: 'beginner-advanced', cpReward: '200-400' },
  { id: 'osint', route: '/dashboard/labs/osint', accentColor: '#0EA5E9', difficulty: 'beginner-advanced', cpReward: '150-400' },
  { id: 'killchain', route: '/dashboard/labs/kill-chain', accentColor: '#DC2626', difficulty: 'intermediate-advanced', cpReward: '500-600' },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'text-accent border-accent/30 bg-accent/10',
  intermediate: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  advanced: 'text-red-400 border-red-400/30 bg-red-400/10',
};

const LabsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="bg-bg min-h-full">
      <SEO title="Attack Labs - QYVORA" description="Hands-on offensive security labs covering privilege escalation, password cracking, SQL injection, OSINT, and the full kill chain." />
      <PublicSnapLayout>
        <StudentHeroSection
          icon={<FlaskConical className="w-8 h-8 text-accent" />}
          title="Attack"
          accentWord="Labs"
          titleClassName={PUBLIC_HERO_TITLE_CLASS}
          showGlobe
          typewrite
          description="Real-world offensive security labs in a sandboxed environment. Practice privilege escalation, password attacks, SQL injection, OSINT, and full kill-chain operations."
          stats={[
            { label: 'Labs', value: LABS.length },
            { label: 'CP Range', value: '50-600' },
          ]}
        >
          <Link
            to="/register"
            className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"
          >
            <Zap className="w-4 h-4" /> Start Training <IconArrowRight size={14} />
          </Link>
        </StudentHeroSection>

        <div className="min-h-dvh md:h-dvh md:overflow-y-auto px-3 md:px-4 lg:px-6">
          <div className="min-h-full flex flex-col justify-center py-16 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {LABS.map((lab) => {
            const baseDiff = lab.difficulty.split('-')[0];
            const diffColor = DIFFICULTY_COLORS[baseDiff] || DIFFICULTY_COLORS.beginner;
            return (
              <ScrollReveal key={lab.id} amount={0.05}>
                <Link
                  to={lab.route}
                  className="group/card relative aspect-square rounded-2xl border border-border/30 bg-bg-card p-3 md:p-5 transition-all duration-300 hover:border-accent/30 flex flex-col text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 border border-accent/20">
                      <FlaskConical className="w-4 h-4 text-accent" />
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${diffColor}`}>
                      <Star className="h-2.5 w-2.5" /> {baseDiff}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-text-primary group-hover/card:text-accent transition-colors leading-snug break-words mb-1">
                    {t(`student.labs.list.${lab.id}.title`)}
                  </h3>

                  <p className="text-xs sm:text-sm md:text-base text-text-muted leading-relaxed line-clamp-3 flex-1 mb-2">
                    {t(`student.labs.list.${lab.id}.description`)}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest text-accent">
                      {lab.cpReward} CP
                    </span>
                    <span className="px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest bg-accent text-on-accent transition-all duration-200 group-hover/card:brightness-110 group-active:scale-95">
                      Launch <IconArrowRight size={12} className="inline-block ml-1" />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
          </div>
          </div>
        </div>
      </PublicSnapLayout>

      {/* ── Final CTA ── */}
      <section className="relative w-full min-h-dvh md:h-dvh md:overflow-hidden">
        <LandingFinalCtaSection user={user} />
      </section>

      {/* ── Footer ── */}
      <section className="relative w-full bg-bg">
        <Footer />
      </section>
    </div>
  );
};

export default LabsPage;
