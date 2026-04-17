import { useEffect, useState } from 'react'
import { useSEO } from '@/core/utils/useSEO'
import { HeroSection } from '@/features/marketing/components/HeroSection'
import { FlowSection } from '@/features/marketing/components/FlowSection'
import { PhasesSection } from '@/features/marketing/components/PhasesSection'
import { RoomsPreviewSection } from '@/features/marketing/components/RoomsPreviewSection'
import { MarketplaceSection } from '@/features/marketing/components/MarketplaceSection'
import { ServicesTeaser } from '@/features/marketing/components/ServicesTeaser'
import { RanksSection } from '@/features/marketing/components/RanksSection'
import { CtaSection } from '@/features/marketing/components/CtaSection'
import { SocialSection } from '@/features/marketing/components/SocialSection'
import { GallerySection } from '@/features/marketing/components/GallerySection'
import { ScrollReveal } from '@/features/marketing/components/ScrollReveal'
import { TiTi } from '@/features/marketing/components/TiTi'
import { useLandingRewards } from '@/features/marketing/hooks/useLandingRewards'
import api from '@/core/services/api'

// Removed: MarketingCarousel, VideoSection, OwaspSection, PlatformPreviewSection,
// TeamSection, BlogPreviewSection, PlaybooksTeaser — these are all accessible
// from the nav. The landing page now tells a single focused story.

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
      } catch { /* ignore */ }
      finally {
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

  useSEO({
    title: 'Offensive Security Training Platform',
    description: "Train like a hacker. Become a hacker. Phase-based bootcamps, hands-on rooms, CP economy, and real-world offensive security engagements. Africa's premier offsec platform.",
    path: '/',
  })

  return (
    <div className="relative overflow-x-hidden">

      {/* 1. Hero — full viewport, typing animation, live stats */}
      <ScrollReveal variant="fade">
        <HeroSection stats={stats} loading={loadingStats} />
      </ScrollReveal>

      {/* 2. How It Works — the pipeline story */}
      <ScrollReveal delay={60}>
        <FlowSection
          stats={stats}
          loading={loadingStats}
          leaderboard={leaderboard}
          loadingLeaderboard={loadingLeaderboard}
        />
      </ScrollReveal>

      {/* 3. Bootcamps — core product */}
      <ScrollReveal delay={80}>
        <PhasesSection items={bootcamps} loading={loadingBootcamps} rewards={rewards} />
      </ScrollReveal>

      {/* 4. Rooms — secondary product */}
      <ScrollReveal delay={100}>
        <RoomsPreviewSection items={rooms} loading={loadingRooms} />
      </ScrollReveal>

      {/* 5. Marketplace — the reward loop */}
      <ScrollReveal delay={120}>
        <MarketplaceSection items={items} stats={stats} loading={loadingItems} rewards={rewards} />
      </ScrollReveal>

      {/* 6. Ranks — community & aspiration */}
      <ScrollReveal delay={140}>
        <RanksSection leaderboard={leaderboard} loading={loadingLeaderboard} rewards={rewards} />
      </ScrollReveal>

      {/* 7. Services — B2B */}
      <ScrollReveal delay={160} variant="up">
        <ServicesTeaser />
      </ScrollReveal>

      {/* 8. Social */}
      <ScrollReveal delay={180} variant="up">
        <SocialSection />
      </ScrollReveal>

      {/* 9. CTA — final push */}
      <ScrollReveal delay={200} variant="up">
        <CtaSection />
      </ScrollReveal>

      {/* Gallery — above footer */}
      <GallerySection />

      <TiTi />
    </div>
  )
}
