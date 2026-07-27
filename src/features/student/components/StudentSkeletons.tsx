import { Skeleton } from '@/shared/components/ui';

/* ─── Shared: StudentHeroSection skeleton ───────────────────────────────────── */
const StudentHeroSectionSkeleton = ({ stats, action }: { stats?: number; action?: boolean } = {}) => (
  <div className="relative h-[calc(100dvh-5rem)] md:h-[calc(100dvh-6rem)] flex flex-col justify-center overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_39px,rgba(255,255,255,0.05)_39px,rgba(255,255,255,0.05)_40px)] bg-[length:40px_40px]" />
    </div>
    <div className="relative z-10 px-3 md:px-4 lg:px-6 py-12 md:py-16">
      <div className="w-full space-y-8">
        <Skeleton className="h-12 md:h-16 lg:h-20 w-64 md:w-80 bg-border/30 rounded-lg" />
        <Skeleton className="h-5 md:h-6 w-72 md:w-96 bg-border/20 rounded" />
        {stats && stats > 0 && (
          <div className="flex items-center gap-4 sm:gap-6">
            {[...Array(stats)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-7 md:h-8 w-16 bg-border/30 rounded" />
                <Skeleton className="h-2.5 w-14 bg-border/20 rounded" />
              </div>
            ))}
          </div>
        )}
        {action && (
          <Skeleton className="h-10 w-36 bg-border/30 rounded-xl" />
        )}
      </div>
    </div>
  </div>
);

