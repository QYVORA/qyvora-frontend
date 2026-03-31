import { Menu } from 'lucide-react'

export function AdminTopbar({ onOpenSidebar }) {
  return (
    <header className="h-16 border-b border-[var(--border)] bg-[color:var(--bg-primary)]/80 backdrop-blur-sm flex items-center px-6 gap-4 sticky top-0 z-30">
      <button onClick={onOpenSidebar} className="lg:hidden btn-ghost p-2 rounded-lg"><Menu size={20} /></button>
      <span className="font-mono text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">ROOT ACCESS</span>
    </header>
  )
}
