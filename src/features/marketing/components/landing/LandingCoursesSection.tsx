import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { IconArrowRight } from '@/shared/components/icons';
import DragMarquee from '@/shared/components/carousel/DragMarquee';
import { useTranslation } from 'react-i18next';
import CourseBadge from '@/shared/components/CourseBadge';

const COURSES = [
  { id: 'linux-terminal-101', tKey: 'linuxTerminal101', category: 'terminal', level: 'beginner', minutes: 70 },
  { id: 'windows-cmd-101', tKey: 'windowsCmd101', category: 'terminal', level: 'beginner', minutes: 50 },
  { id: 'networking-101', tKey: 'networking101', category: 'networking', level: 'beginner', minutes: 60 },
  { id: 'python-for-hackers-101', tKey: 'pythonForHackers', category: 'programming', level: 'beginner', minutes: 85 },
  { id: 'git-github-101', tKey: 'gitGithub101', category: 'programming', level: 'beginner', minutes: 55 },
  { id: 'web-technologies-101', tKey: 'webTechnologies', category: 'web-security', level: 'beginner', minutes: 55 },
  { id: 'web-recon-101', tKey: 'webReconnaissance', category: 'web-security', level: 'intermediate', minutes: 55 },
  { id: 'sql-injection-101', tKey: 'sqlInjection101', category: 'web-security', level: 'intermediate', minutes: 85 },
  { id: 'burp-suite-101', tKey: 'burpSuite101', category: 'tools', level: 'intermediate', minutes: 65 },
  { id: 'nmap-101', tKey: 'nmap101', category: 'tools', level: 'beginner', minutes: 60 },
  { id: 'wireshark-101', tKey: 'wireshark101', category: 'tools', level: 'intermediate', minutes: 65 },
  { id: 'wifi-fundamentals-101', tKey: 'wifiFundamentals', category: 'wireless', level: 'beginner', minutes: 55 },
];

type CourseEntry = (typeof COURSES)[number];

const CourseCard: React.FC<{ course: CourseEntry }> = ({ course }) => {
  const { t } = useTranslation();

  return (
    <Link
      to={`/courses/${course.id}`}
      className="group relative block h-[280px] sm:h-[320px] w-[min(80vw,340px)] sm:w-[min(52vw,380px)] md:w-[min(42vw,430px)] lg:w-[min(36vw,470px)] xl:w-[min(31vw,520px)] shrink-0 card-accent bg-bg-card overflow-hidden transition-colors duration-300"
    >
      <div className="relative z-10 h-full flex flex-col p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            <span className="self-start text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border border-border/50 bg-bg-elevated text-text-muted">
              {t(`landing.courses.level.${course.level}`)}
            </span>
            <span className="text-[9px] font-mono text-text-muted">{course.minutes}min</span>
          </div>
          <CourseBadge courseId={course.id} className="w-14 h-14 shrink-0" />
        </div>

        <div className="mt-auto">
          <h3 className="text-xl sm:text-2xl font-black text-text-primary tracking-tighter leading-none">
            {t(`landing.courses.list.${course.tKey}.title`)}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-2 min-h-[2.6em]">
            {t(`landing.courses.list.${course.tKey}.desc`)}
          </p>

          <div className="mt-3 pt-3 flex items-center gap-2 text-text-muted group-hover:text-accent transition-colors">
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest">{t('landing.courses.viewCourse', { defaultValue: 'View Course' })}</span>
            <IconArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};

const LandingCoursesSection: React.FC = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative bg-bg min-h-dvh lg:h-dvh flex flex-col overflow-x-clip overflow-hidden" data-nav-invert>
      <div className="relative z-10 w-full h-full px-3 md:px-4 lg:px-6 pt-24 md:pt-28 lg:pt-32 pb-6 md:pb-8 lg:pb-10 flex flex-col gap-8 lg:gap-12">
        <h2 className="text-lg md:text-xl lg:text-2xl font-black text-text-primary tracking-tighter leading-none shrink-0">
          {t('landing.courses.heading')}
        </h2>

        {shouldReduceMotion ? (
          /* Reduced motion — static responsive grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COURSES.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          /* Infinite horizontal marquee — grabbable strip, cards fill it fully */
          <div className="relative -mx-3 md:-mx-4 lg:-mx-6 flex-1 min-h-[360px] sm:min-h-0 min-w-0 overflow-x-clip overflow-y-visible flex items-center py-3">
            <DragMarquee speed={22} trackClassName="gap-4 md:gap-5 pr-4 md:pr-5" className="w-full">
              {COURSES.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </DragMarquee>
          </div>
        )}

        {/* Footer */}
        <div className="shrink-0">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors"
          >
            {t('landing.courses.viewAll', { count: COURSES.length })} <IconArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LandingCoursesSection);
