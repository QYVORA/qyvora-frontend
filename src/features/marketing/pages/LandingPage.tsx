import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform } from 'motion/react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useLandingData } from '../hooks/useLandingData';
import HeroSection from '../components/landing/HeroSection';
import ProcessSection from '../components/landing/ProcessSection';
import BootcampsSection from '../components/landing/BootcampsSection';
import EconomySection from '../components/landing/EconomySection';
import CyberPointsCtaSection from '../components/landing/CyberPointsCtaSection';
import ChainSection from '../components/landing/ChainSection';
import LeaderboardSection from '../components/landing/LeaderboardSection';
import ServicesSection from '../components/landing/ServicesSection';
import SocialSection from '../components/landing/SocialSection';
import FinalCtaSection from '../components/landing/FinalCtaSection';

const Landing: React.FC = () => {
  const { user } = useAuth();
  // Fix #24: destructure loading and pass it to sections
  const { stats, bootcamps, leaderboard, marketItems, loading } = useLandingData();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, 80]);
  const [terminalText, setTerminalText] = useState('');
  const fullText = '[ SYSTEM ONLINE ] // OFFENSIVE SECURITY | AFRICA // BOOTCAMPS + SERVICES + COMMUNITY';

  useEffect(() => {
    let i = 0;
    let resetting = false;
    const iv = setInterval(() => {
      if (resetting) return;
      i++;
      setTerminalText(fullText.substring(0, i));
      if (i >= fullText.length) {
        resetting = true;
        setTimeout(() => {
          i = 0;
          resetting = false;
        }, 2000);
      }
    }, 50);
    return () => clearInterval(iv);
  }, []);

  const totalCp = leaderboard.reduce((acc, e) => acc + Number(e.totalXp || 0), 0);

  return (
    <div className="relative w-full overflow-x-hidden">
      <HeroSection
        heroRef={heroRef}
        heroY={heroY}
        heroOpacity={heroOpacity}
        terminalText={terminalText}
        user={user}
        stats={stats}
      />
      <ProcessSection stats={stats} totalCp={totalCp} />
      {/* Fix #24: pass loading so sections can show consistent skeletons */}
      <BootcampsSection bootcamps={bootcamps} loading={loading} />
      <EconomySection totalCp={totalCp} marketItems={marketItems} loading={loading} />
      <ChainSection />
      <CyberPointsCtaSection totalCp={totalCp} />
      <LeaderboardSection leaderboard={leaderboard} totalCp={totalCp} loading={loading} />
      <ServicesSection />
      <SocialSection />
      <FinalCtaSection user={user} />
    </div>
  );
};

export default Landing;
