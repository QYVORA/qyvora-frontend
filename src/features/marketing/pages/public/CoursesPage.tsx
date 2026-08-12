import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { GraduationCap, Sparkles, TrendingUp } from 'lucide-react';
import { IconArrowRight, IconTerminal, IconNetwork, IconCode } from '@/shared/components/icons';
import { ScrollReveal } from '@/shared/components';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import PublicSnapSection from '@/shared/components/PublicSnapSection';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { COURSES, getCategoryById } from '@/features/student/data/courses';
import type { SkillLevel } from '@/features/student/data/courses';
import { BatchPagination } from '@/shared/components/ui';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  terminal: IconTerminal,
  networking: IconNetwork,
  programming: IconCode,
  'web-security': GraduationCap,
  wireless: TrendingUp,
  tools: IconTerminal,
};

const BATCH_SIZE = 3;

const CoursesPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(COURSES.length / BATCH_SIZE);
  const currentBatch = COURSES.slice(page * BATCH_SIZE, (page + 1) * BATCH_SIZE);

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
          title="Offensive"
          accentWord="Courses"
          titleClassName={PUBLIC_HERO_TITLE_CLASS}
          showGlobe
          typewrite
          description="Structured offensive security courses from terminal mastery to web exploitation."
        />

        <PublicSnapSection>
          <div className="flex flex-col justify-between flex-1 min-h-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 flex-1 items-stretch">
              {currentBatch.map((course) => {
                const category = getCategoryById(course.categoryId);
                const skillCfg = SKILL_CONFIG[course.skillLevel];
                const SkillIcon = skillCfg.icon;
                const CatIcon = CATEGORY_ICONS[course.categoryId] || IconTerminal;
                return (
                  <ScrollReveal key={course.id} amount={0.05} className="h-full">
                    <Link
                      to={`/courses/${course.id}`}
                      className="group flex flex-col h-full min-h-[220px] rounded-2xl border border-border/30 bg-bg-card p-4 sm:p-5 md:p-6 transition-all duration-300 hover:border-accent/30 justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-accent/10 text-[9px] font-black uppercase tracking-widest text-accent border border-accent/20">
                            <CatIcon className="h-2.5 w-2.5" /> {category?.name}
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">
                            {course.estimatedMinutes}min
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base md:text-lg font-black text-text-primary group-hover:text-accent transition-colors leading-snug break-words mb-1">
                          {course.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-3 mb-2">
                          {course.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/10">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${skillCfg.color}`}>
                          <SkillIcon className="h-2.5 w-2.5" /> {skillCfg.label}
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-accent">
                          {course.cpCost} CP
                        </span>
                      </div>
                    </Link>
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

export default CoursesPage;
