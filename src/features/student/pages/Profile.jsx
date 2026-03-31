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

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState(null)
  const [overview, setOverview] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [form, setForm] = useState({ name: '', hackerHandle: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const [profileRes, overviewRes, leaderboardRes] = await Promise.all([
          profileService.getProfile(),
          studentService.getOverview(),
          api.get('/public/leaderboard'),
        ])
        if (!mounted) return
        setProfile(profileRes.data || null)
        setOverview(overviewRes.data || null)
        setLeaderboard(leaderboardRes.data?.leaderboard || [])
        setForm({
          name: profileRes.data?.name || '',
          hackerHandle: profileRes.data?.hackerHandle || '',
        })
        updateUser(profileRes.data || {})
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [updateUser])

  const rankLabel = profile?.xpSummary?.rank || 'Operator'
  const totalXp = profile?.xpSummary?.totalXp || 0
  const leaderboardPos = leaderboard.findIndex(e => (e.handle || e.name) === (profile?.hackerHandle || profile?.name)) + 1

  const handleSave = async () => {
    try {
      const res = await profileService.updateProfile({
        name: form.name,
        hackerHandle: form.hackerHandle,
      })
      setProfile(res.data)
      updateUser(res.data)
      setEditing(false)
      toast({ type: 'success', title: 'Profile updated', message: 'Your changes have been saved.' })
    } catch {
      toast({ type: 'error', title: 'Update failed', message: 'Please try again.' })
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ProfileHeader />

      {loading ? (
        <Card className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-24" />
            ))}
          </div>
          <Skeleton className="h-2 w-full" />
        </Card>
      ) : (
        <ProfileCard
          user={profile || user}
          rankLabel={rankLabel}
          leaderboardPos={leaderboardPos}
          editing={editing}
          onToggleEdit={() => setEditing(e => !e)}
          totalXp={totalXp}
        />
      )}

      <Card className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">Recovery Token</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Save this token somewhere safe. It can recover your account if you lose access.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const token = profile?.recoveryToken
              if (!token) {
                toast({ type: 'error', title: 'Token unavailable', message: 'Reload the page and try again.' })
                return
              }
              try {
                await navigator.clipboard.writeText(token)
                toast({ type: 'success', title: 'Copied', message: 'Recovery token copied to clipboard.' })
              } catch {
                toast({ type: 'error', title: 'Copy failed', message: 'Please copy the token manually.' })
              }
            }}
          >
            Copy Token
          </Button>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-3 font-mono text-sm break-all">
          {loading ? <Skeleton className="h-4 w-full" /> : (profile?.recoveryToken || '—')}
        </div>
      </Card>

      {editing && (
        <EditProfileForm
          form={form}
          onChange={setForm}
          onSave={handleSave}
        />
      )}

      {loading ? (
        <Card className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </Card>
      ) : (
        <ProfileStats user={profile || user} rankLabel={rankLabel} totalXp={totalXp} />
      )}
      {loading ? (
        <Card className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
        </Card>
      ) : (
        <PhaseProgress items={overview?.learningPath || []} />
      )}
      {loading ? (
        <Card className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
        </Card>
      ) : (
        <ProfileLeaderboard user={profile || user} entries={leaderboard} />
      )}
    </div>
  )
}
