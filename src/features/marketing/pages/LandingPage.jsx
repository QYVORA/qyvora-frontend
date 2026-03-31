import { useEffect, useState } from 'react'
import { HeroSection } from '@/features/marketing/components/HeroSection'
import { FlowSection } from '@/features/marketing/components/FlowSection'
import { PhasesSection } from '@/features/marketing/components/PhasesSection'
import { MarketplaceSection } from '@/features/marketing/components/MarketplaceSection'
import { RanksSection } from '@/features/marketing/components/RanksSection'
import { CtaSection } from '@/features/marketing/components/CtaSection'
import { SocialSection } from '@/features/marketing/components/SocialSection'
import api from '@/core/services/api'
import { PHASE_PREVIEW } from '@/features/marketing/data/landingData'

export default function LandingPage() {
  const [stats, setStats] = useState(null)
  const [items, setItems] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingItems, setLoadingItems] = useState(true)
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoadingStats(true)
      setLoadingItems(true)
      setLoadingLeaderboard(true)
      try {
        const [statsRes, itemsRes, leaderboardRes] = await Promise.all([
          api.get('/public/landing-stats'),
          api.get('/public/cp-products'),
          api.get('/public/leaderboard'),
        ])
        if (!mounted) return
        setStats(statsRes.data || null)
        setItems(itemsRes.data?.items || [])
        setLeaderboard(leaderboardRes.data?.leaderboard || [])
        setLoadingStats(false)
        setLoadingItems(false)
        setLoadingLeaderboard(false)
      } catch {
        // ignore public fetch errors
        if (!mounted) return
        setLoadingStats(false)
        setLoadingItems(false)
        setLoadingLeaderboard(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const learningPath = PHASE_PREVIEW

  return (
    <div className="relative overflow-x-hidden">
      <HeroSection stats={stats} loading={loadingStats} />
      <FlowSection stats={stats} loading={loadingStats} />
      <PhasesSection items={learningPath} loading={false} />
      <MarketplaceSection items={items} stats={stats} loading={loadingItems} />
      <RanksSection leaderboard={leaderboard} loading={loadingLeaderboard} />
      <SocialSection />
      <CtaSection />
    </div>
  )
}
