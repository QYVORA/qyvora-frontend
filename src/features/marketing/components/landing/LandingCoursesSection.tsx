import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Wifi, Wrench, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { IconArrowRight, IconTerminal, IconNetwork, IconCode } from '@/shared/components/icons';
import { useTranslation } from 'react-i18next';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import CoursePurchaseModal from '@/shared/components/CoursePurchaseModal';
import DragMarquee from '@/shared/components/carousel/DragMarquee';
import { useAdaptiveUi } from '@/core/hooks/useAdaptiveUi';
import CourseBadge from '@/shared/components/CourseBadge';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  terminal: IconTerminal,
  networking: IconNetwork,
  programming: IconCode,
  'web-security': Globe,
  wireless: Wifi,
  tools: Wrench,
};

const CATEGORY_KEYS: Record<string, string> = {
  terminal: 'terminal',
  networking: 'networking',
  programming: 'programming',
  'web-security': 'webSecurity',
  wireless: 'wireless',
  tools: 'tools',
};

const COURSES = [
  { id: 'linux-terminal-101', tKey: 'linuxTerminal101', category: 'terminal', level: 'beginner', minutes: 70, popular: true },
  { id: 'windows-cmd-101', tKey: 'windowsCmd101', category: 'terminal', level: 'beginner', minutes: 50, popular: false },
  { id: 'networking-101', tKey: 'networking101', category: 'networking', level: 'beginner', minutes: 60, popular: true },
  { id: 'python-for-hackers-101', tKey: 'pythonForHackers', category: 'programming', level: 'beginner', minutes: 85, popular: true },
  { id: 'git-github-101', tKey: 'gitGithub101', category: 'programming', level: 'beginner', minutes: 55, popular: false },
  { id: 'web-technologies-101', tKey: 'webTechnologies', category: 'web-security', level: 'beginner', minutes: 55, popular: false },
  { id: 'web-recon-101', tKey: 'webReconnaissance', category: 'web-security', level: 'intermediate', minutes: 55, popular: true },
  { id: 'sql-injection-101', tKey: 'sqlInjection101', category: 'web-security', level: 'intermediate', minutes: 85, popular: true },
  { id: 'burp-suite-101', tKey: 'burpSuite101', category: 'tools', level: 'intermediate', minutes: 65, popular: false },
  { id: 'nmap-101', tKey: 'nmap101', category: 'tools', level: 'beginner', minutes: 60, popular: true },
  { id: 'wireshark-101', tKey: 'wireshark101', category: 'tools', level: 'intermediate', minutes: 65, popular: false },
  { id: 'wifi-fundamentals-101', tKey: 'wifiFundamentals', category: 'wireless', level: 'beginner', minutes: 55, popular: false },
];

const CATEGORIES = Object.keys(CATEGORY_KEYS);
const PER_PAGE = 3;
const CYCLE_MS = 3000;

type CourseEntry = (typeof COURSES)[number];

/* ── Compact card for the mobile marquee rows ─────────────────────────────── */
const CompactCourseCard: React.FC<{
  course: CourseEntry;
  onSelect: (id: string) => void;
}> = ({ course, onSelect }) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={() => onSelect(course.id)}
      aria-label={t(`landing.courses.list.${course.tKey}.title`)}
      className="group/card relative h-[140px] w-[min(80vw,340px)] shrink-0 card-accent bg-bg-card p-4 flex items-stretch gap-4 text-left overflow-hidden"
    >
      {/* Left side: Content */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex flex-col gap-1.5">
          <h4 className="text-sm font-black text-text-primary tracking-tight leading-snug line-clamp-2">
            {t(`landing.courses.list.${course.tKey}.title`)}
          </h4>
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
            <span className="rounded-lg border border-accent/20 bg-accent/10 px-2 py-0.5 text-accent">
              {t(`landing.courses.level.${course.level}`)}
            </span>
            <span className="text-text-muted">{course.minutes}m</span>
          </div>
        </div>
        
        <span className="inline-flex self-start">
          <span className="block px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent text-on-accent transition-all duration-200 group-hover/card:brightness-110 group-active:scale-95">
            {t('landing.courses.viewCourse', { defaultValue: 'View' })}
          </span>
        </span>
      </div>

      {/* Right side: Course Badge */}
      <div className="relative z-10 w-[100px] shrink-0 flex items-center justify-center">
        <CourseBadge courseId={course.id} className="w-20 h-20" />
      </div>
    </button>
  );
};

