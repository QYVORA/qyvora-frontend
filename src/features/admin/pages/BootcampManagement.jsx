import { useEffect, useMemo, useState } from 'react'
import { Search, ShieldCheck, Users } from 'lucide-react'
import { Card, Badge, Button, Skeleton } from '@/shared/components/ui'
import { adminService } from '@/core/services'
import { useToast } from '@/core/contexts/ToastContext'
import { useModal } from '@/core/contexts/ModalContext'

export default function AdminBootcampManagement() {
  const [bootcamps, setBootcamps] = useState([])
  const [rawContent, setRawContent] = useState(null)
  const [users, setUsers] = useState([])
  const [selectedBootcampId, setSelectedBootcampId] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [savingUserId, setSavingUserId] = useState('')
  const [savingEnrollId, setSavingEnrollId] = useState('')
  const [savingAccess, setSavingAccess] = useState(false)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [quizSummary, setQuizSummary] = useState(null)
  const { toast } = useToast()
  const { openModal, closeModal } = useModal()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const [contentRes, usersRes] = await Promise.all([
          adminService.getContent(),
          adminService.getUsers(),
        ])
        if (!mounted) return
        const nextBootcamps = contentRes.data?.learn?.bootcamps || []
        setRawContent(contentRes.data || null)
        setBootcamps(nextBootcamps)
        setUsers(usersRes.data || [])
        if (nextBootcamps.length) {
          setSelectedBootcampId((prev) => prev || nextBootcamps[0].id)
        }
      } catch {
        if (!mounted) return
        setBootcamps([])
        setUsers([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!selectedBootcampId) return
    setSummaryLoading(true)
    adminService.getBootcampQuizSummary(selectedBootcampId)
      .then((res) => setQuizSummary(res.data || null))
      .catch(() => setQuizSummary(null))
      .finally(() => setSummaryLoading(false))
  }, [selectedBootcampId])

  const selectedBootcamp = useMemo(
    () => bootcamps.find((item) => item.id === selectedBootcampId) || null,
    [bootcamps, selectedBootcampId]
  )

  const normalizeAccess = (raw = {}) => ({
    started: Boolean(raw?.started),
    unlockedModules: Array.isArray(raw?.unlockedModules)
      ? raw.unlockedModules.map((id) => Number(id)).filter((id) => Number.isFinite(id))
      : [],
    unlockedRooms: raw?.unlockedRooms && typeof raw.unlockedRooms === 'object'
      ? raw.unlockedRooms
      : {},
    quizRelease: {
      enabled: Boolean(raw?.quizRelease?.enabled),
      modules: Array.isArray(raw?.quizRelease?.modules)
        ? raw.quizRelease.modules.map((id) => Number(id)).filter((id) => Number.isFinite(id))
        : [],
      rooms: raw?.quizRelease?.rooms && typeof raw.quizRelease.rooms === 'object'
        ? raw.quizRelease.rooms
        : {},
    },
  })

  const accessRoot = useMemo(() => {
    if (rawContent?.learn?.bootcampAccess && typeof rawContent.learn.bootcampAccess === 'object') {
      return rawContent.learn.bootcampAccess
    }
    return {}
  }, [rawContent])

  const selectedAccess = useMemo(
    () => normalizeAccess(accessRoot?.[selectedBootcampId] || {}),
    [accessRoot, selectedBootcampId]
  )

  const roomLinks = useMemo(
    () => (Array.isArray(rawContent?.learn?.bootcampRoomLinks) ? rawContent.learn.bootcampRoomLinks : []),
    [rawContent]
  )

  const roomResources = useMemo(
    () => (Array.isArray(rawContent?.learn?.bootcampResources) ? rawContent.learn.bootcampResources : []),
    [rawContent]
  )

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()
    return users.filter((user) => {
      const identity = `${user.hackerHandle || ''} ${user.name || ''} ${user.email || ''}`.toLowerCase()
      return identity.includes(query)
    })
  }, [users, search])

  const updateBootcamps = async (next) => {
    const payload = {
      ...(rawContent || {}),
      learn: {
        ...(rawContent?.learn || {}),
        bootcamps: next,
      },
    }
    const res = await adminService.updateContent(payload)
    setRawContent(res.data || payload)
    setBootcamps(res.data?.learn?.bootcamps || next)
  }

  const updateLearnContent = async (updates) => {
    const payload = {
      ...(rawContent || {}),
      learn: {
        ...(rawContent?.learn || {}),
        ...(updates || {}),
      },
    }
    const res = await adminService.updateContent(payload)
    setRawContent(res.data || payload)
    return res.data || payload
  }

  const updateBootcampAccess = async (bootcampId, updater) => {
    if (!bootcampId) return
    setSavingAccess(true)
    try {
      const current = normalizeAccess(accessRoot?.[bootcampId] || {})
      const nextAccess = typeof updater === 'function' ? updater(current) : { ...current, ...(updater || {}) }
      const nextRoot = { ...(accessRoot || {}), [bootcampId]: nextAccess }
      const payload = {
        ...(rawContent || {}),
        learn: {
          ...(rawContent?.learn || {}),
          bootcampAccess: nextRoot,
        },
      }
      const res = await adminService.updateContent(payload)
      setRawContent(res.data || payload)
      toast({ type: 'success', message: 'Bootcamp access updated.' })
    } catch {
      toast({ type: 'error', message: 'Failed to update bootcamp access.' })
    } finally {
      setSavingAccess(false)
    }
  }

  const toggleQuizAccess = async (userId) => {
    if (!selectedBootcamp) return
    setSavingUserId(userId)
    try {
      const current = Array.isArray(selectedBootcamp.quizAccessUserIds)
        ? selectedBootcamp.quizAccessUserIds
        : []
      const nextList = current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId]

      const nextBootcamps = bootcamps.map((item) => (
        item.id === selectedBootcamp.id
          ? { ...item, quizAccessUserIds: nextList }
          : item
      ))

      await updateBootcamps(nextBootcamps)
      toast({ type: 'success', message: 'Quiz access updated.' })
    } catch {
      toast({ type: 'error', message: 'Failed to update quiz access.' })
    } finally {
      setSavingUserId('')
    }
  }

  const enrollUserInBootcamp = async (userId) => {
    if (!selectedBootcampId) return
    setSavingEnrollId(userId)
    try {
      const res = await adminService.updateUser(userId, {
        bootcampId: selectedBootcampId,
        bootcampStatus: 'enrolled',
      })
      setUsers((prev) => prev.map((user) => (user.id === userId ? res.data : user)))
      toast({ type: 'success', message: 'User enrolled in bootcamp.' })
    } catch {
      toast({ type: 'error', message: 'Failed to enroll user.' })
    } finally {
      setSavingEnrollId('')
    }
  }

  const markQuizReleased = (current, scope) => {
    const next = {
      ...current,
      quizRelease: {
        ...(current.quizRelease || {}),
        enabled: true,
        modules: Array.isArray(current.quizRelease?.modules) ? [...current.quizRelease.modules] : [],
        rooms: current.quizRelease?.rooms && typeof current.quizRelease.rooms === 'object'
          ? { ...current.quizRelease.rooms }
          : {},
      },
    }
    if (scope.type === 'module') {
      const id = Number(scope.id)
      if (Number.isFinite(id) && !next.quizRelease.modules.includes(id)) {
        next.quizRelease.modules.push(id)
      }
    }
    if (scope.type === 'room') {
      const moduleId = Number(scope.moduleId)
      const roomId = Number(scope.id)
      if (Number.isFinite(moduleId) && Number.isFinite(roomId)) {
        const currentRooms = Array.isArray(next.quizRelease.rooms?.[moduleId]) ? next.quizRelease.rooms[moduleId] : []
        if (!currentRooms.includes(roomId)) {
          next.quizRelease.rooms[moduleId] = [...currentRooms, roomId]
        }
      }
    }
    return next
  }

  const openQuizReleaseModal = ({ scope, label }) => {
    const QuizReleaseForm = () => {
      const [title, setTitle] = useState('Quiz available')
      const [message, setMessage] = useState('A new quiz is ready for you.')
      const [submitting, setSubmitting] = useState(false)
      const [questions, setQuestions] = useState([
        { text: '', options: ['', '', '', ''], correctIndex: 0 },
      ])

      const updateQuestion = (index, updates) => {
        setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...updates } : q)))
      }

      const updateOption = (qIndex, optIndex, value) => {
        setQuestions((prev) => prev.map((q, i) => {
          if (i !== qIndex) return q
          const nextOptions = [...(q.options || [])]
          nextOptions[optIndex] = value
          return { ...q, options: nextOptions }
        }))
      }

      const addQuestion = () => {
        setQuestions((prev) => [...prev, { text: '', options: ['', '', '', ''], correctIndex: 0 }])
      }

      const removeQuestion = (index) => {
        setQuestions((prev) => prev.filter((_, i) => i !== index))
      }

      const handleSubmit = async () => {
        const trimmed = questions
          .map((q) => ({
            ...q,
            text: String(q.text || '').trim(),
            options: Array.isArray(q.options) ? q.options.map((opt) => String(opt || '').trim()).filter(Boolean) : [],
          }))
          .filter((q) => q.text && q.options.length >= 2)

        if (trimmed.length === 0) {
          toast({ type: 'error', message: 'Add at least one question with two options.' })
          return
        }

        setSubmitting(true)
        try {
          await adminService.releaseQuiz({
            scope,
            title: String(title || '').trim(),
            message: String(message || '').trim(),
            questions: trimmed,
          })
          await updateBootcampAccess(selectedBootcampId, (current) => markQuizReleased(current, scope))
          toast({ type: 'success', message: 'Quiz released.' })
          closeModal()
        } catch {
          toast({ type: 'error', message: 'Failed to release quiz.' })
        } finally {
          setSubmitting(false)
        }
      }

      return (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-1">Title</p>
            <input
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Quiz available"
            />
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-1">Message</p>
            <input
              className="input-field"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="A new quiz is ready for you."
            />
          </div>
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Questions</p>
            {questions.map((q, index) => (
              <div key={`q-${index}`} className="border border-[var(--border)] rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <input
                    className="input-field flex-1"
                    value={q.text}
                    onChange={(e) => updateQuestion(index, { text: e.target.value })}
                    placeholder={`Question ${index + 1}`}
                  />
                  {questions.length > 1 && (
                    <Button size="sm" variant="ghost" onClick={() => removeQuestion(index)}>
                      Remove
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {(q.options || []).map((opt, optIndex) => (
                    <input
                      key={`q-${index}-opt-${optIndex}`}
                      className="input-field"
                      value={opt}
                      onChange={(e) => updateOption(index, optIndex, e.target.value)}
                      placeholder={`Option ${optIndex + 1}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-[var(--text-muted)]">Correct option</p>
                  <select
                    className="input-field w-24"
                    value={q.correctIndex}
                    onChange={(e) => updateQuestion(index, { correctIndex: Number(e.target.value) })}
                  >
                    {(q.options || []).map((_, optIndex) => (
                      <option key={`q-${index}-correct-${optIndex}`} value={optIndex}>
                        {optIndex + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addQuestion}>Add Question</Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button loading={submitting} onClick={handleSubmit}>Release Quiz</Button>
          </div>
        </div>
      )
    }

    openModal({
      title: `${label} Quiz`,
      badge: 'QUIZ RELEASE',
      description: 'Set questions and release this quiz to all enrolled users.',
      content: <QuizReleaseForm />,
      dismissible: false,
    })
  }

  const openRoomLinkModal = ({ moduleId, roomId, moduleTitle, roomTitle }) => {
    const existing = roomLinks.find((item) => Number(item.moduleId) === Number(moduleId) && Number(item.roomId) === Number(roomId))
    const RoomLinkForm = () => {
      const [title, setTitle] = useState(existing?.title || '')
      const [instructor, setInstructor] = useState(existing?.instructor || '')
      const [time, setTime] = useState(existing?.time || '')
      const [meetUrl, setMeetUrl] = useState(existing?.meetUrl || '')
      const [saving, setSaving] = useState(false)

      const handleSave = async () => {
        setSaving(true)
        try {
          const nextLinks = roomLinks.filter((item) => !(Number(item.moduleId) === Number(moduleId) && Number(item.roomId) === Number(roomId)))
          if (title || instructor || time || meetUrl) {
            nextLinks.push({
              moduleId: Number(moduleId),
              roomId: Number(roomId),
              title: String(title || '').trim(),
              instructor: String(instructor || '').trim(),
              time: String(time || '').trim(),
              meetUrl: String(meetUrl || '').trim(),
              updatedAt: new Date().toISOString(),
            })
          }
          await updateLearnContent({ bootcampRoomLinks: nextLinks })
          toast({ type: 'success', message: 'Room link saved.' })
          closeModal()
        } catch {
          toast({ type: 'error', message: 'Failed to save room link.' })
        } finally {
          setSaving(false)
        }
      }

      return (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-1">Title</p>
            <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Live session title" />
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-1">Instructor</p>
            <input className="input-field" value={instructor} onChange={(e) => setInstructor(e.target.value)} placeholder="Instructor name" />
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-1">Time</p>
            <input className="input-field" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. Mondays 6pm" />
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-1">Meeting URL</p>
            <input className="input-field" value={meetUrl} onChange={(e) => setMeetUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button loading={saving} onClick={handleSave}>Save Link</Button>
          </div>
        </div>
      )
    }

    openModal({
      title: `Room ${roomId} Link`,
      badge: 'ROOM LINK',
      description: `${moduleTitle || 'Module'} • ${roomTitle || `Room ${roomId}`}`,
      content: <RoomLinkForm />,
      dismissible: false,
    })
  }

  const openRoomResourcesModal = ({ moduleId, roomId, moduleTitle, roomTitle }) => {
    const existing = roomResources.find((item) => Number(item.moduleId) === Number(moduleId) && Number(item.roomId) === Number(roomId))
    const RoomResourcesForm = () => {
      const [resources, setResources] = useState(
        Array.isArray(existing?.resources) && existing.resources.length
          ? existing.resources.map((res) => ({
              title: res.title || '',
              url: res.url || '',
              type: res.type || 'file',
            }))
          : [{ title: '', url: '', type: 'file' }]
      )
      const [saving, setSaving] = useState(false)

      const updateResource = (index, updates) => {
        setResources((prev) => prev.map((res, i) => (i === index ? { ...res, ...updates } : res)))
      }

      const addResource = () => {
        setResources((prev) => [...prev, { title: '', url: '', type: 'file' }])
      }

      const removeResource = (index) => {
        setResources((prev) => prev.filter((_, i) => i !== index))
      }

      const handleSave = async () => {
        const cleaned = resources
          .map((res) => ({
            title: String(res.title || '').trim(),
            url: String(res.url || '').trim(),
            type: String(res.type || 'file').trim(),
          }))
          .filter((res) => res.title && res.url)

        setSaving(true)
        try {
          const nextResources = roomResources.filter((item) => !(Number(item.moduleId) === Number(moduleId) && Number(item.roomId) === Number(roomId)))
          if (cleaned.length) {
            nextResources.push({
              id: existing?.id || `br_${Date.now()}`,
              moduleId: Number(moduleId),
              moduleTitle: moduleTitle || '',
              roomId: Number(roomId),
              roomTitle: roomTitle || '',
              resources: cleaned.map((res) => ({ ...res, description: '' })),
            })
          }
          await updateLearnContent({ bootcampResources: nextResources })
          toast({ type: 'success', message: 'Room resources saved.' })
          closeModal()
        } catch {
          toast({ type: 'error', message: 'Failed to save room resources.' })
        } finally {
          setSaving(false)
        }
      }

      return (
        <div className="space-y-4">
          <div className="space-y-3">
            {resources.map((res, index) => (
              <div key={`res-${index}`} className="border border-[var(--border)] rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <input
                    className="input-field flex-1"
                    value={res.title}
                    onChange={(e) => updateResource(index, { title: e.target.value })}
                    placeholder={`Resource ${index + 1} title`}
                  />
                  {resources.length > 1 && (
                    <Button size="sm" variant="ghost" onClick={() => removeResource(index)}>Remove</Button>
                  )}
                </div>
                <input
                  className="input-field"
                  value={res.url}
                  onChange={(e) => updateResource(index, { url: e.target.value })}
                  placeholder="https://..."
                />
                <select
                  className="input-field"
                  value={res.type}
                  onChange={(e) => updateResource(index, { type: e.target.value })}
                >
                  {['file', 'link', 'video', 'slides', 'lab'].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addResource}>Add Resource</Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button loading={saving} onClick={handleSave}>Save Resources</Button>
          </div>
        </div>
      )
    }

    openModal({
      title: `Room ${roomId} Resources`,
      badge: 'ROOM RESOURCES',
      description: `${moduleTitle || 'Module'} • ${roomTitle || `Room ${roomId}`}`,
      content: <RoomResourcesForm />,
      dismissible: false,
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <p className="font-mono text-accent text-xs uppercase tracking-widest mb-1">// bootcamp management</p>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Bootcamp Management</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Start bootcamps, unlock modules, and release quizzes for enrolled students.</p>
      </div>

      {loading ? (
        <Card className="p-6">
          <Skeleton className="h-4 w-40" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </Card>
      ) : bootcamps.length === 0 ? (
        <Card className="p-6 text-sm text-[var(--text-secondary)]">No bootcamps found.</Card>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {bootcamps.map((item) => (
              <button
                key={item.id}
                className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                  item.id === selectedBootcampId
                    ? 'bg-accent/10 text-accent border-accent/40'
                    : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                onClick={() => setSelectedBootcampId(item.id)}
              >
                {item.title}
              </button>
            ))}
          </div>

          <Card className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Bootcamp access</p>
                <h2 className="font-display font-semibold text-xl text-[var(--text-primary)]">Start Bootcamp</h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Bootcamp must be started before modules can be opened.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={selectedAccess.started ? 'success' : 'warning'}>
                  {selectedAccess.started ? 'Started' : 'Not Started'}
                </Badge>
                <Button
                  loading={savingAccess}
                  onClick={() => updateBootcampAccess(selectedBootcampId, (current) => ({
                    ...current,
                    started: !current.started,
                  }))}
                >
                  {selectedAccess.started ? 'Stop Bootcamp' : 'Start Bootcamp'}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Modules</p>
              {(selectedBootcamp?.modules || []).length === 0 ? (
                <p className="text-sm text-[var(--text-secondary)]">No modules configured yet.</p>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {(selectedBootcamp?.modules || []).map((module) => {
                    const moduleId = Number(module.moduleId)
                    const unlocked = selectedAccess.unlockedModules.includes(moduleId)
                    return (
                      <div key={`module-${moduleId}`} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">Module {moduleId}: {module.title || 'Untitled module'}</p>
                          <p className="text-xs text-[var(--text-muted)]">{module.description || 'Module access controls.'}</p>
                        </div>
                        <Button
                          variant={unlocked ? 'primary' : 'outline'}
                          size="sm"
                          disabled={!selectedAccess.started}
                          onClick={() => updateBootcampAccess(selectedBootcampId, (current) => {
                            const set = new Set(current.unlockedModules || [])
                            if (set.has(moduleId)) {
                              set.delete(moduleId)
                            } else {
                              set.add(moduleId)
                            }
                            return { ...current, unlockedModules: Array.from(set).sort((a, b) => a - b) }
                          })}
                        >
                          {unlocked ? 'Module Started' : 'Start Module'}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Quiz control</p>
                <h2 className="font-display font-semibold text-xl text-[var(--text-primary)]">Release Module & Room Quizzes</h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Release quizzes for all enrolled users once a module or room is ready.
                </p>
              </div>
              <Badge variant={selectedAccess.quizRelease.enabled ? 'success' : 'warning'}>
                {selectedAccess.quizRelease.enabled ? 'Release Enabled' : 'Not Released'}
              </Badge>
            </div>

            {(selectedBootcamp?.modules || []).length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)]">No modules available for quiz release.</p>
            ) : (
              <div className="space-y-4">
                {(selectedBootcamp?.modules || []).map((module) => {
                  const moduleId = Number(module.moduleId)
                  const moduleReleased = selectedAccess.quizRelease.modules.includes(moduleId)
                  return (
                    <div key={`quiz-module-${moduleId}`} className="border border-[var(--border)] rounded-lg p-4 space-y-3">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">Module {moduleId}: {module.title || 'Untitled module'}</p>
                          <p className="text-xs text-[var(--text-muted)]">Release the module quiz for all enrolled students.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {moduleReleased && <Badge variant="success">Released</Badge>}
                          <Button
                            size="sm"
                            variant={moduleReleased ? 'primary' : 'outline'}
                            onClick={() => openQuizReleaseModal({
                              scope: { type: 'module', id: String(moduleId), courseId: String(selectedBootcampId || ''), moduleId: String(moduleId) },
                              label: `Module ${moduleId}`,
                            })}
                          >
                            {moduleReleased ? 'Update Quiz' : 'Release Quiz'}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Rooms</p>
                        {(module.rooms || []).length === 0 ? (
                          <p className="text-xs text-[var(--text-muted)]">No rooms in this module.</p>
                        ) : (
                          <div className="divide-y divide-[var(--border)]">
                            {(module.rooms || []).map((room) => {
                              const roomId = Number(room.roomId)
                              const releasedRooms = Array.isArray(selectedAccess.quizRelease.rooms?.[moduleId])
                                ? selectedAccess.quizRelease.rooms[moduleId]
                                : []
                              const roomReleased = releasedRooms.includes(roomId)
                              return (
                                <div key={`quiz-room-${moduleId}-${roomId}`} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                  <div>
                                    <p className="text-sm text-[var(--text-primary)]">Room {roomId}: {room.title || 'Untitled room'}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {roomReleased && <Badge variant="success">Released</Badge>}
                                    <Button
                                      size="sm"
                                      variant={roomReleased ? 'primary' : 'outline'}
                                      onClick={() => openQuizReleaseModal({
                                        scope: {
                                          type: 'room',
                                          id: String(roomId),
                                          courseId: String(selectedBootcampId || ''),
                                          moduleId: String(moduleId),
                                        },
                                        label: `Room ${roomId}`,
                                      })}
                                    >
                                      {roomReleased ? 'Update Quiz' : 'Release Quiz'}
                                    </Button>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>

          <Card className="p-6 space-y-4">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Room content</p>
              <h2 className="font-display font-semibold text-xl text-[var(--text-primary)]">Manage Links & Resources</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Set live session URLs and downloadable resources for each room.
              </p>
            </div>

            {(selectedBootcamp?.modules || []).length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)]">No modules available for room content.</p>
            ) : (
              <div className="space-y-4">
                {(selectedBootcamp?.modules || []).map((module) => (
                  <div key={`content-module-${module.moduleId}`} className="border border-[var(--border)] rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">Module {module.moduleId}: {module.title || 'Untitled module'}</p>
                      <p className="text-xs text-[var(--text-muted)]">Room links and resources.</p>
                    </div>
                    {(module.rooms || []).length === 0 ? (
                      <p className="text-xs text-[var(--text-muted)]">No rooms in this module.</p>
                    ) : (
                      <div className="divide-y divide-[var(--border)]">
                        {(module.rooms || []).map((room) => {
                          const link = roomLinks.find((item) => Number(item.moduleId) === Number(module.moduleId) && Number(item.roomId) === Number(room.roomId))
                          const resourcesEntry = roomResources.find((item) => Number(item.moduleId) === Number(module.moduleId) && Number(item.roomId) === Number(room.roomId))
                          const resourceCount = Array.isArray(resourcesEntry?.resources) ? resourcesEntry.resources.length : 0
                          return (
                            <div key={`content-room-${module.moduleId}-${room.roomId}`} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                              <div>
                                <p className="text-sm text-[var(--text-primary)]">Room {room.roomId}: {room.title || 'Untitled room'}</p>
                                <div className="flex flex-wrap gap-2 text-xs text-[var(--text-muted)] mt-1">
                                  {link?.meetUrl ? <Badge variant="success">Link set</Badge> : <Badge variant="warning">No link</Badge>}
                                  {resourceCount > 0 ? <Badge variant="success">{resourceCount} resources</Badge> : <Badge variant="warning">No resources</Badge>}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openRoomLinkModal({
                                    moduleId: module.moduleId,
                                    roomId: room.roomId,
                                    moduleTitle: module.title || `Module ${module.moduleId}`,
                                    roomTitle: room.title || `Room ${room.roomId}`,
                                  })}
                                >
                                  {link?.meetUrl ? 'Edit Link' : 'Add Link'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openRoomResourcesModal({
                                    moduleId: module.moduleId,
                                    roomId: room.roomId,
                                    moduleTitle: module.title || `Module ${module.moduleId}`,
                                    roomTitle: room.title || `Room ${room.roomId}`,
                                  })}
                                >
                                  {resourceCount > 0 ? 'Edit Resources' : 'Add Resources'}
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Bootcamp summary</p>
                <h2 className="font-display font-semibold text-xl text-[var(--text-primary)]">Quiz Performance</h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Summary of quiz scores for this bootcamp.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                loading={summaryLoading}
                onClick={() => {
                  if (!selectedBootcampId) return
                  setSummaryLoading(true)
                  adminService.getBootcampQuizSummary(selectedBootcampId)
                    .then((res) => setQuizSummary(res.data || null))
                    .catch(() => setQuizSummary(null))
                    .finally(() => setSummaryLoading(false))
                }}
              >
                Refresh Summary
              </Button>
            </div>

            {summaryLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : !quizSummary ? (
              <p className="text-sm text-[var(--text-secondary)]">No quiz data available yet.</p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="card p-4">
                    <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Submissions</p>
                    <p className="text-lg font-semibold text-[var(--text-primary)]">{quizSummary.overall?.submissions || 0}</p>
                  </div>
                  <div className="card p-4">
                    <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Average Score</p>
                    <p className="text-lg font-semibold text-[var(--text-primary)]">
                      {Math.round(quizSummary.overall?.avgScore || 0)}%
                    </p>
                  </div>
                  <div className="card p-4">
                    <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Pass Rate</p>
                    <p className="text-lg font-semibold text-[var(--text-primary)]">
                      {Math.round((quizSummary.overall?.passRate || 0) * 100)}%
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-2">Top Students</p>
                  {(quizSummary.byUser || []).length === 0 ? (
                    <p className="text-sm text-[var(--text-secondary)]">No student submissions yet.</p>
                  ) : (
                    <div className="divide-y divide-[var(--border)]">
                      {quizSummary.byUser.slice(0, 10).map((row) => (
                        <div key={row.userId} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <p className="text-sm text-[var(--text-primary)]">{row.name}</p>
                            <p className="text-xs text-[var(--text-muted)]">{row.email}</p>
                          </div>
                          <div className="text-sm text-[var(--text-secondary)]">
                            Avg {Math.round(row.avgScore || 0)}% · Pass {Math.round((row.passRate || 0) * 100)}% · {row.submissions} submissions
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-2">Module Summary</p>
                  {(quizSummary.byModule || []).length === 0 ? (
                    <p className="text-sm text-[var(--text-secondary)]">No module quiz data yet.</p>
                  ) : (
                    <div className="divide-y divide-[var(--border)]">
                      {quizSummary.byModule.map((row) => (
                        <div key={`module-summary-${row.moduleId}`} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <p className="text-sm text-[var(--text-primary)]">Module {row.moduleId}</p>
                          <p className="text-sm text-[var(--text-secondary)]">
                            Avg {Math.round(row.avgScore || 0)}% · Pass {Math.round((row.passRate || 0) * 100)}% · {row.submissions} submissions
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-2">Room Summary</p>
                  {(quizSummary.byRoom || []).length === 0 ? (
                    <p className="text-sm text-[var(--text-secondary)]">No room quiz data yet.</p>
                  ) : (
                    <div className="divide-y divide-[var(--border)]">
                      {quizSummary.byRoom.map((row, index) => (
                        <div key={`room-summary-${row.moduleId}-${row.roomId}-${index}`} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <p className="text-sm text-[var(--text-primary)]">Module {row.moduleId} · Room {row.roomId}</p>
                          <p className="text-sm text-[var(--text-secondary)]">
                            Avg {Math.round(row.avgScore || 0)}% · Pass {Math.round((row.passRate || 0) * 100)}% · {row.submissions} submissions
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-2">Recent Submissions</p>
                  {(quizSummary.recent || []).length === 0 ? (
                    <p className="text-sm text-[var(--text-secondary)]">No recent submissions.</p>
                  ) : (
                    <div className="divide-y divide-[var(--border)]">
                      {quizSummary.recent.map((item) => (
                        <div key={item.id} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <p className="text-sm text-[var(--text-primary)]">
                              {item.user?.hackerHandle || item.user?.name || item.user?.email || 'Student'}
                            </p>
                            <p className="text-xs text-[var(--text-muted)]">
                              {item.scope?.type} {item.scope?.type === 'room' ? `Room ${item.scope?.id}` : `Module ${item.scope?.id}`}
                            </p>
                          </div>
                          <div className="text-sm text-[var(--text-secondary)]">
                            {item.score}% ({item.correct}/{item.total}) · {item.passed ? 'Passed' : 'Completed'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-[var(--text-secondary)]">Selected bootcamp</p>
                <h2 className="font-display font-semibold text-xl text-[var(--text-primary)]">{selectedBootcamp?.title || 'Bootcamp'}</h2>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="accent">
                  {selectedBootcamp?.quizAccessUserIds?.length || 0} enabled
                </Badge>
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  <ShieldCheck size={14} />
                  Legacy quiz access
                </div>
              </div>
            </div>

            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                className="input-field pl-9 py-2.5"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {filteredUsers.length === 0 ? (
              <div className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                <Users size={16} /> No users match your search.
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {filteredUsers.map((user) => {
                  const hasAccess = Array.isArray(selectedBootcamp?.quizAccessUserIds)
                    ? selectedBootcamp.quizAccessUserIds.includes(user.id)
                    : false
                  const isCurrentBootcamp = user.bootcampId && user.bootcampId === selectedBootcampId
                  return (
                    <div key={user.id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{user.hackerHandle || user.name || user.email}</p>
                        <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
                        {isCurrentBootcamp && (
                          <Badge variant="success" className="mt-2">Enrolled in this bootcamp</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={isCurrentBootcamp ? 'primary' : 'outline'}
                          size="sm"
                          loading={savingEnrollId === user.id}
                          disabled={isCurrentBootcamp}
                          onClick={() => enrollUserInBootcamp(user.id)}
                        >
                          {isCurrentBootcamp ? 'Enrolled' : 'Set Bootcamp'}
                        </Button>
                        <Button
                          variant={hasAccess ? 'primary' : 'outline'}
                          size="sm"
                          loading={savingUserId === user.id}
                          onClick={() => toggleQuizAccess(user.id)}
                        >
                          {hasAccess ? 'Quiz Enabled' : 'Enable Quiz'}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
