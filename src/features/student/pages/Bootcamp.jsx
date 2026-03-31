import { Clock, CheckCircle, ChevronRight, Zap } from 'lucide-react'
import { Badge, ProgressBar, Card } from '@/shared/components/ui'
import { useEffect, useRef, useState } from 'react'
import { studentService } from '@/core/services'
import { useToast } from '@/core/contexts/ToastContext'

export default function BootcampPage() {
  const [overview, setOverview] = useState(null)
  const { toast } = useToast()
  const notifiedRef = useRef(false)

  useEffect(() => {
    let mounted = true
    if (!notifiedRef.current) {
      notifiedRef.current = true
      toast({
        type: 'info',
        title: 'Bootcamp coming soon',
        message: 'We are still preparing the training program. Check back shortly.',
      })
    }
    const load = async () => {
      try {
        const res = await studentService.getOverview()
        if (!mounted) return
        setOverview(res.data || null)
      } catch {
        setOverview(null)
      }
    }
    load()
    return () => { mounted = false }
  }, [toast])

  const modules = overview?.modules || []

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="font-mono text-accent text-xs uppercase tracking-widest mb-1">// training program</p>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Bootcamp</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Structured offensive security curriculum across 5 phases.</p>
      </div>

      {/* Modules */}
      <div className="space-y-5">
        {modules.length === 0 ? (
          <Card className="p-6 text-center">
            <Zap size={28} className="text-accent/50 mx-auto mb-3" />
            <p className="text-sm text-[var(--text-secondary)]">Bootcamp modules will appear once your enrollment is active.</p>
          </Card>
        ) : (
          modules.map((mod) => (
            <div key={mod.id} className="card overflow-hidden">
              <div className="p-5 border-b border-[var(--border)] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-display font-bold text-lg bg-accent/10 text-accent">
                  {mod.id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-xs uppercase tracking-widest text-accent">MODULE</span>
                    {mod.ctfCompleted && <Badge variant="success">CTF Complete</Badge>}
                  </div>
                  <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">{mod.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-0.5">Rooms completed: {mod.roomsCompleted}/{mod.roomsTotal}</p>
                  <div className="mt-3">
                    <ProgressBar value={mod.progress} max={100} color="#0EA5E9" label={`${mod.progress}%`} showPercent />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono text-sm font-bold text-accent">{mod.ctf ? 'CTF' : 'Module'}</div>
                  <div className="text-xs text-[var(--text-muted)]">Progress</div>
                </div>
              </div>
              <div className="divide-y divide-[var(--border)]">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-3.5">
                  <div className="shrink-0">
                    {mod.ctfCompleted
                      ? <CheckCircle size={18} className="text-green-400" />
                      : <Clock size={18} className="text-[var(--text-muted)]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {mod.ctfCompleted ? 'CTF complete' : 'CTF pending'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {!mod.ctfCompleted && (
                      <button className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1">
                        Start <ChevronRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
