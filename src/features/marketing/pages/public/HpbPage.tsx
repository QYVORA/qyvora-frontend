import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Shield, Zap, BookOpen, Users } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import { ScrollReveal } from '@/shared/components';
import SEO from '@/shared/components/SEO';
import StudentHeroSection from '@/shared/components/StudentHeroSection';
import { PHASES } from '@/features/marketing/data/learnData';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampConfig';

const HpbPage = () => {
  const { t } = useTranslation();
  const phases = BOOTCAMP_CONFIG.phases || [];

  return (
    <div className="bg-bg min-h-full">
      <SEO title="HPB - QYVORA" description="Hacker Protocol Bootcamp — Africa's most intensive offensive security training." noindex />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {phases.map((phase, idx) => (
              <ScrollReveal key={phase.id} amount={0.05}>
                <div className="rounded-2xl border border-border/30 bg-bg-card p-5 flex flex-col gap-3 hover:border-accent/30 transition-colors h-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Phase {idx + 1}</span>
                      <h4 className="text-sm font-black text-text-primary leading-tight">{phase.title}</h4>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed flex-1">{phase.codename}</p>
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-accent">
                    <Users className="w-3 h-3" /> {phase.rooms?.length || 0} rooms
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
