import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock, ArrowRight, GraduationCap, Search, CheckCircle2,
  Play, BarChart3,
} from 'lucide-react';
import ScrollReveal from '@/shared/components/ScrollReveal';
import SEO from '@/shared/components/SEO';
import { COURSES, getCategoryById } from '@/features/student/data/courses';
import CourseBadge from '@/shared/components/CourseBadge';
import api from '@/core/services/api';
import { MyCoursesSkeleton } from '@/features/student/components/StudentSkeletons';
import ErrorState from '@/shared/components/ui/ErrorState';
import PageHeader from '@/shared/components/ui/PageHeader';
import Button from '@/shared/components/ui/Button';
import { LearningFilterStrip } from '@/shared/components/learning';
import CoursePurchaseModal from '@/shared/components/CoursePurchaseModal';
import FadeIn from '@/shared/components/ui/FadeIn';
import LearningCard from '@/shared/components/learning/LearningCard';

const STORAGE_KEY = 'qyvora_course_progress';

type CourseTab = 'all' | 'in-progress' | 'completed';

const MyCoursesPage: React.FC = () => {
  const [purchased, setPurchased] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [activeTab, setActiveTab] = useState<CourseTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const [courseProgress, setCourseProgress] = useState<Record<string, { completed: number; total: number; lastLesson: number }>>({});

  useEffect(() => {
    api.get('/cp/transactions?limit=100').then((r) => {
      const items = Array.isArray(r.data?.items) ? r.data.items : [];
      const purchasedIds = items.filter((tx: any) => tx.type === 'purchase').map((tx: any) => {
        return tx.metadata?.slug || tx.metadata?.courseId || String(tx.productId);
      });
      setPurchased(new Set(purchasedIds));
    }).catch((err) => { console.warn('[MyCourses] transactions failed:', err?.response?.status || err?.message); setFetchError(true); }).finally(() => setLoading(false));

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

  const continuePath = useMemo(() => {
    const inProgress = availableCourses.find((c) => {
      const p = courseProgress[c.id];
      return p && p.completed > 0 && p.completed < p.total;
    });
    if (inProgress) {
      const p = courseProgress[inProgress.id];
      return `/dashboard/courses/${inProgress.id}?lesson=${p?.lastLesson || 0}`;
    }
    if (availableCourses.length > 0) {
      return `/dashboard/courses/${availableCourses[0].id}`;
    }
    return '/dashboard/courses';
  }, [availableCourses, courseProgress]);

  const filterTabs = useMemo(() => [
    { id: 'all', label: "All", count: totalCourses },
    { id: 'in-progress', label: "In Progress", count: inProgressCourses },
    { id: 'completed', label: "Completed", count: completedCourses },
  ], [totalCourses, inProgressCourses, completedCourses]);

  return (
    <FadeIn>
    <div className="min-h-full bg-canvas">
      <SEO title={"My Courses"} description={"Your purchased courses."} noindex />

      <div className="w-full px-3 pb-16 pt-6 md:px-4 md:pb-20 md:pt-8 lg:px-6 lg:pb-24">
        <PageHeader
          kicker={"QYVORA · Learn"}
          title={"My Courses"}
          description={"Your enrolled bootcamps and progress."}
          metadata={
            <span className="type-meta inline-flex items-center gap-2">
              <span className="font-bold text-accent">{totalCourses}</span> {"Enrolled"} · <span className="font-bold text-text-primary">{inProgressCourses}</span> {"In Progress"} · <span className="font-bold text-text-primary">{completedCourses}</span> {"Completed"}
            </span>
          }
          actions={
            <Button to={continuePath}>
              {totalCourses > 0 ? "Continue" : "Browse Bootcamps"}
            </Button>
          }
        />

        <div className="w-full space-y-8">

        {!loading && availableCourses.length > 0 && (
          <LearningFilterStrip
            filters={filterTabs}
            activeFilter={activeTab}
            onFilterChange={(id) => setActiveTab(id as CourseTab)}
          />
        )}

        {!loading && availableCourses.length > 0 && (
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={"Search courses…"}
              aria-label={"Search courses…"}
              className="w-full bg-bg border border-border rounded-xl py-3 pl-11 pr-4 text-sm font-mono text-text-primary placeholder:text-text-muted/30 outline-none focus:border-accent transition-colors caret-accent"
            />
          </div>
        )}

        {loading && <MyCoursesSkeleton />}

        {!loading && fetchError && (
          <ErrorState
            title={"Failed to load your courses."}
            message={"Check your connection and try again."}
          />
        )}

        {!loading && !fetchError && filteredAvailable.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredAvailable.map((course, i) => {
              const category = getCategoryById(course.categoryId);
              const progress = courseProgress[course.id];
              const pct = progress ? Math.round((progress.completed / progress.total) * 100) : 0;
              const canResume = progress && progress.completed > 0 && progress.completed < progress.total;
              const isComplete = progress && progress.completed >= progress.total;
              return (
                <ScrollReveal key={course.id} direction="up" amount={0.1} delay={i * 0.05}>
                  <LearningCard
                    id={course.id}
                    type="course"
                    title={course.title}
                    description={course.description}
                    to={`/dashboard/courses/${course.id}${canResume ? `?lesson=${progress.lastLesson}` : ''}`}
                    badgeText={category?.name}
                    badge={<CourseBadge courseId={course.id} className="w-14 h-14 shrink-0" />}
                    duration={`${course.estimatedMinutes} min`}
                    progress={pct}
                    difficulty={course.skillLevel}
                    actionLabel={
                      isComplete
                        ? "Completed"
                        : canResume
                        ? "Continue"
                        : "Start"
                    }
                  />
                </ScrollReveal>
              );
            })}
          </div>
        )}

        {!loading && availableCourses.length > 0 && filteredAvailable.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <Search className="h-10 w-10 text-text-muted/20 mx-auto" />
            <p className="text-text-muted text-sm">{"No courses match your search."}</p>
            <button onClick={() => { setSearchQuery(''); setActiveTab('all'); }} className="text-accent text-xs font-black uppercase tracking-widest hover:underline">
              {"Clear"}
            </button>
          </div>
        )}

        {!loading && lockedCourses.length > 0 && (
          <div>
              <h2 className="text-sm font-black text-text-muted uppercase tracking-widest mb-4">
                {"Locked Courses"}
              </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {lockedCourses.map((course) => {
                const category = getCategoryById(course.categoryId);
                return (
                  <div
                    key={course.id}
                    className="relative aspect-square rounded-2xl border border-border/50 bg-bg-card/50 opacity-60 p-3 md:p-5 flex flex-col overflow-hidden"
                  >
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 mb-2 opacity-50">
                      <div className="min-w-0">
                        <span className="px-2 py-0.5 rounded-lg bg-bg-elevated text-xs font-black uppercase tracking-widest text-text-muted border border-border/20">
                          {category?.name}
                        </span>
                        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-text-muted leading-snug break-words mt-1">
                          {course.title}
                        </h3>
                      </div>
                      <CourseBadge courseId={course.id} className="w-14 h-14 shrink-0" />
                    </div>
                    <div className="relative z-10 mt-auto pt-2">
                      <button
                        onClick={() => setSelectedCourseId(course.id)}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-xs font-black uppercase tracking-widest text-accent hover:gap-2 transition-[gap] duration-[var(--dur-base)] ease-[var(--ease-smooth)]"
                      >
                        {"View Details"} <ArrowRight className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!loading && !fetchError && availableCourses.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <GraduationCap className="h-16 w-16 text-text-muted/20 mx-auto" />
            <p className="text-text-muted">{"You aren't enrolled in any bootcamps yet."}</p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-on-accent rounded-xl text-xs font-black uppercase tracking-widest transition-[filter] duration-[var(--dur-base)] ease-[var(--ease-smooth)] hover:brightness-110"
            >
              {"Browse Bootcamps"} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}
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
    </FadeIn>
  );
};

export default MyCoursesPage;
