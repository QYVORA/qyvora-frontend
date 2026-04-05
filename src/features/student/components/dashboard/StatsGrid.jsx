import { Zap, Trophy, Wallet, Target } from 'lucide-react'
import { CP_COIN } from '@/features/marketing/data/landingData'
import { StatCard } from '@/shared/components/ui'

export function StatsGrid({ currentModule, totalXp, cpBalance, overallProgress, showCurrentModule = true }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-tour="stats-grid">
      {showCurrentModule && (
        <StatCard
          label="Current Module"
          value={currentModule?.title || '—'}
          sub={currentModule?.status || 'pending'}
          icon={Target}
          color="#1fbf8f"
          className="h-full"
          valueClassName="text-lg leading-snug"
        />
      )}
      <StatCard label="Total XP" value={Number(totalXp || 0).toLocaleString()} sub="Experience points" icon={Zap} color="#1fbf8f" className="h-full" />
      <div className="relative overflow-hidden rounded-2xl min-h-[150px] h-full" data-tour="cp-balance">
        <StatCard
          label="CP Balance"
          value={Number(cpBalance || 0).toLocaleString()}
          sub="Captured Points"
          icon={Wallet}
          color="#1fbf8f"
          className="h-full"
        />
        <img
          src={CP_COIN}
          alt=""
          className="pointer-events-none absolute -right-2 -bottom-2 w-20 h-20 opacity-70 drop-shadow-xl rotate-12"
        />
      </div>
      <StatCard label="Overall Progress" value={`${overallProgress || 0}%`} sub="Bootcamp progress" icon={Trophy} color="#1fbf8f" className="h-full" />
    </div>
  )
}
