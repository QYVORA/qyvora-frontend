import React, { useEffect, useState } from 'react';
import { BookOpen, ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import StudentBootcampCard, { type StudentBootcampCardData } from '../components/StudentBootcampCard';

const BOOTCAMP_COVER_MAP: Record<string, string> = {
  bc_1775270338500: '/assets/bootcamp/hpb-cover.png',
};
const BOOTCAMP_COVER_FALLBACK = '/assets/bootcamp/hpb-cover.png';

function getBootcampCover(id: string, apiImage?: string): string {
  if (BOOTCAMP_COVER_MAP[id]) return BOOTCAMP_COVER_MAP[id];
  if (apiImage && /^https?:\/\//.test(apiImage.trim())) return apiImage.trim();
  return BOOTCAMP_COVER_FALLBACK;
}

const SkeletonCard = () => (
  <div className="card-hsociety overflow-hidden animate-pulse">
    <div className="aspect-video bg-accent-dim/30" />
    <div className="space-y-3 p-5">
      <div className="h-3 w-1/4 rounded bg-accent-dim/30" />
      <div className="h-5 w-3/4 rounded bg-accent-dim/30" />
      <div className="h-3 w-full rounded bg-accent-dim/20" />
      <div className="mt-4 h-10 w-full rounded-lg bg-accent-dim/20" />
    </div>
  </div>
);

const Learn: React.FC = () => {
  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [overview, setOverview]   = useState<any>(null);
  const [loading, setLoading]     = useState(true);

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
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const progressValue = overview?.snapshot?.find((s: any) => s?.id === 'progress')?.value || '0%';

  // Build enrolled set
  const enrolledIds = new Set<string>(
    (Array.isArray(overview?.modules) ? overview.modules : []).map((m: any) =>
      String(m.bootcampId || m.id || '')
    )
  );
  if (overview?.bootcampStatus && overview.bootcampStatus !== 'not_enrolled' && overview?.bootcampId) {
    enrolledIds.add(String(overview.bootcampId));
  }
  const moduleProgressById = new Map<string, any>(
    (Array.isArray(overview?.modules) ? overview.modules : []).map((m: any) => [
      String(m.bootcampId || m.id || ''),
      m,
    ])
  );

  const cards: StudentBootcampCardData[] = bootcamps.slice(0, 8).map((bc) => {
    const prog = moduleProgressById.get(String(bc.id || ''));
    return {
      id:          String(bc.id || ''),
      title:       bc.title || 'Bootcamp',
      description: String(bc.description || '').trim(),
      level:       String(bc.level || '').trim(),
      duration:    String(bc.duration || '').trim(),
      priceLabel:  String(bc.priceLabel || '').trim(),
      progress:    Number(prog?.progress || 0),
      img:         getBootcampCover(String(bc.id || ''), bc.image),
      isEnrolled:  enrolledIds.has(String(bc.id || '')),
      isLocked:    bc.isActive === false,
    };
  });

  return (
    <div className="min-h-screen bg-bg pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8 md:pt-10">

        {/* Header */}
        <ScrollReveal className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <span className="mb-3 block text-xs font-black uppercase tracking-[0.35em] text-accent md:text-sm">
              Academy
            </span>
            <h1 className="text-4xl font-black text-text-primary md:text-6xl">Learn</h1>
            <p className="mt-2 max-w-lg text-base text-text-muted">
              Phased bootcamp programs — pick a track and execute.
            </p>
          </div>
          {!loading && overview && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border-2 border-accent/25 bg-accent-dim px-3 sm:px-4 py-2 sm:py-2.5 inline-flex items-center gap-2">
                <span className="font-mono text-lg sm:text-xl font-black text-accent md:text-2xl">{progressValue}</span>
              </div>
              {bootcamps.length > 1 && (
                <Link
                  to="/bootcamps"
                  className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-accent hover:underline"
                >
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </ScrollReveal>

        {/* Section label */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.35em] text-text-primary">
            <BookOpen className="h-4 w-4 text-accent" />
            Bootcamp programs
          </h2>
          {bootcamps.length > 1 && (
            <Link
              to="/bootcamps"
              className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-accent hover:underline"
            >
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : bootcamps.length === 0 ? (
          <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border py-20 text-center">
            <img
              src="/assets/illustrations/cta-operator.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute right-0 bottom-0 h-full w-auto object-contain object-right-bottom opacity-[0.06] select-none"
            />
            <BookOpen className="mx-auto mb-4 h-10 w-10 text-text-muted opacity-40" />
            <p className="mb-5 text-base text-text-muted">No bootcamps available yet.</p>
            <Link to="/bootcamps" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm">
              Browse bootcamps <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cards.map((card, i) => (
              <StudentBootcampCard key={card.id || i} data={card} index={i} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Learn;
