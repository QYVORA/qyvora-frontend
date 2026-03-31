import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Card, ProgressBar, Badge } from '@/shared/components/ui'

export function PhaseProgressCard({ currentModule, progressPercent }) {
  return (
    <Card className="border-l-4" style={{ borderLeftColor: '#0EA5E9' }}>
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: '#0EA5E9' }}>CURRENT</span>
            {currentModule?.status && <Badge variant="accent">{currentModule.status}</Badge>}
          </div>
          <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-1">{currentModule?.title || 'No active module'}</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">Continue your bootcamp learning path.</p>
          <ProgressBar
            value={progressPercent || 0}
            max={100}
            color="#0EA5E9"
            label={`${progressPercent || 0}% complete`}
            showPercent
          />
        </div>
        <div className="flex gap-3 shrink-0 w-full lg:w-auto">
          <Link to="/bootcamp" className="btn-primary flex items-center gap-2 w-full lg:w-auto justify-center">
            Continue Learning <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </Card>
  )
}
