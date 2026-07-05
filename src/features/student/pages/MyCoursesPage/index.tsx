import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock, ArrowRight, Zap, GraduationCap, Search, BookOpen, CheckCircle2,
  Play, BarChart3, Layers, Trophy,
} from 'lucide-react';
import ScrollReveal from '@/shared/components/ScrollReveal';
import SEO from '@/shared/components/SEO';
import { COURSES, getCategoryById } from '@/features/student/data/courses/courseData';
import api from '@/core/services/api';

const STORAGE_KEY = 'qyvora_course_progress';

type CourseTab = 'all' | 'in-progress' | 'completed';

const MyCoursesPage: React.FC = () => {
  const [purchased, setPurchased] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<CourseTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [courseProgress, setCourseProgress] = useState<Record<string, { completed: number; total: number; lastLesson: number }>>({});

  useEffect(() => {
    api.get('/cp/transactions?limit=100').then((r) => {
      const items = Array.isArray(r.data?.items) ? r.data.items : [];
      const purchasedIds = items.filter((tx: any) => tx.type === 'purchase').map((tx: any) => {
        return tx.metadata?.slug || tx.metadata?.courseId || String(tx.productId);
      });
      setPurchased(new Set(purchasedIds));
    }).catch(() => {}).finally(() => setLoading(false));

    const progressData: Record<string, { completed: number; total: number; lastLesson: number }> = {};
    for (const course of COURSES) {
      try {
        const saved = localStorage.getItem(`${STORAGE_KEY}_${course.id}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          progressData[course.id] = {
            completed: parsed.completedLessons?.length || 0,
            total: course.lessons.length,
            lastLesson: parsed.lastLesson || 0,
          };
        }
      } catch {}
    }
    setCourseProgress(progressData);
  }, []);

  const availableCourses = COURSES.filter((c) => purchased.has(c.id));
  const lockedCourses = COURSES.filter((c) => !purchased.has(c.id));

  const filteredAvailable = useMemo(() => {
    let result = [...availableCourses];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) =>
        c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
      );
    }

    switch (activeTab) {
      case 'in-progress': {
        result = result.filter((c) => {
          const p = courseProgress[c.id];
          return p && p.completed > 0 && p.completed < p.total;
        });
        break;
      }
      case 'completed': {
        result = result.filter((c) => {
          const p = courseProgress[c.id];
          return p && p.completed >= p.total;
        });
        break;
      }
    }

    result.sort((a, b) => {
      const pA = courseProgress[a.id]?.completed || 0;
      const pB = courseProgress[b.id]?.completed || 0;
      return pB - pA;
    });

    return result;
  }, [availableCourses, searchQuery, activeTab, courseProgress]);

  const totalCourses = availableCourses.length;
  const completedCourses = availableCourses.filter((c) => {
    const p = courseProgress[c.id];
    return p && p.completed >= p.total;
  }).length;
  const inProgressCourses = availableCourses.filter((c) => {
    const p = courseProgress[c.id];
    return p && p.completed > 0 && p.completed < p.total;
  }).length;
  const overallPct = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

  return (
    <div className="bg-bg min-h-screen">
      <SEO title="My Courses" description="Your purchased courses." />

      <div className="lg:fixed lg:left-0 lg:right-0 lg:bottom-0 lg:top-24 lg:flex lg:flex-row lg:overflow-hidden">
        {/* ── LEFT SIDEBAR ── */}
        <div className="w-full lg:w-72 xl:w-80 lg:flex-none lg:h-full lg:overflow-y-auto lg:overscroll-contain scroll-hover lg:border-r lg:border-border lg:bg-bg">
          <div className="px-2 pt-4 pb-6 lg:p-5 space-y-4">
            {/* Progress card */}
            <div className="hidden lg:block relative overflow-hidden rounded-3xl border-2 border-accent/25 bg-accent-dim p-6">
              <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-accent/20 blur-3xl" aria-hidden />
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-1">Overall progress</p>
                <div className="text-5xl font-black text-accent font-mono mb-3">{overallPct}%</div>
                <div className="h-1.5 overflow-hidden rounded-full bg-bg/40 mb-3">
                  <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${overallPct}%` }} />
                </div>
                <p className="text-xs text-text-secondary">{completedCourses} of {totalCourses} courses completed</p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border-2 border-border bg-bg-card p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <BookOpen className="w-4 h-4 text-accent" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Courses</span>
                </div>
                <div className="font-mono text-2xl font-black text-text-primary">
                  {completedCourses}<span className="text-sm text-text-muted font-bold">/{totalCourses}</span>
                </div>
              </div>
              <div className="rounded-2xl border-2 border-border bg-bg-card p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <BarChart3 className="w-4 h-4 text-accent" />
                  <span className="text-[10px] font-black uppercase tracking-widest">In Progress</span>
                </div>
                <div className="font-mono text-2xl font-black text-text-primary">
                  {inProgressCourses}
                </div>
              </div>
            </div>

            {/* Course quick-nav */}
            <div className="overflow-hidden rounded-2xl border-2 border-border bg-bg-card">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <Trophy className="h-4 w-4 text-accent shrink-0" />
                <h3 className="text-xs font-black uppercase tracking-widest text-text-primary">Courses</h3>
              </div>
              <div className="divide-y divide-border/50">
                {availableCourses.length === 0 && (
                  <div className="px-4 py-6 text-center">
                    <p className="text-[10px] text-text-muted">No courses unlocked yet.</p>
                  </div>
                )}
                {availableCourses.map((c, idx) => {
                  const p = courseProgress[c.id];
                  const isComplete = p && p.completed >= p.total;
                  const isInProgress = p && p.completed > 0 && !isComplete;
                  return (
                    <Link
                      key={c.id}
                      to={`/dashboard/courses/${c.id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-accent-dim/10 transition-colors"
                    >
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border font-mono text-[10px] font-black ${
                        isComplete ? 'border-accent/30 bg-accent text-bg'
                          : isInProgress ? 'border-accent/30 bg-accent-dim text-accent'
                          : 'border-border bg-bg text-text-muted'
                      }`}>
                        {isComplete ? <CheckCircle2 className="h-3.5 w-3.5" />
                          : String(idx + 1).padStart(2, '0')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-text-primary truncate">{c.title}</p>
                      </div>
                      {isInProgress && (
                        <span className="text-[10px] font-mono font-black text-accent shrink-0">
                          {Math.round((p.completed / p.total) * 100)}%
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT MAIN ── */}
        <div className="w-full flex-1 min-w-0 lg:h-full lg:overflow-y-auto lg:overscroll-contain scroll-hover">
          <div className="px-2 pt-4 pb-16 lg:px-8 lg:py-6 space-y-8 max-w-5xl">
            {/* Header */}
            <div className="mb-8">
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                <span className="font-black uppercase tracking-widest text-accent">Dashboard</span>
              </div>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <h1 className="mb-2 text-4xl font-black text-text-primary md:text-5xl lg:text-6xl">
                    My <span className="text-accent">Courses</span>
                  </h1>
                  <p className="text-sm text-text-muted">Continue learning where you left off.</p>
                </div>
                <Link
                  to="/courses"
                  className="hidden sm:inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:brightness-110"
                >
                  Browse Courses <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Search + Tabs */}
            {!loading && availableCourses.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search my courses..."
                    className="w-full bg-bg-elevated border border-border rounded-lg pl-9 pr-4 py-2 text-sm font-mono text-text-primary placeholder:text-text-muted/30 outline-none focus:border-accent/40 transition-colors caret-accent"
                  />
                </div>
                <div className="flex items-center gap-1 bg-bg-elevated rounded-lg p-1 border border-border">
                  {(['all', 'in-progress', 'completed'] as CourseTab[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeTab === tab ? 'bg-accent text-bg' : 'text-text-muted hover:text-accent'
                      }`}
                    >
                      {tab === 'all' ? 'All' : tab === 'in-progress' ? 'In Progress' : 'Completed'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="text-center py-20">
                <p className="text-text-muted">Loading your courses...</p>
              </div>
            )}

            {/* Available courses */}
            {!loading && filteredAvailable.length > 0 && (
              <div className="mb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {filteredAvailable.map((course, i) => {
                    const category = getCategoryById(course.categoryId);
                    const progress = courseProgress[course.id];
                    const pct = progress ? Math.round((progress.completed / progress.total) * 100) : 0;
                    const canResume = progress && progress.completed > 0 && progress.completed < progress.total;
                    const isComplete = progress && progress.completed >= progress.total;
                    return (
                      <ScrollReveal key={course.id} direction="up" amount={0.1} delay={i * 0.05}>
                        <Link
                          to={`/dashboard/courses/${course.id}${canResume ? `?lesson=${progress.lastLesson}` : ''}`}
                          className="group block overflow-hidden rounded-3xl border border-border/40 bg-bg-card transition-all hover:border-accent/30 hover:scale-[1.01]"
                        >
                          <div className="aspect-[8/5] overflow-hidden bg-bg-elevated relative">
                            <img
                              src={course.coverSvg}
                              alt={course.title}
                              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isComplete ? 'brightness-75' : ''}`}
                            />
                            {(pct > 0 || isComplete) && (
                              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-bg/40">
                                <div className="h-full bg-accent transition-all duration-700" style={{ width: `${pct}%` }} />
                              </div>
                            )}
                            {isComplete && (
                              <div className="absolute top-3 right-3">
                                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-accent text-bg text-[8px] font-black uppercase tracking-widest">
                                  <CheckCircle2 className="h-2.5 w-2.5" /> Done
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent/10 text-[9px] font-black uppercase tracking-widest text-accent border border-accent/20">
                                {category?.name}
                              </span>
                              <span className="flex items-center gap-1 text-[10px] text-text-muted font-mono">
                                <Clock className="h-3 w-3" /> {course.estimatedMinutes} min
                              </span>
                            </div>
                            <h3 className="text-base font-black text-text-primary group-hover:text-accent transition-colors leading-tight">
                              {course.title}
                            </h3>
                            <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                              {course.description}
                            </p>

                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono text-text-muted">
                                  {progress?.completed || 0}/{progress?.total || course.lessons.length} lessons
                                </span>
                                <span className="text-[9px] font-mono text-accent">{pct}%</span>
                              </div>
                              <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                                <div className="h-full bg-accent transition-all duration-700" style={{ width: `${pct}%` }} />
                              </div>
                            </div>

                            <div className="pt-1">
                              {isComplete ? (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent/60">
                                  <CheckCircle2 className="h-3 w-3" /> Completed
                                </span>
                              ) : canResume ? (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent group-hover:gap-2.5 transition-all">
                                  <Play className="h-3 w-3" /> Continue Lesson {progress.lastLesson + 1} <ArrowRight className="h-3 w-3" />
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent group-hover:gap-2.5 transition-all">
                                  <BarChart3 className="h-3 w-3" /> Start Learning <ArrowRight className="h-3 w-3" />
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </ScrollReveal>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No results */}
            {!loading && availableCourses.length > 0 && filteredAvailable.length === 0 && (
              <div className="text-center py-16 space-y-3">
                <Search className="h-10 w-10 text-text-muted/20 mx-auto" />
                <p className="text-text-muted text-sm">No courses match your current filter.</p>
                <button onClick={() => { setSearchQuery(''); setActiveTab('all'); }} className="text-accent text-[10px] font-black uppercase tracking-widest hover:underline">
                  Clear filters
                </button>
              </div>
            )}

            {/* Locked courses */}
            {!loading && lockedCourses.length > 0 && (
              <div>
                <h2 className="text-sm font-black text-text-muted uppercase tracking-widest mb-4">
                  Locked Courses
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {lockedCourses.map((course, i) => {
                    const category = getCategoryById(course.categoryId);
                    return (
                      <div
                        key={course.id}
                        className="group block overflow-hidden rounded-3xl border border-border/40 bg-bg-card/50 opacity-60"
                      >
                        <div className="aspect-[8/5] overflow-hidden bg-bg-elevated">
                          <img src={course.coverSvg} alt={course.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-bg-elevated text-[9px] font-black uppercase tracking-widest text-text-muted border border-border/20">
                              {category?.name}
                            </span>
                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-accent/10 text-[9px] font-black text-accent">
                              <Zap className="h-2.5 w-2.5" /> {course.cpCost} CP
                            </span>
                          </div>
                          <h3 className="text-base font-black text-text-muted leading-tight">
                            {course.title}
                          </h3>
                          <Link
                            to={`/courses/${course.id}`}
                            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent hover:gap-2 transition-all"
                          >
                            View Details <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty state */}
            {!loading && availableCourses.length === 0 && (
              <div className="text-center py-20 space-y-4">
                <GraduationCap className="h-16 w-16 text-text-muted/20 mx-auto" />
                <p className="text-text-muted">You haven't unlocked any courses yet.</p>
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:brightness-110"
                >
                  Browse Courses <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCoursesPage;
