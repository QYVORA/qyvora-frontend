import { useEffect, useState } from 'react'
import { Search, Ban, Eye, Users, CheckCircle } from 'lucide-react'
import { Badge, Avatar, Button, EmptyState, Skeleton, Card } from '@/shared/components/ui'
import { resolveAvatarSeed } from '@/shared/utils/hackerMaskIdenticon'
import { useToast } from '@/core/contexts/ToastContext'
import { useModal } from '@/core/contexts/ModalContext'
import { adminService } from '@/core/services'
import { copyText } from '@/shared/utils/clipboard'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState([])
  const [cpScope, setCpScope] = useState('selected')
  const [cpAction, setCpAction] = useState('grant')
  const [cpAmount, setCpAmount] = useState('')
  const [cpReason, setCpReason] = useState('')
  const [cpLoading, setCpLoading] = useState(false)
  const { toast } = useToast()
  const { openModal } = useModal()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await adminService.getUsers()
        if (!mounted) return
        setUsers(res.data || [])
      } catch {
        setUsers([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const filtered = users.filter(u => {
    const identity = `${u.hackerHandle || ''} ${u.name || ''} ${u.email || ''}`.toLowerCase()
    const matchSearch = identity.includes(search.toLowerCase())
    const status = u.bootcampAccessRevoked ? 'revoked' : 'active'
    const matchFilter = filter === 'all' || status === filter
    return matchSearch && matchFilter
  })

  const handleBan = (user) => {
    openModal({
      title: `Revoke access for ${user.hackerHandle || user.name || user.email}?`,
      badge: 'ADMIN ACTION',
      description: `This will revoke bootcamp access for ${user.hackerHandle || user.name || user.email}.`,
      confirmLabel: 'Revoke Access',
      cancelLabel: 'Cancel',
      danger: true,
      onConfirm: () => {
        adminService.updateUser(user.id, { bootcampAccessRevoked: true })
          .then((res) => {
            setUsers(prev => prev.map(u => u.id === user.id ? res.data : u))
            toast({ type: 'warning', title: 'Access revoked', message: `${user.hackerHandle || user.name || user.email} access revoked.` })
          })
          .catch(() => toast({ type: 'error', message: 'Failed to update user.' }))
      },
      onCancel: () => {},
    })
  }

  const openUserModal = (user) => {
    const accessKey = user.bootcampAccessKey || 'Not issued'
    openModal({
      title: user.hackerHandle || user.name || user.email,
      badge: 'USER DETAILS',
      description: 'Bootcamp access key and verification status.',
      content: (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-1">Bootcamp Access Key</p>
            <div className="flex items-center gap-2">
              <code className="px-2.5 py-1 rounded-md bg-[var(--bg-secondary)] border border-[var(--border)] text-xs">
                {accessKey}
              </code>
              <Button
                size="sm"
                variant="outline"
                disabled={!user.bootcampAccessKey}
                onClick={() => {
                  if (!user.bootcampAccessKey) return
                  copyText(user.bootcampAccessKey)
                    .then((ok) => {
                      if (ok) toast({ type: 'success', message: 'Access key copied.' })
                      else toast({ type: 'error', message: 'Copy failed.' })
                    })
                }}
              >
                Copy
              </Button>
            </div>
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-1">Email Verification</p>
            <div className="flex items-center gap-2">
              <Badge variant={user.emailVerified ? 'success' : 'warning'}>
                {user.emailVerified ? 'verified' : 'unverified'}
              </Badge>
              <Button
                size="sm"
                variant={user.emailVerified ? 'outline' : 'primary'}
                icon={CheckCircle}
                onClick={() => {
                  const next = !user.emailVerified
                  adminService.updateUser(user.id, { emailVerified: next })
                    .then((res) => {
                      setUsers(prev => prev.map(u => u.id === user.id ? res.data : u))
                      toast({
                        type: 'success',
                        message: next ? 'Email marked as verified.' : 'Email marked as unverified.'
                      })
                    })
                    .catch(() => toast({ type: 'error', message: 'Failed to update verification status.' }))
                }}
              >
                {user.emailVerified ? 'Mark Unverified' : 'Mark Verified'}
              </Button>
            </div>
          </div>
        </div>
      ),
    })
  }

  const handleView = async (user) => {
    openUserModal(user)
  }

  const handleUnban = (user) => {
    adminService.updateUser(user.id, { bootcampAccessRevoked: false })
      .then((res) => {
        setUsers(prev => prev.map(u => u.id === user.id ? res.data : u))
        toast({ type: 'success', message: `${user.hackerHandle || user.name || user.email} access restored.` })
      })
      .catch(() => toast({ type: 'error', message: 'Failed to update user.' }))
  }

  const toggleSelect = (userId) => {
    setSelectedIds((prev) => (
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    ))
  }

  const toggleSelectAll = () => {
    const filteredIds = filtered.map(u => u.id)
    const allSelected = filteredIds.length > 0 && filteredIds.every(id => selectedIds.includes(id))
    setSelectedIds(allSelected ? [] : filteredIds)
  }

  const applyCpUpdate = async () => {
    const amount = Number(cpAmount)
    if (cpAction === 'set' && (Number.isNaN(amount) || amount < 0)) {
      toast({ type: 'error', message: 'Enter a valid CP value (0 or more).' })
      return
    }
    if (cpAction !== 'set' && (!amount || amount <= 0)) {
      toast({ type: 'error', message: 'Enter a CP amount greater than 0.' })
      return
    }
    if (cpScope === 'selected' && selectedIds.length === 0) {
      toast({ type: 'error', message: 'Select at least one user or switch to "All users".' })
      return
    }

    setCpLoading(true)
    try {
      if (cpAction === 'grant') {
        if (cpScope === 'all') await adminService.grantCpAll({ points: amount, reason: cpReason })
        else await adminService.grantCp({ userIds: selectedIds, points: amount, reason: cpReason })
      } else if (cpAction === 'deduct') {
        if (cpScope === 'all') await adminService.deductCpAll({ points: amount, reason: cpReason })
        else await adminService.deductCp({ userIds: selectedIds, points: amount, reason: cpReason })
      } else {
        if (cpScope === 'all') await adminService.setCpAll({ value: amount, reason: cpReason })
        else await adminService.setCp({ userIds: selectedIds, value: amount, reason: cpReason })
      }

      const res = await adminService.getUsers()
      setUsers(res.data || [])
      toast({ type: 'success', message: 'CP points updated.' })
      setCpAmount('')
      setCpReason('')
    } catch {
      toast({ type: 'error', message: 'Failed to update CP points.' })
    } finally {
      setCpLoading(false)
    }
  }

  const handleCpSubmit = () => {
    const affectedCount = cpScope === 'all'
      ? users.length
      : users.filter((user) => selectedIds.includes(user.id)).length
    const scopeLabel = cpScope === 'all' ? 'all users' : 'selected users'
    const actionLabel = cpAction === 'set' ? 'set CP' : `${cpAction} CP`
    openModal({
      title: 'Confirm bulk CP update',
      badge: 'ADMIN ACTION',
      description: `You are about to ${actionLabel} for ${scopeLabel}. This affects exactly ${affectedCount} users.`,
      confirmLabel: 'Yes, apply update',
      cancelLabel: 'Cancel',
      danger: cpAction !== 'grant',
      onConfirm: applyCpUpdate,
      onCancel: () => {},
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <p className="font-mono text-accent text-xs uppercase tracking-widest mb-1">// user management</p>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Users</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">{users.length} registered operators.</p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">CP manager</p>
            <p className="text-sm text-[var(--text-secondary)]">Grant, deduct, or set CP for selected users or everyone.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCpScope('selected')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide border transition-all ${
                cpScope === 'selected'
                  ? 'bg-accent/10 text-accent border-accent/30'
                  : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Selected ({selectedIds.length})
            </button>
            <button
              onClick={() => setCpScope('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide border transition-all ${
                cpScope === 'all'
                  ? 'bg-accent/10 text-accent border-accent/30'
                  : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              All users
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[220px_180px_1fr_auto] gap-3">
          <div className="flex items-center gap-2">
            {['grant', 'deduct', 'set'].map(action => (
              <button
                key={action}
                onClick={() => setCpAction(action)}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide border transition-all ${
                  cpAction === action
                    ? 'bg-accent/10 text-accent border-accent/30'
                    : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {action}
              </button>
            ))}
          </div>
          <input
            className="input-field py-2.5"
            type="number"
            min="0"
            placeholder={cpAction === 'set' ? 'Set to…' : 'Amount'}
            value={cpAmount}
            onChange={(e) => setCpAmount(e.target.value)}
          />
          <input
            className="input-field py-2.5"
            placeholder="Reason (optional)"
            value={cpReason}
            onChange={(e) => setCpReason(e.target.value)}
          />
          <Button onClick={handleCpSubmit} disabled={cpLoading}>
            {cpLoading ? 'Updating…' : 'Apply'}
          </Button>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          Deduct and set actions never drop a user below 0 CP.
        </p>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input className="input-field pl-9 py-2.5" placeholder="Search username or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'revoked'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all border ${f === filter ? 'bg-accent/10 text-accent border-accent/30' : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <Card className="overflow-hidden">
          <div className="divide-y divide-[var(--border)]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-6">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Users} title="No users found" description="Try adjusting your search." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                  <th className="text-left p-4 w-10">
                    <input
                      type="checkbox"
                      aria-label="Select all"
                      checked={filtered.length > 0 && filtered.every(u => selectedIds.includes(u.id))}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="text-left p-4">User</th>
                  <th className="text-left p-4">Rank / Phase</th>
                  <th className="text-left p-4">CP</th>
                  <th className="text-left p-4">Joined</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        aria-label={`Select ${u.hackerHandle || u.name || u.email}`}
                        checked={selectedIds.includes(u.id)}
                        onChange={() => toggleSelect(u.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          username={u.hackerHandle || u.name || u.email}
                          size="sm"
                          src={u.avatarUrl}
                          seed={resolveAvatarSeed({
                            id: u.id,
                            _id: u._id,
                            email: u.email,
                            hackerHandle: u.hackerHandle,
                            name: u.name,
                          })}
                        />
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">{u.hackerHandle || u.name || u.email}</p>
                          <p className="text-xs text-[var(--text-muted)]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-[var(--text-primary)]">{u.role}</p>
                      <p className="text-xs text-[var(--text-muted)]">Bootcamp {u.bootcampStatus || 'not_enrolled'}</p>
                    </td>
                    <td className="p-4 font-mono">
                      <p className="text-sm text-[var(--text-primary)]">{Number(u.cpPoints || 0).toLocaleString()} CP</p>
                      <p className="text-xs text-accent">{u.bootcampPaymentStatus || 'unpaid'}</p>
                    </td>
                    <td className="p-4 text-sm text-[var(--text-secondary)] font-mono">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                    <td className="p-4">
                      <Badge variant={u.bootcampAccessRevoked ? 'danger' : 'success'}>{u.bootcampAccessRevoked ? 'revoked' : 'active'}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" icon={Eye} onClick={() => handleView(u)}>View</Button>
                        {!u.bootcampAccessRevoked ? (
                          <Button variant="danger" size="sm" icon={Ban} onClick={() => handleBan(u)}>Revoke</Button>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => handleUnban(u)}>Restore</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
