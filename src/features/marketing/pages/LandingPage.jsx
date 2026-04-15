import { useEffect, useState } from 'react'
import { useSEO } from '@/core/utils/useSEO'
import { HeroSection } from '@/features/marketing/components/HeroSection'
import { MarketingCarousel } from '@/features/marketing/components/MarketingCarousel'
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
import { TeamSection } from '@/features/marketing/components/TeamSection'
import { BlogPreviewSection } from '@/features/marketing/components/BlogPreviewSection'
import { GallerySection } from '@/features/marketing/components/GallerySection'
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

  useSEO({
    title: 'Offensive Security Training Platform',
    description: 'Train like a hacker. Become a hacker. Phase-based bootcamps, hands-on rooms, CP economy, and real-world offensive security engagements. Africa\'s premier offsec platform.',
    path: '/',
  })

  return (
    <div className="relative overflow-x-hidden">
      <ScrollReveal variant="fade">
        <HeroSection stats={stats} loading={loadingStats} />
      </ScrollReveal>

      {/* 2. Carousel — immediate value prop for all platform areas */}
      <MarketingCarousel />

      {/* 3. How It Works — explain the system before showing products */}
      <ScrollReveal delay={80}>
        <FlowSection
          stats={stats}
          loading={loadingStats}
          leaderboard={leaderboard}
          loadingLeaderboard={loadingLeaderboard}
        />
      </ScrollReveal>

      {/* 4. Live Ticker — social proof, platform is alive */}
      <ScrollReveal delay={100}>
        <LiveTickerSection leaderboard={leaderboard} loading={loadingLeaderboard} stats={stats} />
      </ScrollReveal>

      {/* 5. Bootcamps — core product */}
      <ScrollReveal delay={120}>
        <PhasesSection items={learningPath} loading={loadingBootcamps} rewards={rewards} />
      </ScrollReveal>

      {/* 6. Rooms — secondary product */}
      <ScrollReveal delay={130}>
        <RoomsPreviewSection items={rooms} loading={loadingRooms} />
      </ScrollReveal>

      {/* 7. Marketplace — reward loop, CP spend */}
      <ScrollReveal delay={140}>
        <MarketplaceSection items={items} stats={stats} loading={loadingItems} rewards={rewards} />
      </ScrollReveal>

      {/* 8. Platform Preview — show the UI after they understand the value */}
      <ScrollReveal delay={150} variant="up">
        <PlatformPreviewSection />
      </ScrollReveal>

      {/* 9. Ranks — community aspiration, leaderboard */}
      <ScrollReveal delay={160}>
        <RanksSection leaderboard={leaderboard} loading={loadingLeaderboard} rewards={rewards} />
      </ScrollReveal>

      {/* 10. Services — B2B audience */}
      <ScrollReveal delay={170} variant="up">
        <ServicesTeaser />
      </ScrollReveal>

      {/* 11. Team — trust and credibility */}
      <ScrollReveal delay={180} variant="up">
        <TeamSection />
      </ScrollReveal>

      {/* 12. Blog — content authority */}
      <ScrollReveal delay={190} variant="up">
        <BlogPreviewSection />
      </ScrollReveal>

      {/* 13. Social — follow channels */}
      <ScrollReveal delay={200} variant="up">
        <SocialSection />
      </ScrollReveal>

      {/* 14. CTA — final conversion push after full page consumption */}
      <ScrollReveal delay={210} variant="up">
        <CtaSection />
      </ScrollReveal>

      {/* 15. Gallery — community moments, above footer */}
      <GallerySection />
    </div>
  )
}
