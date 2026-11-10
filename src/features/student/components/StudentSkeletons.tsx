import React from 'react';
import PageBody from '@/shared/components/layout/PageBody';

const S = ({ className = '', circle = false, ...props }: { className?: string; circle?: boolean; [key: string]: any }) => (
  <div
    className={`animate-pulse bg-surface-raised border border-border-subtle ${circle ? 'rounded-full' : 'rounded-lg'} ${className}`}
    aria-hidden="true"
    {...props}
  />
);

const SectionTitleSkeleton = () => (
  <div className="space-y-1.5">
    <S className="h-2.5 w-20 rounded" />
    <S className="h-6 w-52 rounded-lg" />
  </div>
);

/* ─── Shared: Card shell skeleton ─────────────────────────────────────────── */
const CardShell = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border border-border-subtle bg-surface ${className}`}>{children}</div>
);

/* ─── Dashboard Skeleton ──────────────────────────────────────────────────── */
export const DashboardSkeleton = () => (
  <div className="min-h-full bg-canvas">
    <PageBody spacing="sections">
      <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-12 xl:gap-6">
        <div className="min-w-0 space-y-5 xl:col-span-8">
          <CardShell className="space-y-4 border-accent/25 bg-accent/[0.06] p-6 sm:p-7">
            <S className="h-3 w-40" />
            <S className="h-8 w-3/4 max-w-96" />
            <S className="h-4 w-full max-w-2xl" />
            <S className="h-11 w-36 rounded-xl" />
          </CardShell>

          <CardShell className="space-y-4 p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-2">
                <S className="h-5 w-36" />
                <S className="h-3 w-64 max-w-full" />
              </div>
              <S className="h-10 w-20 rounded-xl" />
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <S key={index} className="h-11 w-24 rounded-xl" />
              ))}
            </div>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 border-t border-border-subtle pt-3 first:border-0 first:pt-0">
                <S circle className="h-12 w-12 shrink-0" />
                <div className="min-w-0 flex-1 space-y-2">
                  <S className="h-4 w-2/3 max-w-64" />
                  <S className="h-3 w-full max-w-xl" />
                  <S className="h-2 w-24 rounded-full" />
                </div>
                <S circle className="h-11 w-11 shrink-0" />
              </div>
            ))}
          </CardShell>

          <CardShell className="space-y-4 p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <S className="h-5 w-36" />
              <S className="h-10 w-20 rounded-xl" />
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <S key={index} className="h-11 w-28 rounded-xl" />
              ))}
            </div>
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 border-t border-border-subtle pt-3 first:border-0 first:pt-0">
                <S circle className="h-12 w-12 shrink-0" />
                <div className="min-w-0 flex-1 space-y-2">
                  <S className="h-4 w-2/3 max-w-64" />
                  <S className="h-3 w-full max-w-xl" />
                </div>
                <S circle className="h-11 w-11 shrink-0" />
              </div>
            ))}
          </CardShell>
        </div>

        <aside className="min-w-0 space-y-5 xl:col-span-4">
          <CardShell className="space-y-3 p-5 md:p-6">
            <S className="h-3 w-32" />
            <S className="h-6 w-3/4" />
            <S className="h-3 w-full" />
            <S className="h-2 w-full rounded-full" />
            {Array.from({ length: 3 }).map((_, index) => (
              <S key={index} className="h-4 w-full" />
            ))}
          </CardShell>

          <CardShell className="space-y-4 p-5 md:p-6">
            <div className="flex items-center gap-3">
              <S circle className="h-10 w-10 shrink-0" />
              <div className="min-w-0 flex-1 space-y-2">
                <S className="h-4 w-32" />
                <S className="h-3 w-40 max-w-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2 border-t border-border-subtle pt-3">
                  <S className="h-3 w-20" />
                  <S className="h-5 w-16" />
                </div>
              ))}
            </div>
          </CardShell>

          <CardShell className="space-y-3 p-5 md:p-6">
            <S className="h-5 w-32" />
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 border-t border-border-subtle pt-3 first:border-0 first:pt-0">
                <S circle className="h-9 w-9 shrink-0" />
                <div className="flex-1 space-y-2">
                  <S className="h-3 w-3/4" />
                  <S className="h-2.5 w-full" />
                </div>
              </div>
            ))}
          </CardShell>

          <CardShell className="space-y-3 p-5 md:p-6">
            <S className="h-5 w-40" />
            <S className="h-3 w-3/4" />
            <S className="h-3 w-full" />
          </CardShell>
        </aside>
      </div>
    </PageBody>
  </div>
);

/* ─── Profile Page Skeleton ───────────────────────────────────────────────── */
export const ProfileSkeleton = () => (
  <div className="min-h-full bg-canvas">
    <div className="w-full px-3 pb-16 pt-6 md:px-4 md:pb-20 md:pt-8 lg:px-6 lg:pb-24">
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <aside className="lg:col-span-4">
          <div className="space-y-6 lg:sticky lg:top-24">
            <CardShell className="p-5 sm:p-6 space-y-5">
              <div className="flex items-center gap-4">
                <S className="h-20 w-20 shrink-0 rounded-2xl sm:h-24 sm:w-24" circle={false} />
                <div className="flex-1 space-y-3 pt-2">
                  <S className="h-6 w-40 rounded" />
                  <S className="h-3 w-24 rounded" />
                </div>
              </div>
              <S className="h-16 w-full rounded" />
              <div className="space-y-2 rounded-xl border border-border-subtle bg-surface-raised p-3">
                <div className="flex items-center justify-between">
                  <S className="h-3 w-16 rounded" />
                  <S className="h-3 w-24 rounded" />
                </div>
                <S className="h-2 w-full rounded-full" />
              </div>
              <div className="flex gap-2">
                <S className="h-9 w-24 rounded-xl" />
                <S className="h-9 w-9 rounded-lg" />
              </div>
            </CardShell>
          </div>
        </aside>

        <div className="space-y-6 lg:col-span-8">
          <CardShell className="p-5 md:p-6 space-y-4">
            <S className="h-4 w-24 rounded" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <S className="h-6 w-6 rounded-lg" />
                    <S className="h-5 w-16 rounded" />
                  </div>
                  <S className="h-2.5 w-12 rounded" />
                </div>
              ))}
            </div>
          </CardShell>

          <CardShell className="p-5 md:p-6 space-y-4">
            <S className="h-4 w-28 rounded" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <S key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          </CardShell>

          <CardShell className="p-5 md:p-6 space-y-4">
            <S className="h-4 w-28 rounded" />
            <S className="h-[118px] w-full rounded-lg" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <S className="h-8 w-8 shrink-0 rounded-lg" />
                <S className="h-4 flex-1 rounded" />
              </div>
            ))}
          </CardShell>
        </div>
      </div>
    </div>
  </div>
);

/* ─── Notifications Page Skeleton ─────────────────────────────────────────── */
export const NotificationsSkeleton = () => (
  <div className="min-h-full bg-canvas px-3 pb-16 pt-8 md:px-4 md:pb-20 md:pt-10 lg:px-6 lg:pb-24">
    <SectionTitleSkeleton />
    <S className="mt-2 h-3 w-72 rounded" />
    <div className="mt-8 space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <CardShell key={i} className="p-5">
          <div className="flex items-start gap-3">
            <S className="w-8 h-8 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2.5">
              <S className="h-4 w-40 rounded" />
              <S className="h-3.5 w-2/3 rounded" />
            </div>
          </div>
        </CardShell>
      ))}
    </div>
  </div>
);

/* ─── Settings Page Skeleton ──────────────────────────────────────────────── */
export const SettingsSkeleton = () => (
  <div className="min-h-full bg-canvas px-3 pb-16 pt-8 md:px-4 md:pb-20 md:pt-10 lg:px-6 lg:pb-24">
    <SectionTitleSkeleton />
    <S className="mt-2 h-3 w-72 rounded" />
    <div className="mt-8 flex flex-col gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <CardShell key={i} className="overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border-subtle px-6 py-4">
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
        </CardShell>
      ))}
    </div>
  </div>
);

/* ─── Marketplace Page Skeleton ───────────────────────────────────────────── */
export const MarketplaceSkeleton = () => (
  <div className="min-h-full bg-canvas">
    <div className="px-3 md:px-4 lg:px-6 pt-8 pb-16 md:pb-20 lg:pb-24">
      <SectionTitleSkeleton />
      <S className="mt-2 h-3 w-72 rounded" />
      <S className="mt-8 h-12 w-full rounded-xl sm:w-72" />
      <div className="mt-4 flex items-center gap-2">
        <S className="h-10 w-28 rounded-xl" />
        <S className="h-10 w-28 rounded-xl" />
      </div>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardShell key={i} className="overflow-hidden">
            <S className="aspect-[16/9] w-full rounded-none" />
            <div className="flex flex-col gap-2.5 p-4">
              <S className="h-5 w-3/4 rounded" />
              <S className="h-3 w-full rounded" />
              <div className="flex items-center justify-between pt-2">
                <S className="h-4 w-16 rounded" />
                <S className="h-8 w-20 rounded-lg" />
              </div>
            </div>
          </CardShell>
        ))}
      </div>
    </div>
  </div>
);

/* ─── Bootcamp Course Page Skeleton ───────────────────────────────────────── */
export const BootcampCourseSkeleton = () => (
  <div className="min-h-full bg-canvas">
    <div className="px-3 md:px-4 lg:px-6 pt-8 pb-16 md:pb-20 lg:pb-24 space-y-8">
      <SectionTitleSkeleton />
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <S className="h-7 md:h-8 w-16 rounded" />
            <S className="h-2.5 w-14 rounded" />
          </div>
        ))}
      </div>
      {/* Filter strip */}
      <div className="flex items-center gap-1 rounded-xl border border-border-subtle bg-surface-raised p-1.5">
        <S className="h-10 flex-1 rounded-lg" />
        <S className="h-10 flex-1 rounded-lg" />
        <S className="h-10 flex-1 rounded-lg" />
      </div>
      {/* Recommended Next */}
      <CardShell className="border-accent/20 p-5">
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
      </CardShell>
      {/* Phase sections */}
      {Array.from({ length: 2 }).map((_, i) => (
        <CardShell key={i} className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <S className="w-8 h-8 rounded-lg" />
            <S className="h-5 w-40 rounded" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="flex items-center gap-3 rounded-xl bg-surface-raised p-3">
                <S className="w-6 h-6 rounded shrink-0" />
                <S className="h-3.5 flex-1 rounded" />
              </div>
            ))}
          </div>
        </CardShell>
      ))}
    </div>
  </div>
);

/* ─── Bootcamp Room Page Skeleton ─────────────────────────────────────────── */
export const BootcampRoomSkeleton = () => (
  <div className="bg-canvas overflow-x-hidden">
    {/* Desktop sidebar skeleton */}
    <div className="hidden lg:flex fixed right-6 z-[90] flex-col items-center gap-3" style={{ top: '5rem', bottom: '1.5rem', justifyContent: 'center' }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <S key={i} className="w-11 h-11 rounded-lg" />
      ))}
    </div>
    <main className="w-full px-3 pt-8 md:px-4 lg:px-6 space-y-8">
      {/* Room header */}
      <header className="mb-8 space-y-4">
        <S className="h-3 w-48 rounded" />
        <S className="h-10 w-64 rounded" />
        <div className="border-l-4 border-border-subtle pl-4 space-y-2">
          <S className="h-4 w-full rounded" />
          <S className="h-4 w-3/4 rounded" />
        </div>
      </header>
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <S className="h-3 w-32 rounded" />
          <S className="h-3 w-16 rounded" />
        </div>
        <S className="h-2 w-full rounded-full" />
      </div>
      {/* Step cards (all rendered on one page) */}
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardShell key={i} className="p-5 space-y-3">
            <div className="flex items-center gap-3">
              <S className="h-5 w-5 rounded shrink-0" />
              <S className="h-5 w-40 rounded" />
            </div>
            <S className="h-4 w-full rounded" />
            <S className="h-4 w-11/12 rounded" />
            <S className="h-4 w-4/5 rounded" />
          </CardShell>
        ))}
      </div>
      {/* Bottom nav skeleton */}
      <div className="flex items-center justify-between gap-3 border-t border-border-subtle pt-6 pb-16">
        <S className="h-11 w-24 rounded-xl" />
        <S className="h-3 w-16" />
        <S className="h-11 w-24 rounded-xl" />
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
        <CardShell key={i} className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4">
          <S className="w-8 h-8 rounded-lg shrink-0" />
          <S className="w-9 h-9 md:w-10 md:h-10 rounded-xl shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <S className="h-3.5 w-32 rounded" />
            <S className="h-2.5 w-24 rounded" />
          </div>
          <S className="hidden md:block h-3 w-16 rounded" />
        </CardShell>
      ))}
    </div>
  </div>
);

/* ─── Course Lesson Skeleton ──────────────────────────────────────────────── */
export const CourseLessonSkeleton = () => (
  <div className="bg-canvas px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-8">
    {/* Hero */}
    <div className="relative flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full line-grid" />
      </div>
      <div className="relative z-10 py-8 md:py-10 space-y-6">
        <S className="h-16 md:h-20 lg:h-24 w-64 md:w-96 rounded-lg" />
        <S className="h-4 md:h-5 w-72 md:w-[28rem] rounded" />
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <S className="h-7 md:h-8 w-16 rounded" />
            <S className="h-2.5 w-14 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <S className="h-7 md:h-8 w-12 rounded" />
            <S className="h-2.5 w-16 rounded" />
          </div>
        </div>
      </div>
    </div>

    {/* Progress bar */}
    <CardShell className="px-4 py-4 md:px-6 md:py-5">
      <div className="mb-3 flex items-center justify-between">
        <S className="h-3 w-24 rounded" />
        <S className="h-5 w-12 rounded" />
      </div>
      <S className="h-2 w-full rounded-full" />
    </CardShell>

    {/* Lesson cards (all rendered on one page) */}
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border-subtle py-12 md:py-16">
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
        </div>
      ))}
    </div>

    {/* Navigation */}
    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 border-t border-border-subtle pt-6 pb-16 mt-4">
      <S className="h-11 flex-1 rounded-xl sm:max-w-32" />
      <S className="order-3 h-3 w-16 self-center sm:order-none" />
      <S className="h-11 flex-1 rounded-xl sm:max-w-36" />
    </div>
  </div>
);

/* ─── Lab Listing Skeleton (hero renders as real content) ─────────────────── */
export const LabListingSkeleton = () => (
  <div className="space-y-8">
    {/* Hero skeleton */}
    <div className="bg-canvas px-3 md:px-4 lg:px-6 py-8 md:py-10">
      <div className="space-y-6">
        <S className="h-12 md:h-16 lg:h-20 w-64 md:w-96 rounded-lg" />
        <S className="h-4 md:h-5 w-72 md:w-[28rem] rounded" />
      </div>
    </div>
    {/* Accordion items */}
    <div className="bg-canvas px-3 md:px-4 lg:px-6 py-10 pb-20 lg:pb-24 space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardShell key={i} className="overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-6 py-5">
            <div className="flex items-center gap-4 min-w-0">
              <S className="h-4 w-6 rounded shrink-0" />
              <div className="space-y-2">
                <S className="h-4 w-40 rounded" />
                <S className="h-3 w-56 rounded" />
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <S className="h-5 w-16 rounded-lg" />
              <S circle className="h-4 w-4 shrink-0" />
            </div>
          </div>
        </CardShell>
      ))}
    </div>
  </div>
);