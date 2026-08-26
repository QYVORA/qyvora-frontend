import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const S = ({ className = '', ...props }: { className?: string; [key: string]: any }) => (
  <Skeleton
    className={className}
    baseColor="var(--color-bg-elevated)"
    highlightColor="var(--color-border)"
    borderRadius="0.5rem"
    {...props}
  />
);

/* ─── Shared: Hero skeleton ───────────────────────────────────────────────── */
const HeroSkeleton = ({ stats = 0, action = false }: { stats?: number; action?: boolean } = {}) => (
  <div className="relative flex flex-col justify-center overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_39px,rgba(255,255,255,0.05)_39px,rgba(255,255,255,0.05)_40px)] bg-[length:40px_40px]" />
    </div>
    <div className="relative z-10 px-3 md:px-4 lg:px-6 py-8 md:py-10">
      <div className="w-full space-y-8">
        <S className="h-16 md:h-20 lg:h-24 w-64 md:w-96 rounded-lg" />
        <S className="h-4 md:h-5 w-72 md:w-[28rem] rounded" />
        {stats > 0 && (
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {Array.from({ length: stats }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <S className="h-7 md:h-8 w-16 rounded" />
                <S className="h-2.5 w-14 rounded" />
              </div>
            ))}
          </div>
        )}
        {action && <S className="h-10 w-36 rounded-xl" />}
      </div>
    </div>
  </div>
);

/* ─── Shared: Section title skeleton ──────────────────────────────────────── */
const SectionTitle = ({ className = '' }: { className?: string }) => (
  <S className={`h-4 w-32 rounded ${className}`} />
);

/* ─── Dashboard Skeleton ──────────────────────────────────────────────────── */
export const DashboardSkeleton = () => (
  <div>
    {/* Hero Banner */}
    <div className="bg-bg px-3 md:px-4 lg:px-6 pt-8 pb-10">
      <div className="relative card-accent bg-bg-card p-6 sm:p-10 lg:p-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_39px,rgba(255,255,255,0.05)_39px,rgba(255,255,255,0.05)_40px)] bg-[length:40px_40px]" />
        </div>
        <div className="relative z-10 w-full sm:w-auto space-y-2">
          <S className="h-3 w-40 rounded" />
          <S className="h-8 lg:h-10 w-56 rounded-lg" />
          <S className="h-3 w-36 rounded" />
        </div>
        <S className="relative z-10 h-10 w-full sm:w-32 rounded-xl shrink-0" />
      </div>
    </div>

    {/* Section Navigation Buttons */}
    <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-3 p-3 md:p-5 lg:p-6 min-h-[100px] md:min-h-[120px] card-accent bg-bg-card">
            <S className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl md:rounded-2xl shrink-0" />
            <S className="h-2.5 w-16 rounded" />
          </div>
        ))}
      </div>
    </div>

    {/* Achievement Stats */}
    <div className="bg-bg px-3 md:px-4 lg:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        <div className="flex flex-col justify-center gap-4">
          <div className="space-y-2">
            <S className="h-7 w-40 rounded" />
            <S className="h-4 w-64 rounded" />
          </div>
          <S className="h-10 w-44 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3 p-4 md:p-5 lg:p-6 card-accent bg-bg-card">
              <S className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl md:rounded-2xl shrink-0" />
              <S className="h-2.5 w-14 rounded" />
              <S className="h-4 w-12 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Skill Matrix */}
    <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:h-[460px]">
        <div className="card-accent bg-bg-card p-4 md:p-6 flex flex-col items-center justify-center min-h-[360px] lg:min-h-0">
          <S className="w-64 h-64 md:w-72 md:h-72 rounded-full" />
        </div>
        <div className="card-accent bg-bg-card p-4 md:p-6 flex flex-col justify-between gap-2.5 min-h-[360px] lg:min-h-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <S className="h-2.5 w-20 rounded" />
              <S className="h-1.5 flex-1 rounded-full" />
              <S className="h-2.5 w-10 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Section Content */}
    <div className="bg-bg px-3 md:px-4 lg:px-6 py-10">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <S className="h-3 w-32 rounded" />
          <S className="h-3 w-16 rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-square card-accent bg-bg-card flex flex-col p-4 md:p-5">
              <div className="flex items-center gap-2 mb-3">
                <S className="w-8 h-8 rounded-xl shrink-0" />
                <S className="h-5 w-16 rounded-lg" />
              </div>
              <S className="h-5 w-3/4 rounded" />
              <S className="h-3 w-full rounded mt-2" />
              <S className="h-8 w-20 rounded-lg mt-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Rank Progress */}
    <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10 pb-20 lg:pb-24">
      <div className="rounded-2xl border border-accent/20 bg-bg-card p-6 md:p-8 lg:p-10 space-y-3">
        <div className="flex items-center justify-between">
          <S className="h-3 w-32 rounded" />
          <S className="h-4 w-10 rounded" />
        </div>
        <S className="h-3 w-full rounded-full" />
      </div>
    </div>
  </div>
);

