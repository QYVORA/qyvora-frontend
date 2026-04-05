import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Card, ProgressBar, Badge } from '@/shared/components/ui'

export function PhaseProgressCard({ currentModule, progressPercent, bootcampTitle, bootcampImage, isEnrolled }) {
  const accent = '#1fbf8f'
  return (
    <Card className="p-0 overflow-hidden border-l-4" style={{ borderLeftColor: accent }} data-tour="overview-card">
      <div className="flex flex-col lg:flex-row">
        {bootcampImage && (
          <div className="h-40 lg:h-auto lg:w-60 w-full overflow-hidden shrink-0">
            <img src={bootcampImage} alt={bootcampTitle || 'Bootcamp'} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: accent }}>CURRENT</span>
            {currentModule?.status && <Badge variant="accent">{currentModule.status}</Badge>}
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-1">
              {currentModule?.title || 'No active module'}
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {isEnrolled ? `Bootcamp: ${bootcampTitle || 'Active Bootcamp'}` : 'Explore available bootcamps to begin.'}
            </p>
          </div>
          <ProgressBar
            value={progressPercent || 0}
            max={100}
            color={accent}
            label={`${progressPercent || 0}% complete`}
            showPercent
          />
          <div className="mt-auto flex gap-3 w-full">
            <Link to="/bootcamp" className="btn-primary flex items-center gap-2 w-full lg:w-auto justify-center">
              {isEnrolled ? 'Continue Bootcamp' : 'View Bootcamps'} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}
