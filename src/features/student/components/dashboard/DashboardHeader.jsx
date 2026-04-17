import { ArrowRight, Flame, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

export function DashboardHeader({ displayName, isEnrolled, bootcampId, bootcampTitle, progressPercent, currentModuleTitle, streak, aheadPercent }) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const primaryTo = isEnrolled && bootcampId ? `/bootcamp/${bootcampId}` : '/bootcamp'
  const primaryLabel = isEnrolled ? 'Continue Learning' : 'Start a Bootcamp'

  return (
    <div className="space-y-4">
      {/* Greeting row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-1">// learning hub</p>
          <h1 className="font-mono font-black text-2xl sm:text-3xl text-[var(--text-primary)] leading-tight">
            {greeting}, <span className="text-accent break-words">{displayName || 'Operator'}</span>
          </h1>
        </div>

        {/* Momentum signals */}
        <div className="flex items-center gap-3 shrink-0">
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20">
              <Flame size={13} className="text-orange-400" />
              <span className="font-mono text-xs text-orange-400">{streak}-day streak</span>
            </div>
          )}
          {aheadPercent > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 border border-accent/20">
              <TrendingUp size={13} className="text-accent" />
              <span className="font-mono text-xs text-accent">Ahead of {aheadPercent}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Primary CTA — dominant, always visible */}
      <Link
        to={primaryTo}
        className="group flex items-center justify-between gap-4 p-4 sm:p-5 bg-accent/10 border border-accent/30 hover:bg-accent/15 hover:border-accent/50 transition-all duration-200"
      >
        <div className="min-w-0 flex-1">
          <p className="font-mono font-bold text-base sm:text-lg text-[var(--text-primary)] leading-snug">
            {primaryLabel}
          </p>
          {isEnrolled && (currentModuleTitle || bootcampTitle) ? (
            <p className="font-mono text-xs text-[var(--text-secondary)] mt-0.5 truncate">
              {currentModuleTitle
                ? `Next: ${currentModuleTitle}`
                : bootcampTitle}
              {progressPercent > 0 && ` — ${progressPercent}% complete`}
            </p>
          ) : (
            <p className="font-mono text-xs text-[var(--text-muted)] mt-0.5">
              Choose a track and start earning CP
            </p>
          )}
        </div>

        {/* Progress bar + arrow */}
        <div className="flex items-center gap-3 shrink-0">
          {isEnrolled && progressPercent > 0 && (
            <div className="hidden sm:flex flex-col items-end gap-1">
              <span className="font-mono text-[10px] text-accent uppercase tracking-widest">{progressPercent}%</span>
              <div className="w-24 h-1.5 bg-[var(--border)] overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
          <div className="w-8 h-8 bg-accent flex items-center justify-center text-black shrink-0 group-hover:translate-x-0.5 transition-transform">
            <ArrowRight size={16} />
          </div>
        </div>
      </Link>
    </div>
  )
}
