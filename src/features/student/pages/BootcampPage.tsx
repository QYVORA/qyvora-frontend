import React, { useEffect, useState } from 'react';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';

const resolveImg = (value?: string, fallback = '') => {
  const src = String(value || '').trim();
  if (!src) return fallback;
  if (/^https?:\/\//i.test(src)) return src;
  const apiBase = String(import.meta.env.VITE_API_BASE_URL || '').trim();

  if (src.startsWith('/uploads/')) {
    if (/^https?:\/\//i.test(apiBase)) {
      const origin = apiBase.replace(/\/api\/?$/, '');
      return `${origin}${src}`;
    }
    if (apiBase.startsWith('/api')) {
      return `/api${src}`;
    }
  }

  const base = apiBase.replace(/\/api\/?$/, '');
  return `${base}${src.startsWith('/') ? '' : '/'}${src}`;
};

const PHASE_IMGS = [
  '/images/Curriculum-images/phase1.webp',
  '/images/Curriculum-images/phase2.webp',
  '/images/Curriculum-images/phase3.webp',
  '/images/Curriculum-images/phase4.webp',
  '/images/Curriculum-images/phase5.webp',
];

const Bootcamp: React.FC = () => {
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
      .catch(() => { if (mounted) setBootcamps([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const moduleProgressMap = new Map<number, any>(
    (overview?.modules || []).map((m: any, i: number) => [i, m])
  );

  return (
    <div className="min-h-screen bg-bg pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        <ScrollReveal className="mb-10">
          <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-3 block">// ARSENAL</span>
          <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-3">Bootcamp Programs</h1>
          <p className="text-text-secondary max-w-2xl">
            Phased bootcamp modules building practical offensive security skills from fundamentals to advanced operations.
          </p>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0,1,2,3].map((i) => (
              <div key={i} className="card-hsociety overflow-hidden animate-pulse">
                <div className="aspect-video bg-accent-dim/30" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-accent-dim/30 rounded w-1/4" />
                  <div className="h-4 bg-accent-dim/30 rounded w-3/4" />
                  <div className="h-3 bg-accent-dim/20 rounded w-1/2" />
                  <div className="h-10 bg-accent-dim/20 rounded w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : bootcamps.length === 0 ? (
          <div className="py-20 text-center">
            <BookOpen className="w-10 h-10 text-text-muted mx-auto mb-4 opacity-40" />
            <p className="text-text-muted text-sm">No bootcamps available yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bootcamps.map((bc, i) => {
              const prog = moduleProgressMap.get(i);
              const progress = Number(prog?.progress || 0);
              return (
                <ScrollReveal key={bc.id || i} delay={i * 0.08}>
                  <div className="card-hsociety overflow-hidden flex flex-col group hover:border-accent/40 transition-all">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={resolveImg(bc.image, PHASE_IMGS[i % PHASE_IMGS.length])}
                        alt={bc.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                      {bc.level && (
                        <span className="absolute top-3 left-3 px-2 py-0.5 bg-bg/80 backdrop-blur-sm border border-border rounded text-[9px] font-bold uppercase text-accent tracking-widest">
                          {bc.level}
                        </span>
                      )}
                      {progress > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-bg/50">
                          <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-base font-bold text-text-primary group-hover:text-accent transition-colors mb-2">{bc.title}</h3>
                      {bc.description && (
                        <p className="text-xs text-text-muted line-clamp-2 mb-3">{bc.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-[10px] font-bold text-text-muted uppercase mb-4">
                        {bc.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {bc.duration}</span>}
                        {bc.priceLabel && <span>{bc.priceLabel}</span>}
                        {progress > 0 && <span className="text-accent">{progress}% done</span>}
                      </div>
                      <Link
                        to={`/bootcamps/${bc.id || i}`}
                        className="mt-auto w-full btn-primary !py-2.5 text-xs flex items-center justify-center gap-2"
                      >
                        {progress > 0 ? 'Continue' : 'Enroll Now'} <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bootcamp;
