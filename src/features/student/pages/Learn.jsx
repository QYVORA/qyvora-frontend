import { BookOpen, Layers, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/shared/components/ui'

const learnCards = [
  {
    title: 'Bootcamp',
    description: 'Structured cohorts with guided modules, live sessions, and real-world projects.',
    to: '/bootcamp',
    icon: BookOpen,
    badge: 'Structured',
  },
  {
    title: 'Rooms',
    description: 'Self-paced labs and content you can complete at your own pace, any time.',
    to: '/learn/rooms',
    icon: Layers,
    badge: 'Self-paced',
  },
]

export default function LearnPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <p className="font-mono text-accent text-xs uppercase tracking-widest mb-1">// learning paths</p>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Learn</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Choose a path. Bootcamps are structured and guided. Rooms are self-paced.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learnCards.map(({ title, description, to, icon: Icon, badge }) => (
          <Link key={title} to={to} className="block group">
            <Card className="p-6 h-full flex flex-col gap-5 hover:border-accent/40 hover:shadow-xl transition-all duration-200">
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent/25 transition-colors">
                  <Icon size={22} />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-accent/30 text-accent bg-accent/8">
                  {badge}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-xl text-[var(--text-primary)]">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">{description}</p>
              </div>
              <div className="flex items-center gap-1 text-xs uppercase tracking-[0.2em] font-mono text-accent group-hover:gap-2 transition-all">
                Open <ArrowRight size={12} />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