/* ── Full card for the desktop paged grid ─────────────────────────────────── */
const FullCourseCard: React.FC<{
  course: CourseEntry;
  onSelect: (id: string) => void;
}> = ({ course, onSelect }) => {
  const { t } = useTranslation();

  return (
    <button
      key={course.id}
      onClick={() => onSelect(course.id)}
      className="group/card relative card-accent bg-bg-card p-4 md:p-5 lg:p-6 transition-all duration-300 flex items-stretch gap-4 md:gap-5 lg:gap-6 text-left overflow-hidden min-h-[180px] lg:min-h-[200px]"
    >
      {/* Left side: Content */}
      <div className="relative z-10 flex flex-col justify-between flex-1 min-w-0">
        <div className="flex flex-col gap-2 md:gap-3">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border border-accent/20 bg-accent/10 text-accent">
              {t(`landing.courses.level.${course.level}`)}
            </span>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-text-muted">
              {course.minutes}m
            </span>
            {course.popular && (
              <span className="px-2 py-0.5 rounded-full bg-bg-elevated border border-border/50 text-[8px] font-black uppercase tracking-widest text-text-primary">
                {t('badge.popular')}
              </span>
            )}
          </div>

          {/* Title */}
          <h4 className="text-base md:text-lg lg:text-xl font-black text-text-primary tracking-tight leading-snug line-clamp-2">
            {t(`landing.courses.list.${course.tKey}.title`)}
          </h4>

          {/* Description */}
          <p className="text-xs md:text-sm text-text-muted leading-relaxed line-clamp-2">
            {t(`landing.courses.list.${course.tKey}.desc`)}
          </p>
        </div>

        {/* Button */}
        <div className="mt-4">
          <span className="inline-flex px-4 py-2 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest bg-accent text-on-accent transition-all duration-200 group-hover/card:brightness-110 group-active:scale-95">
            {t('landing.courses.viewCourse', { defaultValue: 'View' })}
          </span>
        </div>
      </div>

      {/* Right side: Course Badge */}
      <div className="relative z-10 w-[120px] md:w-[140px] lg:w-[160px] shrink-0 flex items-center justify-center">
        <CourseBadge courseId={course.id} className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32" />
      </div>
    </button>
  );
};

