import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, BookOpen, Zap, Terminal, Globe, Code, Shield, Wifi, Wrench, Layers } from 'lucide-react';
import ScrollReveal from '@/shared/components/ScrollReveal';
import SEO from '@/shared/components/SEO';
import { Footer } from '@/shared/components/layout';
import { COURSES, COURSE_CATEGORIES, getCategoryById } from '@/features/student/data/courses/courseData';
import type { CourseCategoryId } from '@/features/student/data/courses/types';

const CATEGORY_ICONS: Record<CourseCategoryId, React.ElementType> = {
  terminal: Terminal,
  networking: Globe,
  programming: Code,
  'web-security': Shield,
  wireless: Wifi,
  tools: Wrench,
};

const CoursesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CourseCategoryId | 'all'>('all');

  const filtered = activeCategory === 'all'
    ? COURSES
    : COURSES.filter((c) => c.categoryId === activeCategory);

  return (
    <div className="min-h-screen bg-bg flex flex-col pt-[72px]">
      <SEO
        title="Courses"
        description="Self-paced cybersecurity courses. Master one skill at a time with hands-on, beginner-friendly walkthroughs."
      />

      <div className="mx-auto max-w-7xl w-full px-4 md:px-8 lg:px-12 py-12 md:py-16 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-accent/30 bg-accent/10 rounded-sm text-[10px] font-black uppercase tracking-widest text-accent mb-4">
            <BookOpen className="h-3.5 w-3.5" /> Self-Paced Learning
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none mb-4">
            QYVORA <span className="text-accent">Courses</span>
          </h1>
          <p className="text-sm md:text-base text-text-muted max-w-2xl leading-relaxed">
            Focused, beginner-friendly courses that teach one skill at a time. Learn at your own pace
            and build your cybersecurity foundation lesson by lesson.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${
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
                className={`flex items-center gap-2 px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${
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

        {/* Course grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-muted">No courses in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course, i) => {
              const category = getCategoryById(course.categoryId);
              return (
                <ScrollReveal key={course.id} direction="up" amount={0.1} delay={i * 0.05}>
                  <Link
                    to={`/courses/${course.id}`}
                    className="group block overflow-hidden rounded-sm border border-border/30 bg-bg-card transition-all hover:border-accent/40"
                  >
                    {/* Cover */}
                    <div className="aspect-[8/5] overflow-hidden bg-bg-elevated">
                      <img
                        src={course.coverSvg}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-accent/10 text-[9px] font-black uppercase tracking-widest text-accent border border-accent/20">
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

                      <div className="flex items-center justify-between pt-2">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-accent/10 text-[10px] font-black text-accent">
                          <Zap className="h-3 w-3" /> {course.cpCost} CP
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                          View Course <ArrowRight className="h-3 w-3" />
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
      <Footer />
    </div>
  );
};

export default CoursesPage;
