import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, ArrowRight, Play, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import OptionalDecorImage from '../../../shared/components/OptionalDecorImage';
import api from '../../../core/services/api';
import { resolveImg } from '../../../shared/utils/resolveImg';
import { STUDENT_DECOR } from '../constants/studentDecorPaths';

const PHASE_IMGS = [
  '/HPB-image.png',
  '/HPB-image.png',
  '/HPB-image.png',
  '/HPB-image.png',
  '/HPB-image.png',
];

const SkeletonCard = ({ wide = false }: { wide?: boolean }) => (
  <div
    className={`overflow-hidden rounded-2xl border-2 border-border bg-bg-card animate-pulse ${wide ? 'flex flex-col md:flex-row' : ''}`}
  >
    <div className={`bg-accent-dim/30 ${wide ? 'h-48 md:h-auto md:w-1/3' : 'aspect-video'}`} />
    <div className="flex-1 space-y-3 p-6 md:p-7">
      <div className="h-3 w-1/4 rounded bg-accent-dim/30" />
      <div className="h-5 w-3/4 rounded bg-accent-dim/30" />
      <div className="h-3 w-full rounded bg-accent-dim/20" />
      <div className="mt-4 h-10 w-full rounded-lg bg-accent-dim/20" />
    </div>
  </div>
);

const Learn: React.FC = () => {
  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.get('/public/bootcamps'),
      api.get('/student/overview').catch(() => null),
    ])
      .then(([bcRes, ovRes]) => {
        if (!mounted) return;
        setBootcamps(Array.isArray(bcRes.data?.items) ? bcRes.data.items : []);
        if (ovRes?.data) setOverview(ovRes.data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const progressValue = overview?.snapshot?.find((s: any) => s?.id === 'progress')?.value || '0%';
  const currentPhase = overview?.progressMeta?.currentPhase?.title;

  return (
    <div className="min-h-screen bg-bg pb-12">
      <div className="mx-auto max-w-6xl px-4 pt-20 sm:px-6 md:px-10 md:pt-24">

        <ScrollReveal className="mb-10 md:mb-12">
          <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-bg-card p-6 sm:p-8 md:p-10">
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl" aria-hidden>
              <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-accent/12 blur-3xl" />
              <div className="absolute -bottom-16 left-1/4 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
            </div>
            <OptionalDecorImage
              src={STUDENT_DECOR.learnHubMascot}
              className="pointer-events-none absolute bottom-0 right-0 z-[1] hidden max-h-[180px] w-auto opacity-95 md:block md:max-h-[220px]"
            />

            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 flex-1">
                <span className="mb-3 block text-xs font-black uppercase tracking-[0.35em] text-accent md:text-sm">
                  Academy
                </span>
                <h1 className="mb-3 text-4xl font-black uppercase tracking-tight text-text-primary sm:text-5xl md:text-6xl">
                  Learning hub
                </h1>
                <p className="max-w-xl text-base text-text-secondary md:text-lg">
                  Everything you are training on — phases, drills, and progress in one place.
                </p>
              </div>

              {overview && (
                <div className="relative w-full flex-none rounded-2xl border-2 border-border bg-bg/80 p-6 backdrop-blur-sm sm:min-w-[260px] md:p-7">
                  <div className="mb-2 text-xs font-black uppercase tracking-widest text-text-muted">
                    {currentPhase || 'Overall progress'}
                  </div>
                  <div className="mb-3 font-mono text-4xl font-black text-accent md:text-5xl">{progressValue}</div>
                  <div className="relative h-3 w-full overflow-hidden rounded-full bg-accent-dim">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: progressValue }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full bg-accent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>

        <section className="mb-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="flex items-center gap-3 text-xl font-black text-text-primary md:text-2xl">
              <BookOpen className="h-7 w-7 text-accent md:h-8 md:w-8" />
              Bootcamp programs
            </h2>
            <Link
              to="/bootcamps"
              className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-accent hover:underline"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              <SkeletonCard wide />
              <SkeletonCard wide />
            </div>
          ) : bootcamps.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border bg-bg-card/60 p-12 text-center md:p-14">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-text-muted opacity-40 md:h-14 md:w-14" />
              <p className="mb-6 text-base text-text-muted md:text-lg">No bootcamps available yet.</p>
              <Link to="/bootcamps" className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-sm font-black uppercase md:text-base">
                Browse bootcamps
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              {bootcamps.slice(0, 4).map((bc, i) => {
                const moduleProgress = Array.isArray(overview?.modules) ? overview.modules : [];
                const related = moduleProgress.find(
                  (m: any) => String(m.bootcampId || m.id || '') === String(bc.id || '')
                );
                const progress = Number(related?.progress || 0);
                return (
                  <ScrollReveal key={bc.id || i} delay={i * 0.08}>
                    <Link
                      to={`/bootcamps/${bc.id || i}`}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-border bg-bg-card transition-all hover:border-accent/50 md:flex-row"
                    >
                      <div className="relative h-52 flex-none overflow-hidden md:h-auto md:w-[42%]">
                        <img
                          src={resolveImg(bc.image, PHASE_IMGS[i % PHASE_IMGS.length])}
                          alt={bc.title}
                          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.03]"
                        />
                        <div aria-hidden className="scanlines pointer-events-none absolute inset-0" />
                        {bc.level && (
                          <span className="absolute left-3 top-3 rounded-lg border border-border bg-bg/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-accent backdrop-blur-sm">
                            {bc.level}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-6 md:p-7">
                        <div>
                          <h3 className="mb-2 text-lg font-black text-text-primary transition-colors group-hover:text-accent md:text-xl">
                            {bc.title}
                          </h3>
                          {bc.description && (
                            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-text-muted">{bc.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase text-text-muted">
                            {bc.duration && (
                              <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" /> {bc.duration}
                              </span>
                            )}
                            {bc.priceLabel && <span>{bc.priceLabel}</span>}
                          </div>
                        </div>
                        <div className="mt-6">
                          {progress > 0 && (
                            <div className="mb-4">
                              <div className="mb-2 flex justify-between text-xs font-black uppercase tracking-wider text-text-muted">
                                <span>Progress</span>
                                <span>{progress}%</span>
                              </div>
                              <div className="h-2 w-full overflow-hidden rounded-full bg-accent-dim">
                                <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm font-black text-accent">
                            <Play className="h-4 w-4 fill-current" />
                            {progress > 0 ? 'Continue' : 'Start bootcamp'}
                            <ChevronRight className="ml-auto h-5 w-5 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Learn;
