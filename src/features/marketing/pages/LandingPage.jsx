import { useEffect, useState } from 'react'
import { HeroSection } from '@/features/marketing/components/HeroSection'
import { FlowSection } from '@/features/marketing/components/FlowSection'
import { PhasesSection } from '@/features/marketing/components/PhasesSection'
import { MarketplaceSection } from '@/features/marketing/components/MarketplaceSection'
import { RanksSection } from '@/features/marketing/components/RanksSection'
import { CtaSection } from '@/features/marketing/components/CtaSection'
import { SocialSection } from '@/features/marketing/components/SocialSection'
import api from '@/core/services/api'
import { studentService } from '@/core/services'
import { useAuth } from '@/core/contexts/AuthContext'

export default function LandingPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [items, setItems] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [learningPath, setLearningPath] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingItems, setLoadingItems] = useState(true)
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true)
  const [loadingLearningPath, setLoadingLearningPath] = useState(false)

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

  useEffect(() => {
    let mounted = true
    const loadLearningPath = async () => {
      if (!user) {
        setLearningPath([])
        setLoadingLearningPath(false)
        return
      }
      setLoadingLearningPath(true)
      try {
        const res = await studentService.getOverview()
        if (!mounted) return
        setLearningPath(res.data?.learningPath || [])
        setLoadingLearningPath(false)
      } catch {
        setLearningPath([])
        setLoadingLearningPath(false)
      }
    }
    loadLearningPath()
    return () => { mounted = false }
  }, [user])

  return (
    <div className="relative overflow-x-hidden">
      <HeroSection stats={stats} loading={loadingStats} />
      <FlowSection stats={stats} loading={loadingStats} />
      <PhasesSection items={learningPath} isAuthenticated={!!user} loading={loadingLearningPath} />
      <MarketplaceSection items={items} stats={stats} loading={loadingItems} />
      <RanksSection leaderboard={leaderboard} loading={loadingLeaderboard} />
      <SocialSection />
      <CtaSection />
    </div>
  )
}
