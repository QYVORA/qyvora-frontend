import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Sparkles, TrendingUp } from 'lucide-react';
import { IconArrowRight, IconTerminal, IconNetwork, IconCode } from '@/shared/components/icons';
import type { ViewMode } from '@/shared/components/card-collection';
import { getCategoryById } from '@/features/student/data/courses';
import type { Course, SkillLevel } from '@/features/student/data/courses';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  terminal: IconTerminal,
  networking: IconNetwork,
  programming: IconCode,
  'web-security': GraduationCap,
  wireless: TrendingUp,
  tools: IconTerminal,
};

const SKILL_CONFIG: Record<SkillLevel, { label: string; color: string; icon: React.ElementType }> = {
  beginner: { label: 'Beginner', color: 'text-accent border-accent/30 bg-accent/10', icon: Sparkles },
  intermediate: { label: 'Intermediate', color: 'text-blue-400 border-blue-400/30 bg-blue-400/10', icon: TrendingUp },
  advanced: { label: 'Advanced', color: 'text-red-400 border-red-400/30 bg-red-400/10', icon: GraduationCap },
};

interface CourseCardProps {
  course: Course;
  view: ViewMode;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, view }) => {
  const category = getCategoryById(course.categoryId);
  const skillCfg = SKILL_CONFIG[course.skillLevel];
  const SkillIcon = skillCfg.icon;
  const CatIcon = CATEGORY_ICONS[course.categoryId] || IconTerminal;

  if (view === 'expanded') {
    return (
      <Link
        to={`/courses/${course.id}`}
        className="group flex flex-col gap-2 card-accent bg-bg-card p-4 md:p-5 transition-all duration-300 justify-between text-left"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 border border-accent/20">
              <CatIcon className="w-4 h-4 text-accent" />
            </div>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-accent/10 text-[9px] font-black uppercase tracking-widest text-accent border border-accent/20">
                {category?.name}
              </span>
              <h3 className="text-sm sm:text-base md:text-lg font-black text-text-primary group-hover:text-accent transition-colors leading-snug truncate">
                {course.title}
              </h3>
            </div>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-text-muted shrink-0">
            {course.estimatedMinutes}min
          </span>
        </div>

        <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${skillCfg.color}`}>
            <SkillIcon className="h-2.5 w-2.5" /> {skillCfg.label}
          </span>
          <span className="flex items-center gap-3 shrink-0">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-accent">
              {course.cpCost} CP
            </span>
            <IconArrowRight size={12} className="text-text-muted group-hover:text-accent transition-colors" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/courses/${course.id}`}
      className="group flex flex-col h-full min-h-[220px] card-accent bg-bg-card p-4 sm:p-5 md:p-6 transition-all duration-300 justify-between"
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
      <div className="flex items-center justify-between mt-auto pt-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${skillCfg.color}`}>
          <SkillIcon className="h-2.5 w-2.5" /> {skillCfg.label}
        </span>
        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-accent">
          {course.cpCost} CP
        </span>
      </div>
    </Link>
  );
};

export default CourseCard;
