import { BookOpen, Layers } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/shared/components/ui'

const learnCards = [
  {
    title: 'Bootcamp',
    description: 'Structured cohorts with guided modules, projects, and live support.',
    to: '/bootcamp',
    icon: BookOpen,
  },
  {
    title: 'Rooms',
    description: 'Self-paced rooms with hands-on walkthroughs, commands, and labs.',
    to: '/learn/rooms',
    icon: Layers,
  },
]

export default function LearnPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Learn</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Choose a learning path. Bootcamps are structured, rooms are self-paced.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learnCards.map(({ title, description, to, icon: Icon }) => (
          <Link key={title} to={to} className="block">
            <Card className="p-6 h-full flex flex-col gap-4 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center">
                <Icon size={22} />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-xl text-[var(--text-primary)]">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">{description}</p>
              </div>
              <div className="text-xs uppercase tracking-[0.2em] font-mono text-accent">Open</div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
