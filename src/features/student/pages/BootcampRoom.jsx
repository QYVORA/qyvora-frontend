import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BookOpen, ChevronLeft, FileDown, Video } from 'lucide-react'
import { Card, Button, Badge } from '@/shared/components/ui'
import { studentService } from '@/core/services'
import { useToast } from '@/core/contexts/ToastContext'

export default function BootcampRoom() {
  const { bootcampId, moduleId, roomId } = useParams()
  const [course, setCourse] = useState(null)
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [accessError, setAccessError] = useState('')
  const [quiz, setQuiz] = useState(null)
  const [quizLoading, setQuizLoading] = useState(false)
  const [quizError, setQuizError] = useState('')
  const [answers, setAnswers] = useState({})
  const [quizResult, setQuizResult] = useState(null)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setAccessError('')
      try {
        const [courseRes, resourcesRes] = await Promise.allSettled([
          studentService.getCourse({ bootcampId }),
          studentService.getBootcampResources({ moduleId, roomId }),
        ])

        if (!mounted) return

        if (courseRes.status === 'fulfilled') {
          setCourse(courseRes.value?.data || null)
        } else {
          const apiMessage = courseRes.reason?.response?.data?.error
          setAccessError(apiMessage || 'Bootcamp access is required to view this room.')
        }

        if (resourcesRes.status === 'fulfilled') {
          const items = resourcesRes.value?.data?.items || []
          setResources(items.flatMap((item) => item.resources || []))
        } else {
          setResources([])
        }
      } catch (err) {
        toast({ type: 'error', message: 'Failed to load room data.' })
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [bootcampId, moduleId, roomId, toast])

  const module = useMemo(() => {
    const modules = course?.modules || []
    return modules.find((item) => String(item.moduleId) === String(moduleId)) || null
  }, [course, moduleId])

  const room = useMemo(() => {
    const rooms = module?.rooms || []
    return rooms.find((item) => String(item.roomId) === String(roomId)) || null
  }, [module, roomId])

  const handleLoadQuiz = async () => {
    if (!room) return
    setQuizLoading(true)
    setQuizError('')
    try {
      const res = await studentService.requestQuiz({
        type: 'room',
        id: String(room.roomId),
        courseId: String(bootcampId || ''),
        moduleId: String(moduleId || ''),
      })
      setQuiz(res.data || null)
    } catch (err) {
      const status = err?.response?.status
      const apiMessage = err?.response?.data?.error
      if (status === 403) {
        setQuizError(apiMessage || 'Quiz access is locked. Ask an admin to enable it for you.')
      } else {
        setQuizError(apiMessage || 'Quiz unavailable right now.')
      }
    } finally {
      setQuizLoading(false)
    }
  }

  const handleSubmitQuiz = async () => {
    if (!quiz) return
    setQuizLoading(true)
    try {
      const res = await studentService.requestQuiz({
        scope: { ...(quiz.scope || {}), moduleId: quiz.scope?.moduleId || String(moduleId || '') },
        answers,
      })
      setQuizResult(res.data || null)
      toast({ type: 'success', title: 'Quiz submitted', message: 'Your score has been recorded.' })
    } catch (err) {
      const apiMessage = err?.response?.data?.error
      toast({ type: 'error', message: apiMessage || 'Quiz submission failed.' })
    } finally {
      setQuizLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="p-6 text-sm text-[var(--text-secondary)]">Loading room...</Card>
      </div>
    )
  }

  if (accessError && !course) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(`/bootcamp/${bootcampId}/modules/${moduleId}`)}>
          <ChevronLeft size={16} /> Back to module
        </Button>
        <Card className="p-6 text-sm text-[var(--text-secondary)]">{accessError}</Card>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(`/bootcamp/${bootcampId}/modules/${moduleId}`)}>
          <ChevronLeft size={16} /> Back to module
        </Button>
        <Card className="p-6 text-sm text-[var(--text-secondary)]">Room not found.</Card>
      </div>
    )
  }

  if (room.locked) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(`/bootcamp/${bootcampId}/modules/${moduleId}`)}>
          <ChevronLeft size={16} /> Back to module
        </Button>
        <Card className="p-6 text-sm text-[var(--text-secondary)]">
          This room is locked. Ask an admin to open access.
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">{room.title}</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">{room.overview || module?.description || 'Live session, resources, and quiz.'}</p>
        </div>
        <Button variant="ghost" onClick={() => navigate(`/bootcamp/${bootcampId}/modules/${moduleId}`)}>
          <ChevronLeft size={16} /> Back to module
        </Button>
      </div>

      {accessError && (
        <Card className="p-6 text-sm text-[var(--text-secondary)]">{accessError}</Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Video size={18} className="text-accent" />
            <h2 className="font-display font-semibold text-lg text-[var(--text-primary)]">Live Session</h2>
          </div>
          {room.liveClass?.link ? (
            <>
              <p className="text-sm text-[var(--text-secondary)]">{room.liveClass.title || 'Live class'} with {room.liveClass.instructor || 'Instructor'}.</p>
              {room.liveClass.time && (
                <p className="text-xs text-[var(--text-muted)] font-mono">{room.liveClass.time}</p>
              )}
              <a
                href={room.liveClass.link}
                target="_blank"
                rel="noreferrer"
                className="btn-primary w-full justify-center flex"
              >
                Join Session
              </a>
            </>
          ) : (
            <p className="text-sm text-[var(--text-secondary)]">No live session scheduled yet.</p>
          )}
        </Card>

        <Card className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-accent" />
            <h2 className="font-display font-semibold text-lg text-[var(--text-primary)]">Quiz</h2>
          </div>
          {quiz ? (
            <div className="space-y-4">
              {(quiz.questions || []).map((question, index) => (
                <div key={question.id || index} className="space-y-2">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{index + 1}. {question.text}</p>
                  <div className="space-y-1">
                    {(question.options || []).map((opt, optIndex) => (
                      <label key={optIndex} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <input
                          type="radio"
                          name={question.id}
                          value={optIndex}
                          checked={answers[question.id] === optIndex}
                          onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: optIndex }))}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <Button
                variant="primary"
                loading={quizLoading}
                onClick={handleSubmitQuiz}
                className="w-full justify-center"
              >
                Submit Quiz
              </Button>
              {quizResult && (
                <div className="text-sm text-[var(--text-secondary)]">
                  <Badge variant={quizResult.passed ? 'success' : 'warning'}>
                    {quizResult.passed ? 'Passed' : 'Completed'}
                  </Badge>
                  <p className="mt-2">Score: {quizResult.score}% ({quizResult.correct}/{quizResult.total})</p>
                </div>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-[var(--text-secondary)]">Ready when you are. This quiz unlocks after admin approval.</p>
              {quizError && <p className="text-xs text-accent">{quizError}</p>}
              <Button
                variant="outline"
                loading={quizLoading}
                onClick={handleLoadQuiz}
                className="w-full justify-center"
              >
                {quizLoading ? 'Loading Quiz...' : 'Load Quiz'}
              </Button>
            </>
          )}
        </Card>

        <Card className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <FileDown size={18} className="text-accent" />
            <h2 className="font-display font-semibold text-lg text-[var(--text-primary)]">Documents</h2>
          </div>
          {resources.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">No downloadable documents yet.</p>
          ) : (
            <div className="space-y-3">
              {resources.map((doc, index) => (
                <div key={`${doc.title}-${index}`} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{doc.title || 'Resource'}</p>
                    {doc.description && <p className="text-xs text-[var(--text-secondary)]">{doc.description}</p>}
                  </div>
                  {doc.url ? (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      download={doc.type === 'file' ? '' : undefined}
                      className="btn-secondary text-xs px-3 py-1.5"
                    >
                      Download
                    </a>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]">Unavailable</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div>
        <Link to={`/bootcamp/${bootcampId}/modules/${moduleId}`} className="text-sm text-accent hover:opacity-80">
          Back to module overview
        </Link>
      </div>
    </div>
  )
}
