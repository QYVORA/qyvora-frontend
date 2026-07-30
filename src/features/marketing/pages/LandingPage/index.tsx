import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/core/contexts/AuthContext';
import { useLandingData } from '@/features/marketing/hooks/useLandingData';
import { useLocation, useNavigate } from 'react-router-dom';

import LandingHeroSection from '@/features/marketing/components/landing/LandingHeroSection';
import LandingPillarsSection from '@/features/marketing/components/landing/LandingPillarsSection';
import LandingLabsSection from '@/features/marketing/components/landing/LandingLabsSection';
import LandingCoursesSection from '@/features/marketing/components/landing/LandingCoursesSection';
import LandingBootcampSection from '@/features/marketing/components/landing/LandingBootcampSection';
import LandingTeamSection from '@/features/marketing/components/landing/LandingTeamSection';
import LandingQuiteRootSection from '@/features/marketing/components/landing/LandingQuiteRootSection';
import LandingBlogsSection from '@/features/marketing/components/landing/LandingBlogsSection';
import LandingMarketSection from '@/features/marketing/components/landing/LandingMarketSection';
import LandingLeaderboardSection from '@/features/marketing/components/landing/LandingLeaderboardSection';
import LandingServicesSection from '@/features/marketing/components/landing/LandingServicesSection';
import LandingAnansiSection from '@/features/marketing/components/landing/LandingAnansiSection';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import ActDividerSection from '@/features/marketing/components/landing/ActDividerSection';

import { Footer } from '@/shared/components/layout';
import { useAdaptiveUi } from '@/core/hooks/useAdaptiveUi';
import SEO from '@/shared/components/SEO';

