import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronDown, ChevronLeft, ShieldCheck } from 'lucide-react'
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
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }

  const accent = room?.accentColor || 'var(--accent)'
  const cover = resolveImageUrl(room?.coverImage)
  const logo = resolveImageUrl(room?.logoUrl)
  const sections = useMemo(() => room?.sections || [], [room?.sections])

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
        <Skeleton className="h-8 w-48" />
        <Card className="p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full" />
        </Card>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="max-w-5xl mx-auto">
        <Card className="p-6 text-center">
          <p className="text-sm text-[var(--text-secondary)]">Room not found.</p>
          <Button variant="ghost" className="mt-4" onClick={() => navigate('/learn/rooms')}>
            Back to rooms
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/learn/rooms')}>
          <ChevronLeft size={16} />
          Back
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="relative h-48 md:h-56 bg-[var(--bg-secondary)]">
          {cover ? (
            <img
              src={cover}
              alt={room.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] text-xs font-mono uppercase tracking-[0.2em]">
              Room Briefing
            </div>
          )}
          {room.completed && (
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-mono border"
              style={{ borderColor: `${accent}55`, background: `${accent}20`, color: accent }}>
              Completed
            </div>
          )}
        </div>
        <div className="p-6 md:p-8 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center overflow-hidden">
              {logo ? (
                <img src={logo} alt="Room logo" className="w-full h-full object-contain" />
              ) : (
                <ShieldCheck size={22} className="text-[var(--text-muted)]" />
              )}
            </div>
            <div className="flex-1">
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

      <div className="space-y-4">
        {sections.map((section) => {
          const isOpen = openSections.has(section.sectionId)
          return (
            <Card key={section.sectionId} className="overflow-hidden">
              <button
                type="button"
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                onClick={() => toggleSection(section.sectionId)}
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--text-muted)]">Section</p>
                  <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">{section.title}</h3>
                </div>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5">
                  <MarkdownRenderer content={section.markdown} />
                </div>
              )}
            </Card>
          )
        })}
      </div>

      <Card className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">Complete Room</h3>
          <p className="text-sm text-[var(--text-secondary)]">Mark this room as completed once you finish all sections.</p>
        </div>
        <Button
          variant={room.completed ? 'outline' : 'primary'}
          disabled={room.completed || completing}
          onClick={handleComplete}
        >
          {room.completed ? 'Completed' : (completing ? 'Saving...' : 'Mark as Complete')}
        </Button>
      </Card>
    </div>
  )
}
