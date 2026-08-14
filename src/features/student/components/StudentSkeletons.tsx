import { Skeleton } from '@/shared/components/ui';

/* Shared: skeleton for a section title line (uppercase label look) */
const SectionTitle = ({ className = '' }: { className?: string }) => (
  <Skeleton className={`h-4 w-32 rounded ${className}`} />
);

/* ─── Shared: StudentHeroSection skeleton ─────────────────────────────────── */
const HeroSkeleton = ({ stats = 0, action = false }: { stats?: number; action?: boolean } = {}) => (
  <div className="relative flex flex-col justify-center overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_39px,rgba(255,255,255,0.05)_39px,rgba(255,255,255,0.05)_40px)] bg-[length:40px_40px]" />
    </div>
    <div className="relative z-10 px-3 md:px-4 lg:px-6 py-8 md:py-10">
      <div className="w-full space-y-8">
        <Skeleton className="h-16 md:h-20 lg:h-24 w-64 md:w-96 rounded-lg" />
        <Skeleton className="h-4 md:h-5 w-72 md:w-[28rem] rounded bg-border/20" />
        {stats > 0 && (
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {Array.from({ length: stats }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-7 md:h-8 w-16 rounded" />
                <Skeleton className="h-2.5 w-14 rounded bg-border/20" />
              </div>
            ))}
          </div>
        )}
        {action && <Skeleton className="h-10 w-36 rounded-xl" />}
      </div>
    </div>
  </div>
);

