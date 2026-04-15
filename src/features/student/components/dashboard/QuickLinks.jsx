import { Link } from 'react-router-dom'
import { Wallet, ShoppingBag, BookOpen, ChevronRight } from 'lucide-react'

export function QuickLinks({ user }) {
  const cp = user?.cpPoints ?? user?.cp ?? 0
  const links = [
    { to: '/wallet', label: 'CP Wallet', sub: `${Number(cp).toLocaleString()} CP available`, icon: Wallet, color: 'var(--accent)' },
    { to: '/marketplace', label: 'Marketplace', sub: 'Browse items', icon: ShoppingBag, color: 'var(--accent)' },
    { to: '/bootcamp', label: 'Bootcamp', sub: 'Continue training', icon: BookOpen, color: 'var(--accent)' },
  ]

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
        <ChevronRight size={16} className="text-accent" />
        Quick Access
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {links.map(({ to, label, sub, icon: Icon, color }) => (
          <Link key={to} to={to} className="card-hover flex items-center gap-4 p-4 group">
            <div className="p-2.5 rounded-none shrink-0 transition-transform group-hover:scale-110" style={{ background: `${color}15`, color }}>
              <Icon size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm text-[var(--text-primary)]">{label}</p>
              <p className="text-xs text-[var(--text-muted)] truncate">{sub}</p>
            </div>
            <ChevronRight size={15} className="text-[var(--text-muted)] group-hover:text-accent transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
