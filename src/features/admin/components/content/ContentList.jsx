import { FileText, X } from 'lucide-react'
import { Badge, Card } from '@/shared/components/ui'

export function ContentList({ content, onDelete }) {
  return (
    <Card>
      <h3 className="font-semibold text-[var(--text-primary)] mb-5 flex items-center gap-2">
        <FileText size={16} className="text-accent" /> Published Content
      </h3>
      <div className="space-y-2">
        {content.map(c => (
          <div key={c.id} className="flex items-center gap-4 p-3.5 rounded-xl border border-[var(--border)] hover:border-accent/20 transition-colors">
            <FileText size={18} className="text-accent shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">{c.name}</p>
              <p className="text-xs text-[var(--text-muted)] font-mono">Phase {c.phase} · {c.type} · {c.size} · {c.uploaded}</p>
            </div>
            <Badge variant={c.status === 'published' ? 'success' : 'warning'}>{c.status}</Badge>
            <button onClick={() => onDelete(c.id)} className="text-[var(--text-muted)] hover:text-red-400 transition-colors shrink-0">
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  )
}
