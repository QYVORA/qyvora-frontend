import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight, Zap, CheckCircle2, GraduationCap } from 'lucide-react';
import ScrollReveal from '@/shared/components/ScrollReveal';
import SEO from '@/shared/components/SEO';
import { COURSES, getCategoryById } from '@/features/student/data/courses/courseData';
import api from '@/core/services/api';

const MyCoursesPage: React.FC = () => {
  const [purchased, setPurchased] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cp/transactions?limit=100').then((r) => {
      const items = Array.isArray(r.data?.items) ? r.data.items : [];
      const purchasedIds = items.filter((tx: any) => tx.type === 'purchase').map((tx: any) => {
        return tx.metadata?.slug || String(tx.productId);
      });
      setPurchased(new Set(purchasedIds));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const availableCourses = COURSES.filter((c) => purchased.has(c.id));
  const lockedCourses = COURSES.filter((c) => !purchased.has(c.id));

  return (
    <div className="min-h-screen bg-bg">
      <SEO title="My Courses" description="Your purchased courses." />

      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">
              My <span className="text-accent">Courses</span>
            </h1>
            <p className="text-sm text-text-muted mt-1">Continue learning where you left off.</p>
          </div>
          <Link
            to="/courses"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-bg text-[10px] font-black uppercase tracking-widest transition-all hover:brightness-110"
          >
            Browse Courses <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <p className="text-text-muted">Loading your courses...</p>
          </div>
        )}

        {/* Available courses */}
        {!loading && availableCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-sm font-black text-text-muted uppercase tracking-widest mb-4">
              Unlocked Courses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map((course, i) => {
                const category = getCategoryById(course.categoryId);
                return (
                  <ScrollReveal key={course.id} direction="up" amount={0.1} delay={i * 0.05}>
                    <Link
                      to={`/dashboard/courses/${course.id}`}
                      className="group block overflow-hidden rounded-2xl border border-accent/30 bg-bg-card transition-all hover:border-accent/60 hover:shadow-lg hover:shadow-accent/10"
                    >
                      <div className="aspect-[16/9] overflow-hidden bg-bg-elevated">
                        <img src={course.coverSvg} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
                        <div className="pt-2">
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent group-hover:gap-2.5 transition-all">
                            Continue <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        )}

        {/* Locked courses */}
        {!loading && lockedCourses.length > 0 && (
          <div>
            <h2 className="text-sm font-black text-text-muted uppercase tracking-widest mb-4">
              Locked Courses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lockedCourses.map((course, i) => {
                const category = getCategoryById(course.categoryId);
                return (
                  <div
                    key={course.id}
                    className="group block overflow-hidden rounded-2xl border border-border/20 bg-bg-card/50 opacity-60"
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-bg-elevated">
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
  );
};

export default MyCoursesPage;