/* ─── Profile Page Skeleton ───────────────────────────────────────────────── */
export const ProfileSkeleton = () => (
  <div className="bg-bg">
    {/* Identity block */}
    <div className="bg-bg px-3 md:px-4 lg:px-6 pt-8 pb-10">
      <div className="rounded-2xl border border-border/50 bg-bg-card overflow-hidden">
        <div className="h-1 w-full bg-accent/30" />
        <div className="p-5 sm:p-6 space-y-5">
          <div className="flex items-start gap-4 sm:gap-5">
            <S className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shrink-0" circle={false} />
            <div className="flex-1 space-y-3 pt-2">
              <S className="h-6 w-40 rounded" />
              <S className="h-4 w-56 rounded" />
            </div>
          </div>
          {/* XP bar */}
          <div className="p-3 rounded-xl bg-bg-elevated border border-border/20 space-y-2">
            <div className="flex items-center justify-between">
              <S className="h-3 w-16 rounded" />
              <S className="h-3 w-24 rounded" />
            </div>
            <S className="h-2 w-full rounded-full" />
          </div>
          <div className="flex gap-2">
            <S className="h-9 w-24 rounded-xl" />
          </div>
        </div>
      </div>
    </div>

    {/* Stats grid */}
    <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10">
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`rounded-2xl border p-5 flex flex-col gap-3 ${
            i === 0 ? 'border-accent/20 bg-accent/5' : 'border-border/50 bg-bg-card'
          }`}>
            <S className="w-10 h-10 rounded-xl" />
            <S className="h-6 w-20 rounded" />
            <S className="h-2.5 w-14 rounded" />
          </div>
        ))}
      </div>
    </div>

    {/* Activity */}
    <div className="bg-bg px-3 md:px-4 lg:px-6 py-10">
      <div className="rounded-2xl border border-border/50 bg-bg-card p-5 space-y-4">
        <SectionTitle />
        <S className="h-[118px] w-full rounded-lg" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <S className="w-8 h-8 rounded-lg shrink-0" />
            <S className="h-4 flex-1 rounded" />
          </div>
        ))}
      </div>
    </div>

    {/* Achievements */}
    <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10">
      <div className="rounded-2xl border border-border/50 bg-bg-card p-5 space-y-4">
        <SectionTitle />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <S key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    </div>

    {/* Labs + Courses + Trophy */}
    <div className="bg-bg px-3 md:px-4 lg:px-6 py-10 pb-20 lg:pb-24 space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/50 bg-bg-card p-5 space-y-4">
          <SectionTitle />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 2 }).map((_, j) => (
              <S key={j} className="h-28 rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Notifications Page Skeleton ─────────────────────────────────────────── */
export const NotificationsSkeleton = () => (
  <div className="bg-bg">
    <div className="bg-bg px-3 md:px-4 lg:px-6 pt-8 pb-10">
      <HeroSkeleton stats={1} action />
    </div>
    <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10 pb-20 lg:pb-24">
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/50 bg-bg-card p-5">
            <div className="flex items-start gap-3">
              <S className="w-8 h-8 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2.5">
                <S className="h-4 w-40 rounded" />
                <S className="h-3.5 w-2/3 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─── Settings Page Skeleton ──────────────────────────────────────────────── */
export const SettingsSkeleton = () => (
  <div className="bg-bg">
    <div className="bg-bg px-3 md:px-4 lg:px-6 pt-8 pb-10">
      <HeroSkeleton action />
    </div>
    <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10 pb-20 lg:pb-24">
      <div className="flex flex-col gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/50 bg-bg-card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-border/50 px-6 py-4">
              <S className="w-5 h-5 rounded" />
              <S className="h-4 w-36 rounded" />
            </div>
            <div className="p-6">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between gap-4 py-3">
                  <S className="h-4 w-40 rounded" />
                  <S className="w-11 h-6 rounded-full shrink-0" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─── Marketplace Page Skeleton ───────────────────────────────────────────── */
export const MarketplaceSkeleton = () => (
  <div className="bg-bg">
    <div className="bg-bg px-3 md:px-4 lg:px-6 pt-8 pb-10">
      <HeroSkeleton stats={1} />
    </div>
    <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10 pb-20 lg:pb-24 space-y-6">
      <S className="h-12 w-full sm:w-64 rounded-xl" />
      <div className="flex items-center gap-2">
        <S className="h-10 w-28 rounded-xl" />
        <S className="h-10 w-28 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/50 bg-bg-card overflow-hidden">
            <S className="aspect-[16/9] w-full rounded-none" />
            <div className="flex flex-col gap-2.5 p-4">
              <S className="h-5 w-3/4 rounded" />
              <S className="h-3 w-full rounded" />
              <div className="flex items-center justify-between pt-2">
                <S className="h-4 w-16 rounded" />
                <S className="h-8 w-20 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─── Bootcamp Course Page Skeleton ───────────────────────────────────────── */
export const BootcampCourseSkeleton = () => (
  <div className="bg-bg">
    <div className="bg-bg px-3 md:px-4 lg:px-6 pt-8 pb-10">
      <HeroSkeleton stats={2} action />
    </div>
    <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10 pb-20 lg:pb-24 space-y-8">
      {/* Filter strip */}
      <div className="border border-border/50 rounded-xl bg-bg-card p-1.5 flex items-center gap-1">
        <S className="h-10 flex-1 rounded-lg" />
        <S className="h-10 flex-1 rounded-lg" />
        <S className="h-10 flex-1 rounded-lg" />
      </div>
      {/* Recommended Next */}
      <div className="border border-accent/20 rounded-2xl bg-accent-dim/20 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <S className="w-10 h-10 rounded-xl" />
            <div className="space-y-2">
              <S className="h-2.5 w-32 rounded" />
              <S className="h-4 w-48 rounded" />
            </div>
          </div>
          <S className="h-10 w-28 rounded-xl" />
        </div>
      </div>
      {/* Phase sections */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/50 bg-bg-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <S className="w-8 h-8 rounded-lg" />
            <S className="h-5 w-40 rounded" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="flex items-center gap-3 p-3 rounded-xl bg-bg-elevated/50">
                <S className="w-6 h-6 rounded shrink-0" />
                <S className="h-3.5 flex-1 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ─── My Courses Page Skeleton (hero renders as real content) ─────────────── */
export const MyCoursesSkeleton = () => (
  <div className="space-y-8">
    {/* Filter strip */}
    <div className="border border-border/50 rounded-xl bg-bg-card p-1.5 flex items-center gap-1">
      <S className="h-10 flex-1 rounded-lg" />
      <S className="h-10 flex-1 rounded-lg" />
      <S className="h-10 flex-1 rounded-lg" />
    </div>
    {/* Search */}
    <S className="h-12 w-full rounded-xl" />
    {/* Course cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/50 bg-bg-card overflow-hidden aspect-square flex flex-col p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <S className="h-5 w-20 rounded-lg" />
            <S className="h-3 w-16 rounded" />
          </div>
          <div className="mt-4 space-y-2">
            <S className="h-5 w-3/4 rounded" />
            <S className="h-3 w-full rounded" />
          </div>
          <div className="mt-auto space-y-2.5 pt-3">
            <S className="h-2 w-24 rounded" />
            <S className="h-1.5 w-full rounded-full" />
            <S className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Bootcamp Room Page Skeleton ─────────────────────────────────────────── */
export const BootcampRoomSkeleton = () => (
  <div className="bg-bg overflow-x-hidden">
    <main className="w-full px-3 pt-8 md:px-4 lg:px-6">
      {/* Header */}
      <header className="mb-8 space-y-4">
        <S className="h-3 w-48 rounded" />
        <S className="h-10 w-64 rounded" />
        <div className="border-l-4 border-border/50 pl-4 space-y-2">
          <S className="h-4 w-full rounded" />
          <S className="h-4 w-3/4 rounded" />
        </div>
      </header>
      {/* Progress */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between">
          <S className="h-3 w-32 rounded" />
          <S className="h-3 w-16 rounded" />
        </div>
        <S className="h-2 w-full rounded-full" />
      </div>
      {/* Steps */}
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/50 bg-bg-card p-5 space-y-3">
            <S className="h-5 w-40 rounded" />
            <S className="h-4 w-full rounded" />
            <S className="h-4 w-3/4 rounded" />
          </div>
        ))}
      </div>
    </main>
  </div>
);

/* ─── Competitive Page Skeleton (hero renders as real content) ────────────── */
export const CompetitiveSkeleton = () => (
  <div className="space-y-6">
    {/* Period tabs */}
    <div className="flex items-center gap-2 flex-wrap">
      {Array.from({ length: 4 }).map((_, i) => (
        <S key={i} className="h-10 w-20 rounded-xl" />
      ))}
    </div>
    {/* Entries */}
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4 rounded-2xl border border-border/50 bg-bg-card">
          <S className="w-8 h-8 rounded-lg shrink-0" />
          <S className="w-9 h-9 md:w-10 md:h-10 rounded-xl shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <S className="h-3.5 w-32 rounded" />
            <S className="h-2.5 w-24 rounded" />
          </div>
          <S className="hidden md:block h-3 w-16 rounded" />
        </div>
      ))}
    </div>
  </div>
);

/* ─── Course Lesson Skeleton ──────────────────────────────────────────────── */
export const CourseLessonSkeleton = () => (
  <div className="bg-bg px-3 pb-20 pt-8 md:px-4 lg:px-6 lg:pb-24">
    <div className="space-y-8">
      {/* Progress bar */}
      <div className="rounded-2xl border border-border/50 bg-bg-card p-4 md:px-6 md:py-5">
        <div className="mb-3 flex items-center justify-between">
          <S className="h-3 w-24 rounded" />
          <S className="h-5 w-12 rounded" />
        </div>
        <S className="h-2 w-full rounded-full" />
      </div>
      {/* Step renderer area */}
      <div className="wc-prose">
        <section className="w-full border-t border-border/10 py-12 first:border-t-0 md:py-16">
          <div className="mb-8 flex items-center gap-4 md:mb-12">
            <S className="h-12 w-12 rounded-xl" />
            <S className="h-4 w-2/3 rounded" />
          </div>
          <div className="space-y-3">
            <S className="h-4 w-full rounded" />
            <S className="h-4 w-11/12 rounded" />
            <S className="h-4 w-4/5 rounded" />
            <S className="h-4 w-full rounded" />
            <S className="h-4 w-3/4 rounded" />
          </div>
        </section>
      </div>
      {/* Navigation */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 border-t border-border/5 pt-6 pb-16 mt-4">
        <S className="h-11 flex-1 rounded-xl sm:max-w-32" />
        <S className="order-3 h-3 w-16 self-center sm:order-none" />
        <S className="h-11 flex-1 rounded-xl sm:max-w-36" />
      </div>
    </div>
  </div>
);

/* ─── Lab Listing Skeleton (hero renders as real content) ─────────────────── */
export const LabListingSkeleton = () => (
  <div className="space-y-8">
    {/* Filter strip */}
    <div className="border border-border/50 rounded-xl bg-bg-card p-1.5 flex items-center gap-1">
      <S className="h-10 flex-1 rounded-lg" />
      <S className="h-10 flex-1 rounded-lg" />
      <S className="h-10 flex-1 rounded-lg" />
    </div>
    {/* Search */}
    <S className="h-12 w-full sm:w-64 rounded-xl" />
    {/* Accordion items */}
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/50 bg-bg-card overflow-hidden">
          <div className="flex items-center gap-4 p-5">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <S className="h-5 w-40 rounded" />
                <S className="h-5 w-16 rounded-lg" />
              </div>
              <S className="h-3 w-56 rounded" />
            </div>
            <S className="h-10 w-24 rounded-xl shrink-0" />
          </div>
        </div>
      ))}
    </div>
    {/* Related content */}
    <div className="mt-8 space-y-3">
      <SectionTitle />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/50 bg-bg-card p-4">
            <S className="h-4 w-3/4 rounded" />
            <S className="h-3 w-full rounded mt-2" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
