import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BookOpen, ChevronLeft } from 'lucide-react'
import { Card, Badge, Button } from '@/shared/components/ui'
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
          studentService.getCourse(),
        ])

        if (!mounted) return

        if (bootcampsRes.status === 'fulfilled') {
          const items = bootcampsRes.value?.data?.items || []
          setBootcamp(items.find((item) => item.id === bootcampId) || null)
        }

        if (courseRes.status === 'fulfilled') {
          setCourse(courseRes.value?.data || null)
        } else {
          const apiMessage = courseRes.reason?.response?.data?.error
          setAccessError(apiMessage || 'Bootcamp access is required to view rooms.')
          setCourse(null)
        }
      } catch (err) {
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

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="p-6 text-sm text-[var(--text-secondary)]">Loading module...</Card>
      </div>
    )
  }

  if (accessError && !course) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(`/bootcamp/${bootcampId}`)}>
          <ChevronLeft size={16} /> Back to bootcamp
        </Button>
        <Card className="p-6 text-sm text-[var(--text-secondary)]">{accessError}</Card>
      </div>
    )
  }

  if (!module) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(`/bootcamp/${bootcampId}`)}>
          <ChevronLeft size={16} /> Back to bootcamp
        </Button>
        <Card className="p-6 text-sm text-[var(--text-secondary)]">Module not found.</Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-1">// module {module.moduleId}</p>
          <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">{module.title}</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">{module.description || bootcamp?.description || 'Module rooms and live sessions.'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate(`/bootcamp/${bootcampId}`)}>
            <ChevronLeft size={16} /> Back
          </Button>
        </div>
      </div>

      {accessError ? (
        <Card className="p-6 text-sm text-[var(--text-secondary)]">{accessError}</Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-accent" />
            <h2 className="font-display font-semibold text-xl text-[var(--text-primary)]">Rooms</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(module.rooms || []).map((room) => (
              <Card key={room.roomId} className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-accent">Room {room.roomId}</p>
                    <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">{room.title}</h3>
                  </div>
                  {room.liveClass?.link && <Badge variant="success">Live</Badge>}
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{room.overview || 'Room content and exercises.'}</p>
                <div className="mt-auto">
                  <Link
                    to={`/bootcamp/${bootcampId}/modules/${module.moduleId}/rooms/${room.roomId}`}
                    className="btn-primary w-full justify-center flex"
                  >
                    Open Room
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
