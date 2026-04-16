import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpenCheck, CheckCircle2, Clock, Filter, Layers, PlayCircle, Search, Sparkles, X } from 'lucide-react'
import { Card, Skeleton } from '@/shared/components/ui'
import { studentService } from '@/core/services'
import { resolveImageUrl } from '@/shared/utils/resolveImageUrl'

const LEVEL_ORDER = ['Beginner', 'Intermediate', 'Advanced']

const LEVEL_STYLES = {
  Beginner:     { dot: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
  Intermediate: { dot: 'bg-amber-500',   text: 'text-amber-500',   border: 'border-amber-500/30',   bg: 'bg-amber-500/10'   },
  Advanced:     { dot: 'bg-red-500',     text: 'text-red-500',     border: 'border-red-500/30',     bg: 'bg-red-500/10'     },
}

function LevelBadge({ level }) {
  const s = LEVEL_STYLES[level] || { dot: 'bg-[var(--text-muted)]', text: 'text-[var(--text-muted)]', border: 'border-[var(--border)]', bg: 'bg-[var(--bg-secondary)]' }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest border ${s.text} ${s.border} ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {level || 'Beginner'}
    </span>
  )
}

function RoomCard({ room, stepIndex = 0, isNext = false }) {
  const accent = room.accentColor || 'var(--accent)'
  const cover = resolveImageUrl(room.coverImage)
  const logo = resolveImageUrl(room.logoUrl)

  return (
    <Link to={`/learn/rooms/${room.slug}`} className="block group">
      <div
        className={`card overflow-hidden flex flex-col sm:flex-row transition-all duration-200 hover:border-accent/40 hover:shadow-lg hover:-translate-y-0.5 ${room.completed ? 'opacity-70' : ''}`}
        style={{ willChange: 'transform' }}
      >
        {/* Thumbnail */}
        <div className="relative sm:w-44 sm:shrink-0 h-36 sm:h-auto bg-[var(--bg-secondary)] overflow-hidden">
          {cover ? (
            <img
              src={cover}
              alt={room.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {logo
                ? <img src={logo} alt="logo" className="w-14 h-14 object-contain opacity-50" />
                : <Layers size={28} className="text-[var(--text-muted)]" />}
            </div>
          )}
          {/* Accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: accent }} />
          {/* Completed overlay */}
          {room.completed && (
            <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-white drop-shadow" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest">
            <span className="px-2 py-0.5 border border-[var(--border)] text-[var(--text-muted)]">Step {stepIndex + 1}</span>
            {isNext && !room.completed && (
              <span className="px-2 py-0.5 border border-accent/40 text-accent bg-accent/10">Recommended Next</span>
            )}
          </div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold text-base text-[var(--text-primary)] leading-snug group-hover:text-accent transition-colors">
              {room.title}
            </h3>
            {room.completed && <CheckCircle2 size={15} className="text-accent shrink-0 mt-0.5" />}
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2 flex-1">
            {room.description || 'Room description coming soon.'}
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-auto pt-1">
            <LevelBadge level={room.level} />
            {room.estimatedMinutes ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)]">
                <Clock size={10} /> {room.estimatedMinutes} min
              </span>
            ) : null}
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              {room.sectionsCount || room.sections?.length || 0} tasks
            </span>
          </div>

          {room.tags?.length ? (
            <div className="flex flex-wrap gap-1">
              {room.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="text-[9px] uppercase tracking-[0.15em] font-mono px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--text-muted)]">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await studentService.getRooms()
        if (!mounted) return
        setRooms(res.data?.items || [])
      } catch {
        if (mounted) setRooms([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const levels = useMemo(() => {
    const found = [...new Set(rooms.map((r) => r.level).filter(Boolean))]
    return ['All', ...LEVEL_ORDER.filter((l) => found.includes(l)), ...found.filter((l) => !LEVEL_ORDER.includes(l))]
  }, [rooms])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return rooms.filter((r) => {
      const matchSearch = !q || r.title?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q) || r.tags?.some(t => t.toLowerCase().includes(q))
      const matchLevel = levelFilter === 'All' || r.level === levelFilter
      const matchStatus = statusFilter === 'All' || (statusFilter === 'Completed' ? r.completed : !r.completed)
      return matchSearch && matchLevel && matchStatus
    })
  }, [rooms, search, levelFilter, statusFilter])

  const stats = useMemo(() => {
    const completed = rooms.filter((r) => r.completed).length
    return { total: rooms.length, completed, pct: rooms.length ? Math.round((completed / rooms.length) * 100) : 0 }
  }, [rooms])
  const nextRoom = useMemo(() => filtered.find((room) => !room.completed) || filtered[0] || null, [filtered])
  const walkthroughSteps = [
    { id: 'pick', label: 'Pick a room', desc: 'Choose your next mission based on level and tags.' },
    { id: 'execute', label: 'Execute tasks', desc: 'Work through guided tasks and apply each technique.' },
    { id: 'complete', label: 'Mark completion', desc: 'Complete the room to update your learning progress.' },
  ]

  const hasActiveFilters = levelFilter !== 'All' || statusFilter !== 'All' || search
  const clearFilters = () => { setSearch(''); setLevelFilter('All'); setStatusFilter('All') }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-1">// self-paced</p>
          <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Rooms</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Self-paced missions with curated labs and content.</p>
        </div>
        {!loading && stats.total > 0 && (
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Progress</p>
              <p className="font-display font-bold text-lg text-accent">{stats.completed}/{stats.total}</p>
            </div>
            <svg width="44" height="44" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="18" fill="none" stroke="var(--border)" strokeWidth="3" />
              <circle
                cx="22" cy="22" r="18" fill="none"
                stroke="var(--accent)" strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 18}`}
                strokeDashoffset={`${2 * Math.PI * 18 * (1 - stats.pct / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 22 22)"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
              <text x="22" y="26" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--accent)">{stats.pct}%</text>
            </svg>
          </div>
        )}
      </div>

      {/* Walkthrough */}
      {!loading && rooms.length > 0 && (
        <Card className="p-5 sm:p-6 space-y-5 border-accent/25 bg-gradient-to-br from-accent/10 to-transparent">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-accent mb-1">Mission Walkthrough</p>
              <p className="text-sm text-[var(--text-secondary)]">Follow this flow instead of jumping randomly between rooms.</p>
            </div>
            {nextRoom && (
              <Link to={`/learn/rooms/${nextRoom.slug}`} className="btn-primary inline-flex items-center justify-center gap-2 text-xs px-4 py-2.5">
                <PlayCircle size={14} />
                Continue: {nextRoom.title}
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {walkthroughSteps.map((step, index) => (
              <div key={step.id} className="border border-[var(--border)] bg-[var(--bg-card)] p-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-accent mb-1">Step {index + 1}</p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{step.label}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)]">
            <span className="inline-flex items-center gap-1.5"><Sparkles size={13} className="text-accent" /> Your next recommended room is highlighted below.</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={13} className="text-accent" /> Completed rooms remain visible for revision.</span>
          </div>
        </Card>
      )}

      {/* Search + filter bar */}
      {!loading && rooms.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              className="input-field pl-9 py-2.5 text-sm"
              placeholder="Search rooms, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X size={14} />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((p) => !p)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
              showFilters || hasActiveFilters
                ? 'border-accent/40 bg-accent/10 text-accent'
                : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-accent/30'
            }`}
          >
            <Filter size={14} />
            Filters
            {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
          </button>
        </div>
      )}

      {/* Filter panel */}
      {showFilters && (
        <div className="flex flex-wrap gap-5 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">Difficulty</p>
            <div className="flex flex-wrap gap-1.5">
              {levels.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevelFilter(l)}
                  className={`px-3 py-1 rounded-full text-xs font-mono border transition-all ${
                    levelFilter === l ? 'border-accent/50 bg-accent/15 text-accent' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-accent/30'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">Status</p>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Active', 'Completed'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded-full text-xs font-mono border transition-all ${
                    statusFilter === s ? 'border-accent/50 bg-accent/15 text-accent' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-accent/30'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className="text-xs text-[var(--text-muted)] hover:text-accent font-mono self-end">
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      {!loading && hasActiveFilters && (
        <p className="text-xs font-mono text-[var(--text-muted)]">
          {filtered.length} room{filtered.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card overflow-hidden flex flex-col sm:flex-row" style={{ height: '120px' }}>
              <Skeleton className="sm:w-44 h-full rounded-none" />
              <div className="flex-1 p-4 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <Skeleton className="h-4 w-12 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <BookOpenCheck size={32} className="text-[var(--text-muted)] mx-auto" />
          <p className="font-semibold text-[var(--text-primary)]">No rooms yet</p>
          <p className="text-sm text-[var(--text-secondary)]">Rooms will appear here once published.</p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-10 text-center space-y-3">
          <Search size={28} className="text-[var(--text-muted)] mx-auto" />
          <p className="text-sm text-[var(--text-secondary)]">No rooms match your filters.</p>
          <button type="button" onClick={clearFilters} className="text-xs text-accent font-mono hover:opacity-80">Clear filters</button>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((room, index) => (
            <RoomCard
              key={room.id || room._id}
              room={room}
              stepIndex={index}
              isNext={Boolean(nextRoom && (nextRoom.id || nextRoom._id) === (room.id || room._id))}
            />
          ))}
        </div>
      )}
    </div>
  )
}
