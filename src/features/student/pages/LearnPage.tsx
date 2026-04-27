import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, ArrowRight, Play, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { resolveImg } from '../../../shared/utils/resolveImg';

const PHASE_IMGS = [
  '/images/Curriculum-images/phase1.webp',
  '/images/Curriculum-images/phase2.webp',
  '/images/Curriculum-images/phase3.webp',
  '/images/Curriculum-images/phase4.webp',
  '/images/Curriculum-images/phase5.webp',
];

const SkeletonCard = ({ wide = false }: { wide?: boolean }) => (
  <div className={`card-hsociety overflow-hidden animate-pulse ${wide ? 'flex flex-col md:flex-row' : ''}`}>
    <div className={`bg-accent-dim/30 ${wide ? 'md:w-1/3 h-48 md:h-auto' : 'aspect-video'}`} />
    <div className="p-5 space-y-3 flex-1">
      <div className="h-3 bg-accent-dim/30 rounded w-1/4" />
      <div className="h-4 bg-accent-dim/30 rounded w-3/4" />
      <div className="h-3 bg-accent-dim/20 rounded w-full" />
      <div className="h-9 bg-accent-dim/20 rounded w-full mt-4" />
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
    ]).then(([bcRes, ovRes]) => {
      if (!mounted) return;
      setBootcamps(Array.isArray(bcRes.data?.items) ? bcRes.data.items : []);
      if (ovRes?.data) setOverview(ovRes.data);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const progressValue = overview?.snapshot?.find((s: any) => s?.id === 'progress')?.value || '0%';
  const currentPhase = overview?.progressMeta?.currentPhase?.title;

  return (
    <div className="min-h-screen bg-bg pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-24">

        {/* ── HEADER ── */}
        <ScrollReveal className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-3 block">// ACADEMY</span>
              <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter uppercase mb-3">
                Learning Hub
              </h1>
              <p className="text-text-muted max-w-xl">
                All your training in one place.
              </p>
            </div>

            {/* Progress pill */}
            {overview && (
              <div className="flex-none bg-bg-card border border-border rounded-xl p-5 min-w-[200px]">
                <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">
                  {currentPhase || 'Overall Progress'}
                </div>
                <div className="text-2xl font-black text-accent font-mono mb-2">{progressValue}</div>
                <div className="h-1.5 w-full bg-accent-dim rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: progressValue }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-accent rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* ── BOOTCAMPS ── */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" /> Bootcamp Programs
            </h2>
            <Link to="/bootcamps" className="text-xs font-bold text-accent hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonCard wide /><SkeletonCard wide />
            </div>
          ) : bootcamps.length === 0 ? (
            <div className="p-10 bg-bg-card border border-border rounded-xl text-center">
              <BookOpen className="w-8 h-8 text-text-muted mx-auto mb-3 opacity-40" />
              <p className="text-text-muted text-sm mb-4">No bootcamps available yet.</p>
              <Link to="/bootcamps" className="btn-primary text-xs !py-2 !px-4">Browse Bootcamps</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bootcamps.slice(0, 4).map((bc, i) => {
                const moduleProgress = Array.isArray(overview?.modules) ? overview.modules : [];
                const related = moduleProgress.find((m: any) => String(m.bootcampId || m.id || '') === String(bc.id || ''));
                const progress = Number(related?.progress || 0);
                return (
                  <ScrollReveal key={bc.id || i} delay={i * 0.08}>
                    <Link to={`/bootcamps/${bc.id || i}`} className="group relative bg-bg-card border border-border rounded-xl overflow-hidden flex flex-col md:flex-row hover:border-accent/40 transition-all block">
                      <div className="md:w-2/5 h-44 md:h-auto relative overflow-hidden flex-none">
                        <img
                          src={resolveImg(bc.image, PHASE_IMGS[i % PHASE_IMGS.length])}
                          alt={bc.title}
                          className="w-full h-full object-cover transition-all duration-500"
                        />
                        {bc.level && (
                          <span className="absolute top-3 left-3 px-2 py-0.5 bg-bg/80 backdrop-blur-sm border border-border rounded text-[9px] font-bold uppercase text-accent tracking-widest">
                            {bc.level}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-bold text-text-primary group-hover:text-accent transition-colors mb-1">{bc.title}</h3>
                          {bc.description && (
                            <p className="text-xs text-text-muted line-clamp-2 mb-3">{bc.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-[10px] font-bold text-text-muted uppercase">
                            {bc.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {bc.duration}</span>}
                            {bc.priceLabel && <span>{bc.priceLabel}</span>}
                          </div>
                        </div>
                        <div className="mt-4">
                          {progress > 0 && (
                            <div className="mb-3">
                              <div className="flex justify-between text-[10px] font-bold text-text-muted uppercase mb-1">
                                <span>Progress</span><span>{progress}%</span>
                              </div>
                              <div className="h-1 w-full bg-accent-dim rounded-full overflow-hidden">
                                <div className="h-full bg-accent rounded-full" style={{ width: `${progress}%` }} />
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-xs font-bold text-accent">
                            <Play className="w-3 h-3 fill-current" />
                            {progress > 0 ? 'Continue' : 'Start Bootcamp'}
                            <ChevronRight className="w-3 h-3 ml-auto group-hover:translate-x-1 transition-transform" />
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
