import { Shield, Star, User, Zap } from 'lucide-react'
import { StatCard } from '@/shared/components/ui'

export function ProfileStats({ user, rankLabel, totalXp }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total XP" value={Number(totalXp || 0).toLocaleString()} icon={Zap} color="var(--accent)" />
      <StatCard label="CP Balance" value={Number(user?.cpPoints || 0).toLocaleString()} icon={Star} color="var(--accent)" />
      <StatCard label="Role" value={user?.role || 'student'} icon={Shield} color="var(--accent)" />
      <StatCard label="Rank" value={rankLabel || 'Operator'} icon={User} color="var(--accent)" />
    </div>
  )
}
