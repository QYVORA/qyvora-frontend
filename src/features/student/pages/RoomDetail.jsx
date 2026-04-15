import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, ChevronLeft, ChevronRight, Clock, Layers, ShieldCheck } from 'lucide-react'
import { Button, Card, Skeleton } from '@/shared/components/ui'
import { studentService } from '@/core/services'
import { resolveImageUrl } from '@/shared/utils/resolveImageUrl'
import { MarkdownRenderer } from '@/shared/components/markdown/MarkdownRenderer'

const LEVEL_STYLES = {
  Beginner:     { text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', dot: 'bg-emerald-500' },
  Intermediate: { text: 'text-amber-500',   bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   dot: 'bg-amber-500'   },
  Advanced:     { text: 'text-red-500',     bg: 'bg-red-500/10',     border: 'border-red-500/30',     dot: 'bg-red-500'     },
}

export default function RoomDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState(null)
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
          setActiveSection(data.sections[0].sectionId)
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

  const sections = useMemo(() => room?.sections || [], [room])
  const currentIndex = sections.findIndex((s) => s.sectionId === activeSection)
  const currentSection = sections[currentIndex] || null
  const prevSection = sections[currentIndex - 1] || null
  const nextSection = sections[currentIndex + 1] || null

  const cover = resolveImageUrl(room?.coverImage)
  const logo = resolveImageUrl(room?.logoUrl)
  const levelStyle = LEVEL_STYLES[room?.level] || {}

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
      <div className="max-w-7xl mx-auto">
        <Skeleton className="h-5 w-28 mb-6" />
        <div className="flex gap-6">
          <div className="w-72 shrink-0 space-y-3">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}
          </div>
          <div className="flex-1 space-y-4">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-10 text-center space-y-3">
          <Layers size={32} className="text-[var(--text-muted)] mx-auto" />
          <p className="text-sm text-[var(--text-secondary)]">Room not found.</p>
          <Button variant="ghost" onClick={() => navigate('/learn/rooms')}>Back to rooms</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Top nav */}
      <div className="flex items-center justify-between mb-5">
        <Button variant="ghost" size="sm" onClick={() => navigate('/learn/rooms')}>
          <ChevronLeft size={16} /> Rooms
        </Button>
        <div className="flex items-center gap-2">
          {room.completed ? (
            <span className="flex items-center gap-1.5 text-xs font-mono text-accent">
              <CheckCircle2 size={14} /> Completed
            </span>
          ) : (
            <Button
              variant="primary"
              size="sm"
              disabled={completing}
              onClick={handleComplete}
            >
              {completing ? 'Saving...' : 'Mark Complete'}
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-6 items-start">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="hidden lg:flex w-72 shrink-0 flex-col gap-4 sticky top-6">

          {/* Room identity card */}
          <Card className="overflow-hidden">
            {cover ? (
              <div className="relative h-36 overflow-hidden">
                <img src={cover} alt={room.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {room.completed && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-[10px] font-mono text-accent border border-accent/40">
                    <CheckCircle2 size={10} /> Done
                  </div>
                )}
              </div>
            ) : null}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0">
                  {logo
                    ? <img src={logo} alt="logo" className="w-full h-full object-contain" />
                    : <ShieldCheck size={18} className="text-[var(--text-muted)]" />}
                </div>
                <div className="min-w-0">
                  <h2 className="font-display font-bold text-sm text-[var(--text-primary)] leading-snug">{room.title}</h2>
                </div>
              </div>

              {/* Meta pills */}
              <div className="flex flex-wrap gap-1.5">
                {room.level && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border ${levelStyle.text} ${levelStyle.border} ${levelStyle.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${levelStyle.dot}`} />
                    {room.level}
                  </span>
                )}
                {room.estimatedMinutes ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)] px-2 py-0.5 rounded-full border border-[var(--border)]">
                    <Clock size={9} /> {room.estimatedMinutes} min
                  </span>
                ) : null}
                <span className="text-[10px] font-mono text-[var(--text-muted)] px-2 py-0.5 rounded-full border border-[var(--border)]">
                  {sections.length} tasks
                </span>
              </div>

              {room.description && (
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{room.description}</p>
              )}

              {room.tags?.length ? (
                <div className="flex flex-wrap gap-1">
                  {room.tags.map((tag) => (
                    <span key={tag} className="text-[9px] uppercase tracking-widest font-mono px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--text-muted)]">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </Card>

          {/* Section nav */}
          <Card className="p-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] px-2 py-1.5">Tasks</p>
            <nav className="space-y-0.5">
              {sections.map((section, index) => {
                const isActive = section.sectionId === activeSection
                return (
                  <button
                    key={section.sectionId}
                    type="button"
                    onClick={() => setActiveSection(section.sectionId)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-sm transition-all ${
                      isActive
                        ? 'bg-accent/12 text-accent font-semibold'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 transition-colors ${
                        isActive ? 'bg-accent text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="truncate leading-snug">{section.title}</span>
                  </button>
                )
              })}
            </nav>
          </Card>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 min-w-0 space-y-5">

          {/* Mobile room header */}
          <div className="lg:hidden">
            <Card className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0">
                {logo ? <img src={logo} alt="logo" className="w-full h-full object-contain" /> : <ShieldCheck size={16} className="text-[var(--text-muted)]" />}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display font-bold text-base text-[var(--text-primary)] truncate">{room.title}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  {room.level && <span className={`text-[10px] font-mono ${levelStyle.text}`}>{room.level}</span>}
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">{sections.length} tasks</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Mobile section selector */}
          <div className="lg:hidden overflow-x-auto pb-1">
            <div className="flex gap-2 w-max">
              {sections.map((section, index) => (
                <button
                  key={section.sectionId}
                  type="button"
                  onClick={() => setActiveSection(section.sectionId)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap border transition-all ${
                    section.sectionId === activeSection
                      ? 'bg-accent/15 border-accent/40 text-accent'
                      : 'border-[var(--border)] text-[var(--text-muted)] hover:border-accent/30'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${section.sectionId === activeSection ? 'bg-accent text-white' : 'bg-[var(--bg-secondary)]'}`}>
                    {index + 1}
                  </span>
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* Section content */}
          {currentSection ? (
            <Card className="p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-[var(--border)]">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] mb-1">
                    Task {currentIndex + 1} of {sections.length}
                  </p>
                  <h1 className="font-display font-bold text-xl md:text-2xl text-[var(--text-primary)]">
                    {currentSection.title}
                  </h1>
                </div>
                {/* Progress dots */}
                <div className="hidden sm:flex items-center gap-1 shrink-0 mt-1">
                  {sections.map((s) => (
                    <button
                      key={s.sectionId}
                      type="button"
                      onClick={() => setActiveSection(s.sectionId)}
                      className={`rounded-full transition-all ${
                        s.sectionId === activeSection
                          ? 'w-4 h-2 bg-accent'
                          : 'w-2 h-2 bg-[var(--border)] hover:bg-accent/40'
                      }`}
                      title={s.title}
                    />
                  ))}
                </div>
              </div>

              {/* Markdown content */}
              <div className="prose-sm max-w-none">
                {currentSection.markdown ? (
                  <MarkdownRenderer content={currentSection.markdown} />
                ) : (
                  <p className="text-sm text-[var(--text-secondary)] italic">No content for this task yet.</p>
                )}
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-sm text-[var(--text-secondary)]">Select a task from the sidebar.</p>
            </Card>
          )}

          {/* Prev / Next navigation */}
          {sections.length > 1 && (
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                size="sm"
                disabled={!prevSection}
                onClick={() => prevSection && setActiveSection(prevSection.sectionId)}
              >
                <ChevronLeft size={15} /> Previous
              </Button>

              <span className="text-xs font-mono text-[var(--text-muted)]">
                {currentIndex + 1} / {sections.length}
              </span>

              {nextSection ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveSection(nextSection.sectionId)}
                >
                  Next <ChevronRight size={15} />
                </Button>
              ) : (
                <Button
                  variant={room.completed ? 'outline' : 'primary'}
                  size="sm"
                  disabled={room.completed || completing}
                  onClick={handleComplete}
                >
                  {room.completed
                    ? <><CheckCircle2 size={14} /> Completed</>
                    : completing ? 'Saving...' : <><CheckCircle2 size={14} /> Complete Room</>}
                </Button>
              )}
            </div>
          )}

          {/* Single section complete button */}
          {sections.length <= 1 && (
            <div className="flex justify-end">
              <Button
                variant={room.completed ? 'outline' : 'primary'}
                disabled={room.completed || completing}
                onClick={handleComplete}
              >
                {room.completed ? <><CheckCircle2 size={14} /> Completed</> : completing ? 'Saving...' : 'Mark as Complete'}
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