const LandingCoursesSection: React.FC = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const { isLg } = useAdaptiveUi();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const filteredCourses = useMemo(() => {
    return activeCategory ? COURSES.filter((c) => c.category === activeCategory) : COURSES;
  }, [activeCategory]);

  // Three interleaved rows so adjacent courses sit side by side while scrolling.
  const mobileRows = useMemo(() => [
    COURSES.filter((_, i) => i % 3 === 0),
    COURSES.filter((_, i) => i % 3 === 1),
    COURSES.filter((_, i) => i % 3 === 2),
  ], []);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / PER_PAGE));

  const advance = useCallback(() => {
    setDir(1);
    setPage((p) => (p + 1) % totalPages);
  }, [totalPages]);

  // Auto-paging drives the desktop grid only — mobile scrolls continuously.
  useEffect(() => {
    if (shouldReduceMotion || !isLg) return;
    const id = setInterval(advance, CYCLE_MS);
    return () => clearInterval(id);
  }, [advance, shouldReduceMotion, isLg]);

  useEffect(() => {
    setPage(0);
  }, [activeCategory]);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  const scrollTabs = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 160, behavior: 'smooth' });
  };

  const pageCourses = filteredCourses.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <div className="relative overflow-hidden min-h-dvh lg:h-dvh flex flex-col" data-nav-invert>
      <GridBoxedBackground blur={0} mask="right" />
      <div className="relative z-10 w-full h-full px-3 md:px-4 lg:px-6 pt-20 md:pt-24 lg:pt-24 pb-6 md:pb-8 lg:pb-10 flex flex-col">
        <div className="w-full flex-1 flex flex-col min-h-0">
          <h2 className="text-lg md:text-xl lg:text-2xl font-black text-text-primary tracking-tighter leading-none mb-6 md:mb-8 lg:mb-10 shrink-0">
            {t('landing.courses.heading')}
          </h2>

          {/* Mobile + tablet — three counter-scrolling rows, grabbable */}
          {!isLg ? (
            <div className="flex-1 min-h-0 flex flex-col justify-center gap-3 -mx-3 md:-mx-4">
              {mobileRows.map((row, rowIndex) => (
                <DragMarquee
                  key={rowIndex}
                  speed={16 + rowIndex * 5}
                  reverse={rowIndex % 2 === 1}
                  trackClassName="gap-3 pr-3"
                >
                  {row.map((course) => (
                    <CompactCourseCard key={course.id} course={course} onSelect={setSelectedCourseId} />
                  ))}
                </DragMarquee>
              ))}
            </div>
          ) : (
            <>
          {/* Category tabs — wrapping on desktop */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-4 md:mb-6 shrink-0"
          >
            {/* Left arrow — mobile only */}
            {canScrollLeft && (
              <button
                onClick={() => scrollTabs(-1)}
                className="md:hidden absolute -left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 aspect-square shrink-0 rounded-full bg-bg-card/90 border border-border/50 flex items-center justify-center text-text-muted hover:text-text-primary transition-all backdrop-blur-sm"
              >
                <ChevronLeft size={14} />
              </button>
            )}

            <div
              ref={scrollRef}
              className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-x-visible"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <button
                onClick={() => setActiveCategory(null)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 border ${
                  activeCategory === null
                    ? 'bg-bg-elevated text-text-primary border-border/50'
                    : 'bg-bg-card text-text-muted border-border/50 hover:bg-bg-elevated hover:text-text-primary'
                }`}
              >
                {t('landing.courses.filterAll')}
                <span className={`text-[9px] font-mono ${activeCategory === null ? 'text-text-muted' : 'text-text-muted/60'}`}>
                  {COURSES.length}
                </span>
              </button>
              {CATEGORIES.map((cat) => {
                const isActive = cat === activeCategory;
                const CatIconBtn = CATEGORY_ICONS[cat];
                const count = COURSES.filter((c) => c.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 border ${
                      isActive
                        ? 'bg-bg-elevated text-text-primary border-border/50'
                        : 'bg-bg-card text-text-muted border-border/50 hover:bg-bg-elevated hover:text-text-primary'
                    }`}
                  >
                    {CatIconBtn && <CatIconBtn className="w-3.5 h-3.5" />}
                    {t(`landing.courses.categories.${CATEGORY_KEYS[cat]}`)}
                    <span className={`text-[9px] font-mono ${isActive ? 'text-text-muted' : 'text-text-muted/60'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right arrow — mobile only */}
            {canScrollRight && (
              <button
                onClick={() => scrollTabs(1)}
                className="md:hidden absolute -right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 aspect-square shrink-0 rounded-full bg-bg-card/90 border border-border/50 flex items-center justify-center text-text-muted hover:text-text-primary transition-all backdrop-blur-sm"
              >
                <ChevronRight size={14} />
              </button>
            )}
          </motion.div>

          {/* Carousel — fills remaining space */}
          <div className="flex-1 flex flex-col min-h-0">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={`${activeCategory}-${page}`}
                custom={dir}
                initial={{ opacity: 0, x: dir > 0 ? 60 : -60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir > 0 ? -60 : 60 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 min-h-0 flex flex-col gap-3 md:gap-4"
              >
                {pageCourses.map((course) => (
                  <FullCourseCard key={course.id} course={course} onSelect={setSelectedCourseId} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
            </>
          )}

          {/* Footer */}
          <div className="mt-3 md:mt-4 shrink-0">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
            >
               {t('landing.courses.viewAll', { count: COURSES.length })} <IconArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {selectedCourseId && (
        <CoursePurchaseModal
          open={!!selectedCourseId}
          onOpenChange={(open) => { if (!open) setSelectedCourseId(null); }}
          courseId={selectedCourseId}
        />
      )}
    </div>
  );
};

export default React.memo(LandingCoursesSection);
