/**
 * Icon Showcase Example
 * Demonstrates how to use QYVORA custom icons in your components
 */

import React from 'react';
import QyvoraIcons, {
  IconDashboard,
  IconBootcamp,
  IconLabs,
  IconCTF,
  IconLeaderboard,
  IconMarketplace,
  IconWallet,
  IconProfile,
  IconSettings,
} from './QyvoraIcons';
import { NavCard } from '../ui/NavCard';

/**
 * EXAMPLE 1: Student Dashboard Navigation Grid
 * TryHackMe-style layout with icon on top, label below
 */
export const StudentDashboardNav: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 p-4">
      <NavCard
        icon={<IconDashboard size={64} />}
        label="Dashboard"
        description="Overview & progress"
        href="/student/dashboard"
        isActive
      />

      <NavCard
        icon={<IconBootcamp size={64} />}
        label="Bootcamps"
        description="Learning paths"
        href="/student/bootcamps"
        badge={3}
      />

      <NavCard
        icon={<IconLabs size={64} />}
        label="Labs"
        description="Practice environments"
        href="/student/labs"
      />

      <NavCard
        icon={<IconCTF size={64} />}
        label="CTF Challenges"
        description="Capture the Flag"
        href="/student/ctf"
        badge="NEW"
      />

      <NavCard
        icon={<IconLeaderboard size={64} />}
        label="Leaderboard"
        description="Global rankings"
        href="/student/leaderboard"
      />

      <NavCard
        icon={<IconMarketplace size={64} />}
        label="Marketplace"
        description="Buy resources"
        href="/student/marketplace"
      />

      <NavCard
        icon={<IconWallet size={64} />}
        label="Wallet"
        description="CP Balance & history"
        href="/student/wallet"
        badge={1250}
      />

      <NavCard
        icon={<IconProfile size={64} />}
        label="Profile"
        description="Your account"
        href="/student/profile"
      />

      <NavCard
        icon={<IconSettings size={64} />}
        label="Settings"
        description="Preferences"
        href="/student/settings"
      />
    </div>
  );
};

/**
 * EXAMPLE 2: Using icons inline with text
 */
export const InlineIconExample: React.FC = () => {
  return (
    <div className="space-y-4 p-4">
      {/* Button with icon */}
      <button className="btn-primary flex items-center gap-2">
        <IconBootcamp size={20} />
        Start Bootcamp
      </button>

      {/* Stats with icons */}
      <div className="flex items-center gap-3 text-text-primary">
        <IconWallet size={24} className="text-accent" />
        <span className="text-xl font-bold">1,250 CP</span>
      </div>

      {/* List with icons */}
      <ul className="space-y-2">
        <li className="flex items-center gap-2 text-text-secondary">
          <QyvoraIcons.Check size={18} className="text-accent" />
          Completed: Web Exploitation
        </li>
        <li className="flex items-center gap-2 text-text-secondary">
          <QyvoraIcons.Clock size={18} className="text-yellow-500" />
          In Progress: Network Security
        </li>
        <li className="flex items-center gap-2 text-text-secondary">
          <QyvoraIcons.Lock size={18} className="text-text-muted" />
          Locked: Advanced Cryptography
        </li>
      </ul>
    </div>
  );
};

/**
 * EXAMPLE 3: All icons showcase grid
 */
export const AllIconsShowcase: React.FC = () => {
  const iconList = [
    { name: 'Dashboard', Component: QyvoraIcons.Dashboard },
    { name: 'Bootcamp', Component: QyvoraIcons.Bootcamp },
    { name: 'Labs', Component: QyvoraIcons.Labs },
    { name: 'CTF', Component: QyvoraIcons.CTF },
    { name: 'Challenges', Component: QyvoraIcons.Challenges },
    { name: 'Leaderboard', Component: QyvoraIcons.Leaderboard },
    { name: 'Marketplace', Component: QyvoraIcons.Marketplace },
    { name: 'Wallet', Component: QyvoraIcons.Wallet },
    { name: 'Profile', Component: QyvoraIcons.Profile },
    { name: 'Settings', Component: QyvoraIcons.Settings },
    { name: 'Lock', Component: QyvoraIcons.Lock },
    { name: 'Unlock', Component: QyvoraIcons.Unlock },
    { name: 'Terminal', Component: QyvoraIcons.Terminal },
    { name: 'Shield', Component: QyvoraIcons.Shield },
    { name: 'Badge', Component: QyvoraIcons.Badge },
    { name: 'Code', Component: QyvoraIcons.Code },
    { name: 'Hack', Component: QyvoraIcons.Hack },
    { name: 'Network', Component: QyvoraIcons.Network },
    { name: 'Target', Component: QyvoraIcons.Target },
    { name: 'Binary', Component: QyvoraIcons.Binary },
    { name: 'Exploit', Component: QyvoraIcons.Exploit },
    { name: 'Bug', Component: QyvoraIcons.Bug },
    { name: 'Certificate', Component: QyvoraIcons.Certificate },
    { name: 'Clock', Component: QyvoraIcons.Clock },
    { name: 'Rank', Component: QyvoraIcons.Rank },
    { name: 'Fire', Component: QyvoraIcons.Fire },
    { name: 'Notification', Component: QyvoraIcons.Notification },
    { name: 'Search', Component: QyvoraIcons.Search },
    { name: 'Star', Component: QyvoraIcons.Star },
    { name: 'Heart', Component: QyvoraIcons.Heart },
    { name: 'Download', Component: QyvoraIcons.Download },
    { name: 'Upload', Component: QyvoraIcons.Upload },
    { name: 'Play', Component: QyvoraIcons.Play },
    { name: 'Stop', Component: QyvoraIcons.Stop },
    { name: 'Check', Component: QyvoraIcons.Check },
    { name: 'X', Component: QyvoraIcons.X },
    { name: 'Plus', Component: QyvoraIcons.Plus },
    { name: 'Minus', Component: QyvoraIcons.Minus },
    { name: 'ArrowRight', Component: QyvoraIcons.ArrowRight },
    { name: 'ArrowLeft', Component: QyvoraIcons.ArrowLeft },
    { name: 'ChevronRight', Component: QyvoraIcons.ChevronRight },
    { name: 'Menu', Component: QyvoraIcons.Menu },
    { name: 'Eye', Component: QyvoraIcons.Eye },
    { name: 'EyeOff', Component: QyvoraIcons.EyeOff },
    { name: 'Info', Component: QyvoraIcons.Info },
    { name: 'Warning', Component: QyvoraIcons.Warning },
  ];

  return (
    <div className="p-8 bg-bg min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-accent">
        QYVORA Icon Library
      </h1>
      
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-6">
        {iconList.map(({ name, Component }) => (
          <div
            key={name}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-bg-card border border-border hover:border-accent/50 transition-all"
          >
            <Component size={32} className="text-accent" />
            <span className="text-xs text-text-secondary text-center">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllIconsShowcase;
