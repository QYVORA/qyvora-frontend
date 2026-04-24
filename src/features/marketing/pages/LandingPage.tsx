import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform } from 'motion/react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useLandingData } from '../hooks/useLandingData';
import HeroSection from '../components/landing/HeroSection';
import ProcessSection from '../components/landing/ProcessSection';
import BootcampsSection from '../components/landing/BootcampsSection';
import EconomySection from '../components/landing/EconomySection';
import CyberPointsCtaSection from '../components/landing/CyberPointsCtaSection';
import LeaderboardSection from '../components/landing/LeaderboardSection';
import ServicesSection from '../components/landing/ServicesSection';
import SocialSection from '../components/landing/SocialSection';
import FinalCtaSection from '../components/landing/FinalCtaSection';

const Landing: React.FC = () => {
  const { user } = useAuth();
  const { stats, bootcamps, leaderboard, marketItems } = useLandingData();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, 80]);
  const [terminalText, setTerminalText] = useState('');
  const fullText = '[ SYSTEM ONLINE ] // OFFENSIVE SECURITY | AFRICA // BOOTCAMPS + SERVICES + COMMUNITY';

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setTerminalText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) setTimeout(() => { i = 0; }, 2000);
    }, 50);
    return () => clearInterval(iv);
  }, []);

  const totalCp = leaderboard.reduce((acc, e) => acc + Number(e.totalXp || 0), 0);

  return (
    <div className="relative">
      <HeroSection
        heroRef={heroRef}
        heroY={heroY}
        heroOpacity={heroOpacity}
        terminalText={terminalText}
        user={user}
        stats={stats}
      />
      <ProcessSection stats={stats} totalCp={totalCp} />
      <BootcampsSection bootcamps={bootcamps} />
      <EconomySection totalCp={totalCp} marketItems={marketItems} />
      <CyberPointsCtaSection totalCp={totalCp} />
      <LeaderboardSection leaderboard={leaderboard} totalCp={totalCp} />
      <ServicesSection />
      <SocialSection />
      <FinalCtaSection user={user} />
    </div>
  );
};

export default Landing;
