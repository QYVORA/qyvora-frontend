import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpenCheck } from 'lucide-react'
import { Card, Skeleton } from '@/shared/components/ui'
import { studentService } from '@/core/services'
import { resolveImageUrl } from '@/shared/utils/resolveImageUrl'

export default function RoomsPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

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

  const sortedRooms = useMemo(() => rooms.slice().sort((a, b) => {
    const aDone = a.completed ? 1 : 0
    const bDone = b.completed ? 1 : 0
    if (aDone !== bDone) return aDone - bDone
    return String(a.title || '').localeCompare(String(b.title || ''))
  }), [rooms])

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Rooms</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Self-paced missions with curated labs and content.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6 space-y-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-full" />
            </Card>
          ))}
        </div>
      ) : sortedRooms.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-sm text-[var(--text-secondary)]">Rooms will appear here soon.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedRooms.map((room) => {
            const accent = room.accentColor || 'var(--accent)'
            const cover = resolveImageUrl(room.coverImage)
            const logo = resolveImageUrl(room.logoUrl)
            return (
              <Link key={room.id} to={`/learn/rooms/${room.slug}`} className="block">
                <Card className="overflow-hidden h-full flex flex-col group hover:shadow-xl transition-shadow">
                  <div className="relative h-40 bg-[var(--bg-secondary)] overflow-hidden">
                    {cover ? (
                      <img
                        src={cover}
                        alt={room.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] text-xs font-mono uppercase tracking-[0.2em]">
                        Room Briefing
                      </div>
                    )}
                    {room.completed && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-mono border"
                        style={{ borderColor: `${accent}55`, background: `${accent}20`, color: accent }}>
                        Completed
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1 gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center overflow-hidden">
                        {logo ? (
                          <img src={logo} alt="Room logo" className="w-full h-full object-contain" />
                        ) : (
                          <BookOpenCheck size={18} className="text-[var(--text-muted)]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">{room.title}</h3>
                        <p className="text-xs text-[var(--text-muted)] mt-1">{room.level || 'Beginner'} · {room.sectionsCount || 0} sections</p>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                      {room.description || 'Room description coming soon.'}
                    </p>
                    {room.tags?.length ? (
                      <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--text-muted)]">
                        {room.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-1 rounded-full border border-[var(--border)]">{tag}</span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