/* ─── Profile Page Skeleton ─────────────────────────────────────────────────── */
export const ProfileSkeleton = () => (
  <div className="w-full bg-bg">
    <div className="px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24">
      <div className="space-y-10">
        {/* Identity block skeleton */}
        <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
          <div className="h-1 w-full bg-accent/30" />
          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-4 sm:gap-5">
              <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-border/30 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-32 bg-border/30 rounded" />
                  <Skeleton className="h-5 w-20 bg-border/30 rounded-lg" />
                  <Skeleton className="h-5 w-16 bg-border/30 rounded-lg" />
                </div>
                <Skeleton className="h-4 w-48 bg-border/20 rounded" />
                <Skeleton className="h-3 w-28 bg-border/20 rounded" />
              </div>
            </div>
            {/* XP bar skeleton */}
            <div className="mt-5 p-3 rounded-xl bg-bg-elevated border border-border/20">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-3 w-16 bg-border/30 rounded" />
                <Skeleton className="h-3 w-24 bg-border/20 rounded" />
              </div>
              <Skeleton className="h-2 w-full bg-border/20 rounded-full" />
            </div>
            <div className="flex gap-2 mt-5">
              <Skeleton className="h-9 w-24 bg-border/30 rounded-xl" />
              <Skeleton className="h-9 w-24 bg-border/30 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`rounded-2xl border p-5 flex flex-col gap-2.5 ${
              i === 0 ? 'border-accent/20 bg-accent/5' : 'border-border/30 bg-bg-card'
            }`}>
              <div className="flex items-center gap-3">
                <Skeleton className={`w-10 h-10 rounded-xl ${i === 0 ? 'bg-accent/15' : 'bg-bg-elevated'}`} />
                <Skeleton className="h-2.5 w-16 bg-border/30 rounded" />
              </div>
              <Skeleton className={`h-6 w-20 bg-border/30 rounded ${i === 0 ? 'bg-accent/10' : ''}`} />
            </div>
          ))}
        </div>

        {/* Activity + calendar skeleton */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-3 w-36 bg-border/30 rounded" />
              <Skeleton className="h-3 w-28 bg-border/20 rounded" />
            </div>
            <Skeleton className="h-[118px] w-full bg-border/20 rounded-lg" />
          </div>
          <div className="rounded-2xl border border-border/30 bg-bg-card p-5 space-y-3">
            <Skeleton className="h-4 w-32 bg-border/30 rounded" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-[30px] h-[30px] rounded-lg bg-border/30" />
                <Skeleton className="h-4 flex-1 bg-border/20 rounded" />
                <Skeleton className="h-3 w-12 bg-border/20 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Achievements skeleton */}
        <div className="rounded-2xl border border-border/30 bg-bg-card p-5 space-y-4">
          <Skeleton className="h-4 w-32 bg-border/30 rounded" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 bg-border/20 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Trophy cabinet skeleton */}
        <div className="rounded-2xl border border-border/30 bg-bg-card p-5 space-y-4">
          <Skeleton className="h-4 w-32 bg-border/30 rounded" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 bg-border/20 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─── Notifications Page Skeleton ───────────────────────────────────────────── */
export const NotificationsSkeleton = () => (
  <div className="bg-bg">
    <div className="px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-6">
      <StudentHeroSectionSkeleton stats={1} action />
      <div className="px-2 sm:px-6 md:px-8 pb-16 lg:px-8 lg:py-6 space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/30 bg-bg-card p-5">
            <div className="flex items-start gap-3">
              <Skeleton className="w-8 h-8 rounded-lg bg-border/30 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-24 bg-border/30 rounded" />
                  <Skeleton className="h-4 w-16 bg-border/30 rounded" />
                </div>
                <Skeleton className="h-3.5 w-3/4 bg-border/30 rounded" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-2.5 w-28 bg-border/30 rounded" />
                  <Skeleton className="h-3 w-16 bg-border/30 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─── Settings Page Skeleton ────────────────────────────────────────────────── */
export const SettingsSkeleton = () => (
  <div className="bg-bg">
    <div className="px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-6">
      <StudentHeroSectionSkeleton action />
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs skeleton */}
        <div className="lg:w-56 shrink-0">
          <div className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 bg-border/30 rounded-xl shrink-0" />
            ))}
          </div>
        </div>
        {/* Content skeleton */}
        <div className="flex-1 min-w-0">
          <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-border/30 px-6 py-4">
              <Skeleton className="w-5 h-5 bg-border/30 rounded" />
              <Skeleton className="h-4 w-36 bg-border/30 rounded" />
            </div>
            <div className="p-6 divide-y divide-border/30">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0 space-y-1">
                    <Skeleton className="h-3 w-32 bg-border/30 rounded" />
                    <Skeleton className="h-2.5 w-48 bg-border/20 rounded" />
                  </div>
                  <Skeleton className="w-11 h-6 bg-border/30 rounded-full shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─── Marketplace Page Skeleton ─────────────────────────────────────────────── */
export const MarketplaceSkeleton = () => (
  <div className="bg-bg">
    <div className="px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-6">
      <div className="pt-6 pb-8 md:px-6 lg:px-10 space-y-6">
        <StudentHeroSectionSkeleton stats={1} />
        {/* Search */}
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:items-center flex-wrap max-w-full px-4 md:px-0">
          <Skeleton className="h-12 w-64 bg-border/30 rounded-xl" />
        </div>
        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 md:px-0">
          <Skeleton className="h-10 w-28 bg-border/30 rounded-xl" />
          <Skeleton className="h-10 w-28 bg-border/30 rounded-xl" />
        </div>
        {/* Grid - 3 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-1 md:px-0">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
              <Skeleton className="aspect-[16/9] w-full bg-border/30" />
              <div className="flex flex-col gap-2 p-4">
                <Skeleton className="h-5 w-3/4 bg-border/30 rounded" />
                <Skeleton className="h-3 w-full bg-border/20 rounded" />
                <Skeleton className="h-3 w-2/3 bg-border/20 rounded" />
                <div className="flex items-center justify-between mt-auto pt-2">
                  <Skeleton className="h-4 w-16 bg-border/30 rounded" />
                  <Skeleton className="h-8 w-20 bg-border/30 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ─── Bootcamp Course Page Skeleton ─────────────────────────────────────────── */
export const BootcampCourseSkeleton = () => (
  <div className="bg-bg">
    <div className="px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-8">
      <StudentHeroSectionSkeleton stats={2} action />
      {/* Filter strip */}
      <div className="border border-border/30 rounded-xl bg-bg-card p-1.5 flex items-center gap-1">
        <Skeleton className="h-10 flex-1 bg-border/30 rounded-lg" />
        <Skeleton className="h-10 flex-1 bg-border/30 rounded-lg" />
        <Skeleton className="h-10 flex-1 bg-border/30 rounded-lg" />
      </div>
      {/* Recommended Next */}
      <div className="border border-accent/20 rounded-2xl bg-accent-dim/20 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Skeleton className="w-5 h-5 bg-border/30 rounded" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-2.5 w-32 bg-border/30 rounded" />
              <Skeleton className="h-4 w-48 bg-border/30 rounded" />
            </div>
          </div>
          <Skeleton className="h-10 w-28 bg-border/30 rounded-xl" />
        </div>
      </div>
      {/* Phase Sections */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/30 bg-bg-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 bg-border/30 rounded-lg" />
            <Skeleton className="h-5 w-40 bg-border/30 rounded" />
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="flex items-center gap-3 p-3 rounded-xl bg-bg-elevated/50">
                <Skeleton className="w-6 h-6 bg-border/30 rounded shrink-0" />
                <Skeleton className="h-3.5 flex-1 bg-border/30 rounded" />
                <Skeleton className="h-3 w-12 bg-border/30 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ─── My Courses Page Skeleton ──────────────────────────────────────────────── */
export const MyCoursesSkeleton = () => (
  <div className="bg-bg min-h-screen">
    <div className="px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-8">
      <StudentHeroSectionSkeleton stats={3} action />
      {/* Filter strip */}
      <div className="border border-border/30 rounded-xl bg-bg-card p-1.5 flex items-center gap-1">
        <Skeleton className="h-10 flex-1 bg-border/30 rounded-lg" />
        <Skeleton className="h-10 flex-1 bg-border/30 rounded-lg" />
        <Skeleton className="h-10 flex-1 bg-border/30 rounded-lg" />
      </div>
      {/* Search */}
      <div className="relative">
        <Skeleton className="h-12 w-full bg-border/30 rounded-xl" />
      </div>
      {/* Course cards - 3 columns on desktop, aspect-square */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
            <div className="flex flex-col gap-2 p-4 sm:p-5 md:p-6 lg:p-7 flex-1 aspect-square">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-20 bg-border/30 rounded-lg" />
                <Skeleton className="h-3 w-16 bg-border/20 rounded" />
              </div>
              <Skeleton className="h-5 w-3/4 bg-border/30 rounded" />
              <Skeleton className="h-3 w-full bg-border/20 rounded" />
              <Skeleton className="h-3 w-2/3 bg-border/20 rounded" />
              <div className="mt-auto pt-2 border-t border-border/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-2 w-20 bg-border/20 rounded" />
                  <Skeleton className="h-2 w-8 bg-border/30 rounded" />
                </div>
                <Skeleton className="h-1.5 w-full bg-border/20 rounded-full" />
              </div>
              <Skeleton className="h-8 w-24 bg-border/30 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─── Bootcamp Room Page Skeleton ───────────────────────────────────────────── */
export const BootcampRoomSkeleton = () => (
  <div className="bg-bg overflow-x-hidden">
    <div className="w-full px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24">
      {/* Header */}
      <header className="mb-8">
        <Skeleton className="h-3 w-48 bg-border/30 rounded mb-2" />
        <Skeleton className="h-10 w-64 bg-border/30 rounded mb-4" />
        <div className="border-l-4 border-border/30 pl-4 space-y-2 mb-4">
          <Skeleton className="h-4 w-full bg-border/30 rounded" />
          <Skeleton className="h-4 w-3/4 bg-border/30 rounded" />
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <Skeleton className="h-4 w-20 bg-border/30 rounded" />
          <Skeleton className="h-4 w-20 bg-border/30 rounded" />
          <Skeleton className="h-4 w-32 bg-border/30 rounded" />
        </div>
      </header>
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-3 w-32 bg-border/30 rounded" />
          <Skeleton className="h-3 w-16 bg-border/30 rounded" />
        </div>
        <Skeleton className="h-2 w-full bg-border/30 rounded-full" />
      </div>
      {/* Steps */}
      <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/30 bg-bg-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 bg-border/30 rounded-lg shrink-0" />
              <Skeleton className="h-5 w-40 bg-border/30 rounded" />
            </div>
            <Skeleton className="h-4 w-full bg-border/30 rounded" />
            <Skeleton className="h-4 w-3/4 bg-border/30 rounded" />
            <Skeleton className="h-4 w-5/6 bg-border/30 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─── Competitive Page Skeleton ─────────────────────────────────────────────── */
export const CompetitiveSkeleton = () => (
  <div className="bg-bg min-h-full">
    <div className="px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-6">
      <StudentHeroSectionSkeleton stats={1} action />
      {/* Period tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-20 bg-border/30 rounded-xl" />
        ))}
      </div>
      {/* Header row */}
      <div className="hidden md:grid grid-cols-[48px_1fr_140px_100px_80px] gap-4 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted/50 border-b border-border/40">
        <Skeleton className="h-3 w-6 bg-border/30 rounded" />
        <Skeleton className="h-3 w-20 bg-border/30 rounded" />
        <Skeleton className="h-3 w-12 bg-border/30 rounded" />
        <Skeleton className="h-3 w-10 bg-border/30 rounded" />
        <Skeleton className="h-3 w-12 bg-border/30 rounded" />
      </div>
      {/* Entries */}
      <div className="space-y-2 py-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="grid grid-cols-[36px_1fr] md:grid-cols-[48px_1fr_140px_100px_80px] gap-2 md:gap-4 px-4 md:px-6 py-4 rounded-2xl border border-border/30 bg-bg-card items-center">
            <Skeleton className="w-8 h-8 bg-border/30 rounded-lg mx-auto" />
            <div className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-border/30 shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-32 bg-border/30 rounded" />
                <Skeleton className="h-2.5 w-24 bg-border/30 rounded" />
              </div>
            </div>
            <Skeleton className="hidden md:block h-3 w-20 bg-border/30 rounded" />
            <Skeleton className="hidden md:block h-3 w-16 bg-border/30 rounded" />
            <Skeleton className="hidden md:block h-3 w-12 bg-border/30 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
