import { useEffect, useState } from 'react'
import { useAuth } from '@/core/contexts/AuthContext'
import { useToast } from '@/core/contexts/ToastContext'
import { ProfileHeader } from '@/features/student/components/profile/ProfileHeader'
import { ProfileCard } from '@/features/student/components/profile/ProfileCard'
import { EditProfileForm } from '@/features/student/components/profile/EditProfileForm'
import { ProfileStats } from '@/features/student/components/profile/ProfileStats'
import { PhaseProgress } from '@/features/student/components/profile/PhaseProgress'
import { ProfileLeaderboard } from '@/features/student/components/profile/ProfileLeaderboard'
import api from '@/core/services/api'
import { profileService, studentService } from '@/core/services'
import { Button, Card, Skeleton } from '@/shared/components/ui'
import { copyText } from '@/shared/utils/clipboard'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState(null)
  const [overview, setOverview] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [form, setForm] = useState({ name: '', hackerHandle: '' })
  const [loading, setLoading] = useState(true)
  const [recoveryToken, setRecoveryToken] = useState('')
  const [showRecoveryToken, setShowRecoveryToken] = useState(false)
  const [recoveryLoading, setRecoveryLoading] = useState(false)

  const withTimeout = (promise, ms = 8000) => Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const results = await Promise.allSettled([
          withTimeout(profileService.getProfile()),
          withTimeout(studentService.getOverview()),
          withTimeout(api.get('/public/leaderboard')),
        ])
        const [profileRes, overviewRes, leaderboardRes] = results.map((r) => (r.status === 'fulfilled' ? r.value : null))
        if (!mounted) return
        setProfile(profileRes?.data || null)
        setOverview(overviewRes?.data || null)
        setLeaderboard(leaderboardRes?.data?.leaderboard || [])
        setForm({
          name: profileRes?.data?.name || '',
          hackerHandle: profileRes?.data?.hackerHandle || '',
        })
        if (profileRes?.data) {
          updateUser(profileRes.data)
          setRecoveryToken(profileRes.data?.recoveryToken || '')
        }
        if (results.some((r) => r.status === 'rejected')) {
          toast({ type: 'warning', message: 'Some profile data did not load. Refresh to try again.' })
        }
      } catch {
        toast({ type: 'error', message: 'Profile unavailable. Please refresh.' })
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [toast, updateUser])

  const rankLabel = profile?.xpSummary?.rank || 'Operator'
  const totalCp = profile?.cpPoints || 0
  const leaderboardPos = leaderboard.findIndex(e => (e.handle || e.name) === (profile?.hackerHandle || profile?.name)) + 1
  const completedRooms = profile?.learn?.completedRooms || []

  const handleSave = async () => {
    try {
      const res = await profileService.updateProfile({ name: form.name, hackerHandle: form.hackerHandle })
      setProfile(res.data)
      updateUser(res.data)
      setEditing(false)
      toast({ type: 'success', message: 'Profile updated.' })
    } catch {
      toast({ type: 'error', message: 'Update failed. Please try again.' })
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <ProfileHeader />
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-4 w-24" />)}
          </div>
          <Skeleton className="h-2 w-full" />
        </Card>
        <Card className="p-6 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full" />
        </Card>
        <Card className="p-6 space-y-3">
          <Skeleton className="h-4 w-32" />
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-3 w-full" />)}
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ProfileHeader />

      <ProfileCard
        user={profile || user}
        rankLabel={rankLabel}
        leaderboardPos={leaderboardPos}
        editing={editing}
        onToggleEdit={() => setEditing(e => !e)}
        totalCp={totalCp}
      />

      {editing && (
        <EditProfileForm form={form} onChange={setForm} onSave={handleSave} />
      )}

      {/* Recovery Token */}
      <Card className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">Recovery Token</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Save this somewhere safe — it can recover your account if you lose access.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="sm" disabled={!recoveryToken} onClick={() => setShowRecoveryToken(p => !p)}>
              {showRecoveryToken ? 'Hide' : 'Show'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!recoveryToken}
              loading={recoveryLoading}
              onClick={async () => {
                setRecoveryLoading(true)
                try {
                  const ok = await copyText(recoveryToken)
                  if (ok) {
                    try { await profileService.acknowledgeRecoveryToken() } catch { /* ignore */ }
                    toast({ type: 'success', message: 'Recovery token copied.' })
                  } else {
                    toast({ type: 'error', message: 'Copy failed — copy it manually.' })
                  }
                } finally {
                  setRecoveryLoading(false)
                }
              }}
            >
              Copy Token
            </Button>
          </div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-3 font-mono text-sm break-all select-all">
          {recoveryToken
            ? (showRecoveryToken ? recoveryToken : `${'•'.repeat(Math.min(recoveryToken.length, 32))}`)
            : 'Recovery token shown once at registration. Contact support if lost.'}
        </div>
      </Card>

      <ProfileStats user={profile || user} rankLabel={rankLabel} totalCp={totalCp} />

      <PhaseProgress items={overview?.learningPath || []} />

      {/* Completed Rooms */}
      <Card className="p-5 space-y-3">
        <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">Completed Rooms</h3>
        {completedRooms.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)]">Complete a room to see it here.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {completedRooms.map((room) => (
              <div key={room.id} className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
                <div className="w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] flex items-center justify-center overflow-hidden shrink-0">
                  {room.logoUrl
                    ? <img src={room.logoUrl} alt={room.title} className="w-full h-full object-contain" />
                    : <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)]">Room</span>}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{room.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{room.level || 'Beginner'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <ProfileLeaderboard user={profile || user} entries={leaderboard} />
    </div>
  )
}
