import { Skeleton } from '@/shared/components/ui';

/* ─── Shared: LearningOverviewCard skeleton ─────────────────────────────────── */
const OverviewCardSkeleton = ({ action, stats, breadcrumbs }: { action?: boolean; stats?: number; breadcrumbs?: boolean } = {}) => (
  <>
    {breadcrumbs && (
      <div className="flex items-center gap-2 mb-1">
        <Skeleton className="h-3 w-20 bg-border/30 rounded" />
        <Skeleton className="h-3 w-3 bg-border/30 rounded" />
        <Skeleton className="h-3 w-24 bg-border/30 rounded" />
      </div>
    )}
    <div className="rounded-2xl border border-bg/20 bg-accent p-8 sm:p-10 lg:p-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_39px,rgba(255,255,255,0.15)_39px,rgba(255,255,255,0.15)_40px)] bg-[length:40px_40px]" />
      </div>
      <div className="relative z-10 w-full sm:w-auto min-w-0 space-y-3">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-bg/15 flex items-center justify-center">
            <Skeleton className="w-6 h-6 bg-bg/30 rounded" />
          </div>
        </div>
        <Skeleton className="h-8 w-56 bg-bg/20 rounded-lg sm:h-9 lg:h-10" />
        <Skeleton className="h-4 w-72 bg-bg/15 rounded" />
        {stats && stats > 0 && (
          <div className="flex items-center gap-4 mt-5">
            {[...Array(stats)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-6 w-16 bg-bg/20 rounded" />
                <Skeleton className="h-3 w-14 bg-bg/15 rounded" />
              </div>
            ))}
          </div>
        )}
      </div>
      {action && (
        <div className="relative z-10 shrink-0 w-full sm:w-auto">
          <Skeleton className="h-11 w-full sm:w-40 bg-bg/20 rounded-xl" />
        </div>
      )}
    </div>
  </>
);

/* ─── Profile Page Skeleton ─────────────────────────────────────────────────── */
export const ProfileSkeleton = () => (
  <div className="w-full bg-bg">
    <div className=" px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24 space-y-6">
      <OverviewCardSkeleton stats={3} action />
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-28 bg-border/30 rounded" />
          <Skeleton className="h-3 w-40 bg-border/30 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-24 bg-border/30 rounded-xl" />
          <Skeleton className="h-10 w-24 bg-border/30 rounded-xl" />
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-bg-card px-4 py-3">
        <Skeleton className="w-5 h-5 bg-border/30 rounded shrink-0" />
        <Skeleton className="h-3 w-32 bg-border/30 rounded" />
        <Skeleton className="h-3 w-16 bg-border/30 rounded ml-auto" />
        <Skeleton className="w-4 h-4 bg-border/30 rounded shrink-0" />
      </div>
    </div>
  </div>
);

/* ─── Notifications Page Skeleton ───────────────────────────────────────────── */
export const NotificationsSkeleton = () => (
  <div className="bg-bg">
    <div className=" px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24 space-y-6">
      <div
        className="w-full flex-1 min-w-0 lg:h-full lg:overflow-y-auto lg:overscroll-contain scroll-hover"
        style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, black 24px)', maskImage: 'linear-gradient(to bottom, transparent 0px, black 24px)' }}
      >
        <div className="px-2 sm:px-6 md:px-8 pb-16 lg:px-8 lg:py-6 space-y-6">
          <OverviewCardSkeleton stats={1} />
          <div className="space-y-3">
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
    </div>
  </div>
);

