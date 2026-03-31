import { Zap, Trophy, Wallet, Target } from 'lucide-react'
import { CP_COIN } from '@/features/marketing/data/landingData'
import { StatCard } from '@/shared/components/ui'

export function StatsGrid({ currentModule, totalXp, cpBalance, overallProgress }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Current Module"
        value={currentModule?.title || '—'}
        sub={currentModule?.status || 'pending'}
        icon={Target}
        color="#3A3F8F"
        className="h-full"
        valueClassName="text-lg leading-snug"
      />
      <StatCard label="Total XP" value={Number(totalXp || 0).toLocaleString()} sub="Experience points" icon={Zap} color="#1fbf8f" className="h-full" />
      <div className="relative overflow-hidden rounded-2xl min-h-[150px] h-full">
        <StatCard
          label="CP Balance"
          value={Number(cpBalance || 0).toLocaleString()}
          sub="Cyber Points"
          icon={Wallet}
          color="#0EA5E9"
          className="h-full"
        />
        <img
          src={CP_COIN}
          alt=""
          className="pointer-events-none absolute -right-2 -bottom-2 w-20 h-20 opacity-70 drop-shadow-xl rotate-12"
        />
      </div>
      <StatCard label="Overall Progress" value={`${overallProgress || 0}%`} sub="Bootcamp progress" icon={Trophy} color="#22C55E" className="h-full" />
    </div>
  )
}
