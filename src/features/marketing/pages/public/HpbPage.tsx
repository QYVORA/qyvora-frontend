import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Shield, Zap, BookOpen, Users } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import { ScrollReveal } from '@/shared/components';
import SEO from '@/shared/components/SEO';
import StudentHeroSection from '@/shared/components/StudentHeroSection';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampConfig';

const HpbPage = () => {
  const { t } = useTranslation();
  const phases = BOOTCAMP_CONFIG.phases || [];

  return (
    <div className="bg-bg min-h-full">
      <SEO title="HPB - QYVORA" description="Hacker Protocol Bootcamp — Africa's most intensive offensive security training." />
      <div className="px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-8">
        <StudentHeroSection
          icon={<Shield className="w-8 h-8 text-accent" />}
          title="Hacker Protocol Bootcamp"
          description="A phased offensive security curriculum designed to take you from operator to expert."
          stats={[
            { label: 'Phases', value: phases.length },
            { label: 'Duration', value: '12 weeks' },
          ]}
        >
          <Link
            to="/register"
            className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"
          >
            <Zap className="w-4 h-4" /> Enroll Now <IconArrowRight size={14} />
          </Link>
        </StudentHeroSection>

        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">Curriculum</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
            {phases.map((phase, idx) => (
              <ScrollReveal key={phase.id} amount={0.05}>
                <div className="group/card relative rounded-2xl border border-border/30 bg-bg-card p-3 md:p-5 transition-all duration-300 hover:border-accent/30 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 border border-accent/20">
                      <BookOpen className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border border-accent/20 bg-accent/10 text-accent">
                      Phase {idx + 1}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-text-primary tracking-tight mb-1 leading-snug">
                    {phase.title}
                  </h4>

                  <p className="text-xs sm:text-sm md:text-base text-text-muted leading-relaxed mb-2 line-clamp-3 flex-1">
                    {phase.codename}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                      <Users className="w-3 h-3" /> {phase.rooms?.length || 0} rooms
                    </span>
                    <span className="px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest bg-accent text-bg transition-all duration-200 group-hover/card:brightness-110 group-active:scale-95">
                      Explore
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HpbPage;
