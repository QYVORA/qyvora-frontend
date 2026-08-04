import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { GraduationCap, Sparkles, TrendingUp } from 'lucide-react';
import { IconArrowRight, IconTerminal, IconNetwork, IconCode } from '@/shared/components/icons';
import { ScrollReveal } from '@/shared/components';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { COURSES, getCategoryById } from '@/features/student/data/courses';
import type { SkillLevel } from '@/features/student/data/courses';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  terminal: IconTerminal,
  networking: IconNetwork,
  programming: IconCode,
  'web-security': GraduationCap,
  wireless: TrendingUp,
  tools: IconTerminal,
};

const CoursesPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const SKILL_CONFIG: Record<SkillLevel, { label: string; color: string; icon: React.ElementType }> = {
    beginner: { label: 'Beginner', color: 'text-accent border-accent/30 bg-accent/10', icon: Sparkles },
    intermediate: { label: 'Intermediate', color: 'text-blue-400 border-blue-400/30 bg-blue-400/10', icon: TrendingUp },
    advanced: { label: 'Advanced', color: 'text-red-400 border-red-400/30 bg-red-400/10', icon: GraduationCap },
  };

  return (
    <div className="bg-bg min-h-full">
      <SEO title="Courses - QYVORA" description="Master offensive security with QYVORA's structured courses." />
      <PublicSnapLayout>
        <StudentHeroSection
          title="Courses"
          titleClassName={PUBLIC_HERO_TITLE_CLASS}
          showGlobe
          typewrite
          description="Structured offensive security courses from terminal mastery to web exploitation."
        />

        <div className="min-h-dvh md:h-dvh md:overflow-y-auto px-3 md:px-4 lg:px-6">
          <div className="min-h-full flex flex-col justify-center py-16 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {COURSES.map((course) => {
            const category = getCategoryById(course.categoryId);
            const skillCfg = SKILL_CONFIG[course.skillLevel];
            const SkillIcon = skillCfg.icon;
            const CatIcon = CATEGORY_ICONS[course.categoryId] || IconTerminal;
            return (
              <ScrollReveal key={course.id} amount={0.05}>
                <Link
                  to={`/courses/${course.id}`}
                  className="group flex flex-col aspect-square rounded-2xl border border-border/30 bg-bg-card overflow-hidden transition-all duration-300 hover:border-accent/30"
                >
                  <div className="flex flex-col gap-2 p-4 sm:p-5 md:p-6 lg:p-7 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-accent/10 text-[9px] font-black uppercase tracking-widest text-accent border border-accent/20">
                        <CatIcon className="h-2.5 w-2.5" /> {category?.name}
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">
                        {course.estimatedMinutes}min
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-text-primary group-hover:text-accent transition-colors leading-snug break-words">
                      {course.title}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-text-muted leading-relaxed line-clamp-3 break-words flex-1">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${skillCfg.color}`}>
                        <SkillIcon className="h-2.5 w-2.5" /> {skillCfg.label}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-accent">
                        {course.cpCost} CP
                      </span>
                    </div>
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

export default CoursesPage;
