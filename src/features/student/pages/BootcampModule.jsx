import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BookOpen, ChevronLeft, Lock } from 'lucide-react'
import { Card, Badge, Button, Skeleton } from '@/shared/components/ui'
import { studentService } from '@/core/services'
import api from '@/core/services/api'
import { useToast } from '@/core/contexts/ToastContext'

export default function BootcampModule() {
  const { bootcampId, moduleId } = useParams()
  const [bootcamp, setBootcamp] = useState(null)
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [accessError, setAccessError] = useState('')
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setAccessError('')
      try {
        const [bootcampsRes, courseRes] = await Promise.allSettled([
          api.get('/public/bootcamps'),
          studentService.getCourse({ bootcampId }),
        ])
        if (!mounted) return
        if (bootcampsRes.status === 'fulfilled') {
          const items = bootcampsRes.value?.data?.items || []
          setBootcamp(items.find((item) => item.id === bootcampId) || null)
        }
        if (courseRes.status === 'fulfilled') {
          setCourse(courseRes.value?.data || null)
        } else {
          setAccessError(courseRes.reason?.response?.data?.error || 'Bootcamp access required to view rooms.')
          setCourse(null)
        }
      } catch {
        toast({ type: 'error', message: 'Failed to load module details.' })
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [bootcampId, toast])

  const module = useMemo(() => {
    const modules = course?.modules || []
    return modules.find((item) => String(item.moduleId) === String(moduleId)) || null
  }, [course, moduleId])

  const BackButton = () => (
    <Button variant="ghost" size="sm" onClick={() => navigate(`/bootcamp/${bootcampId}`)}>
      <ChevronLeft size={16} /> Back to bootcamp
    </Button>
  )

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-5 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-5 space-y-3">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-9 w-full" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (accessError && !course) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <BackButton />
        <Card className="p-6 text-sm text-[var(--text-secondary)]">{accessError}</Card>
      </div>
    )
  }

  if (!module) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <BackButton />
        <Card className="p-6 text-sm text-[var(--text-secondary)]">Module not found.</Card>
      </div>
    )
  }

  if (module.locked) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <BackButton />
        <Card className="p-6 flex items-center gap-4">
          <Lock size={20} className="text-[var(--text-muted)] shrink-0" />
          <div>
            <p className="font-semibold text-[var(--text-primary)]">Module locked</p>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">Ask an admin to unlock this module for you.</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <BackButton />

      <div>
        <p className="font-mono text-accent text-xs uppercase tracking-widest mb-1">Module {moduleId}</p>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">{module.title}</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          {module.description || bootcamp?.description || 'Module rooms and live sessions.'}
        </p>
      </div>

      {accessError && (
        <Card className="p-5 text-sm text-[var(--text-secondary)]">{accessError}</Card>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-accent" />
          <h2 className="font-display font-semibold text-xl text-[var(--text-primary)]">Rooms</h2>
          {(module.rooms || []).length > 0 && (
            <span className="text-xs font-mono text-[var(--text-muted)]">· {module.rooms.length}</span>
          )}
        </div>

        {(module.rooms || []).length === 0 ? (
          <Card className="p-6 text-sm text-[var(--text-secondary)]">No rooms in this module yet.</Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {module.rooms.map((room) => {
              const isLocked = room.locked
              const hasLive = Boolean(room.liveClass?.link)
              return (
                <Card
                  key={room.roomId}
                  className={`p-5 flex flex-col gap-3 ${isLocked ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-mono uppercase tracking-widest text-accent">Room {room.roomId}</p>
                      <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] leading-snug">{room.title}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {hasLive && <Badge variant="success">Live</Badge>}
                      {isLocked && <Lock size={15} className="text-[var(--text-muted)]" />}
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] flex-1">
                    {room.overview || 'Room content and exercises.'}
                  </p>
                  <Button
                    variant={isLocked ? 'outline' : 'primary'}
                    className="w-full justify-center mt-auto"
                    disabled={isLocked}
                    onClick={() => !isLocked && navigate(`/bootcamp/${bootcampId}/modules/${module.moduleId}/rooms/${room.roomId}`)}
                  >
                    {isLocked ? <><Lock size={14} /> Locked</> : 'Open Room'}
                  </Button>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
