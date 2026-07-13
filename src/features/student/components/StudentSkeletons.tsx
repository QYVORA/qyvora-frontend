import { Skeleton } from '@/shared/components/ui';

/* ─── Profile Page Skeleton ─────────────────────────────────────────────────── */
export const ProfileSkeleton = () => (
  <div className="w-full bg-bg">
    <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-12 xl:px-16 pt-28 md:pt-24 lg:pt-28 pb-16">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16">
        {/* Left sidebar */}
        <div className="md:w-[280px] lg:w-[300px] shrink-0 space-y-6 md:sticky md:top-[72px] md:self-start md:pb-16">
          <Skeleton className="w-24 h-24 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full bg-border/30" />
          <Skeleton className="h-5 w-32 bg-border/30 rounded" />
          <Skeleton className="h-8 w-28 bg-border/30 rounded-lg" />
          <Skeleton className="h-6 w-20 bg-border/30 rounded-lg" />
          <Skeleton className="h-10 w-full bg-border/30 rounded-xl" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24 bg-border/30 rounded-xl" />
            <Skeleton className="h-10 w-24 bg-border/30 rounded-xl" />
            <Skeleton className="h-10 w-20 bg-border/30 rounded-xl" />
          </div>
        </div>
        {/* Right content */}
        <div className="flex-1 min-w-0 space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-64 bg-border/30 rounded-lg" />
            <Skeleton className="h-5 w-96 bg-border/30 rounded" />
            <div className="flex gap-6">
              <Skeleton className="h-4 w-32 bg-border/30 rounded" />
              <Skeleton className="h-4 w-40 bg-border/30 rounded" />
            </div>
          </div>
          <div className="border-t border-border/30 pt-6">
            <Skeleton className="h-12 w-full bg-border/30 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─── Notifications Page Skeleton ───────────────────────────────────────────── */
export const NotificationsSkeleton = () => (
  <div className="bg-bg">
    <div className="mx-auto max-w-[1600px] px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24 space-y-6">
      <div className="px-2 sm:px-6 md:px-8 pb-16 lg:px-8 lg:py-6">
        <div className="mb-10 md:mb-12 hidden lg:block">
          <Skeleton className="h-3 w-32 bg-border/30 rounded mb-2" />
          <Skeleton className="h-12 w-48 bg-border/30 rounded-lg mb-2" />
          <Skeleton className="h-4 w-64 bg-border/30 rounded" />
        </div>
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-bg-card p-5">
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
);

/* ─── Settings Page Skeleton ────────────────────────────────────────────────── */
export const SettingsSkeleton = () => (
  <div className="bg-bg">
    <div className="mx-auto max-w-[1600px] px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24 space-y-6">
      <div className="mb-10 md:mb-12 hidden lg:block">
        <Skeleton className="h-3 w-40 bg-border/30 rounded mb-2" />
        <Skeleton className="h-12 w-40 bg-border/30 rounded-lg mb-2" />
        <Skeleton className="h-4 w-72 bg-border/30 rounded" />
      </div>
      <div className="space-y-6">
        {/* Change Password */}
        <div className="rounded-3xl border-2 border-border bg-bg-card">
          <div className="flex items-center gap-3 border-b border-border bg-accent-dim/5 px-6 py-4">
            <Skeleton className="w-5 h-5 bg-border/30 rounded" />
            <Skeleton className="h-4 w-36 bg-border/30 rounded" />
          </div>
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-3 w-28 bg-border/30 rounded mb-1.5" />
                <Skeleton className="h-10 w-full bg-border/30 rounded-lg" />
              </div>
            ))}
            <Skeleton className="h-10 w-full bg-border/30 rounded-xl" />
          </div>
        </div>
        {/* Recovery Token */}
        <div className="rounded-3xl border-2 border-border bg-bg-card">
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
    <div className="mx-auto max-w-[1600px] px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24">
      <div className="mx-auto max-w-[1600px] px-2 sm:px-6 md:px-8 pt-6 pb-16">
        <div className="mb-6 md:mb-8">
          <Skeleton className="h-3 w-40 bg-border/30 rounded mb-2" />
          <Skeleton className="h-12 w-48 bg-border/30 rounded-lg mb-2" />
          <Skeleton className="h-4 w-72 bg-border/30 rounded mb-5" />
          <Skeleton className="h-10 w-32 bg-border/30 rounded-xl" />
        </div>
        {/* Featured carousel */}
        <div className="rounded-2xl border border-border bg-bg-card overflow-hidden mb-10 lg:mb-12">
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
        <Skeleton className="h-3 w-48 bg-border/30 rounded mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-bg-card overflow-hidden">
              <Skeleton className="aspect-video w-full bg-border/30" />
              <div className="p-5 space-y-3">
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
    <div className="mx-auto max-w-[1600px] px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24">
      <div className="mx-auto max-w-[1600px] px-0 pt-6 pb-16 md:px-6 lg:px-10">
        <div className="mb-8 flex flex-col justify-between gap-8 md:flex-row md:items-end px-4 md:px-0">
          <div>
            <Skeleton className="h-3 w-32 bg-border/30 rounded mb-2" />
            <Skeleton className="h-12 w-56 bg-border/30 rounded-lg mb-2" />
            <Skeleton className="h-4 w-72 bg-border/30 rounded" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-40 bg-border/30 rounded-2xl" />
            <Skeleton className="h-12 w-64 bg-border/30 rounded-xl" />
          </div>
        </div>
        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 md:px-0 mb-8">
          <Skeleton className="h-10 w-24 bg-border/30 rounded-xl" />
          <Skeleton className="h-10 w-24 bg-border/30 rounded-xl" />
        </div>
        {/* Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 px-1 md:px-0">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-bg-card overflow-hidden">
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
    <div className="mx-auto max-w-[1600px] px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 bg-border/30 rounded-xl" />
          <Skeleton className="h-8 w-64 bg-border/30 rounded-lg" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-32 bg-border/30 rounded" />
          <Skeleton className="h-3 w-24 bg-border/30 rounded" />
        </div>
        <Skeleton className="h-3 w-full bg-border/30 rounded-full" />
      </div>
      {/* Journey Map */}
      <div className="border border-border/30 rounded-xl bg-bg-card p-5 md:p-6">
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
      <div className="border border-accent/20 rounded-xl bg-accent-dim/20 p-5">
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
        <div key={i} className="rounded-xl border border-border/30 bg-bg-card p-5 space-y-4">
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
    <div className="mx-auto max-w-[1600px] px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-3 w-24 bg-border/30 rounded mb-4" />
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Skeleton className="h-10 w-48 bg-border/30 rounded-lg mb-2" />
            <Skeleton className="h-4 w-40 bg-border/30 rounded" />
          </div>
          <Skeleton className="h-10 w-36 bg-border/30 rounded-xl" />
        </div>
      </div>
      {/* Search + Tabs */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Skeleton className="h-10 flex-1 max-w-sm bg-border/30 rounded-xl" />
        <div className="flex items-center gap-1 bg-bg-elevated rounded-xl p-1 border border-border">
          <Skeleton className="h-8 w-12 bg-border/30 rounded-lg" />
          <Skeleton className="h-8 w-20 bg-border/30 rounded-lg" />
          <Skeleton className="h-8 w-20 bg-border/30 rounded-lg" />
        </div>
      </div>
      {/* Course cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/70 bg-bg-card overflow-hidden">
            <Skeleton className="aspect-[8/5] w-full bg-border/30" />
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
    <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 md:px-8 pt-8 pb-20 lg:pb-24">
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
          <div key={i} className="rounded-xl border border-border/30 bg-bg-card p-5 space-y-4">
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
    <div className="mx-auto max-w-[1600px] px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <Skeleton className="h-9 w-64 bg-border/30 rounded-lg mb-1" />
          <Skeleton className="h-4 w-48 bg-border/30 rounded" />
        </div>
      </div>
      {/* Tabs */}
      <div className="flex items-center gap-2">
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
          <div key={i} className="grid grid-cols-[36px_1fr] md:grid-cols-[48px_1fr_140px_100px_80px] gap-2 md:gap-4 px-4 md:px-6 py-4 rounded-2xl border border-border bg-bg-card items-center">
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
