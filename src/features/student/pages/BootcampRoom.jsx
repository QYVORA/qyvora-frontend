import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BookOpen, ChevronLeft, FileDown, Lock, Video } from 'lucide-react'
import { Card, Button, Badge, Skeleton } from '@/shared/components/ui'
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
          setAccessError(courseRes.reason?.response?.data?.error || 'Bootcamp access required.')
        }
        if (resourcesRes.status === 'fulfilled') {
          const items = resourcesRes.value?.data?.items || []
          setResources(items.flatMap((item) => item.resources || []))
        }
      } catch {
        toast({ type: 'error', message: 'Failed to load room data.' })
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [bootcampId, moduleId, roomId, toast])

  const module = useMemo(() => {
    return (course?.modules || []).find((item) => String(item.moduleId) === String(moduleId)) || null
  }, [course, moduleId])

  const room = useMemo(() => {
    return (module?.rooms || []).find((item) => String(item.roomId) === String(roomId)) || null
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
      const msg = err?.response?.data?.error
      setQuizError(status === 403 ? (msg || 'Quiz locked — ask an admin to enable it.') : (msg || 'Quiz unavailable right now.'))
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
      toast({ type: 'success', message: 'Quiz submitted. Score recorded.' })
    } catch (err) {
      if (err?.response?.status === 410) {
        setQuizError('This quiz is no longer available')
        return
      }
      toast({ type: 'error', message: err?.response?.data?.error || 'Quiz submission failed.' })
    } finally {
      setQuizLoading(false)
    }
  }

  const BackButton = () => (
    <Button variant="ghost" size="sm" onClick={() => navigate(`/bootcamp/${bootcampId}/modules/${moduleId}`)}>
      <ChevronLeft size={16} /> Back to module
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-5 space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
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

  if (!room) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <BackButton />
        <Card className="p-6 text-sm text-[var(--text-secondary)]">Room not found.</Card>
      </div>
    )
  }

  if (room.locked) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <BackButton />
        <Card className="p-6 flex items-center gap-4">
          <Lock size={20} className="text-[var(--text-muted)] shrink-0" />
          <div>
            <p className="font-semibold text-[var(--text-primary)]">Room locked</p>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">Ask an admin to open access to this room.</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <BackButton />

      <div>
        <p className="font-mono text-accent text-xs uppercase tracking-widest mb-1">Room {roomId}</p>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">{room.title}</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          {room.overview || module?.description || 'Live session, resources, and quiz.'}
        </p>
      </div>

      {accessError && (
        <Card className="p-5 text-sm text-[var(--text-secondary)]">{accessError}</Card>
      )}

      {/* 3 panels — stack on mobile, 3-col on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Live Session */}
        <Card className="p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Video size={16} className="text-accent" />
            <h2 className="font-semibold text-[var(--text-primary)]">Live Session</h2>
          </div>
          {room.liveClass?.link ? (
            <>
              <div className="flex-1 space-y-1">
                <p className="text-sm text-[var(--text-secondary)]">
                  {room.liveClass.title || 'Live class'} with {room.liveClass.instructor || 'Instructor'}
                </p>
                {room.liveClass.time && (
                  <p className="text-xs text-[var(--text-muted)] font-mono">{room.liveClass.time}</p>
                )}
              </div>
              <a href={room.liveClass.link} target="_blank" rel="noreferrer" className="btn-primary w-full flex items-center justify-center gap-2">
                <Video size={15} /> Join Session
              </a>
            </>
          ) : (
            <p className="text-sm text-[var(--text-secondary)] flex-1">No live session scheduled yet.</p>
          )}
        </Card>

        {/* Quiz */}
        <Card className="p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-accent" />
            <h2 className="font-semibold text-[var(--text-primary)]">Quiz</h2>
          </div>
          {quiz ? (
            <div className="flex-1 space-y-4 overflow-y-auto max-h-80">
              {(quiz.questions || []).map((question, index) => (
                <div key={question.id || index} className="space-y-2">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{index + 1}. {question.text}</p>
                  <div className="space-y-1.5">
                    {(question.options || []).map((opt, optIndex) => {
                      const selected = answers[question.id] === optIndex
                      return (
                        <label
                          key={optIndex}
                          className={`flex items-center gap-2.5 text-sm px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                            selected
                              ? 'border-accent/50 bg-accent/10 text-[var(--text-primary)]'
                              : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-accent/30 hover:bg-[var(--bg-secondary)]'
                          }`}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={optIndex}
                            checked={selected}
                            onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: optIndex }))}
                            className="sr-only"
                          />
                          <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? 'border-accent' : 'border-[var(--border)]'}`}>
                            {selected && <span className="w-2 h-2 rounded-full bg-accent" />}
                          </span>
                          {opt}
                        </label>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-secondary)] flex-1">
              Quiz unlocks after admin approval.
            </p>
          )}
          {quizError && <p className="text-xs text-accent">{quizError}</p>}
          {quizResult && (
            <div className="flex items-center gap-2 text-sm">
              <Badge variant={quizResult.passed ? 'success' : 'warning'}>
                {quizResult.passed ? 'Passed' : 'Completed'}
              </Badge>
              <span className="text-[var(--text-secondary)]">{quizResult.score}% · {quizResult.correct}/{quizResult.total}</span>
            </div>
          )}
          {!quizResult && (
            quiz ? (
              <Button variant="primary" loading={quizLoading} onClick={handleSubmitQuiz} className="w-full justify-center">
                Submit Quiz
              </Button>
            ) : (
              <Button variant="outline" loading={quizLoading} onClick={handleLoadQuiz} className="w-full justify-center">
                {quizLoading ? 'Loading...' : 'Load Quiz'}
              </Button>
            )
          )}
        </Card>

        {/* Documents */}
        <Card className="p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <FileDown size={16} className="text-accent" />
            <h2 className="font-semibold text-[var(--text-primary)]">Documents</h2>
          </div>
          {resources.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)] flex-1">No downloadable documents yet.</p>
          ) : (
            <div className="flex-1 space-y-3 overflow-y-auto max-h-80">
              {resources.map((doc, index) => (
                <div key={`${doc.title}-${index}`} className="flex items-start justify-between gap-3 py-2 border-b border-[var(--border)] last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{doc.title || 'Resource'}</p>
                    {doc.description && <p className="text-xs text-[var(--text-secondary)] mt-0.5">{doc.description}</p>}
                  </div>
                  {doc.url ? (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      download={doc.type === 'file' ? '' : undefined}
                      className="btn-secondary text-xs px-3 py-1.5 shrink-0"
                    >
                      Download
                    </a>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)] shrink-0">Unavailable</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
