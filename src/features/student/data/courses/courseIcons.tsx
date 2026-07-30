import React from 'react';
import {
  Terminal, Network, FileCode, Globe, Search, Bug,
  Wifi, Activity, Shield, Crosshair,
} from 'lucide-react';
import BrandGithubIcon from '@/shared/components/icons/BrandGithubIcon';

type BadgeIcon = React.ComponentType<{ className?: string }>;

interface CourseIconConfig {
  icon: BadgeIcon;
  label: string;
}

const WindowsCmdIcon: BadgeIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="1.5" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="12" y1="9" x2="12" y2="20" />
    <line x1="3" y1="14.5" x2="21" y2="14.5" />
    <text x="7.5" y="13" fontSize="4.5" fill="currentColor" stroke="none" fontWeight="bold">CMD</text>
  </svg>
);

export const COURSE_ICON_MAP: Record<string, CourseIconConfig> = {
  'linux-terminal-101':   { icon: Terminal, label: '101' },
  'windows-cmd-101':      { icon: WindowsCmdIcon, label: 'CMD' },
  'networking-101':       { icon: Network, label: '101' },
  'python-for-hackers-101': { icon: FileCode, label: '101' },
  'git-github-101':       { icon: BrandGithubIcon, label: '101' },
  'web-technologies-101': { icon: Globe, label: '101' },
  'web-recon-101':        { icon: Search, label: '101' },
  'burp-suite-101':       { icon: Bug, label: '101' },
  'sql-injection-101':    { icon: Shield, label: '101' },
  'wifi-fundamentals-101': { icon: Wifi, label: '101' },
  'nmap-101':             { icon: Crosshair, label: '101' },
  'wireshark-101':        { icon: Activity, label: '101' },
};

export function getCourseIconConfig(courseId: string): CourseIconConfig | undefined {
  return COURSE_ICON_MAP[courseId];
}
