import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Clock, ArrowRight, Zap, GraduationCap, Search, BookOpen, CheckCircle2,
  Play, BarChart3, Layers, Trophy,
} from 'lucide-react';
import ScrollReveal from '@/shared/components/ScrollReveal';
import SEO from '@/shared/components/SEO';
import { COURSES, getCategoryById } from '@/features/student/data/courses/courseData';
import api from '@/core/services/api';
import { MyCoursesSkeleton } from '@/features/student/components/StudentSkeletons';
import { LearningOverviewCard, LearningFilterStrip } from '@/features/student/components/learning';
import CoursePurchaseModal from '@/shared/components/CoursePurchaseModal';

const STORAGE_KEY = 'qyvora_course_progress';

type CourseTab = 'all' | 'in-progress' | 'completed';

const MyCoursesPage: React.FC = () => {
  const { t } = useTranslation();
  const [purchased, setPurchased] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
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
    }).catch((err) => { console.warn('[MyCourses] transactions failed:', err?.response?.status || err?.message); }).finally(() => setLoading(false));

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
    return '/courses';
  }, [availableCourses, courseProgress]);

  const filterTabs = useMemo(() => [
    { id: 'all', label: 'All', count: totalCourses },
    { id: 'in-progress', label: 'In Progress', count: inProgressCourses },
    { id: 'completed', label: 'Completed', count: completedCourses },
  ], [totalCourses, inProgressCourses, completedCourses]);

  return (
    <div className="bg-bg min-h-screen">
      <SEO title="My Courses" description="Your purchased courses." noindex />

      <div className=" px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-8">

        <LearningOverviewCard
          icon={<GraduationCap className="w-6 h-6 text-bg" />}
          title={t('student.myCourses.title')}
          description={t('student.myCourses.description')}
          stats={[
            { label: 'Enrolled', value: totalCourses },
            { label: 'In Progress', value: inProgressCourses },
            { label: 'Completed', value: completedCourses },
          ]}
          action={{
            label: totalCourses > 0 ? t('student.myCourses.continue') : t('student.myCourses.action.browse'),
            to: continuePath,
          }}
          progress={overallPct}
        />

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
              placeholder={t('student.myCourses.searchPlaceholder')}
              aria-label="Search my courses"
              className="w-full bg-bg border border-border rounded-xl py-3 pl-11 pr-4 text-sm font-mono text-text-primary placeholder:text-text-muted/30 outline-none focus:border-accent transition-colors caret-accent"
            />
          </div>
        )}

        {loading && <MyCoursesSkeleton />}

        {!loading && filteredAvailable.length > 0 && (
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
                    className="group block overflow-hidden rounded-2xl border border-border/30 bg-bg-card transition-all hover:border-accent/30 hover:scale-[1.01]"
                  >
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-accent/10 text-[9px] font-black uppercase tracking-widest text-accent border border-accent/20">
                          {category?.name}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-text-muted font-mono">
                          <Clock className="h-3 w-3" /> {course.estimatedMinutes} min
                        </span>
                      </div>
                      <h3 className="text-base font-black text-text-primary group-hover:text-accent transition-colors leading-tight break-words">
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
                            <CheckCircle2 className="h-3 w-3" /> {t('student.myCourses.completed')}
                          </span>
                        ) : canResume ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent group-hover:gap-2.5 transition-all">
                            <Play className="h-3 w-3" /> {t('student.myCourses.continue')} Lesson {progress.lastLesson + 1} <ArrowRight className="h-3 w-3" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent group-hover:gap-2.5 transition-all">
                            <BarChart3 className="h-3 w-3" /> {t('student.myCourses.start')} <ArrowRight className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        )}

        {!loading && availableCourses.length > 0 && filteredAvailable.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <Search className="h-10 w-10 text-text-muted/20 mx-auto" />
            <p className="text-text-muted text-sm">{t('student.myCourses.empty.search')}</p>
            <button onClick={() => { setSearchQuery(''); setActiveTab('all'); }} className="text-accent text-[10px] font-black uppercase tracking-widest hover:underline">
              {t('button.clear')}
            </button>
          </div>
        )}

        {!loading && lockedCourses.length > 0 && (
          <div>
            <h2 className="text-sm font-black text-text-muted uppercase tracking-widest mb-4">
              Locked Courses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {lockedCourses.map((course) => {
                const category = getCategoryById(course.categoryId);
                return (
                  <div
                    key={course.id}
                    className="group block overflow-hidden rounded-2xl border border-border/30 bg-bg-card/50 opacity-60"
                  >
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-bg-elevated text-[9px] font-black uppercase tracking-widest text-text-muted border border-border/20">
                          {category?.name}
                        </span>
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-accent/10 text-[9px] font-black text-accent">
                          <Zap className="h-2.5 w-2.5" /> {course.cpCost} CP
                        </span>
                      </div>
                       <h3 className="text-base font-black text-text-muted leading-tight break-words">
                         {course.title}
                       </h3>
                      <button
                        onClick={() => setSelectedCourseId(course.id)}
                        className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent hover:gap-2 transition-all"
                      >
                        View Details <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!loading && availableCourses.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <GraduationCap className="h-16 w-16 text-text-muted/20 mx-auto" />
            <p className="text-text-muted">{t('student.myCourses.empty.enrolled')}</p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:brightness-110"
            >
              {t('student.myCourses.action.browse')} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}
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

export default MyCoursesPage;