/* ─── Settings Page Skeleton ────────────────────────────────────────────────── */
export const SettingsSkeleton = () => (
  <div className="bg-bg">
    <div className=" px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24 space-y-6">
      <OverviewCardSkeleton action />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Change Password */}
        <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border bg-accent-dim/5 px-6 py-4">
            <Skeleton className="w-5 h-5 bg-border/30 rounded" />
            <Skeleton className="h-4 w-36 bg-border/30 rounded" />
          </div>
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-3 w-28 bg-border/30 rounded mb-1.5" />
                <Skeleton className="h-10 w-full bg-border/30 rounded-xl" />
              </div>
            ))}
            <Skeleton className="h-10 w-full bg-border/30 rounded-xl" />
          </div>
        </div>
        {/* Recovery Token */}
        <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border bg-accent-dim/5 px-6 py-4">
            <Skeleton className="w-5 h-5 bg-border/30 rounded" />
            <Skeleton className="h-4 w-36 bg-border/30 rounded" />
          </div>
          <div className="p-6 space-y-5">
            <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
              <Skeleton className="h-3 w-full bg-border/30 rounded mb-2" />
              <Skeleton className="h-3 w-3/4 bg-border/30 rounded" />
            </div>
            <Skeleton className="h-16 w-full bg-border/30 rounded-xl" />
            <Skeleton className="h-10 w-full bg-border/30 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─── News Feed Page Skeleton ───────────────────────────────────────────────── */
