import { useEffect, useState } from 'react'
import { HeroSection } from '@/features/marketing/components/HeroSection'
import { FlowSection } from '@/features/marketing/components/FlowSection'
import { LiveTickerSection } from '@/features/marketing/components/LiveTickerSection'
import { BootcampPreviewSection } from '@/features/marketing/components/BootcampPreviewSection'
import { PhasesSection } from '@/features/marketing/components/PhasesSection'
import { MarketplaceSection } from '@/features/marketing/components/MarketplaceSection'
import { RanksSection } from '@/features/marketing/components/RanksSection'
import { CtaSection } from '@/features/marketing/components/CtaSection'
import { SocialSection } from '@/features/marketing/components/SocialSection'
import { useLandingRewards } from '@/features/marketing/hooks/useLandingRewards'
import api from '@/core/services/api'

export default function LandingPage() {
  const [stats, setStats] = useState(null)
  const [items, setItems] = useState([])
  const [bootcamps, setBootcamps] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingItems, setLoadingItems] = useState(true)
  const [loadingBootcamps, setLoadingBootcamps] = useState(true)
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true)
  const rewards = useLandingRewards()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoadingStats(true)
      setLoadingItems(true)
      setLoadingBootcamps(true)
      setLoadingLeaderboard(true)
      try {
        const [statsRes, itemsRes, bootcampsRes, leaderboardRes] = await Promise.all([
          api.get('/public/landing-stats'),
          api.get('/public/cp-products'),
          api.get('/public/bootcamps'),
          api.get('/public/leaderboard'),
        ])
        if (!mounted) return
        setStats(statsRes.data || null)
        setItems(itemsRes.data?.items || [])
        setBootcamps(bootcampsRes.data?.items || [])
        setLeaderboard(leaderboardRes.data?.leaderboard || [])
        setLoadingStats(false)
        setLoadingItems(false)
        setLoadingBootcamps(false)
        setLoadingLeaderboard(false)
      } catch {
        // ignore public fetch errors
        if (!mounted) return
        setLoadingStats(false)
        setLoadingItems(false)
        setLoadingBootcamps(false)
        setLoadingLeaderboard(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const learningPath = bootcamps

  return (
    <div className="relative overflow-x-hidden">
      <HeroSection
        stats={stats}
        loading={loadingStats}
      />
      <FlowSection stats={stats} loading={loadingStats} />
      <LiveTickerSection leaderboard={leaderboard} loading={loadingLeaderboard} />
      <BootcampPreviewSection rewards={rewards} />
      <PhasesSection items={learningPath} loading={loadingBootcamps} rewards={rewards} />
      <MarketplaceSection items={items} stats={stats} loading={loadingItems} rewards={rewards} />
      <RanksSection leaderboard={leaderboard} loading={loadingLeaderboard} rewards={rewards} />
      <SocialSection />
      <CtaSection />
    </div>
  )
}
