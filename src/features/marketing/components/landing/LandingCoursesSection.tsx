import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import { Carousel } from '@/shared/components/carousel';
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

/* ── Course card for the single-card content-switch carousel — text left, badge right ── */
const CourseCard: React.FC<{ course: CourseEntry }> = ({ course }) => {
  const { t } = useTranslation();

  return (
    <Link
      to={`/courses/${course.id}`}
      className="group flex flex-col md:flex-row bg-bg-card overflow-hidden h-full min-h-[520px] sm:min-h-[480px] lg:min-h-[460px] transition-[background-color] duration-[var(--dur-base)] ease-[var(--ease-smooth)] hover:bg-bg-elevated"
    >
      {/* Text region */}
      <div className="relative z-10 flex flex-col items-start text-left p-5 sm:p-6 md:p-7 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="self-start text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border border-border/50 bg-bg-elevated text-text-muted">
            {t(`landing.courses.level.${course.level}`)}
          </span>
          <span className="text-[9px] font-mono text-text-muted">{course.minutes}min</span>
        </div>

        <div className="mt-auto pt-4 w-full">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-text-primary tracking-tighter leading-none">
            {t(`landing.courses.list.${course.tKey}.title`)}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-2 md:line-clamp-3">
            {t(`landing.courses.list.${course.tKey}.desc`)}
          </p>

          <div className="mt-3 pt-3 flex items-center gap-2 text-text-muted group-hover:text-accent transition-colors">
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest">{t('landing.courses.viewCourse', { defaultValue: 'View Course' })}</span>
            <IconArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>

      {/* Visual region — the course insignia at meaningful scale, no glow */}
      <div className="relative z-10 shrink-0 flex items-center justify-center border-t md:border-t-0 md:border-l border-border/50 bg-bg-elevated min-h-[180px] md:min-h-0 md:w-[220px] lg:w-[260px] p-6 sm:p-8">
        <CourseBadge courseId={course.id} glow={false} className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 shrink-0" />
      </div>
    </Link>
  );
};

const LandingCoursesSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="relative bg-bg min-h-dvh flex flex-col overflow-x-clip" >
      <div className="relative z-10 w-full flex-1 min-h-0 px-3 md:px-4 lg:px-6 pt-24 md:pt-28 lg:pt-32 pb-6 md:pb-8 lg:pb-10 flex flex-col gap-8 lg:gap-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-text-primary tracking-tighter leading-[0.95] shrink-0">
          {t('landing.courses.heading')}
        </h2>

        {/* Single-card content-switch carousel — stable viewport while slides swap */}
        <div className="relative flex-1 min-h-0 min-w-0 flex items-center overflow-x-clip">
          <Carousel
            slides={COURSES}
            className="w-full"
            renderCard={(course) => (
              <CourseCard course={course} />
            )}
          />
        </div>

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