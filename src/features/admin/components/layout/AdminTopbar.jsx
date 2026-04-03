import { Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from '@/shared/components/brand/Logo'

export function AdminTopbar({ onOpenSidebar }) {
  return (
    <header className="h-16 border-b border-[var(--border)] bg-[color:var(--bg-primary)]/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button onClick={onOpenSidebar} className="lg:hidden btn-ghost p-2 rounded-lg"><Menu size={20} /></button>
        <span className="font-mono text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">ROOT ACCESS</span>
      </div>
      <Link to="/" className="flex items-center gap-2 lg:hidden">
        <Logo size="sm" />
      </Link>
    </header>
  )
}
