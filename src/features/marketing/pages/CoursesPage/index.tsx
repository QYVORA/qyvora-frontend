import React, { useState, useMemo, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Zap, Terminal, Globe,
  Wifi, Wrench, Layers, Sparkles, GraduationCap, TrendingUp,
} from 'lucide-react';
import { IconArrowRight, IconCode, IconShield, IconSearch, IconClock } from '@/shared/components/icons';
import ScrollReveal from '@/shared/components/ScrollReveal';
import SEO from '@/shared/components/SEO';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import { Footer } from '@/shared/components/layout';
import { GridBoxedBackground } from '@/shared/components/backgrounds';

const HackerGlobe = lazy(() => import('@/features/marketing/components/HackerGlobe'));
import { COURSES, COURSE_CATEGORIES, getCategoryById } from '@/features/student/data/courses/courseData';
import type { CourseCategoryId, SkillLevel } from '@/features/student/data/courses/types';

const CATEGORY_ICONS: Record<CourseCategoryId, React.ElementType> = {
  terminal: Terminal,
  networking: Globe,
  programming: IconCode,
  'web-security': IconShield,
  wireless: Wifi,
  tools: Wrench,
};

const SKILL_LEVEL_CONFIG: Record<SkillLevel, { label: string; color: string; icon: React.ElementType }> = {
  beginner: { label: 'Beginner', color: 'text-accent border-accent/30 bg-accent/10', icon: Sparkles },
  intermediate: { label: 'Intermediate', color: 'text-blue-400 border-blue-400/30 bg-blue-400/10', icon: TrendingUp },
  advanced: { label: 'Advanced', color: 'text-red-400 border-red-400/30 bg-red-400/10', icon: GraduationCap },
};

type SortMode = 'default' | 'popular' | 'price-low' | 'price-high' | 'duration';

const CoursesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CourseCategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('default');
  const [showSort, setShowSort] = useState(false);

  const filtered = useMemo(() => {
    let result = activeCategory === 'all'
      ? [...COURSES]
      : COURSES.filter((c) => c.categoryId === activeCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (getCategoryById(c.categoryId)?.name.toLowerCase() || '').includes(q)
      );
    }

    switch (sortMode) {
      case 'popular':
        result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        break;
      case 'price-low':
        result.sort((a, b) => a.cpCost - b.cpCost);
        break;
      case 'price-high':
        result.sort((a, b) => b.cpCost - a.cpCost);
        break;
      case 'duration':
        result.sort((a, b) => a.estimatedMinutes - b.estimatedMinutes);
        break;
    }
    return result;
  }, [activeCategory, searchQuery, sortMode]);

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <SEO
        title="Courses"
        description="Self-paced cybersecurity courses. Master one skill at a time with hands-on, beginner-friendly walkthroughs."
      />

      {/* ─── HERO: Full viewport ─── */}
      <section className="relative w-full min-h-dvh md:h-dvh md:overflow-hidden flex flex-col pt-[72px] bg-accent" data-nav-invert>
        <GridBoxedBackground opacity={0.5} blur={0} mask="right" />
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.03]" />
        <div className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent/[0.02] blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-accent/[0.015] blur-[100px]" />

        {/* ── Globe ── */}
        <div className="absolute inset-0 z-0 flex items-end justify-end">
          <div className="relative w-full h-full flex items-end justify-end">
            <ErrorBoundary scope="HackerGlobe" fallback={null}>
              <Suspense fallback={null}>
                <HackerGlobe scale={1.0} offset={[0.9, -0.7, 0]} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>

        <div className="relative z-10 w-full flex-1 mx-auto grid grid-cols-1 lg:grid-cols-2 text-left items-center md:h-full">
          {/* Left column */}
          <div className="flex flex-col items-start justify-center px-4 sm:px-8 md:px-12 lg:pl-16 xl:pl-20 lg:pr-8 xl:pr-12 pt-16 sm:pt-20 lg:pt-24 pb-14 sm:pb-16 lg:pb-16 w-full h-full">
            <div className="flex flex-col items-start w-full space-y-6 max-w-xl">
              <span className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 border border-bg/20 bg-bg/10 rounded-lg max-w-full">
                <span className="w-1.5 h-1.5 rounded-full bg-bg/60 animate-pulse flex-none" />
                <span className="font-mono text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-black uppercase tracking-[0.12em] min-[380px]:tracking-[0.14em] sm:tracking-[0.3em] text-bg whitespace-normal">
                  <BookOpen className="h-3 w-3 inline-block -mt-0.5 mr-1.5" /> Self-Paced Learning
                </span>
              </span>
              <h1 className="font-black text-bg leading-[1.08] tracking-tight w-full">
                <span className="block text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem] lg:leading-[1.1] xl:leading-[1.05] uppercase">
                  QYVORA{' '}
                  <span className="text-bg/80">Courses</span>
                </span>
              </h1>
              <p className="text-bg/70 text-sm sm:text-base lg:text-sm xl:text-base leading-relaxed max-w-xl animate-fade-in font-mono">
                Focused, beginner-friendly courses that teach one skill at a time.
                Learn at your own pace and build your cybersecurity foundation lesson by lesson.
              </p>
            </div>
          </div>

          <div className="hidden lg:block" />
        </div>
      </section>

      {/* ─── CONTENT: Search, filters, course grid ─── */}
      <section className="relative z-10 w-full border-t border-border/10">
        <div className="mx-auto max-w-7xl w-full px-4 md:px-8 lg:px-12 py-12 md:py-16">
          {/* Search + Sort */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                aria-label="Search courses"
                className="w-full bg-bg-elevated border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm font-mono text-text-primary placeholder:text-text-muted/30 outline-none focus:border-accent/40 transition-colors caret-accent"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                aria-expanded={showSort}
                aria-haspopup="listbox"
                className="px-4 py-2.5 rounded-xl bg-bg-elevated border border-border text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
              >
                {sortMode === 'default' ? 'Sort' : sortMode === 'popular' ? 'Popular' : sortMode === 'price-low' ? 'Lowest CP' : sortMode === 'price-high' ? 'Highest CP' : 'Duration'}
              </button>
              {showSort && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSort(false)} />
                  <div className="absolute right-0 top-full mt-1 z-50 bg-bg-card border border-border rounded-2xl p-2 min-w-[160px] shadow-xl" role="listbox" aria-label="Sort options">
                    {(['default', 'popular', 'price-low', 'price-high', 'duration'] as SortMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => { setSortMode(mode); setShowSort(false); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${
                          sortMode === mode ? 'bg-accent/10 text-accent' : 'text-text-muted hover:text-accent hover:bg-accent-dim'
                        }`}
                      >
                        {mode === 'default' ? 'Default' : mode === 'popular' ? 'Popular' : mode === 'price-low' ? 'Price: Low to High' : mode === 'price-high' ? 'Price: High to Low' : 'Duration'}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setActiveCategory('all')}
              aria-pressed={activeCategory === 'all'}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeCategory === 'all'
                  ? 'bg-accent text-bg'
                  : 'bg-bg-elevated text-text-muted border border-border/30 hover:border-accent/30 hover:text-accent'
              }`}
            >
              <Layers className="h-3 w-3" /> All
            </button>
            {COURSE_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.id];
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  aria-pressed={active}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    active
                      ? 'bg-accent text-bg'
                      : 'bg-bg-elevated text-text-muted border border-border/30 hover:border-accent/30 hover:text-accent'
                  }`}
                >
                  <Icon className="h-3 w-3" /> {cat.name}
                </button>
              );
            })}
          </div>

          {/* Results count */}
          <div className="mb-6 text-[10px] font-mono text-text-muted">
            {filtered.length} course{filtered.length !== 1 ? 's' : ''}
            {searchQuery && <> for &ldquo;{searchQuery}&rdquo;</>}
          </div>

          {/* Course grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <IconSearch className="h-12 w-12 text-text-muted/20 mx-auto" />
              <p className="text-text-muted">No courses found matching your criteria.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="text-accent text-[10px] font-black uppercase tracking-widest hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course, i) => {
                const category = getCategoryById(course.categoryId);
                const skillCfg = SKILL_LEVEL_CONFIG[course.skillLevel];
                const SkillIcon = skillCfg.icon;
                return (
                  <ScrollReveal key={course.id} direction="up" amount={0.1} delay={i * 0.05}>
                    <Link
                      to={`/courses/${course.id}`}
                      className="group block overflow-hidden rounded-2xl border border-border/30 bg-bg-card transition-all hover:border-accent/40"
                    >
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-accent/10 text-[9px] font-black uppercase tracking-widest text-accent border border-accent/20">
                            {category?.name}
                          </span>
                          <div className="flex items-center gap-2">
                            {course.popular && (
                              <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-yellow-500">
                                <TrendingUp className="h-2.5 w-2.5" /> Top
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-[10px] text-text-muted font-mono">
                              <IconClock size={12} /> {course.estimatedMinutes}min
                            </span>
                          </div>
                        </div>
                        <h3 className="text-base font-black text-text-primary group-hover:text-accent transition-colors leading-tight break-words">
                          {course.title}
                        </h3>
                        <p className="text-xs text-text-muted leading-relaxed line-clamp-2 break-words">
                          {course.description}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${skillCfg.color}`}>
                              <SkillIcon className="h-2.5 w-2.5" /> {skillCfg.label}
                            </span>
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/10 text-[10px] font-black text-accent">
                              <Zap className="h-3 w-3" /> {course.cpCost} CP
                            </span>
                          </div>
                          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                            View <IconArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CoursesPage;
