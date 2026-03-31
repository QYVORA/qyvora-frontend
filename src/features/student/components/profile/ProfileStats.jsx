import { Shield, Star, User, Zap } from 'lucide-react'
import { StatCard } from '@/shared/components/ui'

export function ProfileStats({ user, rankLabel, totalXp }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total XP" value={Number(totalXp || 0).toLocaleString()} icon={Zap} color="#1fbf8f" />
      <StatCard label="CP Balance" value={Number(user?.cpPoints || 0).toLocaleString()} icon={Star} color="#0EA5E9" />
      <StatCard label="Role" value={user?.role || 'student'} icon={Shield} color="#3A3F8F" />
      <StatCard label="Rank" value={rankLabel || 'Operator'} icon={User} color="#0EA5E9" />
    </div>
  )
}
