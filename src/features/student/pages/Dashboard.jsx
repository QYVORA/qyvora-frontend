import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/core/contexts/AuthContext'
import { useModal } from '@/core/contexts/ModalContext'
import { useToast } from '@/core/contexts/ToastContext'
import { cpService, profileService, studentService } from '@/core/services'
import { DashboardHeader } from '@/features/student/components/dashboard/DashboardHeader'
import { StatsGrid } from '@/features/student/components/dashboard/StatsGrid'
import { PhaseProgressCard } from '@/features/student/components/dashboard/PhaseProgressCard'
import { RankProgressCard } from '@/features/student/components/dashboard/RankProgressCard'
import { QuickLinks } from '@/features/student/components/dashboard/QuickLinks'
import { RecentActivity } from '@/features/student/components/dashboard/RecentActivity'
import { PhasesOverview } from '@/features/student/components/dashboard/PhasesOverview'
import { Card, Skeleton } from '@/shared/components/ui'

export default function StudentDashboard() {
  const { user: sessionUser, updateUser } = useAuth()
  const { openModal } = useModal()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [overview, setOverview] = useState(null)
  const [xpSummary, setXpSummary] = useState(null)
  const [balance, setBalance] = useState(null)
  const [activity, setActivity] = useState([])
  const [recoveryPrompted, setRecoveryPrompted] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const [profileRes, overviewRes, xpRes, balanceRes, txRes] = await Promise.all([
          profileService.getProfile(),
          studentService.getOverview(),
          studentService.getXpSummary(),
          cpService.getBalance(),
          cpService.getTransactions(6),
        ])
        if (!mounted) return
        setProfile(profileRes.data || null)
        setOverview(overviewRes.data || null)
        setXpSummary(xpRes.data || null)
        setBalance(balanceRes.data || null)
        const items = txRes.data?.items || []
        setActivity(items.map((tx) => ({
          id: tx._id || tx.id,
          label: tx.note || tx.type || 'CP activity',
          time: new Date(tx.createdAt || Date.now()).toLocaleString(),
          points: Number(tx.points || 0),
        })))
        if (profileRes.data) updateUser(profileRes.data)
      } catch {
        // ignore errors for now
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [updateUser])

  useEffect(() => {
    if (!profile || recoveryPrompted) return
    if (profile.recoveryToken && !profile.recoveryTokenAcknowledgedAt) {
      const recoveryToken = profile.recoveryToken
      setRecoveryPrompted(true)
      openModal({
        badge: 'Recovery Token',
        title: 'Save Your Recovery Token',
        description: 'Keep this token safe. You will need it to recover your account if you ever lose access.',
        confirmLabel: 'I saved it',
        onConfirm: async () => {
          try {
            await profileService.acknowledgeRecoveryToken()
            setProfile((prev) => prev ? { ...prev, recoveryTokenAcknowledgedAt: new Date().toISOString() } : prev)
          } catch {}
        },
        content: (
          <div className="space-y-4">
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-3 font-mono text-sm break-all">
              {recoveryToken}
            </div>
            <button
              type="button"
              className="btn-primary w-full justify-center py-2.5"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(recoveryToken)
                  toast({ type: 'success', title: 'Copied', message: 'Recovery token copied to clipboard.' })
                } catch {
                  toast({ type: 'error', title: 'Copy failed', message: 'Please copy the token manually.' })
                }
              }}
            >
              Copy Token
            </button>
          </div>
        ),
      })
    }
  }, [profile, recoveryPrompted, openModal, toast])

  const displayName = profile?.hackerHandle || profile?.name || profile?.email || sessionUser?.hackerHandle || sessionUser?.name
  const totalXp = xpSummary?.totalXp ?? profile?.xpSummary?.totalXp ?? 0
  const rankLabel = xpSummary?.rank || profile?.xpSummary?.rank || 'Operator'
  const currentModule = useMemo(() => {
    const learningPath = overview?.learningPath || []
    return learningPath.find((item) => item.status === 'in-progress')
      || learningPath.find((item) => item.status === 'next')
      || learningPath[0]
      || null
  }, [overview])

  const progressSnapshot = overview?.snapshot?.find((s) => s.id === 'progress')?.value || '0%'
  const progressPercent = Number(String(progressSnapshot).replace('%', '')) || 0
  const cpBalance = balance?.balance ?? profile?.cpPoints ?? 0

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-7 w-28" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-5 flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-3 w-28" />
              </div>
            </Card>
          ))}
        </div>

        <Card className="space-y-4">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-10 w-40" />
        </Card>

        <Card className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-2 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-4 flex items-center gap-4">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </Card>
            ))}
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-4 w-32 mb-3" />
            <Card className="divide-y divide-[var(--border)]">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </Card>
          </div>
        </div>

        <div>
          <Skeleton className="h-4 w-40 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="p-4 space-y-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-2 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-3 w-10" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <DashboardHeader displayName={displayName} rankLabel={rankLabel} />
      <StatsGrid currentModule={currentModule} totalXp={totalXp} cpBalance={cpBalance} overallProgress={progressPercent} />
      <PhaseProgressCard currentModule={currentModule} progressPercent={progressPercent} />
      <RankProgressCard xp={totalXp} rankLabel={rankLabel} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickLinks user={profile || sessionUser} />
        <RecentActivity items={activity} />
      </div>

      <PhasesOverview items={overview?.learningPath || []} />
    </div>
  )
}
