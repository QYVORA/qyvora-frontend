import { useEffect, useMemo, useState } from 'react'
import { Search, ShieldCheck, Users } from 'lucide-react'
import { Card, Badge, Button, Skeleton } from '@/shared/components/ui'
import { adminService } from '@/core/services'
import { useToast } from '@/core/contexts/ToastContext'

export default function AdminBootcampManagement() {
  const [bootcamps, setBootcamps] = useState([])
  const [rawContent, setRawContent] = useState(null)
  const [users, setUsers] = useState([])
  const [selectedBootcampId, setSelectedBootcampId] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [savingUserId, setSavingUserId] = useState('')
  const { toast } = useToast()

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

  const selectedBootcamp = useMemo(
    () => bootcamps.find((item) => item.id === selectedBootcampId) || null,
    [bootcamps, selectedBootcampId]
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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <p className="font-mono text-accent text-xs uppercase tracking-widest mb-1">// bootcamp management</p>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Bootcamp Management</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Manage quiz access per bootcamp without editing users individually.</p>
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
                  Quiz access
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
                      <Button
                        variant={hasAccess ? 'primary' : 'outline'}
                        size="sm"
                        loading={savingUserId === user.id}
                        onClick={() => toggleQuizAccess(user.id)}
                      >
                        {hasAccess ? 'Quiz Enabled' : 'Enable Quiz'}
                      </Button>
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