const Landing: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const SECTIONS = [
    { id: 'hero',       label: t('nav.home') },
    { id: 'pillars',    label: t('landing2.platform') },
    { id: 'act-ii',     label: 'Act II' },
    { id: 'labs',       label: t('nav.labs') },
    { id: 'courses',    label: t('nav.courses') },
    { id: 'bootcamp',   label: t('nav.bootcamp') },
    { id: 'act-iii',    label: 'Act III' },
    { id: 'team',       label: 'Team' },
    { id: 'quiteroot',  label: 'QuiteRoot' },
    { id: 'anansi',     label: 'Anansi' },
    { id: 'blogs',      label: 'Blogs' },
    { id: 'market',     label: 'Market' },
    { id: 'leaderboard', label: t('nav.leaderboard') },
    { id: 'services',   label: t('nav.services') },
    { id: 'cta',        label: t('button.getStarted') },
    { id: 'footer',     label: t('landing2.footer') },
  ];

  const { stats } = useLandingData();
  const { isMobile } = useAdaptiveUi();

  const heroRef = React.useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('hero');
  const isScrollingProgrammatically = React.useRef(false);
  const lastScrollTime = React.useRef(0);

  const totalCp = stats?.stats?.cpPoolSize ?? 0;

  const isValidSection = useCallback((sectionId: string): boolean => {
    return SECTIONS.some(s => s.id === sectionId);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const hash = location.hash.replace('#', '');
    if (hash && isValidSection(hash)) {
      const timer = setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          isScrollingProgrammatically.current = true;
          element.scrollIntoView({ behavior: 'smooth' });
          setActiveSection(hash);
          setTimeout(() => {
            isScrollingProgrammatically.current = false;
          }, 1000);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.hash, isValidSection, navigate, isMobile]);

  useEffect(() => {
    if (isMobile) return;
    const handleScroll = () => {
      const now = Date.now();
      if (isScrollingProgrammatically.current || now - lastScrollTime.current < 100) return;
      lastScrollTime.current = now;
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const detectionPoint = scrollY + viewportHeight * 0.3;
      let foundSection = SECTIONS[0].id;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const section = SECTIONS[i];
        const element = document.getElementById(section.id);
        if (!element) continue;
        if (detectionPoint >= element.offsetTop) {
          foundSection = section.id;
          break;
        }
      }
      if (activeSection !== foundSection) {
        setActiveSection(foundSection);
        navigate(`#${foundSection}`, { replace: true });
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, navigate, isMobile]);

  return (
    <div className="relative w-full bg-bg snap-container no-scrollbar">
      <SEO
        title={t('landing2.seo.title')}
        description={t('landing2.seo.description')}
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'QYVORA',
          url: 'https://qyvora.netlify.app',
          description: 'Africa\'s offensive security platform — training, labs, and enterprise penetration testing.',
          sameAs: [
            'https://twitter.com/qyvora',
            'https://linkedin.com/company/qyvora',
            'https://github.com/qyvora',
          ],
        }}
      />

      {/* ── ACT I: VISION ──────────────────────────────────────────────── */}
      {/* 1. Hero */}
      <section id="hero" className="relative w-full min-h-dvh md:h-dvh snap-section bg-bg">
        <LandingHeroSection heroRef={heroRef} user={user} stats={stats} totalCp={totalCp} />
      </section>

      {/* 2. Platform */}
      <section id="pillars" className="relative w-full min-h-dvh md:h-dvh snap-section bg-bg-alt">
        <LandingPillarsSection />
      </section>

      {/* ── ACT II: THE WORK ──────────────────────────────────────────── */}
      <section id="act-ii" className="relative w-full min-h-dvh md:h-dvh snap-section bg-bg">
        <ActDividerSection
          number="II"
          title="The Work"
          tagline="ACT II"
          description="Hands-on labs, courses, and bootcamps that build real offensive security skills through practice."
        />
      </section>

      {/* 3. Labs */}
      <section id="labs" className="relative w-full min-h-dvh md:h-dvh snap-section bg-bg">
        <LandingLabsSection />
      </section>

      {/* 4. Courses */}
      <section id="courses" className="relative w-full min-h-dvh md:h-dvh snap-section bg-bg-alt">
        <LandingCoursesSection />
      </section>

      {/* 5. Bootcamp */}
      <section id="bootcamp" className="relative w-full min-h-dvh md:h-dvh snap-section bg-bg">
        <LandingBootcampSection />
      </section>

      {/* ── ACT III: THE WORLD ──────────────────────────────────────────── */}
      <section id="act-iii" className="relative w-full min-h-dvh md:h-dvh snap-section bg-bg-alt">
        <ActDividerSection
          number="III"
          title="The World"
          tagline="ACT III"
          description="Join a community of cybersecurity professionals, ethical hackers, and researchers shaping Africa's digital future."
        />
      </section>

      {/* 6. Team */}
      <section id="team" className="relative w-full min-h-dvh md:h-dvh snap-section bg-bg">
        <LandingTeamSection />
      </section>

      {/* 7. QuiteRoot */}
      <section id="quiteroot" className="relative w-full min-h-dvh md:h-dvh snap-section bg-bg-alt">
        <LandingQuiteRootSection />
      </section>

      {/* 8. Anansi */}
      <section id="anansi" className="relative w-full min-h-dvh md:h-dvh snap-section bg-bg">
        <LandingAnansiSection />
      </section>

      {/* 9. Blogs */}
      <section id="blogs" className="relative w-full min-h-dvh md:h-dvh snap-section bg-bg-alt">
        <LandingBlogsSection />
      </section>

      {/* 10. Market */}
      <section id="market" className="relative w-full min-h-dvh md:h-dvh snap-section bg-bg">
        <LandingMarketSection />
      </section>

      {/* 11. Leaderboard */}
      <section id="leaderboard" className="relative w-full min-h-dvh md:h-dvh snap-section bg-bg-alt">
        <LandingLeaderboardSection />
      </section>

      {/* 12. Services */}
      <section id="services" className="relative w-full min-h-dvh md:h-dvh snap-section bg-bg">
        <LandingServicesSection />
      </section>

      {/* 13. CTA */}
      <section id="cta" className="relative w-full min-h-dvh md:h-dvh snap-section bg-bg-alt">
        <LandingFinalCtaSection user={user} />
      </section>

      {/* 14. Footer */}
      <section id="footer" className="w-full bg-bg pt-10 md:pt-0 snap-section">
        <Footer />
      </section>
    </div>
  );
};

export default Landing;