export const NewsFeedSkeleton = () => (
  <div className="bg-bg">
    <div className=" px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24">
      <div className=" px-2 sm:px-6 md:px-8 pt-6 pb-8 space-y-6">
        <OverviewCardSkeleton action />
        {/* Featured carousel */}
        <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <Skeleton className="w-full lg:w-[45%] h-[180px] sm:h-[200px] lg:h-[280px] bg-border/30" />
            <div className="flex-1 p-5 sm:p-6 lg:p-8 space-y-3">
              <div className="flex gap-3">
                <Skeleton className="h-3 w-20 bg-border/30 rounded" />
                <Skeleton className="h-3 w-24 bg-border/30 rounded" />
              </div>
              <Skeleton className="h-8 w-3/4 bg-border/30 rounded-lg" />
              <Skeleton className="h-4 w-full bg-border/30 rounded" />
              <Skeleton className="h-3 w-32 bg-border/30 rounded mt-4" />
            </div>
          </div>
        </div>
        {/* Grid */}
        <Skeleton className="h-3 w-48 bg-border/30 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
              <Skeleton className="h-48 w-full bg-border/30" />
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-20 bg-border/30 rounded" />
                  <Skeleton className="h-3 w-24 bg-border/30 rounded" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-14 bg-border/30 rounded-lg" />
                  <Skeleton className="h-4 w-18 bg-border/30 rounded-lg" />
                  <Skeleton className="h-4 w-12 bg-border/30 rounded-lg" />
                </div>
                <Skeleton className="h-4 w-3/4 bg-border/30 rounded" />
                <Skeleton className="h-3 w-full bg-border/30 rounded" />
                <Skeleton className="h-3 w-1/2 bg-border/30 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ─── Marketplace Page Skeleton ─────────────────────────────────────────────── */
export const MarketplaceSkeleton = () => (
  <div className="bg-bg">
    <div className=" px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24 space-y-6">
      <div className=" pt-6 pb-8 md:px-6 lg:px-10 space-y-6">
        <OverviewCardSkeleton stats={1} />
        {/* Search */}
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:items-center flex-wrap max-w-full px-4 md:px-0">
          <Skeleton className="h-12 w-64 bg-border/30 rounded-xl" />
        </div>
        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 md:px-0">
          <Skeleton className="h-10 w-24 bg-border/30 rounded-xl" />
          <Skeleton className="h-10 w-24 bg-border/30 rounded-xl" />
        </div>
        {/* Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 px-1 md:px-0">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
              <Skeleton className="aspect-video w-full bg-border/30" />
              <div className="p-8 sm:p-10 space-y-3">
                <Skeleton className="h-6 w-3/4 bg-border/30 rounded" />
                <Skeleton className="h-3 w-full bg-border/30 rounded" />
                <div className="flex items-center justify-between mt-8">
                  <Skeleton className="h-8 w-24 bg-border/30 rounded" />
                  <Skeleton className="h-10 w-28 bg-border/30 rounded-xl" />
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
    <div className=" px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24 space-y-8">
      <OverviewCardSkeleton action stats={2} breadcrumbs />
      {/* Filter strip */}
      <div className="border border-border/30 rounded-xl bg-bg-card p-1.5 flex items-center gap-1">
        <Skeleton className="h-10 w-28 bg-border/30 rounded-xl" />
        <Skeleton className="h-10 w-28 bg-border/30 rounded-xl" />
        <Skeleton className="h-10 w-28 bg-border/30 rounded-xl" />
      </div>
      {/* Journey Map */}
      <div className="border border-border/30 rounded-2xl bg-bg-card p-5 md:p-6">
        <div className="flex items-center gap-2 mb-5">
          <Skeleton className="w-4 h-4 bg-border/30 rounded" />
          <Skeleton className="h-3 w-24 bg-border/30 rounded" />
        </div>
        <div className="flex flex-wrap gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-1 min-w-[120px]">
              <div className="rounded-lg border border-border/20 bg-bg-elevated px-3 py-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <Skeleton className="w-2 h-2 rounded-full bg-border/30" />
                  <Skeleton className="h-2.5 w-16 bg-border/30 rounded" />
                </div>
                <Skeleton className="h-3 w-24 bg-border/30 rounded mb-1.5" />
                <Skeleton className="h-1 w-full bg-border/30 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Recommended Next */}
      <div className="border border-accent/20 rounded-2xl bg-accent-dim/20 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 bg-border/30 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-32 bg-border/30 rounded" />
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
    <div className=" px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24 space-y-8">
      {/* Progress bar */}
      <Skeleton className="h-3 w-full bg-border/30 rounded-full" />
      {/* Filter strip */}
      <div className="border border-border/30 rounded-xl bg-bg-card p-1.5 flex items-center gap-1">
        <Skeleton className="h-10 w-20 bg-border/30 rounded-xl" />
        <Skeleton className="h-10 w-28 bg-border/30 rounded-xl" />
        <Skeleton className="h-10 w-24 bg-border/30 rounded-xl" />
      </div>
      {/* Search */}
      <div className="relative">
        <Skeleton className="h-12 w-full bg-border/30 rounded-xl" />
      </div>
      {/* Course cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-20 bg-border/30 rounded-lg" />
                <Skeleton className="h-3 w-16 bg-border/30 rounded" />
              </div>
              <Skeleton className="h-5 w-3/4 bg-border/30 rounded" />
              <Skeleton className="h-3 w-full bg-border/30 rounded" />
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-2.5 w-20 bg-border/30 rounded" />
                  <Skeleton className="h-2.5 w-8 bg-border/30 rounded" />
                </div>
                <Skeleton className="h-1.5 w-full bg-border/30 rounded-full" />
              </div>
              <Skeleton className="h-3 w-28 bg-border/30 rounded" />
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
    <div className="w-full px-4 sm:px-6 md:px-8 pt-8 pb-20 lg:pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 bg-border/30 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-20 bg-border/30 rounded" />
            <Skeleton className="h-5 w-48 bg-border/30 rounded" />
          </div>
        </div>
        <Skeleton className="h-8 w-20 bg-border/30 rounded-lg" />
      </div>
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
    <div className=" px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24 space-y-6">
      <OverviewCardSkeleton stats={1} action />
      {/* Tabs */}
      <div className="border border-border/30 rounded-xl bg-bg-card p-1.5 flex items-center gap-1">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-28 bg-border/30 rounded-xl" />
        ))}
      </div>
      {/* Header row */}
      <div className="hidden md:grid grid-cols-[48px_1fr_140px_100px_80px] gap-4 px-6 py-3 border-b border-border/40">
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
              <Skeleton className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-border/30 shrink-0" />
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