/* ─── Profile Page Skeleton ───────────────────────────────────────────────── */
export const ProfileSkeleton = () => (
  <div className="bg-bg">
    {/* Identity block */}
    <div className="bg-bg px-3 md:px-4 lg:px-6 pt-8 pb-10">
      <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
        <div className="h-1 w-full bg-accent/30" />
        <div className="p-5 sm:p-6 space-y-5">
          <div className="flex items-start gap-4 sm:gap-5">
            <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-3 pt-2">
              <Skeleton className="h-6 w-40 rounded" />
              <Skeleton className="h-4 w-56 rounded bg-border/20" />
            </div>
          </div>
          {/* XP bar */}
          <div className="p-3 rounded-xl bg-bg-elevated border border-border/20 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-3 w-24 rounded bg-border/20" />
            </div>
            <Skeleton className="h-2 w-full rounded-full bg-border/20" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-xl" />
          </div>
        </div>
      </div>
    </div>

    {/* Stats grid */}
    <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10">
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`rounded-2xl border p-5 flex flex-col gap-3 ${
            i === 0 ? 'border-accent/20 bg-accent/5' : 'border-border/30 bg-bg-card'
          }`}>
            <Skeleton className={`w-10 h-10 rounded-xl ${i === 0 ? 'bg-accent/15' : 'bg-bg-elevated'}`} />
            <Skeleton className="h-6 w-20 rounded" />
            <Skeleton className="h-2.5 w-14 rounded bg-border/20" />
          </div>
        ))}
      </div>
    </div>

    {/* Activity */}
    <div className="bg-bg px-3 md:px-4 lg:px-6 py-10">
      <div className="rounded-2xl border border-border/30 bg-bg-card p-5 space-y-4">
        <SectionTitle />
        <Skeleton className="h-[118px] w-full rounded-lg bg-border/20" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
            <Skeleton className="h-4 flex-1 rounded bg-border/20" />
          </div>
        ))}
      </div>
    </div>

    {/* Achievements */}
    <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10">
      <div className="rounded-2xl border border-border/30 bg-bg-card p-5 space-y-4">
        <SectionTitle />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl bg-border/20" />
          ))}
        </div>
      </div>
    </div>

    {/* Labs + Courses + Trophy */}
    <div className="bg-bg px-3 md:px-4 lg:px-6 py-10 pb-20 lg:pb-24 space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/30 bg-bg-card p-5 space-y-4">
          <SectionTitle />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 2 }).map((_, j) => (
              <Skeleton key={j} className="h-28 rounded-xl bg-border/20" />
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
          <div key={i} className="rounded-2xl border border-border/30 bg-bg-card p-5">
            <div className="flex items-start gap-3">
              <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2.5">
                <Skeleton className="h-4 w-40 rounded" />
                <Skeleton className="h-3.5 w-2/3 rounded bg-border/20" />
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
          <div key={i} className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-border/30 px-6 py-4">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="h-4 w-36 rounded" />
            </div>
            <div className="p-6 divide-y divide-border/30">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between gap-4 py-3">
                  <Skeleton className="h-4 w-40 rounded" />
                  <Skeleton className="w-11 h-6 rounded-full shrink-0" />
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
      {/* Search */}
      <Skeleton className="h-12 w-full sm:w-64 rounded-xl" />
      {/* Tabs */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-28 rounded-xl" />
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
            <Skeleton className="aspect-[16/9] w-full rounded-none" />
            <div className="flex flex-col gap-2.5 p-4">
              <Skeleton className="h-5 w-3/4 rounded" />
              <Skeleton className="h-3 w-full rounded bg-border/20" />
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-4 w-16 rounded" />
                <Skeleton className="h-8 w-20 rounded-lg" />
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
      <div className="border border-border/30 rounded-xl bg-bg-card p-1.5 flex items-center gap-1">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 flex-1 rounded-lg" />
      </div>
      {/* Recommended Next */}
      <div className="border border-accent/20 rounded-2xl bg-accent-dim/20 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-2.5 w-32 rounded bg-border/20" />
              <Skeleton className="h-4 w-48 rounded" />
            </div>
          </div>
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>
      {/* Phase sections */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/30 bg-bg-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="h-5 w-40 rounded" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="flex items-center gap-3 p-3 rounded-xl bg-bg-elevated/50">
                <Skeleton className="w-6 h-6 rounded shrink-0" />
                <Skeleton className="h-3.5 flex-1 rounded bg-border/20" />
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
    <div className="border border-border/30 rounded-xl bg-bg-card p-1.5 flex items-center gap-1">
      <Skeleton className="h-10 flex-1 rounded-lg" />
      <Skeleton className="h-10 flex-1 rounded-lg" />
      <Skeleton className="h-10 flex-1 rounded-lg" />
    </div>
    {/* Search */}
    <Skeleton className="h-12 w-full rounded-xl" />
    {/* Course cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden aspect-square flex flex-col p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-20 rounded-lg" />
            <Skeleton className="h-3 w-16 rounded bg-border/20" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-5 w-3/4 rounded" />
            <Skeleton className="h-3 w-full rounded bg-border/20" />
          </div>
          <div className="mt-auto space-y-2.5 pt-3">
            <Skeleton className="h-2 w-24 rounded bg-border/20" />
            <Skeleton className="h-1.5 w-full rounded-full bg-border/20" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Bootcamp Room Page Skeleton ─────────────────────────────────────────── */
export const BootcampRoomSkeleton = () => (
  <div className="bg-bg overflow-x-hidden">
    <div className="w-full px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24">
      {/* Header */}
      <header className="mb-8 space-y-4">
        <Skeleton className="h-3 w-48 rounded" />
        <Skeleton className="h-10 w-64 rounded" />
        <div className="border-l-4 border-border/30 pl-4 space-y-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
      </header>
      {/* Progress */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-32 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      {/* Steps */}
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/30 bg-bg-card p-5 space-y-3">
            <Skeleton className="h-5 w-40 rounded" />
            <Skeleton className="h-4 w-full rounded bg-border/20" />
            <Skeleton className="h-4 w-3/4 rounded bg-border/20" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─── Competitive Page Skeleton (hero renders as real content) ────────────── */
export const CompetitiveSkeleton = () => (
  <div className="space-y-6">
    {/* Period tabs */}
    <div className="flex items-center gap-2 flex-wrap">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-20 rounded-xl" />
      ))}
    </div>
    {/* Entries */}
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4 rounded-2xl border border-border/30 bg-bg-card">
          <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
          <Skeleton className="w-9 h-9 md:w-10 md:h-10 rounded-xl shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-3.5 w-32 rounded" />
            <Skeleton className="h-2.5 w-24 rounded bg-border/20" />
          </div>
          <Skeleton className="hidden md:block h-3 w-16 rounded" />
        </div>
      ))}
    </div>
  </div>
);
