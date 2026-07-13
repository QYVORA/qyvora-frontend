/**
 * Icon Test Page
 * A complete visual test of all QYVORA icons
 * Add this to your router to preview icons: /test/icons
 */

import React, { useState } from 'react';
import QyvoraIcons from './QyvoraIcons';
import { NavCard } from '../ui/NavCard';

export const IconTestPage: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState(24);
  const [selectedColor, setSelectedColor] = useState('text-accent');

  const sizes = [16, 20, 24, 32, 48, 64];
  const colors = [
    { name: 'Accent', class: 'text-accent' },
    { name: 'White', class: 'text-white' },
    { name: 'Muted', class: 'text-text-muted' },
    { name: 'Red', class: 'text-red-500' },
    { name: 'Yellow', class: 'text-yellow-500' },
    { name: 'Orange', class: 'text-orange-500' },
  ];

  const iconCategories = {
    'Navigation & Dashboard': [
      { name: 'Dashboard', Component: QyvoraIcons.Dashboard },
      { name: 'Bootcamp', Component: QyvoraIcons.Bootcamp },
      { name: 'Labs', Component: QyvoraIcons.Labs },
      { name: 'CTF', Component: QyvoraIcons.CTF },
      { name: 'Challenges', Component: QyvoraIcons.Challenges },
      { name: 'Leaderboard', Component: QyvoraIcons.Leaderboard },
      { name: 'Marketplace', Component: QyvoraIcons.Marketplace },
      { name: 'Wallet', Component: QyvoraIcons.Wallet },
    ],
    'User & Account': [
      { name: 'Profile', Component: QyvoraIcons.Profile },
      { name: 'Settings', Component: QyvoraIcons.Settings },
      { name: 'Badge', Component: QyvoraIcons.Badge },
      { name: 'Rank', Component: QyvoraIcons.Rank },
      { name: 'Certificate', Component: QyvoraIcons.Certificate },
    ],
    'Security & Hacking': [
      { name: 'Shield', Component: QyvoraIcons.Shield },
      { name: 'Lock', Component: QyvoraIcons.Lock },
      { name: 'Unlock', Component: QyvoraIcons.Unlock },
      { name: 'Hack', Component: QyvoraIcons.Hack },
      { name: 'Exploit', Component: QyvoraIcons.Exploit },
      { name: 'Bug', Component: QyvoraIcons.Bug },
      { name: 'Target', Component: QyvoraIcons.Target },
    ],
    'Code & Terminal': [
      { name: 'Terminal', Component: QyvoraIcons.Terminal },
      { name: 'Code', Component: QyvoraIcons.Code },
      { name: 'Binary', Component: QyvoraIcons.Binary },
      { name: 'Network', Component: QyvoraIcons.Network },
    ],
    'Actions': [
      { name: 'Play', Component: QyvoraIcons.Play },
      { name: 'Stop', Component: QyvoraIcons.Stop },
      { name: 'Download', Component: QyvoraIcons.Download },
      { name: 'Upload', Component: QyvoraIcons.Upload },
      { name: 'Check', Component: QyvoraIcons.Check },
      { name: 'X', Component: QyvoraIcons.X },
      { name: 'Plus', Component: QyvoraIcons.Plus },
      { name: 'Minus', Component: QyvoraIcons.Minus },
    ],
    'Navigation Arrows': [
      { name: 'ArrowRight', Component: QyvoraIcons.ArrowRight },
      { name: 'ArrowLeft', Component: QyvoraIcons.ArrowLeft },
      { name: 'ChevronRight', Component: QyvoraIcons.ChevronRight },
      { name: 'Menu', Component: QyvoraIcons.Menu },
    ],
    'UI Elements': [
      { name: 'Search', Component: QyvoraIcons.Search },
      { name: 'Eye', Component: QyvoraIcons.Eye },
      { name: 'EyeOff', Component: QyvoraIcons.EyeOff },
      { name: 'Notification', Component: QyvoraIcons.Notification },
      { name: 'Info', Component: QyvoraIcons.Info },
      { name: 'Warning', Component: QyvoraIcons.Warning },
    ],
    'Engagement': [
      { name: 'Star', Component: QyvoraIcons.Star },
      { name: 'Heart', Component: QyvoraIcons.Heart },
      { name: 'Fire', Component: QyvoraIcons.Fire },
      { name: 'Clock', Component: QyvoraIcons.Clock },
    ],
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-accent">
          QYVORA Icon Library
        </h1>
        <p className="text-center text-text-secondary text-lg">
          Custom SVG icons for the QYVORA cybersecurity platform
        </p>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto mb-12 bg-bg-card border border-border rounded-2xl p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Size Selector */}
          <div>
            <label className="block text-sm font-bold mb-3 text-text-secondary">
              Icon Size: {selectedSize}px
            </label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg font-mono transition-all ${
                    selectedSize === size
                      ? 'bg-accent text-bg'
                      : 'bg-bg-elevated text-text-secondary hover:bg-bg-card'
                  }`}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-sm font-bold mb-3 text-text-secondary">
              Icon Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color.class}
                  onClick={() => setSelectedColor(color.class)}
                  className={`px-4 py-2 rounded-lg font-mono transition-all ${
                    selectedColor === color.class
                      ? 'bg-accent text-bg'
                      : 'bg-bg-elevated text-text-secondary hover:bg-bg-card'
                  }`}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Icon Grid by Category */}
      <div className="max-w-7xl mx-auto space-y-12">
        {Object.entries(iconCategories).map(([category, icons]) => (
          <section key={category}>
            <h2 className="text-2xl font-bold mb-6 text-accent border-b border-border pb-2">
              {category}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {icons.map(({ name, Component }) => (
                <div
                  key={name}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl bg-bg-card border border-border hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all"
                >
                  <Component size={selectedSize} className={selectedColor} />
                  <span className="text-xs text-text-secondary text-center font-mono">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* NavCard Examples */}
      <div className="max-w-7xl mx-auto mt-16">
        <h2 className="text-3xl font-bold mb-6 text-accent border-b border-border pb-2">
          NavCard Component Examples (TryHackMe Style)
        </h2>
        <p className="text-text-secondary mb-8">
          Large navigation cards with icon on top, label below - perfect for dashboards
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <NavCard
            icon={<QyvoraIcons.Dashboard size={64} />}
            label="Dashboard"
            description="Overview & stats"
            href="#dashboard"
            isActive
          />

          <NavCard
            icon={<QyvoraIcons.Bootcamp size={64} />}
            label="Bootcamps"
            description="Learning paths"
            href="#bootcamps"
            badge={3}
          />

          <NavCard
            icon={<QyvoraIcons.Labs size={64} />}
            label="Labs"
            description="Practice rooms"
            href="#labs"
            badge="NEW"
          />

          <NavCard
            icon={<QyvoraIcons.CTF size={64} />}
            label="CTF"
            description="Capture the Flag"
            href="#ctf"
          />

          <NavCard
            icon={<QyvoraIcons.Leaderboard size={64} />}
            label="Leaderboard"
            description="Global rankings"
            href="#leaderboard"
          />

          <NavCard
            icon={<QyvoraIcons.Marketplace size={64} />}
            label="Marketplace"
            description="Buy resources"
            href="#marketplace"
          />

          <NavCard
            icon={<QyvoraIcons.Wallet size={64} />}
            label="Wallet"
            description="CP balance"
            href="#wallet"
            badge={1250}
          />

          <NavCard
            icon={<QyvoraIcons.Challenges size={64} />}
            label="Advanced"
            description="Complete basics first"
            href="#advanced"
            locked
          />
        </div>
      </div>

      {/* Usage Examples */}
      <div className="max-w-7xl mx-auto mt-16 mb-16">
        <h2 className="text-3xl font-bold mb-6 text-accent border-b border-border pb-2">
          Common Usage Examples
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Buttons */}
          <div className="bg-bg-card border border-border rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 text-text-primary">Buttons with Icons</h3>
            <div className="space-y-3">
              <button className="btn-primary flex items-center gap-2 w-full justify-center">
                <QyvoraIcons.Play size={20} />
                Start Lab
              </button>
              <button className="btn-secondary flex items-center gap-2 w-full justify-center">
                <QyvoraIcons.Download size={20} />
                Download Certificate
              </button>
              <button className="btn-danger flex items-center gap-2 w-full justify-center">
                <QyvoraIcons.Stop size={20} />
                Stop Instance
              </button>
            </div>
          </div>

          {/* Status List */}
          <div className="bg-bg-card border border-border rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 text-text-primary">Status Indicators</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-accent">
                <QyvoraIcons.Check size={20} />
                <span>Module Completed</span>
              </li>
              <li className="flex items-center gap-3 text-yellow-500">
                <QyvoraIcons.Clock size={20} />
                <span>In Progress</span>
              </li>
              <li className="flex items-center gap-3 text-text-muted">
                <QyvoraIcons.Lock size={20} />
                <span>Locked Content</span>
              </li>
              <li className="flex items-center gap-3 text-red-500">
                <QyvoraIcons.X size={20} />
                <span>Failed Attempt</span>
              </li>
            </ul>
          </div>

          {/* Stats Display */}
          <div className="bg-bg-card border border-border rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 text-text-primary">Stats Display</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <QyvoraIcons.Wallet size={32} className="text-accent" />
                <div>
                  <div className="text-2xl font-bold text-text-primary">1,250 CP</div>
                  <div className="text-sm text-text-secondary">Current Balance</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <QyvoraIcons.Fire size={32} className="text-orange-500" />
                <div>
                  <div className="text-2xl font-bold text-text-primary">7 Days</div>
                  <div className="text-sm text-text-secondary">Login Streak</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <QyvoraIcons.Badge size={32} className="text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold text-text-primary">12 Badges</div>
                  <div className="text-sm text-text-secondary">Achievements</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="bg-bg-card border border-border rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 text-text-primary">Navigation Menu</h3>
            <nav className="space-y-2">
              <a
                href="#"
                className="flex items-center gap-3 p-3 rounded-lg bg-accent/10 text-accent border border-accent/30"
              >
                <QyvoraIcons.Dashboard size={24} />
                <span className="font-medium">Dashboard</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-bg-elevated text-text-secondary hover:text-text-primary transition-all"
              >
                <QyvoraIcons.Profile size={24} />
                <span className="font-medium">Profile</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-bg-elevated text-text-secondary hover:text-text-primary transition-all"
              >
                <QyvoraIcons.Settings size={24} />
                <span className="font-medium">Settings</span>
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto text-center text-text-muted text-sm border-t border-border pt-8">
        <p>QYVORA Custom Icon Library • {Object.values(iconCategories).flat().length} Icons Total</p>
        <p className="mt-2">Designed for hacker culture & cybersecurity aesthetics</p>
      </div>
    </div>
  );
};

export default IconTestPage;
