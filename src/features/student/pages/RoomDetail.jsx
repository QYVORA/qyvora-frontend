import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, ChevronDown, ChevronLeft, ShieldCheck } from 'lucide-react'
import { Button, Card, Skeleton } from '@/shared/components/ui'
import { studentService } from '@/core/services'
import { resolveImageUrl } from '@/shared/utils/resolveImageUrl'
import { MarkdownRenderer } from '@/shared/components/markdown/MarkdownRenderer'

export default function RoomDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openSections, setOpenSections] = useState(new Set())
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await studentService.getRoom(slug)
        if (!mounted) return
        const data = res.data || null
        setRoom(data)
        // Open first section by default
        if (data?.sections?.length) {
          setOpenSections(new Set([data.sections[0]?.sectionId]))
        }
      } catch {
        if (mounted) setRoom(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (slug) load()
    return () => { mounted = false }
  }, [slug])

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId)
      return next
    })
  }

  const accent = room?.accentColor || 'var(--accent)'
  const cover = resolveImageUrl(room?.coverImage)
  const logo = resolveImageUrl(room?.logoUrl)
  const sections = useMemo(() => room?.sections || [], [room?.sections])
  const openCount = sections.filter((s) => openSections.has(s.sectionId)).length

  const handleComplete = async () => {
    if (!room?.id) return
    setCompleting(true)
    try {
      const res = await studentService.completeRoom(room.id)
      const completedAt = res.data?.completedAt || new Date().toISOString()
      setRoom((prev) => prev ? { ...prev, completed: true, completedAt } : prev)
    } catch {
      // ignore
    } finally {
      setCompleting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-5 w-24" />
        <Card className="overflow-hidden">
          <Skeleton className="h-48 w-full rounded-none" />
          <div className="p-6 space-y-3">
            <div className="flex items-start gap-4">
              <Skeleton className="h-14 w-14 rounded-2xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </Card>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-5 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </Card>
        ))}
      </div>
    )
  }

  if (!room) {
    return (
      <div className="max-w-5xl mx-auto">
        <Card className="p-8 text-center space-y-3">
          <p className="text-sm text-[var(--text-secondary)]">Room not found.</p>
          <Button variant="ghost" onClick={() => navigate('/learn/rooms')}>Back to rooms</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back nav */}
      <Button variant="ghost" size="sm" onClick={() => navigate('/learn/rooms')}>
        <ChevronLeft size={16} /> Back to rooms
      </Button>

      {/* Hero card */}
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: accent }}>
        {cover && (
          <div className="relative h-48 md:h-56 overflow-hidden">
            <img src={cover} alt={room.title} className="w-full h-full object-cover" />
            {room.completed && (
              <div
                className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-mono border backdrop-blur-sm"
                style={{ borderColor: `${accent}55`, background: `${accent}20`, color: accent }}
              >
                <CheckCircle2 size={12} /> Completed
              </div>
            )}
          </div>
        )}
        <div className="p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0">
              {logo ? (
                <img src={logo} alt="Room logo" className="w-full h-full object-contain" />
              ) : (
                <ShieldCheck size={22} className="text-[var(--text-muted)]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display font-bold text-2xl md:text-3xl text-[var(--text-primary)]">{room.title}</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                {room.description || 'Room description coming soon.'}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--text-muted)]">
                {room.level && <span className="px-2.5 py-1 rounded-full border border-[var(--border)]">{room.level}</span>}
                <span className="px-2.5 py-1 rounded-full border border-[var(--border)]">{sections.length} sections</span>
                {room.estimatedMinutes ? (
                  <span className="px-2.5 py-1 rounded-full border border-[var(--border)]">{room.estimatedMinutes} min</span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Section progress indicator */}
      {sections.length > 0 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">
            {sections.length} section{sections.length !== 1 ? 's' : ''}
          </p>
          <button
            type="button"
            className="text-xs text-accent hover:opacity-80 font-mono"
            onClick={() => {
              const allOpen = sections.every((s) => openSections.has(s.sectionId))
              setOpenSections(allOpen ? new Set() : new Set(sections.map((s) => s.sectionId)))
            }}
          >
            {sections.every((s) => openSections.has(s.sectionId)) ? 'Collapse all' : 'Expand all'}
          </button>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-3">
        {sections.map((section, index) => {
          const isOpen = openSections.has(section.sectionId)
          return (
            <Card key={section.sectionId} className="overflow-hidden">
              <button
                type="button"
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[var(--bg-secondary)] transition-colors"
                onClick={() => toggleSection(section.sectionId)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0"
                    style={{ background: `${accent}15`, color: accent }}
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display font-semibold text-base text-[var(--text-primary)] truncate">{section.title}</h3>
                  </div>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-[var(--text-muted)] transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-6 pt-1 border-t border-[var(--border)]">
                  <MarkdownRenderer content={section.markdown} />
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Complete room */}
      <Card className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-display font-semibold text-base text-[var(--text-primary)]">
            {room.completed ? 'Room completed' : 'Mark as complete'}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            {room.completed
              ? `Completed ${room.completedAt ? new Date(room.completedAt).toLocaleDateString() : ''}`
              : 'Finish all sections then mark this room as done.'}
          </p>
        </div>
        <Button
          variant={room.completed ? 'outline' : 'primary'}
          disabled={room.completed || completing}
          onClick={handleComplete}
          className="shrink-0"
        >
          {room.completed ? (
            <><CheckCircle2 size={15} /> Completed</>
          ) : completing ? 'Saving...' : 'Mark as Complete'}
        </Button>
      </Card>
    </div>
  )
}
