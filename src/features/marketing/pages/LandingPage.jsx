import { useEffect, useState } from 'react'
import { HeroSection } from '@/features/marketing/components/HeroSection'
import { PlatformPreviewSection } from '@/features/marketing/components/PlatformPreviewSection'
import { FlowSection } from '@/features/marketing/components/FlowSection'
import { LiveTickerSection } from '@/features/marketing/components/LiveTickerSection'
import { PhasesSection } from '@/features/marketing/components/PhasesSection'
import { RoomsPreviewSection } from '@/features/marketing/components/RoomsPreviewSection'
import { MarketplaceSection } from '@/features/marketing/components/MarketplaceSection'
import { RanksSection } from '@/features/marketing/components/RanksSection'
import { CtaSection } from '@/features/marketing/components/CtaSection'
import { SocialSection } from '@/features/marketing/components/SocialSection'
import { ServicesTeaser } from '@/features/marketing/components/ServicesTeaser'
import { ScrollReveal } from '@/features/marketing/components/ScrollReveal'
import { useLandingRewards } from '@/features/marketing/hooks/useLandingRewards'
import api from '@/core/services/api'

export default function LandingPage() {
  const [stats, setStats] = useState(null)
  const [items, setItems] = useState([])
  const [bootcamps, setBootcamps] = useState([])
  const [rooms, setRooms] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingItems, setLoadingItems] = useState(true)
  const [loadingBootcamps, setLoadingBootcamps] = useState(true)
  const [loadingRooms, setLoadingRooms] = useState(true)
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true)
  const rewards = useLandingRewards()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoadingStats(true)
      setLoadingItems(true)
      setLoadingBootcamps(true)
      setLoadingRooms(true)
      setLoadingLeaderboard(true)
      try {
        const [statsRes, itemsRes, bootcampsRes, roomsRes, leaderboardRes] = await Promise.all([
          api.get('/public/landing-stats'),
          api.get('/public/cp-products'),
          api.get('/public/bootcamps'),
          api.get('/public/rooms'),
          api.get('/public/leaderboard'),
        ])
        if (!mounted) return
        setStats(statsRes.data || null)
        setItems(itemsRes.data?.items || [])
        setBootcamps(bootcampsRes.data?.items || [])
        setRooms(roomsRes.data?.items || [])
        setLeaderboard(leaderboardRes.data?.leaderboard || [])
        setLoadingStats(false)
        setLoadingItems(false)
        setLoadingBootcamps(false)
        setLoadingRooms(false)
        setLoadingLeaderboard(false)
      } catch {
        // ignore public fetch errors
        if (!mounted) return
        setLoadingStats(false)
        setLoadingItems(false)
        setLoadingBootcamps(false)
        setLoadingRooms(false)
        setLoadingLeaderboard(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const learningPath = bootcamps

  return (
    <div className="relative overflow-x-hidden">
      <ScrollReveal variant="fade">
        <HeroSection stats={stats} loading={loadingStats} />
      </ScrollReveal>

      {/* Platform preview — 3D phone mockup, immediately after hero */}
      <ScrollReveal delay={60} variant="up">
        <PlatformPreviewSection />
      </ScrollReveal>

      {/* How It Works — pipeline steps + live stats */}
      <ScrollReveal delay={80}>
        <FlowSection
          stats={stats}
          loading={loadingStats}
          leaderboard={leaderboard}
          loadingLeaderboard={loadingLeaderboard}
        />
      </ScrollReveal>

      {/* Live economy ticker */}
      <ScrollReveal delay={120}>
        <LiveTickerSection leaderboard={leaderboard} loading={loadingLeaderboard} stats={stats} />
      </ScrollReveal>

      <ScrollReveal delay={140}>
        <PhasesSection items={learningPath} loading={loadingBootcamps} rewards={rewards} />
      </ScrollReveal>

      <ScrollReveal delay={150}>
        <RoomsPreviewSection items={rooms} loading={loadingRooms} />
      </ScrollReveal>

      <ScrollReveal delay={160}>
        <MarketplaceSection items={items} stats={stats} loading={loadingItems} rewards={rewards} />
      </ScrollReveal>

      <ScrollReveal delay={180}>
        <RanksSection leaderboard={leaderboard} loading={loadingLeaderboard} rewards={rewards} />
      </ScrollReveal>

      {/* CTA before Social — higher intent action comes first */}
      <ScrollReveal delay={200} variant="up">
        <CtaSection />
      </ScrollReveal>

      <ScrollReveal delay={210} variant="up">
        <ServicesTeaser />
      </ScrollReveal>

      <ScrollReveal delay={220} variant="up">
        <SocialSection />
      </ScrollReveal>
    </div>
  )
}
